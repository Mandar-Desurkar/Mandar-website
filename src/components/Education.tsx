"use client";

import styles from "./Education.module.css";
import { GraduationCap } from "lucide-react";

const educationLogs = [
  {
    degree: "Bachelor of Engineering - BE, Information Science",
    school: "Ramaiah Institute Of Technology",
    period: "Jan 2021 - Jun 2025",
    description: "My interest in technology and problem-solving started in 7th grade when I worked on a school project involving programming. I didn't fully understand how code worked, but I realized it was all about building systems that scale.",
    skills: "Python, MySQL, +5 skills",
    link: "https://www.google.com/maps/place/Ramaiah+Institute+of+Technology/@13.0307875,77.5624144,961m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bae17dedd4dcca9:0x6075bd8d8aed97ab!8m2!3d13.0307823!4d77.5649893!16zL20vMDVuM185?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D",
  },
  {
    degree: "1st Std - 12th Std (CBSE)",
    school: "KLE's International School",
    period: "Mar 2009 - Jan 2021",
    description: "Balancing studies and competitive swimming was never easy. While most students had a regular routine, I learned time management and relentless dedication.",
    skills: "Python, MySQL, +2 skills",
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
        </div>

        <div className={styles.entries}>
          {educationLogs.map((edu, index) => (
            <div key={index} className={styles.entry}>
              <div className={styles.entryTitle}>
                <GraduationCap className={styles.icon} size={28} />
                <h3 className={styles.degree}>{edu.degree}</h3>
              </div>
              
              <div className={styles.metaData}>
                {edu.link ? (
                  <a href={edu.link} target="_blank" rel="noopener noreferrer" className={styles.schoolLink}>
                    <span className={styles.school}>@ {edu.school}</span>
                  </a>
                ) : (
                  <span className={styles.school}>@ {edu.school}</span>
                )}
                <span className={styles.period}>({edu.period})</span>
              </div>
              
              <p className={styles.description}>{edu.description}</p>
              
              <div className={styles.skillsBox}>
                <span className={styles.skillsLabel}>Skills:</span> {edu.skills}
              </div>
              
              <div className={styles.divider}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
