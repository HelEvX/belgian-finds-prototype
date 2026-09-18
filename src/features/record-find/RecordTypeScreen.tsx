import { recordKinds } from "./recordKinds";
import type { RecordKind } from "./types";

type RecordTypeScreenProps = {
  selectedKind: RecordKind | null;
  onSelect: (recordKind: RecordKind) => void;
  onBack: () => void;
  onContinue: () => void;
  onSaveForLater: () => void;
};

export function RecordTypeScreen({
  selectedKind,
  onSelect,
  onBack,
  onContinue,
  onSaveForLater,
}: RecordTypeScreenProps) {
  return (
    <>
      <header className="mobile-header">
        <button className="back-button" type="button" onClick={onBack}>
          ← Images
        </button>

        <p className="mobile-eyebrow">Document specimen</p>
      </header>

      <section className="record-flow">
        <p className="record-progress">Specimen details · Type</p>

        <div className="record-heading">
          <h2>What does this appear to be?</h2>

          <p>
            Choose the closest option. You can change this later, and you do not need to identify the specimen before
            continuing.
          </p>
        </div>

        <div className="record-choice-list">
          {recordKinds.map((record) => {
            const isSelected = selectedKind === record.id;

            return (
              <button
                key={record.id}
                type="button"
                className={`record-choice ${isSelected ? "record-choice-active" : ""}`}
                aria-pressed={isSelected}
                onClick={() => onSelect(record.id)}>
                <span className="record-choice-symbol" aria-hidden="true">
                  {record.symbol}
                </span>

                <span className="record-choice-copy">
                  <strong>{record.title}</strong>
                  <span>{record.description}</span>
                </span>

                <span className="record-choice-check" aria-hidden="true">
                  {isSelected ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mobile-actions">
          <button className="primary-button" type="button" disabled={!selectedKind} onClick={onContinue}>
            Continue to provenance
          </button>

          <button className="secondary-button" type="button" onClick={onSaveForLater}>
            Save and finish later
          </button>
        </div>
      </section>
    </>
  );
}
