/* eslint-disable @next/next/no-img-element -- fixed-size mock screens inside a phone frame */
"use client";

// Kissan Sampurna paywall, recreated from the `prod` branch: subscriptions/SubscriptionScreen3.jsx
// (3 steps: story video + social proof, features, plan with a ₹1 trial timeline), its trial
// confirmation modal, and PaymentStatusScreen2.jsx (trial active). Prices are the screen's own
// fallbacks (₹1 for 7 days, then ₹399/yr); real plans come from the API.
import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { ArrowLeft, Check, Info, Lock, ShieldCheck, Volume2, VolumeX, X } from "lucide-react";
import p from "./subscription.module.css";
import { ui } from "./KissanShared";
import type { ScreenProps } from "./KissanScreens";

const img = (file: string) => `/prototypes/kissan-sampurna/${file}`;

function Nav({ step, back, close }: { step: 1 | 2 | 3; back: () => void; close: () => void }) {
  return (
    <div className={p.navRow}>
      {step === 1 ? (
        <span className={p.navPlaceholder} />
      ) : (
        <button type="button" className={`${ui.btnReset} ${p.navBtn}`} onClick={back} aria-label="Back">
          <ArrowLeft size={18} />
        </button>
      )}
      <span className={p.dots} aria-label={`Step ${step} of 3`}>
        {[1, 2, 3].map((i) => (
          <i key={i} className={`${i <= step ? p.dotBar : p.dotSmall} ${i <= step ? p.dotOn : ""}`} />
        ))}
      </span>
      <button type="button" className={`${ui.btnReset} ${p.navBtn}`} onClick={close} aria-label="Close">
        <X size={18} />
      </button>
    </div>
  );
}

// ---------- Step 1: story video + ReviewCarousel ----------

const SLIDES: ReactNode[] = [
  <>
    <span className={p.avatars}>
      {["pw-avatar1.webp", "pw-avatar2.webp", "pw-avatar3.webp"].map((f) => (
        <img key={f} src={img(f)} alt="" />
      ))}
    </span>
    <span className={p.cardText}>
      50,000+ trusted farmers across India
      <span className={p.stars}>
        <span>★★★★★</span> 4.1 rating
      </span>
    </span>
  </>,
  <>
    <img className={p.bigAvatar} src={img("pw-scientist.webp")} alt="" />
    <span className={p.cardText}>Built with agricultural scientists, not guesswork.</span>
  </>,
  <>
    <img className={p.bigAvatar} src={img("pw-avatar1.webp")} alt="" />
    <span className={p.cardText}>
      “I check it before every spray now”
      <span className={p.author}>-Manjunath, Hassan</span>
    </span>
  </>,
  <>
    <img src={img("pw-amruth.webp")} alt="Amruth Organic" style={{ width: 83, height: 34, objectFit: "contain" }} />
    <span className={p.cardText}>{"Products Manufactured by\nAmruth Organic"}</span>
  </>,
  <>
    <img src={img("pw-language.webp")} alt="" style={{ width: 30, height: 29 }} />
    <span className={p.cardText} style={{ maxWidth: 188 }}>
      Simple Farming Support in your Language
    </span>
  </>,
];

function Intro({ next, goToFlow }: ScreenProps) {
  const [slide, setSlide] = useState(0);
  const [muted, setMuted] = useState(true);
  const [secs, setSecs] = useState(0);

  // ReviewCarousel auto-advances every 3.5s; the video clock ticks alongside
  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 3500);
    const clock = setInterval(() => setSecs((s) => (s + 1) % 75), 1000);
    return () => {
      clearInterval(id);
      clearInterval(clock);
    };
  }, []);

  return (
    <div className={p.screen}>
      <Nav step={1} back={() => undefined} close={() => goToFlow("crop-doctor")} />
      <div className={p.body}>
        <div className={p.video} style={{ backgroundImage: `url(${img("pw-video-poster.webp")})` }}>
          <div className={p.videoTop}>
            <span className={p.timePill}>
              0:{String(secs % 60).padStart(2, "0")} / 1:15
            </span>
            <button type="button" className={`${ui.btnReset} ${p.soundBtn}`} onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute" : "Mute"}>
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
          <span className={p.progress} style={{ width: `${(secs / 75) * 100}%` }} />
        </div>
        <div className={p.heroText}>
          <p className={p.heroTitle}>{"Farm with confidence, not\nguesswork."}</p>
          <p className={p.heroSub}>{"Know your soil, your crop, and your market\nbefore they surprise you."}</p>
        </div>
      </div>
      <div className={p.bottom}>
        <div className={p.carousel}>
          <div className={p.track} style={{ transform: `translateX(-${slide * 100}%)` }}>
            {SLIDES.map((content, i) => (
              <div key={i} className={p.card}>
                {content}
              </div>
            ))}
          </div>
          <div className={p.carouselDots}>
            {SLIDES.map((_, i) => (
              <i key={i} className={i === slide ? p.on : undefined} />
            ))}
          </div>
        </div>
        <button type="button" className={`${ui.btnReset} ${p.cta} ${ui.hotspot}`} onClick={next}>
          See What&apos;s Included
        </button>
      </div>
    </div>
  );
}

