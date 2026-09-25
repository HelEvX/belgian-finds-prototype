import type { SpecimenDraft } from "./types";

/*
 * Catalogue rows are valid private drafts immediately after import.
 * They have one specific outstanding task: associating at least one
 * specimen image with the imported record.
 */
export function isCatalogueImportAwaitingImages(draft: SpecimenDraft) {
  return draft.source === "catalogue-import" && draft.images.length === 0;
}

export function getSpecimenWorkspaceStatusLabel(draft: SpecimenDraft) {
  if (draft.status === "private-specimen") {
    return "Private specimen";
  }

  if (draft.status === "ready-for-review") {
    return "Ready for review";
  }

  if (isCatalogueImportAwaitingImages(draft)) {
    return "Needs images";
  }

  return "Needs information";
}

export function getSpecimenWorkspaceContext(draft: SpecimenDraft) {
  const currentIdentification = draft.description.suggestedIdentification.trim();

  const catalogueNumber = draft.catalogueImport?.catalogueNumber.trim() ?? "";

  const collectionName = draft.catalogueImport?.collectionName.trim() ?? "";

  const place = [draft.locationContext.municipality.trim(), draft.locationContext.province.trim()]
    .filter(Boolean)
    .join(", ");

  if (draft.source === "catalogue-import") {
    const contextParts = [
      collectionName ? `Imported from ${collectionName}` : "Imported catalogue record",
      currentIdentification && catalogueNumber ? `Catalogue no. ${catalogueNumber}` : null,
      place || null,
    ].filter((part): part is string => Boolean(part));

    return contextParts.join(" · ");
  }

  return place || null;
}
