"use client";

import styles from "./Hero.module.css";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { profile, kpis } from "@/data/resume";

let isFirstMount = true;

const SparkDoodle = () => (
  <motion.svg 
    width="45" 
    height="45" 
    viewBox="0 0 100 100" 
    className={styles.sparkDoodle}
    initial="hidden"
    animate="visible"
  >
    <motion.path 
      d="M50 15 Q50 50 15 50 Q50 50 50 85 Q50 50 85 50 Q50 50 50 15 Z"
      fill="none" 
      stroke="var(--ink-red)" 
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={{
        hidden: { pathLength: 0, opacity: 0 },
        visible: { pathLength: 1, opacity: 0.8, transition: { duration: 1.2, ease: "easeInOut", delay: 1.5 } }
      }}
    />
  </motion.svg>
);

export default function Hero() {
  const [initialDelay] = useState(isFirstMount ? 1.8 : 0);

  useEffect(() => {
    isFirstMount = false;
  }, []);
  return (
    <section className={styles.heroSection}>
      <div className={`container ${styles.heroContainer}`}>
        
        <div className={styles.visualsGroup}>
          {/* Polaroid Photo with Framer Motion Spring */}
          <motion.div 
            className={styles.profileFrame}
            initial={{ opacity: 0, scale: 0.8, rotate: -10, y: 50 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              delay: initialDelay + 0.5
            }}
          >
            <div className={styles.photoWrapper}>
              <Image 
                src="/profile-new.jpg" 
                alt="Mandar Desurkar" 
                width={200} 
                height={200}
                className={styles.profileImage}
              />
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2, delayChildren: initialDelay } }
          }}
        >
          <motion.h1 className="hand-heading-1" style={{ position: 'relative' }}>
            <motion.span
              variants={{
                hidden: { opacity: 1 },
                visible: { opacity: 1, transition: { staggerChildren: 0.04 } }
              }}
            >
              {"Hi, I'm Mandar.".split("").map((char, index) => (
                <motion.span
                  key={`t1-${index}`}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 }
                  }}
                >
                  {char}
                </motion.span>
              ))}
              <br />
              {"I'm a ".split("").map((char, index) => (
                <motion.span
                  key={`t2-${index}`}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 }
                  }}
                >
                  {char}
                </motion.span>
              ))}
              <span className={styles.highlight} style={{ position: 'relative', whiteSpace: 'nowrap' }}>
                <SparkDoodle />
                {"product builder.".split("").map((char, index) => (
                  <motion.span
                    key={`t3-${index}`}
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 }
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className={styles.description}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
            }}
          >
            {profile.summary}
          </motion.p>

          <motion.div 
            className={styles.kpiGrid}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
            }}
          >
            {kpis.map((kpi) => (
              <div key={kpi.label} className={styles.kpiCard}>
                <div className={styles.kpiValue}>{kpi.value}</div>
                <div className={styles.kpiLabel}>{kpi.label}</div>
              </div>
            ))}
          </motion.div>
          
          <motion.div 
            className={styles.ctaGroup}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
            }}
          >
            <motion.a 
              href="#projects" 
              className="os-btn" 
              style={{ textDecoration: 'none' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Execute projects.app
            </motion.a>
            <motion.a 
              href="#contact" 
              className={styles.linkScribble}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send a memo
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
