type CollectionImportIntroScreenProps = {
  onBack: () => void;
  onExplore: () => void;
};

export function CollectionImportIntroScreen({ onBack, onExplore }: CollectionImportIntroScreenProps) {
  return (
    <>
      <header className="mobile-header">
        <button className="back-button" type="button" onClick={onBack}>
          ← Back
        </button>

        <p className="mobile-eyebrow">Collection import</p>
      </header>

      <section className="record-flow">
        <p className="record-progress">Workflow preview</p>

        <div className="record-intro-card">
          <p className="card-kicker">Designed for existing collections</p>

          <h3>Bring in a folder of photographs.</h3>

          <p>
            Instead of repeating the single-find process hundreds of times, collectors will be able to prepare several
            specimen records together.
          </p>
        </div>

        <ul className="record-checklist">
          <li>
            <span aria-hidden="true">1</span>

            <div>
              <strong>Create or choose a collection</strong>
              <p>Add shared information such as owner, history, storage location and default visibility once.</p>
            </div>
          </li>

          <li>
            <span aria-hidden="true">2</span>

            <div>
              <strong>Select several existing images</strong>
              <p>Choose photographs from a folder, phone, tablet or other available storage.</p>
            </div>
          </li>

          <li>
            <span aria-hidden="true">3</span>

            <div>
              <strong>Group images by specimen</strong>
              <p>Front, side, detail and label images can be assigned to the same draft record.</p>
            </div>
          </li>

          <li>
            <span aria-hidden="true">4</span>

            <div>
              <strong>Review the resulting drafts</strong>
              <p>Nothing is published automatically. Records can be completed and checked gradually.</p>
            </div>
          </li>
        </ul>

        <div className="record-selection-note">
          <strong>Prototype limitation</strong>

          <span>
            This screen explains the intended workflow. Bulk file selection, grouping and import are not implemented in
            this prototype.
          </span>
        </div>

        <div className="mobile-actions">
          <button className="primary-button" type="button" onClick={onBack}>
            Back to add options
          </button>

          <button className="secondary-button" type="button" onClick={onExplore}>
            Return to Explore
          </button>
        </div>
      </section>
    </>
  );
}
