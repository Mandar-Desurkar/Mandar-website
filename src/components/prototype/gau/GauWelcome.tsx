/* eslint-disable @next/next/no-img-element -- fixed-size mock screens inside a phone frame */
"use client";

// Gau Sampurna first run, recreated from the `prod` branch: splash/splash-screen.jsx (→ language on first
// launch, else login), account/language-screen.jsx, registration/login-screen-2.jsx (+91 number, 4-digit
// code), otp-screen-2.jsx, register-screen.jsx (name + optional email) and onboarding/onboarding-screen.jsx
// (4 slides with feature chips, then Home).
import { useEffect, useRef, useState, type ComponentType } from "react";
import { ArrowLeft } from "lucide-react";
import w from "./gauWelcome.module.css";
import { gimg, u } from "./GauShared";
import { LanguageList } from "./GauAccount";
import type { ScreenProps } from "../kissan/KissanScreens";

const ICON = "/apps/gau-sampurna-icon.png";

function Splash({ next }: ScreenProps) {
  useEffect(() => {
    const t = setTimeout(next, 2200);
    return () => clearTimeout(t);
  }, [next]);
  return (
    <button type="button" className={`${u.btnReset} ${w.splash}`} onClick={next} aria-label="Continue">
      <img src={ICON} alt="" className={w.splashLogo} />
      <span className={w.splashText}>
        <b>GAU SWASTHA</b>
        <i />
        <small>DAIRY HEALTH, IN YOUR POCKET</small>
      </span>
      <span className={w.splashFooter}>by Gau Sampurna · Silo Fortune</span>
    </button>
  );
}

function Language({ next }: ScreenProps) {
  return <LanguageList onContinue={next} />;
}

function Login({ next }: ScreenProps) {
  const [phone, setPhone] = useState("98765 43210");
  const [sending, setSending] = useState(false);
  const digits = phone.replace(/\D/g, "");
  const ok = digits.length === 10;
  return (
    <div className={u.screen}>
      <div className={w.content}>
        <img src={ICON} alt="Gau Sampurna" className={w.logo} />
        <b className={w.title}>What&apos;s your number?</b>
        <p className={w.subtitle}>We&apos;ll send a 4-digit code to verify it&apos;s you.</p>
        <label className={w.phoneBox}>
          <span>+91</span>
          <i />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d ]/g, "").slice(0, 11))}
            placeholder="Enter mobile number"
            inputMode="tel"
            aria-label="Mobile number"
          />
        </label>
        <small className={w.notice}>{digits.length > 10 ? "Enter only the 10-digit number — we add +91 for you." : ""}</small>
        <button
          type="button"
          className={`${u.btnReset} ${w.cta} ${ok ? u.hotspot : w.ctaOff}`}
          disabled={!ok || sending}
          onClick={() => {
            setSending(true);
            setTimeout(next, 700);
          }}
        >
          {sending ? "Sending..." : "Verify now"}
        </button>
        <small className={w.footer}>Used only to send scan results, vet calls, and delivery updates. Never shared with anyone.</small>
      </div>
    </div>
  );
}

function Otp({ next, back }: ScreenProps) {
  const [code, setCode] = useState(["", "", "", ""]);
  const [seconds, setSeconds] = useState(30);
  const [verifying, setVerifying] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);
  const full = code.every(Boolean);
  const set = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    setCode((c) => c.map((x, k) => (k === i ? d : x)));
    if (d && i < 3) refs.current[i + 1]?.focus();
  };
  return (
    <div className={u.screen}>
      <div className={w.topBar}>
        <button type="button" className={`${u.btnReset} ${w.back}`} onClick={back} aria-label="Back">
          <ArrowLeft size={22} />
        </button>
      </div>
      <div className={w.content}>
        <b className={w.title}>Enter the code</b>
        <p className={w.subtitle}>
          Sent to <b>+91 98765 43210</b>{" "}
          <button type="button" className={`${u.btnReset} ${w.link}`} onClick={back}>
            Change
          </button>
        </p>
        <div className={w.otpRow}>
          {code.map((c, i) => (
            <input
              key={i}
              ref={(el) => void (refs.current[i] = el)}
              value={c}
              onChange={(e) => set(i, e.target.value)}
              onKeyDown={(e) => e.key === "Backspace" && !c && i > 0 && refs.current[i - 1]?.focus()}
              inputMode="numeric"
              aria-label={`Digit ${i + 1}`}
              className={c ? w.otpFilled : undefined}
            />
          ))}
        </div>
        <button type="button" className={`${u.btnReset} ${w.autofill}`} onClick={() => setCode(["4", "8", "2", "6"])}>
          Autofill demo code
        </button>
        <button
          type="button"
          className={`${u.btnReset} ${w.cta} ${full ? u.hotspot : w.ctaOff}`}
          disabled={!full || verifying}
          onClick={() => {
            setVerifying(true);
            setTimeout(next, 700);
          }}
        >
          {verifying ? "Verifying..." : "Verify"}
        </button>
        <span className={w.resend}>
          {seconds > 0 ? (
            <>Resend in 0:{String(seconds).padStart(2, "0")}</>
          ) : (
            <button type="button" className={`${u.btnReset} ${w.link}`} onClick={() => setSeconds(30)}>
              Resend code
            </button>
          )}
        </span>
      </div>
    </div>
  );
}

