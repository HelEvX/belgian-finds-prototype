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

// sharing & visibility
export type SharingPreference = "private" | "community";

export type LocationVisibility = "country" | "province" | "municipality";

export type PrivacySettings = {
  sharingPreference: SharingPreference;
  locationVisibility: LocationVisibility;
};

/*
 * A specimen draft is the shared hand-off between image intake and
 * later information completion. A single-specimen image flow creates
 * one draft; batch grouping can create many drafts.
 */
export type SpecimenDraftImage = {
  id: string;
  file: File;
  previewUrl: string;
  source: FindPhotoSource | "batch-import";
};

export type SpecimenDraftSource = "single-specimen" | "batch-import";

export type SpecimenDraftStatus = "ready-to-annotate" | "annotation-in-progress";

export type SpecimenDraft = {
  id: string;
  createdAt: string;
  source: SpecimenDraftSource;
  status: SpecimenDraftStatus;
  images: SpecimenDraftImage[];

  /*
   * These fields are deliberately part of the draft now, even though
   * the existing screens will only be connected to them next.
   */
  recordKind: RecordKind | null;
  provenance: ProvenanceKind | null;
  locationContext: LocationContext;
  physicalDetails: PhysicalDetails;
  description: SpecimenDescription;
  privacySettings: PrivacySettings;
};
