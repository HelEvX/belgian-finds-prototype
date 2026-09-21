import type { CatalogueContextMode, SharedCollectingContext } from "./catalogueImportTypes";

export const FOSSIL_CATALOGUE_TEMPLATE_VERSION = "2";

export const FOSSIL_CATALOGUE_DELIMITER = ";";

export const fossilSpecimenColumns = [
  "catalogue_number",
  "identification",
  "anatomical_element",
  "formation",
  "member",
  "geological_age",
  "age_min_ma",
  "age_max_ma",
  "measurement_status",
  "length_cm",
  "width_cm",
  "height_cm",
  "weight_g",
  "preparation",
  "specimen_notes",
] as const;

export const perRecordContextColumns = [
  "provenance",
  "collected_by",
  "country",
  "province",
  "municipality",
  "site_name",
  "collection_date_from",
  "collection_date_to",
  "collecting_context_notes",
] as const;

function escapeCsvValue(value: string) {
  if (/[";\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

function createCsvRow(values: readonly string[]) {
  return values.map(escapeCsvValue).join(FOSSIL_CATALOGUE_DELIMITER);
}

function createMetadataRows(contextMode: CatalogueContextMode, context: SharedCollectingContext) {
  const rows: string[][] = [
    ["template_version", FOSSIL_CATALOGUE_TEMPLATE_VERSION],
    ["template_kind", "fossil"],
    ["context_mode", contextMode],
    ["collection_name", context.collectionName.trim()],
  ];

  if (contextMode === "shared") {
    rows.push(
      ["shared_provenance", context.provenance],
      ["shared_collected_by", context.collectedBy.trim()],
      ["shared_country", context.country.trim()],
      ["shared_province", context.province.trim()],
      ["shared_municipality", context.municipality.trim()],
      ["shared_site_name", context.siteName.trim()],
      ["shared_collection_date_from", context.collectionDateFrom.trim()],
      ["shared_collection_date_to", context.collectionDateTo.trim()],
      ["shared_formation", context.formation.trim()],
      ["shared_member", context.member.trim()],
      ["shared_geological_age", context.geologicalAge.trim()],
      ["shared_age_min_ma", context.ageMinMa.trim()],
      ["shared_age_max_ma", context.ageMaxMa.trim()],
      ["shared_collecting_context_notes", context.notes.trim()],
    );
  }

  return rows;
}

export function buildFossilCatalogueTemplate(contextMode: CatalogueContextMode, context: SharedCollectingContext) {
  const metadataRows = createMetadataRows(contextMode, context);

  const specimenColumns =
    contextMode === "shared" ? fossilSpecimenColumns : [...perRecordContextColumns, ...fossilSpecimenColumns];

  const blankSpecimenRow = specimenColumns.map(() => "");

  return `\uFEFF${[
    ...metadataRows.map(createCsvRow),
    "",
    createCsvRow(specimenColumns),
    createCsvRow(blankSpecimenRow),
  ].join("\r\n")}`;
}

export function createFossilTemplateFilename(collectionName: string, contextMode: CatalogueContextMode) {
  const safeCollectionName = collectionName
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  const collectionPart = safeCollectionName || "fossil-collection";

  return `${collectionPart}-${contextMode}-template-v${FOSSIL_CATALOGUE_TEMPLATE_VERSION}.csv`;
}
