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
import { SettingsScreen } from "./features/workspace/SettingsScreen";

// features/record-find

{
  /* The AddMethodScreen import, render block, and bulk-import state can remain for now. 
  This keeps the excluded batch prototype intact even though normal mobile navigation no longer enters it. */
}
import { AddMethodScreen } from "./features/record-find/AddMethodScreen";
import { BulkImportModal } from "./features/record-find/BulkImportModal";

import { ContributionOnboardingScreen } from "./features/record-find/ContributionOnboardingScreen";
import { DescriptionHelpScreen } from "./features/record-find/DescriptionHelpScreen";
import { LocationContextScreen } from "./features/record-find/LocationContextScreen";
import { PhotoScreen, type PhotoRemovalResult } from "./features/record-find/PhotoScreen";

import { PhysicalDetailsScreen } from "./features/record-find/PhysicalDetailsScreen";
import { PrivacySharingScreen } from "./features/record-find/PrivacySharingScreen";
import { ProvenanceScreen } from "./features/record-find/ProvenanceScreen";
import { RecordTypeScreen } from "./features/record-find/RecordTypeScreen";

import {
  MAX_FIND_PHOTOS,
  type FindPhotoSource,
  type LocalFindPhoto,
  type LocationContext,
  type PhysicalDetails,
  type PrivacySettings,
  type RecordKind,
  type SpecimenDescription,
  type SpecimenDraft,
  type SpecimenDraftImage,
  type SpecimenDraftSource,
  type SpecimenDraftStep,
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

const createEmptyPrivacySettings = (): PrivacySettings => ({
  sharingPreference: "private",
  locationVisibility: "country",
});

const createSpecimenDraft = ({
  source,
  images,
  recordKind = null,
}: {
  source: SpecimenDraftSource;
  images: SpecimenDraftImage[];
  recordKind?: RecordKind | null;
}): SpecimenDraft => {
  const now = new Date().toISOString();

  return {
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
};

function readStoredBoolean(key: string, fallback: boolean) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const storedValue = window.localStorage.getItem(key);

  if (storedValue === null) {
    return fallback;
  }

  return storedValue === "true";
}

function getFileSignature(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

const specimenDraftStepToPrototypeStep: Record<SpecimenDraftStep, PrototypeStep> = {
  images: 7,
  type: 5,
  provenance: 8,
  "find-location": 9,
  "physical-details": 10,
  "identification-observations": 13,
  privacy: 15,
};

function App() {
  const [step, setStep] = useState<PrototypeStep>(0);

  const [specimenDrafts, setSpecimenDrafts] = useState<SpecimenDraft[]>([]);

  const [activeSpecimenDraftId, setActiveSpecimenDraftId] = useState<string | null>(null);

  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  const [addReturnStep, setAddReturnStep] = useState<0>(0);

  const [onboardingReturnStep, setOnboardingReturnStep] = useState<0 | 14>(0);

  const [hasSeenContributionOnboarding, setHasSeenContributionOnboarding] = useState(() =>
    readStoredBoolean("belgian-finds.has-seen-contribution-onboarding", false),
  );

  const [showWorkflowGuidance, setShowWorkflowGuidance] = useState(() =>
    readStoredBoolean("belgian-finds.show-workflow-guidance", true),
  );

  const [showImageGuidance, setShowImageGuidance] = useState(() =>
    readStoredBoolean("belgian-finds.show-image-guidance", true),
  );

  const [settingsReturnStep, setSettingsReturnStep] = useState<PrototypeStep>(0);

  const specimenDraftsRef = useRef<SpecimenDraft[]>([]);

  useEffect(() => {
    window.localStorage.setItem(
      "belgian-finds.has-seen-contribution-onboarding",
      String(hasSeenContributionOnboarding),
    );
  }, [hasSeenContributionOnboarding]);

  useEffect(() => {
    window.localStorage.setItem("belgian-finds.show-workflow-guidance", String(showWorkflowGuidance));
  }, [showWorkflowGuidance]);

  useEffect(() => {
    window.localStorage.setItem("belgian-finds.show-image-guidance", String(showImageGuidance));
  }, [showImageGuidance]);

  const activeSpecimenDraft = specimenDrafts.find((draft) => draft.id === activeSpecimenDraftId);

  /*
   * PhotoScreen currently expects LocalFindPhoto[].
   *
   * A single-specimen draft can contain only camera or existing-device
   * images, so this narrowing is safe. Batch-import images never enter
   * the one-specimen photo editor.
   */
  const activeSingleSpecimenPhotos: LocalFindPhoto[] =
    activeSpecimenDraft?.source === "single-specimen"
      ? activeSpecimenDraft.images.filter(
          (image): image is LocalFindPhoto => image.source === "camera" || image.source === "existing",
        )
      : [];

  useEffect(() => {
    specimenDraftsRef.current = specimenDrafts;
  }, [specimenDrafts]);

  useEffect(() => {
    return () => {
      const previewUrls = new Set(
        specimenDraftsRef.current.flatMap((draft) => draft.images.map((image) => image.previewUrl)),
      );

      previewUrls.forEach((previewUrl) => {
        URL.revokeObjectURL(previewUrl);
      });
    };
  }, []);

  const replaceSpecimenDrafts = (nextDrafts: SpecimenDraft[]) => {
    specimenDraftsRef.current = nextDrafts;
    setSpecimenDrafts(nextDrafts);
  };

  const addFindPhotos = (files: File[], source: FindPhotoSource) => {
    const currentDrafts = specimenDraftsRef.current;

    const currentActiveDraft = currentDrafts.find((draft) => draft.id === activeSpecimenDraftId);

    const activeSingleDraft = currentActiveDraft?.source === "single-specimen" ? currentActiveDraft : null;

    const currentImages = activeSingleDraft?.images ?? [];
    const remainingSlots = MAX_FIND_PHOTOS - currentImages.length;

    if (remainingSlots <= 0) {
      return;
    }

    const existingSignatures = new Set(currentImages.map((image) => getFileSignature(image.file)));

    const newImages: SpecimenDraftImage[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        continue;
      }

      if (newImages.length >= remainingSlots) {
        break;
      }

      const signature = getFileSignature(file);

      if (existingSignatures.has(signature)) {
        continue;
      }

      existingSignatures.add(signature);

      newImages.push({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        source,
      });
    }

    if (newImages.length === 0) {
      return;
    }

    if (activeSingleDraft) {
      const nextDrafts = currentDrafts.map((draft) =>
        draft.id === activeSingleDraft.id
          ? {
              ...draft,
              updatedAt: new Date().toISOString(),
              images: [...draft.images, ...newImages],
            }
          : draft,
      );

      replaceSpecimenDrafts(nextDrafts);
      return;
    }

    /*
     * The private draft now begins with the first accepted image.
     * There is no separate temporary photo collection and no later
     * transfer of object-URL ownership.
     */
    const newDraft = createSpecimenDraft({
      source: "single-specimen",
      images: newImages,
    });

    replaceSpecimenDrafts([...currentDrafts, newDraft]);
    setActiveSpecimenDraftId(newDraft.id);
  };

  const removeFindPhoto = (photoId: string): PhotoRemovalResult => {
    const currentDrafts = specimenDraftsRef.current;

    const currentActiveDraft = currentDrafts.find((draft) => draft.id === activeSpecimenDraftId);

    if (!currentActiveDraft || currentActiveDraft.source !== "single-specimen") {
      return "cancelled";
    }

    const photoToRemove = currentActiveDraft.images.find((image) => image.id === photoId);

    if (!photoToRemove) {
      return "cancelled";
    }

    if (currentActiveDraft.images.length === 1) {
      const shouldDiscardDraft = window.confirm(
        "Removing the final photograph will discard this private draft and any information entered for it. Continue?",
      );

      if (!shouldDiscardDraft) {
        return "cancelled";
      }

      const nextDrafts = currentDrafts.filter((draft) => draft.id !== currentActiveDraft.id);

      replaceSpecimenDrafts(nextDrafts);
      setActiveSpecimenDraftId(null);
      URL.revokeObjectURL(photoToRemove.previewUrl);

      return "draft-discarded";
    }

    const nextDrafts = currentDrafts.map((draft) =>
      draft.id === currentActiveDraft.id
        ? {
            ...draft,
            updatedAt: new Date().toISOString(),
            images: draft.images.filter((image) => image.id !== photoId),
          }
        : draft,
    );

    replaceSpecimenDrafts(nextDrafts);
    URL.revokeObjectURL(photoToRemove.previewUrl);

    return "removed";
  };

  const updateActiveSpecimenDraft = (
    updates: Partial<
      Pick<
        SpecimenDraft,
        | "recordKind"
        | "provenance"
        | "locationContext"
        | "physicalDetails"
        | "description"
        | "privacySettings"
        | "status"
        | "resumeStep"
      >
    >,
  ) => {
    if (!activeSpecimenDraftId) {
      return;
    }

    const nextDrafts = specimenDraftsRef.current.map((draft) =>
      draft.id === activeSpecimenDraftId
        ? {
            ...draft,
            ...updates,
            updatedAt: new Date().toISOString(),
          }
        : draft,
    );

    replaceSpecimenDrafts(nextDrafts);
  };

  const moveActiveDraftToStep = (resumeStep: SpecimenDraftStep, nextStep: PrototypeStep) => {
    if (!activeSpecimenDraftId) {
      return;
    }

    updateActiveSpecimenDraft({
      resumeStep,
    });

    setStep(nextStep);
  };

  const saveActiveDraftForLater = (resumeStep: SpecimenDraftStep) => {
    if (!activeSpecimenDraftId) {
      setStep(0);
      return;
    }

    updateActiveSpecimenDraft({
      resumeStep,
    });

    setActiveSpecimenDraftId(null);
    setStep(0);
  };

  const resumeSpecimenDraft = (draftId: string) => {
    const draft = specimenDraftsRef.current.find((candidate) => candidate.id === draftId);

    if (!draft) {
      return;
    }

    setIsBulkImportOpen(false);
    setActiveSpecimenDraftId(draft.id);
    setStep(specimenDraftStepToPrototypeStep[draft.resumeStep]);
  };

  const finishPrivacyForCurrentSlice = () => {
    if (!activeSpecimenDraftId) {
      return;
    }

    updateActiveSpecimenDraft({
      status: "ready-for-review",
      resumeStep: "privacy",
    });

    setActiveSpecimenDraftId(null);
    setStep(0);
  };

  const finishSingleFindImageIntake = () => {
    const currentActiveDraft = specimenDraftsRef.current.find((draft) => draft.id === activeSpecimenDraftId);

    if (
      !currentActiveDraft ||
      currentActiveDraft.source !== "single-specimen" ||
      currentActiveDraft.images.length === 0
    ) {
      return;
    }

    updateActiveSpecimenDraft({
      status: "annotation-in-progress",
      resumeStep: "type",
    });

    setStep(5);
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

    replaceSpecimenDrafts([...specimenDraftsRef.current, ...newDrafts]);

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
      resumeStep: "type",
    });

    setStep(5);
  };

  const closeBulkImport = () => {
    setIsBulkImportOpen(false);
  };

  const startSingleFindJourney = () => {
    /*
     * Existing drafts remain untouched. The first accepted image will
     * create and activate a new single-specimen draft.
     */
    setActiveSpecimenDraftId(null);
    setStep(7);
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
        setStep(onboardingReturnStep);
        return;

      case 5:
        moveActiveDraftToStep("images", 7);
        return;

      case 6:
        setStep(3);
        return;

      case 7:
        if (activeSpecimenDraft) {
          saveActiveDraftForLater("images");
          return;
        }

        setStep(0);
        return;

      case 8:
        moveActiveDraftToStep("type", 5);
        return;

      case 9:
        moveActiveDraftToStep("provenance", 8);
        return;

      case 10:
        moveActiveDraftToStep("find-location", 9);
        return;

      case 11:
        setStep(0);
        return;

      case 12:
        setStep(0);
        return;

      case 13:
        moveActiveDraftToStep("physical-details", 10);
        return;

      case 14:
        setStep(settingsReturnStep);
        return;

      case 15:
        moveActiveDraftToStep("identification-observations", 13);
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
        setStep(7);
        return;

      case 4:
        finishContributionOnboarding();
        return;

      case 5:
        if (activeSpecimenDraft?.recordKind) {
          moveActiveDraftToStep("provenance", 8);
        }
        return;

      case 6:
        setStep(3);
        return;

      case 7:
        finishSingleFindImageIntake();
        return;

      case 8:
        if (activeSpecimenDraft?.provenance) {
          moveActiveDraftToStep("find-location", 9);
        }
        return;

      case 9:
        if (activeSpecimenDraft?.locationContext.knowledge) {
          moveActiveDraftToStep("physical-details", 10);
        }
        return;

      case 10:
        if (activeSpecimenDraft?.physicalDetails.measurementStatus) {
          moveActiveDraftToStep("identification-observations", 13);
        }
        return;

      case 13:
        moveActiveDraftToStep("privacy", 15);
        return;

      case 11:
        setAddReturnStep(0);
        setStep(3);
        return;

      case 12:
        setStep(0);
        return;

      case 14:
        setStep(settingsReturnStep);
        return;

      case 15:
        finishPrivacyForCurrentSlice();
        return;
    }
  };

  const showMemberHome = () => {
    setIsBulkImportOpen(false);

    /*
     * Draft values are already stored as fields change. Leaving the flow
     * therefore keeps the current draft without copying or transferring
     * its images.
     */
    setActiveSpecimenDraftId(null);
    setStep(0);
  };

  const showExplore = () => {
    setIsBulkImportOpen(false);
    setStep(1);
  };

  const openAddJourney = () => {
    setIsBulkImportOpen(false);
    setAddReturnStep(0);

    if (hasSeenContributionOnboarding) {
      startSingleFindJourney();
      return;
    }

    setOnboardingReturnStep(0);
    setStep(4);
  };

  const openAddFromMySpecimens = () => {
    openAddJourney();
  };

  const finishContributionOnboarding = () => {
    setHasSeenContributionOnboarding(true);

    if (onboardingReturnStep === 14) {
      setStep(14);
      return;
    }

    startSingleFindJourney();
  };

  const dismissContributionOnboarding = () => {
    setHasSeenContributionOnboarding(true);
    setStep(onboardingReturnStep);
  };

  const openSettings = () => {
    setIsBulkImportOpen(false);
    setSettingsReturnStep(step);
    setStep(14);
  };

  const reviewContributionScope = () => {
    setIsBulkImportOpen(false);
    setOnboardingReturnStep(14);
    setStep(4);
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
              onExplore={showExplore}
              onAdd={openAddJourney}
              onMySpecimens={showMemberHome}
              onSettings={openSettings}
            />
          }
          overlay={
            isBulkImportOpen ? (
              <BulkImportModal
                showWorkflowGuidance={showWorkflowGuidance}
                onClose={closeBulkImport}
                onAddToQueue={addBatchDraftsToQueue}
              />
            ) : null
          }>
          {step === 0 && (
            <WelcomeScreen
              drafts={specimenDrafts}
              onResumeSpecimen={resumeSpecimenDraft}
              onAddSpecimen={openAddFromMySpecimens}
            />
          )}

          {step === 1 && <BrowseScreen onOpenFind={() => setStep(2)} />}

          {step === 2 && <FindDetailScreen onBack={() => setStep(1)} />}

          {step === 14 && (
            <SettingsScreen
              showWorkflowGuidance={showWorkflowGuidance}
              showImageGuidance={showImageGuidance}
              onShowWorkflowGuidanceChange={setShowWorkflowGuidance}
              onShowImageGuidanceChange={setShowImageGuidance}
              onReviewContributionScope={reviewContributionScope}
              onBack={() => setStep(settingsReturnStep)}
            />
          )}

          {step === 12 && (
            <SpecimenQueueScreen
              drafts={specimenDrafts}
              activeDraftId={activeSpecimenDraftId}
              onSelectDraft={setActiveSpecimenDraftId}
              onStartAnnotation={startAnnotation}
              onBack={() => setStep(11)}
              onAddMaterial={openAddFromMySpecimens}
            />
          )}

          {step === 3 && (
            <AddMethodScreen
              onRecordOne={startSingleFindJourney}
              onImportBatch={() => setIsBulkImportOpen(true)}
              onCancel={() => setStep(addReturnStep)}
            />
          )}

          {step === 4 && (
            <ContributionOnboardingScreen
              returnToSettings={onboardingReturnStep === 14}
              onContinue={finishContributionOnboarding}
              onCancel={dismissContributionOnboarding}
            />
          )}

          {step === 5 && activeSpecimenDraft && (
            <RecordTypeScreen
              selectedKind={activeSpecimenDraft.recordKind}
              onSelect={(recordKind) =>
                updateActiveSpecimenDraft({
                  recordKind,
                })
              }
              onBack={() => moveActiveDraftToStep("images", 7)}
              onContinue={() => moveActiveDraftToStep("provenance", 8)}
              onSaveForLater={() => saveActiveDraftForLater("type")}
            />
          )}

          {step === 7 && (
            <PhotoScreen
              photos={activeSingleSpecimenPhotos}
              onAddPhotos={addFindPhotos}
              onRemovePhoto={removeFindPhoto}
              onBack={() => {
                if (activeSpecimenDraft) {
                  saveActiveDraftForLater("images");
                  return;
                }

                setStep(0);
              }}
              onContinue={finishSingleFindImageIntake}
              onSaveForLater={() => saveActiveDraftForLater("images")}
              showImageGuidance={showImageGuidance}
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
              onBack={() => moveActiveDraftToStep("type", 5)}
              onContinue={() => moveActiveDraftToStep("find-location", 9)}
              onSaveForLater={() => saveActiveDraftForLater("provenance")}
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
              onBack={() => moveActiveDraftToStep("provenance", 8)}
              onContinue={() => moveActiveDraftToStep("physical-details", 10)}
              onSaveForLater={() => saveActiveDraftForLater("find-location")}
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
              onBack={() => moveActiveDraftToStep("find-location", 9)}
              onContinue={() => moveActiveDraftToStep("identification-observations", 13)}
              onSaveForLater={() => saveActiveDraftForLater("physical-details")}
            />
          )}

          {step === 13 && activeSpecimenDraft && (
            <DescriptionHelpScreen
              showWorkflowGuidance={showWorkflowGuidance}
              value={activeSpecimenDraft.description}
              onChange={(description) =>
                updateActiveSpecimenDraft({
                  description,
                })
              }
              onBack={() => moveActiveDraftToStep("physical-details", 10)}
              onFinish={() => moveActiveDraftToStep("privacy", 15)}
              onSaveForLater={() => saveActiveDraftForLater("identification-observations")}
            />
          )}

          {step === 15 && activeSpecimenDraft && (
            <PrivacySharingScreen
              value={activeSpecimenDraft.privacySettings}
              onChange={(privacySettings) =>
                updateActiveSpecimenDraft({
                  privacySettings,
                })
              }
              onBack={() => moveActiveDraftToStep("identification-observations", 13)}
              onFinish={finishPrivacyForCurrentSlice}
              onSaveForLater={() => saveActiveDraftForLater("privacy")}
            />
          )}
        </PhoneFrame>

        <NotesPanel
          step={step}
          onPrevious={goToPreviousStep}
          onNext={goToNextStep}
          nextDisabled={
            (step === 5 && activeSpecimenDraft?.recordKind === null) ||
            (step === 7 && activeSingleSpecimenPhotos.length === 0) ||
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
