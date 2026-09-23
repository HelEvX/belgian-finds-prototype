import type { ReactNode } from "react";
import { getSpecimenDisplayTitle } from "./getSpecimenDisplayTitle";
import { provenanceOptions } from "./provenanceOptions";
import { recordKinds } from "./recordKinds";
import type {
  CollectionDateQualifier,
  HelpRequestPreference,
  IdentificationConfidence,
  LocationKnowledge,
  LocationVisibility,
  MeasurementStatus,
  SharingPreference,
  SpecimenCondition,
  SpecimenDraft,
  SpecimenDraftStep,
} from "./types";

type ReviewSpecimenScreenProps = {
  draft: SpecimenDraft;
  onBack: () => void;
  onEdit: (step: SpecimenDraftStep) => void;
  onSavePrivate: () => void;
};

type ReviewSectionProps = {
  title: string;
  editLabel: string;
  onEdit: () => void;
  children: ReactNode;
};

type ReviewDetailProps = {
  label: string;
  value: ReactNode;
};

const locationKnowledgeLabels: Record<LocationKnowledge, string> = {
  known: "Find location known",
  partial: "Partial find-location information",
  unknown: "Find location unknown",
};

const collectionDatePrefixes: Record<CollectionDateQualifier, string> = {
  on: "Collected on",
  around: "Collected around",
  "known-by": "Known to be in the collection by",
};

const measurementStatusLabels: Record<MeasurementStatus, string> = {
  measured: "Measurements taken",
  estimated: "Approximate measurements",
  "not-measured": "Not measured yet",
};

const conditionLabels: Record<SpecimenCondition, string> = {
  whole: "Whole or mostly complete",
  fragment: "Fragment or partial specimen",
  "multiple-pieces": "Several pieces belong together",
  unknown: "Condition not known",
};

const confidenceLabels: Record<IdentificationConfidence, string> = {
  confident: "Confident",
  likely: "Likely",
  unsure: "Tentative",
};

const helpPreferenceLabels: Record<HelpRequestPreference, string> = {
  none: "No request for help",
  community: "Open to input from other members after sharing",
  "verified-specialist": "Seek verified specialist input after sharing",
};

const sharingPreferenceLabels: Record<SharingPreference, string> = {
  private: "Keep this specimen private",
  community: "Prepare for possible sharing later",
};

const locationVisibilityLabels: Record<LocationVisibility, string> = {
  country: "Belgium only",
  province: "Province or region",
  municipality: "Municipality or broad locality",
};

function ReviewSection({ title, editLabel, onEdit, children }: ReviewSectionProps) {
  return (
    <section className="review-section">
      <div className="review-section-heading">
        <h3>{title}</h3>

        <button className="text-button review-edit-button" type="button" aria-label={editLabel} onClick={onEdit}>
          Edit
        </button>
      </div>

      {children}
    </section>
  );
}

