import type {
  CatalogueImportDetails,
  LocationContext,
  PhysicalDetails,
  PrivacySettings,
  RecordKind,
  SpecimenDescription,
  SpecimenDraft,
  SpecimenDraftImage,
  SpecimenDraftSource,
} from "../features/record-find/types";

type SpecimenDraftInitialValues = Partial<
  Pick<
    SpecimenDraft,
    | "status"
    | "resumeStep"
    | "provenance"
    | "locationContext"
    | "physicalDetails"
    | "description"
    | "privacySettings"
    | "catalogueImport"
  >
>;

export type CreateSpecimenDraftInput = {
  source: SpecimenDraftSource;
  images: SpecimenDraftImage[];
  recordKind?: RecordKind | null;
  initialValues?: SpecimenDraftInitialValues;
};

/*
 * Deliberately limited to fields the frontend may update after a draft
 * has been created. Identity, source, and creation time are not mutable.
 */
export type SpecimenDraftUpdate = Partial<
  Pick<
    SpecimenDraft,
    | "images"
    | "recordKind"
    | "provenance"
    | "locationContext"
    | "physicalDetails"
    | "description"
    | "privacySettings"
    | "status"
    | "resumeStep"
    | "catalogueImport"
  >
>;

export type ImportedCatalogueRecordResult = {
  created: SpecimenDraft[];
  skippedDuplicateCount: number;
};

type SpecimenDraftListener = (drafts: SpecimenDraft[]) => void;

export type SpecimenService = {
  list: () => SpecimenDraft[];
  getById: (draftId: string) => SpecimenDraft | undefined;
  create: (input: CreateSpecimenDraftInput) => SpecimenDraft;
  createMany: (inputs: CreateSpecimenDraftInput[]) => SpecimenDraft[];
  importCatalogueRecords: (inputs: CreateSpecimenDraftInput[]) => ImportedCatalogueRecordResult;
  update: (draftId: string, updates: SpecimenDraftUpdate) => SpecimenDraft | undefined;
  subscribe: (listener: SpecimenDraftListener) => () => void;
};

const createEmptyLocationContext = (): LocationContext => ({
  knowledge: null,
  municipality: "",
  province: "",
  siteDescription: "",
  geologicalContext: "",
  collectionDateQualifier: null,
  collectionDateValue: "",
  sourceNotes: "",
});

const createEmptyPhysicalDetails = (): PhysicalDetails => ({
  measurementStatus: null,
  lengthCm: "",
  widthCm: "",
  heightCm: "",
  weightG: "",
  condition: null,
});

const createEmptySpecimenDescription = (): SpecimenDescription => ({
  suggestedIdentification: "",
  identificationConfidence: null,
  observations: "",
  helpRequest: null,
});

const createEmptyPrivacySettings = (): PrivacySettings => ({
  sharingPreference: "private",
  locationVisibility: "country",
});

function getCatalogueRecordKey(details: CatalogueImportDetails | null | undefined) {
  if (!details?.collectionName.trim() || !details.catalogueNumber.trim()) {
    return null;
  }

  return `${details.collectionName.trim().toLocaleLowerCase()}::${details.catalogueNumber.trim().toLocaleLowerCase()}`;
}

function createLocalSpecimenService(): SpecimenService {
  let drafts: SpecimenDraft[] = [];

  const listeners = new Set<SpecimenDraftListener>();

  const list = () => [...drafts];

  const notifyListeners = () => {
    const currentDrafts = list();

    listeners.forEach((listener) => {
      listener(currentDrafts);
    });
  };

  const buildDraft = ({
    source,
    images,
    recordKind = null,
    initialValues = {},
  }: CreateSpecimenDraftInput): SpecimenDraft => {
    const now = new Date().toISOString();

    return {
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      source,
      status: "ready-to-annotate",
      resumeStep: source === "batch-import" ? "type" : "images",
      images,
      recordKind,
      provenance: null,
      locationContext: createEmptyLocationContext(),
      physicalDetails: createEmptyPhysicalDetails(),
      description: createEmptySpecimenDescription(),
      privacySettings: createEmptyPrivacySettings(),
      catalogueImport: null,
      ...initialValues,
    };
  };

  return {
    list,

    getById: (draftId) => drafts.find((draft) => draft.id === draftId),

    create: (input) => {
      const draft = buildDraft(input);

      drafts = [...drafts, draft];

      notifyListeners();

      return draft;
    },

    createMany: (inputs) => {
      if (inputs.length === 0) {
        return [];
      }

      const created = inputs.map(buildDraft);

      drafts = [...drafts, ...created];

      notifyListeners();

      return created;
    },

    importCatalogueRecords: (inputs) => {
      const knownCatalogueKeys = new Set(
        drafts
          .map((draft) => getCatalogueRecordKey(draft.catalogueImport))
          .filter((key): key is string => key !== null),
      );

      const acceptedInputs: CreateSpecimenDraftInput[] = [];

      let skippedDuplicateCount = 0;

      inputs.forEach((input) => {
        const catalogueKey = getCatalogueRecordKey(input.initialValues?.catalogueImport);

        if (catalogueKey && knownCatalogueKeys.has(catalogueKey)) {
          skippedDuplicateCount += 1;
          return;
        }

        if (catalogueKey) {
          knownCatalogueKeys.add(catalogueKey);
        }

        acceptedInputs.push(input);
      });

      const created = acceptedInputs.map(buildDraft);

      if (created.length > 0) {
        drafts = [...drafts, ...created];

        notifyListeners();
      }

      return {
        created,
        skippedDuplicateCount,
      };
    },

    update: (draftId, updates) => {
      const currentDraft = drafts.find((draft) => draft.id === draftId);

      if (!currentDraft) {
        return undefined;
      }

      const updatedDraft: SpecimenDraft = {
        ...currentDraft,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      drafts = drafts.map((draft) => (draft.id === draftId ? updatedDraft : draft));

      notifyListeners();

      return updatedDraft;
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
 * A later service can implement the same SpecimenService contract using
 * an API, Supabase, IndexedDB, or another persistence layer.
 */
export const specimenService = createLocalSpecimenService();
