"use client";

import styles from "./Experience.module.css";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Trophy } from "lucide-react";
import RichText from "./RichText";
import { experiences, beyondWork } from "@/data/resume";
import { trackEvent } from "@/lib/analytics";

const KissanPrototype = dynamic(() => import("./prototype/KissanPrototype"), { ssr: false });

export default function Experience() {
  const [showPrototype, setShowPrototype] = useState(false);

  const openPrototype = () => {
    trackEvent("Opened Prototype", { prototype: "kissan-sampurna", placement: "experience" });
    setShowPrototype(true);
  };

  return (
    <section id="experience" className={styles.experienceSection}>
      <div className={`container ${styles.container}`}>

        <div className={styles.headerBox}>
          <h2 className="hand-heading-2" style={{ marginBottom: 0 }}>
            Experience
          </h2>
        </div>

        <div className={styles.entries}>
          {experiences.map((exp) => (
            <div key={`${exp.company}-${exp.role}`} className={`${styles.entry} ${exp.isFuture ? styles.futureEntry : ''}`}>
              <div className={styles.entryTitle}>
                <h3 className={styles.role}>{exp.role}</h3>
              </div>

              <div className={styles.metaData}>
                <span className={styles.atSymbol}>@</span>
                <span className={styles.company}>{exp.company}</span>
                <span className={styles.period}>({exp.period})</span>
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
          ))}
        </div>

        {/* Beyond Work Section - macOS Card Style */}
        <div className={styles.beyondWorkCard}>
          <div className={styles.beyondWorkHeader}>
            <Trophy size={18} color="#8e8e93" />
            <h3 className={styles.beyondWorkTitle}>Beyond Work</h3>
          </div>

          <div className={styles.entryTitle}>
            <h3 className={styles.role}>{beyondWork.title}</h3>
          </div>

          <div className={styles.metaData} style={{ marginBottom: '1.2rem' }}>
            <span className={styles.company} style={{ fontWeight: 500 }}>
              {beyondWork.discipline}
            </span>
            <span className={styles.period}>({beyondWork.period})</span>
          </div>

          <ul className={styles.beyondWorkList}>
            {beyondWork.bullets.map((bullet) => (
              <li key={bullet}><RichText text={bullet} /></li>
            ))}
          </ul>
        </div>

      </div>

      {showPrototype && <KissanPrototype onClose={() => setShowPrototype(false)} />}
    </section>
  );
}
