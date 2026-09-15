import { stepNotes } from "../prototype/stepNotes";
import type { PrototypeStep } from "../prototype/types";

type NotesPanelProps = {
  step: PrototypeStep;
  onPrevious: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
};

export function NotesPanel({ step, onPrevious, onNext, nextDisabled = false }: NotesPanelProps) {
  const note = stepNotes[step];

  const isJourneyEnd = step === 2 || step === 6;

  const nextLabel =
    step === 10
      ? "Back to queue"
      : step === 11
        ? "Add material"
        : step === 12
          ? "Back to workspace"
          : isJourneyEnd
            ? "Restart journey"
            : "Next";

  return (
    <aside className="notes-panel">
      <p className="eyebrow">{note.label}</p>
      <h2>{note.title}</h2>

      <div className="note-block">
        <h3>Purpose</h3>
        <p>{note.purpose}</p>
      </div>

      <div className="note-block">
        <h3>Why it matters</h3>
        <p>{note.matters}</p>
      </div>

      <div className="note-block">
        <h3>Important decision</h3>
        <p>{note.decision}</p>
      </div>

      <div className="note-block">
        <h3>Prototype limitation</h3>

        <p>
          The records and interactions are mocked locally. No account, database, permanent image upload or help request
          is live yet.
        </p>
      </div>

      <div className="notes-actions">
        <button className="outline-button" type="button" onClick={onPrevious} disabled={step === 0}>
          Previous
        </button>

        <button className="dark-button" type="button" onClick={onNext} disabled={nextDisabled}>
          {nextLabel}
        </button>
      </div>
    </aside>
  );
}
