import { useState } from "react";
import type { HelpRequestPreference, IdentificationConfidence, SpecimenDescription } from "./types";

type DescriptionHelpScreenProps = {
  value: SpecimenDescription;
  onChange: (value: SpecimenDescription) => void;
  onBack: () => void;
  onFinish: () => void;
};

type DescriptionTextField = Exclude<keyof SpecimenDescription, "identificationConfidence" | "helpRequest">;

const confidenceOptions: Array<{
  id: IdentificationConfidence;
  label: string;
}> = [
  {
    id: "confident",
    label: "I am confident in this identification",
  },
  {
    id: "likely",
    label: "This is a likely identification",
  },
  {
    id: "unsure",
    label: "This is only a tentative suggestion",
  },
];

const helpOptions: Array<{
  id: HelpRequestPreference;
  symbol: string;
  title: string;
  description: string;
}> = [
  {
    id: "none",
    symbol: "—",
    title: "No request for help",
    description: "Document the specimen without inviting responses.",
  },
  {
    id: "community",
    symbol: "◎",
    title: "Open to community input",
    description: "Invite registered members to add public, attributed observations or suggestions after publication.",
  },
  {
    id: "verified-specialist",
    symbol: "✓",
    title: "Seek verified specialist input",
    description: "Request an attributed response from a validated scientist after publication.",
  },
];

export function DescriptionHelpScreen({ value, onChange, onBack, onFinish }: DescriptionHelpScreenProps) {
  const [isReady, setIsReady] = useState(false);

  const selectedConfidence = confidenceOptions.find((option) => option.id === value.identificationConfidence);

  const selectedHelpOption = helpOptions.find((option) => option.id === value.helpRequest);

  const hasSuggestedIdentification = value.suggestedIdentification.trim().length > 0;

  const updateTextField = (field: DescriptionTextField, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  const updateSuggestedIdentification = (suggestedIdentification: string) => {
    onChange({
      ...value,
      suggestedIdentification,
      identificationConfidence: suggestedIdentification.trim() ? value.identificationConfidence : null,
    });
  };

  const updateConfidence = (identificationConfidence: IdentificationConfidence | null) => {
    onChange({
      ...value,
      identificationConfidence,
    });
  };

  const updateHelpRequest = (helpRequest: HelpRequestPreference) => {
    onChange({
      ...value,
      helpRequest,
    });
  };

  if (isReady) {
    return (
      <>
        <header className="mobile-header">
          <button className="back-button" type="button" onClick={() => setIsReady(false)}>
            ← Review description
          </button>

          <p className="mobile-eyebrow">Document specimen</p>
        </header>

        <section className="record-flow">
          <p className="record-progress">Specimen annotation · Description</p>

          <div className="record-intro-card">
            <p className="card-kicker">Contributor statement</p>

            <h3>Description recorded</h3>

            <p>
              Your own observations and suggested identification remain separate from later community suggestions or
              verified determinations.
            </p>
          </div>

          <dl className="photo-ready-summary">
            <div>
              <dt>Suggested identification</dt>
              <dd>{hasSuggestedIdentification ? value.suggestedIdentification : "Not recorded"}</dd>
            </div>

            <div>
              <dt>Confidence</dt>
              <dd>{selectedConfidence?.label ?? "Not recorded"}</dd>
            </div>

            <div>
              <dt>Help preference</dt>
              <dd>{selectedHelpOption?.title ?? "Not recorded"}</dd>
            </div>
          </dl>

          {value.observations.trim() && (
            <div className="location-summary-notes">
              <strong>Your observations</strong>
              <p>{value.observations}</p>
            </div>
          )}

          <div className="record-selection-note">
            <strong>Important distinction</strong>

            <span>
              A suggested identification is the contributor’s own statement. It does not change the record’s
              determination status or create a verified identification.
            </span>
          </div>

          <div className="record-selection-note">
            <strong>Next prototype phase</strong>

            <span>
              Current custodian, storage, visibility, location privacy and final review will be added after this shared
              annotation flow.
            </span>
          </div>

          <div className="mobile-actions">
            <button className="primary-button" type="button" onClick={onFinish}>
              Return to annotation queue
            </button>

            <button className="secondary-button" type="button" onClick={() => setIsReady(false)}>
              Review description
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
          ← Physical details
        </button>

        <p className="mobile-eyebrow">Document specimen</p>
      </header>

      <section className="record-flow">
        <p className="record-progress">Specimen annotation · Description</p>

        <div className="record-heading">
          <h2>What do you know about this specimen?</h2>

          <p>
            Add your own observations and, if you know it, a suggested identification. You do not need to know its exact
            name.
          </p>
        </div>

        <div className="location-fields">
          <label className="location-field">
            <span>Your suggested identification</span>

            <input
              type="text"
              value={value.suggestedIdentification}
              placeholder="For example: Hoploscaphites sp."
              autoComplete="off"
              onChange={(event) => updateSuggestedIdentification(event.currentTarget.value)}
            />

            <small>
              Optional. This remains your own suggested identification until another attributed response or verified
              determination is added later.
            </small>
          </label>

          {hasSuggestedIdentification && (
            <label className="location-field">
              <span>How certain are you?</span>

              <select
                value={value.identificationConfidence ?? ""}
                onChange={(event) =>
                  updateConfidence(
                    event.currentTarget.value ? (event.currentTarget.value as IdentificationConfidence) : null,
                  )
                }>
                <option value="">Not recorded</option>

                {confidenceOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="location-field">
            <span>Your observations</span>

            <textarea
              rows={5}
              value={value.observations}
              placeholder="Describe visible features, label text, preservation, the reason for your suggested identification, or any other useful context."
              onChange={(event) => updateTextField("observations", event.currentTarget.value)}
            />

            <small>
              Optional. Record what you can observe rather than trying to write a formal scientific description.
            </small>
          </label>
        </div>

        <div className="physical-section-heading">
          <h3>Would you like to invite help?</h3>

          <p>This is a draft preference only. A private record remains private until you later choose to publish it.</p>
        </div>

        <div className="record-choice-list">
          {helpOptions.map((option) => {
            const isSelected = value.helpRequest === option.id;

            return (
              <button
                key={option.id}
                className={`record-choice ${isSelected ? "record-choice-active" : ""}`}
                type="button"
                aria-pressed={isSelected}
                onClick={() => updateHelpRequest(option.id)}>
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
          className={`record-selection-note ${selectedHelpOption ? "record-selection-note-active" : ""}`}
          aria-live="polite">
          {selectedHelpOption ? (
            <>
              <strong>{selectedHelpOption.title}</strong>

              <span>You can revise this preference when reviewing the record later.</span>
            </>
          ) : (
            <span>
              Help is optional. Leave this undecided for now or choose the option that best reflects your intention.
            </span>
          )}
        </div>

        <button className="primary-button record-continue-button" type="button" onClick={() => setIsReady(true)}>
          Use this description
        </button>
      </section>
    </>
  );
}
