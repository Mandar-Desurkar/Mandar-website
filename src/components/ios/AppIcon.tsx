"use client";

// An iOS home-screen app icon: a continuous-corner squircle (as on iOS) holding either drawn artwork
// (IconArt) or a real app image, with a glass rim. `web` marks a website with a small globe chip in
// the corner, so it isn't mistaken for the app beside it. Used by the phone home screen, its dock and
// Spotlight. Without a `size` it follows the --icon variable of the surrounding grid (default 60px).
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { IoGlobeOutline } from "react-icons/io5";
import styles from "./AppIcon.module.css";

type TileProps = {
  art?: ReactNode;
  image?: string;
  size?: number;
  web?: boolean;
};

type Props = TileProps & {
  label?: string; // shown under the icon on the home grid; dock icons have none, as on iOS
  onClick?: () => void;
  href?: string;
  ariaLabel?: string;
  external?: boolean;
};

// The tile alone, not interactive, for places that are already a button (Spotlight rows)
export function AppTile({ art, image, size, web }: TileProps) {
  return (
    <span className={styles.frame} style={size ? ({ "--icon": `${size}px` } as CSSProperties) : undefined}>
      <span className={`${styles.tile} ${image ? styles.imageTile : ""}`}>
        {image ? <Image src={image} alt="" width={128} height={128} className={styles.image} /> : art}
      </span>
      {web && (
        <span className={styles.web}>
          <IoGlobeOutline aria-hidden="true" />
        </span>
      )}
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
        data-haptic="light"
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
