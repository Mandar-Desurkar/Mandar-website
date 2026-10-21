"use client";

import { useWindow } from "@/context/WindowContext";
import styles from "./DesktopIcon.module.css";
import React from "react";

interface DesktopIconProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  dotColor?: string;
}

export default function DesktopIcon({ id, title, icon, dotColor }: DesktopIconProps) {
  const { setActiveTab, setIsMinimized, setIsClosed } = useWindow();

  const handleClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setActiveTab(id);
      setIsMinimized(false);
      setIsClosed(false);
    }
  };

  const handleDoubleClick = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setActiveTab(id);
      setIsMinimized(false);
      setIsClosed(false);
    }
  };

  return (
    <div 
      className={styles.desktopIcon}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
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
