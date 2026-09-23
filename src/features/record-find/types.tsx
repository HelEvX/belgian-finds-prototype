export type RecordKind = "fossil" | "rock-mineral" | "collection-item" | "unknown";

export type RecordKindOption = {
  id: RecordKind;
  symbol: string;
  title: string;
  description: string;
};

export const MAX_FIND_PHOTOS = 5;

export type FindPhotoSource = "camera" | "existing";

export type LocalFindPhoto = {
  id: string;
  file: File;
  previewUrl: string;
  source: FindPhotoSource;
};

export type ProvenanceKind = "self-found" | "known-collector" | "inherited" | "documented-collection" | "uncertain";

export type ProvenanceOption = {
  id: ProvenanceKind;
  symbol: string;
  title: string;
  description: string;
};

export type LocationKnowledge = "known" | "partial" | "unknown";

export type CollectionDateQualifier = "on" | "around" | "known-by";

export type LocationContext = {
  knowledge: LocationKnowledge | null;
  municipality: string;
  province: string;
  siteDescription: string;
  geologicalContext: string;
  collectionDateQualifier: CollectionDateQualifier | null;
  collectionDateValue: string;
  sourceNotes: string;
};

export type MeasurementStatus = "measured" | "estimated" | "not-measured";

export type SpecimenCondition = "whole" | "fragment" | "multiple-pieces" | "unknown";

export type PhysicalDetails = {
  measurementStatus: MeasurementStatus | null;
  lengthCm: string;
  widthCm: string;
  heightCm: string;
  weightG: string;
  condition: SpecimenCondition | null;
};

export type IdentificationConfidence = "confident" | "likely" | "unsure";

export type HelpRequestPreference = "none" | "community" | "verified-specialist";

export type SpecimenDescription = {
  suggestedIdentification: string;
  identificationConfidence: IdentificationConfidence | null;
  observations: string;
  helpRequest: HelpRequestPreference | null;
};

export type SharingPreference = "private" | "community";

export type LocationVisibility = "country" | "province" | "municipality";

export type PrivacySettings = {
  sharingPreference: SharingPreference;
  locationVisibility: LocationVisibility;
};

export type SpecimenDraftImage = {
  id: string;
  file: File;
  previewUrl: string;
  source: FindPhotoSource | "batch-import";
};

export type SpecimenDraftSource = "single-specimen" | "catalogue-import" | "batch-import";

export type SpecimenDraftStatus =
  | "ready-to-annotate"
  | "annotation-in-progress"
  | "ready-for-review"
  | "private-specimen";

/*
 * This is deliberately a domain-level stage rather than a numeric
 * PrototypeStep. Prototype screen numbers also include Explore,
 * Settings, and archived routes and should not be persisted as
 * specimen progress.
 */
export type SpecimenDraftStep =
  | "images"
  | "type"
  | "provenance"
  | "find-location"
  | "physical-details"
  | "identification-observations"
  | "privacy";

/*
 * These values preserve information that belongs to an established
 * catalogue but does not yet have a dedicated mobile editing surface.
 *
 * Existing fields such as type, location, dimensions, provenance and
 * suggested identification are also mapped into the standard draft.
 */
export type CatalogueImportDetails = {
  collectionName: string;
  catalogueNumber: string;
  anatomicalElement: string;
  formation: string;
  member: string;
  geologicalAge: string;
  ageMinMa: string;
  ageMaxMa: string;
  preparation: string;
  sourceProvenance: string;
  collectedBy: string;
  country: string;
  collectionDateFrom: string;
  collectionDateTo: string;
  collectingContextNotes: string;
  measurementStatusValue: string;
  sourceRowNumber: number;
};

export type SpecimenDraft = {
  id: string;
  createdAt: string;
  updatedAt: string;
  source: SpecimenDraftSource;
  status: SpecimenDraftStatus;
  resumeStep: SpecimenDraftStep;
  images: SpecimenDraftImage[];
  recordKind: RecordKind | null;
  provenance: ProvenanceKind | null;
  locationContext: LocationContext;
  physicalDetails: PhysicalDetails;
  description: SpecimenDescription;
  privacySettings: PrivacySettings;
  catalogueImport: CatalogueImportDetails | null;
};
