"use client";

// The "Case Studies" section (tab id `projects`): long-form case studies first, each opening its
// own page at /case-studies/<slug>, then the shorter cards for the other products I've shipped.
import Image from "next/image";
import Link from "next/link";
import styles from "./Projects.module.css";
import { ArrowRight, ExternalLink } from "lucide-react";
import { projects } from "@/data/resume";
import { caseStudies } from "@/data/caseStudies";
import { trackEvent } from "@/lib/analytics";
import { useWindow } from "@/context/WindowContext";


export default function Projects() {
  const { openPrototype } = useWindow();

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

        <h3 className={styles.groupHeading}>Products I&apos;ve shipped</h3>

        <div className={styles.grid}>
          {projects.map((project) => (
            <div key={project.slug} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.title}>{project.title}</h3>
                  <p className={styles.context}>{project.context}</p>
                </div>
                {project.link && (
                  <div className={styles.links}>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.iconLink}
                      onClick={() => trackEvent("Clicked External Link", { link_type: "project", label: project.title })}
                      aria-label={`Open ${project.title} (opens in new tab)`}
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                )}
              </div>

              <ul className={styles.metrics}>
                {project.metrics.map((metric) => (
                  <li key={metric} className={styles.metric}>{metric}</li>
                ))}
              </ul>

              <p className={styles.description}>{project.description}</p>

              {project.prototype && (
                <button
                  type="button"
                  className={styles.prototypeBtn}
                  onClick={() => openPrototype(project.prototype!, "projects")}
                >
                  View app prototype
                </button>
              )}

              <div className={styles.tags}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>#{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
