"use client";

import styles from "./Experience.module.css";
import { Trophy } from "lucide-react";
import RichText from "./RichText";
import { experiences, beyondWork } from "@/data/resume";

export default function Experience() {
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
                  {group.title && <h4 className={styles.groupTitle}>{group.title}</h4>}
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
    </section>
  );
}
