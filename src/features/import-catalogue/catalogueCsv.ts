import { normalizeCsvDecimal, parseDelimitedText } from "./csvFormat";

export const CATALOGUE_TEMPLATE_VERSION = "1";
export const MAX_CATALOGUE_IMPORT_ROWS = 500;
export const MAX_CATALOGUE_CSV_BYTES = 5 * 1024 * 1024;

export const catalogueColumns = [
  "template_version",
  "catalogue_number",
  "record_type",
  "provenance",
  "location_knowledge",
  "municipality",
  "province",
  "site_description",
  "geological_context",
  "collection_date_qualifier",
  "collection_date",
  "source_notes",
  "measurement_status",
  "length_cm",
  "width_cm",
  "height_cm",
  "weight_g",
  "condition",
  "identification",
  "identification_confidence",
  "observations",
  "help_request",
] as const;

export type CatalogueColumn = (typeof catalogueColumns)[number];

export type CatalogueImportRowValues = Record<CatalogueColumn, string>;

export type CatalogueImportRowPreview = {
  rowNumber: number;
  values: CatalogueImportRowValues;
  errors: string[];
  warnings: string[];
};

export type CatalogueImportPreview = {
  rows: CatalogueImportRowPreview[];
  errors: string[];
  warnings: string[];
};

type SourceRow = {
  rowNumber: number;
  cells: string[];
};

const headerAliases: Record<string, CatalogueColumn> = {
  template_version: "template_version",
  catalogue_number: "catalogue_number",
  catalog_number: "catalogue_number",
  record_type: "record_type",
  specimen_type: "record_type",
  provenance: "provenance",
  location_knowledge: "location_knowledge",
  municipality: "municipality",
  province: "province",
  site_description: "site_description",
  site: "site_description",
  geological_context: "geological_context",
  collection_date_qualifier: "collection_date_qualifier",
  collection_date: "collection_date",
  source_notes: "source_notes",
  measurement_status: "measurement_status",
  length_cm: "length_cm",
  width_cm: "width_cm",
  height_cm: "height_cm",
  weight_g: "weight_g",
  condition: "condition",
  identification: "identification",
  suggested_identification: "identification",
  identification_confidence: "identification_confidence",
  observations: "observations",
  help_request: "help_request",
};

const controlledValues: Partial<Record<CatalogueColumn, Set<string>>> = {
  record_type: new Set(["fossil", "rock-mineral", "collection-item", "unknown"]),
  provenance: new Set(["self-found", "known-collector", "inherited", "documented-collection", "uncertain"]),
  location_knowledge: new Set(["known", "partial", "unknown"]),
  collection_date_qualifier: new Set(["on", "around", "known-by"]),
  measurement_status: new Set(["measured", "estimated", "not-measured"]),
  condition: new Set(["whole", "fragment", "multiple-pieces", "unknown"]),
  identification_confidence: new Set(["confident", "likely", "unsure"]),
  help_request: new Set(["none", "community", "verified-specialist"]),
};

const controlledValueAliases: Partial<Record<CatalogueColumn, Record<string, string>>> = {
  record_type: {
    "rock-or-mineral": "rock-mineral",
    "other-collection-item": "collection-item",
    "not-sure": "unknown",
  },
  provenance: {
    "found-by-me": "self-found",
    "found-by-a-known-collector": "known-collector",
    "not-sure": "uncertain",
  },
  location_knowledge: {
    "fully-known": "known",
    "partly-known": "partial",
    "not-known": "unknown",
  },
  identification_confidence: {
    "not-sure": "unsure",
  },
  help_request: {
    "no-help-needed": "none",
    "ask-the-community": "community",
    "ask-a-verified-specialist": "verified-specialist",
  },
};

const columnLabels: Partial<Record<CatalogueColumn, string>> = {
  record_type: "Record type",
  provenance: "Provenance",
  location_knowledge: "Location knowledge",
  collection_date_qualifier: "Collection date qualifier",
  measurement_status: "Measurement status",
  length_cm: "Length",
  width_cm: "Width",
  height_cm: "Height",
  weight_g: "Weight",
  condition: "Condition",
  identification_confidence: "Identification confidence",
  help_request: "Help request",
};

