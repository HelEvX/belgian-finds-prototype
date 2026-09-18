import type { LocationVisibility, PrivacySettings, SharingPreference } from "./types";

type PrivacySharingScreenProps = {
  value: PrivacySettings;
  onChange: (value: PrivacySettings) => void;
  onBack: () => void;
  onFinish: () => void;
  onSaveForLater: () => void;
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
    description: "Only you can see this draft. You can review and share the specimen later.",
  },
  {
    id: "community",
    symbol: "◎",
    title: "Prepare to share with other members",
    description: "After final review, the specimen can be shared with the location detail you choose below.",
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

export function PrivacySharingScreen({ value, onChange, onBack, onFinish, onSaveForLater }: PrivacySharingScreenProps) {
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

  return (
    <>
      <header className="mobile-header">
        <button className="back-button" type="button" onClick={onBack}>
          ← Description
        </button>

        <p className="mobile-eyebrow">Document specimen</p>
      </header>

      <section className="record-flow">
        <p className="record-progress">Specimen details · Privacy and sharing</p>

        <div className="record-heading">
          <h2>Privacy and sharing</h2>

          <p>
            Keep this as a private draft or record a preference to share the specimen later. Nothing is published from
            this screen.
          </p>
        </div>

        <div className="physical-section-heading">
          <h3>Who could see this specimen after it is shared?</h3>

          <p>A final review will be required before any sharing takes place.</p>
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

        <div className="mobile-actions">
          <button className="primary-button" type="button" onClick={onFinish}>
            Finish privacy choices
          </button>

          <button className="secondary-button" type="button" onClick={onSaveForLater}>
            Save and finish later
          </button>
        </div>
      </section>
    </>
  );
}
