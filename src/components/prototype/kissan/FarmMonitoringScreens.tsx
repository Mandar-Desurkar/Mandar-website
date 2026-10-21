/* eslint-disable @next/next/no-img-element -- fixed-size mock screens inside a phone frame */
"use client";

// Farm Monitoring screens, recreated from the `dev` branch (code/screens/farm-monitoring/*):
// mark-your-farm, mark-farm-map, farm-setup-complete and farm-report (+ components/farm-report).
// Copy comes from en.json (farmMonitoring.*); farm values are illustrative sample values.
import { useState, type ComponentType } from "react";
import base from "./kissan.module.css";
import s from "./kissanFlows.module.css";
import type { ScreenProps } from "./KissanScreens";
import { TopBarNew } from "./CropGuideScreens";

const img = (file: string) => `/prototypes/kissan-sampurna/${file}`;

function GradientButton({ label, onClick, hint }: { label: string; onClick: () => void; hint?: boolean }) {
  return (
    <button type="button" className={`${s.gradientBtn} ${hint ? base.hotspot : ""}`} onClick={onClick}>
      {label}
    </button>
  );
}

// ---------- 1. Mark your farm (mark-your-farm-screen.jsx) ----------

function MarkYourFarm({ next }: ScreenProps) {
  const [method, setMethod] = useState<"draw" | "walk">("draw");
  const methods = [
    { id: "draw" as const, label: "Locate on Map", image: "fm-locate-on-map.webp" },
    { id: "walk" as const, label: "Walk to Mark", image: "fm-walk-to-mark.webp" },
  ];
  return (
    <div className={base.screen}>
      <TopBarNew title="Mark your farm" />
      <div className={`${base.scroll} ${s.markBody}`} role="radiogroup" aria-label="How to mark your farm">
        {methods.map((m) => {
          const selected = method === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`${s.methodCardLarge} ${selected ? s.cardSelectedGreen : ""}`}
              onClick={() => setMethod(m.id)}
            >
              <img className={s.methodLargeImg} src={img(m.image)} alt="" />
              <span className={s.methodRow}>
                <span className={s.methodLabel}>{m.label}</span>
                {selected ? <span className={s.greenCheck}>✓</span> : <span className={s.radioGrey} />}
              </span>
            </button>
          );
        })}
      </div>
      <div className={s.footer}>
        <span className={s.saveLater}>Save for Later</span>
        <GradientButton label="Continue" onClick={next} hint />
      </div>
    </div>
  );
}

// ---------- 2. Draw boundary (mark-farm-map-screen.jsx) ----------

// The farm illustration (1106×404) has its own outline baked into another field, so the
// map and satellite views frame a clean region of it. The boundary traces a real field there,
// in the image's own pixel coordinates, so pins stay aligned at any size.
const ILLUSTRATION = { width: 1106, height: 404 };
const FIELD: [number, number][] = [
  [871, 127],
  [889, 126],
  [1042, 257],
  [986, 267],
  [904, 249],
  [818, 236],
  [809, 222],
];
const FIELD_POINTS = FIELD.map((p) => p.join(",")).join(" ");

function Illustration() {
  return <image href={img("fm-farm-illustration.webp")} x={0} y={0} width={ILLUSTRATION.width} height={ILLUSTRATION.height} />;
}

