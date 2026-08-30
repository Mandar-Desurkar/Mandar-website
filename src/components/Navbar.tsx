"use client";

import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import Link from "next/link";
import { BatteryMedium } from "lucide-react";

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // Only set time on client to avoid hydration mismatch
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { name: "Experience", href: "#experience" },
    { name: "Education", href: "#education" },
    { name: "Products", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className={styles.menubar}>
      <nav className={styles.nav}>
        <div className={styles.brandGroup}>
          <span className={styles.appleMenu}>&#63743;</span>
          <Link href="/" className={styles.menuItem}>
            <b>Mandar OS</b>
          </Link>
        </div>
        
        {navLinks.map((link) => (
          <Link key={link.name} href={link.href} className={styles.menuItem}>
            {link.name}
          </Link>
        ))}
      </nav>
      
      <div className={styles.systemTray}>
        <div className={styles.trayItem}>
          <BatteryMedium size={18} />
          <span>85%</span>
        </div>
        <div className={styles.trayItem}>
          {currentTime ? (
            <>
              <span className={styles.date}>
                {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <span className={styles.time}>
                {currentTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </>
          ) : (
            <span>Loading...</span>
          )}
        </div>
      </div>
    </header>
  );
}
