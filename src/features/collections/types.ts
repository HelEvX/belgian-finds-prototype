export type PrivateCollectionVisibility = "private";

export type PrivateCollectionImage = {
  id: string;
  sourceImportImageId: string;

  file: File;
  previewUrl: string;

  filename: string;
  size: number;
  lastModified: number;
};

export type PrivateCollectionSpecimen = {
  id: string;
  collectionId: string;

  sourceImportRecordId: string;
  sourceRowNumber: number;

  catalogueNumber: string;
  expectedImageCount: number | null;

  images: PrivateCollectionImage[];

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

  createdAt: string;
  updatedAt: string;
};

export type PrivateCollection = {
  id: string;

  name: string;
  visibility: PrivateCollectionVisibility;

  source: "catalogue-import";
  sourceImportSessionId: string;
  sourceFilename: string;

  specimens: PrivateCollectionSpecimen[];

  createdAt: string;
  updatedAt: string;
};
