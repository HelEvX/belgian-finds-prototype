import type { PrototypeStep } from "../prototype/types";

type BottomNavigationProps = {
  step: PrototypeStep;
  onExplore: () => void;
  onAdd: () => void;
  onWorkspace: () => void;
};

export function BottomNavigation({ step, onExplore, onAdd, onWorkspace }: BottomNavigationProps) {
  return (
    <nav className="mobile-navigation" aria-label="Main navigation">
      <button className={`nav-item ${step <= 2 ? "nav-item-active" : ""}`} type="button" onClick={onExplore}>
        <span>⌂</span>
        Explore
      </button>

      <button className={`nav-item ${step >= 3 && step <= 10 ? "nav-item-active" : ""}`} type="button" onClick={onAdd}>
        <span>🞦</span>
        Add
      </button>

      <button
        className={`nav-item ${step === 11 || step === 12 ? "nav-item-active" : ""}`}
        type="button"
        onClick={onWorkspace}>
        <span>🞛</span>
        My workspace
      </button>

      <button className="nav-item" type="button">
        <span>?</span>
        Help
      </button>
    </nav>
  );
}
