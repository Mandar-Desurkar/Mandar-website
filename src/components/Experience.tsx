"use client";

import Image from "next/image";
import styles from "./Experience.module.css";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useWindow } from "@/context/WindowContext";
import { ArrowUpRight, ChevronDown, Newspaper, Play, Trophy } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useIsMobile } from "@/hooks/useIsMobile";
import RichText from "./RichText";
import { experiences, beyondWork, type ExperienceGroup } from "@/data/resume";

const companyName = (company: string) => company.replace(/ Private Limited$/, "");
// "Silo Fortune" → "SF", "AltQube" → "AQ"
const initials = (company: string) => {
  const words = companyName(company).split(/\s+/);
  const letters = words.length > 1 ? words.map((w) => w[0]) : (words[0].match(/[A-Z]/g) ?? [words[0][0]]);
  return letters.join("").slice(0, 2).toUpperCase();
};

// "09/2025 - Present" → "1 yr 2 mos" (inclusive of both months)
function duration(period: string) {
  const [from, to] = period.split(" - ");
  const parse = (v: string) => {
    const [m, y] = v.split("/").map(Number);
    return m && y ? y * 12 + m - 1 : null;
  };
  const now = new Date();
  const start = parse(from);
  const end = to === "Present" ? now.getFullYear() * 12 + now.getMonth() : parse(to ?? "");
  if (start == null || end == null) return null;
  const months = end - start + 1;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && `${y} yr${y > 1 ? "s" : ""}`, m && `${m} mo${m > 1 ? "s" : ""}`].filter(Boolean).join(" ");
}


const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// "09/2025 - Present" → "Sep 2025 – Present"
const prettyPeriod = (period: string) =>
  period
    .split(" - ")
    .map((v) => {
      const [m, y] = v.split("/").map(Number);
      return m && y ? `${MONTHS[m - 1]} ${y}` : v;
    })
    .join(" – ");

// Phone: each group shows its first two achievements (the strongest come first) and folds the rest
// behind "Show N more". A single extra bullet isn't worth a tap, so short groups show everything.
const PREVIEW = 2;
const previewCount = (total: number) => (total <= PREVIEW + 1 ? total : PREVIEW);

const smooth = () =>
  typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "auto";

// "Kissan Sampurna & Gau Sampurna Apps: Growth & Monetization" → product eyebrow + short heading
function splitTitle(title?: string): [string | null, string | null] {
  if (!title) return [null, null];
  const at = title.indexOf(": ");
  return at > 0 ? [title.slice(0, at), title.slice(at + 2)] : [null, title];
}

