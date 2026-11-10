"use client";

// The "Case Studies" section (tab id `projects`): long-form case studies, each opening its own page
// at /case-studies/<slug>. Grouped under the app they belong to; on desktop every study is the same
// wide brand-blue card (the theme, the feature, one line and one result beside a fan of its real
// screens), on phones an iOS list row. The thinking lives on the case study page, not on the card.
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import styles from "./Projects.module.css";
import { caseStudies, type CaseStudy } from "@/data/caseStudies";
import { shippedApps } from "@/data/resume";
import { useWindow, type PrototypeId } from "@/context/WindowContext";
import { trackEvent } from "@/lib/analytics";

function CaseCard({ cs }: { cs: CaseStudy }) {
  const [name, line] = cs.title.split(": ");
  return (
    <Link
      href={`/case-studies/${cs.slug}`}
      className={styles.card}
      onClick={() => trackEvent("Opened Case Study", { slug: cs.slug, placement: "case_studies" })}
    >
      {/* Phones: the cover as a thumbnail. Desktop: a fan of three real screens, cover in front */}
      <span className={styles.shot} aria-hidden="true">
        {cs.heroScreens
          .filter((src) => src !== cs.cover)
          .slice(0, 2)
          .map((src) => (
            <Image key={src} src={src} alt="" width={393} height={852} sizes="170px" className={styles.side} />
          ))}
        <Image src={cs.cover} alt="" width={393} height={852} sizes="(max-width: 767px) 64px, 200px" className={styles.front} />
      </span>
      <span className={styles.body}>
        <span className={styles.theme}>{cs.card.theme}</span>
        <span className={styles.name}>{name}</span>
        {line && <span className={styles.line}>{line.charAt(0).toUpperCase() + line.slice(1)}</span>}
        <span className={styles.result}>{cs.card.metric}</span>
        <span className={styles.read}>
          Read case study <ArrowRight size={14} aria-hidden="true" />
        </span>
      </span>
      <ChevronRight size={18} className={styles.chevron} aria-hidden="true" />
    </Link>
  );
}

export default function Projects() {
  const { openPrototype } = useWindow();

  const groups = shippedApps
    .filter((app): app is typeof app & { prototype: PrototypeId } => !!app.prototype)
    .map((app) => ({ app, items: caseStudies.filter((c) => c.product === app.name) }))
    .filter((g) => g.items.length > 0);

  return (
    <section id="projects" className={styles.projectsSection}>
      <div className={`container ${styles.container}`}>
        <header className={styles.headerBox}>
          <h2 className="hand-heading-2">Case Studies</h2>
          <p className={styles.intro}>
            {caseStudies.length} features I shipped, from the problem to the decision.
          </p>
        </header>

        {groups.map(({ app, items }) => (
          <section key={app.prototype} className={styles.group} aria-labelledby={`cs-${app.prototype}`}>
            <header className={styles.groupHead}>
              <Image src={app.icon} alt="" width={28} height={28} className={styles.groupIcon} />
              <h3 id={`cs-${app.prototype}`}>{app.name}</h3>
              <button type="button" className={styles.tryApp} onClick={() => openPrototype(app.prototype, "projects")}>
                Try the app
              </button>
            </header>
            <div className={styles.list}>
              {items.map((cs) => (
                <CaseCard key={cs.slug} cs={cs} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
