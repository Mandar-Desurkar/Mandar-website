"use client";

import Image from "next/image";
import { useWindow, type SectionId } from "@/context/WindowContext";
import styles from "./DesktopIcon.module.css";
import type { ReactNode } from "react";

interface DesktopIconProps {
  title: string;
  // A section's window, or a custom action for the apps
  id?: SectionId;
  onOpen?: () => void;
  icon?: ReactNode;
  // A photo instead of a folder icon
  thumb?: string;
}

export default function DesktopIcon({ id, onOpen, title, icon, thumb }: DesktopIconProps) {
  const { openSection, activeTab, isClosed, isMinimized } = useWindow();
  // Like a selected item in Finder: the folder stays highlighted while its window is on screen
  const isOpen = !!id && activeTab === id && !isClosed && !isMinimized;
  const open = () => (id ? openSection(id, "desktop_icon") : onOpen?.());

  return (
    <div
      className={`${styles.desktopIcon} ${isOpen ? styles.selected : ""}`}
      aria-current={isOpen ? "true" : undefined}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      role="button"
      tabIndex={0}
      title={`Open ${title}`}
    >
      <div className={styles.iconWrapper}>
        {thumb ? (
          <span className={styles.thumb}>
            <Image src={thumb} alt="" width={128} height={128} />
          </span>
        ) : (
          icon
        )}
      </div>
      <div className={styles.labelContainer}>
        <span className={styles.iconLabel}>{title}</span>
      </div>
    </div>
  );
}
