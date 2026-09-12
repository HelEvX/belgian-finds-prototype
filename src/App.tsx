import { useEffect, useRef, useState } from "react";
import { BottomNavigation } from "./components/BottomNavigation";
import { NotesPanel } from "./components/NotesPanel";
import { PhoneFrame } from "./components/PhoneFrame";
import { BrowseScreen } from "./features/explore/BrowseScreen";
import { FindDetailScreen } from "./features/explore/FindDetailScreen";
import { WelcomeScreen } from "./features/explore/WelcomeScreen";
import { AddMethodScreen } from "./features/record-find/AddMethodScreen";
import { BulkImportModal } from "./features/record-find/BulkImportModal";
import { CollectionImportIntroScreen } from "./features/record-find/CollectionImportIntroScreen";
import { PhotoScreen } from "./features/record-find/PhotoScreen";
import { RecordIntroScreen } from "./features/record-find/RecordIntroScreen";
import { RecordTypeScreen } from "./features/record-find/RecordTypeScreen";
import { ProvenanceScreen } from "./features/record-find/ProvenanceScreen";
import { LocationContextScreen } from "./features/record-find/LocationContextScreen";

import {
  MAX_FIND_PHOTOS,
  type FindPhotoSource,
  type LocalFindPhoto,
  type LocationContext,
  type ProvenanceKind,
  type RecordKind,
} from "./features/record-find/types";
import type { PrototypeStep } from "./prototype/types";

const createEmptyLocationContext = (): LocationContext => ({
  knowledge: null,
  municipality: "",
  province: "",
  siteDescription: "",
  geologicalContext: "",
  approximateDate: "",
  sourceNotes: "",
});

function App() {
  const [step, setStep] = useState<PrototypeStep>(0);
  const [recordKind, setRecordKind] = useState<RecordKind | null>(null);
  const [provenance, setProvenance] = useState<ProvenanceKind | null>(null);
  const [locationContext, setLocationContext] = useState<LocationContext>(createEmptyLocationContext);
  const [findPhotos, setFindPhotos] = useState<LocalFindPhoto[]>([]);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  const findPhotosRef = useRef<LocalFindPhoto[]>([]);

  useEffect(() => {
    findPhotosRef.current = findPhotos;
  }, [findPhotos]);

  useEffect(() => {
    return () => {
      findPhotosRef.current.forEach((photo) => {
        URL.revokeObjectURL(photo.previewUrl);
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
    setRecordKind(null);
    setProvenance(null);
    setLocationContext(createEmptyLocationContext());
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
        setStep(0);
        return;

      case 4:
        setStep(3);
        return;

      case 5:
        setStep(4);
        return;

      case 6:
        setStep(3);
        return;

      case 7:
        setStep(5);
        return;

      case 8:
        setStep(7);
        return;

      case 9:
        setStep(8);
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
        setStep(5);
        return;

      case 5:
        if (recordKind) {
          setStep(7);
        }
        return;

      case 6:
        setStep(3);
        return;

      case 7:
        if (findPhotos.length > 0) {
          setStep(8);
        }
        return;

      case 8:
        if (provenance) {
          setStep(9);
        }
        return;

      case 9:
        clearSingleFind();
        setStep(3);
        return;
    }
  };

  const showWelcome = () => {
    setIsBulkImportOpen(false);
    setStep(0);
  };

  const openAddJourney = () => {
    setIsBulkImportOpen(false);
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
          navigation={<BottomNavigation step={step} onExplore={showWelcome} onAdd={openAddJourney} />}
          overlay={isBulkImportOpen ? <BulkImportModal onClose={closeBulkImport} /> : null}>
          {step === 0 && (
            <WelcomeScreen onBrowse={() => setStep(1)} onOpenFind={() => setStep(2)} onLogFind={openAddJourney} />
          )}

          {step === 1 && <BrowseScreen onOpenFind={() => setStep(2)} />}

          {step === 2 && <FindDetailScreen onBack={() => setStep(1)} />}

          {step === 3 && (
            <AddMethodScreen
              onRecordOne={startSingleFindJourney}
              onImportCollection={() => setStep(6)}
              onCancel={showWelcome}
            />
          )}

          {step === 4 && <RecordIntroScreen onStart={() => setStep(5)} onCancel={() => setStep(3)} />}

          {step === 5 && (
            <RecordTypeScreen
              selectedKind={recordKind}
              onSelect={setRecordKind}
              onBack={() => setStep(4)}
              onContinue={() => setStep(7)}
            />
          )}

          {step === 6 && (
            <CollectionImportIntroScreen
              onBack={() => setStep(3)}
              onExplore={showWelcome}
              onOpenImport={() => setIsBulkImportOpen(true)}
            />
          )}

          {step === 7 && recordKind && (
            <PhotoScreen
              recordKind={recordKind}
              photos={findPhotos}
              onAddPhotos={addFindPhotos}
              onRemovePhoto={removeFindPhoto}
              onBack={() => setStep(5)}
              onContinue={() => setStep(8)}
            />
          )}

          {step === 8 && (
            <ProvenanceScreen
              selectedProvenance={provenance}
              onSelect={setProvenance}
              onBack={() => setStep(7)}
              onContinue={() => setStep(9)}
            />
          )}

          {step === 9 && provenance && (
            <LocationContextScreen
              provenance={provenance}
              value={locationContext}
              onChange={setLocationContext}
              onBack={() => setStep(8)}
            />
          )}
        </PhoneFrame>

        <NotesPanel
          step={step}
          onPrevious={goToPreviousStep}
          onNext={goToNextStep}
          nextDisabled={
            (step === 5 && recordKind === null) ||
            (step === 7 && findPhotos.length === 0) ||
            (step === 8 && provenance === null) ||
            (step === 9 && locationContext.knowledge === null)
          }
        />
      </section>
    </main>
  );
}

export default App;
