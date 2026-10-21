"use client";

// Phone-only navigation (< 768px): an iOS-style dock pinned to the bottom so every section is one
// thumb tap away. Desktop keeps the double-click folders and the menu bar. Tapping the open section
// again scrolls it back to the top, like an iOS tab bar.
import Image from "next/image";
import { useWindow, type SectionId } from "@/context/WindowContext";
import styles from "./MobileDock.module.css";

export const SECTION_SCROLL_TOP = "section-scroll-top";

const ITEMS: { id: SectionId; label: string; icon: string }[] = [
  { id: "about", label: "About", icon: "/icons/folder.webp" },
  { id: "experience", label: "Experience", icon: "/icons/folder2.webp" },
  { id: "education", label: "Education", icon: "/icons/folder3.webp" },
  { id: "projects", label: "Projects", icon: "/icons/folder4.webp" },
  { id: "contact", label: "Contact", icon: "/icons/folder5.webp" },
];

export default function MobileDock() {
  const { activeTab, isClosed, isMinimized, openSection } = useWindow();
  const windowVisible = !isClosed && !isMinimized;

  return (
    <nav className={styles.dock} aria-label="Sections">
      {ITEMS.map(({ id, label, icon }) => {
        const current = windowVisible && activeTab === id;
        return (
          <button
            key={id}
            type="button"
            className={`${styles.item} ${current ? styles.active : ""}`}
            aria-current={current ? "page" : undefined}
            onClick={() => {
              if (current) window.dispatchEvent(new Event(SECTION_SCROLL_TOP));
              else openSection(id, "mobile_dock");
            }}
          >
            <span className={styles.icon}>
              <Image src={icon} alt="" width={34} height={34} />
            </span>
            <span className={styles.label}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
