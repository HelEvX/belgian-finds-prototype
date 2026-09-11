import { useEffect, useRef, useState, type PointerEvent } from "react";
import { RecordIntroScreen } from "./features/record-find/RecordIntroScreen";
import { RecordTypeScreen } from "./features/record-find/RecordTypeScreen";
import type { RecordKind } from "./features/record-find/types";

type PrototypeStep = 0 | 1 | 2 | 3 | 4;

const stepNotes = [
  {
    label: "Explore journey · Step 1 of 3",
    title: "Welcome",
    purpose:
      "Introduce the platform as a place to explore Belgian-connected fossil finds and connect with other people.",
    matters: "A visitor should understand the purpose before being asked to register or contribute.",
    decision: "Browsing remains available to visitors. Registration is not required just to look around.",
  },
  {
    label: "Explore journey · Step 2 of 3",
    title: "Browse finds",
    purpose: "Give visitors a simple way to explore records from the wider Belgian fossil community.",
    matters: "The public catalogue is the entry point for people who are curious but are not ready to submit a find.",
    decision: "The first filters are intentionally broad: location, identification status and type of material.",
  },
  {
    label: "Explore journey · Step 3 of 3",
    title: "Find detail",
    purpose: "Show one record in enough detail for another person to understand it and offer useful input.",
    matters:
      "The detail page must distinguish the collector’s original statement from later community or specialist responses.",
    decision: "A help request is attached to a specific find rather than handled through a general contact form.",
  },
  {
    label: "Record a find · Step 1 of 2",
    title: "Before you begin",
    purpose: "Briefly prepare the contributor for the information that will make their record useful to other people.",
    matters: "Contributors should feel welcome even when they do not know what they have found.",
    decision:
      "Detailed instructions are shown progressively while the user creates the record, rather than presented all at once.",
  },
  {
    label: "Record a find · Step 2 of 2",
    title: "Choose a record type",
    purpose: "Establish what the contributor is recording before asking for photographs and contextual information.",
    matters:
      "The same platform should accommodate personal finds, inherited collection material and unidentified objects.",
    decision:
      "The contributor can explicitly choose ‘Something unknown’ instead of being forced to make an identification.",
  },
];

