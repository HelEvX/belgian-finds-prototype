import { useState } from "react";
import type { MeasurementStatus, PhysicalDetails, RecordKind, SpecimenCondition } from "./types";

type PhysicalDetailsScreenProps = {
  recordKind: RecordKind;
  value: PhysicalDetails;
  onChange: (value: PhysicalDetails) => void;
  onBack: () => void;
  onFinish: () => void;
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

function formatMeasurement(value: string, unit: string) {
  return value.trim() ? `${value.trim()} ${unit}` : null;
}

export function PhysicalDetailsScreen({ recordKind, value, onChange, onBack, onFinish }: PhysicalDetailsScreenProps) {
  const [isReady, setIsReady] = useState(false);

  const copy = physicalDetailsCopy[recordKind];

  const selectedMeasurementStatus = measurementOptions.find((option) => option.id === value.measurementStatus);

  const selectedCondition = conditionOptions.find((option) => option.id === value.condition);

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

  const measurements = [
    {
      label: "Longest dimension",
      value: formatMeasurement(value.lengthCm, "cm"),
    },
    {
      label: "Width",
      value: formatMeasurement(value.widthCm, "cm"),
    },
    {
      label: "Height or thickness",
      value: formatMeasurement(value.heightCm, "cm"),
    },
    {
      label: "Weight",
      value: formatMeasurement(value.weightG, "g"),
    },
  ].filter(
    (
      measurement,
    ): measurement is {
      label: string;
      value: string;
    } => measurement.value !== null,
  );

  if (isReady && selectedMeasurementStatus) {
    return (
      <>
        <header className="mobile-header">
          <button className="back-button" type="button" onClick={() => setIsReady(false)}>
            ← Review physical details
          </button>

          <p className="mobile-eyebrow">Document specimen</p>
        </header>

        <section className="record-flow">
          <p className="record-progress">Specimen annotation · Physical details</p>

          <div className="record-intro-card">
            <p className="card-kicker">Specimen information</p>

            <h3>Physical details recorded</h3>

            <p>
              Measurements can be edited later if the specimen is measured again or more reliable documentation appears.
            </p>
          </div>

          <dl className="photo-ready-summary">
            <div>
              <dt>Measurement status</dt>
              <dd>{selectedMeasurementStatus.title}</dd>
            </div>

            {measurements.map((measurement) => (
              <div key={measurement.label}>
                <dt>{measurement.label}</dt>
                <dd>{measurement.value}</dd>
              </div>
            ))}

            {selectedCondition && (
              <div>
                <dt>{copy.conditionLabel}</dt>
                <dd>{selectedCondition.label}</dd>
              </div>
            )}
          </dl>

          {measurements.length === 0 && value.measurementStatus !== "not-measured" && (
            <div className="record-selection-note">
              <strong>No dimensions entered</strong>

              <span>This is fine for now. Measurements can be added later if they become available.</span>
            </div>
          )}

          <div className="record-selection-note">
            <strong>Next prototype phase</strong>

            <span>
              Description, help requests, privacy and review will be added after the shared annotation flow is complete.
            </span>
          </div>

          <div className="mobile-actions">
            <button className="primary-button" type="button" onClick={onFinish}>
              Return to annotation queue
            </button>

            <button className="secondary-button" type="button" onClick={onBack}>
              Back to location
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <header className="mobile-header">
        <button className="back-button" type="button" onClick={onBack}>
          ← Back
        </button>

        <p className="mobile-eyebrow">Document specimen</p>
      </header>

      <section className="record-flow">
        <p className="record-progress">Specimen annotation · Physical details</p>

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

            <span>A record can still be useful with photographs, field context and collection information.</span>
          </div>
        )}

        <div className="physical-condition-section">
          <div className="physical-section-heading">
            <h3>{copy.conditionLabel}</h3>
            <p>Optional, but helpful when the item is incomplete or consists of several pieces.</p>
          </div>

          <label className="physical-field">
            <span>{copy.conditionLabel}</span>

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

        <div
          className={`record-selection-note ${selectedMeasurementStatus ? "record-selection-note-active" : ""}`}
          aria-live="polite">
          {selectedMeasurementStatus ? (
            <>
              <strong>{selectedMeasurementStatus.title}</strong>

              <span>You can continue with incomplete or approximate physical details.</span>
            </>
          ) : (
            <span>Choose whether measurements are available, approximate or not yet recorded.</span>
          )}
        </div>

        <button
          className="primary-button record-continue-button"
          type="button"
          disabled={!selectedMeasurementStatus}
          onClick={() => setIsReady(true)}>
          Use these physical details
        </button>
      </section>
    </>
  );
}
