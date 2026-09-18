import type { CollectionDateQualifier, LocationContext, LocationKnowledge, ProvenanceKind } from "./types";

type LocationContextScreenProps = {
  provenance: ProvenanceKind;
  value: LocationContext;
  onChange: (value: LocationContext) => void;
  onBack: () => void;
  onContinue: () => void;
  onSaveForLater: () => void;
};

type LocationTextField = Exclude<
  keyof LocationContext,
  "knowledge" | "collectionDateQualifier" | "collectionDateValue"
>;

type ProvenanceLocationCopy = {
  heading: string;
  introduction: string;
  municipalityLabel: string;
  provinceLabel: string;
  siteLabel: string;
  geologyLabel: string;
  dateHeading: string;
  notesLabel: string;
  notesPlaceholder: string;
};

const provenanceLocationCopy: Record<ProvenanceKind, ProvenanceLocationCopy> = {
  "self-found": {
    heading: "Where did you find it?",
    introduction:
      "Add what you remember from the field. You can record detailed information now and decide what becomes public later.",
    municipalityLabel: "Municipality or nearest town",
    provinceLabel: "Province or region",
    siteLabel: "Site or locality",
    geologyLabel: "Formation, rock layer or sediment",
    dateHeading: "When did you find it?",
    notesLabel: "Field notes",
    notesPlaceholder: "For example: conditions, depth, nearby features or notes made during the visit.",
  },

  "known-collector": {
    heading: "Where was it found?",
    introduction: "Use information supplied by the original collector, association member or accompanying notes.",
    municipalityLabel: "Municipality or nearest town recorded",
    provinceLabel: "Province or region recorded",
    siteLabel: "Site or locality recorded",
    geologyLabel: "Formation, rock layer or sediment recorded",
    dateHeading: "When was it found?",
    notesLabel: "Collector’s notes",
    notesPlaceholder: "Add what the original collector said or wrote about the find.",
  },

  inherited: {
    heading: "What location information came with it?",
    introduction:
      "Labels, boxes, notebooks and catalogue numbers may preserve useful context. Copy uncertain wording rather than trying to interpret it.",
    municipalityLabel: "Municipality or nearest town on the label",
    provinceLabel: "Province or region on the label",
    siteLabel: "Site or locality on the label",
    geologyLabel: "Formation, rock layer or sediment, if recorded",
    dateHeading: "When was it collected?",
    notesLabel: "Label or notebook information",
    notesPlaceholder: "Copy relevant wording, catalogue references or abbreviations as accurately as possible.",
  },

  "documented-collection": {
    heading: "What does the documentation say?",
    introduction:
      "Record the locality information associated with the specimen, even when the original collector is no longer known.",
    municipalityLabel: "Municipality or nearest town documented",
    provinceLabel: "Province or region documented",
    siteLabel: "Site or locality documented",
    geologyLabel: "Formation, rock layer or sediment documented",
    dateHeading: "When was it collected?",
    notesLabel: "Documentation or catalogue notes",
    notesPlaceholder: "Copy label text, catalogue references or relevant notebook information.",
  },

  uncertain: {
    heading: "Is any find location still known?",
    introduction:
      "Partial clues can still be useful. Record only what can be supported by a label, note, container or reliable memory.",
    municipalityLabel: "Possible municipality or nearest town",
    provinceLabel: "Possible province or region",
    siteLabel: "Possible site or locality",
    geologyLabel: "Possible formation, rock layer or sediment",
    dateHeading: "When might it have been collected?",
    notesLabel: "Surviving clues",
    notesPlaceholder: "Describe any names, abbreviations, labels or other clues that might help recover the context.",
  },
};

const knowledgeOptions: Array<{
  id: LocationKnowledge;
  symbol: string;
  title: string;
  description: string;
}> = [
  {
    id: "known",
    symbol: "⌖",
    title: "Location known",
    description: "A municipality, site or other useful locality is recorded.",
  },
  {
    id: "partial",
    symbol: "≈",
    title: "Partial information",
    description: "Only a broad area or incomplete description survives.",
  },
  {
    id: "unknown",
    symbol: "?",
    title: "Location unknown",
    description: "No reliable find location is currently available.",
  },
];

const collectionDateOptions: Array<{
  id: CollectionDateQualifier;
  symbol: string;
  title: string;
  description: string;
}> = [
  {
    id: "on",
    symbol: "●",
    title: "On",
    description: "The exact collection date is known.",
  },
  {
    id: "around",
    symbol: "≈",
    title: "Around",
    description: "The closest known month is available, but the exact day is not.",
  },
  {
    id: "known-by",
    symbol: "≤",
    title: "Known by",
    description: "The specimen was already in the collection by this month.",
  },
];

function getCompatibleDateValue(currentValue: string, qualifier: CollectionDateQualifier) {
  const isExactDate = /^\d{4}-\d{2}-\d{2}$/.test(currentValue);

  const isMonth = /^\d{4}-\d{2}$/.test(currentValue);

  if (qualifier === "on") {
    return isExactDate ? currentValue : "";
  }

  if (isExactDate) {
    return currentValue.slice(0, 7);
  }

  return isMonth ? currentValue : "";
}

