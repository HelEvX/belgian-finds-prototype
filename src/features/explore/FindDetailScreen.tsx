type FindDetailScreenProps = {
  onBack: () => void;
};

export function FindDetailScreen({ onBack }: FindDetailScreenProps) {
  return (
    <>
      <header className="mobile-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>

        <button className="icon-button" aria-label="More options">
          ···
        </button>
      </header>

      <section className="detail-gallery">
        <div className="detail-image-main">IMAGE</div>

        <div className="detail-thumbnails">
          <div className="detail-thumbnail thumbnail-active">FRONT</div>

          <div className="detail-thumbnail">SIDE</div>

          <div className="detail-thumbnail">SCALE</div>
        </div>
      </section>

      <section className="detail-content">
        <span className="status-label">Needs community input</span>

        <h2>Possible ammonite</h2>

        <p className="detail-location">Hainaut, Belgium · Found in 2024</p>

        <p className="detail-description">
          A small fossil collected during a family walk. The contributor suspects it may be an ammonite but is not sure.
        </p>

        <div className="detail-facts">
          <div>
            <span>Size</span>
            <strong>6 × 5 cm</strong>
          </div>

          <div>
            <span>Views</span>
            <strong>3 images</strong>
          </div>
        </div>

        <section className="determination-section">
          <h3>What people have said</h3>

          <div className="determination-item">
            <span>Collector’s note</span>
            <p>“Possible ammonite”</p>
          </div>

          <div className="determination-empty">No community or specialist determination yet.</div>
        </section>

        <p className="detail-extra-copy">
          The collector has provided images from the front and side, plus a view with a scale. More information about
          the geological context may help the community respond.
        </p>

        <button className="primary-button detail-help-button">Request help with this find</button>
      </section>
    </>
  );
}
