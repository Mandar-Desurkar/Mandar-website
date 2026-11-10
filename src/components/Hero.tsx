"use client";

import styles from "./Hero.module.css";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect, useSyncExternalStore } from "react";
import { profile, kpis, shippedApps } from "@/data/resume";
import { useWindow } from "@/context/WindowContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import AboutCard from "./AboutCard";
import CountUp from "./CountUp";
import dynamic from "next/dynamic";
import { trackEvent } from "@/lib/analytics";
import RichText from "./RichText";
import { FileText, Globe, Smartphone } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";

let isFirstMount = true;


// Every block in the hero enters the same way: a short rise, with no overshoot
const rise = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

function ClassicHero() {
  const [initialDelay] = useState(isFirstMount ? 1.8 : 0);
  const { openSection, openPrototype } = useWindow();
  const linkedinCta = (primary: boolean) => (
    <motion.a
      href={profile.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className={primary ? `os-btn ${styles.ctaPrimary}` : styles.linkScribble}
      onClick={() => trackEvent("Clicked Contact Method", { method: "linkedin", placement: "hero" })}
      whileTap={{ scale: 0.97 }}
    >
      {/* Beside View Resume there's only room for the name */}
      <FaLinkedin size={16} aria-hidden="true" /> {primary ? "Connect on LinkedIn" : "LinkedIn"}
    </motion.a>
  );

  useEffect(() => {
    isFirstMount = false;
  }, []);
  return (
    <section className={styles.heroSection}>
      <div className={`container ${styles.heroContainer}`}>
        
        <div className={styles.visualsGroup}>
          <motion.div
            className={styles.profileFrame}
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: initialDelay + 0.2 }}
          >
            <div className={styles.photoWrapper}>
              <Image
                src="/profile-photo.jpg"
                alt={`${profile.name}, ${profile.role}`}
                width={320}
                height={320}
                className={styles.profileImage}
              />
            </div>
            <p className={styles.statusBadge}>
              <span className={styles.statusDot} aria-hidden="true" />
              {profile.availability}
            </p>
          </motion.div>

          {/* Apps I've built: a quiet list under the photo (no cards, no buttons) so the hero keeps
              one primary CTA. Each app has two distinct text links in the same order:
              📱 Try app (blue, opens the in-site prototype) · 🌐 Website ↗ (grey, external). */}
          <motion.div
            className={styles.appsShelf}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: initialDelay + 0.35, duration: 0.4, ease: "easeOut" }}
          >
            <p className={styles.appsCaption}>Apps I&apos;ve built</p>
            <ul className={styles.appsList}>
              {shippedApps.map((app) => {
                const launchPrototype = () => {
                  if (!app.prototype) return;
                  openPrototype(app.prototype, "hero");
                };
                return (
                  <li key={app.name} className={styles.appRow} title={`${app.name} · ${app.caption}`}>
                    <span className={styles.appIcon}>
                      <Image src={app.icon} alt="" width={40} height={40} />
                    </span>
                    <span className={styles.appText}>
                      <span className={styles.appName}>
                        {app.name}
                        <span className={styles.srOnly}> · {app.caption}</span>
                      </span>
                      <span className={styles.appLinks}>
                        {app.prototype ? (
                          <button
                            type="button"
                            className={`${styles.appLink} ${styles.appLinkApp}`}
                            onClick={launchPrototype}
                            aria-label={`Try the ${app.name} (interactive prototype)`}
                          >
                            <Smartphone size={12} strokeWidth={2.4} aria-hidden="true" />
                            {app.prototype === "gau-sampurna-web" ? "Try site" : "Try app"}
                          </button>
                        ) : (
                          <span className={`${styles.appLink} ${styles.appLinkSoon}`} title="Interactive app prototype coming soon">
                            <Smartphone size={12} strokeWidth={2.4} aria-hidden="true" />
                            App soon
                          </span>
                        )}
                        <span className={styles.linkDot} aria-hidden="true">·</span>
                        <a
                          href={app.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${styles.appLink} ${styles.appLinkWeb}`}
                          onClick={() =>
                            trackEvent("Clicked External Link", { link_type: "app_website", label: app.name, placement: "hero_chip" })
                          }
                          aria-label={`${app.name} website (opens in a new tab)`}
                        >
                          <Globe size={12} strokeWidth={2.4} aria-hidden="true" />
                          Website ↗
                        </a>
                      </span>
                    </span>
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
            visible: { transition: { staggerChildren: 0.08, delayChildren: initialDelay } }
          }}
        >
          <motion.h1 className="hand-heading-1" variants={rise}>
            Hi, I&apos;m Mandar.
            <br />
            I&apos;m a <span className={styles.highlight}>product builder.</span>
          </motion.h1>

          <motion.p 
            className={styles.description}
            variants={rise}
          >
            <RichText text={profile.intro} />
          </motion.p>

          <motion.div 
            className={styles.kpiGrid}
            variants={rise}
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
            variants={rise}
          >
            {profile.resumeUrl ? (
              <>
                <motion.a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`os-btn ${styles.ctaPrimary}`}
                  onClick={() => trackEvent("Opened Resume", { placement: "hero" })}
                  whileTap={{ scale: 0.97 }}
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
                  whileTap={{ scale: 0.97 }}
                >
                  Get in touch
                </motion.button>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const noSubscribe = () => () => {};

const concept = (name: "AboutLive" | "AboutNative" | "AboutShowcase" | "AboutStore") =>
  dynamic(() => import("./about/AboutConcepts").then((m) => m[name]));
const AboutLive = concept("AboutLive");
const AboutNative = concept("AboutNative");
const AboutShowcase = concept("AboutShowcase");
const AboutStore = concept("AboutStore");

// Desktop concept comparison: /?about=live | showcase | store | native | classic. Phones keep the iOS hero.
export default function Hero() {
  const isMobile = useIsMobile();
  const concept = useSyncExternalStore(
    noSubscribe,
    () => new URLSearchParams(window.location.search).get("about"),
    () => null,
  );
  if (isMobile || concept === "classic") return <ClassicHero />;
  if (concept === "store") return <AboutStore />;
  if (concept === "native") return <AboutNative />;
  if (concept === "showcase") return <AboutShowcase />;
  if (concept === "live") return <AboutLive />;
  return <AboutCard />;
}
