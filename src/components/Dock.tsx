"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Dock.module.css";
import { Smile, FileText, Rocket, GraduationCap, Mail, Settings, Trash2, AlertTriangle } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { useWindow } from "@/context/WindowContext";

export default function Dock() {
  const [popupMessage, setPopupMessage] = useState<{title: string, body: string} | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { activeTab, setActiveTab, isMinimized, setIsMinimized } = useWindow();

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false); // scrolling down
      } else {
        setIsVisible(true); // scrolling up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleIconClick = (id: string, title: string) => {
    setActiveTab(id);
    if (isMinimized) {
      setIsMinimized(false);
    }
  };

  const handleSettings = () => {
    setPopupMessage({
      title: "System Preferences",
      body: "Error: The PM has locked the theme to 'Execute' mode."
    });
  };

  const handleTrash = () => {
    setPopupMessage({
      title: "Action Denied",
      body: "Error 403: Mandar's relentless discipline cannot be deleted."
    });
  };

  return (
    <>
      <div className={`${styles.dockWrapper} ${isVisible ? '' : styles.hidden}`}>
        <div className={styles.dock}>
          <div className={styles.dockItem} onClick={() => handleIconClick('about', 'About Me')}>
            <span className={styles.tooltip}>Mandar.app</span>
            <div className={`${styles.iconBg} ${styles.finder}`}>
              <Smile size={28} color="white" />
            </div>
            <div className={`${styles.dot} ${activeTab === 'about' ? styles.active : ''} ${isMinimized && activeTab === 'about' ? styles.minimizedIndicator : ''}`}></div>
          </div>

          <div className={styles.dockItem} onClick={() => handleIconClick('experience', 'Experience')}>
            <span className={styles.tooltip}>Experience Log</span>
            <div className={`${styles.iconBg} ${styles.notes}`}>
              <FileText size={28} color="white" />
            </div>
            <div className={`${styles.dot} ${activeTab === 'experience' ? styles.active : ''} ${isMinimized && activeTab === 'experience' ? styles.minimizedIndicator : ''}`}></div>
          </div>

          <div className={styles.dockItem} onClick={() => handleIconClick('education', 'Education')}>
            <span className={styles.tooltip}>Education</span>
            <div className={`${styles.iconBg} ${styles.education}`}>
              <GraduationCap size={28} color="white" />
            </div>
            <div className={`${styles.dot} ${activeTab === 'education' ? styles.active : ''} ${isMinimized && activeTab === 'education' ? styles.minimizedIndicator : ''}`}></div>
          </div>

          <div className={styles.dockItem} onClick={() => handleIconClick('projects', 'Projects')}>
            <span className={styles.tooltip}>Shipped Products</span>
            <div className={`${styles.iconBg} ${styles.safari}`}>
              <Rocket size={28} color="white" />
            </div>
            <div className={`${styles.dot} ${activeTab === 'projects' ? styles.active : ''} ${isMinimized && activeTab === 'projects' ? styles.minimizedIndicator : ''}`}></div>
          </div>

          <div className={styles.dockItem} onClick={() => handleIconClick('contact', 'Contact')}>
            <span className={styles.tooltip}>Contact</span>
            <div className={`${styles.iconBg} ${styles.mail}`}>
              <Mail size={28} color="white" />
            </div>
            <div className={`${styles.dot} ${activeTab === 'contact' ? styles.active : ''} ${isMinimized && activeTab === 'contact' ? styles.minimizedIndicator : ''}`}></div>
          </div>

          <div className={styles.dockItem} onClick={() => window.open('https://www.linkedin.com/in/mandar-desurkar/', '_blank')}>
            <span className={styles.tooltip}>LinkedIn</span>
            <div className={`${styles.iconBg} ${styles.linkedin}`}>
              <FaLinkedin size={28} color="white" />
            </div>
            <div className={styles.dot}></div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.dockItem} onClick={handleSettings}>
            <span className={styles.tooltip}>Theme Settings</span>
            <div className={`${styles.iconBg} ${styles.settings}`}>
              <Settings size={28} color="white" />
            </div>
            <div className={styles.dot}></div>
          </div>

          <div className={styles.dockItem} onClick={handleTrash}>
            <span className={styles.tooltip}>Imposter Syndrome</span>
            <div className={`${styles.iconBg} ${styles.trash}`}>
              <Trash2 size={28} color="white" />
            </div>
            <div className={styles.dot}></div>
          </div>
        </div>
      </div>

      {mounted && popupMessage && createPortal(
        <div className="popup-overlay" onClick={() => setPopupMessage(null)}>
          <div className="popup-alert" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <AlertTriangle size={24} className="popup-icon" />
              <span>{popupMessage.title}</span>
            </div>
            <div className="popup-body">
              <p>{popupMessage.body}</p>
            </div>
            <div className="popup-actions">
              <button className="os-btn" onClick={() => setPopupMessage(null)}>OK</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
