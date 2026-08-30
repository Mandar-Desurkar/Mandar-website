"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Navbar.module.css";
import Link from "next/link";
import { BatteryMedium, Menu, X } from "lucide-react";

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only set time on client to avoid hydration mismatch
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const navLinks = [
    { name: "Experience", href: "#experience" },
    { name: "Education", href: "#education" },
    { name: "Products", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className={styles.menubar}>
      <nav className={styles.nav} ref={menuRef}>
        <button 
          className={`${styles.appleMenuBtn} ${isMenuOpen ? styles.menuOpen : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle System Menu"
        >
          <span className={styles.appleMenu}>&#63743;</span>
          <span className={styles.brandTitle}>Mandar Desurkar</span>
          <span className={styles.mobileHamburger}>
            {isMenuOpen ? <X size={14} /> : <Menu size={14} />}
          </span>
        </button>
        
        {/* Desktop inline menu */}
        <div className={styles.desktopLinks}>
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className={styles.menuItem}>
              {link.name}
            </Link>
          ))}
        </div>

        {/* Retro Mac OS Dropdown Menu for Mobile / Click */}
        {isMenuOpen && (
          <div className={styles.osDropdown}>
            <div className={styles.dropdownHeader}>Mandar Desurkar</div>
            <div className={styles.dropdownDivider}></div>
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className={styles.dropdownItem}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
      
      <div className={styles.systemTray}>
        <div className={styles.trayItem}>
          <BatteryMedium size={16} />
          <span className={styles.batteryText}>85%</span>
        </div>
        <div className={styles.trayItem}>
          {currentTime ? (
            <>
              <span className={styles.date}>
                {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <span className={styles.time}>
                {currentTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
              </span>
            </>
          ) : (
            <span>--:--</span>
          )}
        </div>
      </div>
    </header>
  );
}
