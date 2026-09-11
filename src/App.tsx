import { useState } from "react";
import { BottomNavigation } from "./components/BottomNavigation";
import { NotesPanel } from "./components/NotesPanel";
import { PhoneFrame } from "./components/PhoneFrame";
import { BrowseScreen } from "./features/explore/BrowseScreen";
import { FindDetailScreen } from "./features/explore/FindDetailScreen";
import { WelcomeScreen } from "./features/explore/WelcomeScreen";
import { RecordIntroScreen } from "./features/record-find/RecordIntroScreen";
import { RecordTypeScreen } from "./features/record-find/RecordTypeScreen";
import type { RecordKind } from "./features/record-find/types";
import type { PrototypeStep } from "./prototype/types";

function App() {
  const [step, setStep] = useState<PrototypeStep>(0);
  const [recordKind, setRecordKind] = useState<RecordKind | null>(null);

  const goToPreviousStep = () => {
    if (step === 3) {
      setStep(0);
      return;
    }

    setStep((currentStep) => Math.max(0, currentStep - 1) as PrototypeStep);
  };

  const goToNextStep = () => {
    if (step === 2) {
      setStep(0);
      return;
    }

    if (step === 4) {
      setRecordKind(null);
      setStep(3);
      return;
    }

    setStep((currentStep) => Math.min(4, currentStep + 1) as PrototypeStep);
  };

  const showWelcome = () => {
    setStep(0);
  };

  const startRecordJourney = () => {
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
          navigation={<BottomNavigation step={step} onExplore={showWelcome} onAdd={startRecordJourney} />}>
          {step === 0 && (
            <WelcomeScreen onBrowse={() => setStep(1)} onOpenFind={() => setStep(2)} onLogFind={startRecordJourney} />
          )}

          {step === 1 && <BrowseScreen onOpenFind={() => setStep(2)} />}

          {step === 2 && <FindDetailScreen onBack={() => setStep(1)} />}

          {step === 3 && <RecordIntroScreen onStart={() => setStep(4)} onCancel={showWelcome} />}

          {step === 4 && (
            <RecordTypeScreen selectedKind={recordKind} onSelect={setRecordKind} onBack={() => setStep(3)} />
          )}
        </PhoneFrame>

        <NotesPanel step={step} onPrevious={goToPreviousStep} onNext={goToNextStep} />
      </section>
    </main>
  );
}

export default App;
