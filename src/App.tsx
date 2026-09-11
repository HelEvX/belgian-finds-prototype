import { useState } from "react";
import { BottomNavigation } from "./components/BottomNavigation";
import { NotesPanel } from "./components/NotesPanel";
import { PhoneFrame } from "./components/PhoneFrame";
import { BrowseScreen } from "./features/explore/BrowseScreen";
import { FindDetailScreen } from "./features/explore/FindDetailScreen";
import { WelcomeScreen } from "./features/explore/WelcomeScreen";
import { AddMethodScreen } from "./features/record-find/AddMethodScreen";
import { CollectionImportIntroScreen } from "./features/record-find/CollectionImportIntroScreen";
import { RecordIntroScreen } from "./features/record-find/RecordIntroScreen";
import { RecordTypeScreen } from "./features/record-find/RecordTypeScreen";
import type { RecordKind } from "./features/record-find/types";
import type { PrototypeStep } from "./prototype/types";

function App() {
  const [step, setStep] = useState<PrototypeStep>(0);
  const [recordKind, setRecordKind] = useState<RecordKind | null>(null);

  const goToPreviousStep = () => {
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
    }
  };

  const goToNextStep = () => {
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
        setRecordKind(null);
        setStep(3);
        return;

      case 6:
        setStep(3);
        return;
    }
  };

  const showWelcome = () => {
    setStep(0);
  };

  const openAddJourney = () => {
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
          navigation={<BottomNavigation step={step} onExplore={showWelcome} onAdd={openAddJourney} />}>
          {step === 0 && (
            <WelcomeScreen onBrowse={() => setStep(1)} onOpenFind={() => setStep(2)} onLogFind={openAddJourney} />
          )}

          {step === 1 && <BrowseScreen onOpenFind={() => setStep(2)} />}

          {step === 2 && <FindDetailScreen onBack={() => setStep(1)} />}

          {step === 3 && (
            <AddMethodScreen
              onRecordOne={() => setStep(4)}
              onImportCollection={() => setStep(6)}
              onCancel={showWelcome}
            />
          )}

          {step === 4 && <RecordIntroScreen onStart={() => setStep(5)} onCancel={() => setStep(3)} />}

          {step === 5 && (
            <RecordTypeScreen selectedKind={recordKind} onSelect={setRecordKind} onBack={() => setStep(4)} />
          )}

          {step === 6 && <CollectionImportIntroScreen onBack={() => setStep(3)} onExplore={showWelcome} />}
        </PhoneFrame>

        <NotesPanel step={step} onPrevious={goToPreviousStep} onNext={goToNextStep} />
      </section>
    </main>
  );
}

export default App;