// Phone: content folded behind a "Show N more" button that unfolds in place. Folded content is inert,
// so it is skipped by Tab and screen readers until shown.
function ShowMore({
  count,
  anchor,
  onExpand,
  children,
}: {
  count: number;
  anchor: React.RefObject<HTMLElement | null>;
  onExpand: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const toggle = () => {
    if (!open) {
      setOpen(true);
      onExpand();
      return;
    }
    setOpen(false);
    // Folding from far down would leave the reader below the group, so bring its start back into view
    const el = anchor.current;
    const scroller = el?.closest(".window-content-scroll");
    if (el && scroller && el.getBoundingClientRect().top < scroller.getBoundingClientRect().top + 60) {
      el.scrollIntoView({ block: "start", behavior: smooth() });
    }
  };
  return (
    <>
      <div id={id} className={`${styles.more} ${open ? styles.moreOpen : ""}`} inert={!open}>
        <div className={styles.moreInner}>{children}</div>
      </div>
      <button type="button" className={styles.showMore} aria-expanded={open} aria-controls={id} onClick={toggle}>
        {open ? "Show less" : `Show ${count} more`}
        <ChevronDown size={16} strokeWidth={2.4} className={styles.showMoreChevron} aria-hidden="true" />
      </button>
    </>
  );
}

// Phone: one product group, an eyebrow naming the product over a short heading, then its lead bullets
function PhoneGroup({ group, company, onPrototype }: { group: ExperienceGroup; company: string; onPrototype: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [product, heading] = splitTitle(group.title);
  const shown = previewCount(group.bullets.length);
  const rest = group.bullets.slice(shown);
  return (
    <div ref={ref} className={`${styles.group} ${styles.phoneGroup}`}>
      {product && <p className={styles.groupProduct}>{product}</p>}
      {heading && <h4 className={styles.groupTitle}>{heading}</h4>}
      {group.prototype && (
        <button type="button" className={styles.phonePrototype} data-haptic="medium" onClick={onPrototype}>
          <Play size={11} fill="currentColor" aria-hidden="true" /> View app prototype
        </button>
      )}
      <ul className={styles.bulletList}>
        {group.bullets.slice(0, shown).map((bullet) => (
          <li key={bullet}><RichText text={bullet} /></li>
        ))}
      </ul>
      {rest.length > 0 && (
        <ShowMore
          count={rest.length}
          anchor={ref}
          onExpand={() =>
            trackEvent("Expanded Experience Group", { company: companyName(company), group: group.title ?? "Overview", hidden_bullets: rest.length })
          }
        >
          <ul className={styles.bulletList}>
            {rest.map((bullet) => (
              <li key={bullet}><RichText text={bullet} /></li>
            ))}
          </ul>
        </ShowMore>
      )}
    </div>
  );
}

function PressItem({ item }: { item: (typeof beyondWork.press)[number] }) {
  return (
    <li>
      <a
        className={styles.press}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("Clicked External Link", { link_type: "press", label: item.headline })}
      >
        <span className={styles.pressText}>
          <span className={styles.pressHeadline}>{item.headline}</span>
          <span className={styles.pressMeta}>{[item.source, item.date].filter(Boolean).join(" · ")}</span>
        </span>
        <ArrowUpRight size={16} className={styles.pressArrow} aria-hidden="true" />
        <span className={styles.srOnly}> (opens in a new tab)</span>
      </a>
    </li>
  );
}

export default function Experience() {
  const { openPrototype: open } = useWindow();
  const isMobile = useIsMobile();
  const pressRef = useRef<HTMLDivElement>(null);
  const openPrototype = () => open("kissan-sampurna", "experience");
  const [playing, setPlaying] = useState(false);
  const [viewing, setViewing] = useState<(typeof beyondWork.photos)[number][number] | null>(null);

  useEffect(() => {
    if (!viewing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        trackEvent("Closed Photo Lightbox", { photo: viewing.src, method: "escape" });
        setViewing(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewing]);

  return (
    <section id="experience" className={styles.experienceSection}>
      <div className={`container ${styles.container}`}>

        <div className={styles.headerBox}>
          <h2 className="hand-heading-2" style={{ marginBottom: 0 }}>
            Experience
          </h2>
          <p className={styles.headerIntro}>3+ years building AI-powered 0→1 consumer apps.</p>
        </div>

        <div className={styles.entries}>
          {experiences.map((exp) => {
            const current = !exp.isFuture && exp.period.endsWith("Present");
            const length = duration(exp.period);
            return (
            <div key={`${exp.company}-${exp.role}`} className={`${styles.entry} ${exp.isFuture ? styles.futureEntry : ''} ${current ? styles.currentEntry : ''}`}>
              {/* Desktop: when and where, in a column beside the role */}
              <aside className={styles.rail} aria-hidden="true">
                {exp.logo ? (
                  <span className={`${styles.companyMark} ${styles.companyLogo}`}>
                    <Image src={exp.logo} alt="" width={80} height={80} />
                  </span>
                ) : (
                  <span className={styles.companyMark}>{exp.isFuture ? "→" : initials(exp.company)}</span>
                )}
                <span className={styles.railPeriod}>{exp.isFuture ? "Next chapter" : exp.period.replace(" - ", " – ")}</span>
                {length && <span className={styles.railLength}>{length}</span>}
              </aside>
              <div className={styles.entryBody}>
              {isMobile ? (
                // Phone: logo, role, then company, "Current", and when + how long, as on a profile card
                <div className={styles.phoneHead}>
                  <span className={styles.phoneLogo} aria-hidden="true">
                    {exp.logo ? <Image src={exp.logo} alt="" width={88} height={88} /> : initials(exp.company)}
                  </span>
                  <div className={styles.phoneHeadText}>
                    <h3 className={styles.role}>{exp.role}</h3>
                    <p className={styles.phoneCompany}>
                      {companyName(exp.company)}
                      {current && <span className={styles.phoneCurrent}>Current</span>}
                    </p>
                    <p className={styles.phoneDates}>
                      {prettyPeriod(exp.period)}
                      {length && <> · {length}</>}
                    </p>
                  </div>
                </div>
              ) : (
                <>
              <div className={styles.entryTitle}>
                <h3 className={styles.role}>{exp.role}</h3>
                {current && <span className={styles.currentBadge}>Current</span>}
              </div>

              <div className={styles.metaData}>
                <span className={styles.atSymbol}>@</span>
                <span className={styles.company}>{exp.company}</span>
                <span className={styles.period}>{exp.period}</span>
              </div>
                </>
              )}

              <p className={styles.description}>{exp.summary}</p>

              {isMobile && exp.groups?.map((group, i) => (
                <PhoneGroup key={group.title ?? i} group={group} company={exp.company} onPrototype={openPrototype} />
              ))}

              {!isMobile && exp.groups?.map((group, i) => (
                <div key={group.title ?? i} className={styles.group}>
                  {group.title && group.prototype ? (
                    <button type="button" className={styles.groupTitleButton} onClick={openPrototype}>
                      <span className={styles.groupTitle}>{group.title}</span>
                      <span className={styles.prototypePill}>▶ View app prototype</span>
                    </button>
                  ) : (
                    group.title && <h4 className={styles.groupTitle}>{group.title}</h4>
                  )}
                  <ul className={styles.bulletList}>
                    {group.bullets.map((bullet) => (
                      <li key={bullet}><RichText text={bullet} /></li>
                    ))}
                  </ul>
                </div>
              ))}
              </div>
            </div>
            );
          })}
        </div>

        {/* Beyond Work: the swimming story. On desktop a full-width feature (video beside the numbers, then
            the story, the press and the photos); on the phone the same pieces stack in one card. */}
        <section className={styles.beyondWorkCard} aria-labelledby="beyond-work-title">
          <div className={styles.beyondWorkHeader}>
            <Trophy size={18} color="#8e8e93" />
            <h3 className={styles.beyondWorkTitle}>Beyond Work</h3>
          </div>

          <div className={styles.entryTitle}>
            <h3 id="beyond-work-title" className={styles.role}>{beyondWork.title}</h3>
          </div>

          <div className={styles.metaData} style={{ marginBottom: '1.2rem' }}>
            <span className={styles.company} style={{ fontWeight: 500 }}>
              {beyondWork.discipline}
            </span>
            <span className={styles.period}>{beyondWork.period}</span>
          </div>

          <div className={styles.swimFeature}>
          {/* Click to play: only a thumbnail loads until then, so YouTube costs nothing up front */}
          <div className={styles.video}>
            {playing ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${beyondWork.video.id}?autoplay=1&rel=0`}
                title={beyondWork.video.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                className={styles.videoPoster}
                onClick={() => {
                  setPlaying(true);
                  trackEvent("Played Video", { video: beyondWork.video.id });
                }}
                aria-label={`Play: ${beyondWork.video.title}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- remote YouTube thumbnail */}
                <img src={`https://i.ytimg.com/vi/${beyondWork.video.id}/maxresdefault.jpg`} alt="" loading="lazy" />
                <span className={styles.playButton} aria-hidden="true">
                  <Play size={22} fill="currentColor" />
                </span>
                <span className={styles.videoBadge}>
                  <Play size={10} fill="currentColor" aria-hidden="true" /> Race video
                </span>
                <span className={styles.videoCaption}>
                  <span className={styles.videoHeadline}>{beyondWork.video.headline}</span>
                  <span className={styles.videoMeta}>{beyondWork.video.meta}</span>
                </span>
              </button>
            )}
          </div>

            {/* Reads number → what it counts → context */}
            <ul className={styles.swimStats}>
              {beyondWork.stats.map((stat) => (
                <li key={stat.label}>
                  <b>{stat.value}</b>
                  <span className={styles.statLabel}>{stat.label}</span>
                  <span className={styles.statNote}>{stat.note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.swimStory}>
            <ul className={styles.beyondWorkList}>
              {beyondWork.bullets.map((bullet) => (
                <li key={bullet}><RichText text={bullet} /></li>
              ))}
            </ul>
          <div className={styles.pressList} ref={pressRef}>
            <p className={styles.pressTitle}>
              <Newspaper size={14} aria-hidden="true" /> In the press
            </p>
            <ul>
              {(isMobile ? beyondWork.press.slice(0, PREVIEW) : beyondWork.press).map((item) => (
                <PressItem key={item.url} item={item} />
              ))}
            </ul>
            {isMobile && beyondWork.press.length > PREVIEW && (
              <ShowMore
                count={beyondWork.press.length - PREVIEW}
                anchor={pressRef}
                onExpand={() => trackEvent("Expanded Press List", { hidden_items: beyondWork.press.length - PREVIEW })}
              >
                <ul>
                  {beyondWork.press.slice(PREVIEW).map((item) => (
                    <PressItem key={item.url} item={item} />
                  ))}
                </ul>
              </ShowMore>
            )}
          </div>

          </div>

          {/* Each row's photos share one height and fill the width, so nothing is cropped */}
          <div className={styles.photos}>
            {beyondWork.photos.map((row) => (
              <div key={row[0].src} className={styles.photoRow}>
                {row.map((photo) => (
                  <button
                    key={photo.src}
                    type="button"
                    className={styles.photo}
                    style={{ ["--ratio" as string]: photo.width / photo.height, aspectRatio: `${photo.width} / ${photo.height}` }}
                    onClick={() => {
                      trackEvent("Opened Photo Lightbox", { photo: photo.src, caption: photo.caption });
                      setViewing(photo);
                    }}
                    aria-label={`View ${photo.caption}`}
                  >
                    <Image src={photo.src} alt={photo.caption} width={photo.width} height={photo.height} sizes="(max-width: 767px) 50vw, 420px" />
                    <span className={styles.photoCaption}>{photo.caption}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </section>

        {viewing &&
          createPortal(
          <div
            className={styles.lightbox}
            role="dialog"
            aria-label={viewing.caption}
            onClick={() => {
              trackEvent("Closed Photo Lightbox", { photo: viewing.src, method: "click" });
              setViewing(null);
            }}
          >
            <Image src={viewing.src} alt={viewing.caption} width={viewing.width} height={viewing.height} sizes="90vw" />
            <p>{viewing.caption}</p>
          </div>,
          // The window's glass (backdrop-filter) would trap a fixed overlay inside it
          document.body,
        )}

      </div>

    </section>
  );
}
