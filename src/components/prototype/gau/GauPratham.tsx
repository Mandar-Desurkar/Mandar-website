/* eslint-disable @next/next/no-img-element -- fixed-size mock screens inside a phone frame */
"use client";

// Gau Sampurna "Pratham" paywall, recreated from the `prod` branch: screens/subscription/paywall/
// paywall-flow-screen.jsx (3 steps: intro → features → checkout, with StepDots, TestimonialVideo,
// TrustCarousel, PlanTimeline, TermsLine, SecurePill) in its trial / expired / failed checkout states,
// and subscription-success-screen.jsx. Pricing follows the designs (₹1 trial, then ₹399/yr).
import { useEffect, useState, type ComponentType } from "react";
import { ArrowLeft, Check, CircleAlert, Lock, Star, Volume2, VolumeX, X } from "lucide-react";
import p from "./gauPratham.module.css";
import { gimg, u } from "./GauShared";
import type { ScreenProps } from "../kissan/KissanScreens";

type Checkout = "trial" | "expired" | "failed";
const TRIAL_DAYS = 7;
const PRICE = 399;

function StepDots({ step, onDark }: { step: number; onDark?: boolean }) {
  return (
    <span className={p.dots} aria-label={`Step ${step} of 3`}>
      {[1, 2, 3].map((i) => (
        <i key={i} className={i <= step ? p.dotOn : ""} style={i > step && onDark ? { background: "rgba(0,70,145,0.25)" } : undefined} />
      ))}
    </span>
  );
}

function SecurePill({ label, onImage }: { label: string; onImage?: boolean }) {
  return (
    <span className={`${p.secure} ${onImage ? p.securePill : ""}`}>
      <Lock size={12} /> {label}
    </span>
  );
}

// ---------- TrustCarousel ----------

const SLIDES = [
  { kind: "farmers", title: "1,00,000+ trusted dairy farmers across India" },
  { kind: "portrait", image: "pw-avatar-vet.webp", title: "Built with veterinary experts, not guesswork" },
  { kind: "portrait", image: "pw-avatar-farmer.webp", title: "“I check my cow in the app before I call the vet.”", by: "-Ramana Gowda" },
  { kind: "logo", image: "pw-amruth-logo.webp", title: "Supplements made by Gau Sampurna" },
  { kind: "lang", image: "pw-icon-language.webp", title: "Simple cattle care support in your language." },
] as const;

function TrustCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 3600);
    return () => clearInterval(t);
  }, [i]);
  const sl = SLIDES[i];
  return (
    <div>
      <div className={p.trustCard} key={i}>
        {sl.kind === "farmers" ? (
          <span className={p.stack}>
            {["pw-avatar-1.webp", "pw-avatar-2.webp", "pw-avatar-3.webp"].map((a) => (
              <img key={a} src={gimg(a)} alt="" />
            ))}
          </span>
        ) : (
          <img src={gimg(sl.image)} alt="" className={sl.kind === "portrait" ? p.portrait : p.logo} />
        )}
        <span className={p.slideBody}>
          <b>{sl.title}</b>
          {sl.kind === "farmers" && (
            <span className={p.stars}>
              {Array.from({ length: 5 }, (_, k) => (
                <Star key={k} size={13} fill="#FFAA00" color="#FFAA00" />
              ))}
              <small>4.0 rating</small>
            </span>
          )}
          {sl.kind === "portrait" && "by" in sl && <small>{sl.by}</small>}
        </span>
      </div>
      <span className={p.carouselDots}>
        {SLIDES.map((_, k) => (
          <button key={k} type="button" className={`${u.btnReset} ${k === i ? p.cDotOn : ""}`} onClick={() => setI(k)} aria-label={`Slide ${k + 1}`} />
        ))}
      </span>
    </div>
  );
}

// ---------- Steps ----------

function Intro() {
  const [muted, setMuted] = useState(false);
  return (
    <div className={p.stepWrap}>
      <div className={p.video}>
        <img src={gimg("pw-testimonial-poster.webp")} alt="Farmer testimonial video" />
        <span className={p.duration}>0:42</span>
        <button type="button" className={`${u.btnReset} ${p.mute}`} onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute" : "Mute"}>
          {muted ? <VolumeX size={18} color="#fff" /> : <Volume2 size={18} color="#fff" />}
        </button>
      </div>
      <h3 className={p.headline} style={{ marginTop: 24 }}>
        Care for your cattle with confidence, not guesswork.
      </h3>
      <p className={p.sub}>Know your cattle&apos;s health, milk and value before they surprise you.</p>
      <div style={{ marginTop: 28 }}>
        <TrustCarousel />
      </div>
    </div>
  );
}

