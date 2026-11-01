"use client";

import Image from "next/image";
import styles from "./Education.module.css";
import { ArrowUpRight, BookOpen, GraduationCap } from "lucide-react";
import { skills } from "@/data/resume";
import { trackEvent } from "@/lib/analytics";

// "Jan 2021 - Jul 2025" → "4 yrs 7 mos" (inclusive of both months)
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function duration(period: string) {
  const parse = (v?: string) => {
    const [m, y] = (v ?? "").trim().split(" ");
    const i = MONTHS.indexOf(m);
    return i >= 0 && Number(y) ? Number(y) * 12 + i : null;
  };
  const [from, to] = period.split(" - ");
  const start = parse(from), end = parse(to);
  if (start == null || end == null) return null;
  const months = end - start + 1;
  const y = Math.floor(months / 12), mo = months % 12;
  return [y && `${y} yr${y > 1 ? "s" : ""}`, mo && `${mo} mo${mo > 1 ? "s" : ""}`].filter(Boolean).join(" ");
}

const chips = (list: string) => list.split(",").map((s) => s.trim()).filter(Boolean);

const educationLogs: {
  degree: string;
  school: string;
  period: string;
  grade?: string;
  description: string;
  skills: string;
  link?: string;
  // School crest on a white square (public/logos), shown in the desktop timeline
  logo?: string;
}[] = [
  {
    degree: "B.E. in Information Science and Engineering",
    school: "M. S. Ramaiah Institute of Technology, Bangalore",
    period: "Jan 2021 - Jul 2025",
    grade: "CGPA: 8.30",
    description: "My interest in technology and problem-solving started in 7th grade when I worked on a school project involving programming. I didn't fully understand how code worked, but I realized it was all about building systems that scale.",
    skills: "Python, MySQL, +5 skills",
    logo: "/logos/ramaiah.png",
    link: "https://www.google.com/maps/place/Ramaiah+Institute+of+Technology/@13.0307875,77.5624144,961m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bae17dedd4dcca9:0x6075bd8d8aed97ab!8m2!3d13.0307823!4d77.5649893!16zL20vMDVuM185?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D",
  },
  {
    degree: "1st Std - 12th Std (CBSE)",
    school: "KLE's International School",
    period: "Mar 2009 - Jan 2021",
    description: "Balancing studies and competitive swimming was never easy. While most students had a regular routine, I learned time management and relentless dedication.",
    skills: "Python, MySQL, +2 skills",
    logo: "/logos/kle.png",
    link: "https://www.google.com/maps/place/KLES%E2%80%99+International+School/@15.8787064,74.4821539,949m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bbf66af2884b2b1:0xe8e6d5a84924c488!8m2!3d15.8787013!4d74.4847288!16s%2Fg%2F1pyqfv7cw?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D"
  },
];

export default function Education() {
  return (
    <section id="education" className={styles.educationSection}>
      <div className={`container ${styles.container}`}>
        
        <div className={styles.headerBox}>
          <h2 className="hand-heading-2" style={{ marginBottom: 0 }}>
            Education & Foundation
          </h2>
          <p className={styles.headerIntro}>An engineering degree, and the discipline of competitive swimming alongside it.</p>
        </div>

        <div className={styles.entries}>
          {educationLogs.map((edu, index) => (
            <div key={index} className={styles.entry}>
              {/* Desktop: when, in a column beside the school */}
              <aside className={styles.rail} aria-hidden="true">
                {edu.logo ? (
                  <span className={`${styles.mark} ${styles.logo}`}>
                    <Image src={edu.logo} alt="" width={88} height={88} />
                  </span>
                ) : (
                  <span className={styles.mark}>{index === 0 ? <GraduationCap size={20} /> : <BookOpen size={19} />}</span>
                )}
                <span className={styles.railPeriod}>{edu.period.replace(" - ", " – ")}</span>
                {duration(edu.period) && <span className={styles.railLength}>{duration(edu.period)}</span>}
              </aside>
              <div className={styles.entryBody}>
              <div className={styles.entryTitle}>
                <h3 className={styles.degree}>{edu.degree}</h3>
              </div>
              
              <div className={styles.metaData}>
                {edu.link ? (
                  <a
                    href={edu.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.schoolLink}
                    onClick={() => trackEvent("Clicked External Link", { link_type: "school_map", label: edu.school })}
                  >
                    <span className={styles.atSymbol}>@</span>
                    <span className={styles.school}>{edu.school}</span>
                    <ArrowUpRight size={14} className={styles.mapIcon} aria-hidden="true" />
                  </a>
                ) : (
                  <>
                    <span className={styles.atSymbol}>@</span>
                    <span className={styles.school}>{edu.school}</span>
                  </>
                )}
                <span className={styles.period}>{edu.period}</span>
                {edu.grade && <span className={styles.grade}>{edu.grade}</span>}
              </div>
              
              <p className={styles.description}>{edu.description}</p>
              
              <div className={styles.skillsBox}>
                <span className={styles.skillsLabel}>Skills:</span> {edu.skills}
              </div>
              <ul className={styles.chipRow} aria-label="Skills">
                {chips(edu.skills).map((c) => (
                  <li key={c} data-more={c.startsWith("+") ? "" : undefined}>
                    {c}
                  </li>
                ))}
              </ul>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.toolkitCard}>
          <h3 className={styles.toolkitTitle}>Skills & Toolkit</h3>
          {skills.map((group) => (
            <p key={group.label} className={styles.toolkitRow}>
              <span className={styles.skillsLabel}>{group.label}:</span> {group.items}
            </p>
          ))}
          {/* Desktop: each group as a labelled set of chips */}
          <div className={styles.toolkitGrid}>
            {skills.map((group) => (
              <div key={group.label} className={styles.toolkitGroup}>
                <p className={styles.toolkitLabel}>{group.label}</p>
                <ul className={styles.chipRow}>
                  {chips(group.items).map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
