import { provenanceOptions } from "./provenanceOptions";
import type { ProvenanceKind } from "./types";

type ProvenanceScreenProps = {
  selectedProvenance: ProvenanceKind | null;
  onSelect: (provenance: ProvenanceKind) => void;
  onBack: () => void;
  onContinue: () => void;
  onSaveForLater: () => void;
};

export function ProvenanceScreen({
  selectedProvenance,
  onSelect,
  onBack,
  onContinue,
  onSaveForLater,
}: ProvenanceScreenProps) {
  const selectedOption = provenanceOptions.find((option) => option.id === selectedProvenance);

  return (
    <>
      <header className="mobile-header">
        <button className="back-button" type="button" onClick={onBack}>
          ← Annotation queue
        </button>

        <p className="mobile-eyebrow">Document specimen</p>
      </header>

      <section className="record-flow">
        <p className="record-progress">Specimen annotation · Provenance</p>

        <div className="record-heading">
          <h2>Who originally found this specimen?</h2>

          <p>This concerns its field or collection history—not who owns or stores it today.</p>
        </div>

        <div className="record-choice-list">
          {provenanceOptions.map((option) => {
            const isSelected = selectedProvenance === option.id;

            return (
              <button
                key={option.id}
                className={`record-choice ${isSelected ? "record-choice-active" : ""}`}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(option.id)}>
                <span className="record-choice-symbol" aria-hidden="true">
                  {option.symbol}
                </span>

                <span className="record-choice-copy">
                  <strong>{option.title}</strong>
                  <span>{option.description}</span>
                </span>

                <span className="record-choice-check" aria-hidden="true">
                  {isSelected ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>

        <div
          className={`record-selection-note ${selectedOption ? "record-selection-note-active" : ""}`}
          aria-live="polite">
          {selectedOption ? (
            <>
              <strong>{selectedOption.title}</strong>

              <span>Next, add what is known about where the specimen was found.</span>
            </>
          ) : (
            <span>
              Choose the closest option. Incomplete history does not prevent you from documenting an older collection.
            </span>
          )}
        </div>

        <div className="mobile-actions">
          <button className="primary-button" type="button" disabled={!selectedOption} onClick={onContinue}>
            Continue to find location
          </button>

          <button className="secondary-button" type="button" onClick={onSaveForLater}>
            Save and finish later
          </button>
        </div>
      </section>
    </>
  );
}
