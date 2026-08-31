"use client";

import { useWindow } from "@/context/WindowContext";
import styles from "./DesktopIcon.module.css";
import React from "react";

interface DesktopIconProps {
  id: string;
  title: string;
  icon: React.ReactNode;
}

export default function DesktopIcon({ id, title, icon }: DesktopIconProps) {
  const { openWindow } = useWindow();

  const handleClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      openWindow(id, title);
    }
  };

  const handleDoubleClick = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      openWindow(id, title);
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
      <span className={styles.iconLabel}>{title}</span>
    </div>
  );
}
