export type CatalogueTemplateKind = "fossil" | "rock-mineral" | "mixed";

export type CatalogueContextMode = "shared" | "per-record";

export type CatalogueImportCommitResult = {
  createdCount: number;
  skippedDuplicateCount: number;
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