function MarkFarmMap({ next }: ScreenProps) {
  // Bumping the key replays the drawing animation ("Clear all" → draw again)
  const [drawKey, setDrawKey] = useState(0);
  return (
    <div className={base.screen}>
      <TopBarNew title="Mark your farm" />
      <div className={s.mapArea}>
        <svg
          key={drawKey}
          className={s.mapSvg}
          viewBox="764 0 323 404"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <Illustration />
          <polygon className={s.boundaryFill} points={FIELD_POINTS} />
          <polygon className={s.boundaryLine} points={FIELD_POINTS} pathLength={100} />
          {FIELD.map(([x, y], i) => (
            <g key={i} className={s.pin} style={{ animationDelay: `${0.15 + i * 0.16}s` }}>
              <circle cx={x} cy={y} r="5.5" fill="#EF4444" stroke="#fff" strokeWidth="2" />
            </g>
          ))}
        </svg>
        <p className={s.mapTip}>Zoom in on the map and tap around the edges of your farm.</p>
      </div>
      <div className={s.mapSheet}>
        <div className={s.mapControls}>
          <span className={s.mapControl}>↶ Undo</span>
          <span className={s.mapControl}>↷ Redo</span>
          <button type="button" className={s.mapControl} onClick={() => setDrawKey((k) => k + 1)}>
            ✕ Clear all
          </button>
        </div>
        <div className={s.areaBlock}>
          <span className={s.areaLabel}>Estimated area</span>
          <span className={s.areaValue}>2.4 acres</span>
          <span className={s.areaCaption}>Based on current boundary</span>
        </div>
        <GradientButton label="Save Boundary" onClick={next} hint />
      </div>
    </div>
  );
}

// ---------- 3. Setup complete (farm-setup-complete-screen.jsx) ----------

function SetupComplete({ next }: ScreenProps) {
  return (
    <div className={base.screen}>
      <TopBarNew title="Mark your farm" />
      <div className={`${base.scroll} ${s.completeBody}`}>
        <span className={s.completeChip}>✓ SETUP COMPLETE</span>
        <p className={s.completeTitle}>Your farm is now monitored</p>
        <p className={s.completeSub}>Get personalized insights for your crop&apos;s health and growth.</p>
        <div className={s.farmCard}>
          <img className={s.farmCardImg} src={img("fm-farm-illustration.webp")} alt="" />
          <div className={s.farmCardRow}>
            <span>
              <b>East Plot</b> · 2.4 acres
            </span>
            <span className={s.activeDot}>● Active</span>
          </div>
        </div>
      </div>
      <div className={s.footer}>
        <GradientButton label="See the Insights" onClick={next} hint />
        <span className={s.outlinePill}>Add another Farm</span>
      </div>
    </div>
  );
}

// ---------- 4. Satellite report (farm-report-screen.jsx + components/farm-report/*) ----------

const TABS = ["Growth", "Water", "Food"] as const;

const RECOMMENDATIONS = [
  {
    id: "nitrogen",
    title: "Add nitrogen to the red zone",
    zone: { label: "Red zone", color: "#DC2626", bg: "#FEF2F2" },
    tone: { icon: "#DC2626", tint: "#FEE2E2" },
    body: "Spread urea on the north-east patch at the recommended dose, then irrigate lightly.",
    howWeKnow: "Satellite greenness in this zone has stayed well below the rest of your field for two weeks.",
  },
  {
    id: "water",
    title: "Water the yellow zone",
    zone: { label: "Yellow zone", color: "#B45309", bg: "#FFFBEB" },
    tone: { icon: "#D97706", tint: "#FEF3C7" },
    body: "Soil moisture is low near the east boundary. Run drip a little longer for the next 3 days.",
    howWeKnow: "Moisture readings for this zone are below the level wheat needs at this stage.",
  },
];

const VITALS = [
  { label: "Crop growth", value: "Moderate", color: "#D97706", bg: "#FEF3C7", icon: "🌱" },
  { label: "Nitrogen", value: "Low", color: "#DC2626", bg: "#FEE2E2", icon: "N" },
  { label: "Soil moisture", value: "32%", color: "#2563EB", bg: "#DBEAFE", icon: "💧" },
  { label: "Root zone temp", value: "24°C", color: "#059669", bg: "#D1FAE5", icon: "🌡" },
  { label: "Leaf hydration", value: "Good", color: "#059669", bg: "#D1FAE5", icon: "🍃" },
];

const STAGES = ["Sow", "Vegetative", "Flower", "Fruit set", "Harvest"];

