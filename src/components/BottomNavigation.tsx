import type { PrototypeStep } from "../prototype/types";

type BottomNavigationProps = {
  step: PrototypeStep;
  onExplore: () => void;
  onAdd: () => void;
  onMySpecimens: () => void;
  onSettings: () => void;
};

export function BottomNavigation({ step, onExplore, onAdd, onMySpecimens, onSettings }: BottomNavigationProps) {
  const isAddActive = (step >= 3 && step <= 10) || step === 13 || step === 15;

  const isMySpecimensActive = step === 0 || step === 11 || step === 12;

  return (
    <nav className="mobile-navigation" aria-label="Main navigation">
      <button
        className={`nav-item ${step === 1 || step === 2 ? "nav-item-active" : ""}`}
        type="button"
        onClick={onExplore}>
        <span>⌂</span>
        Explore
      </button>

      <button className={`nav-item ${isAddActive ? "nav-item-active" : ""}`} type="button" onClick={onAdd}>
        <span>🞦</span>
        Add
      </button>

      <button
        className={`nav-item ${isMySpecimensActive ? "nav-item-active" : ""}`}
        type="button"
        onClick={onMySpecimens}>
        <span>🞛</span>
        My specimens
      </button>

      <button className={`nav-item ${step === 14 ? "nav-item-active" : ""}`} type="button" onClick={onSettings}>
        <span>⚙</span>
        Settings
      </button>
    </nav>
  );
}
