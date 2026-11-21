"use client";

// The About window: a short note on dark glass.
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mrs_Saint_Delafield } from "next/font/google";
import { FileText } from "lucide-react";
import { experiences, kpis, profile } from "@/data/resume";
import { useWindow } from "@/context/WindowContext";
import { trackEvent } from "@/lib/analytics";
import CountUp from "./CountUp";
import styles from "./AboutCard.module.css";

type Tag = "build" | "grow" | "write";

let isFirstMount = true;

// The sign-off under the About text: a signature-style script, the one place the site leaves the system font
const signatureFont = Mrs_Saint_Delafield({ weight: "400", subsets: ["latin"], display: "swap", variable: "--font-signature" });
// Current employer, short form, as the phone home screen shows it ("Silo Fortune")
const company = experiences.find((e) => !e.isFuture)?.company.replace(/ Private Limited$/, "");

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
  const { openSection } = useWindow();
  const card = useRef<HTMLElement>(null);
  const [delay] = useState(isFirstMount ? 1.8 : 0);

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
          {/* The full head-and-shoulders photo: the tight avatar crop looks zoomed in at this size */}
          <Image src="/profile-photo.jpg" alt={`${profile.name}, ${profile.role}`} width={224} height={224} />
        </span>
        <div>
          <h1>{profile.name}</h1>
          {/* The title a recruiter scans for, and where; matches the phone home screen */}
          <p>
            {profile.role}
            {company && ` at ${company}`}
          </p>
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

      {/* Signed, in the signature colour; it writes itself in once the text has risen */}
      <p className={`${styles.signature} ${signatureFont.variable}`} style={{ animationDelay: `${delay + 0.55}s` }} aria-label={`Signed, ${profile.name.split(" ")[0]}`}>
        {profile.name.split(" ")[0]}
      </p>

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

      {/* Two actions only: the Contact window it opens already has email (with copy), phone and LinkedIn */}
      <motion.p className={styles.links} {...rise(3)}>
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
      </motion.p>
    </section>
  );
}
