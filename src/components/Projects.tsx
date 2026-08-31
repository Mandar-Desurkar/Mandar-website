"use client";

import styles from "./Projects.module.css";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const projects = [
  {
    title: "OmniChannel Analytics",
    description: "A centralized dashboard for tracking user behavior across web, mobile, and in-store touchpoints. Increased actionable insights by 40%.",
    tags: ["SaaS", "Data Viz", "B2B"],
    link: "#",
    github: "#"
  },
  {
    title: "FinTrack Mobile App",
    description: "Personal finance tracker with AI-driven budget recommendations. Reached 100k downloads in the first 3 months of launch.",
    tags: ["Mobile", "FinTech", "AI"],
    link: "#",
    github: "#"
  },
  {
    title: "EcoCommerce Platform",
    description: "Sustainable e-commerce marketplace connecting eco-friendly brands with conscious consumers. Processed $1M+ in GMV in year one.",
    tags: ["Market", "Web", "Green"],
    link: "#",
    github: "#"
  }
];

export default function Projects() {
  return (
    <section id="projects" className={styles.projectsSection}>
      <div className={`container ${styles.container}`}>
        
        <div className={styles.headerBox}>
          <h2 className="hand-heading-2" style={{ marginBottom: 0 }}>
            Projects
          </h2>
        </div>

        <div className={styles.grid}>
          {projects.map((project, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.title}>{project.title}</h3>
                <div className={styles.links}>
                  <a href={project.github} className={styles.iconLink}><FaGithub size={20} /></a>
                  <a href={project.link} className={styles.iconLink}><ExternalLink size={20} /></a>
                </div>
              </div>
              
              <p className={styles.description}>{project.description}</p>
              
              <div className={styles.tags}>
                {project.tags.map((tag, i) => (
                  <span key={i} className={styles.tag}>#{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
