type AddMethodScreenProps = {
  onRecordOne: () => void;
  onImportCollection: () => void;
  onCancel: () => void;
};

export function AddMethodScreen({ onRecordOne, onImportCollection, onCancel }: AddMethodScreenProps) {
  return (
    <>
      <header className="mobile-header">
        <div>
          <p className="mobile-eyebrow">Add material</p>
          <h2>How would you like to begin?</h2>
        </div>

        <button className="icon-button" type="button" aria-label="Close add journey" onClick={onCancel}>
          ×
        </button>
      </header>

      <section className="record-flow">
        <p className="record-progress">Choose a path</p>

        <div className="record-choice-list">
          <button className="record-choice" type="button" onClick={onRecordOne}>
            <span className="record-choice-symbol" aria-hidden="true">
              ＋
            </span>

            <span className="record-choice-copy">
              <strong>Record one find</strong>
              <span>Follow a guided process for one specimen, using new or existing photographs.</span>
            </span>

            <span className="record-choice-check" aria-hidden="true">
              →
            </span>
          </button>

          <button className="record-choice" type="button" onClick={onImportCollection}>
            <span className="record-choice-symbol" aria-hidden="true">
              ▦
            </span>

            <span className="record-choice-copy">
              <strong>Import a collection</strong>
              <span>Add existing images for several specimens and create draft records in batches.</span>
            </span>

            <span className="record-choice-check" aria-hidden="true">
              →
            </span>
          </button>
        </div>

        <div className="record-selection-note">
          <strong>Working with a large collection?</strong>

          <span>
            Collection import will usually be easier on a desktop or tablet, but it will not be restricted to those
            devices.
          </span>
        </div>
      </section>
    </>
  );
}
