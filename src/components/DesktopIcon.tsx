"use client";

import { useWindow, type SectionId } from "@/context/WindowContext";
import styles from "./DesktopIcon.module.css";
import React from "react";

interface DesktopIconProps {
  id: SectionId;
  title: string;
  icon: React.ReactNode;
  dotColor?: string;
}

export default function DesktopIcon({ id, title, icon, dotColor }: DesktopIconProps) {
  const { openSection } = useWindow();

  // Touch screens (phones and tablets) open with one tap; mouse users double-click like macOS
  const isTouch = () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  const handleClick = () => {
    if (isTouch() || window.innerWidth < 768) openSection(id, "desktop_icon");
  };

  const handleDoubleClick = () => {
    if (!isTouch() && window.innerWidth >= 768) openSection(id, "desktop_icon");
  };

  return (
    <div 
      className={styles.desktopIcon}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openSection(id, "desktop_icon");
        }
      }}
      role="button"
      tabIndex={0}
      title={`Open ${title}`}
    >
      <div className={styles.iconWrapper}>
        {icon}
      </div>
      <div className={styles.labelContainer}>
        {dotColor && <span className={styles.dot} style={{ backgroundColor: dotColor }} />}
        <span className={styles.iconLabel}>{title}</span>
      </div>
    </div>
  );
}
