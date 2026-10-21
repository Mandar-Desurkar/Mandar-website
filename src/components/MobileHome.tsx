"use client";

// Phone home screen (shown in the phone layout when no section is open). Like an iPhone home
// screen: a profile widget that answers "who is this and can I hire them?" with one-tap LinkedIn and
// Contact, a KPI widget, then an app grid with the five sections and both shipped apps, whose icons
// open the interactive prototypes directly.
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";
import { MessageCircle } from "lucide-react";
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
