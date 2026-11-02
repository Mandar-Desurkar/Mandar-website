"use client";

// The About window: a short note on dark glass.
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Copy, FileText } from "lucide-react";
import { kpis, profile, shippedApps } from "@/data/resume";
import { useWindow } from "@/context/WindowContext";
import { trackEvent } from "@/lib/analytics";
import CountUp from "./CountUp";
import styles from "./AboutCard.module.css";

type Tag = "build" | "grow" | "write";

let isFirstMount = true;

// Each coloured word opens the work it describes
function Pill({ tag, word }: { tag: Tag; word: string }) {
  const { openPrototype, openSection } = useWindow();
  const router = useRouter();
  const open = () => {
    if (tag === "build") openPrototype("kissan-sampurna", "hero");
    if (tag === "grow") openSection("projects", "hero_cta");
    if (tag === "write") {
      trackEvent("Opened Case Study", { slug: "crop-guide", placement: "desktop" });
      router.push("/case-studies/crop-guide");
    }
  };
  return (
    <button type="button" className={`${styles.pill} ${styles[tag]}`} onClick={open}>
      {word}
    </button>
  );
}

// "AI-powered {build:products}" → text with a pill in place of each {tag:word}
function Line({ text }: { text: string }) {
  return (
    <p>
      {text.split(/(\{\w+:\w+\})/).map((part, i) => {
        const pill = part.match(/^\{(\w+):(\w+)\}$/);
        return pill ? <Pill key={i} tag={pill[1] as Tag} word={pill[2]} /> : part;
      })}
    </p>
  );
}

export default function AboutCard() {
  const { openSection, openPrototype } = useWindow();
  const card = useRef<HTMLElement>(null);
  const [delay] = useState(isFirstMount ? 1.8 : 0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    isFirstMount = false;
  }, []);

  const rise = (order: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: delay + 0.15 + order * 0.07 },
  });

  return (
    <section
      ref={card}
      className={styles.card}
      // The glass catches a soft light under the pointer
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        card.current?.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.current?.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      <motion.header className={styles.header} {...rise(0)}>
        <span className={styles.portrait}>
          <Image src="/profile-avatar.jpg" alt={`${profile.name}, ${profile.role}`} width={224} height={224} />
        </span>
        <div>
          <h1>{profile.name}</h1>
          <p>Product builder</p>
          <p className={styles.status}>
            <span className={styles.statusDot} aria-hidden="true" />
            {profile.availability}
          </p>
        </div>
      </motion.header>

      <motion.div className={styles.prose} {...rise(1)}>
        {profile.about.map((line) => (
          <Line key={line} text={line} />
        ))}
      </motion.div>

      <motion.dl className={styles.stats} {...rise(2)}>
        {kpis.map((k, i) => (
          <div key={k.label}>
            <dd>
              <span className={styles.srOnly}>{`${k.prefix}${k.value}${k.suffix}`}</span>
              <span aria-hidden="true">
                {k.prefix}
                <CountUp to={k.value} decimals={k.decimals} delay={delay + 0.45 + i * 0.1} />
                {k.suffix}
              </span>
            </dd>
            <dt>{k.label}</dt>
          </div>
        ))}
      </motion.dl>

      <motion.p className={styles.apps} {...rise(3)}>
        <span>View prototype</span>
        {shippedApps.map(
          (app) =>
            app.prototype && (
              <button key={app.name} type="button" onClick={() => app.prototype && openPrototype(app.prototype, "hero")}>
                {app.name}
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            ),
        )}
      </motion.p>

      <motion.p className={styles.links} {...rise(4)}>
        <button type="button" className={styles.contact} onClick={() => openSection("contact", "hero_cta")}>
          Get in touch
        </button>
        {/* Opens the PDF-style resume in a new tab, so the desktop stays where the visitor left it */}
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.resume}
          onClick={() => trackEvent("Opened Resume", { placement: "hero" })}
        >
          <FileText size={15} aria-hidden="true" /> View resume
        </a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("Clicked Contact Method", { method: "linkedin", placement: "hero" })}>
          LinkedIn
        </a>
        <a href={`mailto:${profile.email}`} onClick={() => trackEvent("Clicked Contact Method", { method: "email", placement: "hero" })}>
          Email
        </a>
        {/* Many recruiters paste the address into their own mail tool rather than open a mail app */}
        <button
          type="button"
          className={styles.copy}
          onClick={() => {
            navigator.clipboard?.writeText(profile.email).then(() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1800);
            });
            trackEvent("Clicked Contact Method", { method: "copy_email", placement: "hero" });
          }}
          aria-label={`Copy email address ${profile.email}`}
          title="Copy email address"
        >
          {/* An icon beside Email, so the row fits one line; it says Copied once used */}
          {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          {copied && <span>Copied</span>}
        </button>
      </motion.p>
    </section>
  );
}
