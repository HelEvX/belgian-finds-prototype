import { parseDelimitedText } from "./csvFormat";

import {
  FOSSIL_CATALOGUE_TEMPLATE_VERSION,
  fossilSpecimenColumns,
  perRecordContextColumns,
} from "./fossilCatalogueTemplate";

import type { CatalogueContextMode } from "./catalogueImportTypes";

export const MAX_CATALOGUE_CSV_BYTES = 5 * 1024 * 1024;

export type FossilTemplateInspection = {
  collectionName: string;
  contextMode: CatalogueContextMode | null;
  specimenRowCount: number;
  errors: string[];
  warnings: string[];
};

function normalizeKey(value: string) {
  return value
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase();
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

  const headers = new Set(parsed.rows[headerRowIndex].map(normalizeKey).filter(Boolean));

  const requiredColumns =
    contextMode === "per-record" ? [...perRecordContextColumns, ...fossilSpecimenColumns] : fossilSpecimenColumns;

  const missingColumns = requiredColumns.filter((column) => !headers.has(column));

  if (missingColumns.length > 0) {
    errors.push(`The template is missing required columns: ${missingColumns.join(", ")}.`);
  }

  const knownColumns = new Set([...perRecordContextColumns, ...fossilSpecimenColumns]);

  const unknownColumns = [...headers].filter(
    (column) => !knownColumns.has(column as (typeof fossilSpecimenColumns)[number]),
  );

  if (unknownColumns.length > 0) {
    warnings.push(`Unrecognised columns will be ignored: ${unknownColumns.join(", ")}.`);
  }

  const specimenRowCount = parsed.rows
    .slice(headerRowIndex + 1)
    .filter((row) => row.some((value) => value.trim())).length;

  if (specimenRowCount === 0) {
    errors.push("The template does not contain any specimen rows.");
  }

  return {
    collectionName,
    contextMode,
    specimenRowCount,
    errors,
    warnings,
  };
}
