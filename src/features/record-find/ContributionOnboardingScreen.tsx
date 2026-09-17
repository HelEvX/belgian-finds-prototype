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
          <p className="mobile-eyebrow">Contributing here</p>
          <h2>Before you add material</h2>
        </div>

        <button className="icon-button" type="button" aria-label="Close contribution introduction" onClick={onCancel}>
          ×
        </button>
      </header>

      <section className="record-flow">
        <p className="record-progress">Contribution introduction</p>

        <div className="record-intro-card">
          <p className="card-kicker">Belgian fossil community</p>

          <h3>Share material with useful context.</h3>

          <p>
            This space is for Belgian field finds and inherited or documented amateur collection material that may
            contribute to learning, determination or research.
          </p>
        </div>

        <div className="record-selection-note">
          <strong>What does not belong here?</strong>

          <span>
            Shop-bought souvenirs, decorative fossils, commercial stock, bulk purchases and valuation requests are
            outside this platform’s purpose.
          </span>
        </div>

        <ul className="record-checklist">
          <li>
            <span aria-hidden="true">1</span>

            <div>
              <strong>Start with images</strong>

              <p>Add images for one specimen, or import a larger set of existing photographs.</p>
            </div>
          </li>

          <li>
            <span aria-hidden="true">2</span>

            <div>
              <strong>Associate images with specimens</strong>

              <p>Batch imports are grouped before any specimen information is added.</p>
            </div>
          </li>

          <li>
            <span aria-hidden="true">3</span>

            <div>
              <strong>Document at your own pace</strong>

              <p>Type, provenance, location, observations and help preferences can be added later.</p>
            </div>
          </li>
        </ul>

        <div className="mobile-actions">
          <button className="primary-button" type="button" onClick={returnToSettings ? onCancel : onContinue}>
            {returnToSettings ? "Back to settings" : "Choose image route"}
          </button>

          <button className="secondary-button" type="button" onClick={onCancel}>
            {returnToSettings ? "Close" : "Not now"}
          </button>
        </div>
      </section>
    </>
  );
}