// ---------- Step 2: features ----------

const FEATURES = [
  ["pw-feat-crop.webp", "Crop Guide", "Know exactly what to plant next season."],
  ["pw-feat-disease.webp", "Crop Doctor", "Catch problems before they spread."],
  ["pw-feat-weather.webp", "Weather Alerts", "Know when to spray, when to wait."],
  ["pw-feat-satellite.webp", "Farm Monitor", "Watch your fields without walking them."],
  ["pw-feat-mandi.webp", "Mandi Prices", "Sell at the right time, right place."],
];

function Features({ next, back, goToFlow }: ScreenProps) {
  return (
    <div className={p.screen}>
      <Nav step={2} back={back} close={() => goToFlow("crop-doctor")} />
      <div className={p.body}>
        <div className={p.heroText} style={{ marginBottom: 14 }}>
          <p className={p.heroTitle}>Everything you need, in one app</p>
          <p className={p.heroSub}>{"From choosing what to plant to knowing\nwhen to sell it."}</p>
        </div>
        <div className={p.features}>
          {FEATURES.map(([file, title, desc]) => (
            <div key={title} className={p.feature}>
              <img src={img(file)} alt="" />
              <span>
                <b>{title}</b>
                <span>{desc}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className={p.bottom}>
        <p className={p.note}>{"36 reports a year once your plan begins, share them\nacross any of these tools."}</p>
        <button type="button" className={`${ui.btnReset} ${p.cta} ${ui.hotspot}`} onClick={next}>
          See Your Plan
        </button>
      </div>
    </div>
  );
}

// ---------- Step 3: plan + trial timeline ----------

const TRIAL_DAYS = 7;
const PRICE = 399;

function Plan({ next, back, goToFlow }: ScreenProps) {
  const [modal, setModal] = useState(false);
  const [count, setCount] = useState(5);

  // "Proceed (5s)" counts down so the ₹1-vs-₹399 message is actually read
  useEffect(() => {
    if (!modal || count === 0) return;
    const t = setTimeout(() => setCount((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [modal, count]);

  const timeline = [
    { marker: "check", icon: "pw-tl-today.webp", bg: "#fff", title: "Today", sub: `₹1 for ${TRIAL_DAYS} days`, active: true },
    { marker: "hollow", icon: "pw-tl-remind.webp", bg: "rgba(254, 159, 6, 0.15)", title: `Day ${TRIAL_DAYS - 1}`, sub: "We remind you." },
    { marker: "hollow", icon: "pw-tl-leaf.webp", bg: "rgba(92, 174, 5, 0.15)", title: `Day ${TRIAL_DAYS + 1}`, sub: "Annual plan begins." },
  ];

  return (
    <div className={`${p.screen} ${p.step3}`} style={{ backgroundImage: `url(${img("pw-step3-bg.webp")})` }}>
      <Nav step={3} back={back} close={() => goToFlow("crop-doctor")} />
      <div className={p.body}>
        <div className={p.step3Head}>
          <span className={p.step3Pre}>Let’s get Started</span>
          <p className={p.step3Title}>Healthier crop, higher yield.</p>
        </div>
        <div className={p.planCard}>
          <div className={p.planHead}>
            <span className={p.planTitleGroup}>
              <span className={p.crown}>
                <img src={img("pw-crown.webp")} alt="" />
              </span>
              <span>
                <span className={p.planName}>Annual Plan</span>
                <span className={p.bestValue}>BEST VALUE</span>
              </span>
            </span>
            <span className={p.price}>
              <b>
                ₹1<small> Trial</small>
              </b>
              <span>then ₹{PRICE}/yr</span>
            </span>
          </div>
          <div className={p.divider} />
          <div className={p.tlList}>
            {timeline.map((t, i) => (
              <div key={t.title} className={p.tlItem}>
                <span className={p.tlMarker}>
                  {t.marker === "check" ? <img src={img("pw-tl-check.webp")} alt="" /> : <span className={p.hollow} />}
                  {i < timeline.length - 1 && <span className={p.dash} />}
                </span>
                <span className={`${p.tlCard} ${t.active ? p.tlCardActive : ""}`}>
                  <span className={p.tlIcon} style={{ background: t.bg }}>
                    <img src={img(t.icon)} alt="" />
                  </span>
                  <span>
                    <b>{t.title}</b>
                    <span>{t.sub}</span>
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={p.bottom}>
        <p className={p.legal}>
          By continuing, you agree to our <u>Terms</u>
          <br />
          and <u>Privacy Policy</u>
        </p>
        <button
          type="button"
          className={`${ui.btnReset} ${p.cta} ${ui.hotspot}`}
          onClick={() => {
            setCount(5);
            setModal(true);
          }}
        >
          Start My ₹1 Trial
        </button>
        <span className={p.secure}>
          <Lock size={11} /> Secure payment · Cancel anytime
        </span>
      </div>
      {modal && (
        <div className={p.modalOverlay} role="dialog" aria-label="Confirm trial">
          <div className={p.modal}>
            <span className={p.modalIcon}>
              <Info size={36} />
            </span>
            <p className={p.modalTitle}>Only ₹1 charged now</p>
            <p className={p.modalMsg}>
              The checkout page will show ₹{PRICE}, but you will only be charged ₹1 now for {TRIAL_DAYS} days.
            </p>
            <button
              type="button"
              className={`${ui.btnReset} ${p.modalBtn}`}
              onClick={next}
              style={{ opacity: count > 0 ? 0.85 : 1 }}
            >
              {count > 0 ? `Proceed (${count}s)` : "Proceed"}
            </button>
            <button type="button" className={`${ui.btnReset} ${p.modalCancel}`} onClick={() => setModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Payment status (PaymentStatusScreen2.jsx, trial success) ----------

function TrialActive({ goToFlow }: ScreenProps) {
  return (
    <div className={p.screen}>
      <div className={p.successTop}>
        <button type="button" className={`${ui.btnReset} ${p.navBtn}`} onClick={() => goToFlow("home-weather")} aria-label="Close">
          <X size={18} />
        </button>
      </div>
      <div className={p.successBody}>
        <div className={p.successHero}>
          <span className={p.successCheck}>
            <span>
              <Check size={40} strokeWidth={3} />
            </span>
          </span>
          <p className={p.successTitle}>Your trial is now active</p>
          <p className={p.successSub}>You’re in. Here’s exactly what happens next.</p>
        </div>
        <div className={p.details}>
          <div className={p.detailRow}>
            Charged today <b>₹1</b>
          </div>
          <div className={p.detailRow}>
            Renews on Day {TRIAL_DAYS + 1} <b>₹{PRICE}/yr</b>
          </div>
        </div>
        <p className={p.reminder}>We’ll remind you on Day {TRIAL_DAYS - 1}</p>
      </div>
      <div className={p.bottom}>
        <button type="button" className={`${ui.btnReset} ${p.cta} ${ui.hotspot}`} onClick={() => goToFlow("home-weather")}>
          Go to Home
        </button>
        <span className={p.secureGrey}>
          <ShieldCheck size={14} /> Secure payments. Cancel anytime.
        </span>
      </div>
    </div>
  );
}

export const subscriptionScreens: Record<string, ComponentType<ScreenProps>> = {
  "pw-intro": Intro,
  "pw-features": Features,
  "pw-plan": Plan,
  "pw-success": TrialActive,
};
