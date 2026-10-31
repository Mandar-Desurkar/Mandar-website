"use client";

// Directions for the desktop About window, compared at /?about=live | showcase | store | native.
// The phone layout keeps the iOS hero in Hero.tsx.
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, FileText, Play } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { kpis, profile, shippedApps } from "@/data/resume";
import { useWindow } from "@/context/WindowContext";
import { trackEvent } from "@/lib/analytics";
import styles from "./AboutConcepts.module.css";

type PrototypeId = "kissan-sampurna" | "gau-sampurna";

const SCREENS: { src: string; title: string; caption: string; prototype: PrototypeId }[] = [
  { src: "/about/kissan-home.webp", title: "Farmer home", caption: "Kissan Sampurna", prototype: "kissan-sampurna" },
  { src: "/about/kissan-doctor.webp", title: "AI crop diagnosis", caption: "Kissan Sampurna", prototype: "kissan-sampurna" },
  { src: "/about/gau-home.webp", title: "Herd health", caption: "Gau Sampurna", prototype: "gau-sampurna" },
  { src: "/about/gau-diagnosis.webp", title: "AI cattle diagnosis", caption: "Gau Sampurna", prototype: "gau-sampurna" },
];

const STATS = [
  { label: "Installs", value: "250K+", note: "across 2 apps" },
  { label: "Conversion", value: "3×", note: "onboarding to trial" },
  { label: "Sales", value: "₹1 Cr+", note: "every month" },
  { label: "Shipped", value: "5", note: "0→1 products" },
  { label: "Languages", value: "13", note: "Indian languages" },
];

const shortCompany = "Silo Fortune";

let isFirstMount = true;

// Shown until the app's code arrives, so the window never opens on an empty stage
const poster = (src: string) =>
  function Poster() {
    return (
      <div className={styles.poster}>
        <Image src={src} alt="" width={393} height={852} sizes="300px" />
      </div>
    );
  };

const LiveKissan = dynamic(() => import("./LiveKissan"), { ssr: false, loading: poster("/about/kissan-home.webp") });
const LiveGau = dynamic(() => import("./LiveGau"), { ssr: false, loading: poster("/about/gau-home.webp") });

type LiveFeature = { label: string; flow: string; screen?: string; alsoFlow?: string };

// Each feature opens on the screen that shows it best: reports rather than the hubs that lead to them
const LIVE_APPS: Record<"kissan" | "gau", { prototype: PrototypeId; features: LiveFeature[] }> = {
  kissan: {
    prototype: "kissan-sampurna",
    features: [
      { flow: "home-weather", label: "Home" },
      { flow: "crop-doctor", screen: "report", label: "AI Crop Doctor" },
      { flow: "crop-guide", label: "Crop Guide" },
      { flow: "farm-report", alsoFlow: "farm-monitoring", label: "Farm Monitoring" },
    ],
  },
  gau: {
    prototype: "gau-sampurna",
    features: [
      { flow: "gs-home", label: "Home" },
      { flow: "disease-check", screen: "gs-diagnosis", label: "AI Disease Check" },
      { flow: "market-value", screen: "gs-market-report", label: "Market Value" },
      { flow: "gs-herd", label: "My Herd" },
    ],
  },
};

type LiveAppId = keyof typeof LIVE_APPS;

// The first open waits for the boot screen
function useEntrance() {
  const [delay] = useState(isFirstMount ? 1.8 : 0);
  useEffect(() => {
    isFirstMount = false;
  }, []);
  return delay;
}

