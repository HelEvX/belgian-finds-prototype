import { recordKinds } from "./recordKinds";
import type { RecordKind } from "./types";

type RecordTypeScreenProps = {
  selectedKind: RecordKind | null;
  onSelect: (recordKind: RecordKind) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function RecordTypeScreen({ selectedKind, onSelect, onBack, onContinue }: RecordTypeScreenProps) {
  const selectedRecordLabel = recordKinds.find((record) => record.id === selectedKind)?.title;

  return (
    <>
      <header className="mobile-header">
        <button className="back-button" type="button" onClick={onBack}>
          ← Annotation queue
        </button>

        <p className="mobile-eyebrow">Document specimen</p>
      </header>

      <section className="record-flow">
        <p className="record-progress">Specimen annotation · Material type</p>

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

              <span>Next, record what is known about its provenance.</span>
            </>
          ) : (
            <span>Select one option before continuing.</span>
          )}
        </div>

        <button
          className="primary-button record-continue-button"
          type="button"
          disabled={!selectedKind}
          onClick={onContinue}>
          Continue to provenance
        </button>
      </section>
    </>
  );
}
