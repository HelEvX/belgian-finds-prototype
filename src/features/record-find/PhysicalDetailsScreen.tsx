import type { MeasurementStatus, PhysicalDetails, RecordKind, SpecimenCondition } from "./types";

type PhysicalDetailsScreenProps = {
  recordKind: RecordKind | null;
  value: PhysicalDetails;
  onChange: (value: PhysicalDetails) => void;
  onBack: () => void;
  onContinue: () => void;
  onSaveForLater: () => void;
};

type PhysicalTextField = Exclude<keyof PhysicalDetails, "measurementStatus" | "condition">;

type PhysicalDetailsCopy = {
  heading: string;
  introduction: string;
  dimensionsHeading: string;
  dimensionsDescription: string;
  lengthLabel: string;
  widthLabel: string;
  heightLabel: string;
  weightLabel: string;
  conditionLabel: string;
};

const physicalDetailsCopy: Record<RecordKind, PhysicalDetailsCopy> = {
  fossil: {
    heading: "Measure the fossil",
    introduction:
      "Measurements help others interpret photographs and compare the specimen with published material. Use the greatest visible dimensions where possible.",
    dimensionsHeading: "Measurements",
    dimensionsDescription: "Add only what you can measure safely and confidently.",
    lengthLabel: "Longest fossil dimension (cm)",
    widthLabel: "Widest fossil dimension (cm)",
    heightLabel: "Thickness or height (cm)",
    weightLabel: "Weight (g), if known",
    conditionLabel: "Completeness",
  },

  "rock-mineral": {
    heading: "Measure the specimen",
    introduction:
      "Dimensions and weight can help describe a rock or mineral specimen, especially when photographs do not make its scale clear.",
    dimensionsHeading: "Measurements",
    dimensionsDescription: "Use the largest visible dimensions of the specimen.",
    lengthLabel: "Longest dimension (cm)",
    widthLabel: "Widest dimension (cm)",
    heightLabel: "Height or thickness (cm)",
    weightLabel: "Weight (g), if known",
    conditionLabel: "Specimen condition",
  },

  "collection-item": {
    heading: "Add physical details",
    introduction:
      "Record the best available measurements for this collection item. Older labels or catalogue cards may provide useful approximate dimensions.",
    dimensionsHeading: "Measurements",
    dimensionsDescription: "Measurements can come from the object itself or reliable collection documentation.",
    lengthLabel: "Object length (cm)",
    widthLabel: "Object width (cm)",
    heightLabel: "Object height or depth (cm)",
    weightLabel: "Weight (g), if known",
    conditionLabel: "Object condition",
  },

  unknown: {
    heading: "Measure the object",
    introduction:
      "You do not need to know what it is. A simple measurement gives other people a useful sense of scale.",
    dimensionsHeading: "Measurements",
    dimensionsDescription: "Record the largest visible dimensions of the object.",
    lengthLabel: "Longest visible dimension (cm)",
    widthLabel: "Widest visible dimension (cm)",
    heightLabel: "Height or depth (cm)",
    weightLabel: "Weight (g), if known",
    conditionLabel: "Object condition",
  },
};

const measurementOptions: Array<{
  id: MeasurementStatus;
  symbol: string;
  title: string;
  description: string;
}> = [
  {
    id: "measured",
    symbol: "↔",
    title: "I can measure it",
    description: "I can use a ruler, callipers or a scale to record its dimensions.",
  },
  {
    id: "estimated",
    symbol: "≈",
    title: "I have an approximate size",
    description: "A label, notebook, old photograph or reliable memory gives an estimate.",
  },
  {
    id: "not-measured",
    symbol: "—",
    title: "Not measured yet",
    description: "Continue without measurements and add them later if possible.",
  },
];

const conditionOptions: Array<{
  id: SpecimenCondition;
  label: string;
}> = [
  {
    id: "whole",
    label: "Whole or mostly complete",
  },
  {
    id: "fragment",
    label: "Fragment or partial specimen",
  },
  {
    id: "multiple-pieces",
    label: "Several pieces belong together",
  },
  {
    id: "unknown",
    label: "Condition not known",
  },
];