// Shows "View Resume" only once the PDF is deployed, so the CTA never 404s
function useHasResume() {
  const [hasResume, setHasResume] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch(profile.resumeUrl, { method: "HEAD" })
      .then((res) => {
        const isPdf = (res.headers.get("content-type") ?? "").includes("pdf");
        if (!cancelled) setHasResume(res.ok && isPdf);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return hasResume;
}

function Actions({ pill }: { pill?: boolean }) {
  const { openSection } = useWindow();
  const hasResume = useHasResume();
  const shape = pill ? styles.pill : "";
  const linkedin = (primary: boolean) => (
    <a
      href={profile.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className={`${primary ? styles.primary : styles.secondary} ${shape}`}
      onClick={() => trackEvent("Clicked Contact Method", { method: "linkedin", placement: "hero" })}
    >
      <FaLinkedin size={15} aria-hidden="true" /> Connect on LinkedIn
    </a>
  );
  return (
    <div className={styles.actions}>
      {hasResume ? (
        <>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.primary} ${shape}`}
            onClick={() => trackEvent("Opened Resume", { placement: "hero" })}
          >
            <FileText size={15} aria-hidden="true" /> View Resume
          </a>
          {linkedin(false)}
        </>
      ) : (
        <>
          {linkedin(true)}
          <button type="button" className={`${styles.secondary} ${shape}`} onClick={() => openSection("contact", "hero_cta")}>
            Get in touch
          </button>
        </>
      )}
    </div>
  );
}

function Status() {
  return (
    <span className={styles.status}>
      <span className={styles.statusDot} aria-hidden="true" />
      {profile.availability}
    </span>
  );
}

// A working app on the first screen. The rail drives the phone, and tapping the phone drives the rail.
function LiveDemo() {
  const { openPrototype } = useWindow();
  const [app, setApp] = useState<LiveAppId>("kissan");
  const [request, setRequest] = useState<{ flow: string; screen?: string; n: number }>({ flow: "home-weather", n: 0 });
  const [current, setCurrent] = useState<string>("home-weather");
  const [touched, setTouched] = useState(false);
  const onInteract = useCallback(() => setTouched(true), []);

  const show = (nextApp: LiveAppId, feature: LiveFeature) => {
    setApp(nextApp);
    setRequest((r) => ({ flow: feature.flow, screen: feature.screen, n: r.n + 1 }));
    setCurrent(feature.flow);
    setTouched(true);
  };

  const Phone = app === "kissan" ? LiveKissan : LiveGau;
  return (
    <div className={styles.liveDemo}>
      <div className={styles.liveStage}>
        <Phone key={`${app}-${request.n}`} initialFlow={request.flow} initialScreen={request.screen} onFlowChange={setCurrent} onInteract={onInteract} />
        {!touched && (
          <span className={styles.tapHint} aria-hidden="true">
            <span className={styles.tapRing} />
            Tap me
          </span>
        )}
      </div>

      <aside className={styles.rail} aria-label="Live app demo">
        <p className={styles.railLabel}>
          <span className={styles.liveDot} aria-hidden="true" />
          Live demo
        </p>
        <p className={styles.railNote}>Not a video. This is the real app, running here.</p>
        <div className={styles.appSwitch}>
          {(Object.keys(LIVE_APPS) as LiveAppId[]).map((id) => {
            const info = shippedApps.find((a) => a.prototype === LIVE_APPS[id].prototype);
            return (
              <button key={id} type="button" aria-pressed={app === id} className={app === id ? styles.appOn : ""} onClick={() => show(id, LIVE_APPS[id].features[0])}>
                {info && <Image src={info.icon} alt="" width={28} height={28} />}
                {info?.name}
              </button>
            );
          })}
        </div>
        <ul className={styles.features}>
          {LIVE_APPS[app].features.map((f) => {
            const on = current === f.flow || current === f.alsoFlow;
            return (
              <li key={f.flow}>
                <button type="button" aria-current={on ? "true" : undefined} className={on ? styles.featureOn : ""} onClick={() => show(app, f)}>
                  {f.label}
                </button>
              </li>
            );
          })}
        </ul>
        <button type="button" className={styles.openFull} onClick={() => openPrototype(LIVE_APPS[app].prototype, "hero")}>
          Open every screen
          <ArrowUpRight size={13} aria-hidden="true" />
        </button>
      </aside>
    </div>
  );
}

// 0. The app itself is the hero: dark window, one live phone, nothing to imagine
export function AboutLive() {
  const delay = useEntrance();
  return (
    <section className={`${styles.concept} ${styles.dark} ${styles.live}`}>
      <motion.div
        className={styles.liveText}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      >
        <div className={styles.identity}>
          <Image src="/profile-avatar.jpg" alt="" width={44} height={44} className={styles.avatar} />
          <div>
            <p className={styles.identityName}>{profile.name}</p>
            <Status />
          </div>
        </div>
        <h1 className={styles.showcaseTitle}>
          I&apos;m a product
          <br />
          builder.
        </h1>
        <p className={styles.intro}>{profile.intro}</p>
        <dl className={styles.statRow}>
          {kpis.map((k) => (
            <div key={k.label}>
              <dd>{`${k.prefix}${k.value}${k.suffix}`}</dd>
              <dt>{k.label}</dt>
            </div>
          ))}
        </dl>
        <Actions />
      </motion.div>
      <motion.div
        className={styles.liveEntrance}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: delay + 0.15 }}
      >
        <LiveDemo />
      </motion.div>
    </section>
  );
}

// 1. The work is the hero: real app screens on a brand panel, one tap from the prototype
export function AboutShowcase() {
  const { openPrototype } = useWindow();
  const delay = useEntrance();
  const phones = [SCREENS[0], SCREENS[2]];
  return (
    <section className={`${styles.concept} ${styles.showcase}`}>
      <motion.div
        className={styles.showcaseText}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      >
        <div className={styles.identity}>
          <Image src="/profile-avatar.jpg" alt="" width={52} height={52} className={styles.avatar} />
          <div>
            <p className={styles.identityName}>{profile.name}</p>
            <Status />
          </div>
        </div>
        <h1 className={styles.showcaseTitle}>
          I&apos;m a product
          <br />
          builder.
        </h1>
        <p className={styles.intro}>{profile.intro}</p>
        <dl className={styles.statRow}>
          {kpis.map((k) => (
            <div key={k.label}>
              <dd>{`${k.prefix}${k.value}${k.suffix}`}</dd>
              <dt>{k.label}</dt>
            </div>
          ))}
        </dl>
        <Actions />
      </motion.div>

      <div className={styles.showcasePanel}>
        {phones.map((s, i) => {
          const app = shippedApps.find((a) => a.prototype === s.prototype);
          return (
            <motion.button
              key={s.src}
              type="button"
              className={styles.showcasePhone}
              onClick={() => openPrototype(s.prototype, "hero")}
              aria-label={`Try the ${app?.name} app (interactive prototype)`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: delay + 0.15 + i * 0.1 }}
            >
              <span className={styles.bezel}>
                <Image src={s.src} alt="" width={393} height={852} sizes="(min-width: 1800px) 280px, 220px" />
              </span>
              <span className={styles.tryChip}>
                <Play size={10} fill="currentColor" aria-hidden="true" />
                <span className={styles.tryWord}>Try&nbsp;</span>
                {app?.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

// 2. Mandar as a product page: the App Store's info row and screenshots already do a PM's job
export function AboutStore() {
  const { openPrototype, openSection } = useWindow();
  const delay = useEntrance();
  return (
    <motion.section
      className={`${styles.concept} ${styles.store}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
      <header className={styles.storeHeader}>
        <Image src="/profile-photo.jpg" alt={`${profile.name}, ${profile.role}`} width={112} height={112} className={styles.storeIcon} />
        <div className={styles.storeTitle}>
          <h1>{profile.name}</h1>
          <p>Product builder. AI-powered products, 0→1.</p>
          <p className={styles.storeSeller}>
            {profile.role}, {shortCompany}
          </p>
        </div>
        <div className={styles.storeActions}>
          <Actions pill />
          <Status />
        </div>
      </header>

      <dl className={styles.storeInfo}>
        {STATS.map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd>
              <b>{s.value}</b>
              {s.note}
            </dd>
          </div>
        ))}
      </dl>

      <div className={styles.storeHeading}>
        <h2>Try what I&apos;ve built</h2>
        <button type="button" onClick={() => openSection("projects", "hero_cta")}>
          See case studies
        </button>
      </div>
      <ul className={styles.storeShots}>
        {SCREENS.map((s) => (
          <li key={s.src}>
            <button type="button" onClick={() => openPrototype(s.prototype, "hero")} aria-label={`${s.title}, ${s.caption}: try the prototype`}>
              <span className={styles.storeShot}>
                <Image src={s.src} alt="" width={393} height={852} sizes="220px" />
              </span>
              <span className={styles.storeCaption}>
                <b>{s.title}</b>
                {s.caption}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}

// 3. "About This Mac", for a person: a spec sheet that fits the desktop metaphor
export function AboutNative() {
  const { openPrototype } = useWindow();
  const delay = useEntrance();
  return (
    <motion.section
      className={`${styles.concept} ${styles.native}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay }}
    >
      <Image src="/profile-photo.jpg" alt={`${profile.name}, ${profile.role}`} width={128} height={128} className={styles.nativePhoto} />
      <h1>{profile.name}</h1>
      <p className={styles.nativeModel}>Product Manager, 2.5+ years</p>
      <dl className={styles.specs}>
        <div>
          <dt>Role</dt>
          <dd>
            {profile.role}, {shortCompany}
          </dd>
        </div>
        <div>
          <dt>Builds</dt>
          <dd>AI-powered products, 0→1</dd>
        </div>
        <div>
          <dt>Impact</dt>
          <dd>250K+ installs · 3× trial conversion · ₹1 Cr+ monthly sales</dd>
        </div>
        <div>
          <dt>Apps</dt>
          <dd className={styles.specApps}>
            {shippedApps.map((a) => (
              <button key={a.name} type="button" onClick={() => a.prototype && openPrototype(a.prototype, "hero")}>
                {a.name}
                <ArrowUpRight size={13} aria-hidden="true" />
              </button>
            ))}
          </dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>
            <Status />
          </dd>
        </div>
      </dl>
      <Actions />
    </motion.section>
  );
}
