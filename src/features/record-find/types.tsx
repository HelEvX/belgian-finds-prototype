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
