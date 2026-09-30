export type CatalogueTemplateKind = "fossil" | "rock-mineral" | "mixed";

export type CatalogueContextMode = "shared" | "per-record";

export type CatalogueImportSessionStatus =
  | "reviewing-csv"
  | "awaiting-images"
  | "completing-information"
  | "ready-to-finalise"
  | "completed";

export type CatalogueImportRecordStatus =
  | "awaiting-images"
  | "skipped"
  | "images-matched"
  | "needs-information"
  | "ready-to-finalise"
  | "finalised";

export type CatalogueImportCompletionGapKind =
  | "needs-image"
  | "unrecognised-provenance"
  | "unrecognised-measurement-status"
  | "csv-warning";

export type CatalogueImportCompletionGap = {
  kind: CatalogueImportCompletionGapKind;
  field: string | null;
  message: string;
};

export type CatalogueImportSpecimenData = {
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
};

export type CatalogueImportRecord = {
  id: string;
  sessionId: string;

  sourceRowNumber: number;
  catalogueNumber: string;

  status: CatalogueImportRecordStatus;

  /*
   * Optional guidance supplied through the CSV img_count column.
   *
   * A blank value means no expected count was supplied. The count helps
   * catalogue matching but never blocks a contributor from assigning fewer
   * or more images when the record needs it.
   */
  expectedImageCount: number | null;

  assignedImageIds: string[];

  validationWarnings: string[];
  completionGaps: CatalogueImportCompletionGap[];

  specimenData: CatalogueImportSpecimenData;

  createdAt: string;
  updatedAt: string;
};

export type CatalogueImportImage = {
  id: string;
  file: File;
  previewUrl: string;

  filename: string;
  size: number;
  lastModified: number;

  /*
   * This will power exclusive theatre-seat-style image assignment:
   * an image can be unassigned or assigned to one import record.
   */
  assignedRecordId: string | null;
};

export type CatalogueImportAutoMatchIssueKind =
  | "empty-image-pool"
  | "existing-image-assignments"
  | "skipped-records"
  | "missing-image-counts"
  | "duplicate-image-filenames"
  | "image-count-mismatch";

export type CatalogueImportAutoMatchIssue = {
  kind: CatalogueImportAutoMatchIssueKind;
  title: string;
  detail: string;
};

export type CatalogueImportAutoMatchPlan = {
  isReady: boolean;
  matchedRecordCount: number;
  expectedImageCount: number;
  availableImageCount: number;
  recordsWithZeroExpectedImageCount: number;
  issues: CatalogueImportAutoMatchIssue[];
};

export type CatalogueImportSession = {
  id: string;

  collectionName: string;
  templateKind: "fossil";
  contextMode: CatalogueContextMode;

  sourceFilename: string;

  status: CatalogueImportSessionStatus;

  records: CatalogueImportRecord[];
  images: CatalogueImportImage[];

  sourceWarnings: string[];

  createdAt: string;
  updatedAt: string;
};

export type SharedCollectingContext = {
  collectionName: string;
  provenance: string;
  collectedBy: string;
  country: string;
  province: string;
  municipality: string;
  siteName: string;
  collectionDateFrom: string;
  collectionDateTo: string;
  formation: string;
  member: string;
  geologicalAge: string;
  ageMinMa: string;
  ageMaxMa: string;
  notes: string;
};

export const createEmptySharedCollectingContext = (): SharedCollectingContext => ({
  collectionName: "",
  provenance: "",
  collectedBy: "",
  country: "Belgium",
  province: "",
  municipality: "",
  siteName: "",
  collectionDateFrom: "",
  collectionDateTo: "",
  formation: "",
  member: "",
  geologicalAge: "",
  ageMinMa: "",
  ageMaxMa: "",
  notes: "",
});