function App() {
  const [step, setStep] = useState<PrototypeStep>(0);
  const [recordKind, setRecordKind] = useState<RecordKind | null>(null);

  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const dragStartScrollTop = useRef(0);

  useEffect(() => {
    mobileScrollRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [step]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const scrollElement = mobileScrollRef.current;
    const target = event.target as HTMLElement;

    if (!scrollElement) {
      return;
    }

    if (target.closest("button, a, input, textarea, select, label")) {
      return;
    }

    dragStartY.current = event.clientY;
    dragStartScrollTop.current = scrollElement.scrollTop;

    scrollElement.setPointerCapture(event.pointerId);
    scrollElement.classList.add("is-dragging");
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const scrollElement = mobileScrollRef.current;

    if (!scrollElement || dragStartY.current === null) {
      return;
    }

    const distanceDragged = event.clientY - dragStartY.current;

    scrollElement.scrollTop = dragStartScrollTop.current - distanceDragged;
  };

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    const scrollElement = mobileScrollRef.current;

    dragStartY.current = null;

    if (!scrollElement) {
      return;
    }

    if (scrollElement.hasPointerCapture(event.pointerId)) {
      scrollElement.releasePointerCapture(event.pointerId);
    }

    scrollElement.classList.remove("is-dragging");
  };

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

  const openRecordJourney = () => {
    setStep(3);
  };

  const returnToWelcome = () => {
    setStep(0);
  };

  const isJourneyEnd = step === 2 || step === 4;

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
        <div className="phone-column">
          <div className="phone-frame">
            <div className="phone-speaker" />

            <div className="phone-screen">
              <div className="mobile-status-bar">
                <span>9:41</span>
                <span>● ● ●</span>
              </div>

              <div className="scroll-hint" aria-hidden="true">
                <span>↕</span>
                <span>Drag or scroll inside the app</span>
              </div>

              <div
                ref={mobileScrollRef}
                className="mobile-app"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={stopDragging}
                onPointerCancel={stopDragging}>
                {step === 0 && (
                  <>
                    <header className="mobile-header">
                      <div>
                        <p className="mobile-eyebrow">Belgian fossil community</p>

                        <h2>Discover finds</h2>
                      </div>

                      <button className="icon-button" type="button" aria-label="Open account">
                        ◎
                      </button>
                    </header>

                    <section className="welcome-card">
                      <p className="card-kicker">Explore · Learn · Connect</p>

                      <h3>Fossils have stories to tell.</h3>

                      <p>Browse Belgian-connected finds and share what you know.</p>
                    </section>

                    <div className="mobile-actions">
                      <button className="primary-button" type="button" onClick={() => setStep(1)}>
                        Browse finds
                      </button>

                      <button className="secondary-button" type="button" onClick={openRecordJourney}>
                        Log a find
                      </button>
                    </div>

                    <section className="mobile-section">
                      <div className="section-heading">
                        <h3>Recent finds</h3>

                        <button className="text-button" type="button" onClick={() => setStep(1)}>
                          See all
                        </button>
                      </div>

                      <button className="find-card find-card-button" type="button" onClick={() => setStep(2)}>
                        <div className="find-image-placeholder">IMAGE</div>

                        <div className="find-card-content">
                          <span className="status-label">Needs community input</span>

                          <h4>Possible ammonite</h4>
                          <p>Hainaut, Belgium</p>
                        </div>
                      </button>
                    </section>
                  </>
                )}

                {step === 1 && (
                  <>
                    <header className="mobile-header">
                      <div>
                        <p className="mobile-eyebrow">Belgian fossil community</p>

                        <h2>Browse finds</h2>
                      </div>

                      <button className="icon-button" type="button" aria-label="Open filters">
                        ☷
                      </button>
                    </header>

                    <div className="search-placeholder">
                      <span>⌕</span>
                      <span>Search finds, places or names</span>
                    </div>

                    <div className="filter-row">
                      <button className="filter-chip filter-chip-active" type="button">
                        All finds
                      </button>

                      <button className="filter-chip" type="button">
                        Needs help
                      </button>

                      <button className="filter-chip" type="button">
                        Reviewed
                      </button>
                    </div>

                    <section className="browse-list">
                      <button className="browse-card" type="button" onClick={() => setStep(2)}>
                        <div className="find-image-placeholder image-ammonite">IMAGE</div>

                        <div className="browse-card-content">
                          <span className="status-label">Needs community input</span>

                          <h3>Possible ammonite</h3>
                          <p>Hainaut, Belgium</p>
                          <small>3 views · Added recently</small>
                        </div>
                      </button>

                      <button className="browse-card" type="button">
                        <div className="find-image-placeholder image-shell">IMAGE</div>

                        <div className="browse-card-content">
                          <span className="status-label status-reviewed">Specialist reviewed</span>

                          <h3>Fossil shell fragment</h3>
                          <p>Limburg, Belgium</p>
                          <small>2 views · Reviewed record</small>
                        </div>
                      </button>

                      <button className="browse-card" type="button">
                        <div className="find-image-placeholder image-rock">IMAGE</div>

                        <div className="browse-card-content">
                          <span className="status-label">Unidentified</span>

                          <h3>Collection specimen</h3>
                          <p>Belgian collection</p>
                          <small>4 views · Help requested</small>
                        </div>
                      </button>

                      <button className="browse-card" type="button">
                        <div className="find-image-placeholder image-shell">IMAGE</div>

                        <div className="browse-card-content">
                          <span className="status-label">Community discussion</span>

                          <h3>Possible sea urchin</h3>
                          <p>Namur, Belgium</p>
                          <small>5 views · 2 suggestions</small>
                        </div>
                      </button>
                    </section>
                  </>
                )}

                {step === 2 && (
                  <>
                    <header className="mobile-header">
                      <button className="back-button" type="button" onClick={() => setStep(1)}>
                        ← Back
                      </button>

                      <button className="icon-button" type="button" aria-label="More options">
                        ···
                      </button>
                    </header>

                    <section className="detail-gallery">
                      <div className="detail-image-main">IMAGE</div>

                      <div className="detail-thumbnails">
                        <div className="detail-thumbnail thumbnail-active">FRONT</div>

                        <div className="detail-thumbnail">SIDE</div>

                        <div className="detail-thumbnail">SCALE</div>
                      </div>
                    </section>

                    <section className="detail-content">
                      <span className="status-label">Needs community input</span>

                      <h2>Possible ammonite</h2>

                      <p className="detail-location">Hainaut, Belgium · Found in 2024</p>

                      <p className="detail-description">
                        A small fossil collected during a family walk. The contributor suspects it may be an ammonite
                        but is not sure.
                      </p>

                      <div className="detail-facts">
                        <div>
                          <span>Size</span>
                          <strong>6 × 5 cm</strong>
                        </div>

                        <div>
                          <span>Views</span>
                          <strong>3 images</strong>
                        </div>
                      </div>

                      <section className="determination-section">
                        <h3>What people have said</h3>

                        <div className="determination-item">
                          <span>Collector’s note</span>
                          <p>“Possible ammonite”</p>
                        </div>

                        <div className="determination-empty">No community or specialist determination yet.</div>
                      </section>

                      <p className="detail-extra-copy">
                        The collector has provided images from the front and side, plus a view with a scale. More
                        information about the geological context may help the community respond.
                      </p>

                      <button className="primary-button detail-help-button" type="button">
                        Request help with this find
                      </button>
                    </section>
                  </>
                )}

                {step === 3 && <RecordIntroScreen onStart={() => setStep(4)} onCancel={returnToWelcome} />}

                {step === 4 && (
                  <RecordTypeScreen selectedKind={recordKind} onSelect={setRecordKind} onBack={() => setStep(3)} />
                )}
              </div>

              <nav className="mobile-navigation" aria-label="Main navigation">
                <button
                  className={`nav-item ${step <= 2 ? "nav-item-active" : ""}`}
                  type="button"
                  onClick={returnToWelcome}>
                  <span>⌂</span>
                  Explore
                </button>

                <button
                  className={`nav-item ${step >= 3 ? "nav-item-active" : ""}`}
                  type="button"
                  onClick={openRecordJourney}>
                  <span>＋</span>
                  Add
                </button>

                <button className="nav-item" type="button">
                  <span>♡</span>
                  My finds
                </button>

                <button className="nav-item" type="button">
                  <span>?</span>
                  Help
                </button>
              </nav>
            </div>
          </div>
        </div>

        <aside className="notes-panel">
          <p className="eyebrow">{stepNotes[step].label}</p>
          <h2>{stepNotes[step].title}</h2>

          <div className="note-block">
            <h3>Purpose</h3>
            <p>{stepNotes[step].purpose}</p>
          </div>

          <div className="note-block">
            <h3>Why it matters</h3>
            <p>{stepNotes[step].matters}</p>
          </div>

          <div className="note-block">
            <h3>Important decision</h3>
            <p>{stepNotes[step].decision}</p>
          </div>

          <div className="note-block">
            <h3>Prototype limitation</h3>

            <p>
              The records and interactions are mocked locally. No account, database, image upload or help request is
              live yet.
            </p>
          </div>

          <div className="notes-actions">
            <button className="outline-button" type="button" onClick={goToPreviousStep} disabled={step === 0}>
              Previous
            </button>

            <button className="dark-button" type="button" onClick={goToNextStep}>
              {isJourneyEnd ? "Restart journey" : "Next"}
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default App;