const measurementColumns = ["length_cm", "width_cm", "height_cm", "weight_g"] as const;

function normalizeToken(value: string) {
  return value
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeHeader(value: string) {
  return normalizeToken(value).replace(/-/g, "_");
}

function createEmptyValues(): CatalogueImportRowValues {
  return Object.fromEntries(catalogueColumns.map((column) => [column, ""])) as CatalogueImportRowValues;
}

function validateDate(value: string, errors: string[]) {
  if (!value) {
    return;
  }

  const match = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(value);

  if (!match) {
    errors.push("Collection date must use YYYY, YYYY-MM, or YYYY-MM-DD.");
    return;
  }

  const year = Number(match[1]);
  const month = match[2] ? Number(match[2]) : null;
  const day = match[3] ? Number(match[3]) : null;

  if (month !== null && (month < 1 || month > 12)) {
    errors.push("Collection date contains an invalid month.");
    return;
  }

  if (month !== null && day !== null) {
    const date = new Date(Date.UTC(year, month - 1, day));

    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
      errors.push("Collection date is not a valid calendar date.");
    }
  }
}

function normalizeAndValidateValues(values: CatalogueImportRowValues, errors: string[], warnings: string[]) {
  Object.entries(controlledValues).forEach(([column, allowedValues]) => {
    const typedColumn = column as CatalogueColumn;
    const suppliedValue = values[typedColumn];

    if (!suppliedValue || !allowedValues) {
      return;
    }

    const normalizedValue = normalizeToken(suppliedValue);

    const canonicalValue = controlledValueAliases[typedColumn]?.[normalizedValue] ?? normalizedValue;

    if (!allowedValues.has(canonicalValue)) {
      errors.push(`${columnLabels[typedColumn]} contains an unsupported value: “${suppliedValue}”.`);
      return;
    }

    values[typedColumn] = canonicalValue;
  });

  measurementColumns.forEach((column) => {
    const suppliedValue = values[column];

    if (!suppliedValue) {
      return;
    }

    const normalizedValue = normalizeCsvDecimal(suppliedValue);

    const numberValue = normalizedValue === null ? Number.NaN : Number(normalizedValue);

    if (!normalizedValue || !Number.isFinite(numberValue) || numberValue <= 0) {
      errors.push(`${columnLabels[column] ?? column} must be a positive number.`);
    } else {
      values[column] = normalizedValue;
    }
  });

  validateDate(values.collection_date, errors);

  if (measurementColumns.some((column) => values[column]) && !values.measurement_status) {
    warnings.push("Measurements are present but measurement status is blank.");
  }

  if (values.collection_date && !values.collection_date_qualifier) {
    warnings.push("A collection date is present but its qualifier is blank.");
  }
}

function createSimilaritySignature(values: CatalogueImportRowValues) {
  const identification = normalizeToken(values.identification);

  const location = normalizeToken(`${values.municipality} ${values.site_description}`);

  const measurements = measurementColumns
    .map((column) => (values[column] ? `${column}:${values[column]}` : ""))
    .filter(Boolean);

  if (!identification || !location || measurements.length < 2) {
    return null;
  }

  return [identification, location, ...measurements].join("|");
}

