export function UpdatesScreen() {
  return (
    <>
      <header className="mobile-header">
        <div>
          <p className="mobile-eyebrow">Member activity</p>

          <h2>Updates</h2>
        </div>
      </header>

      <section className="updates-empty">
        <span className="updates-empty-symbol" aria-hidden="true">
          ◌
        </span>

        <p className="card-kicker">Nothing new yet</p>

        <h3>Updates will appear here</h3>

        <p>
          Changes to your specimens and to specimens you follow will appear here when those features are introduced.
        </p>
      </section>
    </>
  );
}
