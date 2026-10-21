"use client";

// Phone-only navigation: the iOS tab bar shown while a section "app" is open (the home screen has
// its own dock of contact apps), in the current Liquid Glass style: a floating capsule, the selected
// tab on a glass pill with a filled glyph, the others outlined. Desktop keeps the folders and the
// menu bar. Tapping the current tab again scrolls it back to the top, as on iOS.
import { useWindow } from "@/context/WindowContext";
import { SECTION_APPS } from "./ios/sections";
import styles from "./MobileDock.module.css";

export const SECTION_SCROLL_TOP = "section-scroll-top";

export default function MobileDock() {
  const { activeTab, isClosed, isMinimized, openSection } = useWindow();
  if (isClosed || isMinimized) return null;

  return (
    <nav className={styles.tabBar} aria-label="Sections">
      {SECTION_APPS.map(({ id, label, Glyph, Outline }) => {
        const current = activeTab === id;
        const Icon = current ? Glyph : Outline;
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
            <Icon className={styles.glyph} aria-hidden="true" />
            <span className={styles.label}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
