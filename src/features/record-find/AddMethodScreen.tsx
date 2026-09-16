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
        <p className="record-progress">Image intake</p>

        <div className="record-heading">
          <h2>How would you like to add images?</h2>

          <p>
            Both routes create private specimen drafts. You can add detailed information after images are correctly
            associated with the specimen they depict.
          </p>
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
      </section>
    </>
  );
}
