type WelcomeScreenProps = {
  queueCount: number;
  onOpenQueue: () => void;
  onAddSpecimen: () => void;
};

export function WelcomeScreen({ queueCount, onOpenQueue, onAddSpecimen }: WelcomeScreenProps) {
  const hasDrafts = queueCount > 0;

  return (
    <>
      <header className="mobile-header">
        <div>
          <p className="mobile-eyebrow">Belgian Fossil Finds</p>

          <h2>My specimens</h2>
        </div>

        <div className="member-identity" aria-label="Signed in as Helen Deleuze">
          <span>Helen</span>

          <span className="member-avatar" aria-hidden="true">
            HD
          </span>
        </div>
      </header>

      <section className="member-summary-card">
        <p className="card-kicker">{hasDrafts ? "Needs information" : "Your private area"}</p>

        <h3>
          {hasDrafts
            ? `${queueCount} ${queueCount === 1 ? "specimen needs" : "specimens need"} information`
            : "No specimens yet"}
        </h3>

        <p>
          {hasDrafts
            ? "Continue documenting your private drafts whenever you are ready, or start another specimen."
            : "Start with one specimen, its photographs, and whatever context you know. Nothing is shared automatically."}
        </p>
      </section>

      <div className="mobile-actions">
        <button className="primary-button" type="button" onClick={hasDrafts ? onOpenQueue : onAddSpecimen}>
          {hasDrafts ? "Continue documenting" : "Add a specimen"}
        </button>

        {hasDrafts && (
          <button className="secondary-button" type="button" onClick={onAddSpecimen}>
            Add another specimen
          </button>
        )}
      </div>
    </>
  );
}
