/* eslint-disable @next/next/no-img-element -- fixed-size mock screens inside a phone frame */
"use client";

// AI Crop Doctor screens after crop selection, recreated from the `prod` branch of kissansampurna-app
// (code/screens/crop-disease/*): category-crops-screen, request-crop-screen, crop-camera-screen
// (camera, guide, review, healthy result), disease-report-detail (analysis loading view),
// disease-report-rv2 (+ components/disease-report/*) and crop-disease-screen (report history).
// Report content is the app's own sample report (diseaseReportMock.js); farm values are illustrative.
import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bug,
  Calendar,
  Camera,
  Check,
  ChevronRight,
  Images,
  Info,
  Leaf,
  Search,
  Shield,
  Sparkles,
  Sprout,
  Sun,
  Timer,
  Volume2,
  Wind,
  X,
} from "lucide-react";
import c from "./cropDoctor.module.css";
import { KAlert, ui } from "./KissanShared";
import { TopBar, type ScreenProps } from "./KissanScreens";

const img = (file: string) => `/prototypes/kissan-sampurna/${file}`;
const PHOTO = img("cd-leaf-hero.webp");

// ---------- Category crops (category-crops-screen.jsx + CropRow.jsx) ----------

const CEREALS = [
  ["Rice", "crop-rice.webp"],
  ["Wheat", "crop-wheat.webp"],
  ["Maize", "crop-maize.webp"],
  ["Jowar", "crop-jowar.webp"],
  ["Ragi", "crop-ragi.webp"],
  ["Barley", "crop-barley.webp"],
  ["Bajra", "crop-pearlmillet.webp"],
];

