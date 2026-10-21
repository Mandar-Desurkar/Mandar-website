"use client";

import styles from "./Projects.module.css";
import { ExternalLink } from "lucide-react";
import { projects } from "@/data/resume";

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
