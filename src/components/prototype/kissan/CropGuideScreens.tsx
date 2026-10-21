/* eslint-disable @next/next/no-img-element -- fixed-size mock screens inside a phone frame */
"use client";

// Crop Guide screens, recreated from the `dev` branch (code/screens/crop-guide/*):
// planting-season, irrigation, crop-budget question screens and crop-guide-report + report-sections.
// Option values and copy come from the code; report numbers are illustrative sample values.
import { useState, type ComponentType } from "react";
import base from "./kissan.module.css";
import s from "./kissanFlows.module.css";
import type { ScreenProps } from "./KissanScreens";

const img = (file: string) => `/prototypes/kissan-sampurna/${file}`;

// ---------- Shared: TopBarNew + PrimaryButton (pill) ----------

export function TopBarNew({ title, menu = false }: { title: string; menu?: boolean }) {
  return (
    <div className={s.topBarNew}>
      <span className={s.backCircle} aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path d="M15 5l-7 7 7 7" fill="none" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className={s.topBarNewTitle}>{title}</span>
      <span className={s.topBarSpacer} aria-hidden="true">
        {menu ? "⋮" : ""}
      </span>
    </div>
  );
}

function PillButton({
  label,
  onClick,
  disabled,
  hint,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  hint?: boolean;
}) {
  return (
    <button
      type="button"
      className={`${s.pillBtn} ${hint ? base.hotspot : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

function QuestionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className={s.heading}>
      <p className={s.qTitle}>{title}</p>
      <p className={s.qSubtitle}>{subtitle}</p>
    </div>
  );
}

// ---------- 1. Planting season (planting-season-screen.jsx) ----------

const SEASONS = [
  { value: "Kharif", image: "cg-season-kharif.webp" },
  { value: "Rabi", image: "cg-season-rabi.webp" },
  { value: "Summer", image: "cg-season-summer.webp" },
  { value: "Annual", image: "cg-season-long-term.webp" },
];

function Season({ next }: ScreenProps) {
  const [season, setSeason] = useState<string | null>(null);
  return (
    <div className={base.screen}>
      <TopBarNew title="Crop Guide" />
      <div className={`${base.scroll} ${s.qBody}`}>
        <QuestionHeading
          title="Which season are you planting for?"
          subtitle="Choose one season to tailor crop and timing recommendations."
        />
        <div className={s.grid2}>
          {SEASONS.map((opt) => {
            const selected = season === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={selected}
                className={`${s.seasonCard} ${selected ? s.cardSelectedBlue : ""} ${
                  !season && opt.value === "Rabi" ? base.hotspot : ""
                }`}
                onClick={() => setSeason(opt.value)}
              >
                <img className={s.seasonImg} src={img(opt.image)} alt="" />
                <span className={s.seasonLabel}>{opt.value}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className={s.footer}>
        <PillButton label="Continue" onClick={next} disabled={!season} hint={!!season} />
      </div>
    </div>
  );
}

// ---------- 2. Irrigation (irrigation-screen.jsx, multi-select) ----------

const METHODS = [
  { value: "Rainfed", image: "cg-water-rainfed.webp" },
  { value: "Flood", image: "cg-water-canal.webp" },
  { value: "Drip", image: "cg-water-drip.webp" },
  { value: "Sprinkler", image: "cg-water-borewell.webp" },
];

function Irrigation({ next }: ScreenProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (v: string) =>
    setSelected((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));
  return (
    <div className={base.screen}>
      <TopBarNew title="Crop Guide" />
      <div className={`${base.scroll} ${s.qBody}`}>
        <QuestionHeading title="How do you water your crops?" subtitle="Select all the methods you use." />
        <div className={s.grid2}>
          {METHODS.map((m) => {
            const checked = selected.includes(m.value);
            return (
              <button
                key={m.value}
                type="button"
                role="checkbox"
                aria-checked={checked}
                className={`${s.methodCard} ${!selected.length && m.value === "Drip" ? base.hotspot : ""}`}
                onClick={() => toggle(m.value)}
              >
                <img className={s.methodImg} src={img(m.image)} alt="" />
                <span className={s.methodRow}>
                  <span className={s.methodLabel}>{m.value}</span>
                  {checked ? <span className={s.checkboxOn}>✓</span> : <span className={s.checkbox} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className={s.footer}>
        <PillButton label="Continue" onClick={next} disabled={!selected.length} hint={selected.length > 0} />
      </div>
    </div>
  );
}

// ---------- 3. Budget (crop-budget-screen.jsx) ----------

// The API's per-acre bands: <₹10k, ₹10–25k, ₹25–50k, >₹50k
const BUDGETS = [
  { label: "Under ₹10k", hint: "Best for small plots and standard inputs.", image: "cg-budget-1.webp" },
  { label: "₹10k – 25k", hint: "Balanced for quality inputs and protection.", image: "cg-budget-2.webp" },
  { label: "₹25k – 50k", hint: "Ideal for larger plots and premium care.", image: "cg-budget-3.webp" },
  { label: "Above ₹50k", hint: "Best for large-scale commercial planning.", image: "cg-budget-4.webp" },
];

function Budget({ next }: ScreenProps) {
  const [budget, setBudget] = useState<string | null>(null);
  return (
    <div className={base.screen}>
      <TopBarNew title="Crop Guide" />
      <div className={`${base.scroll} ${s.qBody}`}>
        <QuestionHeading
          title="Set your farming budget"
          subtitle="How much can you spend per acre next season? This helps us tailor seed, fertilizer, labor, and protection advice."
        />
        <div className={s.grid2}>
          {BUDGETS.map((b, i) => {
            const selected = budget === b.label;
            return (
              <button
                key={b.label}
                type="button"
                aria-pressed={selected}
                className={`${s.budgetCard} ${selected ? s.cardSelectedBlue : ""} ${
                  !budget && i === 1 ? base.hotspot : ""
                }`}
                onClick={() => setBudget(b.label)}
              >
                <img className={s.budgetImg} src={img(b.image)} alt="" />
                <span className={s.budgetText}>
                  <span className={s.budgetLabel}>{b.label}</span>
                  <span className={s.budgetHint}>{b.hint}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className={s.footer}>
        <PillButton label="See Crop Recommendations" onClick={next} disabled={!budget} hint={!!budget} />
      </div>
    </div>
  );
}

// ---------- 4. Report (crop-guide-report-screen.jsx + components/report-sections.jsx) ----------

const FIT = [
  { label: "Soil Match", value: "Excellent", icon: "▦", color: "#2E7D32", bg: "#DCEFE3" },
  { label: "Water Fit", value: "Good", icon: "💧", color: "#2563EB", bg: "#DBEAFE" },
  { label: "Season Fit", value: "Perfect", icon: "☀", color: "#D97706", bg: "#FEF3C7" },
  { label: "Budget Fit", value: "Good", icon: "₹", color: "#9333EA", bg: "#F3E8FF" },
];

// Top 5 for a Rabi, drip-irrigated, ₹10–25k/acre farm (illustrative)
const COMPARE = [
  { name: "Wheat", season: "Rabi", match: 94, current: true },
  { name: "Mustard", season: "Rabi", match: 88 },
  { name: "Chickpea", season: "Rabi", match: 84 },
  { name: "Barley", season: "Rabi", match: 79 },
  { name: "Potato", season: "Rabi", match: 72 },
];

function Report({ goToFlow }: ScreenProps) {
  return (
    <div className={base.screen}>
      <TopBarNew title="Crop Guide Report" />
      <div className={`${base.scroll} ${s.reportBody}`}>
        <div className={s.cgHero}>
          <img src={img("cg-report-hero.webp")} alt="" />
          <div className={s.cgHeroShade}>
            <span className={s.topPickBadge}>☆ TOP PICK FOR YOU</span>
            <p className={s.heroCrop}>Wheat</p>
            <span className={s.matchPill}>🍃 94% Match</span>
            <span className={s.sowRow}>
              📅 Best sowing window: <b>Nov 1 – Nov 25</b>
            </span>
          </div>
        </div>

        <div className={s.card}>
          <div className={s.rowBetween}>
            <p className={s.cardTitle}>Why we recommend Wheat</p>
            <span className={s.passed}>✓ 5/5 Passed</span>
          </div>
          <div className={s.fitGrid}>
            {FIT.map((f) => (
              <div key={f.label} className={s.fitCell}>
                <span className={s.fitIcon} style={{ background: f.bg, color: f.color }}>
                  {f.icon}
                </span>
                <span>
                  <span className={s.fitLabel}>{f.label}</span>
                  <span className={s.fitValue}>{f.value}</span>
                </span>
              </div>
            ))}
          </div>
          <div className={s.profit}>
            <span className={s.fitIcon} style={{ background: "#FDEBD6", color: "#D97706" }}>
              ↗
            </span>
            <span className={s.profitText}>
              <span className={s.fitLabel}>Profit Potential</span>
              <span className={s.profitValue}>Strong local mandi demand</span>
            </span>
            <span className={s.amberPill}>Moderate</span>
          </div>
        </div>

        <div className={s.card}>
          <p className={s.readyTitle}>Ready to grow Wheat this season?</p>
          <p className={s.cardBody}>Track Wheat on &ldquo;East Plot&rdquo; with Farm Monitoring.</p>
          <button type="button" className={`${s.pillBtn} ${base.hotspot}`} onClick={() => goToFlow("farm-monitoring")}>
            ◎ Go to my farm
          </button>
        </div>

        <div className={s.card}>
          <div>
            <p className={s.cardTitle}>How it compares with other options</p>
            <p className={s.caption}>Compare progress, seasonality, and harvest readiness.</p>
          </div>
          {COMPARE.map((c) => {
            const color = c.match >= 80 ? "#059669" : "#D97706";
            return (
              <div key={c.name} className={`${s.compareRow} ${c.current ? s.compareCurrent : ""}`}>
                <span className={s.compareIcon} style={{ background: c.match >= 80 ? "#D1FAE5" : "#FEF3C7", color }}>
                  🌾
                </span>
                <span className={s.compareBody}>
                  <span className={s.compareHead}>
                    <span className={s.compareName}>{c.name}</span>
                    <span className={s.seasonPill}>{c.season}</span>
                    <span className={s.flex} />
                    {c.current ? (
                      <span className={s.viewingPill}>Viewing now</span>
                    ) : (
                      <span className={s.matchScorePill} style={{ background: c.match >= 80 ? "#10B981" : "#F59E0B" }}>
                        {c.match}%
                      </span>
                    )}
                  </span>
                  <span className={s.progressRow}>
                    <span className={s.track}>
                      <span className={s.fill} style={{ width: `${c.match}%`, background: color }} />
                    </span>
                    <span className={s.progressText}>{c.match}%</span>
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const cropGuideScreens: Record<string, ComponentType<ScreenProps>> = {
  "cg-season": Season,
  "cg-irrigation": Irrigation,
  "cg-budget": Budget,
  "cg-report": Report,
};
