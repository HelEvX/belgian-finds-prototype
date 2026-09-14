type WelcomeScreenProps = {
  onBrowse: () => void;
  onOpenFind: () => void;
  onOpenWorkspace: () => void;
};

export function WelcomeScreen({ onBrowse, onOpenFind, onOpenWorkspace }: WelcomeScreenProps) {
  return (
    <>
      <header className="mobile-header">
        <div>
          <p className="mobile-eyebrow">Belgian fossil community</p>
          <h2>Discover finds</h2>
        </div>

        <button className="icon-button" type="button" aria-label="Open my workspace" onClick={onOpenWorkspace}>
          ◎
        </button>
      </header>

      <section className="welcome-card">
        <p className="card-kicker">Explore · Learn · Connect</p>
        <h3>Fossils have stories to tell.</h3>
        <p>Browse Belgian-connected specimen records and share useful context when you are ready.</p>
      </section>

      <div className="mobile-actions">
        <button className="primary-button" type="button" onClick={onBrowse}>
          Browse finds
        </button>

        <button className="secondary-button" type="button" onClick={onOpenWorkspace}>
          Open my workspace
        </button>
      </div>

      <section className="mobile-section">
        <div className="section-heading">
          <h3>Recent finds</h3>

          <button className="text-button" type="button" onClick={onBrowse}>
            See all
          </button>
        </div>

        <button className="find-card find-card-button" type="button" onClick={onOpenFind}>
          <div className="find-image-placeholder">IMAGE</div>

          <div className="find-card-content">
            <span className="status-label">Needs community input</span>
            <h4>Possible ammonite</h4>
            <p>Hainaut, Belgium</p>
          </div>
        </button>
      </section>
    </>
  );
}
