import type { CatalogueImportSession } from "../features/import-catalogue/catalogueImportTypes";

import type {
  PrivateCollection,
  PrivateCollectionImage,
  PrivateCollectionSpecimen,
} from "../features/collections/types";

type PrivateCollectionListener = (collections: PrivateCollection[]) => void;

export type PrivateCollectionService = {
  list: () => PrivateCollection[];
  getById: (collectionId: string) => PrivateCollection | undefined;
  getBySourceImportSessionId: (sessionId: string) => PrivateCollection | undefined;
  createFromCompletedImport: (session: CatalogueImportSession) => PrivateCollection;
  revokeAllImagePreviewUrls: () => void;
  subscribe: (listener: PrivateCollectionListener) => () => void;
};

function createPrivateCollectionImage(image: CatalogueImportSession["images"][number]): PrivateCollectionImage {
  return {
    id: crypto.randomUUID(),
    sourceImportImageId: image.id,

    file: image.file,

    /*
     * A completed collection owns its own object URL. The temporary import
     * session may later revoke its previews without breaking collection
     * thumbnails or record detail views.
     */
    previewUrl: URL.createObjectURL(image.file),

    filename: image.filename,
    size: image.size,
    lastModified: image.lastModified,
  };
}

function createPrivateCollectionSpecimen(
  record: CatalogueImportSession["records"][number],
  collectionId: string,
  imagesById: Map<string, CatalogueImportSession["images"][number]>,
  timestamp: string,
): PrivateCollectionSpecimen {
  const images = record.assignedImageIds.map((imageId) => {
    const image = imagesById.get(imageId);

    if (!image) {
      throw new Error(`The image assigned to ${record.catalogueNumber} could not be found.`);
    }

    return createPrivateCollectionImage(image);
  });

  return {
    id: crypto.randomUUID(),
    collectionId,

    sourceImportRecordId: record.id,
    sourceRowNumber: record.sourceRowNumber,

    catalogueNumber: record.catalogueNumber,
    expectedImageCount: record.expectedImageCount,

    images,

    identification: record.specimenData.identification,
    anatomicalElement: record.specimenData.anatomicalElement,

    provenance: record.specimenData.provenance,
    collectedBy: record.specimenData.collectedBy,

    country: record.specimenData.country,
    province: record.specimenData.province,
    municipality: record.specimenData.municipality,
    siteName: record.specimenData.siteName,

    collectionDateFrom: record.specimenData.collectionDateFrom,
    collectionDateTo: record.specimenData.collectionDateTo,
    collectingContextNotes: record.specimenData.collectingContextNotes,

    formation: record.specimenData.formation,
    member: record.specimenData.member,
    geologicalAge: record.specimenData.geologicalAge,
    ageMinMa: record.specimenData.ageMinMa,
    ageMaxMa: record.specimenData.ageMaxMa,

    measurementStatus: record.specimenData.measurementStatus,
    lengthCm: record.specimenData.lengthCm,
    widthCm: record.specimenData.widthCm,
    heightCm: record.specimenData.heightCm,
    weightG: record.specimenData.weightG,

    preparation: record.specimenData.preparation,
    specimenNotes: record.specimenData.specimenNotes,

    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function createLocalPrivateCollectionService(): PrivateCollectionService {
  let collections: PrivateCollection[] = [];

  const listeners = new Set<PrivateCollectionListener>();

  const list = () => [...collections];

  const notifyListeners = () => {
    const currentCollections = list();

    listeners.forEach((listener) => {
      listener(currentCollections);
    });
  };

  return {
    list,

    getById: (collectionId) => collections.find((collection) => collection.id === collectionId),

    getBySourceImportSessionId: (sessionId) =>
      collections.find((collection) => collection.sourceImportSessionId === sessionId),

    createFromCompletedImport: (session) => {
      if (session.status !== "completed") {
        throw new Error("Only a finished catalogue import can create a private collection.");
      }

      const existingCollection = collections.find((collection) => collection.sourceImportSessionId === session.id);

      if (existingCollection) {
        throw new Error("This catalogue import has already created a private collection.");
      }

      const timestamp = new Date().toISOString();

      const collectionId = crypto.randomUUID();

      const imagesById = new Map(session.images.map((image) => [image.id, image]));

      const collection: PrivateCollection = {
        id: collectionId,

        name: session.collectionName,
        visibility: "private",

        source: "catalogue-import",
        sourceImportSessionId: session.id,
        sourceFilename: session.sourceFilename,

        specimens: session.records.map((record) =>
          createPrivateCollectionSpecimen(record, collectionId, imagesById, timestamp),
        ),

        createdAt: timestamp,
        updatedAt: timestamp,
      };

      collections = [...collections, collection];

      notifyListeners();

      return collection;
    },

    revokeAllImagePreviewUrls: () => {
      const previewUrls = new Set(
        collections.flatMap((collection) =>
          collection.specimens.flatMap((specimen) => specimen.images.map((image) => image.previewUrl)),
        ),
      );

      previewUrls.forEach((previewUrl) => {
        URL.revokeObjectURL(previewUrl);
      });
    },

    subscribe: (listener) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}

/*
 * Local prototype implementation only.
 *
 * This boundary can later be backed by IndexedDB, Supabase, or another API
 * without changing the collection-facing desktop screens.
 */
export const privateCollectionService = createLocalPrivateCollectionService();
