"use client";

// Phone-only navigation: an iOS tab bar shown while a section "app" is open (the home screen has
// its own dock of contact apps). Desktop keeps the double-click folders and the menu bar. Tapping
// the current tab again scrolls it back to the top, as on iOS.
import { useWindow } from "@/context/WindowContext";
import { SECTION_APPS } from "./ios/sections";
import styles from "./MobileDock.module.css";

export const SECTION_SCROLL_TOP = "section-scroll-top";

export default function MobileDock() {
  const { activeTab, isClosed, isMinimized, openSection } = useWindow();
  if (isClosed || isMinimized) return null;

  return (
    <nav className={styles.tabBar} aria-label="Sections">
      {SECTION_APPS.map(({ id, label, Glyph }) => {
        const current = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            className={`${styles.tab} ${current ? styles.active : ""}`}
            aria-current={current ? "page" : undefined}
            onClick={() => {
              if (current) window.dispatchEvent(new Event(SECTION_SCROLL_TOP));
              else openSection(id, "mobile_dock");
            }}
          >
            <Glyph size={25} strokeWidth={current ? 2.3 : 1.8} aria-hidden="true" />
            <span className={styles.label}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
