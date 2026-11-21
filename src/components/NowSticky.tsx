"use client";

// A macOS Stickies note on the desktop: what I'm doing now (data/notebook `now`). Opens the Notebook's
// Now note. Desktop only; phones have the Notebook app on the home screen.
import { now } from "@/data/notebook";
import { useWindow } from "@/context/WindowContext";
import { openNote } from "@/lib/notebookNav";
import { trackEvent } from "@/lib/analytics";
import styles from "./NowSticky.module.css";

export default function NowSticky() {
  const { openSection } = useWindow();
  return (
    <button
      type="button"
      className={styles.sticky}
      onClick={() => {
        openNote("now");
        trackEvent("Opened Note", { note: "now", source: "sticky_note" });
        openSection("notebook", "sticky_note");
      }}
      aria-label="Now: what I'm doing right now. Opens the Notebook."
    >
      <span className={styles.head}>
        <span className={styles.title}>Now</span>
        <span className={styles.updated}>{now.updated}</span>
      </span>
      {now.items.map((it) => (
        <span key={it.label} className={styles.item}>
          <span className={styles.label}>{it.label}</span>
          {it.text}
        </span>
      ))}
    </button>
  );
}
