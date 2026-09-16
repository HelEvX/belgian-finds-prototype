import { useState } from "react";
import type { LocationVisibility, PrivacySettings, SharingPreference } from "./types";

type PrivacySharingScreenProps = {
  showWorkflowGuidance: boolean;
  value: PrivacySettings;
  onChange: (value: PrivacySettings) => void;
  onBack: () => void;
  onFinish: () => void;
};

const sharingOptions: Array<{
  id: SharingPreference;
  symbol: string;
  title: string;
  description: string;
}> = [
  {
    id: "private",
    symbol: "◌",
    title: "Keep as a private draft",
    description: "Only you can see the record. You can review and share it later.",
  },
  {
    id: "community",
    symbol: "◎",
    title: "Prepare to share with the community",
    description: "After final review, this record can be published with the location detail you choose below.",
  },
];

const locationVisibilityOptions: Array<{
  id: LocationVisibility;
  symbol: string;
  title: string;
  description: string;
}> = [
  {
    id: "country",
    symbol: "BE",
    title: "Belgium only",
    description: "Show only that the specimen has a Belgian connection.",
  },
  {
    id: "province",
    symbol: "⌖",
    title: "Province or region",
    description: "Share the recorded province or region, if available.",
  },
  {
    id: "municipality",
    symbol: "⌂",
    title: "Municipality or broad locality",
    description: "Share the recorded municipality or nearest town, if available.",
  },
];

export function PrivacySharingScreen({
  showWorkflowGuidance,
  value,
  onChange,
  onBack,
  onFinish,
}: PrivacySharingScreenProps) {
  const [isReady, setIsReady] = useState(false);

  const selectedSharingOption = sharingOptions.find((option) => option.id === value.sharingPreference);

  const selectedLocationOption = locationVisibilityOptions.find((option) => option.id === value.locationVisibility);

  const updateSharingPreference = (sharingPreference: SharingPreference) => {
    onChange({
      ...value,
      sharingPreference,
    });
  };

  const updateLocationVisibility = (locationVisibility: LocationVisibility) => {
    onChange({
      ...value,
      locationVisibility,
    });
  };

  if (isReady) {
    return (
      <>
        <header className="mobile-header">
          <button className="back-button" type="button" onClick={() => setIsReady(false)}>
            ← Review privacy choices
          </button>

          <p className="mobile-eyebrow">Document specimen</p>
        </header>

        <section className="record-flow">
          <p className="record-progress">Specimen annotation · Privacy</p>

          {showWorkflowGuidance && (
            <div className="record-intro-card">
              <p className="card-kicker">Privacy and sharing</p>

              <h3>Sharing choices recorded</h3>

              <p>The record remains a private draft until a later review confirms whether it should be published.</p>
            </div>
          )}

          <dl className="photo-ready-summary">
            <div>
              <dt>Record sharing</dt>

              <dd>{selectedSharingOption?.title}</dd>
            </div>

            <div>
              <dt>Location visible to others</dt>

              <dd>{selectedLocationOption?.title}</dd>
            </div>

            <div>
              <dt>Exact site details</dt>

              <dd>Private</dd>
            </div>
          </dl>

          <div className="record-selection-note">
            <strong>Exact site details stay private by default</strong>

            <span>
              Site names, quarry details, river sections, coordinates and other precise locality information are never
              shared automatically.
            </span>
          </div>

          <div className="mobile-actions">
            <button className="primary-button" type="button" onClick={onFinish}>
              Return to annotation queue
            </button>

            <button className="secondary-button" type="button" onClick={() => setIsReady(false)}>
              Review privacy choices
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
          ← Description
        </button>

        <p className="mobile-eyebrow">Document specimen</p>
      </header>

      <section className="record-flow">
        <p className="record-progress">Specimen annotation · Privacy</p>

        <div className="record-heading">
          <h2>Privacy and sharing</h2>

          <p>
            Decide whether to keep this record private or prepare it for community sharing. Nothing is published from
            this screen.
          </p>
        </div>

        <div className="physical-section-heading">
          <h3>Who can see this record?</h3>

          <p>You will have a final review before any community sharing happens.</p>
        </div>

        <div className="record-choice-list">
          {sharingOptions.map((option) => {
            const isSelected = value.sharingPreference === option.id;

            return (
              <button
                key={option.id}
                className={`record-choice ${isSelected ? "record-choice-active" : ""}`}
                type="button"
                aria-pressed={isSelected}
                onClick={() => updateSharingPreference(option.id)}>
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

        <div className="physical-section-heading">
          <h3>What location detail can others see?</h3>

          <p>Exact site details always remain private in this first version.</p>
        </div>

        <div className="record-choice-list">
          {locationVisibilityOptions.map((option) => {
            const isSelected = value.locationVisibility === option.id;

            return (
              <button
                key={option.id}
                className={`record-choice ${isSelected ? "record-choice-active" : ""}`}
                type="button"
                aria-pressed={isSelected}
                onClick={() => updateLocationVisibility(option.id)}>
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

        <div className="record-selection-note">
          <strong>Exact site details remain private</strong>

          <span>
            A detailed site or locality description can still be recorded for scientific context without being shown to
            other members.
          </span>
        </div>

        <button className="primary-button record-continue-button" type="button" onClick={() => setIsReady(true)}>
          Use these privacy choices
        </button>
      </section>
    </>
  );
}
