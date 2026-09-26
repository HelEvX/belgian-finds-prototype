import { useEffect, useState } from "react";

// components
import { BottomNavigation } from "./components/BottomNavigation";
import { DesktopFrame, type DesktopSection } from "./components/DesktopFrame";

import { NotesPanel } from "./components/NotesPanel";
import { PhoneFrame } from "./components/PhoneFrame";
import { AccountMenu } from "./components/AccountMenu";

// explore
import { BrowseScreen } from "./features/explore/BrowseScreen";
import { DesktopSpecimensScreen } from "./features/explore/DesktopSpecimensScreen";
import { FindDetailScreen } from "./features/explore/FindDetailScreen";
import { WelcomeScreen } from "./features/explore/WelcomeScreen";

// features/import-catalogue
import { CatalogueImportIntroScreen } from "./features/import-catalogue/CatalogueImportIntroScreen";
import type {
  FossilTemplateInspection,
  FossilTemplateInspectionRow,
} from "./features/import-catalogue/fossilCatalogueImport";
import type { CatalogueImportSession } from "./features/import-catalogue/catalogueImportTypes";
import { catalogueImportSessionService } from "./services/catalogueImportSessionService";

// features/account
import { SettingsScreen } from "./features/account/SettingsScreen";

// features/updates
import { UpdatesScreen } from "./features/updates/UpdatesScreen";

// features/access
import { SignInPrompt } from "./features/access/SignInPrompt";
import { PrototypeModeScreen } from "./features/access/PrototypeModeScreen";

// features/record-find
import { ContributionOnboardingScreen } from "./features/record-find/ContributionOnboardingScreen";
import { DescriptionHelpScreen } from "./features/record-find/DescriptionHelpScreen";
import { LocationContextScreen } from "./features/record-find/LocationContextScreen";
import { PhotoScreen } from "./features/record-find/PhotoScreen";

import { PhysicalDetailsScreen } from "./features/record-find/PhysicalDetailsScreen";
import { PrivacySharingScreen } from "./features/record-find/PrivacySharingScreen";
import { ProvenanceScreen } from "./features/record-find/ProvenanceScreen";
import { RecordTypeScreen } from "./features/record-find/RecordTypeScreen";
import { ReviewSpecimenScreen } from "./features/record-find/ReviewSpecimenScreen";

import {
  MAX_FIND_PHOTOS,
  type FindPhotoSource,
  type LocalFindPhoto,
  type SpecimenDraft,
  type SpecimenDraftImage,
  type SpecimenDraftStep,
} from "./features/record-find/types";

import { specimenService, type SpecimenDraftUpdate } from "./services/specimenService";

import type { PrototypeStep } from "./prototype/types";

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

type PrototypeMode = "guest" | "member";

type PrototypeViewport = "mobile" | "desktop";

type SignInPromptState = {
  title: string;
  description: string;
  returnStep: 1 | 2;
};

