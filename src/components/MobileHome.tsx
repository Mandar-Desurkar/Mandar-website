"use client";

// Phone home screen, designed as an iOS home screen (shown in the phone layout when no section is
// open): a medium profile widget and two small widgets (impact, current role), an app grid where each
// portfolio section is an "app" next to the two real apps I built (their icons open the interactive
// prototypes), and a dock of contact apps (Phone, Messages, Mail, LinkedIn) so reaching me is one tap.
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { useWindow } from "@/context/WindowContext";
import { profile, kpis, shippedApps, experiences } from "@/data/resume";
import { trackEvent } from "@/lib/analytics";
import AppIcon from "./ios/AppIcon";
import { SECTION_APPS } from "./ios/sections";
import styles from "./MobileHome.module.css";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const tel = profile.phone.replace(/\s/g, "");
const current = experiences.find((e) => !e.isFuture);
// "09/2025 - Present" → "Since Sep 2025"
const since = (() => {
  const m = current?.period.match(/^(\d{2})\/(\d{4})/);
  return m ? `Since ${MONTHS[Number(m[1]) - 1]} ${m[2]}` : current?.period;
})();

export default function MobileHome() {
  const { isClosed, isMinimized, openSection, openPrototype } = useWindow();
  if (!isClosed && !isMinimized) return null;

  const [lead, ...rest] = kpis;
  const fmt = (k: (typeof kpis)[number]) => `${k.prefix}${k.value}${k.suffix}`;

  return (
    <div className={styles.home}>
      <div className={styles.page}>
        {/* Medium widget: who I am; tap for the full story */}
        <button type="button" className={`${styles.widget} ${styles.profile}`} onClick={() => openSection("about", "home_widget")}>
          <Image src="/profile-new.jpg" alt="" width={64} height={64} className={styles.avatar} />
          <span className={styles.profileText}>
            <b>{profile.name}</b>
            <span>{profile.role}</span>
            <span className={styles.open}>
              <i /> Open to PM roles
            </span>
          </span>
        </button>

        {/* Two small widgets, side by side */}
        <div className={styles.smallRow}>
          <button type="button" className={`${styles.widget} ${styles.small}`} onClick={() => openSection("projects", "home_widget")}>
            <span className={styles.caption}>Impact</span>
            <b className={styles.bigNumber}>{fmt(lead)}</b>
            <span className={styles.bigLabel}>{lead.label}</span>
            <span className={styles.minor}>
              {rest.map((k) => (
                <span key={k.label}>
                  <b>{fmt(k)}</b> {k.label}
                </span>
              ))}
            </span>
          </button>
          <button type="button" className={`${styles.widget} ${styles.small} ${styles.now}`} onClick={() => openSection("experience", "home_widget")}>
            <span className={styles.caption}>Currently</span>
            <b className={styles.role}>{current?.role ?? profile.role}</b>
            <span className={styles.company}>{current?.company.replace(/ Private Limited$/, "")}</span>
            <span className={styles.since}>{since}</span>
          </button>
        </div>

        {/* App grid: the sections, then the two apps I built */}
        <div className={styles.grid}>
          {SECTION_APPS.map(({ id, label, Glyph, colors }) => (
            <AppIcon key={id} label={label} colors={colors} glyph={<Glyph size={30} strokeWidth={2} />} onClick={() => openSection(id, "home_widget")} />
          ))}
          {shippedApps.map((app) => (
            <AppIcon
              key={app.name}
              label={app.name.split(" ")[0]}
              image={app.icon}
              ariaLabel={`Try the ${app.name} app prototype`}
              onClick={() => app.prototype && openPrototype(app.prototype, "home_screen")}
            />
          ))}
        </div>
      </div>

      {/* Dock: contact apps, unlabelled as on iOS */}
      <nav className={styles.dock} aria-label="Contact">
        <AppIcon
          ariaLabel={`Call ${profile.name}`}
          href={`tel:${tel}`}
          colors={["#65E37A", "#2DBE4E"]}
          glyph={<Phone size={28} fill="#fff" strokeWidth={0} />}
          onClick={() => trackEvent("Clicked Contact Method", { method: "phone", placement: "home_dock" })}
        />
        <AppIcon
          ariaLabel={`Message ${profile.name}`}
          href={`sms:${tel}`}
          colors={["#6EF285", "#11C333"]}
          glyph={<MessageCircle size={30} fill="#fff" strokeWidth={0} />}
          onClick={() => trackEvent("Clicked Contact Method", { method: "sms", placement: "home_dock" })}
        />
        <AppIcon
          ariaLabel={`Email ${profile.name}`}
          href={`mailto:${profile.email}`}
          colors={["#3BB0FF", "#1068F0"]}
          glyph={<Mail size={30} strokeWidth={2} />}
          onClick={() => trackEvent("Clicked Contact Method", { method: "email", placement: "home_dock" })}
        />
        <AppIcon
          ariaLabel={`${profile.name} on LinkedIn`}
          href={profile.linkedin}
          external
          colors={["#1B86E0", "#0A66C2"]}
          glyph={<FaLinkedin size={30} />}
          onClick={() => trackEvent("Clicked Contact Method", { method: "linkedin", placement: "home_dock" })}
        />
      </nav>
    </div>
  );
}
