type AddMethodScreenProps = {
  onRecordOne: () => void;
  onImportBatch: () => void;
  onCancel: () => void;
};

export function AddMethodScreen({ onRecordOne, onImportBatch, onCancel }: AddMethodScreenProps) {
  return (
    <>
      <header className="mobile-header">
        <div>
          <p className="mobile-eyebrow">Contribute a record</p>
          <h2>Add material</h2>
        </div>

        <button className="icon-button" type="button" aria-label="Close add material" onClick={onCancel}>
          ×
        </button>
      </header>

      <section className="record-flow">
        <p className="record-progress">Start with images</p>

        <div className="record-intro-card">
          <p className="card-kicker">Belgian fossil community</p>

          <h3>Share material with useful context.</h3>

          <p>
            Start with images. You can add the specimen’s history, locality and other information after images have been
            correctly associated with the object they depict.
          </p>
        </div>

        <div className="record-selection-note">
          <strong>What belongs here?</strong>

          <span>
            Belgian field finds, and inherited or older amateur collection material with useful labels, notes or
            locality information. Shop-bought souvenirs, decorative fossils, commercial stock and valuation requests are
            outside this platform’s purpose.
          </span>
        </div>

        <div className="record-choice-list">
          <button className="record-choice" type="button" onClick={onRecordOne}>
            <span className="record-choice-symbol" aria-hidden="true">
              ＋
            </span>

            <span className="record-choice-copy">
              <strong>Add one specimen</strong>
              <span>Take new photographs or choose existing image files for one physical object.</span>
            </span>

            <span className="record-choice-check" aria-hidden="true">
              →
            </span>
          </button>

          <button className="record-choice" type="button" onClick={onImportBatch}>
            <span className="record-choice-symbol" aria-hidden="true">
              ▦
            </span>

            <span className="record-choice-copy">
              <strong>Import a batch of images</strong>
              <span>Select many existing image files, then group images that show the same specimen.</span>
            </span>

            <span className="record-choice-check" aria-hidden="true">
              →
            </span>
          </button>
        </div>

        <div className="record-selection-note">
          <strong>Your own reference can be added later</strong>

          <span>
            If you use a label, notebook, spreadsheet or another collection database, you can preserve its catalogue
            reference when documenting a specimen. It is never required to begin.
          </span>
        </div>
      </section>
    </>
  );
}
