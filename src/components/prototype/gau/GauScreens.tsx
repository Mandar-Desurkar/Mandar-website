/* eslint-disable @next/next/no-img-element -- fixed-size mock screens inside a phone frame */
"use client";

// Gau Sampurna screens, recreated from the `prod` branch of gausampurna-react-app
// (code/screens/gau-swastha-tenant/scan/*): new-scan hub, orchestrator steps (capture, analyzing,
// report ready), diagnosis-results and animal-status-report. Copy and colours come from the code;
// report values are illustrative sample values.
import { useEffect, useState, type ComponentType } from "react";
import base from "../kissan/kissan.module.css";
import s from "./gau.module.css";
import type { ScreenProps } from "../kissan/KissanScreens";

const img = (file: string) => `/prototypes/gau-sampurna/${file}`;

type ScanType = "disease-diagnosis" | "animal-status";

// ---------- Shared ----------

function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className={s.topBar}>
      <span className={s.backCircle} aria-hidden="true">
        ←
      </span>
      <span className={s.topTitles}>
        <span className={s.topTitle}>{title}</span>
        {subtitle && <span className={s.topSubtitle}>{subtitle}</span>}
      </span>
      <span className={s.backSpacer} />
    </div>
  );
}

// ---------- 1. Scan hub (new-scan-screen.jsx) ----------

