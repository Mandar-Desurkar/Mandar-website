"use client";

import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

// The menu bar stays out of the way: a name and a clock. Sections live on the desktop.
export default function Navbar() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Only set time on client to avoid hydration mismatch
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className={styles.menubar}>
      <span className={styles.name}>Mandar Desurkar</span>
      {now && (
        <time className={styles.clock} dateTime={now.toISOString()}>
          {now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }).replace(",", "")}
          <span>{now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" })}</span>
        </time>
      )}
    </header>
  );
}
