import type { SpecimenDraft } from "./types";

/*
 * A specimen’s visible name follows the contributor’s current best
 * identification. This is a working title, not a verified determination.
 */
export function getSpecimenDisplayTitle(draft: SpecimenDraft) {
  const currentIdentification = draft.description.suggestedIdentification.trim();

  if (currentIdentification) {
    return currentIdentification;
  }

  const catalogueNumber = draft.catalogueImport?.catalogueNumber.trim();

  if (catalogueNumber) {
    return catalogueNumber;
  }

  return "Unidentified specimen";
}
