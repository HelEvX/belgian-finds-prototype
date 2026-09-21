import type { ReactNode } from "react";

export type DesktopSection = "specimens" | "catalogue-import";

type DesktopFrameProps = {
  activeSection: DesktopSection;
  children: ReactNode;
  onSelectSection: (section: DesktopSection) => void;
  onSwitchToMobile: () => void;
};

export function DesktopFrame({ activeSection, children, onSelectSection, onSwitchToMobile }: DesktopFrameProps) {
  return (
    <section className="desktop-preview" aria-label="Desktop member workspace preview">
      <div className="desktop-size-guard">
        <p className="eyebrow">Desktop workspace</p>

        <h2>Use a larger screen for catalogue import</h2>

        <p>
          Catalogue import is designed for a computer. You can continue adding individual specimens in the mobile view.
        </p>

        <button className="primary-button" type="button" onClick={onSwitchToMobile}>
          Return to mobile view
        </button>
      </div>

      <div className="desktop-frame">
        <aside className="desktop-sidebar">
          <div className="desktop-brand">
            <span className="desktop-brand-mark" aria-hidden="true">
              BFF
            </span>

            <div>
              <strong>Belgian Fossil Finds</strong>
              <span>Member workspace</span>
            </div>
          </div>

          <nav className="desktop-navigation" aria-label="Desktop workspace navigation">
            <button
              className={`desktop-nav-item ${activeSection === "specimens" ? "desktop-nav-item-active" : ""}`}
              type="button"
              aria-current={activeSection === "specimens" ? "page" : undefined}
              onClick={() => onSelectSection("specimens")}>
              <span aria-hidden="true">◈</span>
              My specimens
            </button>

            <button
              className={`desktop-nav-item ${activeSection === "catalogue-import" ? "desktop-nav-item-active" : ""}`}
              type="button"
              aria-current={activeSection === "catalogue-import" ? "page" : undefined}
              onClick={() => onSelectSection("catalogue-import")}>
              <span aria-hidden="true">⇧</span>
              Import catalogue
            </button>
          </nav>

          <div className="desktop-account-summary">
            <span className="member-avatar" aria-hidden="true">
              HD
            </span>

            <span>
              <strong>Helen Deleuze</strong>
              <small>Prototype member</small>
            </span>
          </div>
        </aside>

        <div className="desktop-content">{children}</div>
      </div>
    </section>
  );
}
