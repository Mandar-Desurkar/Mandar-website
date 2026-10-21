/* eslint-disable @next/next/no-img-element -- fixed-size mock screens inside a phone frame */
"use client";

// Kissan Sampurna AI Crop Doctor entry screens, recreated for the web from the React Native source
// (code/screens/crop-disease/*, prod): Crop Doctor home, select crop and scan method. The rest of the
// flow lives in CropDoctorScreens.tsx. Same colours, type sizes, layout and English copy.
import { useState, type ComponentType } from "react";
import s from "./kissan.module.css";
import { KAlert, KissanTabBar } from "./KissanShared";

// next: advance within the flow; back: previous screen; restart: back to the flow's first screen;
// go: jump to a screen in the same flow (YES/NO branches);
// goToFlow: jump into another flow, as the real app links features together.
export type ScreenProps = {
  next: () => void;
  back: () => void;
  restart: () => void;
  go: (screenId: string) => void;
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

// code/components/TopBar.jsx
export function TopBar({ title, info = true, onInfo }: { title: string; info?: boolean; onInfo?: () => void }) {
  return (
    <div className={s.topBar}>
      <span className={s.backBtn}>
        <BackIcon />
      </span>
      <span className={s.topTitle}>{title}</span>
      {info && (
        <button type="button" className={s.infoBtn} onClick={onInfo} aria-label="Information">
          i
        </button>
      )}
    </div>
  );
}

// ---------- 1. Crop Doctor (crop-disease-home.jsx) ----------

const HOW_IT_WORKS = [
  { image: "step-take-photo.webp", label: "Take photo" },
  { image: "step-get-report.webp", label: "Get Report" },
  { image: "step-take-action.webp", label: "Take action" },
];

function CropDoctor({ next, goToFlow }: ScreenProps) {
  const [info, setInfo] = useState(false);
  return (
    <div className={s.screen} style={{ position: "relative" }}>
      <TopBar title="Crop Doctor" onInfo={() => setInfo(true)} />
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
      <KissanTabBar active="scan" goToFlow={goToFlow} />
      {info && (
        <KAlert
          title="Crop Doctor"
          message="Take or upload a photo of your crop to detect diseases, get treatment suggestions, and prevention tips."
          buttons={[{ text: "OK", onPress: () => setInfo(false) }]}
          onClose={() => setInfo(false)}
        />
      )}
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

// cropCatalogConfig.js: curated tiles with their tints
const CATEGORIES = [
  { name: "Cereals", image: "cat-cereals.webp", tint: "rgba(249, 173, 14, 0.15)" },
  { name: "Vegetables", image: "cat-vegetables.webp", tint: "rgba(148, 186, 10, 0.15)" },
  { name: "Fruits", image: "cat-fruits.webp", tint: "rgba(255, 15, 0, 0.15)" },
  { name: "Pulses", image: "cat-pulses.webp", tint: "rgba(229, 245, 76, 0.15)" },
  { name: "Oil seeds", image: "cat-oilseeds.webp", tint: "rgba(255, 232, 13, 0.15)" },
  { name: "Spices", image: "cat-spices.webp", tint: "rgba(222, 128, 34, 0.15)" },
  { name: "Others", image: "cat-others.webp", tint: "rgba(0, 70, 145, 0.08)" },
];

function SelectCrop({ go }: ScreenProps) {
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
              <button key={crop.name} type="button" className={`${s.popularCard} ${s.hotspot}`} onClick={() => go("scan-method")}>
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
            <button
              key={cat.name}
              type="button"
              className={`${s.categoryCard} ${cat.name === "Cereals" ? s.hotspot : ""}`}
              onClick={cat.name === "Cereals" ? () => go("cd-category") : undefined}
            >
              <img className={s.categoryImg} src={img(cat.image)} alt="" style={{ background: cat.tint }} />
              <span className={s.categoryLabel}>{cat.name}</span>
            </button>
          ))}
        </div>

        <div className={s.requestCard}>
          <div>
            <p className={s.requestTitle}>Can&apos;t find your crop?</p>
            <p className={s.requestSub}>Let us know and will add it for you.</p>
          </div>
          <button type="button" className={s.requestBtn} onClick={() => go("cd-request")}>
            Request Crop
          </button>
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

export const kissanScreens: Record<string, ComponentType<ScreenProps>> = {
  "crop-doctor": CropDoctor,
  "select-crop": SelectCrop,
  "scan-method": ScanMethod,
};
