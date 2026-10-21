"use client";

import styles from "./Hero.module.css";
import Image from "next/image";
import { animate, motion, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";
import { profile, kpis, shippedApps } from "@/data/resume";
import dynamic from "next/dynamic";
import { useWindow } from "@/context/WindowContext";
import { trackEvent } from "@/lib/analytics";
import RichText from "./RichText";
import { FileText, Globe, Smartphone } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";

let isFirstMount = true;

const KissanPrototype = dynamic(() => import("./prototype/KissanPrototype"), { ssr: false });
const GauPrototype = dynamic(() => import("./prototype/GauPrototype"), { ssr: false });

const COUNT_DURATION_S = 0.7;

// Counts 0 → `to` with an ease-out, then shows the clean final value.
function CountUp({ to, decimals, delay }: { to: number; decimals: number; delay: number }) {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const controls = animate(0, to, {
      duration: COUNT_DURATION_S,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setValue,
    });
    return () => controls.stop();
  }, [to, delay, reduceMotion]);

  if (reduceMotion || value >= to) return <>{to}</>;
  return <>{decimals ? value.toFixed(decimals) : Math.round(value)}</>;
}

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
  const { openSection } = useWindow();
  const [openPrototype, setOpenPrototype] = useState<"kissan-sampurna" | "gau-sampurna" | null>(null);
  // Show "View Resume" only once the PDF is actually deployed, so the CTA never 404s.
  const [hasResume, setHasResume] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(profile.resumeUrl, { method: "HEAD" })
      .then((res) => {
        const isPdf = (res.headers.get("content-type") ?? "").includes("pdf");
        if (!cancelled) setHasResume(res.ok && isPdf);
      })
      .catch(() => {
        // offline or blocked: keep the LinkedIn fallback
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const linkedinCta = (primary: boolean) => (
    <motion.a
      href={profile.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className={primary ? `os-btn ${styles.ctaPrimary}` : styles.linkScribble}
      onClick={() => trackEvent("Clicked Contact Method", { method: "linkedin", placement: "hero" })}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <FaLinkedin size={16} aria-hidden="true" /> Connect on LinkedIn
    </motion.a>
  );

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
                alt={`${profile.name}, ${profile.role}`}
                width={200} 
                height={200}
                className={styles.profileImage}
              />
            </div>
          </motion.div>

          {/* Apps I've built: one card per app with the SAME two CTAs in the same order, so app vs
              website is never ambiguous: 📱 Try app (solid, opens the in-site prototype) on top,
              🌐 Website ↗ (outline, leaves the site) below. Missing prototype = disabled "App · soon". */}
          <motion.div
            className={styles.appsShelf}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: initialDelay + 0.9, duration: 0.4, ease: "easeOut" }}
          >
            <p className={styles.appsCaption}>Apps I&apos;ve built</p>
            <ul className={styles.appsGrid}>
              {shippedApps.map((app) => {
                const launchPrototype = () => {
                  if (!app.prototype) return;
                  trackEvent("Opened Prototype", { prototype: app.prototype, placement: "hero" });
                  setOpenPrototype(app.prototype);
                };
                const trackWebsite = (placement: "hero_icon" | "hero_chip") =>
                  trackEvent("Clicked External Link", { link_type: "app_website", label: app.name, placement });
                return (
                  <li key={app.name} className={styles.appCard} title={`${app.name} · ${app.caption}`}>
                    <div className={styles.appHeader}>
                      <span className={styles.appIcon}>
                        <Image src={app.icon} alt="" width={34} height={34} />
                      </span>
                      <span className={styles.appName}>
                        {app.name}
                        <span className={styles.srOnly}> · {app.caption}</span>
                      </span>
                    </div>

                    {app.prototype ? (
                      <motion.button
                        type="button"
                        className={`${styles.appCta} ${styles.appCtaApp}`}
                        onClick={launchPrototype}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`Try the ${app.name} app (interactive prototype)`}
                      >
                        <Smartphone size={13} strokeWidth={2.4} aria-hidden="true" /> Try app
                      </motion.button>
                    ) : (
                      <span
                        className={`${styles.appCta} ${styles.appCtaDisabled}`}
                        aria-disabled="true"
                        title="Interactive app prototype coming soon"
                      >
                        <Smartphone size={13} strokeWidth={2.4} aria-hidden="true" /> App · soon
                      </span>
                    )}

                    <motion.a
                      href={app.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.appCta} ${styles.appCtaWeb}`}
                      onClick={() => trackWebsite("hero_chip")}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`${app.name} website (opens in a new tab)`}
                    >
                      <Globe size={13} strokeWidth={2.4} aria-hidden="true" /> Website <span aria-hidden="true">↗</span>
                    </motion.a>
                  </li>
                );
              })}
            </ul>
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
            <RichText text={profile.intro} />
          </motion.p>

          <motion.div 
            className={styles.kpiGrid}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
            }}
          >
            {kpis.map((kpi, i) => (
              <div key={kpi.label} className={styles.kpiCard}>
                <div className={styles.kpiValue}>
                  {/* Screen readers get the final value, not the ticking digits */}
                  <span className={styles.srOnly}>{`${kpi.prefix}${kpi.value}${kpi.suffix}`}</span>
                  <span aria-hidden="true">
                    {kpi.prefix}
                    <CountUp to={kpi.value} decimals={kpi.decimals} delay={initialDelay + 0.45 + i * 0.1} />
                    {kpi.suffix}
                  </span>
                </div>
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
            {hasResume ? (
              <>
                <motion.a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`os-btn ${styles.ctaPrimary}`}
                  onClick={() => trackEvent("Opened Resume", { placement: "hero" })}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FileText size={16} aria-hidden="true" /> View Resume
                </motion.a>
                {linkedinCta(false)}
              </>
            ) : (
              <>
                {linkedinCta(true)}
                <motion.button
                  type="button"
                  className={styles.linkScribble}
                  onClick={() => openSection('contact', 'hero_cta')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get in touch
                </motion.button>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
      {openPrototype === "kissan-sampurna" && <KissanPrototype onClose={() => setOpenPrototype(null)} />}
      {openPrototype === "gau-sampurna" && <GauPrototype onClose={() => setOpenPrototype(null)} />}
    </section>
  );
}
