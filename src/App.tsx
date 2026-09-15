import { useEffect, useRef, useState } from "react";
// components
import { BottomNavigation } from "./components/BottomNavigation";
import { NotesPanel } from "./components/NotesPanel";
import { PhoneFrame } from "./components/PhoneFrame";
// explore
import { BrowseScreen } from "./features/explore/BrowseScreen";
import { FindDetailScreen } from "./features/explore/FindDetailScreen";
import { WelcomeScreen } from "./features/explore/WelcomeScreen";
// features/workspace
import { SpecimenQueueScreen } from "./features/workspace/SpecimenQueueScreen";
import { WorkspaceScreen } from "./features/workspace/WorkspaceScreen";
// features/record-find
import { AddMethodScreen } from "./features/record-find/AddMethodScreen";
import { BulkImportModal } from "./features/record-find/BulkImportModal";
import { CollectionImportIntroScreen } from "./features/record-find/CollectionImportIntroScreen";
import { LocationContextScreen } from "./features/record-find/LocationContextScreen";
import { PhotoScreen } from "./features/record-find/PhotoScreen";
import { PhysicalDetailsScreen } from "./features/record-find/PhysicalDetailsScreen";
import { ProvenanceScreen } from "./features/record-find/ProvenanceScreen";
import { RecordIntroScreen } from "./features/record-find/RecordIntroScreen";
import { RecordTypeScreen } from "./features/record-find/RecordTypeScreen";
import { DescriptionHelpScreen } from "./features/record-find/DescriptionHelpScreen";

import {
  MAX_FIND_PHOTOS,
  type FindPhotoSource,
  type LocalFindPhoto,
  type LocationContext,
  type PhysicalDetails,
  type RecordKind,
  type SpecimenDescription,
  type SpecimenDraft,
  type SpecimenDraftImage,
  type SpecimenDraftSource,
} from "./features/record-find/types";
import type { PrototypeStep } from "./prototype/types";

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

const createSpecimenDraft = ({
  source,
  images,
  recordKind = null,
}: {
  source: SpecimenDraftSource;
  images: SpecimenDraftImage[];
  recordKind?: RecordKind | null;
}): SpecimenDraft => ({
  id: crypto.randomUUID(),
  createdAt: new Date().toISOString(),
  source,
  status: "ready-to-annotate",
  images,
  recordKind,
  provenance: null,
  locationContext: createEmptyLocationContext(),
  physicalDetails: createEmptyPhysicalDetails(),
  description: createEmptySpecimenDescription(),
});

