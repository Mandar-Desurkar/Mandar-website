"use client";

// The "Case Studies" section (tab id `projects`): long-form case studies, each opening its own page
// at /case-studies/<slug>, as one list (not grouped by app). Every study is led by the same
// illustrated cover: on desktop a "case file" card (see CaseCard) with the cover recomposed for that
// shape (`thumbDesk`); on phones a card with the cover on top (`thumb`) and the
// result as one line.
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, TrendingUp } from "lucide-react";
import styles from "./Projects.module.css";
import { caseStudies, type CaseStudy } from "@/data/caseStudies";
import { trackEvent } from "@/lib/analytics";
import RichText from "./RichText";

// The story track's three steps, named for the card (the case study pages call them "The challenge" etc.)
const STEP_NAMES = ["Challenge", "Approach", "Impact"];

// Desktop: a case file. Index, kind of problem and year; the feature and one line; then the study's own
// at-a-glance story as a track (challenge → approach → impact, impact highlighted); then its three
// numbers, with the cover as a tile on the right. Styled like the Education window's cards. Phones keep
// the cover-on-top card with the result as one line.
function CaseCard({ cs, index }: { cs: CaseStudy; index: number }) {
  const [name, line] = cs.title.split(": ");
  const year = cs.meta.find((m) => m.label === "Timeline")?.value;
  return (
    <Link
      href={`/case-studies/${cs.slug}`}
      className={styles.card}
      data-haptic="light"
      onClick={() => trackEvent("Opened Case Study", { slug: cs.slug, placement: "case_studies" })}
    >
      {/* The illustrated cover: the phone's 16:9 version, or the desktop's 3:2 recomposition (only the
          one on screen loads; the other is display: none) */}
      <span className={styles.art} aria-hidden="true">
        <Image src={cs.thumb} alt="" width={1200} height={670} sizes="(max-width: 767px) 100vw, 1px" />
      </span>
      <span className={styles.deskArt} aria-hidden="true">
        <Image src={cs.thumbDesk} alt="" width={1200} height={805} sizes="(max-width: 767px) 1px, 248px" />
      </span>
      <span className={styles.body}>
        <span className={styles.fileHead}>
          <span className={styles.index}>{String(index).padStart(2, "0")}</span>
          <span className={styles.theme}>{cs.card.theme}</span>
          {year && <span className={styles.year}>{year}</span>}
        </span>
        <span className={styles.name}>{name}</span>
        {line && <span className={styles.line}>{line.charAt(0).toUpperCase() + line.slice(1)}</span>}
        <span className={styles.story}>
          {cs.glance.slice(0, 3).map((g, i) => (
            <span key={g.label} className={styles.step}>
              <span className={styles.stepName}>
                <span className={styles.stepDot} aria-hidden="true" />
                {STEP_NAMES[i] ?? g.label}
              </span>
              <span className={styles.stepText}>
                <RichText text={g.takeaway} />
              </span>
            </span>
          ))}
        </span>
        <span className={styles.foot}>
          <span className={styles.stats}>
            {cs.card.stats.map((s) => (
              <span key={s.label} className={styles.stat}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </span>
            ))}
          </span>
          <span className={styles.read}>
            Read case study <ArrowRight size={14} aria-hidden="true" />
          </span>
        </span>
        <span className={styles.result}>
          <TrendingUp size={14} strokeWidth={2.2} className={styles.resultIcon} aria-hidden="true" />
          {cs.card.metric}
        </span>
      </span>
      <ChevronRight size={18} className={styles.chevron} aria-hidden="true" />
    </Link>
  );
}

export default function Projects() {
  return (
    <section id="projects" className={styles.projectsSection}>
      <div className={`container ${styles.container}`}>
        <header className={styles.headerBox}>
          <h2 className="hand-heading-2">Case Studies</h2>
          <p className={styles.intro}>
            {caseStudies.length} features I shipped, from the problem to the decision.
          </p>
        </header>

        {/* One list, in the order of src/data/caseStudies (no per-app groups) */}
        <div className={styles.list}>
          {caseStudies.map((cs, i) => (
            <CaseCard key={cs.slug} cs={cs} index={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