function ScanHub({ next, focus }: ScreenProps & { focus: ScanType }) {
  return (
    <div className={base.screen}>
      <div className={s.hubHeader}>
        <span className={s.backCircle} aria-hidden="true">
          ←
        </span>
        <span className={s.flex} />
        <span className={s.counter}>2/3 free scans</span>
        <span className={s.upgradeBtn}>Upgrade to Pro</span>
      </div>
      <div className={`${base.scroll} ${s.hubScroll}`}>
        <div className={s.herdBand}>
          <div className={s.cowCard}>
            <img className={s.cowAvatar} src={img("gowri-avatar.jpg")} alt="" />
            <span className={s.cowInfo}>
              <span className={s.cowName}>Gowri</span>
              <span className={s.cowBreed}>Gir · 4 yrs</span>
            </span>
            <span className={s.changeCow}>Change Cow ⌄</span>
          </div>
        </div>

        <div className={s.hubSection}>
          <p className={s.hubSectionTitle}>Disease Diagnosis</p>
          <div className={s.diseaseCard}>
            <span className={s.urgentBadge}>Urgent</span>
            <span>
              <span className={s.diseaseTitle}>Cow unwell or Off-feed?</span>
              <span className={s.diseaseDesc}>Instant diagnosis in under a minute.</span>
            </span>
            <button
              type="button"
              className={`${s.diseaseBtn} ${focus === "disease-diagnosis" ? base.hotspot : ""}`}
              onClick={focus === "disease-diagnosis" ? next : undefined}
            >
              Start Disease Check
            </button>
          </div>

          <p className={s.hubSectionTitle}>Routine Scans</p>
          <div className={s.routineRow}>
            <button
              type="button"
              className={`${s.routineCard} ${focus === "animal-status" ? base.hotspot : ""}`}
              onClick={focus === "animal-status" ? next : undefined}
            >
              <span className={s.scanTime}>Recommended</span>
              <img className={s.routineImg} src={img("animal-status-illustration.png")} alt="" />
              <span className={s.routineTitle}>Animal Status</span>
              <span className={s.routineSub}>Weight &amp; Health Score</span>
              <span className={s.divider} />
              <span className={s.routineAction}>
                Scan Cow <span className={s.actionIcon}>›</span>
              </span>
            </button>
            <div className={s.routineCard}>
              <span className={s.scanTime}>Instant</span>
              <img className={s.routineImg} src={img("market-valuation-illustration.png")} alt="" />
              <span className={s.routineTitle}>Market Valuation</span>
              <span className={s.routineSub}>Final Price Estimate</span>
              <span className={s.divider} />
              <span className={s.routineAction}>
                Check Value <span className={s.actionIcon}>›</span>
              </span>
            </div>
          </div>

          <p className={s.hubSectionTitle}>Feed &amp; Digestion</p>
          <div className={s.dungCard}>
            <img className={s.dungImg} src={img("dung-scan-illustration.png")} alt="" />
            <span className={s.dungText}>
              <span className={s.dungTitleRow}>
                <span className={s.routineTitle}>Dung Scan</span>
                <span className={s.popularBadge}>Popular</span>
              </span>
              <span className={s.routineSub}>Check Digestion &amp; Feed Quality</span>
            </span>
            <span className={s.scanNowBtn}>Scan Now</span>
          </div>

          <div className={s.reportCard}>
            <img className={s.mascot} src={img("health-report-mascot.png")} alt="" />
            <span className={s.reportCardText}>
              <span className={s.routineTitle}>360° Cow Health Report</span>
              <span className={s.scanNowBtn}>Scan Now</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- 2. Photo guide (orchestrator-steps/ImageCaptureStep.jsx) ----------

const TIPS: Record<ScanType, { emoji: string; title: string; desc: string }[]> = {
  "disease-diagnosis": [
    { emoji: "🐄", title: "Full side profile", desc: "Capture the entire body from head to tail. Stand 2-3 meters away." },
    { emoji: "📐", title: "Level angle", desc: "Hold the phone at the cow's body height. Avoid shooting from above or below." },
    { emoji: "☀️", title: "Good lighting", desc: "Natural daylight works best. Avoid harsh shadows on the body." },
    { emoji: "🚫", title: "No obstructions", desc: "Make sure no fences, poles, or other animals block the view." },
  ],
  "animal-status": [
    { emoji: "🐄", title: "Full side profile", desc: "Capture the entire body from head to tail. Stand 2-3 meters away." },
    { emoji: "💧", title: "Udder clearly visible", desc: "Keep the udder unobstructed and fully in frame so it is detected accurately." },
    { emoji: "📐", title: "Level angle", desc: "Hold the phone at the cow's body height. Avoid shooting from above or below." },
    { emoji: "☀️", title: "Good lighting", desc: "Natural daylight works best. Avoid harsh shadows on the body." },
  ],
};

function Capture({ next, scanType }: ScreenProps & { scanType: ScanType }) {
  const isDisease = scanType === "disease-diagnosis";
  return (
    <div className={base.screen}>
      <TopBar title={isDisease ? "Disease Diagnosis" : "Animal Status Scan"} subtitle="Gowri" />
      <div className={`${base.scroll} ${s.captureBody}`}>
        <p className={s.captureSub}>
          {isDisease ? "Capture the full side profile of the cow" : "Side-view photo for body condition analysis"}
        </p>
        <div className={s.framePreview}>
          <img src={img("gowri-side.jpg")} alt="" />
          <span className={`${s.corner} ${s.cornerTL}`} />
          <span className={`${s.corner} ${s.cornerTR}`} />
          <span className={`${s.corner} ${s.cornerBL}`} />
          <span className={`${s.corner} ${s.cornerBR}`} />
        </div>
        <p className={s.overline}>BEFORE YOU CAPTURE</p>
        <div className={s.tips}>
          {TIPS[scanType].map((tip) => (
            <div key={tip.title} className={s.tip}>
              <span className={s.tipEmoji}>{tip.emoji}</span>
              <span>
                <span className={s.tipTitle}>{tip.title}</span>
                <span className={s.tipDesc}>{tip.desc}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className={s.captureFooter}>
        <button type="button" className={`${s.primaryBtn} ${base.hotspot}`} onClick={next}>
          📷 Open Camera
        </button>
        <span className={s.ghostBtn}>Choose from Gallery</span>
      </div>
    </div>
  );
}

// ---------- 3. Analyzing (orchestrator-steps/AnalyzingStep.jsx) ----------

const ANALYSIS: Record<ScanType, { title: string; subtitle: string; emoji: string; steps: string[]; tip: string }> = {
  "disease-diagnosis": {
    title: "Diagnosing condition",
    subtitle: "Usually takes 15–30 seconds",
    emoji: "💊",
    steps: ["Image received", "Detecting visual symptoms", "Matching against conditions", "Generating diagnosis"],
    tip: "Don't close the app. Our AI is cross-referencing visual evidence with known cattle diseases.",
  },
  "animal-status": {
    title: "Analyzing your cow",
    subtitle: "Usually takes 30–60 seconds",
    emoji: "🐄",
    steps: ["Image received", "Detecting breed & body condition", "Evaluating health parameters", "Generating report"],
    tip: "Don't close the app. We're analyzing body condition, breed purity, and economic parameters.",
  },
};

const STEP_MS = 650;

function Analyzing({ next, scanType }: ScreenProps & { scanType: ScanType }) {
  const config = ANALYSIS[scanType];
  const [done, setDone] = useState(0);

  // Tick through the pipeline, then move on, like the real orchestrator
  useEffect(() => {
    if (done >= config.steps.length) {
      const t = setTimeout(next, 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDone((d) => d + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [done, config.steps.length, next]);

  return (
    <div className={base.screen}>
      <TopBar title={scanType === "disease-diagnosis" ? "Disease Diagnosis" : "Animal Status Scan"} subtitle="Gowri" />
      <button type="button" className={s.analyzeBody} onClick={next} aria-label="Skip to results">
        <span className={s.analyzePhoto}>
          <img src={img("gowri-side.jpg")} alt="" />
          <span className={s.analyzeEmoji}>{config.emoji}</span>
        </span>
        <span className={s.analyzeTitle}>{config.title}</span>
        <span className={s.analyzeSub}>{config.subtitle}</span>
        <span className={s.steps}>
          {config.steps.map((step, i) => (
            <span key={step} className={`${s.step} ${i < done ? s.stepDone : i === done ? s.stepActive : ""}`}>
              <span className={s.stepIcon}>{i < done ? "✓" : i === done ? "" : ""}</span>
              {step}
            </span>
          ))}
        </span>
        <span className={s.analyzeTip}>{config.tip}</span>
      </button>
    </div>
  );
}

// ---------- 4. Report ready (orchestrator-steps/ReportReadyStep.jsx, disease summary) ----------

function ReportReady({ next }: ScreenProps) {
  return (
    <div className={base.screen}>
      <TopBar title="Disease Diagnosis" subtitle="Gowri" />
      <div className={`${base.scroll} ${s.readyBody}`}>
        <span className={s.readyCheck}>✓</span>
        <p className={s.readyTitle}>Report Ready!</p>
        <div className={s.readySummary}>
          <img className={s.readyThumb} src={img("gowri-side.jpg")} alt="" />
          <p className={s.overline}>CONDITIONS CHECKED</p>
          <p className={s.scoreLine}>
            <span className={s.scoreNumber} style={{ color: "#dc2626" }}>
              1
            </span>
            <span className={s.scoreMax}>/31</span>
          </p>
          <p className={s.scoreVerdict}>1 condition(s) detected</p>
          <div className={s.readyDx}>
            <span>
              <span className={s.readyDxLabel}>Diagnosis</span>
              <span className={s.readyDxName}>Mastitis (early signs)</span>
            </span>
            <span className={`${s.badge} ${s.badgeVet}`}>NEEDS VET</span>
          </div>
        </div>
      </div>
      <div className={s.captureFooter}>
        <button type="button" className={`${s.primaryBtn} ${base.hotspot}`} onClick={next}>
          View Full Report
        </button>
        <span className={s.outlineBtn}>New Scan</span>
      </div>
    </div>
  );
}

// ---------- 5. Diagnosis (diagnosis-results-screen.jsx) ----------

const INDICATORS = [
  { name: "Udder swelling", desc: "Rear quarters look swollen and uneven", clear: false },
  { name: "Lumpy skin nodules", desc: "No raised nodules on skin", clear: true },
  { name: "Foot & mouth lesions", desc: "No lesions visible on mouth or feet", clear: true },
  { name: "Eye discharge", desc: "Eyes clear, no discharge", clear: true },
  { name: "Bloat", desc: "Left flank normal", clear: true },
];

function Diagnosis({ restart }: ScreenProps) {
  return (
    <div className={base.screen}>
      <TopBar title="Disease Diagnosis" subtitle="Gowri" />
      <div className={`${base.scroll} ${s.reportBody}`}>
        <div className={s.dxHero}>
          <img src={img("gowri-side.jpg")} alt="" />
          <span className={s.heroNameBadge}>Gowri · Gir</span>
        </div>

        <div className={s.card}>
          <div className={s.rowBetween}>
            <span className={s.dxName}>Mastitis (early signs)</span>
            <span className={`${s.badge} ${s.badgeVet}`}>
              <i className={s.badgeDot} /> NEEDS VET
            </span>
          </div>
          <p className={s.countLabel}>Indicators Checked · 5</p>
          {INDICATORS.map((ind) => (
            <div key={ind.name} className={s.indicator}>
              <span className={s.indicatorText}>
                <span className={s.indicatorName}>{ind.name}</span>
                <span className={s.indicatorDesc}>{ind.desc}</span>
              </span>
              <span className={`${s.badge} ${ind.clear ? s.badgeClear : s.badgeVet}`}>
                {ind.clear ? "CLEAR" : "NEEDS VET"}
              </span>
            </div>
          ))}
        </div>

        <div className={s.card}>
          <p className={s.sectionLabel}>Diagnosis Reason</p>
          <p className={s.greenBar}>Swelling and asymmetry visible on the rear udder quarters in the side photo.</p>
          <p className={s.sectionLabel}>Recommendation</p>
          <p className={s.greenBar}>Strip-test milk before milking, milk this cow last, and consult a vet for treatment.</p>
          <p className={s.sectionLabel}>Prevention Rules</p>
          <p className={s.greenBar}>Clean, dry bedding · Teat dip after every milking · Milk healthy cows first</p>
        </div>

        <div className={s.warningCard}>
          <p className={s.warningTitle}>EARLY WARNING SIGNS</p>
          <p className={s.warningText}>• Clots or flakes in the milk</p>
          <p className={s.warningText}>• Hot, hard or painful udder</p>
          <p className={s.warningText}>• Sudden drop in milk yield</p>
        </div>

        <div className={s.vetCard}>
          <span className={s.vetAccent} />
          <div className={s.vetBody}>
            <p className={s.vetTitle}>Call a vet immediately if</p>
            <p className={s.vetBullet}>• Fever, or the cow stops eating</p>
            <p className={s.vetBullet}>• Milk turns watery or bloody</p>
            <button type="button" className={`${s.vetCallBtn} ${base.hotspot}`} onClick={restart}>
              📞 Free vet helpline · Call now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- 6. Animal status & valuation (animal-status-report-screen.jsx) ----------

const PURITY = [
  { label: "C", color: "#9E9E9E", pct: 10 },
  { label: "B", color: "#F9A825", pct: 20 },
  { label: "A3", color: "#A5D6A7", pct: 20 },
  { label: "A2", color: "#66BB6A", pct: 25 },
  { label: "A1", color: "#1B5E20", pct: 25 },
];

const RATION = [
  ["Green Fodder (Super Napier)", "25 kg"],
  ["Ragi / Wheat / Paddy Straw", "5 kg"],
  ["Cattle Feed 22% CP", "4 kg"],
  ["Groundnut cake / Soya meal", "1 kg"],
];

function StatusReport({ restart }: ScreenProps) {
  return (
    <div className={base.screen}>
      <TopBar title="Animal Status" subtitle="Gowri" />
      <div className={s.anchorNav}>
        {["Status", "Diseases", "Nutrition"].map((a, i) => (
          <span key={a} className={`${s.anchorBtn} ${i === 0 ? s.anchorActive : ""}`}>
            {a}
          </span>
        ))}
      </div>
      <div className={`${base.scroll} ${s.reportBody}`}>
        <div className={s.cattleCard}>
          <img className={s.cattleImg} src={img("gowri-side.jpg")} alt="" />
          <span className={s.cattleInfo}>
            <span className={s.breedName}>Gir</span>
            <span className={s.metaRow}>
              <span className={s.gradeBadge}>Grade A2</span>
              <span className={s.verified}>✓ VERIFIED</span>
            </span>
            <span className={s.weight}>⚖ Weight: 412 kg</span>
          </span>
        </div>

        <div className={s.card}>
          <p className={s.sectionLabel}>BREED PURITY SCALE</p>
          <div className={s.purityBar}>
            {PURITY.map((g) => (
              <span key={g.label} className={s.puritySeg} style={{ flex: g.pct, background: g.color }} />
            ))}
          </div>
          <div className={s.purityLabels}>
            {PURITY.map((g) => (
              <span key={g.label} style={{ flex: g.pct }} className={g.label === "A2" ? s.purityActive : undefined}>
                {g.label}
              </span>
            ))}
          </div>
          <p className={s.purityNote}>
            <b>A2 · Very High</b> purity (85–95%)
          </p>
        </div>

        <div className={s.card}>
          <p className={s.sectionLabel}>ECONOMIC PARAMETERS</p>
          <div className={s.econGrid}>
            <div className={s.econItem}>
              <span className={s.econLabel}>Body Condition Score</span>
              <span className={s.econValue}>
                3.5<small>/5</small>
              </span>
              <span className={s.bcsBar}>
                <span style={{ width: "70%" }} />
              </span>
            </div>
            <div className={s.econItem}>
              <span className={s.econLabel}>Milk Capacity</span>
              <span className={s.econValue}>
                12–14 <small>L/day</small>
              </span>
            </div>
            <div className={s.econItem}>
              <span className={s.econLabel}>Lactation Yield</span>
              <span className={s.econValue}>
                3,600 <small>L</small>
              </span>
            </div>
            <div className={s.econItem}>
              <span className={s.econLabel}>Breeding Quality</span>
              <span className={s.econValue}>Good</span>
            </div>
          </div>
          <div className={s.marketRow}>
            <span>
              <span className={s.econLabel}>Est. Market Value</span>
              <span className={s.marketValue}>₹78,000 – ₹86,000</span>
            </span>
            <span className={s.buyingRec}>
              <span className={s.econLabel}>Buying Rec.</span>
              <span className={s.buyingBadge}>✓ Yes</span>
            </span>
          </div>
        </div>

        <div className={s.card}>
          <p className={s.sectionLabel}>HEALTH CHECKS</p>
          <div className={s.checksRow}>
            <span className={s.checkStat} style={{ background: "#E8F5E9", color: "#008026" }}>
              <b>28</b> CLEAR
            </span>
            <span className={s.checkStat} style={{ background: "#FFF8E1", color: "#B26A00" }}>
              <b>2</b> WATCH
            </span>
            <span className={s.checkStat} style={{ background: "#FFEBEE", color: "#C62828" }}>
              <b>1</b> VET
            </span>
          </div>
        </div>

        <div className={s.card}>
          <div className={s.rowBetween}>
            <p className={s.sectionLabel}>DAILY RATION</p>
            <span className={s.dietTag}>Optimized for Milk</span>
          </div>
          {RATION.map(([item, amount]) => (
            <div key={item} className={s.dietRow}>
              <span>{item}</span>
              <b>{amount}</b>
            </div>
          ))}
          <button type="button" className={`${s.outlineBtn} ${base.hotspot}`} onClick={restart}>
            Show full ration
          </button>
        </div>
      </div>
    </div>
  );
}

const DiseaseHub = (p: ScreenProps) => <ScanHub {...p} focus="disease-diagnosis" />;
const DiseaseCapture = (p: ScreenProps) => <Capture {...p} scanType="disease-diagnosis" />;
const DiseaseAnalyzing = (p: ScreenProps) => <Analyzing {...p} scanType="disease-diagnosis" />;
const StatusHub = (p: ScreenProps) => <ScanHub {...p} focus="animal-status" />;
const StatusCapture = (p: ScreenProps) => <Capture {...p} scanType="animal-status" />;
const StatusAnalyzing = (p: ScreenProps) => <Analyzing {...p} scanType="animal-status" />;

export const gauScreens: Record<string, ComponentType<ScreenProps>> = {
  "gs-hub": DiseaseHub,
  "gs-capture": DiseaseCapture,
  "gs-analyzing": DiseaseAnalyzing,
  "gs-ready": ReportReady,
  "gs-diagnosis": Diagnosis,
  "gs-hub-status": StatusHub,
  "gs-capture-status": StatusCapture,
  "gs-analyzing-status": StatusAnalyzing,
  "gs-status-report": StatusReport,
};
