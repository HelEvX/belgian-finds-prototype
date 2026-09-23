import type { CreateSpecimenDraftInput } from "../../services/specimenService";
import type { LocationKnowledge, MeasurementStatus, ProvenanceKind } from "../record-find/types";
import type { FossilTemplateInspection, FossilTemplateInspectionRow } from "./fossilCatalogueImport";

function normalizeChoice(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
}

function mapProvenance(value: string): ProvenanceKind | null {
  const normalizedValue = normalizeChoice(value);

  if (
    normalizedValue === "self-found" ||
    normalizedValue === "known-collector" ||
    normalizedValue === "inherited" ||
    normalizedValue === "documented-collection" ||
    normalizedValue === "uncertain"
  ) {
    return normalizedValue;
  }

  return null;
}

function mapMeasurementStatus(value: string): MeasurementStatus | null {
  const normalizedValue = normalizeChoice(value);

  if (normalizedValue === "measured" || normalizedValue === "estimated" || normalizedValue === "not-measured") {
    return normalizedValue;
  }

  return null;
}

function getLocationKnowledge(row: FossilTemplateInspectionRow): LocationKnowledge {
  if (row.siteName && (row.municipality || row.province)) {
    return "known";
  }

  if (row.country || row.province || row.municipality || row.siteName) {
    return "partial";
  }

  return "unknown";
}

function buildGeologicalContext(row: FossilTemplateInspectionRow) {
  const parts = [
    row.formation ? `Formation: ${row.formation}` : null,
    row.member ? `Member: ${row.member}` : null,
    row.geologicalAge ? `Geological age: ${row.geologicalAge}` : null,
    row.ageMinMa || row.ageMaxMa ? `Age range: ${row.ageMinMa || "?"}–${row.ageMaxMa || "?"} Ma` : null,
  ].filter((part): part is string => Boolean(part));

  return parts.join("\n");
}

function buildSourceNotes(collectionName: string, row: FossilTemplateInspectionRow) {
  const collectionDate =
    row.collectionDateFrom || row.collectionDateTo
      ? `Collection date: ${row.collectionDateFrom || "?"}${row.collectionDateTo ? ` to ${row.collectionDateTo}` : ""}`
      : null;

  const parts = [
    `Imported from catalogue: ${collectionName} · ${row.catalogueNumber}`,
    row.collectedBy ? `Collector or source: ${row.collectedBy}` : null,
    row.country ? `Country: ${row.country}` : null,
    collectionDate,
    row.collectingContextNotes || null,
  ].filter((part): part is string => Boolean(part));

  return parts.join("\n");
}

export function mapFossilCatalogueRowsToDraftInputs(
  inspection: FossilTemplateInspection,
  rows: FossilTemplateInspectionRow[],
): CreateSpecimenDraftInput[] {
  return rows.map((row) => ({
    source: "catalogue-import",
    images: [],
    recordKind: "fossil",
    initialValues: {
      /*
       * Imported records need at least image attachment before they can
       * be saved as private specimens. The existing photo screen is a
       * temporary entry point; a dedicated desktop image matcher follows
       * in a later slice.
       */
      status: "annotation-in-progress",
      resumeStep: "images",
      provenance: mapProvenance(row.provenance),
      locationContext: {
        knowledge: getLocationKnowledge(row),
        municipality: row.municipality,
        province: row.province,
        siteDescription: row.siteName,
        geologicalContext: buildGeologicalContext(row),
        collectionDateQualifier: null,
        collectionDateValue: "",
        sourceNotes: buildSourceNotes(inspection.collectionName, row),
      },
      physicalDetails: {
        measurementStatus: mapMeasurementStatus(row.measurementStatus),
        lengthCm: row.lengthCm,
        widthCm: row.widthCm,
        heightCm: row.heightCm,
        weightG: row.weightG,
        condition: "unknown",
      },
      description: {
        suggestedIdentification: row.identification,
        identificationConfidence: null,
        observations: row.specimenNotes,
        helpRequest: null,
      },
      privacySettings: {
        sharingPreference: "private",
        locationVisibility: "country",
      },
      catalogueImport: {
        collectionName: inspection.collectionName,
        catalogueNumber: row.catalogueNumber,
        anatomicalElement: row.anatomicalElement,
        formation: row.formation,
        member: row.member,
        geologicalAge: row.geologicalAge,
        ageMinMa: row.ageMinMa,
        ageMaxMa: row.ageMaxMa,
        preparation: row.preparation,
        sourceProvenance: row.provenance,
        collectedBy: row.collectedBy,
        country: row.country,
        collectionDateFrom: row.collectionDateFrom,
        collectionDateTo: row.collectionDateTo,
        collectingContextNotes: row.collectingContextNotes,
        measurementStatusValue: row.measurementStatus,
        sourceRowNumber: row.rowNumber,
      },
    },
  }));
}
