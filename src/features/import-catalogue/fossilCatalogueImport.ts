import { normalizeCsvDecimal, parseDelimitedText } from "./csvFormat";
import {
  FOSSIL_CATALOGUE_TEMPLATE_VERSION,
  fossilSpecimenColumns,
  perRecordContextColumns,
} from "./fossilCatalogueTemplate";
import type { CatalogueContextMode } from "./catalogueImportTypes";

export const MAX_CATALOGUE_CSV_BYTES = 5 * 1024 * 1024;

export type FossilTemplateInspectionRow = {
  rowNumber: number;
  catalogueNumber: string;
  identification: string;
  anatomicalElement: string;
  provenance: string;
  collectedBy: string;
  country: string;
  province: string;
  municipality: string;
  siteName: string;
  collectionDateFrom: string;
  collectionDateTo: string;
  collectingContextNotes: string;
  formation: string;
  member: string;
  geologicalAge: string;
  ageMinMa: string;
  ageMaxMa: string;
  measurementStatus: string;
  lengthCm: string;
  widthCm: string;
  heightCm: string;
  weightG: string;
  preparation: string;
  specimenNotes: string;
  errors: string[];
  warnings: string[];
};

export type FossilTemplateInspection = {
  collectionName: string;
  contextMode: CatalogueContextMode | null;
  specimenRowCount: number;
  rows: FossilTemplateInspectionRow[];
  errors: string[];
  warnings: string[];
};

const recognisedProvenanceValues = new Set([
  "self-found",
  "known-collector",
  "inherited",
  "documented-collection",
  "uncertain",
]);

const recognisedMeasurementStatusValues = new Set(["measured", "estimated", "not-measured"]);

function normalizeKey(value: string) {
  return value
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase();
}

function normalizeChoice(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
}

function valueAt(cells: string[], indexes: Map<string, number>, column: string) {
  const index = indexes.get(column);

  return index === undefined ? "" : (cells[index] ?? "").trim();
}

/*
 * A shared-context template stores common values in metadata rows.
 * A specimen-row value wins whenever it is present, allowing a row to
 * override shared formation, geological-age or locality defaults.
 */
function resolvedValueAt(
  cells: string[],
  indexes: Map<string, number>,
  metadata: Map<string, string>,
  contextMode: CatalogueContextMode | null,
  column: string,
) {
  const rowValue = valueAt(cells, indexes, column);

  if (rowValue || contextMode !== "shared") {
    return rowValue;
  }

  return (metadata.get(`shared_${column}`) ?? "").trim();
}

function createReviewRow(
  rowNumber: number,
  cells: string[],
  indexes: Map<string, number>,
  metadata: Map<string, string>,
  contextMode: CatalogueContextMode | null,
): FossilTemplateInspectionRow {
  const catalogueNumber = valueAt(cells, indexes, "catalogue_number");

  const identification = valueAt(cells, indexes, "identification");

  const anatomicalElement = valueAt(cells, indexes, "anatomical_element");

  const provenance = resolvedValueAt(cells, indexes, metadata, contextMode, "provenance");

  const collectedBy = resolvedValueAt(cells, indexes, metadata, contextMode, "collected_by");

  const country = resolvedValueAt(cells, indexes, metadata, contextMode, "country");

  const province = resolvedValueAt(cells, indexes, metadata, contextMode, "province");

  const municipality = resolvedValueAt(cells, indexes, metadata, contextMode, "municipality");

  const siteName = resolvedValueAt(cells, indexes, metadata, contextMode, "site_name");

  const collectionDateFrom = resolvedValueAt(cells, indexes, metadata, contextMode, "collection_date_from");

  const collectionDateTo = resolvedValueAt(cells, indexes, metadata, contextMode, "collection_date_to");

  const collectingContextNotes = resolvedValueAt(cells, indexes, metadata, contextMode, "collecting_context_notes");

  const formation = resolvedValueAt(cells, indexes, metadata, contextMode, "formation");

  const member = resolvedValueAt(cells, indexes, metadata, contextMode, "member");

  const geologicalAge = resolvedValueAt(cells, indexes, metadata, contextMode, "geological_age");

  const ageMinMa = resolvedValueAt(cells, indexes, metadata, contextMode, "age_min_ma");

  const ageMaxMa = resolvedValueAt(cells, indexes, metadata, contextMode, "age_max_ma");

  const measurementStatus = valueAt(cells, indexes, "measurement_status");

  const lengthCm = valueAt(cells, indexes, "length_cm");

  const widthCm = valueAt(cells, indexes, "width_cm");

  const heightCm = valueAt(cells, indexes, "height_cm");

  const weightG = valueAt(cells, indexes, "weight_g");

  const preparation = valueAt(cells, indexes, "preparation");

  const specimenNotes = valueAt(cells, indexes, "specimen_notes");

  const errors: string[] = [];

  const warnings: string[] = [];

  if (!catalogueNumber) {
    errors.push("Catalogue number is required.");
  }

  if (catalogueNumber.length > 80) {
    errors.push("Catalogue number must be 80 characters or fewer.");
  }

  if (!identification) {
    warnings.push("Identification is blank.");
  }

  if (!anatomicalElement) {
    warnings.push("Anatomical element is blank.");
  }

  if (provenance && !recognisedProvenanceValues.has(normalizeChoice(provenance))) {
    warnings.push("Provenance is not recognised and will need review after import.");
  }

  if (measurementStatus && !recognisedMeasurementStatusValues.has(normalizeChoice(measurementStatus))) {
    warnings.push("Measurement status is not recognised and will need review after import.");
  }

  const numericValues = [
    ["Youngest age", ageMinMa],
    ["Oldest age", ageMaxMa],
  ] as const;

  numericValues.forEach(([label, value]) => {
    if (!value) {
      return;
    }

    const normalizedValue = normalizeCsvDecimal(value);

    if (!normalizedValue || Number(normalizedValue) < 0) {
      errors.push(`${label} must be a valid positive number or zero.`);
    }
  });

  if (
    ageMinMa &&
    ageMaxMa &&
    normalizeCsvDecimal(ageMinMa) &&
    normalizeCsvDecimal(ageMaxMa) &&
    Number(normalizeCsvDecimal(ageMinMa)) > Number(normalizeCsvDecimal(ageMaxMa))
  ) {
    errors.push("The youngest age cannot be older than the oldest age.");
  }

  return {
    rowNumber,
    catalogueNumber,
    identification,
    anatomicalElement,
    provenance,
    collectedBy,
    country,
    province,
    municipality,
    siteName,
    collectionDateFrom,
    collectionDateTo,
    collectingContextNotes,
    formation,
    member,
    geologicalAge,
    ageMinMa,
    ageMaxMa,
    measurementStatus,
    lengthCm,
    widthCm,
    heightCm,
    weightG,
    preparation,
    specimenNotes,
    errors,
    warnings,
  };
}

