type RecordIntroScreenProps = {
  onStart: () => void;
  onCancel: () => void;
};

export function RecordIntroScreen({ onStart, onCancel }: RecordIntroScreenProps) {
  return (
    <>
      <header className="mobile-header">
        <div>
          <p className="mobile-eyebrow">Add one specimen</p>
          <h2>Before you begin</h2>
        </div>

        <button className="icon-button" type="button" aria-label="Close one-specimen journey" onClick={onCancel}>
          ×
        </button>
      </header>

      <section className="record-flow">
        <p className="record-progress">One specimen · Introduction</p>

        <div className="record-intro-card">
          <p className="card-kicker">A useful record starts with evidence</p>

          <h3>You do not need to know what you have found.</h3>

          <p>Start with what you can observe. Other community members may be able to help with the rest.</p>
        </div>

        <div className="record-selection-note">
          <strong>What belongs here?</strong>

          <span>
            Fossils collected in Belgium, and inherited or older amateur collections with useful Belgian locality
            information, labels or notes. Shop-bought souvenirs, decorative fossils, commercial stock and valuation
            requests are outside this platform’s purpose.
          </span>
        </div>

        <ul className="record-checklist">
          <li>
            <span aria-hidden="true">1</span>

            <div>
              <strong>Take or choose photographs</strong>
              <p>We will guide you through useful views as you create the specimen draft.</p>
            </div>
          </li>

          <li>
            <span aria-hidden="true">2</span>

            <div>
              <strong>Associate the images with one specimen</strong>
              <p>Your image set will enter the shared annotation queue.</p>
            </div>
          </li>

          <li>
            <span aria-hidden="true">3</span>

            <div>
              <strong>Document it when you are ready</strong>
              <p>Type, locality, history and uncertainty can all be added later.</p>
            </div>
          </li>
        </ul>

        <div className="mobile-actions">
          <button className="primary-button" type="button" onClick={onStart}>
            Add images
          </button>

          <button className="secondary-button" type="button" onClick={onCancel}>
            Not now
          </button>
        </div>
      </section>
    </>
  );
}