export function parseCatalogueCsv(text: string): CatalogueImportPreview {
  const parsed = parseDelimitedText(text);
  const errors = [...parsed.errors];
  const warnings: string[] = [];

  const sourceRows: SourceRow[] = parsed.rows
    .map((cells, index) => ({
      rowNumber: index + 1,
      cells,
    }))
    .filter(({ cells }) => cells.some((value) => value.trim()));

  if (sourceRows.length === 0) {
    return {
      rows: [],
      errors: [...errors, "The selected CSV is empty."],
      warnings,
    };
  }

  const [headerSourceRow, ...dataSourceRows] = sourceRows;

  const columnIndexes = new Map<CatalogueColumn, number>();

  const unknownHeaders: string[] = [];

  headerSourceRow.cells.forEach((header, index) => {
    const normalizedHeader = normalizeHeader(header);

    const column = headerAliases[normalizedHeader];

    if (!normalizedHeader) {
      return;
    }

    if (!column) {
      unknownHeaders.push(header.trim());
    } else if (columnIndexes.has(column)) {
      errors.push(`The column “${header.trim()}” appears more than once.`);
    } else {
      columnIndexes.set(column, index);
    }
  });

  if (!columnIndexes.has("template_version")) {
    errors.push("The CSV is missing the Template version column.");
  }

  if (!columnIndexes.has("catalogue_number")) {
    errors.push("The CSV is missing the Catalogue number column.");
  }

  if (unknownHeaders.length > 0) {
    warnings.push(`Unrecognised columns will be ignored: ${unknownHeaders.join(", ")}.`);
  }

  if (dataSourceRows.length === 0) {
    errors.push("The CSV contains headings but no specimen rows.");
  } else if (dataSourceRows.length > MAX_CATALOGUE_IMPORT_ROWS) {
    errors.push(
      `This file contains ${dataSourceRows.length} specimen rows. A single import can contain up to ${MAX_CATALOGUE_IMPORT_ROWS}.`,
    );
  }

  const rows = dataSourceRows.map(({ rowNumber, cells }) => {
    const values = createEmptyValues();
    const rowErrors: string[] = [];
    const rowWarnings: string[] = [];

    columnIndexes.forEach((index, column) => {
      values[column] = (cells[index] ?? "").trim();
    });

    if (
      cells.length > headerSourceRow.cells.length &&
      cells.slice(headerSourceRow.cells.length).some((value) => value.trim())
    ) {
      rowErrors.push("This row contains more values than the heading row.");
    }

    if (!values.template_version) {
      rowErrors.push("Template version is required.");
    } else if (values.template_version !== CATALOGUE_TEMPLATE_VERSION) {
      rowErrors.push(
        `Template version ${values.template_version} is not supported. Use version ${CATALOGUE_TEMPLATE_VERSION}.`,
      );
    }

    if (!values.catalogue_number) {
      rowErrors.push("Catalogue number is required.");
    } else if (values.catalogue_number.length > 80) {
      rowErrors.push("Catalogue number must be 80 characters or fewer.");
    }

    normalizeAndValidateValues(values, rowErrors, rowWarnings);

    return {
      rowNumber,
      values,
      errors: rowErrors,
      warnings: rowWarnings,
    };
  });

  const catalogueNumberGroups = new Map<string, CatalogueImportRowPreview[]>();

  const similarityGroups = new Map<string, CatalogueImportRowPreview[]>();

  rows.forEach((row) => {
    const catalogueNumber = row.values.catalogue_number.toLowerCase();

    const similaritySignature = createSimilaritySignature(row.values);

    if (catalogueNumber) {
      const matchingRows = catalogueNumberGroups.get(catalogueNumber) ?? [];

      matchingRows.push(row);

      catalogueNumberGroups.set(catalogueNumber, matchingRows);
    }

    if (similaritySignature) {
      const matchingRows = similarityGroups.get(similaritySignature) ?? [];

      matchingRows.push(row);

      similarityGroups.set(similaritySignature, matchingRows);
    }
  });

  catalogueNumberGroups.forEach((matchingRows) => {
    if (matchingRows.length < 2) {
      return;
    }

    const rowNumbers = matchingRows.map((row) => row.rowNumber).join(", ");

    matchingRows.forEach((row) => row.errors.push(`Catalogue number is repeated in rows ${rowNumbers}.`));
  });

  similarityGroups.forEach((matchingRows) => {
    if (matchingRows.length < 2) {
      return;
    }

    matchingRows.forEach((row) => {
      const otherRows = matchingRows
        .filter((matchingRow) => matchingRow.rowNumber !== row.rowNumber)
        .map((matchingRow) => matchingRow.rowNumber)
        .join(", ");

      row.warnings.push(
        `This record looks similar to ${
          matchingRows.length === 2 ? "row" : "rows"
        } ${otherRows}. Check that they are different specimens.`,
      );
    });
  });

  return { rows, errors, warnings };
}
