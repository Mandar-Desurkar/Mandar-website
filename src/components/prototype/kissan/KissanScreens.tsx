/* eslint-disable @next/next/no-img-element -- fixed-size mock screens inside a phone frame */
"use client";

// Kissan Sampurna screens, recreated for the web from the React Native source
// (code/screens/crop-disease/*): same colours, type sizes, layout and English copy.
import { useEffect, useState, type ComponentType } from "react";
import s from "./kissan.module.css";

// next: advance within the flow; restart: back to the flow's first screen;
// goToFlow: jump into another flow, as the real app links features together.
export type ScreenProps = {
  next: () => void;
  restart: () => void;
  goToFlow: (flowId: string, screenId?: string) => void;
};

const img = (file: string) => `/prototypes/kissan-sampurna/${file}`;

// ---------- Shared pieces ----------

const BackIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M15 5l-7 7 7 7" fill="none" stroke="#1F2937" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = ({ color = "#fff" }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 5l7 7-7 7" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function TopBar({ title, info = true }: { title: string; info?: boolean }) {
  return (
    <div className={s.topBar}>
      <span className={s.backBtn}>
        <BackIcon />
      </span>
      <span className={s.topTitle}>{title}</span>
      {info && <span className={s.infoBtn}>i</span>}
    </div>
  );
}

// ---------- 1. Crop Doctor (crop-disease-home.jsx) ----------

const HOW_IT_WORKS = [
  { image: "step-take-photo.webp", label: "Take photo" },
  { image: "step-get-report.webp", label: "Get Report" },
  { image: "step-take-action.webp", label: "Take action" },
];