const FEATURES = [
  ["pw-feat-full-health.webp", "Full Health Scan", "Every check in one report. 31 diseases covered."],
  ["pw-feat-disease.webp", "Disease Diagnosis", "Spot LSD, mastitis and lameness early."],
  ["pw-feat-dung.webp", "Cow Dung Scan", "Know how well she digests her feed."],
  ["pw-feat-market.webp", "Market Value", "Understand her value and milk production."],
  ["pw-feat-status.webp", "Animal Status", "Know how fit she is and her breed purity."],
];

function Features() {
  return (
    <div className={p.stepWrap}>
      <h3 className={p.headline} style={{ marginTop: 18 }}>
        Everything you need, in one app
      </h3>
      <p className={p.sub}>Check your cattle&apos;s health, feed, milk and value anytime.</p>
      <div className={p.featList}>
        {FEATURES.map(([img, title, sub]) => (
          <div key={title} className={p.featRow}>
            <img src={gimg(img)} alt="" />
            <span>
              <b>{title}</b>
              <small>{sub}</small>
            </span>
          </div>
        ))}
      </div>
      <p className={p.footnote}>36 reports a year once your plan begins, share them across any of these tools.</p>
    </div>
  );
}

const TIMELINE = [
  { icon: "pw-icon-today.webp", title: "Today", sub: `₹1 for ${TRIAL_DAYS} days` },
  { icon: "pw-icon-remind.webp", title: `Day ${TRIAL_DAYS - 1}`, sub: "We remind you." },
  { icon: "pw-icon-begins.webp", title: `Day ${TRIAL_DAYS + 1}`, sub: "Annual plan begins." },
];

function PlanCard({ state }: { state: Checkout }) {
  const hero = state !== "failed";
  const trial = state !== "expired";
  return (
    <div className={`${p.planCard} ${hero ? "" : p.planPlain}`}>
      {state === "expired" && (
        <>
          <b className={p.expiredTitle}>Your annual plan has expired.</b>
          <span className={p.divider} />
        </>
      )}
      <div className={p.planRow}>
        <span className={p.planId}>
          {hero ? (
            <span className={p.crownTile}>
              <img src={gimg("pw-icon-crown.webp")} alt="" />
            </span>
          ) : (
            <span className={p.radioTile}>
              <i>
                <i />
              </i>
            </span>
          )}
          <span className={p.planName}>
            <b>Annual Plan</b>
            {state === "trial" && <span className={p.badge}>BEST VALUE</span>}
          </span>
        </span>
        <span className={p.price}>
          <span>
            <b>{trial ? "₹1" : `₹${PRICE}`}</b>
            {trial && <small>Trial</small>}
          </span>
          <small>{trial ? `then ₹${PRICE}/yr` : "per year"}</small>
        </span>
      </div>
      {trial && (
        <>
          <span className={p.divider} />
          {TIMELINE.map((s, i) => (
            <div key={s.title} className={p.tlRow}>
              <span className={p.rail}>
                {i === 0 ? (
                  hero ? (
                    <i className={p.tick}>
                      <Check size={13} color="#fff" />
                    </i>
                  ) : (
                    <i className={p.dotFilled} />
                  )
                ) : (
                  <i className={hero ? p.ring : p.ringSmall} />
                )}
                {i < TIMELINE.length - 1 && <i className={p.connector} />}
              </span>
              <span className={`${p.tlBody} ${hero ? p.tlCard : ""}`}>
                {hero && (
                  <span className={p.tlIcon}>
                    <img src={gimg(s.icon)} alt="" />
                  </span>
                )}
                <span>
                  <b>{s.title}</b>
                  <small>{s.sub}</small>
                </span>
              </span>
            </div>
          ))}
        </>
      )}
      {state === "expired" && (
        <>
          <span className={p.divider} />
          <small className={p.cancelInline}>Cancel anytime before your renewal date. You won&apos;t be charged for the next billing cycle.</small>
        </>
      )}
    </div>
  );
}

