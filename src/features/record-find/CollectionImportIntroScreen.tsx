type CollectionImportIntroScreenProps = {
  showWorkflowGuidance: boolean;
  onBack: () => void;
  onExplore: () => void;
  onOpenImport: () => void;
};

export function CollectionImportIntroScreen({
  showWorkflowGuidance,
  onBack,
  onExplore,
  onOpenImport,
}: CollectionImportIntroScreenProps) {
  return (
    <>
      <header className="mobile-header">
        <button className="back-button" type="button" onClick={onBack}>
          ← Add material
        </button>

        <p className="mobile-eyebrow">Batch import</p>
      </header>

      <section className="record-flow">
        <p className="record-progress">Image intake</p>

        <div className="record-heading">
          <h2>Import a batch of images</h2>

          <p>Select several existing images, then group the views that show the same physical specimen.</p>
        </div>

        {showWorkflowGuidance && (
          <ul className="record-checklist">
            <li>
              <span aria-hidden="true">1</span>

              <div>
                <strong>Select existing images</strong>

                <p>Choose photographs from a folder, phone, tablet or other available storage.</p>
              </div>
            </li>

            <li>
              <span aria-hidden="true">2</span>

              <div>
                <strong>Group images by specimen</strong>

                <p>Front, reverse, detail and label images can be associated with the same specimen draft.</p>
              </div>
            </li>

            <li>
              <span aria-hidden="true">3</span>

              <div>
                <strong>Document drafts later</strong>

                <p>
                  Grouped specimen drafts enter your annotation queue and remain private until you choose to publish.
                </p>
              </div>
            </li>
          </ul>
        )}

        <div className="mobile-actions">
          <button className="primary-button" type="button" onClick={onOpenImport}>
            Choose images
          </button>

          <button className="secondary-button" type="button" onClick={onExplore}>
            Return to Explore
          </button>
        </div>
      </section>
    </>
  );
}
