"use client";

import { useEffect, useState } from "react";
import { Wifi } from "lucide-react";
import { profile } from "@/data/resume";
import { useWindow, type SectionId } from "@/context/WindowContext";
import styles from "./Navbar.module.css";

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "about", label: "About Me" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Case Studies" },
  { id: "contact", label: "Contact" },
];

type BatteryManager = EventTarget & { level: number };

// The menu bar battery. Shows the visitor's real level where the browser shares it, otherwise full.
function BatteryIcon() {
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManager> };
    let battery: BatteryManager | undefined;
    const update = () => battery && setLevel(battery.level);
    nav.getBattery?.().then((b) => {
      battery = b;
      update();
      b.addEventListener("levelchange", update);
    });
    return () => battery?.removeEventListener("levelchange", update);
  }, []);

  return (
    <svg className={styles.battery} width="25" height="12" viewBox="0 0 25 12" aria-hidden="true">
      <rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke="currentColor" opacity="0.45" />
      <rect x="2" y="2" width={Math.max(2, 18 * level)} height="8" rx="1.6" fill="currentColor" />
      <path d="M23 4v4c.8-.3 1.5-1.1 1.5-2S23.8 4.3 23 4Z" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

// The desktop menu bar: where you are on the left, system status and the time on the right
export default function Navbar() {
  const { activeTab, isClosed, isMinimized, openSection } = useWindow();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Only set time on client to avoid hydration mismatch
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className={styles.menubar}>
      <div className={styles.left}>
        <span className={styles.name}>{profile.name}</span>
        <nav className={styles.menu} aria-label="Sections">
          {SECTIONS.map(({ id, label }) => {
            const current = activeTab === id && !isClosed && !isMinimized;
            return (
              <button
                key={id}
                type="button"
                className={current ? styles.current : undefined}
                aria-current={current ? "page" : undefined}
                onClick={() => openSection(id, "menu_bar")}
              >
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className={styles.right}>
        <BatteryIcon />
        <Wifi size={15} strokeWidth={2.4} aria-hidden="true" />
        {now && (
          <time className={styles.clock} dateTime={now.toISOString()}>
            {now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }).replace(",", "")}
            <span>{now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" })}</span>
          </time>
        )}
      </div>
    </header>
  );
}
