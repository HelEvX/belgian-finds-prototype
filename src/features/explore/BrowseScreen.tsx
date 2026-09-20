type BrowseScreenProps = {
  onOpenFind: () => void;
};

export function BrowseScreen({ onOpenFind }: BrowseScreenProps) {
  return (
    <>
      <header className="mobile-header">
        <div>
          <p className="mobile-eyebrow">Belgian Fossil Finds</p>
          <h2>Explore specimens</h2>
        </div>

        <button className="icon-button" type="button" aria-label="Open filters">
          ☷
        </button>
      </header>

      <div className="search-placeholder">
        <span>⌕</span>
        <span>Search specimens, places or names</span>
      </div>

      <div className="filter-row">
        <button className="filter-chip filter-chip-active" type="button">
          All specimens
        </button>

        <button className="filter-chip" type="button">
          Needs help
        </button>

        <button className="filter-chip" type="button">
          Reviewed
        </button>
      </div>

      <section className="browse-list">
        <button className="browse-card" type="button" onClick={onOpenFind}>
          <div className="find-image-placeholder image-ammonite">IMAGE</div>

          <div className="browse-card-content">
            <span className="status-label">Needs community input</span>
            <h3>Possible ammonite</h3>
            <p>Hainaut, Belgium</p>
            <small>3 views · Added recently</small>
          </div>
        </button>

        <button className="browse-card" type="button">
          <div className="find-image-placeholder image-shell">IMAGE</div>

          <div className="browse-card-content">
            <span className="status-label status-reviewed">Specialist reviewed</span>
            <h3>Fossil shell fragment</h3>
            <p>Limburg, Belgium</p>
            <small>2 views · Reviewed specimen</small>
          </div>
        </button>

        <button className="browse-card" type="button">
          <div className="find-image-placeholder image-rock">IMAGE</div>

          <div className="browse-card-content">
            <span className="status-label">Unidentified</span>
            <h3>Collection specimen</h3>
            <p>Belgian collection</p>
            <small>4 views · Help requested</small>
          </div>
        </button>

        <button className="browse-card" type="button">
          <div className="find-image-placeholder image-shell">IMAGE</div>

          <div className="browse-card-content">
            <span className="status-label">Community discussion</span>
            <h3>Possible sea urchin</h3>
            <p>Namur, Belgium</p>
            <small>5 views · 2 suggestions</small>
          </div>
        </button>
      </section>
    </>
  );
}
