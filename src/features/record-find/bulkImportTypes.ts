export type LocalImportImage = {
  id: string;
  file: File;
  previewUrl: string;
};

export type SpecimenDraftGroup = {
  id: number;
  imageIds: string[];
};
