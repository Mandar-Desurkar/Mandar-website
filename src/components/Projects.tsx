"use client";

// The "Case Studies" section (tab id `projects`): long-form case studies, each opening its own page
// at /case-studies/<slug>. Grouped by the app they belong to, with a filter, so six studies read as
// two products rather than one repeated card. Each card is a mini storyboard of the thinking behind
// the feature: the problem (the study's key statistic), the call I made (its first decision) and
// what shipped. The first study of each app is the wide feature; the others sit side by side.
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import styles from "./Projects.module.css";
import { caseStudies, type CaseStudy } from "@/data/caseStudies";
import { shippedApps } from "@/data/resume";
import { useWindow, type PrototypeId } from "@/context/WindowContext";
import { trackEvent } from "@/lib/analytics";

type Filter = "all" | PrototypeId;

// Who each app serves, in one line (the app's own caption is too short for a section header)
const APP_LINE: Record<PrototypeId, string> = {
  "kissan-sampurna": "AI crop advice for smallholder farmers",
  "gau-sampurna": "AI health, value and feed checks for dairy farmers",
};

const METHOD = ["Problem", "Insight", "Decision", "Outcome"];

const percent = (v: number) => `${Number.isInteger(v) ? v : v.toFixed(1)}%`;

function CaseCard({ cs, featured }: { cs: CaseStudy; featured: boolean }) {
  const [name, line] = cs.title.split(": ");
  const { featured: stat } = cs.problem;
  const call = cs.solution.decisions[0]?.decision;
  return (
    <Link
      href={`/case-studies/${cs.slug}`}
      className={`${styles.caseCard} ${featured ? styles.featured : styles.compact}`}
      onClick={() => trackEvent("Opened Case Study", { slug: cs.slug, placement: "case_studies" })}
    >
      <span className={styles.caseVisual} aria-hidden="true">
        {featured &&
          cs.heroScreens
            .filter((src) => src !== cs.cover)
            .map((src) => <Image key={src} src={src} alt="" width={393} height={852} sizes="200px" className={styles.caseShotSide} />)}
        <Image src={cs.cover} alt="" width={393} height={852} sizes="240px" className={styles.caseShot} />
      </span>

      <span className={styles.caseBody}>
        <span className={styles.caseEyebrow}>{cs.card.theme}</span>
        <span className={styles.caseTitle}>
          <span className={styles.caseName}>{name}</span>
          <span className={styles.caseColon}>: </span>
          <span className={styles.caseLine}>{line}</span>
        </span>
        <span className={styles.caseProblem}>{cs.card.problem}</span>

        {/* The thinking, in three beats; the full case study expands each one */}
        <span className={styles.thinking}>
          <span className={`${styles.beat} ${styles.beatProblem}`}>
            <span className={styles.beatLabel}>The problem</span>
            <b>{percent(stat.value)}</b>
            <span className={styles.beatText}>{stat.label}</span>
          </span>
          {call && (
            <span className={`${styles.beat} ${styles.beatCall}`}>
              <span className={styles.beatLabel}>My call</span>
              <span className={styles.beatText}>{call}</span>
            </span>
          )}
          <span className={`${styles.beat} ${styles.beatShipped}`}>
            <span className={styles.beatLabel}>What shipped</span>
            <span className={styles.beatText}>{cs.card.metric}</span>
          </span>
        </span>

        <span className={styles.caseMetric}>{cs.card.metric}</span>
        <span className={styles.caseCta}>
          Read case study <ArrowRight size={16} aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}

export default function Projects() {
  const { openPrototype } = useWindow();
  const [filter, setFilter] = useState<Filter>("all");

  const groups = shippedApps
    .filter((app): app is typeof app & { prototype: PrototypeId } => !!app.prototype)
    .map((app) => ({ app, items: caseStudies.filter((c) => c.product === app.name) }))
    .filter((g) => g.items.length > 0);
  const shown = groups.filter((g) => filter === "all" || g.app.prototype === filter);

  const choose = (f: Filter) => {
    if (f === filter) return;
    setFilter(f);
    trackEvent("Filtered Case Studies", { product: f });
  };

  return (
    <section id="projects" className={styles.projectsSection}>
      <div className={`container ${styles.container}`}>
        <div className={styles.headerBox}>
          <div className={styles.headerText}>
            <h2 className="hand-heading-2" style={{ marginBottom: 0 }}>
              Case Studies
            </h2>
            <p className={styles.intro}>
              {caseStudies.length} features I shipped across {groups.length} farming apps, each traced from the problem to the decision.
            </p>
          </div>

          <div className={styles.filter} role="group" aria-label="Show case studies for">
            <button type="button" aria-pressed={filter === "all"} onClick={() => choose("all")}>
              All <span>{caseStudies.length}</span>
            </button>
            {groups.map((g) => (
              <button key={g.app.prototype} type="button" aria-pressed={filter === g.app.prototype} onClick={() => choose(g.app.prototype)}>
                <b className={styles.nameFull}>{g.app.name}</b>
                <b className={styles.nameShort}>{g.app.name.replace(/ Sampurna$/, "")}</b> <span>{g.items.length}</span>
              </button>
            ))}
          </div>

          <div className={styles.method}>
            <span className={styles.methodLabel} id="cs-method">
              Every case study follows
            </span>
            <ol aria-labelledby="cs-method">
              {METHOD.map((m, i) => (
                <li key={m}>
                  <span aria-hidden="true">{i + 1}</span>
                  {m}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {shown.map(({ app, items }) => (
          <section key={app.prototype} className={styles.group} data-app={app.prototype} aria-labelledby={`cs-${app.prototype}`}>
            <header className={styles.groupHead}>
              <Image src={app.icon} alt="" width={44} height={44} className={styles.groupIcon} />
              <span className={styles.groupText}>
                <h3 id={`cs-${app.prototype}`}>{app.name}</h3>
                <span>
                  {APP_LINE[app.prototype]} · {items.length} case {items.length === 1 ? "study" : "studies"}
                </span>
              </span>
              <button type="button" className={styles.tryApp} onClick={() => openPrototype(app.prototype, "projects")}>
                <Play size={13} aria-hidden="true" /> Try the app
              </button>
            </header>

            <div className={styles.caseList}>
              {items.map((cs, i) => (
                <CaseCard key={cs.slug} cs={cs} featured={i === 0} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
