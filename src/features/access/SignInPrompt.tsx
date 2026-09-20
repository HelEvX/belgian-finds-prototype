import { useEffect } from "react";

type SignInPromptProps = {
  title: string;
  description: string;
  onClose: () => void;
  onContinueAsMember: () => void;
};

export function SignInPrompt({ title, description, onClose, onContinueAsMember }: SignInPromptProps) {
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
      className="sign-in-prompt-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}>
      <section className="sign-in-prompt" role="dialog" aria-modal="true" aria-labelledby="sign-in-prompt-title">
        <header className="sign-in-prompt-header">
          <div>
            <p className="mobile-eyebrow">Member access</p>

            <h2 id="sign-in-prompt-title">{title}</h2>
          </div>

          <button className="sign-in-prompt-close" type="button" aria-label="Close sign-in prompt" onClick={onClose}>
            ×
          </button>
        </header>

        <p className="sign-in-prompt-description">{description}</p>

        <div className="mobile-actions">
          <button className="primary-button" type="button" onClick={onContinueAsMember} autoFocus>
            Continue as Helen
          </button>

          <button className="secondary-button" type="button" onClick={onClose}>
            Keep browsing
          </button>
        </div>

        <p className="sign-in-prompt-note">
          In a real version, this would open registration or sign-in. This prototype only switches between mocked guest
          and member states.
        </p>
      </section>
    </div>
  );
}
