type CollectionImportIntroScreenProps = {
  onBack: () => void;
  onExplore: () => void;
  onOpenImport: () => void;
};

export function CollectionImportIntroScreen({ onBack, onExplore, onOpenImport }: CollectionImportIntroScreenProps) {
  return (
    <>
      <header className="mobile-header">
        <button className="back-button" type="button" onClick={onBack}>
          ← Back
        </button>

        <p className="mobile-eyebrow">Batch import</p>
      </header>

      <section className="record-flow">
        <p className="record-progress">Image intake</p>

        <div className="record-intro-card">
          <p className="card-kicker">Designed for existing image sets</p>

          <h3>Bring in a group of existing images.</h3>

          <p>
            Instead of repeating the one-specimen image process many times, you can select several files and group
            related views into specimen drafts.
          </p>
        </div>

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
              <p>Front, reverse, detail and label images can be assigned to the same specimen draft.</p>
            </div>
          </li>

          <li>
            <span aria-hidden="true">3</span>

            <div>
              <strong>Review grouped drafts</strong>
              <p>
                Nothing is published automatically. Each specimen can be documented gradually after its images are
                grouped.
              </p>
            </div>
          </li>
        </ul>

        <div className="record-selection-note">
          <strong>Prototype behaviour</strong>

          <span>
            You can select real local images in the next mockup. They are previewed only in your browser and are not
            uploaded, saved or published.
          </span>
        </div>

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