function FarmReport({ goToFlow }: ScreenProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Growth");
  const [done, setDone] = useState<string[]>([]);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className={base.screen}>
      <TopBarNew title="Farm Monitoring Report" menu />
      <div className={`${base.scroll} ${s.fmReportBody}`}>
        {/* needs-attention-card.jsx */}
        <div className={s.card}>
          <div className={s.naHeader}>
            <span className={s.naTitleStack}>
              <span className={s.warnIcon}>⚠</span>
              <span className={s.naTitle}>
                Needs
                <br />
                Attention
              </span>
            </span>
            <span className={s.syncStack}>
              <span className={s.syncPill}>↻ Sync</span>
              <span className={s.updated}>🕒 Updated 2h ago</span>
            </span>
          </div>
          <div>
            <p className={s.cropArea}>Wheat · 2.4 acre</p>
            <p className={s.farmLocation}>East Plot · Nashik, Maharashtra</p>
          </div>
          <p className={s.naDescription}>Growth is uneven in the north-east corner, and nitrogen looks low there.</p>
          <span className={s.hr} />
          <div className={s.details}>
            {[
              ["Stage", "Vegetative, 2 of 5"],
              ["Irrigation", "Drip"],
              ["Soil", "Black soil"],
              ["Sowing date", "12 Nov 2025"],
            ].map(([label, value]) => (
              <span key={label} className={s.detail}>
                <span className={s.detailLabel}>{label}</span>
                <span className={s.detailValue}>{value}</span>
              </span>
            ))}
          </div>
        </div>

        {/* your-farm-card.jsx */}
        <div className={s.card}>
          <p className={s.yourFarmTitle}>Your Farm</p>
          <div className={s.tabs} role="tablist">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                className={`${s.tab} ${tab === t ? s.tabActive : ""}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div className={s.overlayWrap}>
            <svg
              className={s.overlaySvg}
              viewBox="765 111 320 170"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <defs>
                <clipPath id="ks-field">
                  <polygon points={FIELD_POINTS} />
                </clipPath>
                <filter id="ks-soft" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="8" />
                </filter>
              </defs>
              <Illustration />
              <rect x={765} y={111} width={320} height={170} fill="rgba(15, 23, 42, 0.18)" />
              {/* Satellite-index zones, clipped to the farm boundary */}
              <g clipPath="url(#ks-field)">
                <polygon points={FIELD_POINTS} fill="rgba(34, 197, 94, 0.45)" />
                <g filter="url(#ks-soft)">
                  {tab === "Growth" && (
                    <>
                      <ellipse cx={935} cy={180} rx={38} ry={20} fill="rgba(220, 38, 38, 0.9)" />
                      <ellipse cx={995} cy={248} rx={30} ry={14} fill="rgba(234, 179, 8, 0.9)" />
                    </>
                  )}
                  {tab === "Water" && (
                    <>
                      <ellipse cx={995} cy={246} rx={34} ry={16} fill="rgba(234, 179, 8, 0.9)" />
                      <ellipse cx={860} cy={215} rx={40} ry={22} fill="rgba(37, 99, 235, 0.7)" />
                    </>
                  )}
                  {tab === "Food" && <ellipse cx={930} cy={176} rx={46} ry={24} fill="rgba(220, 38, 38, 0.85)" />}
                </g>
              </g>
              <polygon points={FIELD_POINTS} fill="none" stroke="#fff" strokeWidth={2} strokeLinejoin="round" />
            </svg>
          </div>
          <div className={s.legend}>
            <span>
              <i className={s.dot} style={{ background: "#DC2626" }} /> Low nutrition
            </span>
            <span>
              <i className={s.dot} style={{ background: "#22C55E" }} /> Sufficient
            </span>
          </div>
        </div>

        {/* recommendation-card.jsx */}
        <p className={s.sectionTitle}>Do This</p>
        {RECOMMENDATIONS.map((rec) => {
          const isDone = done.includes(rec.id);
          return (
            <div key={rec.id} className={s.recCard}>
              <div className={s.recTop}>
                <span className={s.recTitleGroup}>
                  <span className={s.recIcon} style={{ background: rec.tone.tint, color: rec.tone.icon }}>
                    ●
                  </span>
                  <span className={s.recTitle}>{rec.title}</span>
                </span>
                <button
                  type="button"
                  className={`${s.audioBtn} ${speaking === rec.id ? s.audioActive : ""}`}
                  aria-label={speaking === rec.id ? "Stop reading aloud" : "Read aloud"}
                  onClick={() => setSpeaking((cur) => (cur === rec.id ? null : rec.id))}
                >
                  {speaking === rec.id ? "■" : "🔊"}
                </button>
              </div>
              <span className={s.zonePill} style={{ background: rec.zone.bg, color: rec.zone.color }}>
                📍 {rec.zone.label}
              </span>
              <p className={s.recBody}>{rec.body}</p>
              <button type="button" className={s.scanBtn} onClick={() => goToFlow("crop-doctor")}>
                📷 Not sure? Scan with Crop Doctor
              </button>
              <button
                type="button"
                className={`${s.doneBtn} ${isDone ? s.doneBtnDone : ""} ${!done.length && rec.id === "nitrogen" ? base.hotspot : ""}`}
                onClick={() => setDone((cur) => (isDone ? cur.filter((x) => x !== rec.id) : [...cur, rec.id]))}
              >
                ✓ {isDone ? "Done" : "Mark as done"}
              </button>
              <span className={s.hrLight} />
              <button type="button" className={s.accordion} onClick={() => setOpen((cur) => (cur === rec.id ? null : rec.id))}>
                How we know this {open === rec.id ? "⌃" : "⌄"}
              </button>
              {open === rec.id && <p className={s.recBody}>{rec.howWeKnow}</p>}
            </div>
          );
        })}

        {/* farm-vitals-card.jsx */}
        <p className={s.sectionTitle}>Farm Vitals</p>
        <div className={`${s.card} ${s.vitalsGrid}`}>
          {VITALS.map((v) => (
            <span key={v.label} className={s.vital}>
              <span className={s.vitalTile} style={{ background: v.bg, color: v.color }}>
                {v.icon}
              </span>
              <span className={s.vitalText}>
                <span className={s.vitalLabel}>{v.label}</span>
                <span className={s.vitalValue} style={{ color: v.color }}>
                  {v.value}
                </span>
              </span>
            </span>
          ))}
        </div>

        {/* crop-stage-card.jsx */}
        <div className={s.card}>
          <div className={s.stageHeader}>
            <span className={s.stageIcon}>✿</span>
            <span className={s.stageTitleGroup}>
              <span className={s.stageBadge}>CROP STAGE · 40%</span>
              <span className={s.stageName}>Vegetative</span>
            </span>
          </div>
          <div className={s.bars}>
            {STAGES.map((st, i) => (
              <span key={st} className={s.bar} style={{ background: i <= 1 ? "#059669" : "#E2E8F0" }} />
            ))}
          </div>
          <div className={s.stageLabels}>
            {STAGES.map((st, i) => (
              <span key={st} className={i === 1 ? s.stageLabelBold : undefined}>
                {st}
              </span>
            ))}
          </div>
          <span className={s.hr} />
          <div className={s.timing}>
            <span className={s.dayText}>📅 Day 46 of 120</span>
            <span className={s.countdown}>⏱ 74 days to harvest</span>
          </div>
          {confirmed ? (
            <p className={s.thanks}>✓ Thanks for confirming</p>
          ) : (
            <div className={s.confirmBox}>
              <div className={s.confirmHeader}>
                <span className={s.helpCircle}>?</span>
                <span>
                  <span className={s.confirmTitle}>Is this crop stage correct?</span>
                  <span className={s.confirmBody}>Please confirm to get the right advice for this stage.</span>
                </span>
              </div>
              <div className={s.confirmActions}>
                <span className={s.pillOutline}>Change stage</span>
                <button type="button" className={s.pillSolid} onClick={() => setConfirmed(true)}>
                  ✓ Yes, Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const farmMonitoringScreens: Record<string, ComponentType<ScreenProps>> = {
  "fm-mark": MarkYourFarm,
  "fm-map": MarkFarmMap,
  "fm-complete": SetupComplete,
  "fm-report": FarmReport,
};
