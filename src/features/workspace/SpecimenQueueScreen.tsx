import { recordKinds } from "../record-find/recordKinds";
import type { SpecimenDraft } from "../record-find/types";

type SpecimenQueueScreenProps = {
  drafts: SpecimenDraft[];
  activeDraftId: string | null;
  onSelectDraft: (draftId: string) => void;
  onBack: () => void;
  onAddMaterial: () => void;
};

function getDraftTitle(draft: SpecimenDraft) {
  return recordKinds.find((record) => record.id === draft.recordKind)?.title ?? "Unidentified specimen draft";
}

function getDraftOriginLabel(draft: SpecimenDraft) {
  return draft.source === "batch-import" ? "Batch-imported specimen" : "Single specimen";
}

export function SpecimenQueueScreen({
  drafts,
  activeDraftId,
  onSelectDraft,
  onBack,
  onAddMaterial,
}: SpecimenQueueScreenProps) {
  const activeDraft = drafts.find((draft) => draft.id === activeDraftId);

  return (
    <>
      <header className="mobile-header">
        <button className="back-button" type="button" onClick={onBack}>
          ← My workspace
        </button>

        <p className="mobile-eyebrow">My workspace</p>
      </header>

      <section className="record-flow">
        <p className="record-progress">Annotation queue</p>

        <div className="record-heading">
          <h2>Specimen drafts ready to document</h2>

          <p>
            Images are now associated with the physical specimens they depict. Select a draft to prepare it for the
            shared documentation workflow.
          </p>
        </div>

        {drafts.length === 0 ? (
          <>
            <div className="record-selection-note">
              <strong>Your queue is empty</strong>

              <span>Add images for one specimen, or import a batch and group the images by specimen.</span>
            </div>

            <div className="mobile-actions">
              <button className="primary-button" type="button" onClick={onAddMaterial}>
                Add material
              </button>

              <button className="secondary-button" type="button" onClick={onBack}>
                Back to workspace
              </button>
            </div>
          </>
        ) : (
          <>
            <section className="bulk-draft-list">
              <div className="bulk-draft-list-heading">
                <h3>Ready to annotate</h3>

                <span>
                  {drafts.length} {drafts.length === 1 ? "draft" : "drafts"}
                </span>
              </div>

              {drafts.map((draft, index) => {
                const isActive = draft.id === activeDraftId;

                return (
                  <article className={`bulk-draft-card ${isActive ? "record-choice-active" : ""}`} key={draft.id}>
                    <div className="bulk-draft-card-header">
                      <div>
                        <span>{getDraftOriginLabel(draft)}</span>

                        <strong>{getDraftTitle(draft)}</strong>
                      </div>

                      <span className="status-label">Draft {index + 1}</span>
                    </div>

                    <div className="bulk-draft-thumbnails">
                      {draft.images.slice(0, 4).map((image) => (
                        <img key={`${draft.id}-${image.id}`} src={image.previewUrl} alt="" />
                      ))}

                      {draft.images.length > 4 && <span>+{draft.images.length - 4}</span>}
                    </div>

                    <p>
                      {draft.images.length} {draft.images.length === 1 ? "associated image" : "associated images"}
                      {draft.recordKind ? " · record type selected" : " · record type not yet selected"}
                    </p>

                    <div className="mobile-actions">
                      <button
                        className={isActive ? "secondary-button" : "primary-button"}
                        type="button"
                        onClick={() => onSelectDraft(draft.id)}>
                        {isActive ? "Selected for annotation" : "Select this draft"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>

            <div
              className={`record-selection-note ${activeDraft ? "record-selection-note-active" : ""}`}
              aria-live="polite">
              {activeDraft ? (
                <>
                  <strong>Draft selected for annotation</strong>

                  <span>
                    The next prototype step will connect this selected draft to the existing record-type, provenance,
                    location and physical-details screens.
                  </span>
                </>
              ) : (
                <span>Select one draft to prepare it for annotation.</span>
              )}
            </div>

            <div className="mobile-actions">
              <button className="secondary-button" type="button" onClick={onAddMaterial}>
                Add more material
              </button>

              <button className="secondary-button" type="button" onClick={onBack}>
                Back to workspace
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
}
