import { recordKinds } from "./recordKinds";
import type { RecordKind } from "./types";

type RecordTypeScreenProps = {
  selectedKind: RecordKind | null;
  onSelect: (recordKind: RecordKind) => void;
  onBack: () => void;
};

export function RecordTypeScreen({ selectedKind, onSelect, onBack }: RecordTypeScreenProps) {
  const selectedRecordLabel = recordKinds.find((record) => record.id === selectedKind)?.title;

  return (
    <>
      <header className="mobile-header">
        <button className="back-button" type="button" onClick={onBack}>
          ← Back
        </button>

        <p className="mobile-eyebrow">Record a find</p>
      </header>

      <section className="record-flow">
        <p className="record-progress">Single find · About the item</p>

        <div className="record-heading">
          <h2>What are you recording?</h2>

          <p>Choose the closest option. You can change this later.</p>
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

        <div
          className={`record-selection-note ${selectedKind ? "record-selection-note-active" : ""}`}
          aria-live="polite">
          {selectedRecordLabel ? (
            <>
              <strong>{selectedRecordLabel} selected</strong>

              <span>The next prototype step will collect photographs.</span>
            </>
          ) : (
            <span>Select one option to begin the record.</span>
          )}
        </div>
      </section>
    </>
  );
}
