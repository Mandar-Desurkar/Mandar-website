"use client";

// Phone home screen, designed as an iOS home screen (shown in the phone layout when no section is
// open). Page 1: a medium profile widget (→ About) and two small widgets (impact → Projects, current
// role → Experience) in Liquid Glass, and an app grid where each portfolio section is an "app" next to
// the two real apps I built (their icons open the interactive prototypes). Swipe left for page 2: a
// clock + calendar widget on Mandar's time. Pages use native scroll snapping, so the swipe has real
// momentum; the page dots, the iOS "Search" pill (opens Spotlight) and the dock of contact apps stay
// put, as on iOS. Widgets sit on the same 4-column grid as the icons.
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useWindow } from "@/context/WindowContext";
import { profile, kpis, shippedApps, experiences } from "@/data/resume";
import { trackEvent } from "@/lib/analytics";
import AppIcon from "./ios/AppIcon";
import ClockWidget from "./ios/ClockWidget";
import Spotlight from "./ios/Spotlight";
import { CONTACT_APPS } from "./ios/contactApps";
import { SECTION_APPS, glyphSize } from "./ios/sections";
import styles from "./MobileHome.module.css";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const current = experiences.find((e) => !e.isFuture);
const company = current?.company.replace(/ Private Limited$/, "");
// "09/2025 - Present" → "Since Sep 2025"
const since = (() => {
  const m = current?.period.match(/^(\d{2})\/(\d{4})/);
  return m ? `Since ${MONTHS[Number(m[1]) - 1]} ${m[2]}` : current?.period;
})();
const fmt = (k: (typeof kpis)[number]) => `${k.prefix}${k.value}${k.suffix}`;
const [lead, ...rest] = kpis;
const PAGES = 2;

export default function MobileHome() {
  const { isClosed, isMinimized, openSection, openPrototype } = useWindow();
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLButtonElement>(null);
  const closeSearch = useCallback(() => {
    setSearching(false);
    searchRef.current?.focus();
  }, []);
  const pagerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const viaDots = useRef(false);

  const onPagerScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    if (next === page) return;
    setPage(next);
    trackEvent("Viewed Home Screen Page", { page: next + 1, method: viaDots.current ? "dots" : "swipe" });
    viaDots.current = false;
  };

  const goToPage = (i: number) => {
    const el = pagerRef.current;
    if (!el || i === page) return;
    viaDots.current = true;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: i * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
  };

  if (!isClosed && !isMinimized) return null;

  return (
    <div className={styles.home}>
      <div className={styles.pager} ref={pagerRef} onScroll={onPagerScroll}>
        <section className={styles.page} aria-label={`Home screen page 1 of ${PAGES}`}>
          {/* Medium widget: who I am; tap for the full story */}
          <button type="button" className={`${styles.widget} ${styles.profile}`} onClick={() => openSection("about", "home_widget")}>
            <Image src="/profile-avatar.jpg" alt="" width={128} height={128} className={styles.avatar} />
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
              <span className={styles.company}>{company}</span>
              <span className={styles.since}>{since}</span>
            </button>
          </div>

          {/* App grid: the sections, then the two apps I built */}
          <div className={styles.grid}>
            {SECTION_APPS.map((app) => (
              <AppIcon
                key={app.id}
                label={app.label}
                colors={app.colors}
                glyph={<app.Glyph size={glyphSize(app)} />}
                onClick={() => openSection(app.id, "home_widget")}
              />
            ))}
            {shippedApps.map((app) => (
              <AppIcon
                key={app.name}
                label={app.name}
                image={app.icon}
                ariaLabel={`Try the ${app.name} app prototype`}
                onClick={() => app.prototype && openPrototype(app.prototype, "home_screen")}
              />
            ))}
          </div>
        </section>

        {/* Page 2: clock + calendar */}
        <section className={styles.page} aria-label={`Home screen page 2 of ${PAGES}`}>
          <ClockWidget />
        </section>
      </div>

      {/* Page dots: iOS hides them behind the Search pill, but here page 2 should be discoverable */}
      <div className={styles.dots}>
        {Array.from({ length: PAGES }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.dot} ${i === page ? styles.dotActive : ""}`}
            aria-label={`Home screen page ${i + 1} of ${PAGES}`}
            aria-current={i === page ? "page" : undefined}
            onClick={() => goToPage(i)}
          />
        ))}
      </div>

      {/* iOS Search pill: opens Spotlight */}
      <button
        ref={searchRef}
        type="button"
        className={styles.search}
        aria-haspopup="dialog"
        onClick={() => {
          trackEvent("Opened Spotlight", {});
          setSearching(true);
        }}
      >
        <IoSearch size={13} aria-hidden="true" /> Search
      </button>

      {/* Dock: contact apps, unlabelled as on iOS */}
      <nav className={styles.dock} aria-label="Contact">
        {CONTACT_APPS.map(({ method, ariaLabel, href, external, Glyph, colors }) => (
          <AppIcon
            key={method}
            ariaLabel={ariaLabel}
            href={href}
            external={external}
            colors={colors}
            glyph={<Glyph size="54%" />}
            onClick={() => trackEvent("Clicked Contact Method", { method, placement: "home_dock" })}
          />
        ))}
      </nav>

      {searching && <Spotlight onClose={closeSearch} />}
    </div>
  );
}
