import type {
  CatalogueImportAutoMatchPlan,
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

export type CatalogueImportAutoMatchResult = {
  plan: CatalogueImportAutoMatchPlan;
  session: CatalogueImportSession | null;
};

export type CatalogueImportSessionService = {
  list: () => CatalogueImportSession[];
  getById: (sessionId: string) => CatalogueImportSession | undefined;
  createFromInspection: (input: CreateCatalogueImportSessionInput) => CatalogueImportSession;
  addImages: (sessionId: string, files: File[]) => CatalogueImportImagePoolAddResult;
  getAutoMatchPlan: (sessionId: string) => CatalogueImportAutoMatchPlan;
  autoMatchByExpectedImageCounts: (sessionId: string) => CatalogueImportAutoMatchResult;
  finishImport: (sessionId: string) => CatalogueImportSession;
  setRecordImageAssignments: (
    sessionId: string,
    recordId: string,
    imageIds: string[],
  ) => CatalogueImportSession | undefined;
  markRecordSkipped: (sessionId: string, recordId: string) => CatalogueImportSession | undefined;
  revokeAllImagePreviewUrls: () => void;
  subscribe: (listener: CatalogueImportSessionListener) => () => void;
};

const supportedImageFilename = /\.(avif|bmp|gif|heic|heif|jpe?g|png|tiff?|webp)$/i;

function getFileSignature(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

const imageFilenameCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

function formatCount(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function formatExamples(values: string[], maximum = 5) {
  const visibleValues = values.slice(0, maximum).map((value) => `“${value}”`);

  if (values.length <= maximum) {
    return visibleValues.join(", ");
  }

  return `${visibleValues.join(", ")} and ${values.length - maximum} more`;
}

function getDuplicateImageFilenames(images: CatalogueImportImage[]) {
  const filenameCounts = new Map<string, number>();
  const displayFilenames = new Map<string, string>();

  images.forEach((image) => {
    const displayFilename = image.filename.trim() || "Unnamed image";
    const normalizedFilename = displayFilename.toLocaleLowerCase();

    filenameCounts.set(normalizedFilename, (filenameCounts.get(normalizedFilename) ?? 0) + 1);

    if (!displayFilenames.has(normalizedFilename)) {
      displayFilenames.set(normalizedFilename, displayFilename);
    }
  });

  return [...filenameCounts.entries()]
    .filter(([, count]) => count > 1)
    .map(([normalizedFilename]) => displayFilenames.get(normalizedFilename) ?? normalizedFilename)
    .sort(imageFilenameCollator.compare);
}

function createAutoMatchPlan(session: CatalogueImportSession): CatalogueImportAutoMatchPlan {
  const issues: CatalogueImportAutoMatchPlan["issues"] = [];

  const unassignedImages = session.images.filter((image) => image.assignedRecordId === null);

  const recordsWithAssignedImages = session.records.filter((record) => record.assignedImageIds.length > 0);

  const skippedRecords = session.records.filter((record) => record.status === "skipped");

  const recordsMissingImageCounts = session.records.filter((record) => record.expectedImageCount === null);

  const expectedImageCount = session.records.reduce((total, record) => total + (record.expectedImageCount ?? 0), 0);

  const recordsWithZeroExpectedImageCount = session.records.filter((record) => record.expectedImageCount === 0).length;

  if (session.images.length === 0) {
    issues.push({
      kind: "empty-image-pool",
      title: "No collection images have been added",
      detail:
        expectedImageCount > 0
          ? `The CSV expects ${formatCount(expectedImageCount, "image")}. Choose the image files or folder before auto-matching.`
          : "Choose the collection image files or a folder before auto-matching.",
    });
  }

  if (recordsWithAssignedImages.length > 0) {
    const assignedImageCount = recordsWithAssignedImages.reduce(
      (total, record) => total + record.assignedImageIds.length,
      0,
    );

    issues.push({
      kind: "existing-image-assignments",
      title: "Manual image assignments already exist",
      detail: `${formatCount(assignedImageCount, "image")} ${assignedImageCount === 1 ? "is" : "are"} already assigned across ${formatCount(recordsWithAssignedImages.length, "record")}. Auto-match is only available before manual matching begins. Remove those assignments in manual matching, or continue matching this session manually.`,
    });
  }

  if (skippedRecords.length > 0) {
    issues.push({
      kind: "skipped-records",
      title: "Some records are marked Skip for now",
      detail: `${formatCount(skippedRecords.length, "record")} ${skippedRecords.length === 1 ? "is" : "are"} marked Skip for now. Auto-match is intended for a new, untouched session. Continue manually, or create a new import session to auto-match the collection from the beginning.`,
    });
  }

  if (recordsMissingImageCounts.length > 0) {
    issues.push({
      kind: "missing-image-counts",
      title: "Some CSV rows do not contain img_count",
      detail: `${formatCount(recordsMissingImageCounts.length, "record")} ${recordsMissingImageCounts.length === 1 ? "has" : "have"} no img_count value: ${formatExamples(
        recordsMissingImageCounts.map((record) => record.catalogueNumber),
      )}. Add a whole-number image count for every record in the CSV, then create a new import session.`,
    });
  }

  const duplicateImageFilenames = getDuplicateImageFilenames(unassignedImages);

  if (duplicateImageFilenames.length > 0) {
    issues.push({
      kind: "duplicate-image-filenames",
      title: "Some image filenames are repeated",
      detail: `${formatCount(duplicateImageFilenames.length, "filename")} ${duplicateImageFilenames.length === 1 ? "occurs" : "occur"} more than once: ${formatExamples(
        duplicateImageFilenames,
      )}. Rename the repeated files so their order is unambiguous, then use a new import session or match those records manually.`,
    });
  }

  const canCompareCounts =
    session.images.length > 0 &&
    recordsWithAssignedImages.length === 0 &&
    skippedRecords.length === 0 &&
    recordsMissingImageCounts.length === 0;

  if (canCompareCounts && expectedImageCount !== unassignedImages.length) {
    const difference = Math.abs(expectedImageCount - unassignedImages.length);

    issues.push({
      kind: "image-count-mismatch",
      title: "The CSV image total does not match the image pool",
      detail:
        expectedImageCount > unassignedImages.length
          ? `The CSV expects ${formatCount(expectedImageCount, "image")}, but the image pool contains ${formatCount(
              unassignedImages.length,
              "unassigned image",
            )}. Add ${formatCount(difference, "image")} or reduce the img_count values in the CSV.`
          : `The CSV expects ${formatCount(expectedImageCount, "image")}, but the image pool contains ${formatCount(
              unassignedImages.length,
              "unassigned image",
            )}. Remove ${formatCount(difference, "extra image")} or increase the img_count values in the CSV.`,
    });
  }

  return {
    isReady: issues.length === 0,
    matchedRecordCount: session.records.filter((record) => (record.expectedImageCount ?? 0) > 0).length,
    expectedImageCount,
    availableImageCount: unassignedImages.length,
    recordsWithZeroExpectedImageCount,
    issues,
  };
}

function getNaturallySortedImages(images: CatalogueImportImage[]) {
  return [...images].sort((firstImage, secondImage) => {
    const filenameComparison = imageFilenameCollator.compare(firstImage.filename, secondImage.filename);

    if (filenameComparison !== 0) {
      return filenameComparison;
    }

    return firstImage.lastModified - secondImage.lastModified || firstImage.id.localeCompare(secondImage.id);
  });
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

function createNeedsImageGap(): CatalogueImportCompletionGap {
  return {
    kind: "needs-image",
    field: "images",
    message: "Attach at least one image before this record can be finalised privately.",
  };
}

function updateImageCompletionGap(
  completionGaps: CatalogueImportCompletionGap[],
  hasAssignedImages: boolean,
): CatalogueImportCompletionGap[] {
  const gapsWithoutImageRequirement = completionGaps.filter((gap) => gap.kind !== "needs-image");

  return hasAssignedImages ? gapsWithoutImageRequirement : [createNeedsImageGap(), ...gapsWithoutImageRequirement];
}

function createInitialCompletionGaps(row: FossilTemplateInspectionRow): CatalogueImportCompletionGap[] {
  const gaps: CatalogueImportCompletionGap[] = [createNeedsImageGap()];

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

    expectedImageCount: row.expectedImageCount,
    assignedImageIds: [],

    validationWarnings: [...row.warnings],
    completionGaps: createInitialCompletionGaps(row),

    specimenData: createSpecimenData(row),

    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function getSessionStatus(records: CatalogueImportRecord[]): CatalogueImportSession["status"] {
  const everyRecordHasImages = records.every((record) => record.assignedImageIds.length > 0);

  return everyRecordHasImages ? "completing-information" : "awaiting-images";
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

  const replaceSession = (updatedSession: CatalogueImportSession) => {
    sessions = sessions.map((session) => (session.id === updatedSession.id ? updatedSession : session));

    notifyListeners();

    return updatedSession;
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
        replaceSession({
          ...currentSession,
          images: [...currentSession.images, ...newImages],
          updatedAt: new Date().toISOString(),
        });
      }

      return {
        addedCount: newImages.length,
        skippedDuplicateCount,
        skippedNonImageCount,
      };
    },

    getAutoMatchPlan: (sessionId) => {
      const currentSession = sessions.find((session) => session.id === sessionId);

      if (!currentSession) {
        throw new Error("The selected catalogue import session could not be found.");
      }

      return createAutoMatchPlan(currentSession);
    },

    autoMatchByExpectedImageCounts: (sessionId) => {
      const currentSession = sessions.find((session) => session.id === sessionId);

      if (!currentSession) {
        throw new Error("The selected catalogue import session could not be found.");
      }

      const plan = createAutoMatchPlan(currentSession);

      if (!plan.isReady) {
        return {
          plan,
          session: null,
        };
      }

      const orderedImages = getNaturallySortedImages(
        currentSession.images.filter((image) => image.assignedRecordId === null),
      );

      const timestamp = new Date().toISOString();

      let nextImageIndex = 0;

      const assignedImageIdsByRecordId = new Map<string, string[]>();

      const updatedRecords = currentSession.records.map((record): CatalogueImportRecord => {
        const expectedImageCount = record.expectedImageCount ?? 0;

        const assignedImageIds = orderedImages
          .slice(nextImageIndex, nextImageIndex + expectedImageCount)
          .map((image) => image.id);

        nextImageIndex += expectedImageCount;

        assignedImageIdsByRecordId.set(record.id, assignedImageIds);

        const hasAssignedImages = assignedImageIds.length > 0;

        return {
          ...record,
          assignedImageIds,
          status: hasAssignedImages ? "images-matched" : "awaiting-images",
          completionGaps: updateImageCompletionGap(record.completionGaps, hasAssignedImages),
          updatedAt: timestamp,
        };
      });

      const recordIdByImageId = new Map<string, string>();

      assignedImageIdsByRecordId.forEach((imageIds, recordId) => {
        imageIds.forEach((imageId) => {
          recordIdByImageId.set(imageId, recordId);
        });
      });

      const updatedImages = currentSession.images.map((image) => ({
        ...image,
        assignedRecordId: recordIdByImageId.get(image.id) ?? null,
      }));

      const updatedSession = replaceSession({
        ...currentSession,
        status: getSessionStatus(updatedRecords),
        records: updatedRecords,
        images: updatedImages,
        updatedAt: timestamp,
      });

      return {
        plan,
        session: updatedSession,
      };
    },

    finishImport: (sessionId) => {
      const currentSession = sessions.find((session) => session.id === sessionId);

      if (!currentSession) {
        throw new Error("The selected catalogue import session could not be found.");
      }

      if (currentSession.status === "completed") {
        return currentSession;
      }

      const recordsWithoutImages = currentSession.records.filter((record) => record.assignedImageIds.length === 0);

      if (recordsWithoutImages.length > 0) {
        throw new Error("Every catalogue record needs an image assignment before the import can be finished.");
      }

      const unassignedImages = currentSession.images.filter((image) => image.assignedRecordId === null);

      if (unassignedImages.length > 0) {
        throw new Error("Every image in the import pool must be assigned before the import can be finished.");
      }

      return replaceSession({
        ...currentSession,
        status: "completed",
        updatedAt: new Date().toISOString(),
      });
    },

    setRecordImageAssignments: (sessionId, recordId, imageIds) => {
      const currentSession = sessions.find((session) => session.id === sessionId);

      if (!currentSession) {
        throw new Error("The selected catalogue import session could not be found.");
      }

      const currentRecord = currentSession.records.find((record) => record.id === recordId);

      if (!currentRecord) {
        throw new Error("The selected catalogue record could not be found.");
      }

      const uniqueImageIds = [...new Set(imageIds)];

      if (uniqueImageIds.length !== imageIds.length) {
        throw new Error("An image cannot be assigned more than once to the same catalogue record.");
      }

      const knownImageIds = new Set(currentSession.images.map((image) => image.id));

      if (uniqueImageIds.some((imageId) => !knownImageIds.has(imageId))) {
        throw new Error("One or more selected images are not available in this import session.");
      }

      const conflictingImage = currentSession.images.find(
        (image) =>
          uniqueImageIds.includes(image.id) && image.assignedRecordId !== null && image.assignedRecordId !== recordId,
      );

      if (conflictingImage) {
        throw new Error(`“${conflictingImage.filename}” is already assigned to another catalogue record.`);
      }

      const timestamp = new Date().toISOString();

      const hasAssignedImages = uniqueImageIds.length > 0;

      const updatedRecords = currentSession.records.map((record): CatalogueImportRecord => {
        if (record.id !== recordId) {
          return record;
        }

        return {
          ...record,
          assignedImageIds: uniqueImageIds,
          status: hasAssignedImages ? "images-matched" : "awaiting-images",
          completionGaps: updateImageCompletionGap(record.completionGaps, hasAssignedImages),
          updatedAt: timestamp,
        };
      });

      const selectedImageIdSet = new Set(uniqueImageIds);

      const updatedImages = currentSession.images.map((image) => {
        if (selectedImageIdSet.has(image.id)) {
          return {
            ...image,
            assignedRecordId: recordId,
          };
        }

        if (image.assignedRecordId === recordId) {
          return {
            ...image,
            assignedRecordId: null,
          };
        }

        return image;
      });

      return replaceSession({
        ...currentSession,
        status: getSessionStatus(updatedRecords),
        records: updatedRecords,
        images: updatedImages,
        updatedAt: timestamp,
      });
    },

    markRecordSkipped: (sessionId, recordId) => {
      const currentSession = sessions.find((session) => session.id === sessionId);

      if (!currentSession) {
        throw new Error("The selected catalogue import session could not be found.");
      }

      const currentRecord = currentSession.records.find((record) => record.id === recordId);

      if (!currentRecord) {
        throw new Error("The selected catalogue record could not be found.");
      }

      if (currentRecord.assignedImageIds.length > 0) {
        throw new Error("Remove this record’s image assignments before marking it as skipped.");
      }

      const timestamp = new Date().toISOString();

      const updatedRecords = currentSession.records.map((record): CatalogueImportRecord => {
        if (record.id !== recordId) {
          return record;
        }

        return {
          ...record,
          status: "skipped",
          completionGaps: updateImageCompletionGap(record.completionGaps, false),
          updatedAt: timestamp,
        };
      });

      return replaceSession({
        ...currentSession,
        status: getSessionStatus(updatedRecords),
        records: updatedRecords,
        updatedAt: timestamp,
      });
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
