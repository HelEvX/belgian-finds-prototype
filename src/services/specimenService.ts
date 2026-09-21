import type {
  LocationContext,
  PhysicalDetails,
  PrivacySettings,
  RecordKind,
  SpecimenDescription,
  SpecimenDraft,
  SpecimenDraftImage,
  SpecimenDraftSource,
} from "../features/record-find/types";

export type CreateSpecimenDraftInput = {
  source: SpecimenDraftSource;
  images: SpecimenDraftImage[];
  recordKind?: RecordKind | null;
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
  >
>;

type SpecimenDraftListener = (drafts: SpecimenDraft[]) => void;

export type SpecimenService = {
  list: () => SpecimenDraft[];
  getById: (draftId: string) => SpecimenDraft | undefined;
  create: (input: CreateSpecimenDraftInput) => SpecimenDraft;
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

  return {
    list,

    getById: (draftId) => drafts.find((draft) => draft.id === draftId),

    create: ({ source, images, recordKind = null }) => {
      const now = new Date().toISOString();

      const draft: SpecimenDraft = {
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        source,
        status: "ready-to-annotate",
        resumeStep: source === "single-specimen" ? "images" : "type",
        images,
        recordKind,
        provenance: null,
        locationContext: createEmptyLocationContext(),
        physicalDetails: createEmptyPhysicalDetails(),
        description: createEmptySpecimenDescription(),
        privacySettings: createEmptyPrivacySettings(),
      };

      drafts = [...drafts, draft];

      notifyListeners();

      return draft;
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