function CropDoctor({ next }: ScreenProps) {
  return (
    <div className={s.screen}>
      <TopBar title="Crop Doctor" />
      <div className={s.scroll}>
        <div className={s.cdHero}>
          <img src={img("crop-check-hero.webp")} alt="" />
        </div>
        <div className={s.cdTitleBlock}>
          <p className={s.cdTitle}>Check your crop today</p>
          <p className={s.cdSubtitle}>Instantly diagnose diseases &amp; nutrient deficiencies</p>
        </div>
        <div className={s.howItWorks}>
          <p className={s.howTitle}>How it works</p>
          <div className={s.stepsRow}>
            {HOW_IT_WORKS.map((step) => (
              <div key={step.label} className={s.stepCol}>
                <div className={s.stepCard}>
                  <img src={img(step.image)} alt="" />
                </div>
                <p className={s.stepLabel}>{step.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={s.ctaPad}>
          <button type="button" className={`${s.primaryBtn} ${s.hotspot}`} onClick={next}>
            Start Crop Check <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- 2. Select crop (select-crops-screen.jsx) ----------

const POPULAR = [
  { name: "Rice", image: "crop-rice.webp" },
  { name: "Wheat", image: "crop-wheat.webp" },
  { name: "Maize", image: "crop-maize.webp" },
  { name: "Cotton", image: "crop-cotton.webp" },
];

const CATEGORIES = [
  { name: "Cereals", image: "cat-cereals.webp" },
  { name: "Vegetables", image: "cat-vegetables.webp" },
  { name: "Fruits", image: "cat-fruits.webp" },
  { name: "Pulses", image: "cat-pulses.webp" },
  { name: "Oilseeds", image: "cat-oilseeds.webp" },
  { name: "Spices", image: "cat-spices.webp" },
];

function SelectCrop({ next }: ScreenProps) {
  return (
    <div className={s.screen}>
      <TopBar title="Select Crop" info={false} />
      <div className={`${s.scroll} ${s.padded}`}>
        <p className={s.scSubtitle}>Choose a crop to check its health.</p>
        <div className={s.searchRow}>
          <div className={s.searchBar}>Search crops...</div>
          <span className={s.searchBtn} aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="6.5" fill="none" stroke="#fff" strokeWidth="2.2" />
              <path d="M16 16l4 4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </span>
        </div>

        <p className={s.sectionTitleBlack}>Popular Crops</p>
        <div className={s.popularRow}>
          {POPULAR.map((crop) =>
            crop.name === "Rice" ? (
              <button key={crop.name} type="button" className={`${s.popularCard} ${s.hotspot}`} onClick={next}>
                <img className={s.popularImg} src={img(crop.image)} alt="" />
                <span className={s.popularName}>{crop.name}</span>
                <span className={s.popularChip}>Popular</span>
              </button>
            ) : (
              <div key={crop.name} className={s.popularCard}>
                <img className={s.popularImg} src={img(crop.image)} alt="" />
                <span className={s.popularName}>{crop.name}</span>
                <span className={s.popularChip}>Popular</span>
              </div>
            )
          )}
        </div>

        <p className={s.sectionTitleBlack}>Browse by Category</p>
        <div className={s.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className={s.categoryCard}>
              <img className={s.categoryImg} src={img(cat.image)} alt="" />
              <span className={s.categoryLabel}>{cat.name}</span>
            </div>
          ))}
        </div>

        <div className={s.requestCard}>
          <div>
            <p className={s.requestTitle}>Can&apos;t find your crop?</p>
            <p className={s.requestSub}>Let us know and will add it for you.</p>
          </div>
          <span className={s.requestBtn}>Request Crop</span>
        </div>
      </div>
    </div>
  );
}

// ---------- 3. Scan method (scan-method-screen.jsx) ----------

function ScanMethod({ next }: ScreenProps) {
  const [option, setOption] = useState<"camera" | "gallery">("camera");
  const options = [
    { id: "camera" as const, label: "Take Photo", image: "option-take-photo.webp" },
    { id: "gallery" as const, label: "Upload Photo", image: "option-gallery.webp" },
  ];
  return (
    <div className={s.screen}>
      <TopBar title="Crop Diagnosis" />
      <div className={`${s.scroll} ${s.padded}`}>
        <div className={s.callout}>
          <p className={s.calloutTitle}>Clear Photo, Better diagnosis.</p>
          <p className={s.calloutDesc}>High-quality images help AI models detect issues faster and more accurately.</p>
        </div>

        <p className={s.sectionTitleBlue}>Choose an option</p>
        <div className={s.optionsRow} role="radiogroup" aria-label="Choose an option">
          {options.map((o) => {
            const selected = option === o.id;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`${s.optionCard} ${selected ? s.optionSelected : ""}`}
                onClick={() => setOption(o.id)}
              >
                <span className={s.optionHeader}>
                  <span className={s.optionLabel}>{o.label}</span>
                  <span className={`${s.radio} ${selected ? s.radioOn : ""}`} />
                </span>
                <img className={s.optionImg} src={img(o.image)} alt="" />
              </button>
            );
          })}
        </div>

        <p className={s.sectionTitleBlue}>How to take a good photo</p>
        <div className={s.guideCard}>
          {[
            { image: "guide-good.webp", ok: true },
            { image: "guide-bad-1.webp", ok: false },
            { image: "guide-bad-2.webp", ok: false },
          ].map((g) => (
            <div key={g.image} className={s.guideBox}>
              <img src={img(g.image)} alt="" />
              <span className={`${s.guideBadge} ${g.ok ? s.badgeOk : s.badgeBad}`}>{g.ok ? "✓" : "✕"}</span>
            </div>
          ))}
        </div>

        <button type="button" className={`${s.primaryBtn} ${s.hotspot}`} onClick={next}>
          Scan Now <ChevronRight />
        </button>
      </div>
    </div>
  );
}

// ---------- 4. Analyzing ----------

const ANALYZE_MS = 2600;

function Analyzing({ next }: ScreenProps) {
  // Auto-advance like the real app once the scan "completes"; tapping skips ahead.
  useEffect(() => {
    const timer = setTimeout(next, ANALYZE_MS);
    return () => clearTimeout(timer);
  }, [next]);

  return (
    <div className={s.screen}>
      <TopBar title="Crop Diagnosis" info={false} />
      <button type="button" className={s.analyzeBody} onClick={next} aria-label="Skip to report">
        <div className={s.scanFrame}>
          <img src={img("analysis.jpg")} alt="" />
          <span className={s.scanLine} />
        </div>
        <p className={s.analyzeTitle}>Analyzing...</p>
        <p className={s.analyzeSub}>Scanning image for diseases...</p>
        <div className={s.progressTrack}>
          <span className={s.progressFill} style={{ animationDuration: `${ANALYZE_MS}ms` }} />
        </div>
        <span className={s.aiChip}>✦ AI-powered crop disease detection</span>
      </button>
    </div>
  );
}

// ---------- 5. Diagnosis report (disease-report-rv2.jsx + diseaseReportMock.js) ----------

const STAGES = [
  { name: "Healthy", image: "prog-1-healthy.webp", spread: "0-5%" },
  { name: "Early Spot", image: "prog-2-early-spot.webp", spread: "5-20%" },
  { name: "Early Spread", image: "prog-3-early-spread.webp", spread: "20-45%", current: true },
  { name: "Moderate", image: "prog-4-moderate-spread.webp", spread: "45-70%" },
  { name: "Yellowing", image: "prog-5-yellowing.webp", spread: "70%+" },
];

const LOSS = [
  { stage: "Stage 1", loss: "-₹0" },
  { stage: "Stage 2", loss: "-₹17 to -₹1,860" },
  { stage: "Stage 3", loss: "-₹99 to -₹10,935", active: true },
  { stage: "Stage 4", loss: "-₹233 to -₹25,640" },
];

const PLAN = [
  {
    day: "Day 1",
    title: "Find and remove the first cases",
    desc: "Inspect your Rice crop for spreading leaf spots in the lower, humid canopy. Bag the first affected leaves; don't drop them on the soil.",
  },
  {
    day: "Day 2",
    title: "Apply the first treatment",
    desc: "Spray a protectant fungicide (Mancozeb ~2 g/L or Copper oxychloride ~3 g/L). Follow the label dose and pre-harvest interval.",
  },
  {
    day: "Day 3",
    title: "Attack what the problem needs",
    desc: "Open up the canopy, improve drainage and switch to base irrigation so foliage dries fast.",
  },
  {
    day: "Day 7",
    title: "Rescan and decide",
    desc: "Re-inspect the whole crop. If it's still spreading, step up treatment; if it has stopped, keep preventive cover.",
  },
];

function Report({ restart }: ScreenProps) {
  return (
    <div className={s.screen}>
      <TopBar title="Diagnosis Result" info={false} />
      <div className={s.scroll}>
        <div className={s.reportHero}>
          <img src={img("report-hero.webp")} alt="" />
          <div className={s.heroShade}>
            <div className={s.heroTopStack}>
              <span className={s.severityBadge}>MODERATE</span>
              <span className={s.aiScore}>✦ AI SCORE <b>95%</b></span>
            </div>
            <div>
              <p className={s.diseaseTitle}>Brown Spot</p>
              <p className={s.warningBanner}>⚠ Immediate action required — high risk</p>
              <div className={s.tagsRow}>
                <span className={s.tagChip}>🌱 Rice</span>
                <span className={s.tagChip}>🍃 Leaf</span>
              </div>
            </div>
          </div>
        </div>

        <div className={s.padded}>
          <section className={s.reportSection}>
            <p className={s.reportSectionTitle}>Disease Progression</p>
            <p className={s.reportText}>
              If left untreated, the disease may progress from ~45% to 80% spread in the next 4 days.
            </p>
            <div className={s.stagesRow}>
              {STAGES.map((st) => (
                <div key={st.name} className={`${s.stage} ${st.current ? s.stageCurrent : ""}`}>
                  <img src={img(st.image)} alt="" />
                  <span className={s.stageName}>{st.name}</span>
                  <span className={s.stageSpread}>{st.current ? "Now" : st.spread}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={s.reportSection}>
            <p className={s.reportSectionTitle}>Revenue Loss</p>
            <p className={s.reportCaption}>Estimated loss per acre if left untreated</p>
            {LOSS.map((l) => (
              <div key={l.stage} className={`${s.lossRow} ${l.active ? s.lossActive : ""}`}>
                <span>
                  {l.stage}
                  {l.active && <span className={s.nowPill}>Now</span>}
                </span>
                <b>{l.loss}</b>
              </div>
            ))}
          </section>

          <section className={s.reportSection}>
            <p className={s.reportSectionTitle}>Early Intervention Plan</p>
            {PLAN.map((p) => (
              <div key={p.day} className={s.planCard}>
                <span className={s.planDay}>{p.day}</span>
                <div>
                  <p className={s.planTitle}>{p.title}</p>
                  <p className={s.planDesc}>{p.desc}</p>
                </div>
              </div>
            ))}
          </section>

          <div className={s.reportCtas}>
            <span className={s.primaryBtn}>Start Treatment</span>
            <button type="button" className={`${s.secondaryBtn} ${s.hotspot}`} onClick={restart}>
              Re-Scan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const kissanScreens: Record<string, ComponentType<ScreenProps>> = {
  "crop-doctor": CropDoctor,
  "select-crop": SelectCrop,
  "scan-method": ScanMethod,
  analyzing: Analyzing,
  report: Report,
};