export function LocationContextScreen({
  provenance,
  value,
  onChange,
  onBack,
  onContinue,
  onSaveForLater,
}: LocationContextScreenProps) {
  const copy = provenanceLocationCopy[provenance];

  const selectedDateQualifier = collectionDateOptions.find((option) => option.id === value.collectionDateQualifier);

  const updateKnowledge = (knowledge: LocationKnowledge) => {
    onChange({
      ...value,
      knowledge,
    });
  };

  const updateTextField = (field: LocationTextField, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  const updateDateQualifier = (collectionDateQualifier: CollectionDateQualifier) => {
    onChange({
      ...value,
      collectionDateQualifier,
      collectionDateValue: getCompatibleDateValue(value.collectionDateValue, collectionDateQualifier),
    });
  };

  const updateCollectionDateValue = (collectionDateValue: string) => {
    onChange({
      ...value,
      collectionDateValue,
    });
  };

  return (
    <>
      <header className="mobile-header">
        <button className="back-button" type="button" onClick={onBack}>
          ← Provenance
        </button>

        <p className="mobile-eyebrow">Document specimen</p>
      </header>

      <section className="record-flow">
        <p className="record-progress">Find location and collecting context</p>

        <div className="record-heading">
          <h2>{copy.heading}</h2>
          <p>{copy.introduction}</p>
        </div>

        <div className="location-country">
          <div>
            <span>Country of find</span>
            <strong>Belgium</strong>
          </div>

          <p>This pilot focuses on fossils and collecting activity connected to Belgium.</p>
        </div>

        <div className="location-section-heading">
          <h3>How much location information is available?</h3>

          <p>Choose one option. The individual fields below are not required.</p>
        </div>

        <div className="record-choice-list">
          {knowledgeOptions.map((option) => {
            const isSelected = value.knowledge === option.id;

            return (
              <button
                key={option.id}
                className={`record-choice ${isSelected ? "record-choice-active" : ""}`}
                type="button"
                aria-pressed={isSelected}
                onClick={() => updateKnowledge(option.id)}>
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

        {value.knowledge && value.knowledge !== "unknown" && (
          <div className="location-fields">
            <div className="location-section-heading">
              <h3>Add what is known</h3>

              <p>Leave individual fields blank when the information is not available.</p>
            </div>

            <label className="location-field">
              <span>{copy.municipalityLabel}</span>

              <input
                type="text"
                value={value.municipality}
                placeholder="For example: Mons"
                autoComplete="off"
                onChange={(event) => updateTextField("municipality", event.currentTarget.value)}
              />
            </label>

            <label className="location-field">
              <span>{copy.provinceLabel}</span>

              <input
                type="text"
                value={value.province}
                placeholder="For example: Hainaut"
                autoComplete="off"
                onChange={(event) => updateTextField("province", event.currentTarget.value)}
              />
            </label>

            <label className="location-field">
              <span>{copy.siteLabel}</span>

              <input
                type="text"
                value={value.siteDescription}
                placeholder="Quarry, river bank, building site…"
                autoComplete="off"
                onChange={(event) => updateTextField("siteDescription", event.currentTarget.value)}
              />

              <small>Record useful detail now. Public precision will be chosen later.</small>
            </label>

            <label className="location-field">
              <span>{copy.geologyLabel}</span>

              <input
                type="text"
                value={value.geologicalContext}
                placeholder="If known"
                autoComplete="off"
                onChange={(event) => updateTextField("geologicalContext", event.currentTarget.value)}
              />
            </label>
          </div>
        )}

        {value.knowledge && (
          <div className="location-radios">
            <div className="location-section-heading">
              <h3>{copy.dateHeading}</h3>

              <p>Optional. Choose the level of certainty that best matches the available evidence.</p>
            </div>

            <div className="record-choice-list" role="radiogroup" aria-label={copy.dateHeading}>
              {collectionDateOptions.map((option) => {
                const isSelected = value.collectionDateQualifier === option.id;

                return (
                  <button
                    key={option.id}
                    className={`record-choice ${isSelected ? "record-choice-active" : ""}`}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => updateDateQualifier(option.id)}>
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

            {selectedDateQualifier && (
              <label className="location-field location-fields">
                <span>
                  {selectedDateQualifier.id === "on"
                    ? "Collection date"
                    : selectedDateQualifier.id === "around"
                      ? "Approximate month"
                      : "Known to be in the collection by"}
                </span>

                <input
                  type={selectedDateQualifier.id === "on" ? "date" : "month"}
                  value={value.collectionDateValue}
                  onChange={(event) => updateCollectionDateValue(event.currentTarget.value)}
                />

                <small>
                  {selectedDateQualifier.id === "on" && "Use this only when the exact day is known."}

                  {selectedDateQualifier.id === "around" &&
                    "Choose the closest known month. It remains marked as approximate."}

                  {selectedDateQualifier.id === "known-by" &&
                    "This means the specimen was already in the collection by this month, so it was found earlier."}
                </small>
              </label>
            )}
          </div>
        )}

        {value.knowledge && (
          <div className="location-fields">
            <label className="location-field">
              <span>{copy.notesLabel}</span>

              <textarea
                rows={4}
                value={value.sourceNotes}
                placeholder={copy.notesPlaceholder}
                onChange={(event) => updateTextField("sourceNotes", event.currentTarget.value)}
              />
            </label>
          </div>
        )}

        {value.knowledge === "unknown" && (
          <div className="record-selection-note">
            <strong>The private draft can still be saved</strong>

            <span>
              A missing find location limits scientific interpretation, but an inherited specimen may still be worth
              documenting. Location information can be added later if it is recovered.
            </span>
          </div>
        )}

        <div className="mobile-actions">
          <button className="primary-button" type="button" disabled={!value.knowledge} onClick={onContinue}>
            Continue to physical details
          </button>

          <button className="secondary-button" type="button" onClick={onSaveForLater}>
            Save and finish later
          </button>
        </div>
      </section>
    </>
  );
}