export function PhysicalDetailsScreen({
  recordKind,
  value,
  onChange,
  onBack,
  onContinue,
  onSaveForLater,
}: PhysicalDetailsScreenProps) {
  const copy = physicalDetailsCopy[recordKind ?? "unknown"];

  const updateMeasurementStatus = (measurementStatus: MeasurementStatus) => {
    onChange({
      ...value,
      measurementStatus,
    });
  };

  const updateTextField = (field: PhysicalTextField, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  const updateCondition = (condition: SpecimenCondition | null) => {
    onChange({
      ...value,
      condition,
    });
  };

  return (
    <>
      <header className="mobile-header">
        <button className="back-button" type="button" onClick={onBack}>
          ← Location and context
        </button>

        <p className="mobile-eyebrow">Document specimen</p>
      </header>

      <section className="record-flow">
        <p className="record-progress">Specimen details · Physical details</p>

        <div className="record-heading">
          <h2>{copy.heading}</h2>
          <p>{copy.introduction}</p>
        </div>

        <div className="physical-section-heading">
          <h3>What can you provide?</h3>

          <p>Select one option. Measurements themselves remain optional.</p>
        </div>

        <div className="record-choice-list">
          {measurementOptions.map((option) => {
            const isSelected = value.measurementStatus === option.id;

            return (
              <button
                key={option.id}
                className={`record-choice ${isSelected ? "record-choice-active" : ""}`}
                type="button"
                aria-pressed={isSelected}
                onClick={() => updateMeasurementStatus(option.id)}>
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

        {value.measurementStatus && value.measurementStatus !== "not-measured" && (
          <div className="physical-details-fields">
            <div className="physical-section-heading">
              <h3>{copy.dimensionsHeading}</h3>
              <p>{copy.dimensionsDescription}</p>
            </div>

            <div className="physical-field-grid">
              <label className="physical-field">
                <span>{copy.lengthLabel}</span>

                <input
                  type="text"
                  inputMode="decimal"
                  value={value.lengthCm}
                  placeholder="For example: 6.2"
                  autoComplete="off"
                  onChange={(event) => updateTextField("lengthCm", event.currentTarget.value)}
                />
              </label>

              <label className="physical-field">
                <span>{copy.widthLabel}</span>

                <input
                  type="text"
                  inputMode="decimal"
                  value={value.widthCm}
                  placeholder="For example: 4.8"
                  autoComplete="off"
                  onChange={(event) => updateTextField("widthCm", event.currentTarget.value)}
                />
              </label>
            </div>

            <label className="physical-field">
              <span>{copy.heightLabel}</span>

              <input
                type="text"
                inputMode="decimal"
                value={value.heightCm}
                placeholder="For example: 1.4"
                autoComplete="off"
                onChange={(event) => updateTextField("heightCm", event.currentTarget.value)}
              />
            </label>

            <label className="physical-field">
              <span>{copy.weightLabel}</span>

              <input
                type="text"
                inputMode="decimal"
                value={value.weightG}
                placeholder="Optional"
                autoComplete="off"
                onChange={(event) => updateTextField("weightG", event.currentTarget.value)}
              />
            </label>

            {value.measurementStatus === "estimated" && (
              <div className="physical-estimate-note">
                <strong>Approximate dimensions are welcome</strong>

                <span>They will be treated as an estimate rather than as a precise scientific measurement.</span>
              </div>
            )}
          </div>
        )}

        {value.measurementStatus === "not-measured" && (
          <div className="record-selection-note">
            <strong>Measurements can be added later</strong>

            <span>The specimen can still be useful with photographs, find context, and collection information.</span>
          </div>
        )}

        <div className="physical-condition-section">
          <div className="physical-section-heading">
            <h3>{copy.conditionLabel}</h3>

            <p>Optional, but helpful when the item is incomplete or consists of several pieces.</p>
          </div>

          <label className="physical-field physical-fields">
            <select
              value={value.condition ?? ""}
              onChange={(event) =>
                updateCondition(event.currentTarget.value ? (event.currentTarget.value as SpecimenCondition) : null)
              }>
              <option value="">Not recorded</option>

              {conditionOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mobile-actions">
          <button className="primary-button" type="button" disabled={!value.measurementStatus} onClick={onContinue}>
            Continue to identification and observations
          </button>

          <button className="secondary-button" type="button" onClick={onSaveForLater}>
            Save and finish later
          </button>
        </div>
      </section>
    </>
  );
}
