import type { PrototypeStep } from "../prototype/types";

type BottomNavigationProps = {
  step: PrototypeStep;
  isGuest: boolean;
  onExplore: () => void;
  onAdd: () => void;
  onMySpecimens: () => void;
  onUpdates: () => void;
  onRequestSignIn: () => void;
};

export function BottomNavigation({
  step,
  isGuest,
  onExplore,
  onAdd,
  onMySpecimens,
  onUpdates,
  onRequestSignIn,
}: BottomNavigationProps) {
  if (isGuest) {
    return (
      <nav className="mobile-navigation mobile-navigation-guest" aria-label="Main navigation">
        <button
          className={`nav-item ${step === 1 || step === 2 ? "nav-item-active" : ""}`}
          type="button"
          onClick={onExplore}>
          <span>⌂</span>
          Explore
        </button>

        <button className="nav-item nav-item-sign-in" type="button" onClick={onRequestSignIn}>
          <span>→</span>
          Sign in
        </button>
      </nav>
    );
  }

  const isAddActive = (step >= 3 && step <= 10) || step === 13 || step === 15;

  const isMySpecimensActive = step === 0 || step === 11 || step === 12 || step === 16;

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
        <span>+</span>
        Add
      </button>

      <button
        className={`nav-item ${isMySpecimensActive ? "nav-item-active" : ""}`}
        type="button"
        onClick={onMySpecimens}>
        <span>◈</span>
        My specimens
      </button>

      <button className={`nav-item ${step === 17 ? "nav-item-active" : ""}`} type="button" onClick={onUpdates}>
        <span>◌</span>
        Updates
      </button>
    </nav>
  );
}