function ReviewDetail({ label, value }: ReviewDetailProps) {
  return (
    <div className="review-detail-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function getCollectionDate(qualifier: CollectionDateQualifier | null, value: string) {
  if (!qualifier || !value.trim()) {
    return null;
  }

  return `${collectionDatePrefixes[qualifier]} ${value}`;
}

export function ReviewSpecimenScreen({ draft, onBack, onEdit, onSavePrivate }: ReviewSpecimenScreenProps) {
  const hasImages = draft.images.length > 0;

  const displayTitle = getSpecimenDisplayTitle(draft);

  const catalogueNumber = draft.catalogueImport?.catalogueNumber.trim() ?? "";

  const specimenType =
    recordKinds.find((recordKind) => recordKind.id === draft.recordKind)?.title ?? "Type not yet recorded";

  const provenance =
    provenanceOptions.find((option) => option.id === draft.provenance)?.title ?? "Provenance not yet recorded";

  const place = [draft.locationContext.municipality.trim(), draft.locationContext.province.trim()]
    .filter(Boolean)
    .join(", ");

  const collectionDate = getCollectionDate(
    draft.locationContext.collectionDateQualifier,
    draft.locationContext.collectionDateValue,
  );

  const dimensions = [
    {
      label: "Longest dimension",
      value: draft.physicalDetails.lengthCm.trim(),
    },
    {
      label: "Width",
      value: draft.physicalDetails.widthCm.trim(),
    },
    {
      label: "Height or thickness",
      value: draft.physicalDetails.heightCm.trim(),
    },
  ].filter((dimension) => dimension.value.length > 0);

  const suggestedIdentification = draft.description.suggestedIdentification.trim();

  const observations = draft.description.observations.trim();

  return (
    <>
      <header className="mobile-header">
        <button className="back-button" type="button" onClick={onBack}>
          ← My specimens
        </button>

        <p className="mobile-eyebrow">Private specimen</p>
      </header>

      <section className="record-flow review-flow">
        <p className="record-progress">Review specimen</p>

        <div className="record-heading">
          <h2>{displayTitle}</h2>

          <p>
            {catalogueNumber ? `Catalogue no. ${catalogueNumber}. ` : ""}
            Review the information below before saving it as a private specimen. Nothing will be published or shared.
          </p>
        </div>

        <p className="review-state-label">
          {draft.status === "private-specimen" ? "Private specimen" : "Ready for review"}
        </p>

        <ReviewSection title="Images" editLabel="Edit specimen images" onEdit={() => onEdit("images")}>
          {hasImages ? (
            <>
              <div
                className="review-thumbnail-strip"
                aria-label={`${draft.images.length} specimen ${draft.images.length === 1 ? "image" : "images"}`}>
                {draft.images.map((image, index) => (
                  <img
                    key={image.id}
                    className="review-thumbnail"
                    src={image.previewUrl}
                    alt={`Specimen photograph ${index + 1}`}
                  />
                ))}
              </div>

              <p className="review-section-summary">
                {draft.images.length} {draft.images.length === 1 ? "image" : "images"}
              </p>
            </>
          ) : (
            <div className="review-save-warning" role="alert">
              <strong>An image is required before private save</strong>

              <p>
                Your information is still preserved. Add at least one specimen image before saving this as a private
                specimen.
              </p>

              <button className="text-button" type="button" onClick={() => onEdit("images")}>
                Edit images
              </button>
            </div>
          )}
        </ReviewSection>

        {draft.source !== "catalogue-import" && (
          <ReviewSection title="Specimen type" editLabel="Edit specimen type" onEdit={() => onEdit("type")}>
            <p className="review-section-summary">{specimenType}</p>
          </ReviewSection>
        )}

        <ReviewSection title="Provenance" editLabel="Edit provenance" onEdit={() => onEdit("provenance")}>
          <p className="review-section-summary">{provenance}</p>
        </ReviewSection>

        <ReviewSection
          title="Find location and context"
          editLabel="Edit find location and collecting context"
          onEdit={() => onEdit("find-location")}>
          <dl className="review-detail-list">
            <ReviewDetail
              label="Location status"
              value={
                draft.locationContext.knowledge
                  ? locationKnowledgeLabels[draft.locationContext.knowledge]
                  : "Not yet recorded"
              }
            />

            {place && <ReviewDetail label="Broad location" value={place} />}

            {draft.locationContext.siteDescription.trim() && (
              <ReviewDetail label="Site or locality" value={draft.locationContext.siteDescription} />
            )}

            {draft.locationContext.geologicalContext.trim() && (
              <ReviewDetail label="Geological context" value={draft.locationContext.geologicalContext} />
            )}

            {collectionDate && <ReviewDetail label="Collection date" value={collectionDate} />}

            {draft.locationContext.sourceNotes.trim() && (
              <ReviewDetail
                label="Notes"
                value={<span className="review-long-text">{draft.locationContext.sourceNotes}</span>}
              />
            )}
          </dl>
        </ReviewSection>

        <ReviewSection
          title="Physical details"
          editLabel="Edit physical details"
          onEdit={() => onEdit("physical-details")}>
          <dl className="review-detail-list">
            <ReviewDetail
              label="Measurements"
              value={
                draft.physicalDetails.measurementStatus
                  ? measurementStatusLabels[draft.physicalDetails.measurementStatus]
                  : "Not yet recorded"
              }
            />

            {dimensions.map((dimension) => (
              <ReviewDetail key={dimension.label} label={dimension.label} value={`${dimension.value} cm`} />
            ))}

            {draft.physicalDetails.weightG.trim() && (
              <ReviewDetail label="Weight" value={`${draft.physicalDetails.weightG} g`} />
            )}

            {draft.physicalDetails.condition && (
              <ReviewDetail label="Condition" value={conditionLabels[draft.physicalDetails.condition]} />
            )}
          </dl>
        </ReviewSection>

        <ReviewSection
          title="Identification and observations"
          editLabel="Edit identification and observations"
          onEdit={() => onEdit("identification-observations")}>
          <dl className="review-detail-list">
            <ReviewDetail label="Current identification" value={suggestedIdentification || "No suggestion recorded"} />

            {suggestedIdentification && draft.description.identificationConfidence && (
              <ReviewDetail label="Confidence" value={confidenceLabels[draft.description.identificationConfidence]} />
            )}

            <ReviewDetail
              label="Observations"
              value={
                observations ? <span className="review-long-text">{observations}</span> : "No observations recorded"
              }
            />

            <ReviewDetail
              label="Help preference"
              value={
                draft.description.helpRequest
                  ? helpPreferenceLabels[draft.description.helpRequest]
                  : "No preference recorded"
              }
            />
          </dl>
        </ReviewSection>

        <ReviewSection
          title="Privacy and sharing"
          editLabel="Edit privacy and sharing preferences"
          onEdit={() => onEdit("privacy")}>
          <dl className="review-detail-list">
            <ReviewDetail
              label="Current preference"
              value={sharingPreferenceLabels[draft.privacySettings.sharingPreference]}
            />

            <ReviewDetail
              label="Location detail if shared later"
              value={locationVisibilityLabels[draft.privacySettings.locationVisibility]}
            />
          </dl>

          <p className="review-private-note">
            Exact site details remain private. Saving now creates a private specimen only; it does not publish or share
            anything.
          </p>
        </ReviewSection>

        <div className="mobile-actions review-actions">
          <button
            className="primary-button review-save-button"
            type="button"
            disabled={!hasImages}
            onClick={onSavePrivate}>
            Save private specimen
          </button>

          <button className="secondary-button" type="button" onClick={onBack}>
            Back to My specimens
          </button>
        </div>

        <p className="review-prototype-note">
          This prototype keeps specimens only in the current browser session. Refreshing the page clears them.
        </p>
      </section>
    </>
  );
}
