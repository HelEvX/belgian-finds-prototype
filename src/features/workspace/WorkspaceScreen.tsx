type WorkspaceScreenProps = {
  queueCount: number;
  showWorkflowGuidance: boolean;
  onOpenQueue: () => void;
  onAddMaterial: () => void;
  onExplore: () => void;
  onOpenSettings: () => void;
};

export function WorkspaceScreen({
  queueCount,
  showWorkflowGuidance,
  onOpenQueue,
  onAddMaterial,
  onExplore,
  onOpenSettings,
}: WorkspaceScreenProps) {
  return (
    <>
      <header className="mobile-header">
        <div>
          <p className="mobile-eyebrow">Your contribution space</p>
          <h2>My workspace</h2>
        </div>

        <button className="icon-button" type="button" aria-label="Open settings" onClick={onOpenSettings}>
          ⚙
        </button>
      </header>

      <section className="record-flow">
        <p className="record-progress">Your records</p>

        {showWorkflowGuidance && (
          <div className="record-intro-card">
            <p className="card-kicker">Start with images</p>

            <h3>Document material at your own pace.</h3>

            <p>
              Add one specimen or import a group of existing images. Once images are correctly associated with
              specimens, they are placed in your annotation queue.
            </p>
          </div>
        )}

        <section className="mobile-section">
          <div className="section-heading">
            <h3>Annotation queue</h3>

            <span className="status-label">{queueCount} ready</span>
          </div>

          {queueCount === 0 ? (
            <div className="record-selection-note">
              <strong>No specimen drafts yet</strong>

              <span>Add images for one specimen, or import a batch and group them by specimen.</span>
            </div>
          ) : (
            <div className="record-selection-note record-selection-note-active">
              <strong>
                {queueCount} {queueCount === 1 ? "specimen draft is" : "specimen drafts are"} ready to document
              </strong>

              <span>
                The image association is complete. Select a specimen draft when you are ready to begin documentation.
              </span>
            </div>
          )}

          <div className="mobile-actions">
            <button
              className={queueCount > 0 ? "primary-button" : "secondary-button"}
              type="button"
              onClick={onOpenQueue}>
              View annotation queue
            </button>
          </div>
        </section>

        <section className="mobile-section">
          <div className="section-heading">
            <h3>My records</h3>
            <span className="status-label">0 saved</span>
          </div>

          <div className="record-selection-note">
            <strong>No saved records yet</strong>

            <span>Completed documentation and published records will appear here.</span>
          </div>
        </section>

        <div className="mobile-actions">
          <button className="primary-button" type="button" onClick={onAddMaterial}>
            Add material
          </button>

          <button className="secondary-button" type="button" onClick={onExplore}>
            Browse public finds
          </button>
        </div>
      </section>
    </>
  );
}

/* 
My workspace: future implementation (notes)

Annotation queue
Image-associated specimen drafts waiting for documentation.

My records
Private drafts, published records and records needing updates.

My following
Published records from other contributors that I chose to follow.

My contributions
Responses I have made where input was invited.

*/
