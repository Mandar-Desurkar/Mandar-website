"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Navbar.module.css";
import Link from "next/link";
import { BatteryMedium, Menu, X, Bluetooth, Wifi, Search, SlidersHorizontal } from "lucide-react";
import { useWindow, type OpenSource, type SectionId } from "@/context/WindowContext";
import { trackEvent } from "@/lib/analytics";

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { openSection } = useWindow();

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
    { name: "About Me", id: "about" as const },
    { name: "Experience", id: "experience" as const },
    { name: "Education", id: "education" as const },
    { name: "Products", id: "projects" as const },
    { name: "Contact", id: "contact" as const },
  ];

  // openSection also reopens a closed window (previously menu links left it closed)
  const handleNavClick = (e: React.MouseEvent, id: SectionId, source: OpenSource) => {
    e.preventDefault();
    openSection(id, source);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    if (!isMenuOpen) trackEvent("Opened System Menu", {});
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.menubar}>
      <nav className={styles.nav} ref={menuRef}>
        <button 
          className={`${styles.appleMenuBtn} ${isMenuOpen ? styles.menuOpen : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle System Menu"
        >
          <span className={styles.brandTitle}>Mandar Desurkar</span>
          <span className={styles.mobileHamburger}>
            {isMenuOpen ? <X size={14} /> : <Menu size={14} />}
          </span>
        </button>
        
        {/* Desktop inline menu */}
        <div className={styles.desktopLinks}>
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={`#${link.id}`} 
              className={styles.menuItem}
              onClick={(e) => handleNavClick(e, link.id, "menu_bar")}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Retro Mac OS Dropdown Menu for Mobile / Click */}
        {isMenuOpen && (
          <div className={styles.osDropdown}>
            <div className={styles.dropdownHeader}>Mandar Desurkar</div>
            <div className={styles.dropdownDivider}></div>
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={`#${link.id}`} 
                className={styles.dropdownItem}
                onClick={(e) => handleNavClick(e, link.id, "system_menu")}
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </nav>
      
      <div className={styles.systemTray}>
        <div className={`${styles.trayIcon} ${styles.hideOnMobile}`}>
          <Bluetooth size={16} />
        </div>
        <div className={styles.trayItem}>
          <span className={styles.batteryText}>17%</span>
          <BatteryMedium size={18} color="#000000" />
        </div>
        <div className={`${styles.trayIcon} ${styles.hideOnMobile}`}>
          <Wifi size={16} />
        </div>
        <div className={`${styles.trayIcon} ${styles.hideOnMobile}`}>
          <Search size={16} />
        </div>
        <div className={`${styles.trayIcon} ${styles.hideOnMobile}`}>
          <SlidersHorizontal size={16} />
        </div>
        <div className={`${styles.trayIcon} ${styles.hideOnMobile}`}>
          <div className={styles.siriIcon}></div>
        </div>
        <div className={styles.trayItem}>
          {currentTime ? (
            <>
              <span className={styles.date}>
                {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <span className={styles.time}>
                {currentTime.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
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