function CategoryCrops({ go }: ScreenProps) {
  return (
    <div className={c.screen}>
      <TopBar title="Cereals" info={false} />
      <div className={c.scroll}>
        <div className={c.listHeader}>
          <p className={c.subtitle}>Choose a crop to check its health.</p>
          <div className={c.searchRow}>
            <span className={c.searchBar}>
              <Search size={16} color="rgba(0,0,0,0.6)" /> Search crops...
            </span>
            <span className={c.searchBtn}>
              <Search size={18} />
            </span>
          </div>
        </div>
        <div className={c.cropList}>
          {CEREALS.map(([name, file]) => (
            <button
              key={name}
              type="button"
              className={`${ui.btnReset} ${c.cropRow} ${name === "Rice" ? ui.hotspot : ""}`}
              onClick={() => go("scan-method")}
            >
              <img src={img(file)} alt="" />
              <span className={c.cropRowText}>
                <b>{name}</b>
                <span>Cereals</span>
              </span>
              <ChevronRight size={20} color="#6B7280" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Request crop (request-crop-screen.jsx) ----------

function RequestCrop({ go }: ScreenProps) {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className={c.screen}>
      <TopBar title="Request Crop" info={false} />
      <div className={c.scroll}>
        <div className={c.form}>
          <p className={c.subtitle} style={{ color: "#6B7280" }}>
            Submit a request to add a new crop to our database
          </p>
          <div className={c.field}>
            <span className={c.label}>
              Crop Name <span className={c.required}>*</span>
            </span>
            <span className={`${c.input} ${c.inputFilled}`}>Dragon fruit</span>
          </div>
          <div className={c.field}>
            <span className={c.label}>Description</span>
            <span className={c.textarea}>
              Add any additional details about the crop, its growth habits, or common issues...
            </span>
          </div>
          <div className={c.field}>
            <span className={c.label}>Region</span>
            <span className={c.input}>
              <span className={c.placeholder}>e.g. Kurnool, Andhra Pradesh.</span>
            </span>
          </div>
          <div style={{ height: 40 }} />
          <button type="button" className={`${ui.btnReset} ${c.primaryPill} ${ui.hotspot}`} onClick={() => setSubmitted(true)}>
            Submit Request
          </button>
        </div>
      </div>
      {submitted && (
        <KAlert
          title="Request Submitted"
          message="Your crop request has been submitted successfully. We will review it and add the crop to our database soon."
          buttons={[{ text: "OK", onPress: () => go("select-crop") }]}
        />
      )}
    </div>
  );
}

// ---------- Camera (crop-camera-screen.jsx) ----------

function CropCamera({ next, back }: ScreenProps) {
  const [guide, setGuide] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  return (
    <div className={`${c.screen} ${c.camera}`} style={{ backgroundImage: `url(${PHOTO})` }}>
      <div className={c.camTop}>
        <button type="button" className={`${ui.btnReset} ${c.camIconBtn}`} onClick={back} aria-label="Back">
          <ArrowLeft size={22} />
        </button>
        <span className={c.camTitle}>Photograph your Rice</span>
        <button
          type="button"
          className={`${ui.btnReset} ${c.camIconBtn} ${c.camInfoBtn}`}
          onClick={() => setGuide(true)}
          aria-label="How to take the photo"
        >
          <Info size={22} />
        </button>
      </div>

      {!guide && (
        <>
          <div className={c.frameWrap}>
            <div className={c.frameBox}>
              <span className={`${c.corner} ${c.cTL}`} />
              <span className={`${c.corner} ${c.cTR}`} />
              <span className={`${c.corner} ${c.cBL}`} />
              <span className={`${c.corner} ${c.cBR}`} />
            </div>
            <span className={c.hintPill}>
              <Leaf size={16} /> Hold the plant inside the box
            </span>
          </div>
          <div className={c.camBottom}>
            <span className={c.galleryBtn}>
              <Images size={24} />
            </span>
            <button type="button" className={`${ui.btnReset} ${c.shutterOuter} ${ui.hotspot} ${ui.hotspotRound}`} onClick={next} aria-label="Take photo">
              <span className={c.shutterInner}>
                <Camera size={28} />
              </span>
            </button>
            <span style={{ width: 52 }} />
          </div>
        </>
      )}

      {guide && (
        <div className={c.guideOverlay}>
          <div className={c.guideSheet}>
            <div className={c.guideHeader}>
              <Camera size={22} color="#5b9bf0" /> How to take the photo
            </div>
            <p className={c.guideSub}>A clear, close photo gives the best result.</p>
            <div className={c.examples}>
              <span className={c.example} style={{ color: "#2E7D32" }}>
                <span className={c.exampleThumb} style={{ borderColor: "#2E7D32" }}>
                  <img src={img("cd-guide-do.webp")} alt="" />
                  <span className={c.exampleBadge} style={{ background: "#2E7D32" }}>
                    <Check size={14} color="#fff" />
                  </span>
                </span>
                Close &amp; clear
              </span>
              <span className={c.example} style={{ color: "#EF4444" }}>
                <span className={c.exampleThumb} style={{ borderColor: "#EF4444" }}>
                  <img src={img("cd-guide-dont.webp")} alt="" />
                  <span className={c.exampleBadge} style={{ background: "#EF4444" }}>
                    <X size={14} color="#fff" />
                  </span>
                </span>
                Far or blurry
              </span>
            </div>
            <button type="button" className={`${ui.btnReset} ${c.gotIt}`} onClick={() => setGuide(false)}>
              Got it — open camera <ArrowRight size={20} />
            </button>
            <button type="button" className={`${ui.btnReset} ${c.hearRow}`} onClick={() => setSpeaking((v) => !v)}>
              <Volume2 size={18} /> {speaking ? "Playing…" : "Hear this in English"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Review + scanning (crop-camera-screen.jsx, captured state) ----------

function ReviewPhoto({ next, back }: ScreenProps) {
  const [scanning, setScanning] = useState(false);
  useEffect(() => {
    if (!scanning) return;
    const t = setTimeout(next, 1600);
    return () => clearTimeout(t);
  }, [scanning, next]);

  return (
    <div className={`${c.screen} ${c.camera}`} style={{ backgroundImage: `url(${PHOTO})` }}>
      {!scanning ? (
        <>
          <div className={c.reviewTop}>
            <span className={c.reviewQuestion}>A clear, close photo gives the best result.</span>
          </div>
          <div className={c.reviewBottom}>
            <button type="button" className={`${ui.btnReset} ${c.reviewItem}`} onClick={back}>
              <span className={c.reviewCircle} style={{ background: "#EF4444" }}>
                <X size={34} />
              </span>
              Try Again
            </button>
            <button type="button" className={`${ui.btnReset} ${c.reviewItem}`} onClick={() => setScanning(true)}>
              <span className={`${c.reviewCircle} ${ui.hotspot} ${ui.hotspotRound}`} style={{ background: "#004691" }}>
                <Check size={34} />
              </span>
              Continue
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={c.scrim} />
          <div className={c.resultContent}>
            <span className={c.spinner} />
            <p className={c.resultTitle}>Analyzing...</p>
            <p className={c.resultMessage}>Scanning image for diseases...</p>
          </div>
        </>
      )}
    </div>
  );
}

// ---------- Healthy result (crop-camera-screen.jsx, showHealthy) ----------

function HealthyResult({ go, goToFlow }: ScreenProps) {
  return (
    <div className={`${c.screen} ${c.camera}`} style={{ backgroundImage: `url(${img("cd-healthy-hero.webp")})` }}>
      <div className={c.scrim} />
      <div className={c.resultContent}>
        <span className={c.resultIcon} style={{ background: "#2E7D32" }}>
          <Check size={34} />
        </span>
        <p className={c.resultTitle}>Healthy Crop!</p>
        <p className={c.resultMessage}>Great news! Your crop appears to be healthy with no diseases detected.</p>
        <button type="button" className={`${ui.btnReset} ${c.resultPrimary}`} onClick={() => go("cd-camera")}>
          <Camera size={20} /> Try Again
        </button>
        <button type="button" className={`${ui.btnReset} ${c.resultSecondary}`} onClick={() => goToFlow("home-weather")}>
          OK
        </button>
      </div>
    </div>
  );
}

// ---------- Analysis loading (disease-report-detail.jsx: DiseaseReportLoadingView) ----------

const ANALYSIS_STEPS = ["Color Spectrum Check", "Disease Pattern Detection", "Damage Assessment"];
const TIPS = [
  "Info: High Humidity can increase the risk of fungal crop diseases.",
  "Tip: Morning sunlight helps evaporate dew and prevents fungal spores.",
  "Tip: Rotating crops between seasons breaks disease cycles naturally.",
];
// The real view paces a 40–90s backend job; the prototype compresses it to ~5s.
const STEP_MS = 1500;

function AnalysisLoading({ next, back }: ScreenProps) {
  const [step, setStep] = useState(0);
  const [scan, setScan] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (showInfo) return;
    if (step >= ANALYSIS_STEPS.length) {
      const t = setTimeout(next, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [step, next, showInfo]);

  // Laser sweeps down, un-blurring the photo above it
  useEffect(() => {
    const id = requestAnimationFrame(() => setScan(92));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={`${c.screen} ${c.loading}`}>
      <div className={c.loadingBg} style={{ backgroundImage: `url(${img("cd-analysis-hero.webp")})` }} />
      <div className={c.blurBelow} style={{ top: `${scan}%`, transition: `top ${STEP_MS * 3}ms cubic-bezier(.2,.7,.3,1)` }} />
      <div className={c.laser} style={{ top: `${scan}%`, transition: `top ${STEP_MS * 3}ms cubic-bezier(.2,.7,.3,1)` }} />
      <div className={c.loadingTop}>
        <div className={c.loadingHeader}>
          <button type="button" className={`${ui.btnReset} ${c.loadingBack}`} onClick={back} aria-label="Back">
            <ArrowLeft size={20} />
          </button>
          <span className={c.loadingTitle}>Diagnosis Result</span>
          <button type="button" className={`${ui.btnReset} ${c.loadingInfo}`} onClick={() => setShowInfo(true)} aria-label="About AI diagnosis">
            <Info size={20} />
          </button>
        </div>
        <div className={c.loadingDivider} />
        <div className={c.doYouKnow}>
          <b>Do you know?</b>
          {TIPS[Math.min(step, TIPS.length - 1)]}
        </div>
      </div>
      <button type="button" className={`${ui.btnReset} ${c.loadingBottom}`} onClick={next} aria-label="Skip to report">
        <div className={c.stepsCard}>
          {ANALYSIS_STEPS.map((title, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={title} className={`${c.stepRow} ${active ? c.stepActive : ""}`}>
                {done ? (
                  <span className={c.stepIconDone}>
                    <Check size={12} />
                  </span>
                ) : active ? (
                  <span className={c.stepIconActive}>
                    <i />
                  </span>
                ) : (
                  <span className={c.stepIconPending}>
                    <i />
                  </span>
                )}
                <span>{title}</span>
                <span className={done ? c.statusDone : active ? c.statusActive : c.statusPending}>
                  {done ? "Completed" : active ? "In Progress" : "Pending"}
                </span>
              </div>
            );
          })}
        </div>
      </button>
      {showInfo && (
        <KAlert
          title="AI Crop Diagnosis"
          message="Our AI analyzes leaf color spectrums, disease patterns, and affected tissue damage in seconds to identify plant health issues and recommend treatments."
          buttons={[{ text: "OK", onPress: () => setShowInfo(false) }]}
          onClose={() => setShowInfo(false)}
        />
      )}
    </div>
  );
}

// ---------- Report (disease-report-rv2.jsx, moderate severity, diseaseReportMock.js) ----------

// box_2d is [ymin, xmin, ymax, xmax] on a 0–1000 grid; BboxZoomImage zooms the photo onto it
const EARLY_SIGNS = [
  { box: [386, 350, 483, 417], title: "Oval Brown Spots", desc: "Distinct oval lesions with light brown centers and darker reddish-brown margins on the leaf blade." },
  { box: [182, 465, 303, 563], title: "Confluent Lesions", desc: "Multiple brown lesions merging along the length of the rice leaf causing local yellowing." },
  { box: [326, 107, 506, 172], title: "Necrotic Spots on Edge", desc: "Slightly elongated, circular spots developing along the margins of the leaf blade." },
];

function zoomStyle(box: number[], w = 120, h = 118) {
  const [ymin, xmin, ymax, xmax] = box.map((v) => v / 1000);
  const bw = xmax - xmin;
  const bh = ymax - ymin;
  const zoom = Math.min(3, Math.max(1.8, 0.45 / Math.max(bw, bh, 0.05)));
  const iw = w * zoom;
  const ih = h * zoom;
  const left = Math.min(0, Math.max(w - iw, w / 2 - (xmin + bw / 2) * iw));
  const top = Math.min(0, Math.max(h - ih, h / 2 - (ymin + bh / 2) * ih));
  return { backgroundImage: `url(${PHOTO})`, backgroundSize: `${iw}px ${ih}px`, backgroundPosition: `${left}px ${top}px` };
}

const STAGES = [
  { name: "Healthy", image: "prog-1-healthy.webp", day: 0, loss: "-₹0" },
  { name: "Early Spot", image: "prog-2-early-spot.webp", day: 4, loss: "-₹17 to -₹1,860" },
  { name: "Spot Expansion", image: "prog-3-early-spread.webp", day: 8, loss: "-₹99 to -₹10,935" },
  { name: "Infection Spread", image: "prog-4-moderate-spread.webp", day: 12, loss: "-₹233 to -₹25,640" },
  { name: "Total Loss", image: "prog-7-dried-leaf.webp", day: 16, loss: "-₹250 to -₹27,500" },
];
const CURRENT = 2;
const STAGE_COLORS = ["#22C55E", "#EAB308", "#F97316", "#EF4444"];
const MONEY = ["cd-money-100.webp", "cd-money-200.webp", "cd-money-500.webp", "cd-money-2000.webp"];

const stageLabel = (i: number) => {
  const diff = STAGES[i].day - STAGES[CURRENT].day;
  if (diff === 0) return "Today";
  return diff < 0 ? `${-diff} days ago` : `${diff} days later`;
};

const FARMS = [
  { name: "Lakshmi Farm", crop: "Rice", acres: 2.4 },
  { name: "River Plot", crop: "Paddy", acres: 1.2 },
  { name: "Home Field", crop: "Ragi", acres: 0.8 },
];

// multiplyLossString(): scale each rupee figure by the selected farm's acreage, Indian grouping
const scaleLoss = (loss: string, acres: number) =>
  acres === 1
    ? loss
    : loss.replace(/(\d[\d,]*)/g, (m) => Math.round(parseFloat(m.replace(/,/g, "")) * acres).toLocaleString("en-IN"));

const PLAN = [
  {
    chip: { label: "Today", bg: "#F5B041", color: "#1E293B" },
    title: "Find and remove the first cases",
    desc: "Inspect your Rice crop and look for spreading leaf spots/lesions in the lower, humid canopy. Remove the first affected leaves/plants/fruit into a bag - do not drop them on the soil. Note where it is worst so you can target action there.",
  },
  {
    chip: { label: "Tomorrow", bg: "rgba(59, 130, 246, 0.75)", color: "#fff" },
    title: "Step up treatment",
    desc: "Apply a systemic (Azoxystrobin ~1 ml/L or Difenoconazole ~0.5 ml/L). Always follow the product label dose and pre-harvest interval (PHI).",
  },
  {
    chip: { label: "2 Days Later", bg: "rgba(59, 130, 246, 0.75)", color: "#fff" },
    title: "Attack what the problem needs",
    desc: "Open up the canopy, improve drainage and switch to base (drip/furrow) irrigation so foliage dries fast; remove weeds and check treated plants for any leaf burn.",
  },
  {
    chip: { label: "6 Days Later", bg: "rgba(59, 130, 246, 0.75)", color: "#fff" },
    title: "Rescan and decide",
    desc: "Re-inspect the whole Rice crop on day 7 (about 3 days after the last treatment) for spreading leaf spots/lesions in the lower, humid canopy. If it is still appearing or spreading, repeat or step up the treatment and prepare for containment; if it has stopped, keep up preventive cover and weekly monitoring.",
  },
];

const PREVENTIVE = [
  { Icon: Sprout, title: "Clean seed & rotation", desc: "Use clean, treated seed and resistant varieties; rotate away from the same family for 2 years." },
  { Icon: Wind, title: "Space for airflow", desc: "Improve spacing, airflow and drainage; leaf-spot fungi thrive in crowded, humid, wet canopies." },
  { Icon: Sun, title: "Water at the base", desc: "Irrigate at the base early in the day and avoid working plants when wet." },
  { Icon: Shield, title: "Destroy infected debris", desc: "Remove and destroy infected leaves and crop debris after harvest." },
  { Icon: Activity, title: "Scout & treat early", desc: "Scout weekly and treat at the very first spots, before they multiply." },
];

function Report({ back, go, goToFlow }: ScreenProps) {
  const [point, setPoint] = useState(CURRENT);
  const [farm, setFarm] = useState(0);
  const [done, setDone] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const ratio = (i: number) => i / (STAGES.length - 1);
  const dotLeft = (i: number) => `${(2.5 + ratio(i) * 88.5).toFixed(1)}%`;
  const tractorLeft = `${(4 + ratio(point) * 88).toFixed(1)}%`;
  const acres = FARMS[farm].acres;

  // Like the app, the stage carousel opens scrolled to the current stage
  useEffect(() => {
    if (progRef.current) progRef.current.scrollLeft = CURRENT * 120 - 120;
  }, []);

  return (
    <div className={c.screen} style={{ background: "#FFDFCA" }}>
      <div className={c.scroll}>
        <div className={c.reportScroll}>
          {/* DiseaseReportHeader */}
          <div className={c.reportHeader}>
            <div className={c.reportNav}>
              <button type="button" className={`${ui.btnReset} ${c.circleBack}`} onClick={back} aria-label="Go back">
                <ArrowLeft size={16} />
              </button>
              <span className={c.reportNavTitle}>Diagnosis Result</span>
            </div>
            <div className={c.callout} style={{ background: "#D1FAE5", borderColor: "#99F0C3", color: "#024A1D" }}>
              <b>Good news! </b>
              Your crop is still in an early stage. Preventive treatment can significantly reduce yield loss.
            </div>
          </div>

          {/* DiseaseReportHero */}
          <div className={c.hero} style={{ backgroundImage: `url(${PHOTO})` }}>
            <div className={c.heroShade}>
              <div className={c.heroTop}>
                <span className={c.heroBadge} style={{ background: "#F97316", boxShadow: "0 4px 12px rgba(249,115,22,.2)" }}>
                  MODERATE
                </span>
                <span className={c.aiScore}>
                  <Sparkles size={10} /> AI SCORE <b>95%</b>
                </span>
              </div>
              <div className={c.heroBottom}>
                <p className={c.heroTitle}>Rice - Brown Spot</p>
                <span className={c.warning} style={{ background: "#FFFBEB", color: "#92400E" }}>
                  <AlertTriangle size={14} /> Immediate action required — high risk
                </span>
                <div className={c.tags}>
                  <span className={c.tag}>
                    <Sprout size={12} /> Fungal Disease
                  </span>
                  <span className={c.tag}>
                    <Leaf size={12} /> Leaf Affected
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* EarlySignsSection */}
          <section className={c.section} style={{ background: "#FFF7ED" }}>
            <div className={c.sectionHead}>
              <p className={c.sectionTitle}>Early Signs Observed</p>
              <p className={c.sectionSub}>Initial signs detected in the last 48 hours.</p>
            </div>
            <div className={c.signGrid}>
              {EARLY_SIGNS.map((sign) => (
                <div key={sign.title} className={c.signCard}>
                  <div className={c.signImg} style={zoomStyle(sign.box)} />
                  <div>
                    <div className={c.signTitle}>{sign.title}</div>
                    <div className={c.signDesc}>{sign.desc}</div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className={`${ui.btnReset} ${c.signCard}`}
                onClick={() => goToFlow("home-weather", "k-weather")}
              >
                <div className={c.signImg} style={{ backgroundImage: `url(${img("weather-bg.webp")})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                <div>
                  <div className={c.signTitle}>Heavy rain likely on Thursday</div>
                  <div className={c.signDesc}>Humid, wet days favour fungal spread. Finish spraying by Wednesday.</div>
                </div>
              </button>
            </div>
          </section>

          {/* RevenueLossSection */}
          <div className={c.revenueWrap}>
            <div className={c.revenueCard}>
              <div>
                <p className={c.revenueTitle}>Revenue Loss</p>
                <p className={c.revenueSub}>Act now to protect your farm&apos;s income</p>
              </div>
              <div className={c.revenueVisuals}>
                <img src={img(MONEY[Math.min(3, Math.round(ratio(point) * 3))])} alt="" />
                <span className={c.revenueAmount}>
                  <b>{scaleLoss(STAGES[point].loss, acres)}</b>
                  <span>per {acres} Acres</span>
                </span>
              </div>
              <div className={c.timeline}>
                <div className={c.tractorRow}>
                  <img className={c.tractor} src={img("cd-tractor.webp")} alt="" style={{ left: tractorLeft }} />
                </div>
                <div className={c.track}>
                  <span className={c.trackBar} />
                  {STAGES.map((st, i) => (
                    <button
                      key={st.name}
                      type="button"
                      className={`${ui.btnReset} ${c.dot} ${i === point ? c.dotSelected : ""}`}
                      style={{ left: dotLeft(i), background: STAGE_COLORS[Math.min(3, Math.round(ratio(i) * 3))] }}
                      onClick={() => setPoint(i)}
                      aria-label={`Select ${stageLabel(i)}`}
                    />
                  ))}
                </div>
                <div className={c.timelineLabels}>
                  {STAGES.map((st, i) => (
                    <button
                      key={st.name}
                      type="button"
                      className={`${ui.btnReset} ${c.timelineLabel} ${i === point || i === CURRENT ? c.timelineLabelOn : ""}`}
                      onClick={() => setPoint(i)}
                    >
                      {stageLabel(i).replace(/\s+([^\s]+)$/, "\n$1")}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className={`${ui.btnReset} ${c.startTreatment} ${ui.hotspot}`}
                onClick={() => planRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
              >
                <Sparkles size={18} />
                <span>Start Treatment</span>
                <ChevronRight size={18} />
              </button>
              <div>
                <span className={c.farmsTitle}>Active Farms</span>
                <div className={c.farmsRow}>
                  {FARMS.map((f, i) => (
                    <button
                      key={f.name}
                      type="button"
                      className={`${ui.btnReset} ${c.farmChip} ${i === farm ? c.farmChipOn : ""}`}
                      onClick={() => setFarm(i)}
                    >
                      <Sprout size={16} color="#15803D" />
                      <span>
                        <small>{f.name}</small>
                        <br />
                        <b>{f.crop}</b>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* DiseaseProgressionSection */}
          <section className={c.section} style={{ background: "#FFF7ED" }}>
            <div className={c.sectionHead}>
              <p className={c.sectionTitle}>Early Stage Progression</p>
              <p className={c.sectionSub}>
                If left untreated, the disease may progress from ~45% to 80% spread in the next 4 days.
              </p>
            </div>
            <div className={c.progCard} ref={progRef}>
              {STAGES.map((st, i) => (
                <div
                  key={st.name}
                  className={c.progStage}
                  style={i === CURRENT ? { background: "#FFF7ED", borderColor: "#F97316", borderWidth: 2 } : undefined}
                >
                  <img src={img(st.image)} alt="" />
                  <b style={i === CURRENT ? { color: "#F97316" } : undefined}>{st.name}</b>
                  <span style={i === CURRENT ? { color: "#000", fontWeight: 700 } : undefined}>{stageLabel(i)}</span>
                </div>
              ))}
            </div>
            <p className={c.disclaimer}>*Images are reference purpose only. Actual crop may vary</p>
          </section>

          {/* TreatmentSection + MoreForFarmSection */}
          <div className={c.white}>
            <div className={c.treatment} ref={planRef}>
              <div className={c.sectionHead} style={{ gap: 12 }}>
                <div className={c.aiRow}>
                  <span className={c.aiBadge}>
                    <Sparkles size={14} color="#F97316" /> AI
                  </span>
                  <p className={c.sectionTitle}>Early Intervention Plan</p>
                </div>
                <p className={c.sectionSub}>Action for Spot Expansion</p>
              </div>
              {PLAN.map((p, i) => (
                <div key={p.title} className={c.stepCard}>
                  {!(i === 0 && done) && (
                    <span className={c.timingChip} style={{ background: p.chip.bg, color: p.chip.color }}>
                      {p.chip.label}
                    </span>
                  )}
                  <div>
                    <p className={c.stepTitle}>{p.title}</p>
                    <p className={c.stepDesc}>{p.desc}</p>
                  </div>
                  {i === PLAN.length - 1 ? (
                    <button type="button" className={`${ui.btnReset} ${c.rescanBtn}`} onClick={() => go("cd-camera")}>
                      <Timer size={18} color="#F97316" strokeWidth={2.2} /> Re-Scan
                    </button>
                  ) : i === 0 ? (
                    <button
                      type="button"
                      className={`${ui.btnReset} ${c.completeBtn}`}
                      style={{ background: done ? "#10B981" : "#004691" }}
                      onClick={() => setDone((v) => !v)}
                    >
                      {done ? "Completed" : "Mark as Completed"}
                      {done && <Check size={16} strokeWidth={2.5} />}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            <div className={c.softDivider} style={{ background: "rgba(249, 115, 22, 0.25)" }} />
            <div className={c.treatment} style={{ gap: 12 }}>
              <div className={c.prevHead}>
                <span className={c.prevTitle}>
                  <Shield size={18} color="#F97316" /> Preventive Actions
                </span>
                <span className={c.prevSub}>Stop future outbreaks before they start</span>
              </div>
              {PREVENTIVE.map(({ Icon, title, desc }) => (
                <div key={title} className={c.recCard}>
                  <span className={c.recIcon} style={{ background: "#FFEDD5" }}>
                    <Icon size={22} color="#F97316" />
                  </span>
                  <span>
                    <b>{title}</b>
                    <span>{desc}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className={c.moreFarm}>
              <div className={c.moreFarmCard}>
                <p className={c.moreFarmTitle}>More for your Farm</p>
                <div className={c.moreFarmRow}>
                  <button
                    type="button"
                    className={`${ui.btnReset} ${c.banner}`}
                    style={{ backgroundImage: `url(${img("cd-xsell-crop-monitor.webp")})` }}
                    onClick={() => goToFlow("farm-monitoring")}
                  >
                    <span>
                      Farm Monitor <ChevronRight size={16} strokeWidth={2.5} />
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`${ui.btnReset} ${c.banner}`}
                    style={{ backgroundImage: `url(${img("cd-xsell-crop-guide.webp")})` }}
                    onClick={() => goToFlow("crop-guide")}
                  >
                    <span>
                      Crop Guide <ChevronRight size={16} strokeWidth={2.5} />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Report history (crop-disease-screen.jsx) ----------

const HISTORY = [
  { crop: "Rice", disease: "Brown Spot", date: "Oct 21, 2026", sev: "Moderate" },
  { crop: "Wheat", disease: "Leaf Rust", date: "Oct 12, 2026", sev: "High" },
  { crop: "Tomato", disease: "Early Blight", date: "Sep 28, 2026", sev: "Moderate" },
  { crop: "Cotton", disease: "Healthy", date: "Sep 15, 2026", sev: "Low" },
];

const SEV = {
  High: { bg: "#FFEBEE", color: "#EF4444" },
  Moderate: { bg: "#FFF3E0", color: "#FF9500" },
  Low: { bg: "#E3F0FB", color: "#4CAF50" },
} as const;

function ReportHistory({ go }: ScreenProps) {
  return (
    <div className={c.screen}>
      <TopBar title="Crop Doctor Report" info={false} />
      <div className={c.scroll}>
        <div className={c.genCard}>
          <div className={c.genHead}>
            <span className={c.genIcon}>
              <Bug size={24} />
            </span>
            <span>
              <b>Generate New Disease Report</b>
              <span>AI-powered crop disease detection</span>
            </span>
          </div>
          <button type="button" className={`${ui.btnReset} ${c.genBtn}`} onClick={() => go("select-crop")}>
            Scan Now
          </button>
        </div>
        <p className={c.historyTitle}>Previous Diseases</p>
        {HISTORY.map((r, i) => (
          <div key={r.crop + r.date} className={c.reportCard}>
            <div>
              <p className={c.reportCropName}>{r.crop}</p>
              <p className={c.reportDisease}>{r.disease}</p>
              <span className={c.metaRow}>
                <Calendar size={12} color="#9CA3AF" /> {r.date} <span style={{ color: "#9CA3AF", margin: "0 4px" }}>•</span>
                <span className={c.sevBadge} style={{ background: SEV[r.sev as keyof typeof SEV].bg, color: SEV[r.sev as keyof typeof SEV].color }}>
                  {r.sev}
                </span>
              </span>
            </div>
            <button
              type="button"
              className={`${ui.btnReset} ${c.viewReport} ${i === 0 ? ui.hotspot : ""}`}
              onClick={() => go("report")}
            >
              View Report <ChevronRight size={16} />
            </button>
          </div>
        ))}
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

export const cropDoctorScreens: Record<string, ComponentType<ScreenProps>> = {
  "cd-category": CategoryCrops,
  "cd-request": RequestCrop,
  "cd-camera": CropCamera,
  "cd-review": ReviewPhoto,
  analyzing: AnalysisLoading,
  report: Report,
  "cd-healthy": HealthyResult,
  "cd-history": ReportHistory,
};