function Paywall({ step, state = "trial", next, back, go, goToFlow }: ScreenProps & { step: 1 | 2 | 3; state?: Checkout }) {
  const hero = step === 3 && state !== "failed";
  const [busy, setBusy] = useState(false);
  const cta =
    step === 1 ? "See What's Included" : step === 2 ? "See Your Plan" : state === "failed" ? "Retry Payment" : state === "trial" ? "Start My ₹1 Trial" : `Subscribe for ₹${PRICE}`;
  const onCta = () => {
    if (step < 3) return next();
    setBusy(true);
    setTimeout(() => go(state === "expired" ? "gs-pw-success-annual" : "gs-pw-success"), 900);
  };
  return (
    <div className={`${u.screen} ${p.screen} ${hero ? p.onHero : ""}`}>
      {hero && (
        <div className={p.heroArt} aria-hidden="true">
          <img src={gimg("pw-checkout-bg.webp")} alt="" className={p.heroBg} />
          <img src={gimg("pw-checkout-photo.webp")} alt="" className={p.heroPhoto} />
        </div>
      )}
      <div className={p.header}>
        {step > 1 ? (
          <button type="button" className={`${u.btnReset} ${p.iconBtn}`} onClick={back} aria-label="Back">
            <ArrowLeft size={20} />
          </button>
        ) : (
          <span className={p.iconSpacer} />
        )}
        <StepDots step={step} onDark={hero} />
        <button type="button" className={`${u.btnReset} ${p.iconBtn}`} onClick={() => goToFlow("gs-home")} aria-label="Close">
          <X size={20} />
        </button>
      </div>
      <div className={`${u.scroll} ${p.body}`}>
        {step === 1 && <Intro />}
        {step === 2 && <Features />}
        {step === 3 && hero && (
          <div className={p.heroScroll}>
            <span className={p.kicker}>Let&apos;s get Started</span>
            <b className={p.heroTitle}>
              HEALTHIER CATTLE,
              <br />
              HIGHER MILK
            </b>
            <PlanCard state={state} />
          </div>
        )}
        {step === 3 && !hero && (
          <div className={p.plainScroll}>
            <b className={p.plainTitle}>Your plan</b>
            <div className={p.errorBanner}>
              <CircleAlert size={18} color="#C0392B" />
              Payment didn&apos;t go through. Please try again.
            </div>
            <PlanCard state={state} />
            <small className={p.cancelNote}>Cancel anytime before Day {TRIAL_DAYS + 1} in Account, Subscription. You will not be charged.</small>
          </div>
        )}
      </div>
      <div className={p.footer}>
        {step === 3 && (
          <p className={p.terms}>
            By continuing, you agree to our <b>Terms</b> and <b>Privacy Policy</b>
          </p>
        )}
        <button type="button" className={`${u.btnReset} ${p.cta} ${u.hotspot}`} onClick={onCta} disabled={busy}>
          {busy ? <span className={p.spinner} aria-label="Processing" /> : cta}
        </button>
        {step === 3 && <SecurePill onImage={hero} label={state === "failed" ? "Secure Payments. Cancel anytime." : "Secure payment · Cancel anytime"} />}
      </div>
    </div>
  );
}

function Success({ goToFlow, annual }: ScreenProps & { annual?: boolean }) {
  const rows = annual
    ? [
        ["Charged today", `₹${PRICE}`],
        ["Renews on", "21 Oct 2027"],
      ]
    : [
        ["Charged today", "₹1"],
        [`Renews on Day ${TRIAL_DAYS + 1}`, `₹${PRICE}/yr`],
      ];
  return (
    <div className={`${u.screen} ${p.screen}`}>
      <div className={p.successHead}>
        <button type="button" className={`${u.btnReset} ${p.iconBtn}`} onClick={() => goToFlow("gs-home")} aria-label="Close">
          <X size={20} />
        </button>
      </div>
      <div className={p.successCenter}>
        <b className={p.successTitle}>{annual ? "Your annual plan is active now" : "Your trial is now active"}</b>
        <p className={p.sub}>You&apos;re in. Here&apos;s exactly what happens next.</p>
        <div className={p.successCard}>
          {rows.map(([label, value], i) => (
            <div key={label}>
              {i > 0 && <span className={p.divider} />}
              <span className={p.successRow}>
                <span>{label}</span>
                <b>{value}</b>
              </span>
            </div>
          ))}
        </div>
        {!annual && <small className={p.reminder}>We&apos;ll remind you on Day {TRIAL_DAYS - 1}</small>}
      </div>
      <div className={p.footer}>
        <button type="button" className={`${u.btnReset} ${p.cta} ${u.hotspot}`} onClick={() => goToFlow("gs-home")}>
          Go to Home
        </button>
        <SecurePill label="Secure payment · Cancel anytime" />
      </div>
    </div>
  );
}

export const gauPrathamScreens: Record<string, ComponentType<ScreenProps>> = {
  "gs-pratham": (props) => <Paywall {...props} step={1} />,
  "gs-pw-features": (props) => <Paywall {...props} step={2} />,
  "gs-pw-checkout": (props) => <Paywall {...props} step={3} state="trial" />,
  "gs-pw-success": Success,
  "gs-pw-failed": (props) => <Paywall {...props} step={3} state="failed" />,
  "gs-pw-expired": (props) => <Paywall {...props} step={3} state="expired" />,
  "gs-pw-success-annual": (props) => <Success {...props} annual />,
};