function App() {
  const [step, setStep] = useState<PrototypeStep>(0);

  const [findPhotos, setFindPhotos] = useState<LocalFindPhoto[]>([]);

  const [specimenDrafts, setSpecimenDrafts] = useState<SpecimenDraft[]>([]);

  const [activeSpecimenDraftId, setActiveSpecimenDraftId] = useState<string | null>(null);

  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  const [addReturnStep, setAddReturnStep] = useState<0 | 11>(0);

  const findPhotosRef = useRef<LocalFindPhoto[]>([]);
  const specimenDraftsRef = useRef<SpecimenDraft[]>([]);

  const activeSpecimenDraft = specimenDrafts.find((draft) => draft.id === activeSpecimenDraftId);

  useEffect(() => {
    findPhotosRef.current = findPhotos;
  }, [findPhotos]);

  useEffect(() => {
    specimenDraftsRef.current = specimenDrafts;
  }, [specimenDrafts]);

  useEffect(() => {
    return () => {
      const previewUrls = new Set([
        ...findPhotosRef.current.map((photo) => photo.previewUrl),
        ...specimenDraftsRef.current.flatMap((draft) => draft.images.map((image) => image.previewUrl)),
      ]);

      previewUrls.forEach((previewUrl) => {
        URL.revokeObjectURL(previewUrl);
      });
    };
  }, []);

  const addFindPhotos = (files: File[], source: FindPhotoSource) => {
    setFindPhotos((currentPhotos) => {
      const remainingSlots = MAX_FIND_PHOTOS - currentPhotos.length;

      if (remainingSlots <= 0) {
        return currentPhotos;
      }

      const existingSignatures = new Set(
        currentPhotos.map((photo) => `${photo.file.name}-${photo.file.size}-${photo.file.lastModified}`),
      );

      const newPhotos: LocalFindPhoto[] = [];

      for (const file of files) {
        if (!file.type.startsWith("image/") || newPhotos.length >= remainingSlots) {
          continue;
        }

        const signature = `${file.name}-${file.size}-${file.lastModified}`;

        if (existingSignatures.has(signature)) {
          continue;
        }

        existingSignatures.add(signature);

        newPhotos.push({
          id: crypto.randomUUID(),
          file,
          previewUrl: URL.createObjectURL(file),
          source,
        });
      }

      const nextPhotos = [...currentPhotos, ...newPhotos];

      findPhotosRef.current = nextPhotos;

      return nextPhotos;
    });
  };

  const removeFindPhoto = (photoId: string) => {
    setFindPhotos((currentPhotos) => {
      const photoToRemove = currentPhotos.find((photo) => photo.id === photoId);

      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.previewUrl);
      }

      const remainingPhotos = currentPhotos.filter((photo) => photo.id !== photoId);

      findPhotosRef.current = remainingPhotos;

      return remainingPhotos;
    });
  };

  const clearSingleFind = () => {
    findPhotosRef.current.forEach((photo) => {
      URL.revokeObjectURL(photo.previewUrl);
    });

    findPhotosRef.current = [];
    setFindPhotos([]);
  };

  const updateActiveSpecimenDraft = (
    updates: Partial<
      Pick<
        SpecimenDraft,
        "recordKind" | "provenance" | "locationContext" | "physicalDetails" | "description" | "status"
      >
    >,
  ) => {
    if (!activeSpecimenDraftId) {
      return;
    }

    setSpecimenDrafts((currentDrafts) =>
      currentDrafts.map((draft) =>
        draft.id === activeSpecimenDraftId
          ? {
              ...draft,
              ...updates,
            }
          : draft,
      ),
    );
  };

  const addSingleFindToQueue = () => {
    if (findPhotos.length === 0) {
      return;
    }

    const draft = createSpecimenDraft({
      source: "single-specimen",
      images: findPhotos,
    });

    setSpecimenDrafts((currentDrafts) => [...currentDrafts, draft]);

    setActiveSpecimenDraftId(draft.id);

    /*
     * Ownership of these preview URLs transfers from the temporary
     * image-intake flow to the local specimen draft.
     */
    findPhotosRef.current = [];
    setFindPhotos([]);

    setStep(12);
  };

  const addBatchDraftsToQueue = (draftImageSets: SpecimenDraftImage[][]) => {
    const newDrafts = draftImageSets
      .filter((imageSet) => imageSet.length > 0)
      .map((images) =>
        createSpecimenDraft({
          source: "batch-import",
          images,
        }),
      );

    if (newDrafts.length === 0) {
      return;
    }

    setSpecimenDrafts((currentDrafts) => [...currentDrafts, ...newDrafts]);

    setActiveSpecimenDraftId(newDrafts[0].id);
    setIsBulkImportOpen(false);
    setStep(12);
  };

  const startAnnotation = () => {
    if (!activeSpecimenDraft) {
      return;
    }

    updateActiveSpecimenDraft({
      status: "annotation-in-progress",
    });

    setStep(5);
  };

  const closeBulkImport = () => {
    setIsBulkImportOpen(false);
  };

  const startSingleFindJourney = () => {
    clearSingleFind();
    setStep(4);
  };

  const goToPreviousStep = () => {
    setIsBulkImportOpen(false);

    switch (step) {
      case 0:
        return;

      case 1:
        setStep(0);
        return;

      case 2:
        setStep(1);
        return;

      case 3:
        setStep(addReturnStep);
        return;

      case 4:
        setStep(3);
        return;

      case 5:
        setStep(12);
        return;

      case 6:
        setStep(3);
        return;

      case 7:
        setStep(4);
        return;

      case 8:
        setStep(5);
        return;

      case 9:
        setStep(8);
        return;

      case 10:
        setStep(9);
        return;

      case 11:
        setStep(0);
        return;

      case 12:
        setStep(11);
        return;

      case 13:
        setStep(10);
        return;
    }
  };

  const goToNextStep = () => {
    setIsBulkImportOpen(false);

    switch (step) {
      case 0:
        setStep(1);
        return;

      case 1:
        setStep(2);
        return;

      case 2:
        setStep(0);
        return;

      case 3:
        setStep(4);
        return;

      case 4:
        setStep(7);
        return;

      case 5:
        if (activeSpecimenDraft?.recordKind) {
          setStep(8);
        }
        return;

      case 6:
        setStep(3);
        return;

      case 7:
        addSingleFindToQueue();
        return;

      case 8:
        if (activeSpecimenDraft?.provenance) {
          setStep(9);
        }
        return;

      case 9:
        if (activeSpecimenDraft?.locationContext.knowledge) {
          setStep(10);
        }
        return;

      case 10:
        setStep(13);
        return;

      case 13:
        setStep(12);
        return;

      case 11:
        setAddReturnStep(11);
        setStep(3);
        return;

      case 12:
        setStep(11);
        return;
    }
  };

  const showWelcome = () => {
    setIsBulkImportOpen(false);
    setStep(0);
  };

  const openAddJourney = () => {
    setIsBulkImportOpen(false);

    setAddReturnStep(step === 11 || step === 12 ? 11 : 0);

    setStep(3);
  };

  const openAddFromWorkspace = () => {
    setIsBulkImportOpen(false);
    setAddReturnStep(11);
    setStep(3);
  };

  return (
    <main className="prototype-shell">
      <header className="prototype-header">
        <div>
          <p className="eyebrow">Technical prototype</p>
          <h1>Belgian Fossil Finds</h1>
        </div>

        <span className="prototype-status">Mock data · No live submissions</span>
      </header>

      <section className="prototype-workspace">
        <PhoneFrame
          screenKey={step}
          navigation={
            <BottomNavigation
              step={step}
              onExplore={showWelcome}
              onAdd={openAddJourney}
              onWorkspace={() => setStep(11)}
            />
          }
          overlay={
            isBulkImportOpen ? <BulkImportModal onClose={closeBulkImport} onAddToQueue={addBatchDraftsToQueue} /> : null
          }>
          {step === 0 && (
            <WelcomeScreen
              onBrowse={() => setStep(1)}
              onOpenFind={() => setStep(2)}
              onOpenWorkspace={() => setStep(11)}
            />
          )}

          {step === 1 && <BrowseScreen onOpenFind={() => setStep(2)} />}

          {step === 2 && <FindDetailScreen onBack={() => setStep(1)} />}

          {step === 11 && (
            <WorkspaceScreen
              queueCount={specimenDrafts.length}
              onOpenQueue={() => setStep(12)}
              onAddMaterial={openAddFromWorkspace}
              onExplore={showWelcome}
            />
          )}

          {step === 12 && (
            <SpecimenQueueScreen
              drafts={specimenDrafts}
              activeDraftId={activeSpecimenDraftId}
              onSelectDraft={setActiveSpecimenDraftId}
              onStartAnnotation={startAnnotation}
              onBack={() => setStep(11)}
              onAddMaterial={openAddFromWorkspace}
            />
          )}

          {step === 3 && (
            <AddMethodScreen
              onRecordOne={startSingleFindJourney}
              onImportBatch={() => setStep(6)}
              onCancel={() => setStep(addReturnStep)}
            />
          )}

          {step === 4 && <RecordIntroScreen onStart={() => setStep(7)} onCancel={() => setStep(3)} />}

          {step === 5 && activeSpecimenDraft && (
            <RecordTypeScreen
              selectedKind={activeSpecimenDraft.recordKind}
              onSelect={(recordKind) =>
                updateActiveSpecimenDraft({
                  recordKind,
                })
              }
              onBack={() => setStep(12)}
              onContinue={() => setStep(8)}
            />
          )}

          {step === 6 && (
            <CollectionImportIntroScreen
              onBack={() => setStep(3)}
              onExplore={showWelcome}
              onOpenImport={() => setIsBulkImportOpen(true)}
            />
          )}

          {step === 7 && (
            <PhotoScreen
              photos={findPhotos}
              onAddPhotos={addFindPhotos}
              onRemovePhoto={removeFindPhoto}
              onBack={() => setStep(4)}
              onAddToQueue={addSingleFindToQueue}
            />
          )}

          {step === 8 && activeSpecimenDraft && (
            <ProvenanceScreen
              selectedProvenance={activeSpecimenDraft.provenance}
              onSelect={(provenance) =>
                updateActiveSpecimenDraft({
                  provenance,
                })
              }
              onBack={() => setStep(5)}
              onContinue={() => setStep(9)}
            />
          )}

          {step === 9 && activeSpecimenDraft && activeSpecimenDraft.provenance && (
            <LocationContextScreen
              provenance={activeSpecimenDraft.provenance}
              value={activeSpecimenDraft.locationContext}
              onChange={(locationContext) =>
                updateActiveSpecimenDraft({
                  locationContext,
                })
              }
              onBack={() => setStep(8)}
              onContinue={() => setStep(10)}
            />
          )}

          {step === 10 && activeSpecimenDraft && activeSpecimenDraft.recordKind && (
            <PhysicalDetailsScreen
              recordKind={activeSpecimenDraft.recordKind}
              value={activeSpecimenDraft.physicalDetails}
              onChange={(physicalDetails) =>
                updateActiveSpecimenDraft({
                  physicalDetails,
                })
              }
              onBack={() => setStep(9)}
              onFinish={() => setStep(13)}
            />
          )}

          {step === 13 && activeSpecimenDraft && (
            <DescriptionHelpScreen
              value={activeSpecimenDraft.description}
              onChange={(description) =>
                updateActiveSpecimenDraft({
                  description,
                })
              }
              onBack={() => setStep(10)}
              onFinish={() => setStep(12)}
            />
          )}
        </PhoneFrame>

        <NotesPanel
          step={step}
          onPrevious={goToPreviousStep}
          onNext={goToNextStep}
          nextDisabled={
            (step === 5 && activeSpecimenDraft?.recordKind === null) ||
            (step === 7 && findPhotos.length === 0) ||
            (step === 8 && activeSpecimenDraft?.provenance === null) ||
            (step === 9 && activeSpecimenDraft?.locationContext.knowledge === null) ||
            (step === 10 && activeSpecimenDraft?.physicalDetails.measurementStatus === null)
          }
        />
      </section>
    </main>
  );
}

export default App;
