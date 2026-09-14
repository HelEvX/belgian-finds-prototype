type WorkspaceScreenProps = {
  onAddMaterial: () => void;
  onExplore: () => void;
};

export function WorkspaceScreen({ onAddMaterial, onExplore }: WorkspaceScreenProps) {
  return (
    <>
      <header className="mobile-header">
        <div>
          <p className="mobile-eyebrow">Your contribution space</p>
          <h2>My workspace</h2>
        </div>

        <button className="icon-button" type="button" aria-label="Return to Explore" onClick={onExplore}>
          ⌂
        </button>
      </header>

      <section className="record-flow">
        <p className="record-progress">Private prototype workspace</p>

        <div className="record-intro-card">
          <p className="card-kicker">Start with images</p>

          <h3>Document material at your own pace.</h3>

          <p>
            Add one specimen or import a group of existing images. Once images are correctly associated with specimens,
            they will be ready for documentation.
          </p>
        </div>

        <section className="mobile-section">
          <div className="section-heading">
            <h3>Annotation queue</h3>
            <span className="status-label">0 ready</span>
          </div>

          <div className="record-selection-note">
            <strong>No specimen drafts yet</strong>

            <span>
              Add images for one specimen, or import a batch and group them by specimen. The shared annotation queue
              will be added in the next prototype phase.
            </span>
          </div>
        </section>

        <section className="mobile-section">
          <div className="section-heading">
            <h3>My records</h3>
            <span className="status-label">0 saved</span>
          </div>

          <div className="record-selection-note">
            <strong>Your drafts will appear here</strong>

            <span>
              This prototype currently keeps data only in the active browser session. Accounts and saved records are not
              live yet.
            </span>
          </div>
        </section>

        <div className="mobile-actions">
          <button className="primary-button" type="button" onClick={onAddMaterial}>
            Add material
          </button>

          <button className="secondary-button" type="button" onClick={onExplore}>
            Browse public finds
          </button>
        </div>
      </section>
    </>
  );
}
