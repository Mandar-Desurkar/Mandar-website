"use client";

// Phone home screen, designed as an iOS home screen (shown in the phone layout when no section is
// open). Page 1: a medium profile widget (→ About) and two small widgets (impact → Projects, current
// role → Experience) in Liquid Glass, and an app grid where each portfolio section is an "app" next to
// the two real apps I built (their icons open the interactive prototypes). Swipe left for page 2: a
// clock + calendar widget on Mandar's time, with the Gau Sampurna website's icon below it. Pages use
// native scroll snapping, so the swipe has real momentum; the page dots, the iOS "Search" pill (opens
// Spotlight) and the dock of contact apps stay put, as on iOS. Widgets sit on the same 4-column grid as the icons. While a section app is open the
// home screen stays mounted behind it, inert, so it shows through the app's translucent glass as the
// desktop shows through a window.
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useWindow } from "@/context/WindowContext";
import { profile, kpis, shippedApps, experiences } from "@/data/resume";
import { trackEvent } from "@/lib/analytics";
import { haptic } from "@/lib/haptics";
import AppIcon from "./ios/AppIcon";
import ClockWidget from "./ios/ClockWidget";
import dynamic from "next/dynamic";
import { CONTACT_APPS } from "./ios/contactApps";
import { AmplitudeArt } from "./ios/IconArt";
import { SECTION_APPS } from "./ios/sections";
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
// The apps sit on page 1 beside the sections; the website moves to page 2, under the calendar
const apps = shippedApps.filter((a) => !a.isWebsite);
const websites = shippedApps.filter((a) => a.isWebsite);

// Search is rarely used on arrival, and it carries every section's keywords
const Spotlight = dynamic(() => import("./ios/Spotlight"), { ssr: false });

export default function MobileHome() {
  const { isClosed, isMinimized, openSection, openPrototype, searchOpen, setSearchOpen } = useWindow();
  const searchRef = useRef<HTMLButtonElement>(null);
  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    searchRef.current?.focus();
  }, [setSearchOpen]);
  const pagerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const viaDots = useRef(false);

  const onPagerScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    if (next === page) return;
    setPage(next);
    // A swipe landing on a new page ticks, as on iOS (a dot tap already ticked on press)
    if (!viaDots.current) haptic("selection");
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

  const behind = !isClosed && !isMinimized;

  const appIcon = (app: (typeof shippedApps)[number]) => (
    <AppIcon
      key={app.name}
      label={app.shortName ?? app.name}
      image={app.phoneIcon ?? app.icon}
      web={app.isWebsite}
      ariaLabel={`Try the ${app.name} prototype`}
      onClick={() => app.prototype && openPrototype(app.prototype, "home_screen")}
    />
  );

  return (
    <div className={`${styles.home} ${behind ? styles.behind : ""}`} inert={behind} aria-hidden={behind || undefined}>
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
                art={<app.Art />}
                onClick={() => openSection(app.id, "home_widget")}
              />
            ))}
            {apps.map(appIcon)}
          </div>
        </section>

        {/* Page 2: clock + calendar, then the website & Amplitude, on the same grid as page 1 */}
        <section className={styles.page} aria-label={`Home screen page 2 of ${PAGES}`}>
          <ClockWidget />
          <div className={styles.grid}>
            {websites.map(appIcon)}
            <AppIcon
              label="Amplitude"
              art={<AmplitudeArt />}
              ariaLabel="Amplitude Analytics"
              onClick={() => {
                haptic("selection");
                trackEvent("Clicked External Link", {
                  link_type: "analytics",
                  label: "Amplitude",
                  placement: "mobile_home",
                });
              }}
            />
          </div>
        </section>
      </div>

      {/* Page dots: iOS hides them behind the Search pill, but here page 2 should be discoverable */}
      <div className={styles.dots}>
        {Array.from({ length: PAGES }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.dot} ${i === page ? styles.dotActive : ""}`}
            data-haptic="selection"
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
          setSearchOpen(true);
        }}
      >
        <IoSearch size={13} aria-hidden="true" /> Search
      </button>

      {/* Dock: contact apps, unlabelled as on iOS */}
      <nav className={styles.dock} aria-label="Contact">
        {CONTACT_APPS.map(({ method, ariaLabel, href, external, Art }) => (
          <AppIcon
            key={method}
            ariaLabel={ariaLabel}
            href={href}
            external={external}
            art={<Art />}
            onClick={() => trackEvent("Clicked Contact Method", { method, placement: "home_dock" })}
          />
        ))}
      </nav>

      {searchOpen && !behind && <Spotlight onClose={closeSearch} />}
    </div>
  );
}
