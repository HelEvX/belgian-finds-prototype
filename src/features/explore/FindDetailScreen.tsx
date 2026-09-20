type FindDetailScreenProps = {
  isGuest: boolean;
  onBack: () => void;
  onRequestSignIn: (title: string, description: string) => void;
};

export function FindDetailScreen({ isGuest, onBack, onRequestSignIn }: FindDetailScreenProps) {
  return (
    <>
      <header className="mobile-header">
        <button className="back-button" type="button" onClick={onBack}>
          ← Back
        </button>

        <button className="icon-button" type="button" aria-label="More options">
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
            <span>Contributor’s note</span>
            <p>“Possible ammonite”</p>
          </div>

          <div className="determination-empty">No community or specialist determination yet.</div>
        </section>

        <p className="detail-extra-copy">
          The contributor has provided images from the front and side, plus a view with a scale. More information about
          the geological context may help the community respond.
        </p>

        {isGuest ? (
          <div className="detail-guest-actions">
            <button
              className="primary-button"
              type="button"
              onClick={() =>
                onRequestSignIn(
                  "Sign in to contribute",
                  "Create an account to contribute an observation when a specimen owner invites community input.",
                )
              }>
              Sign in to contribute
            </button>

            <button
              className="secondary-button"
              type="button"
              onClick={() =>
                onRequestSignIn(
                  "Sign in to follow this specimen",
                  "Create an account to follow selected specimens and receive meaningful updates later.",
                )
              }>
              Sign in to follow
            </button>
          </div>
        ) : (
          <div className="detail-member-note">
            <strong>Community input</strong>

            <span>
              Owners will later decide whether to invite observations or request verified-specialist help for an
              individual specimen.
            </span>
          </div>
        )}
      </section>
    </>
  );
}
