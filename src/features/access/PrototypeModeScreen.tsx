type PrototypeModeScreenProps = {
  onContinueAsGuest: () => void;
  onContinueAsMember: () => void;
};

export function PrototypeModeScreen({ onContinueAsGuest, onContinueAsMember }: PrototypeModeScreenProps) {
  return (
    <>
      <header className="mobile-header">
        <div>
          <p className="mobile-eyebrow">Belgian Fossil Finds</p>

          <h2>Explore or contribute</h2>
        </div>
      </header>

      <section className="prototype-mode-intro">
        <p className="card-kicker">Prototype access</p>

        <h3>Choose a starting view</h3>

        <p>
          This prototype can show the public browsing experience or the private member area. No real account is created
          here.
        </p>
      </section>

      <div className="prototype-mode-options">
        <button className="prototype-mode-option" type="button" onClick={onContinueAsGuest}>
          <span className="prototype-mode-symbol" aria-hidden="true">
            ⌂
          </span>

          <span className="prototype-mode-copy">
            <strong>Browse as a guest</strong>

            <span>Explore publicly shared specimens without an account.</span>
          </span>

          <span className="prototype-mode-arrow" aria-hidden="true">
            →
          </span>
        </button>

        <button
          className="prototype-mode-option prototype-mode-option-primary"
          type="button"
          onClick={onContinueAsMember}>
          <span className="prototype-mode-symbol" aria-hidden="true">
            HD
          </span>

          <span className="prototype-mode-copy">
            <strong>Continue as Helen</strong>

            <span>Open My specimens, add private drafts, and view member preferences.</span>
          </span>

          <span className="prototype-mode-arrow" aria-hidden="true">
            →
          </span>
        </button>
      </div>

      <p className="prototype-mode-note">
        Guest browsing is public. Adding specimens, following updates, and contributing observations require an account
        in the future product.
      </p>
    </>
  );
}
