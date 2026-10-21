"use client";

// An iOS home-screen app icon: a continuous-corner squircle (22.4% radius, as on iOS) with either a
// gradient and a white glyph, or a real app image. Used by the phone home screen and its dock.
import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./AppIcon.module.css";

type Props = {
  label?: string; // shown under the icon on the home grid; dock icons have none, as on iOS
  glyph?: ReactNode;
  image?: string;
  colors?: [string, string];
  size?: number;
  badge?: ReactNode;
  onClick?: () => void;
  href?: string;
  ariaLabel?: string;
  external?: boolean;
};

export default function AppIcon({ label, glyph, image, colors = ["#5AC8FA", "#007AFF"], size = 60, badge, onClick, href, ariaLabel, external }: Props) {
  const tile = (
    <span
      className={`${styles.tile} ${image ? styles.imageTile : ""}`}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.224,
        background: image ? "#fff" : `linear-gradient(180deg, ${colors[0]}, ${colors[1]})`,
      }}
    >
      {image ? <Image src={image} alt="" width={size} height={size} className={styles.image} /> : glyph}
      {badge && <span className={styles.badge}>{badge}</span>}
    </span>
  );
  const content = (
    <>
      {tile}
      {label && <span className={styles.label}>{label}</span>}
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        className={styles.icon}
        onClick={onClick}
        aria-label={ariaLabel ?? label}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={styles.icon} onClick={onClick} aria-label={ariaLabel ?? label}>
      {content}
    </button>
  );
}
