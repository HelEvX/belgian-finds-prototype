import type { PrototypeStep } from "../prototype/types";

type BottomNavigationProps = {
  step: PrototypeStep;
  onExplore: () => void;
  onAdd: () => void;
};

export function BottomNavigation({ step, onExplore, onAdd }: BottomNavigationProps) {
  return (
    <nav className="mobile-navigation" aria-label="Main navigation">
      <button className={`nav-item ${step <= 2 ? "nav-item-active" : ""}`} onClick={onExplore}>
        <span>⌂</span>
        Explore
      </button>

      <button className={`nav-item ${step >= 3 ? "nav-item-active" : ""}`} onClick={onAdd}>
        <span>＋</span>
        Add
      </button>

      <button className="nav-item">
        <span>♡</span>
        My finds
      </button>

      <button className="nav-item">
        <span>?</span>
        Help
      </button>
    </nav>
  );
}
