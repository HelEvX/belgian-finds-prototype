type SettingsScreenProps = {
  showWorkflowGuidance: boolean;
  showImageGuidance: boolean;
  onShowWorkflowGuidanceChange: (showWorkflowGuidance: boolean) => void;
  onShowImageGuidanceChange: (showImageGuidance: boolean) => void;
  onReviewContributionScope: () => void;
  onBack: () => void;
};

export function SettingsScreen({
  showWorkflowGuidance,
  showImageGuidance,
  onShowWorkflowGuidanceChange,
  onShowImageGuidanceChange,
  onReviewContributionScope,
  onBack,
}: SettingsScreenProps) {
  return (
    <>
      <header className="mobile-header">
        <button className="back-button" type="button" onClick={onBack}>
          ← Back
        </button>

        <p className="mobile-eyebrow">Account</p>
      </header>

      <section className="record-flow">
        <p className="record-progress">Preferences</p>

        <div className="record-heading">
          <h2>Preferences</h2>

          <p>Choose how much optional guidance you would like to see while documenting specimens.</p>
        </div>

        <section className="settings-section">
          <div className="settings-section-heading">
            <h3>Optional guidance</h3>

            <p>These options do not hide fields, validation messages, or important specimen status information.</p>
          </div>

          <label className="settings-option">
            <span className="settings-option-copy">
              <strong>Show workflow guidance</strong>

              <span>
                Show optional explanations and step-by-step guidance while adding photographs and documenting specimens.
              </span>
            </span>

            <input
              type="checkbox"
              checked={showWorkflowGuidance}
              onChange={(event) => onShowWorkflowGuidanceChange(event.currentTarget.checked)}
            />
          </label>

          <label className="settings-option">
            <span className="settings-option-copy">
              <strong>Show image guidance</strong>

              <span>Show recommendations such as taking a whole-object, reverse, side, or scale photograph.</span>
            </span>

            <input
              type="checkbox"
              checked={showImageGuidance}
              onChange={(event) => onShowImageGuidanceChange(event.currentTarget.checked)}
            />
          </label>
        </section>

        <section className="settings-section">
          <div className="settings-section-heading">
            <h3>Contribution scope</h3>

            <p>Review the first-time introduction if you would like to revisit which specimens this project accepts.</p>
          </div>

          <button className="secondary-button" type="button" onClick={onReviewContributionScope}>
            Review contribution scope
          </button>
        </section>

        <div className="mobile-actions">
          <button className="primary-button" type="button" onClick={onBack}>
            Done
          </button>
        </div>
      </section>
    </>
  );
}
