type ContributionOnboardingScreenProps = {
  returnToSettings: boolean;
  onContinue: () => void;
  onCancel: () => void;
};

export function ContributionOnboardingScreen({
  returnToSettings,
  onContinue,
  onCancel,
}: ContributionOnboardingScreenProps) {
  return (
    <>
      <header className="mobile-header">
        <div>
          <p className="mobile-eyebrow">Contributing to Belgian Fossil Finds</p>

          <h2>Before you add a specimen</h2>
        </div>

        <button className="icon-button" type="button" aria-label="Close contribution introduction" onClick={onCancel}>
          ×
        </button>
      </header>

      <section className="record-flow">
        <p className="record-progress">Contribution introduction</p>

        <div className="record-intro-card">
          <p className="card-kicker">Belgian Fossil Finds</p>

          <h3>Document a specimen with useful context.</h3>

          <p>
            This project is for Belgian field finds and inherited or documented amateur collection specimens that may
            contribute to learning, identification, or research.
          </p>
        </div>

        <div className="record-selection-note">
          <strong>What does not belong here?</strong>

          <span>
            Shop-bought souvenirs, decorative fossils, commercial stock, bulk purchases, and valuation requests are
            outside this project’s purpose.
          </span>
        </div>

        <ul className="record-checklist">
          <li>
            <span aria-hidden="true">1</span>

            <div>
              <strong>Start with photographs</strong>

              <p>Add one or more clear photographs of the same physical specimen.</p>
            </div>
          </li>

          <li>
            <span aria-hidden="true">2</span>

            <div>
              <strong>Add what you know</strong>

              <p>Record its apparent type, provenance, find location, physical details, and your own observations.</p>
            </div>
          </li>

          <li>
            <span aria-hidden="true">3</span>

            <div>
              <strong>Continue at your own pace</strong>

              <p>
                Your private draft can be left unfinished and resumed from My specimens during this prototype session.
              </p>
            </div>
          </li>
        </ul>

        <div className="mobile-actions">
          <button className="primary-button" type="button" onClick={returnToSettings ? onCancel : onContinue}>
            {returnToSettings ? "Back to settings" : "Add specimen photos"}
          </button>

          <button className="secondary-button" type="button" onClick={onCancel}>
            {returnToSettings ? "Close" : "Not now"}
          </button>
        </div>
      </section>
    </>
  );
}
