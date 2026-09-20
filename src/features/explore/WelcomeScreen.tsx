import { recordKinds } from "../record-find/recordKinds";
import type { SpecimenDraft, SpecimenDraftStep } from "../record-find/types";

type WelcomeScreenProps = {
  drafts: SpecimenDraft[];
  onResumeSpecimen: (draftId: string) => void;
  onAddSpecimen: () => void;
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

function getDraftTitle(draft: SpecimenDraft) {
  return recordKinds.find((recordKind) => recordKind.id === draft.recordKind)?.title ?? "Unidentified specimen";
}

function getDraftProgressLabel(draft: SpecimenDraft) {
  if (draft.status === "ready-for-review") {
    return "Ready for review";
  }

  return resumeStepLabels[draft.resumeStep];
}

export function WelcomeScreen({ drafts, onResumeSpecimen, onAddSpecimen }: WelcomeScreenProps) {
  const hasDrafts = drafts.length > 0;

  const sortedDrafts = [...drafts].sort((firstDraft, secondDraft) =>
    secondDraft.updatedAt.localeCompare(firstDraft.updatedAt),
  );

  return (
    <>
      <header className="mobile-header">
        <div>
          <p className="mobile-eyebrow">Belgian Fossil Finds</p>

          <h2>My specimens</h2>
        </div>
      </header>

      <section className="member-summary-card">
        <p className="card-kicker">{hasDrafts ? "Your private drafts" : "Your private area"}</p>

        <h3>
          {hasDrafts
            ? `${drafts.length} ${drafts.length === 1 ? "private draft" : "private drafts"}`
            : "No specimens yet"}
        </h3>

        <p>
          {hasDrafts
            ? "Continue any unfinished specimen when you are ready. Nothing is shared automatically."
            : "Start with one specimen, its photographs, and whatever context you know. Nothing is shared automatically."}
        </p>
      </section>

      {!hasDrafts && (
        <div className="mobile-actions">
          <button className="primary-button" type="button" onClick={onAddSpecimen}>
            Add a specimen
          </button>
        </div>
      )}

      {hasDrafts && (
        <>
          <section className="mobile-section">
            <div className="section-heading">
              <h3>Private drafts</h3>

              <span className="status-label">
                {drafts.length} {drafts.length === 1 ? "specimen" : "specimens"}
              </span>
            </div>

            <div className="member-draft-list">
              {sortedDrafts.map((draft) => {
                const firstImage = draft.images[0];
                const title = getDraftTitle(draft);
                const progressLabel = getDraftProgressLabel(draft);

                return (
                  <button
                    className="member-draft-card"
                    type="button"
                    key={draft.id}
                    onClick={() => onResumeSpecimen(draft.id)}>
                    {firstImage ? (
                      <img className="member-draft-thumbnail" src={firstImage.previewUrl} alt="" />
                    ) : (
                      <span className="member-draft-thumbnail member-draft-thumbnail-empty" aria-hidden="true">
                        No image
                      </span>
                    )}

                    <span className="member-draft-copy">
                      <span className="status-label">Private draft</span>

                      <strong>{title}</strong>

                      <span>{progressLabel}</span>

                      <small>
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