export function inspectFossilCatalogueTemplate(text: string): FossilTemplateInspection {
  const parsed = parseDelimitedText(text);

  const errors = [...parsed.errors];

  const warnings: string[] = [];

  const headerRowIndex = parsed.rows.findIndex((row) =>
    row.some((value) => normalizeKey(value) === "catalogue_number"),
  );

  if (headerRowIndex < 0) {
    return {
      collectionName: "",
      contextMode: null,
      specimenRowCount: 0,
      rows: [],
      errors: [...errors, "This file does not contain a catalogue_number column from a supported template."],
      warnings,
    };
  }

  const metadata = new Map<string, string>();

  parsed.rows.slice(0, headerRowIndex).forEach((row) => {
    const key = normalizeKey(row[0] ?? "");

    if (!key) {
      return;
    }

    if (metadata.has(key)) {
      errors.push(`Template metadata contains “${key}” more than once.`);
      return;
    }

    metadata.set(key, (row[1] ?? "").trim());
  });

  const templateVersion = metadata.get("template_version") ?? "";

  const templateKind = metadata.get("template_kind") ?? "";

  const contextModeValue = metadata.get("context_mode") ?? "";

  const collectionName = metadata.get("collection_name") ?? "";

  const contextMode: CatalogueContextMode | null =
    contextModeValue === "shared" || contextModeValue === "per-record" ? contextModeValue : null;

  if (templateVersion !== FOSSIL_CATALOGUE_TEMPLATE_VERSION) {
    errors.push(
      templateVersion
        ? `Template version ${templateVersion} is not supported. Use version ${FOSSIL_CATALOGUE_TEMPLATE_VERSION}.`
        : "This file is missing its template version.",
    );
  }

  if (templateKind !== "fossil") {
    errors.push(
      templateKind
        ? `The ${templateKind} template is not supported by the fossil importer.`
        : "This file is missing its template type.",
    );
  }

  if (!contextMode) {
    errors.push("This file is missing a valid collecting-context mode.");
  }

  if (!collectionName) {
    errors.push("This file is missing its collection name.");
  }

  const headers = parsed.rows[headerRowIndex].map(normalizeKey);

  const indexes = new Map<string, number>();

  headers.forEach((header, index) => {
    if (header && !indexes.has(header)) {
      indexes.set(header, index);
    }
  });

  const requiredColumns =
    contextMode === "per-record" ? [...perRecordContextColumns, ...fossilSpecimenColumns] : fossilSpecimenColumns;

  const missingColumns = requiredColumns.filter((column) => !indexes.has(column));

  if (missingColumns.length > 0) {
    errors.push(`The template is missing required columns: ${missingColumns.join(", ")}.`);
  }

  const knownColumns = new Set([...perRecordContextColumns, ...fossilSpecimenColumns]);

  const unknownColumns = [...indexes.keys()].filter((column) => !knownColumns.has(column as never));

  if (unknownColumns.length > 0) {
    warnings.push(`Unrecognised columns will be ignored: ${unknownColumns.join(", ")}.`);
  }

  const rows = parsed.rows
    .slice(headerRowIndex + 1)
    .map((cells, index) => ({
      cells,
      rowNumber: headerRowIndex + index + 2,
    }))
    .filter(({ cells }) => cells.some((value) => value.trim()))
    .map(({ cells, rowNumber }) => createReviewRow(rowNumber, cells, indexes, metadata, contextMode));

  if (rows.length === 0) {
    errors.push("The template does not contain any specimen rows.");
  }

  const catalogueNumberRows = new Map<string, number[]>();

  rows.forEach((row) => {
    if (!row.catalogueNumber) {
      return;
    }

    const key = row.catalogueNumber.toLowerCase();

    const existing = catalogueNumberRows.get(key) ?? [];

    existing.push(row.rowNumber);

    catalogueNumberRows.set(key, existing);
  });

  catalogueNumberRows.forEach((rowNumbers) => {
    if (rowNumbers.length < 2) {
      return;
    }

    const message = `Catalogue number is repeated in rows ${rowNumbers.join(", ")}.`;

    rowNumbers.forEach((rowNumber) => {
      const row = rows.find((candidate) => candidate.rowNumber === rowNumber);

      row?.errors.push(message);
    });
  });

  return {
    collectionName,
    contextMode,
    specimenRowCount: rows.length,
    rows,
    errors,
    warnings,
  };
}
