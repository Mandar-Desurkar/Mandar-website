"use client";

// Phone home screen (shown in the phone layout when no section is open). Like an iPhone home
// screen: a profile widget that answers "who is this and can I hire them?" with one-tap LinkedIn and
// Contact, a KPI widget, then an app grid with the five sections and both shipped apps, whose icons
// open the interactive prototypes directly.
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";
import { ChevronRight, MessageCircle } from "lucide-react";
import { useWindow, type SectionId } from "@/context/WindowContext";
import { profile, kpis, shippedApps } from "@/data/resume";
import { trackEvent } from "@/lib/analytics";
import styles from "./MobileHome.module.css";

const SECTIONS: { id: SectionId; label: string; icon: string }[] = [
  { id: "about", label: "About Me", icon: "/icons/folder.webp" },
  { id: "experience", label: "Experience", icon: "/icons/folder2.webp" },
  { id: "education", label: "Education", icon: "/icons/folder3.webp" },
  { id: "projects", label: "Projects", icon: "/icons/folder4.webp" },
  { id: "contact", label: "Contact", icon: "/icons/folder5.webp" },
];

export default function MobileHome() {
  const { isClosed, isMinimized, openSection, openPrototype } = useWindow();
  if (!isClosed && !isMinimized) return null;

  return (
    <div className={styles.home}>
      <section className={styles.profile} aria-label="Profile">
        <div className={styles.profileTop}>
          <Image src="/profile-new.jpg" alt={`${profile.name}, ${profile.role}`} width={64} height={64} className={styles.avatar} />
          <span className={styles.who}>
            <b>{profile.name}</b>
            <small>{profile.role}</small>
            <span className={styles.open}>
              <i /> Open to PM roles
            </span>
          </span>
        </div>
        <div className={styles.actions}>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primary}
            onClick={() => trackEvent("Clicked Contact Method", { method: "linkedin", placement: "home_widget" })}
          >
            <FaLinkedin size={16} /> LinkedIn
          </a>
          <button type="button" className={styles.secondary} onClick={() => openSection("contact", "home_widget")}>
            <MessageCircle size={16} /> Say hi
          </button>
        </div>
      </section>

      <section className={styles.kpis} aria-label="Highlights">
        {kpis.map((k) => (
          <span key={k.label}>
            <b>{`${k.prefix}${k.value}${k.suffix}`}</b>
            <small>{k.label}</small>
          </span>
        ))}
      </section>

      {/* Featured Figma Mobile Prototypes Showcase */}
      <section className={styles.prototypeWidget} aria-label="Interactive Prototypes">
        <div className={styles.prototypeWidgetHead}>
          <span className={styles.figmaBadge}>
            <svg width="10" height="15" viewBox="0 0 38 57" fill="none" aria-hidden="true">
              <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
              <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
              <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
              <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
              <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
            </svg>
            Figma Mobile Prototypes
          </span>
          <small className={styles.liveTag}>● Full Touch Mode</small>
        </div>
        <div className={styles.prototypeCards}>
          {shippedApps.map((app) => (
            <button
              key={app.name}
              type="button"
              className={styles.protoCard}
              onClick={() => app.prototype && openPrototype(app.prototype, "home_screen")}
              aria-label={`Open interactive prototype for ${app.name}`}
            >
              <Image src={app.icon} alt="" width={44} height={44} className={styles.protoIcon} />
              <div className={styles.protoInfo}>
                <b className={styles.protoName}>{app.name}</b>
                <small className={styles.protoCaption}>
                  {app.name === "Kissan Sampurna"
                    ? "250K+ Installs · Crop Advisory"
                    : "Dairy AI 0→1 · Herd Management"}
                </small>
              </div>
              <span className={styles.protoPlayBtn}>
                <span>Try</span>
                <ChevronRight size={14} />
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className={styles.grid}>
        {SECTIONS.map((s) => (
          <button key={s.id} type="button" className={styles.app} onClick={() => openSection(s.id, "home_widget")}>
            <span className={styles.folder}>
              <Image src={s.icon} alt="" width={60} height={60} />
            </span>
            <span className={styles.label}>{s.label}</span>
          </button>
        ))}
        {shippedApps.map((app) => (
          <button
            key={app.name}
            type="button"
            className={styles.app}
            onClick={() => app.prototype && openPrototype(app.prototype, "home_screen")}
            aria-label={`Try the ${app.name} app prototype`}
          >
            <span className={styles.appIcon}>
              <Image src={app.icon} alt="" width={60} height={60} />
              <i className={styles.play} aria-hidden="true">
                ▶
              </i>
            </span>
            <span className={styles.label}>{app.name.split(" ")[0]}</span>
          </button>
        ))}
      </div>
      <p className={styles.tip}>Tap Kissan or Gau to try the real app designs.</p>
    </div>
  );
}
