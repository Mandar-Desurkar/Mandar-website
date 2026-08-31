"use client";

import styles from "./Experience.module.css";

const experiences = [
  {
    role: "Chief Product Officer / Founder",
    company: "TBD",
    period: "Future",
    description: "Building the next generation of intuitive tech. Leading product vision, scaling teams, and shipping category-defining products.",
    isFuture: true,
  },
  {
    role: "Senior Product Manager",
    company: "Tech Innovators Inc.",
    period: "2022 - Present",
    description: "Led the development of the core AI-driven analytics platform, increasing user retention by 35%. Managed a cross-functional team of 15 engineers and designers.",
  },
  {
    role: "Product Manager",
    company: "Growth Labs",
    period: "2019 - 2022",
    description: "Launched 3 successful B2B SaaS products from 0 to 1. Conducted extensive user research and prioritized product roadmaps aligning with business goals.",
  },
  {
    role: "Associate Product Manager",
    company: "StartUp X",
    period: "2017 - 2019",
    description: "Assisted in product strategy and backlog grooming. Analyzed user metrics to identify bottlenecks in the onboarding funnel, resulting in a 20% conversion bump.",
  },
  {
    role: "International Competitive Swimmer (Team India)",
    company: "The Foundation of My PM Journey",
    period: "2013 - 2020",
    description: "Represented India at the World Championships and won National titles. The pool taught me the core pillars of product management: relentless discipline, analyzing micro-metrics for macro gains, performing under pressure, and out-executing the competition.",
  },
];

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
          {experiences.map((exp, index) => (
            <div key={index} className={`${styles.entry} ${exp.isFuture ? styles.futureEntry : ''}`}>
              <div className={styles.entryTitle}>
                <h3 className={styles.role}>{exp.role}</h3>
              </div>
              
              <div className={styles.metaData}>
                <span className={styles.company}>@ {exp.company}</span>
                <span className={styles.period}>({exp.period})</span>
              </div>
              
              <p className={styles.description}>{exp.description}</p>
              
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
