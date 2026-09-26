import type {
  CatalogueImportCompletionGap,
  CatalogueImportImage,
  CatalogueImportRecord,
  CatalogueImportSession,
  CatalogueImportSpecimenData,
} from "../features/import-catalogue/catalogueImportTypes";

import type {
  FossilTemplateInspection,
  FossilTemplateInspectionRow,
} from "../features/import-catalogue/fossilCatalogueImport";

type CreateCatalogueImportSessionInput = {
  inspection: FossilTemplateInspection;
  rows: FossilTemplateInspectionRow[];
  sourceFilename: string;
};

type CatalogueImportSessionListener = (sessions: CatalogueImportSession[]) => void;

export type CatalogueImportImagePoolAddResult = {
  addedCount: number;
  skippedDuplicateCount: number;
  skippedNonImageCount: number;
};

export type CatalogueImportSessionService = {
  list: () => CatalogueImportSession[];
  getById: (sessionId: string) => CatalogueImportSession | undefined;
  createFromInspection: (input: CreateCatalogueImportSessionInput) => CatalogueImportSession;
  addImages: (sessionId: string, files: File[]) => CatalogueImportImagePoolAddResult;
  revokeAllImagePreviewUrls: () => void;
  subscribe: (listener: CatalogueImportSessionListener) => () => void;
};

const supportedImageFilename = /\.(avif|bmp|gif|heic|heif|jpe?g|png|tiff?|webp)$/i;

function getFileSignature(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function isSupportedImageFile(file: File) {
  return file.type.startsWith("image/") || supportedImageFilename.test(file.name);
}

function getWarningGapDetails(message: string): Pick<CatalogueImportCompletionGap, "kind" | "field"> {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("provenance")) {
    return {
      kind: "unrecognised-provenance",
      field: "provenance",
    };
  }

  if (normalizedMessage.includes("measurement status")) {
    return {
      kind: "unrecognised-measurement-status",
      field: "measurementStatus",
    };
  }

  return {
    kind: "csv-warning",
    field: null,
  };
}

function createInitialCompletionGaps(row: FossilTemplateInspectionRow): CatalogueImportCompletionGap[] {
  const gaps: CatalogueImportCompletionGap[] = [
    {
      kind: "needs-image",
      field: "images",
      message: "Attach at least one image before this record can be finalised privately.",
    },
  ];

  row.warnings.forEach((message) => {
    const details = getWarningGapDetails(message);

    gaps.push({
      kind: details.kind,
      field: details.field,
      message,
    });
  });

  return gaps;
}

function createSpecimenData(row: FossilTemplateInspectionRow): CatalogueImportSpecimenData {
  return {
    identification: row.identification,
    anatomicalElement: row.anatomicalElement,

    provenance: row.provenance,
    collectedBy: row.collectedBy,

    country: row.country,
    province: row.province,
    municipality: row.municipality,
    siteName: row.siteName,

    collectionDateFrom: row.collectionDateFrom,
    collectionDateTo: row.collectionDateTo,
    collectingContextNotes: row.collectingContextNotes,

    formation: row.formation,
    member: row.member,
    geologicalAge: row.geologicalAge,
    ageMinMa: row.ageMinMa,
    ageMaxMa: row.ageMaxMa,

    measurementStatus: row.measurementStatus,
    lengthCm: row.lengthCm,
    widthCm: row.widthCm,
    heightCm: row.heightCm,
    weightG: row.weightG,

    preparation: row.preparation,
    specimenNotes: row.specimenNotes,
  };
}

function createImportRecord(
  sessionId: string,
  row: FossilTemplateInspectionRow,
  timestamp: string,
): CatalogueImportRecord {
  return {
    id: crypto.randomUUID(),
    sessionId,

    sourceRowNumber: row.rowNumber,
    catalogueNumber: row.catalogueNumber,

    status: "awaiting-images",

    expectedImageCount: null,
    assignedImageIds: [],

    validationWarnings: [...row.warnings],
    completionGaps: createInitialCompletionGaps(row),

    specimenData: createSpecimenData(row),

    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function createLocalCatalogueImportSessionService(): CatalogueImportSessionService {
  let sessions: CatalogueImportSession[] = [];

  const listeners = new Set<CatalogueImportSessionListener>();

  const list = () => [...sessions];

  const notifyListeners = () => {
    const currentSessions = list();

    listeners.forEach((listener) => {
      listener(currentSessions);
    });
  };

  return {
    list,

    getById: (sessionId) => sessions.find((session) => session.id === sessionId),

    createFromInspection: ({ inspection, rows, sourceFilename }) => {
      if (inspection.errors.length > 0) {
        throw new Error("A catalogue import session cannot be created from an invalid CSV template.");
      }

      if (!inspection.contextMode) {
        throw new Error("A catalogue import session requires a recognised collecting-context mode.");
      }

      if (rows.length === 0) {
        throw new Error("A catalogue import session requires at least one valid catalogue record.");
      }

      if (rows.some((row) => row.errors.length > 0)) {
        throw new Error("A catalogue import session cannot include CSV rows with errors.");
      }

      const timestamp = new Date().toISOString();

      const sessionId = crypto.randomUUID();

      const session: CatalogueImportSession = {
        id: sessionId,

        collectionName: inspection.collectionName,
        templateKind: "fossil",
        contextMode: inspection.contextMode,

        sourceFilename,

        status: "awaiting-images",

        records: rows.map((row) => createImportRecord(sessionId, row, timestamp)),
        images: [],

        sourceWarnings: [...inspection.warnings],

        createdAt: timestamp,
        updatedAt: timestamp,
      };

      sessions = [...sessions, session];

      notifyListeners();

      return session;
    },

    addImages: (sessionId, files) => {
      const currentSession = sessions.find((session) => session.id === sessionId);

      if (!currentSession) {
        throw new Error("The selected catalogue import session could not be found.");
      }

      const knownFileSignatures = new Set(currentSession.images.map((image) => getFileSignature(image.file)));

      const newImages: CatalogueImportImage[] = [];
      let skippedDuplicateCount = 0;
      let skippedNonImageCount = 0;

      files.forEach((file) => {
        if (!isSupportedImageFile(file)) {
          skippedNonImageCount += 1;
          return;
        }

        const fileSignature = getFileSignature(file);

        if (knownFileSignatures.has(fileSignature)) {
          skippedDuplicateCount += 1;
          return;
        }

        knownFileSignatures.add(fileSignature);

        newImages.push({
          id: crypto.randomUUID(),
          file,
          previewUrl: URL.createObjectURL(file),

          filename: file.name,
          size: file.size,
          lastModified: file.lastModified,

          assignedRecordId: null,
        });
      });

      if (newImages.length > 0) {
        const updatedSession: CatalogueImportSession = {
          ...currentSession,
          images: [...currentSession.images, ...newImages],
          updatedAt: new Date().toISOString(),
        };

        sessions = sessions.map((session) => (session.id === sessionId ? updatedSession : session));

        notifyListeners();
      }

      return {
        addedCount: newImages.length,
        skippedDuplicateCount,
        skippedNonImageCount,
      };
    },

    revokeAllImagePreviewUrls: () => {
      const previewUrls = new Set(sessions.flatMap((session) => session.images.map((image) => image.previewUrl)));

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
 * Local prototype only.
 *
 * The same interface can later be backed by IndexedDB, an API, or another
 * persistence layer without changing the desktop import UI.
 */
export const catalogueImportSessionService = createLocalCatalogueImportSessionService();
