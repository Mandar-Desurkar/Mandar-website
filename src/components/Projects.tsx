"use client";

// The "Case Studies" section (tab id `projects`): long-form case studies, each opening its own page
// at /case-studies/<slug>. The other products live in Experience.
import Image from "next/image";
import Link from "next/link";
import styles from "./Projects.module.css";
import { ArrowRight } from "lucide-react";
import { caseStudies } from "@/data/caseStudies";
import { trackEvent } from "@/lib/analytics";


export default function Projects() {
  return (
    <section id="projects" className={styles.projectsSection}>
      <div className={`container ${styles.container}`}>

        <div className={styles.headerBox}>
          <h2 className="hand-heading-2" style={{ marginBottom: 0 }}>
            Case Studies
          </h2>
          <p className={styles.intro}>How I work through a product problem, from research to a shipped feature.</p>
        </div>

        <div className={styles.caseList}>
          {caseStudies.map((cs) => (
            <Link
              key={cs.slug}
              href={`/case-studies/${cs.slug}`}
              className={styles.caseCard}
              onClick={() => trackEvent("Opened Case Study", { slug: cs.slug, placement: "case_studies" })}
            >
              <span className={styles.caseVisual} aria-hidden="true">
                {cs.heroScreens
                  .filter((src) => src !== cs.cover)
                  .map((src) => (
                    <Image key={src} src={src} alt="" width={393} height={852} sizes="200px" className={styles.caseShotSide} />
                  ))}
                <Image src={cs.cover} alt="" width={393} height={852} sizes="240px" className={styles.caseShot} />
              </span>
              <span className={styles.caseBody}>
                <span className={styles.caseEyebrow}>Case study · {cs.product}</span>
                <span className={styles.caseTitle}>
                  <span className={styles.caseName}>{cs.title.split(": ")[0]}</span>
                  <span className={styles.caseColon}>: </span>
                  <span className={styles.caseLine}>{cs.title.split(": ")[1]}</span>
                </span>
                <span className={styles.caseProblem}>{cs.card.problem}</span>
                <span className={styles.caseMetric}>{cs.card.metric}</span>
                <span className={styles.caseStats}>
                  {cs.card.stats.map((s) => (
                    <span key={s.label}>
                      <b>{s.value}</b>
                      {s.label}
                    </span>
                  ))}
                </span>
                <span className={styles.caseCta}>
                  Read case study <ArrowRight size={16} aria-hidden="true" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
}
