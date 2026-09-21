import { recordKinds } from "../record-find/recordKinds";
import type { SpecimenDraft, SpecimenDraftStep } from "../record-find/types";

type WelcomeScreenProps = {
  drafts: SpecimenDraft[];
  onResumeSpecimen: (draftId: string) => void;
  onAddSpecimen: () => void;
};

type SpecimenGroupProps = {
  title: string;
  drafts: SpecimenDraft[];
  onOpenSpecimen: (draftId: string) => void;
};

const resumeStepLabels: Record<SpecimenDraftStep, string> = {
  images: "Adding images",
  type: "Choosing specimen type",
  provenance: "Adding provenance",
  "find-location": "Adding find location",
  "physical-details": "Adding physical details",
  "identification-observations": "Adding identification and observations",
  privacy: "Choosing privacy and sharing",
};

function getSpecimenTitle(draft: SpecimenDraft) {
  return recordKinds.find((recordKind) => recordKind.id === draft.recordKind)?.title ?? "Type not yet recorded";
}

function getStatusLabel(draft: SpecimenDraft) {
  if (draft.status === "private-specimen") {
    return "Private specimen";
  }

  if (draft.status === "ready-for-review") {
    return "Ready for review";
  }

  return "Needs information";
}

function getProgressLabel(draft: SpecimenDraft) {
  if (draft.status === "private-specimen") {
    return "Saved privately";
  }

  if (draft.status === "ready-for-review") {
    return "Review before saving privately";
  }

  return resumeStepLabels[draft.resumeStep];
}

function getContextLabel(draft: SpecimenDraft) {
  const suggestedIdentification = draft.description.suggestedIdentification.trim();

  if (suggestedIdentification) {
    return suggestedIdentification;
  }

  const place = [draft.locationContext.municipality.trim(), draft.locationContext.province.trim()]
    .filter(Boolean)
    .join(", ");

  return place || null;
}

function SpecimenGroup({ title, drafts, onOpenSpecimen }: SpecimenGroupProps) {
  if (drafts.length === 0) {
    return null;
  }

  return (
    <section className="mobile-section member-specimen-group">
      <div className="section-heading">
        <h3>{title}</h3>

        <span className="status-label">
          {drafts.length} {drafts.length === 1 ? "specimen" : "specimens"}
        </span>
      </div>

      <div className="member-draft-list">
        {drafts.map((draft) => {
          const firstImage = draft.images[0];
          const title = getSpecimenTitle(draft);
          const context = getContextLabel(draft);
          const isPrivateSpecimen = draft.status === "private-specimen";
          const isReadyForReview = draft.status === "ready-for-review";

          return (
            <button
              className={`member-draft-card ${isPrivateSpecimen ? "member-draft-card-private" : ""}`}
              type="button"
              key={draft.id}
              aria-label={`Open ${title}`}
              onClick={() => onOpenSpecimen(draft.id)}>
              {firstImage ? (
                <img className="member-draft-thumbnail" src={firstImage.previewUrl} alt="" />
              ) : (
                <span className="member-draft-thumbnail member-draft-thumbnail-empty" aria-hidden="true">
                  No image
                </span>
              )}

              <span className="member-draft-copy">
                <span
                  className={`status-label ${
                    isPrivateSpecimen ? "member-status-private" : isReadyForReview ? "member-status-ready" : ""
                  }`}>
                  {getStatusLabel(draft)}
                </span>

                <strong>{title}</strong>

                {context && <span>{context}</span>}

                <small>
                  {getProgressLabel(draft)}
                  {" · "}
                  {draft.images.length} {draft.images.length === 1 ? "image" : "images"}
                </small>
              </span>

              <span className="member-draft-arrow" aria-hidden="true">
                →
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function WelcomeScreen({ drafts, onResumeSpecimen, onAddSpecimen }: WelcomeScreenProps) {
  const hasSpecimens = drafts.length > 0;

  const sortedDrafts = [...drafts].sort((firstDraft, secondDraft) =>
    secondDraft.updatedAt.localeCompare(firstDraft.updatedAt),
  );

  const needsInformation = sortedDrafts.filter(
    (draft) => draft.status === "ready-to-annotate" || draft.status === "annotation-in-progress",
  );

  const readyForReview = sortedDrafts.filter((draft) => draft.status === "ready-for-review");

  const privateSpecimens = sortedDrafts.filter((draft) => draft.status === "private-specimen");

  const summaryParts = [
    needsInformation.length > 0 ? `${needsInformation.length} need information` : null,
    readyForReview.length > 0 ? `${readyForReview.length} ready for review` : null,
    privateSpecimens.length > 0 ? `${privateSpecimens.length} saved privately` : null,
  ].filter(Boolean);

  return (
    <>
      <header className="mobile-header">
        <div>
          <p className="mobile-eyebrow">Belgian Fossil Finds</p>

          <h2>My specimens</h2>
        </div>

        {/* <div className="member-identity" aria-label="Signed in as Helen Deleuze">
          <span>Helen</span>

          <span className="member-avatar" aria-hidden="true">
            HD
          </span>
        </div> */}
      </header>

      <section className="member-summary-card">
        <p className="card-kicker">{hasSpecimens ? "Your specimens" : "Your private area"}</p>

        <h3>
          {hasSpecimens ? `${drafts.length} ${drafts.length === 1 ? "specimen" : "specimens"}` : "No specimens yet"}
        </h3>

        <p>
          {hasSpecimens
            ? `${summaryParts.join(" · ")}. Nothing is shared automatically.`
            : "Start with one specimen, its photographs, and whatever context you know. Nothing is shared automatically."}
        </p>
      </section>

      {!hasSpecimens && (
        <div className="mobile-actions">
          <button className="primary-button" type="button" onClick={onAddSpecimen}>
            Add a specimen
          </button>
        </div>
      )}

      {hasSpecimens && (
        <>
          <SpecimenGroup title="Needs information" drafts={needsInformation} onOpenSpecimen={onResumeSpecimen} />

          <SpecimenGroup title="Ready for review" drafts={readyForReview} onOpenSpecimen={onResumeSpecimen} />

          <SpecimenGroup title="Private specimens" drafts={privateSpecimens} onOpenSpecimen={onResumeSpecimen} />

          <div className="mobile-actions">
            <button className="secondary-button" type="button" onClick={onAddSpecimen}>
              Add another specimen
            </button>
          </div>
        </>
      )}
    </>
  );
}
