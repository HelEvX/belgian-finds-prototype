import { useEffect } from "react";

type AccountMenuProps = {
  onClose: () => void;
  onOpenPreferences: () => void;
};

export function AccountMenu({ onClose, onOpenPreferences }: AccountMenuProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      className="account-menu-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}>
      <section className="account-menu" role="dialog" aria-modal="true" aria-labelledby="account-menu-title">
        <header className="account-menu-header">
          <div>
            <p className="mobile-eyebrow">Account</p>
            <h2 id="account-menu-title">Your account</h2>
          </div>

          <button
            className="account-menu-close"
            type="button"
            aria-label="Close account menu"
            onClick={onClose}
            autoFocus>
            ×
          </button>
        </header>

        <div className="account-menu-identity">
          <span className="account-menu-avatar" aria-hidden="true">
            HD
          </span>

          <div>
            <strong>Helen Deleuze</strong>
            <span>Member</span>
          </div>
        </div>

        <div className="account-menu-list">
          <div className="account-menu-placeholder">
            <span className="account-menu-row-copy">
              <strong>Profile and membership</strong>
              <span>Profile details and roles will appear here.</span>
            </span>

            <span className="account-menu-row-status">Later</span>
          </div>

          <button className="account-menu-action" type="button" onClick={onOpenPreferences}>
            <span className="account-menu-row-copy">
              <strong>Preferences</strong>
              <span>Image guidance and workflow guidance.</span>
            </span>

            <span className="account-menu-action-arrow" aria-hidden="true">
              →
            </span>
          </button>

          <div className="account-menu-placeholder">
            <span className="account-menu-row-copy">
              <strong>Language</strong>
              <span>English for this prototype.</span>
            </span>

            <span className="account-menu-row-status">Later</span>
          </div>

          <div className="account-menu-placeholder account-menu-placeholder-muted">
            <span className="account-menu-row-copy">
              <strong>Sign out</strong>
              <span>No live account session is connected in this prototype.</span>
            </span>

            <span className="account-menu-row-status">Mock only</span>
          </div>
        </div>

        <p className="account-menu-prototype-note">
          Account identity, roles, language selection, and sign-out will require authenticated backend services later.
        </p>
      </section>
    </div>
  );
}