function App() {
  const [step, setStep] = useState<PrototypeStep>(18);

  const [prototypeViewport, setPrototypeViewport] = useState<PrototypeViewport>("mobile");

  const [desktopSection, setDesktopSection] = useState<DesktopSection>("specimens");

  const [specimenDrafts, setSpecimenDrafts] = useState<SpecimenDraft[]>(() => specimenService.list());

  const [catalogueImportSessions, setCatalogueImportSessions] = useState<CatalogueImportSession[]>(() =>
    catalogueImportSessionService.list(),
  );

  const [activeCatalogueImportSessionId, setActiveCatalogueImportSessionId] = useState<string | null>(null);

  const [activeSpecimenDraftId, setActiveSpecimenDraftId] = useState<string | null>(null);

  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const [prototypeMode, setPrototypeMode] = useState<PrototypeMode | null>(null);

  const [signInPrompt, setSignInPrompt] = useState<SignInPromptState | null>(null);

  const isGuest = prototypeMode === "guest";

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

  const [returnToReviewAfterEdit, setReturnToReviewAfterEdit] = useState(false);

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

  const activeCatalogueImportSession =
    catalogueImportSessions.find((session) => session.id === activeCatalogueImportSessionId) ?? null;

  /*
   * PhotoScreen expects LocalFindPhoto[].
   *
   * Imported catalogue records begin without images, but once a member
   * attaches camera or existing-device images, they use this same shape.
   * The future desktop image-matching workflow can replace this entry
   * point without changing draft ownership.
   */
  const activeEditablePhotos: LocalFindPhoto[] = activeSpecimenDraft
    ? activeSpecimenDraft.images.filter(
        (image): image is LocalFindPhoto => image.source === "camera" || image.source === "existing",
      )
    : [];

  useEffect(() => {
    return specimenService.subscribe((drafts) => {
      setSpecimenDrafts(drafts);
    });
  }, []);

  useEffect(() => {
    return catalogueImportSessionService.subscribe((sessions) => {
      setCatalogueImportSessions(sessions);
    });
  }, []);

  useEffect(() => {
    return () => {
      const previewUrls = new Set(
        specimenService.list().flatMap((draft) => draft.images.map((image) => image.previewUrl)),
      );

      previewUrls.forEach((previewUrl) => {
        URL.revokeObjectURL(previewUrl);
      });
    };
  }, []);

  const addFindPhotos = (files: File[], source: FindPhotoSource) => {
    const currentActiveDraft = activeSpecimenDraftId ? specimenService.getById(activeSpecimenDraftId) : undefined;

    const activePhotoDraft =
      currentActiveDraft && currentActiveDraft.source !== "batch-import" ? currentActiveDraft : null;

    const currentImages = activePhotoDraft?.images ?? [];

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

    if (activePhotoDraft) {
      specimenService.update(activePhotoDraft.id, {
        images: [...activePhotoDraft.images, ...newImages],
      });

      return;
    }

    /*
     * The private draft begins with the first accepted image.
     * There is no temporary photo collection and no later transfer
     * of object-URL ownership.
     */
    const newDraft = specimenService.create({
      source: "single-specimen",
      images: newImages,
    });

    setActiveSpecimenDraftId(newDraft.id);
  };

  const removeFindPhoto = (photoId: string): boolean => {
    const currentActiveDraft = activeSpecimenDraftId ? specimenService.getById(activeSpecimenDraftId) : undefined;

    if (!currentActiveDraft || currentActiveDraft.source === "batch-import") {
      return false;
    }

    const photoToRemove = currentActiveDraft.images.find((image) => image.id === photoId);

    if (!photoToRemove) {
      return false;
    }

    const remainingImages = currentActiveDraft.images.filter((image) => image.id !== photoId);

    const nextStatus =
      currentActiveDraft.status === "ready-for-review" || currentActiveDraft.status === "private-specimen"
        ? "annotation-in-progress"
        : currentActiveDraft.status;

    specimenService.update(currentActiveDraft.id, {
      images: remainingImages,
      resumeStep: "images",
      status: nextStatus,
    });

    URL.revokeObjectURL(photoToRemove.previewUrl);

    return true;
  };

  const updateActiveSpecimenDraft = (updates: SpecimenDraftUpdate) => {
    if (!activeSpecimenDraftId) {
      return;
    }

    specimenService.update(activeSpecimenDraftId, updates);
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
      setReturnToReviewAfterEdit(false);
      setStep(0);
      return;
    }

    const currentDraft = specimenService.getById(activeSpecimenDraftId);

    updateActiveSpecimenDraft({
      resumeStep,
      status:
        currentDraft?.status === "ready-for-review" || currentDraft?.status === "private-specimen"
          ? "annotation-in-progress"
          : currentDraft?.status,
    });

    setReturnToReviewAfterEdit(false);
    setActiveSpecimenDraftId(null);
    setStep(0);
  };

  const returnToReviewFromEdit = () => {
    const currentDraft = activeSpecimenDraftId ? specimenService.getById(activeSpecimenDraftId) : undefined;

    if (!currentDraft) {
      setReturnToReviewAfterEdit(false);
      setStep(0);
      return;
    }

    /*
     * Removing the final image changes a reviewable or saved specimen
     * back to an in-progress draft. If an image has since been restored,
     * it can return to Ready for review.
     */
    if (currentDraft.images.length > 0 && currentDraft.status === "annotation-in-progress") {
      updateActiveSpecimenDraft({
        status: "ready-for-review",
      });
    }

    setReturnToReviewAfterEdit(false);
    setStep(16);
  };

  const editActiveSpecimenFromReview = (resumeStep: SpecimenDraftStep) => {
    if (!activeSpecimenDraftId) {
      return;
    }

    setReturnToReviewAfterEdit(true);
    setStep(specimenDraftStepToPrototypeStep[resumeStep]);
  };

  const openReviewFromPrivacy = () => {
    if (!activeSpecimenDraftId) {
      return;
    }

    updateActiveSpecimenDraft({
      status: "ready-for-review",
      resumeStep: "privacy",
    });

    setReturnToReviewAfterEdit(false);
    setStep(16);
  };

  const savePrivateSpecimen = () => {
    const currentDraft = activeSpecimenDraftId ? specimenService.getById(activeSpecimenDraftId) : undefined;

    if (!currentDraft || currentDraft.images.length === 0) {
      return;
    }

    updateActiveSpecimenDraft({
      status: "private-specimen",
      resumeStep: "privacy",
    });

    setReturnToReviewAfterEdit(false);
    setActiveSpecimenDraftId(null);
    setStep(0);
  };

  const resumeSpecimenDraft = (draftId: string) => {
    const draft = specimenService.getById(draftId);

    if (!draft) {
      return;
    }

    setReturnToReviewAfterEdit(false);
    setActiveSpecimenDraftId(draft.id);

    if (draft.status === "ready-for-review" || draft.status === "private-specimen") {
      setStep(16);
      return;
    }

    setStep(specimenDraftStepToPrototypeStep[draft.resumeStep]);
  };

  const finishSingleFindImageIntake = () => {
    const currentActiveDraft = activeSpecimenDraftId ? specimenService.getById(activeSpecimenDraftId) : undefined;

    if (!currentActiveDraft || currentActiveDraft.source === "batch-import" || currentActiveDraft.images.length === 0) {
      return;
    }

    const nextResumeStep = currentActiveDraft.source === "catalogue-import" ? "provenance" : "type";

    updateActiveSpecimenDraft({
      status: "annotation-in-progress",
      resumeStep: nextResumeStep,
    });

    setStep(nextResumeStep === "provenance" ? 8 : 5);
  };

  const startSingleFindJourney = () => {
    /*
     * Existing drafts remain untouched. The first accepted image will
     * create and activate a new single-specimen draft.
     */
    setReturnToReviewAfterEdit(false);
    setActiveSpecimenDraftId(null);
    setStep(7);
  };

  const goToPreviousStep = () => {
    setIsAccountMenuOpen(false);
    setSignInPrompt(null);

    switch (step) {
      case 0:
        return;

      case 1:
        setStep(0);
        return;

      case 2:
        setStep(1);
        return;

      case 4:
        setStep(onboardingReturnStep);
        return;

      case 5:
        moveActiveDraftToStep("images", 7);
        return;

      case 7:
        if (activeSpecimenDraft) {
          saveActiveDraftForLater("images");
          return;
        }

        setStep(0);
        return;

      case 8:
        if (activeSpecimenDraft?.source === "catalogue-import") {
          moveActiveDraftToStep("images", 7);
          return;
        }

        moveActiveDraftToStep("type", 5);
        return;

      case 9:
        moveActiveDraftToStep("provenance", 8);
        return;

      case 10:
        moveActiveDraftToStep("find-location", 9);
        return;

      case 13:
        if (returnToReviewAfterEdit) {
          returnToReviewFromEdit();
          return;
        }

        moveActiveDraftToStep("physical-details", 10);
        return;

      case 14:
        setStep(settingsReturnStep);
        return;

      case 15:
        if (returnToReviewAfterEdit) {
          returnToReviewFromEdit();
          return;
        }

        moveActiveDraftToStep("identification-observations", 13);
        return;

      case 16:
        editActiveSpecimenFromReview("privacy");
        return;

      case 17:
        setStep(0);
        return;

      case 18:
        return;
    }
  };

  const goToNextStep = () => {
    setIsAccountMenuOpen(false);
    setSignInPrompt(null);

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

      case 4:
        finishContributionOnboarding();
        return;

      case 5:
        if (!activeSpecimenDraft?.recordKind) {
          return;
        }

        if (returnToReviewAfterEdit) {
          returnToReviewFromEdit();
          return;
        }

        moveActiveDraftToStep("provenance", 8);
        return;

      case 7:
        if (activeEditablePhotos.length === 0) {
          return;
        }

        if (returnToReviewAfterEdit) {
          returnToReviewFromEdit();
          return;
        }

        finishSingleFindImageIntake();
        return;

      case 8:
        if (!activeSpecimenDraft?.provenance) {
          return;
        }

        if (returnToReviewAfterEdit) {
          returnToReviewFromEdit();
          return;
        }

        moveActiveDraftToStep("find-location", 9);
        return;

      case 9:
        if (!activeSpecimenDraft?.locationContext.knowledge) {
          return;
        }

        if (returnToReviewAfterEdit) {
          returnToReviewFromEdit();
          return;
        }

        moveActiveDraftToStep("physical-details", 10);
        return;

      case 10:
        if (!activeSpecimenDraft?.physicalDetails.measurementStatus) {
          return;
        }

        if (returnToReviewAfterEdit) {
          returnToReviewFromEdit();
          return;
        }

        moveActiveDraftToStep("identification-observations", 13);
        return;

      case 13:
        if (returnToReviewAfterEdit) {
          returnToReviewFromEdit();
          return;
        }

        moveActiveDraftToStep("privacy", 15);
        return;

      case 14:
        setStep(settingsReturnStep);
        return;

      case 15:
        if (returnToReviewAfterEdit) {
          returnToReviewFromEdit();
          return;
        }

        openReviewFromPrivacy();
        return;

      case 16:
        savePrivateSpecimen();
        return;

      case 17:
        setStep(0);
        return;

      case 18:
        startGuestPrototype();
        return;
    }
  };

  const startGuestPrototype = () => {
    setIsAccountMenuOpen(false);
    setSignInPrompt(null);
    setPrototypeMode("guest");
    setActiveSpecimenDraftId(null);
    setStep(1);
  };

  const startMemberPrototype = () => {
    setIsAccountMenuOpen(false);
    setSignInPrompt(null);
    setPrototypeMode("member");
    setActiveSpecimenDraftId(null);
    setStep(0);
  };

  const openSignInPrompt = (title: string, description: string) => {
    const returnStep: 1 | 2 = step === 2 ? 2 : 1;

    setIsAccountMenuOpen(false);
    setSignInPrompt({
      title,
      description,
      returnStep,
    });
  };

  const closeSignInPrompt = () => {
    setSignInPrompt(null);
  };

  const continueAsMember = () => {
    const returnStep = signInPrompt?.returnStep ?? 0;

    setSignInPrompt(null);
    setPrototypeMode("member");
    setStep(returnStep);
  };

  const showMemberHome = () => {
    setIsAccountMenuOpen(false);

    /*
     * Draft values are already stored as fields change. Leaving the flow
     * therefore keeps the current draft without copying or transferring
     * its images.
     */
    setReturnToReviewAfterEdit(false);
    setActiveSpecimenDraftId(null);
    setStep(0);
  };

  const showExplore = () => {
    setIsAccountMenuOpen(false);
    setReturnToReviewAfterEdit(false);
    setStep(1);
  };

  const showUpdates = () => {
    setIsAccountMenuOpen(false);
    setSignInPrompt(null);
    setStep(17);
  };

  const openAddJourney = () => {
    setIsAccountMenuOpen(false);
    setReturnToReviewAfterEdit(false);

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
    setIsAccountMenuOpen(false);
    setSettingsReturnStep(step);
    setStep(14);
  };

  const openAccountMenu = () => {
    setIsAccountMenuOpen(true);
  };

  const closeAccountMenu = () => {
    setIsAccountMenuOpen(false);
  };

  const openPreferences = () => {
    setIsAccountMenuOpen(false);
    openSettings();
  };

  const reviewContributionScope = () => {
    setIsAccountMenuOpen(false);
    setOnboardingReturnStep(14);
    setStep(4);
  };

  const showDesktopPrototype = () => {
    setIsAccountMenuOpen(false);
    setSignInPrompt(null);
    setPrototypeViewport("desktop");
  };

  const showMobilePrototype = () => {
    setPrototypeViewport("mobile");
  };

  const createCatalogueImportSession = (
    inspection: FossilTemplateInspection,
    rows: FossilTemplateInspectionRow[],
    filename: string,
  ): CatalogueImportSession => {
    const session = catalogueImportSessionService.createFromInspection({
      inspection,
      rows,
      sourceFilename: filename,
    });

    setActiveCatalogueImportSessionId(session.id);
    setDesktopSection("catalogue-import");

    return session;
  };

  const openSpecimenFromDesktop = (draftId: string) => {
    setPrototypeMode("member");
    resumeSpecimenDraft(draftId);
    setPrototypeViewport("mobile");
  };

  return (
    <main className="prototype-shell">
      <header className="prototype-header">
        <div>
          <p className="eyebrow">Technical prototype</p>
          <h1>Belgian Fossil Finds</h1>
        </div>

        <div className="prototype-header-actions">
          <div className="prototype-view-switch" role="group" aria-label="Prototype preview">
            <button
              className={`prototype-view-button ${
                prototypeViewport === "mobile" ? "prototype-view-button-active" : ""
              }`}
              type="button"
              aria-pressed={prototypeViewport === "mobile"}
              onClick={showMobilePrototype}>
              Mobile
            </button>

            <button
              className={`prototype-view-button ${
                prototypeViewport === "desktop" ? "prototype-view-button-active" : ""
              }`}
              type="button"
              aria-pressed={prototypeViewport === "desktop"}
              onClick={showDesktopPrototype}>
              Desktop
            </button>
          </div>

          <span className="prototype-status">Mock data · No live submissions</span>
        </div>
      </header>

      {prototypeViewport === "mobile" ? (
        <section className="prototype-workspace">
          <PhoneFrame
            screenKey={step}
            accountControl={
              prototypeMode === "member" ? (
                <button
                  className="phone-account-button"
                  type="button"
                  aria-label="Open account menu"
                  aria-haspopup="dialog"
                  onClick={openAccountMenu}>
                  HD
                </button>
              ) : prototypeMode === "guest" ? (
                <button
                  className="phone-account-button phone-account-button-guest"
                  type="button"
                  onClick={() =>
                    openSignInPrompt(
                      "Sign in or create an account",
                      "Create an account to keep private specimen drafts, follow selected specimens, and contribute when an owner invites input.",
                    )
                  }>
                  Sign in
                </button>
              ) : null
            }
            navigation={
              prototypeMode ? (
                <BottomNavigation
                  step={step}
                  isGuest={isGuest}
                  onExplore={showExplore}
                  onAdd={openAddJourney}
                  onMySpecimens={showMemberHome}
                  onUpdates={showUpdates}
                  onRequestSignIn={() =>
                    openSignInPrompt(
                      "Sign in or create an account",
                      "Create an account to keep private specimen drafts, follow selected specimens, and contribute when an owner invites input.",
                    )
                  }
                />
              ) : null
            }
            overlay={
              <>
                {isAccountMenuOpen ? (
                  <AccountMenu onClose={closeAccountMenu} onOpenPreferences={openPreferences} />
                ) : null}

                {signInPrompt ? (
                  <SignInPrompt
                    title={signInPrompt.title}
                    description={signInPrompt.description}
                    onClose={closeSignInPrompt}
                    onContinueAsMember={continueAsMember}
                  />
                ) : null}
              </>
            }>
            {step === 18 && (
              <PrototypeModeScreen onContinueAsGuest={startGuestPrototype} onContinueAsMember={startMemberPrototype} />
            )}

            {step === 0 && (
              <WelcomeScreen
                drafts={specimenDrafts}
                onResumeSpecimen={resumeSpecimenDraft}
                onAddSpecimen={openAddFromMySpecimens}
              />
            )}

            {step === 1 && <BrowseScreen onOpenFind={() => setStep(2)} />}

            {step === 17 && <UpdatesScreen />}

            {step === 2 && (
              <FindDetailScreen isGuest={isGuest} onBack={() => setStep(1)} onRequestSignIn={openSignInPrompt} />
            )}

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
                onBack={() => {
                  if (returnToReviewAfterEdit) {
                    returnToReviewFromEdit();
                    return;
                  }

                  moveActiveDraftToStep("images", 7);
                }}
                onContinue={() => {
                  if (returnToReviewAfterEdit) {
                    returnToReviewFromEdit();
                    return;
                  }

                  moveActiveDraftToStep("provenance", 8);
                }}
                onSaveForLater={() => saveActiveDraftForLater("type")}
              />
            )}

            {step === 7 && (
              <PhotoScreen
                photos={activeEditablePhotos}
                hasDraft={Boolean(activeSpecimenDraft)}
                onAddPhotos={addFindPhotos}
                onRemovePhoto={removeFindPhoto}
                onBack={() => {
                  if (returnToReviewAfterEdit) {
                    returnToReviewFromEdit();
                    return;
                  }

                  if (activeSpecimenDraft) {
                    saveActiveDraftForLater("images");
                    return;
                  }

                  setStep(0);
                }}
                onContinue={() => {
                  if (returnToReviewAfterEdit) {
                    returnToReviewFromEdit();
                    return;
                  }

                  finishSingleFindImageIntake();
                }}
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
                onBack={() => {
                  if (returnToReviewAfterEdit) {
                    returnToReviewFromEdit();
                    return;
                  }

                  if (activeSpecimenDraft.source === "catalogue-import") {
                    moveActiveDraftToStep("images", 7);
                    return;
                  }

                  moveActiveDraftToStep("type", 5);
                }}
                onContinue={() => {
                  if (returnToReviewAfterEdit) {
                    returnToReviewFromEdit();
                    return;
                  }

                  moveActiveDraftToStep("find-location", 9);
                }}
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
                onBack={() => {
                  if (returnToReviewAfterEdit) {
                    returnToReviewFromEdit();
                    return;
                  }

                  moveActiveDraftToStep("provenance", 8);
                }}
                onContinue={() => {
                  if (returnToReviewAfterEdit) {
                    returnToReviewFromEdit();
                    return;
                  }

                  moveActiveDraftToStep("physical-details", 10);
                }}
                onSaveForLater={() => saveActiveDraftForLater("find-location")}
              />
            )}

            {step === 10 && activeSpecimenDraft && (
              <PhysicalDetailsScreen
                recordKind={activeSpecimenDraft.recordKind}
                value={activeSpecimenDraft.physicalDetails}
                onChange={(physicalDetails) =>
                  updateActiveSpecimenDraft({
                    physicalDetails,
                  })
                }
                onBack={() => {
                  if (returnToReviewAfterEdit) {
                    returnToReviewFromEdit();
                    return;
                  }

                  moveActiveDraftToStep("find-location", 9);
                }}
                onContinue={() => {
                  if (returnToReviewAfterEdit) {
                    returnToReviewFromEdit();
                    return;
                  }

                  moveActiveDraftToStep("identification-observations", 13);
                }}
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
                onBack={() => {
                  if (returnToReviewAfterEdit) {
                    returnToReviewFromEdit();
                    return;
                  }

                  moveActiveDraftToStep("physical-details", 10);
                }}
                onFinish={() => {
                  if (returnToReviewAfterEdit) {
                    returnToReviewFromEdit();
                    return;
                  }

                  moveActiveDraftToStep("privacy", 15);
                }}
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
                onBack={() => {
                  if (returnToReviewAfterEdit) {
                    returnToReviewFromEdit();
                    return;
                  }

                  moveActiveDraftToStep("identification-observations", 13);
                }}
                onFinish={() => {
                  if (returnToReviewAfterEdit) {
                    returnToReviewFromEdit();
                    return;
                  }

                  openReviewFromPrivacy();
                }}
                onSaveForLater={() => saveActiveDraftForLater("privacy")}
              />
            )}

            {step === 16 && activeSpecimenDraft && (
              <ReviewSpecimenScreen
                draft={activeSpecimenDraft}
                onBack={showMemberHome}
                onEdit={editActiveSpecimenFromReview}
                onSavePrivate={savePrivateSpecimen}
              />
            )}
          </PhoneFrame>

          <NotesPanel
            step={step}
            onPrevious={goToPreviousStep}
            onNext={goToNextStep}
            nextDisabled={
              (step === 5 && activeSpecimenDraft?.recordKind === null) ||
              (step === 7 && activeEditablePhotos.length === 0) ||
              (step === 8 && activeSpecimenDraft?.provenance === null) ||
              (step === 9 && activeSpecimenDraft?.locationContext.knowledge === null) ||
              (step === 10 && activeSpecimenDraft?.physicalDetails.measurementStatus === null) ||
              (step === 16 && activeSpecimenDraft?.images.length === 0)
            }
          />
        </section>
      ) : (
        <DesktopFrame
          activeSection={desktopSection}
          onSelectSection={setDesktopSection}
          onSwitchToMobile={showMobilePrototype}>
          {desktopSection === "specimens" ? (
            <DesktopSpecimensScreen
              drafts={specimenDrafts}
              onImportCatalogue={() => setDesktopSection("catalogue-import")}
              onOpenSpecimen={openSpecimenFromDesktop}
            />
          ) : (
            <CatalogueImportIntroScreen
              onBack={() => setDesktopSection("specimens")}
              activeSession={activeCatalogueImportSession}
              onCreateImportSession={createCatalogueImportSession}
            />
          )}
        </DesktopFrame>
      )}
    </main>
  );
}

export default App;
