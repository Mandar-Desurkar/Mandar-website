"use client";

import styles from "./Hero.module.css";
import { Terminal } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className={styles.heroSection}>
      <div className={`container ${styles.heroContainer}`}>
        
        <div className={styles.visualsGroup}>
          {/* Polaroid Photo */}
          <div className={styles.polaroid}>
            <div className={styles.tape}></div>
            <div className={styles.photoWrapper}>
              <Image 
                src="/profile.jpg" 
                alt="Mandar Desurkar" 
                width={200} 
                height={200}
                className={styles.profileImage}
              />
            </div>
          </div>
        </div>
        
        <div className={styles.heroContent}>
          <h1 className="hand-heading-1">
            Hi, I'm Mandar. <br />
            I'm a <span className={styles.highlight}>product builder.</span>
          </h1>
          
          <p className={styles.description}>
            I solve complex user problems by shipping intuitive products and features. I blend data-driven strategy with deep user empathy to turn ambitious ideas into scalable, high-impact reality.
          </p>
          
          <div className={styles.ctaGroup}>
            <a href="#projects" className="os-btn" style={{ textDecoration: 'none' }}>
              Execute projects.app
            </a>
            <a href="#contact" className={styles.linkScribble}>
              Send a memo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
