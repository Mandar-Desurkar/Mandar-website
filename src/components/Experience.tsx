"use client";

import Image from "next/image";
import styles from "./Experience.module.css";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useWindow } from "@/context/WindowContext";
import { ArrowUpRight, Newspaper, Play, Trophy } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import RichText from "./RichText";
import { experiences, beyondWork } from "@/data/resume";

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


export default function Experience() {
  const { openPrototype: open } = useWindow();
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
          <p className={styles.headerIntro}>2.5+ years taking AI-powered products from 0→1.</p>
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
              <div className={styles.entryTitle}>
                <h3 className={styles.role}>{exp.role}</h3>
                {current && <span className={styles.currentBadge}>Current</span>}
              </div>

              <div className={styles.metaData}>
                <span className={styles.atSymbol}>@</span>
                <span className={styles.company}>{exp.company}</span>
                <span className={styles.period}>{exp.period}</span>
              </div>

              <p className={styles.description}>{exp.summary}</p>

              {exp.groups?.map((group, i) => (
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
          <div className={styles.pressList}>
            <p className={styles.pressTitle}>
              <Newspaper size={14} aria-hidden="true" /> In the press
            </p>
            <ul>
              {beyondWork.press.map((item) => (
                <li key={item.url}>
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
              ))}
            </ul>
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