function Register({ next }: ScreenProps) {
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const valid = /^[A-Za-z ]{2,}$/.test(name.trim());
  return (
    <div className={u.screen}>
      <div className={w.content}>
        <img src={ICON} alt="" className={w.logoSmall} />
        <b className={w.title}>Create your account</b>
        <p className={w.subtitle}>Just your name to get started.</p>
        <label className={w.field}>
          Your name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ravi Kumar" />
          {name && !valid && <small className={w.error}>Name can only contain letters</small>}
        </label>
        <label className={w.field}>
          Email Address (Optional)
          <input placeholder="name@email.com" type="email" />
        </label>
        <button
          type="button"
          className={`${u.btnReset} ${w.cta} ${valid ? u.hotspot : w.ctaOff}`}
          disabled={!valid || creating}
          onClick={() => {
            setCreating(true);
            setTimeout(next, 700);
          }}
        >
          {creating ? "Creating account..." : "Create account"}
        </button>
      </div>
      <small className={w.terms}>By continuing, you agree to our Terms of Service and Privacy Policy.</small>
    </div>
  );
}

const SLIDES = [
  { title: "Is your cow truly healthy?", sub: "Detect diseases early with AI-powered health analysis.", ticks: ["AI Health Check", "Early Detection", "Instant Analysis"] },
  { title: "Boost Milk Yield", sub: "Get AI-powered feeding plans to maximize your daily milk production and income.", ticks: ["Higher Milk Yield", "Smart Feeding", "Better Income"] },
  { title: "Buy and sell at the right price", sub: "Estimate your cow's market value instantly.", ticks: ["AI Valuation", "Fair Pricing", "Smart Decisions"] },
  { title: "Keep track of every cow", sub: "Manage your cow's health records all in one place.", ticks: ["Smart Diagnosis", "Health Monitoring", "Quick Results"] },
];

function Onboarding({ goToFlow }: ScreenProps) {
  const [i, setI] = useState(0);
  const last = i === SLIDES.length - 1;
  const s = SLIDES[i];
  return (
    <div className={u.screen}>
      <div className={w.skipRow}>
        {!last && (
          <button type="button" className={`${u.btnReset} ${w.skip}`} onClick={() => goToFlow("gs-home")}>
            Skip
          </button>
        )}
      </div>
      <div className={w.slide} key={i}>
        <img src={gimg(`onboarding-${i + 1}.webp`)} alt="" />
        <b className={w.title} style={{ textAlign: "center" }}>
          {s.title}
        </b>
        <p className={w.subtitle} style={{ textAlign: "center" }}>
          {s.sub}
        </p>
        <div className={w.chips}>
          {s.ticks.map((t) => (
            <span key={t}>✓ {t}</span>
          ))}
        </div>
      </div>
      <div className={w.obFooter}>
        <span className={w.dots}>
          {SLIDES.map((_, k) => (
            <button key={k} type="button" className={`${u.btnReset} ${k === i ? w.dotOn : ""}`} onClick={() => setI(k)} aria-label={`Slide ${k + 1}`} />
          ))}
        </span>
        <button type="button" className={`${u.btnReset} ${w.cta} ${u.hotspot}`} onClick={() => (last ? goToFlow("gs-home") : setI(i + 1))}>
          {last ? "Get started" : "Next"}
        </button>
      </div>
    </div>
  );
}

export const gauWelcomeScreens: Record<string, ComponentType<ScreenProps>> = {
  "gs-splash": Splash,
  "gs-language-first": Language,
  "gs-login": Login,
  "gs-otp": Otp,
  "gs-register": Register,
  "gs-onboarding": Onboarding,
};
