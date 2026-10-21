"use client";

// An iOS home-screen app icon: a continuous-corner squircle (22.4% radius, as on iOS) with either a
// gradient and a white glyph, or a real app image. Used by the phone home screen, its dock and
// Spotlight. Without a `size` it follows the --icon variable of the surrounding grid (default 60px).
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import styles from "./AppIcon.module.css";

type TileProps = {
  glyph?: ReactNode;
  image?: string;
  colors?: [string, string];
  size?: number;
  badge?: ReactNode;
};

type Props = TileProps & {
  label?: string; // shown under the icon on the home grid; dock icons have none, as on iOS
  onClick?: () => void;
  href?: string;
  ariaLabel?: string;
  external?: boolean;
};

// The tile alone, not interactive, for places that are already a button (Spotlight rows)
export function AppTile({ glyph, image, colors = ["#5AC8FA", "#007AFF"], size, badge }: TileProps) {
  return (
    <span className={styles.frame} style={size ? ({ "--icon": `${size}px` } as CSSProperties) : undefined}>
      <span
        className={`${styles.tile} ${image ? styles.imageTile : ""}`}
        style={{ background: image ? "#fff" : `linear-gradient(180deg, ${colors[0]}, ${colors[1]})` }}
      >
        {image ? <Image src={image} alt="" width={128} height={128} className={styles.image} /> : glyph}
      </span>
      {badge && <span className={styles.badge}>{badge}</span>}
    </span>
  );
}

export default function AppIcon({ label, onClick, href, ariaLabel, external, ...tile }: Props) {
  const content = (
    <>
      <AppTile {...tile} />
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
