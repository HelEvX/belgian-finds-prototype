import { useState } from "react";
import type { LocationContext, LocationKnowledge, ProvenanceKind } from "./types";

type LocationContextScreenProps = {
  provenance: ProvenanceKind;
  value: LocationContext;
  onChange: (value: LocationContext) => void;
  onBack: () => void;
};

type LocationTextField = Exclude<keyof LocationContext, "knowledge">;

type ProvenanceLocationCopy = {
  heading: string;
  introduction: string;
  municipalityLabel: string;
  provinceLabel: string;
  siteLabel: string;
  geologyLabel: string;
  dateLabel: string;
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
    dateLabel: "When did you find it?",
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
    dateLabel: "When was it found?",
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
    dateLabel: "Approximate collecting date",
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
    dateLabel: "Approximate collecting date",
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
    dateLabel: "Possible collecting period",
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

export function LocationContextScreen({ provenance, value, onChange, onBack }: LocationContextScreenProps) {
  const [isReady, setIsReady] = useState(false);

  const copy = provenanceLocationCopy[provenance];

  const selectedKnowledge = knowledgeOptions.find((option) => option.id === value.knowledge);

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

  if (isReady && selectedKnowledge) {
    return (
      <>
        <header className="mobile-header">
          <button className="back-button" type="button" onClick={() => setIsReady(false)}>
            ← Review location
          </button>

          <p className="mobile-eyebrow">Record a find</p>
        </header>

        <section className="record-flow">
          <p className="record-progress">Single find · Location and context</p>

          <div className="record-intro-card">
            <p className="card-kicker">Collecting context</p>

            <h3>Location context recorded</h3>

            <p>Missing details can be added later if another label, notebook or reliable source becomes available.</p>
          </div>

          <dl className="photo-ready-summary">
            <div>
              <dt>Location status</dt>
              <dd>{selectedKnowledge.title}</dd>
            </div>

            <div>
              <dt>Country of find</dt>
              <dd>Belgium</dd>
            </div>

            {value.municipality.trim() && (
              <div>
                <dt>Municipality</dt>
                <dd>{value.municipality}</dd>
              </div>
            )}

            {value.province.trim() && (
              <div>
                <dt>Province or region</dt>
                <dd>{value.province}</dd>
              </div>
            )}

            {value.siteDescription.trim() && (
              <div>
                <dt>Site or locality</dt>
                <dd>{value.siteDescription}</dd>
              </div>
            )}

            {value.geologicalContext.trim() && (
              <div>
                <dt>Geological context</dt>
                <dd>{value.geologicalContext}</dd>
              </div>
            )}

            {value.approximateDate.trim() && (
              <div>
                <dt>Date or period</dt>
                <dd>{value.approximateDate}</dd>
              </div>
            )}
          </dl>

          {value.sourceNotes.trim() && (
            <div className="location-summary-notes">
              <strong>{copy.notesLabel}</strong>
              <p>{value.sourceNotes}</p>
            </div>
          )}

          <div className="record-selection-note">
            <strong>Location privacy comes later</strong>

            <span>
              Recording a detailed locality does not mean it will be shown publicly. Visibility will be chosen in a
              separate step.
            </span>
          </div>

          <div className="record-selection-note">
            <strong>Next planned step</strong>

            <span>The contributor will add measurements and other physical details about the specimen.</span>
          </div>

          <div className="mobile-actions">
            <button className="primary-button" type="button" onClick={() => setIsReady(false)}>
              Review location context
            </button>

            <button className="secondary-button" type="button" onClick={onBack}>
              Back to provenance
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

        <p className="mobile-eyebrow">Record a find</p>
      </header>

      <section className="record-flow">
        <p className="record-progress">Single find · Location and context</p>

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

              <small>Record the useful detail now. Public precision will be chosen later.</small>
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

            <label className="location-field">
              <span>{copy.dateLabel}</span>

              <input
                type="text"
                value={value.approximateDate}
                placeholder="Exact date, year or approximate period"
                autoComplete="off"
                onChange={(event) => updateTextField("approximateDate", event.currentTarget.value)}
              />
            </label>

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
            <strong>The record can still be saved</strong>

            <span>
              A missing locality limits scientific interpretation, but an inherited specimen may still be worth
              documenting. Location information can be added later if it is recovered.
            </span>
          </div>
        )}

        <div
          className={`record-selection-note ${selectedKnowledge ? "record-selection-note-active" : ""}`}
          aria-live="polite">
          {selectedKnowledge ? (
            <>
              <strong>{selectedKnowledge.title}</strong>

              <span>You can continue even when the individual context fields are incomplete.</span>
            </>
          ) : (
            <span>Choose whether the find location is known, partial or currently unknown.</span>
          )}
        </div>

        <button
          className="primary-button record-continue-button"
          type="button"
          disabled={!selectedKnowledge}
          onClick={() => setIsReady(true)}>
          Use this location context
        </button>
      </section>
    </>
  );
}
