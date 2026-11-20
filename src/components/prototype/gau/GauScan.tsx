/* eslint-disable @next/next/no-img-element -- fixed-size mock screens inside a phone frame */
"use client";

// Gau Sampurna scan flows, recreated from the `prod` branch (synced 2026-11-04 at 5b36102):
// gau-swastha-tenant/scan/new-scan-screen.jsx (hub + My Herd sheet) and scan-orchestrator-screen.jsx with
// its steps (LOADING → IMAGE_CAPTURE → IMAGE_CAMERA (the app's own camera) → IMAGE_CONFIRM (with the
// in-app crop editor) → ANALYZING → BREED_SELECT → REPORT_READY / DUNG_REPORT_READY / DX_REPORT_READY, ERROR),
// the subscription gate (hooks/useSubscriptionGate.js) and the "Udder Not Detected" modal. Five scan
// types share these steps; the full reports live in GauReports.tsx.
import { useEffect, useState, type ComponentType } from "react";
import {
  ArrowLeft,
  Camera,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Crop,
  Images,
  Image as ImageIcon,
  Plus,
  RotateCcw,
  RotateCw,
  ShieldCheck,
  X,
} from "lucide-react";
import s from "./gauScan.module.css";
import { GauAlert, gimg, u } from "./GauShared";
import { HERD } from "./GauHome";
import { ProCrownIcon } from "./GauIcons";
import type { ScreenProps } from "../kissan/KissanScreens";

export type ScanKind = "disease" | "status" | "market" | "dung" | "full";

export const SCAN_FLOW: Record<ScanKind, string> = {
  disease: "disease-check",
  status: "animal-status",
  market: "market-value",
  dung: "dung-scan",
  full: "full-health",
};

// The step to land on when a hub card launches another scan type's flow (skips that flow's hub)
const FLOW_START: Record<ScanKind, string> = {
  disease: "gs-capture",
  status: "gs-capture-status",
  market: "gs-capture-market",
  dung: "gs-capture-dung",
  full: "gs-gate-full",
};

// constants/scanTypes.js SCAN_TITLE_MAP
export const SCAN_TITLE: Record<ScanKind, string> = {
  disease: "Disease Diagnosis",
  status: "Animal Status",
  market: "Market Value",
  dung: "Cow Dung Check",
  full: "Full Health Checkup",
};

const SCAN_PHOTO: Record<ScanKind, string> = {
  disease: "gowri-side.jpg",
  status: "gowri-side.jpg",
  market: "gowri-side.jpg",
  dung: "dung-sample.webp",
  full: "gowri-side.jpg",
};

// orchestrator TopBarNew: title + cow name subtitle
function ScanTopBar({ kind, onBack }: { kind: ScanKind; onBack: () => void }) {
  return (
    <div className={s.topBar}>
      <button type="button" className={`${u.btnReset} ${s.back}`} onClick={onBack} aria-label="Back">
        <ArrowLeft size={26} />
      </button>
      <span className={s.topTitles}>
        <b>{SCAN_TITLE[kind]}</b>
        <small>Gowri</small>
      </span>
      <span className={s.spacer} />
    </div>
  );
}

// ---------- Hub (new-scan-screen.jsx) ----------

function HerdSheet({ selected, onSelect, onClose, onAdd }: { selected: string; onSelect: (name: string) => void; onClose: () => void; onAdd: () => void }) {
  return (
    <div className={s.herdOverlay} role="presentation" onClick={onClose}>
      <button type="button" className={`${u.btnReset} ${s.sheetClose}`} onClick={onClose}>
        Close
      </button>
      <div className={s.herdSheet} role="dialog" aria-label="My Herd" onClick={(e) => e.stopPropagation()}>
        <b className={s.sheetTitle}>My Herd</b>
        <div className={s.sheetList}>
          {HERD.map((c) => {
            const on = c.name === selected;
            return (
              <div key={c.name} className={s.cattleCard}>
                <img src={gimg(c.image)} alt="" />
                <span className={s.cattleDetails}>
                  <b>{c.name}</b>
                  <small>{c.age}</small>
                  <span>{c.breed}</span>
                </span>
                <button type="button" className={`${u.btnReset} ${s.selectBtn} ${on ? s.selectOn : ""}`} onClick={() => onSelect(c.name)}>
                  {on ? "Selected" : "Select"}
                </button>
              </div>
            );
          })}
        </div>
        <button type="button" className={`${u.btnReset} ${s.addCowBtn}`} onClick={onAdd}>
          <Plus size={20} />
          Add New Cow
        </button>
      </div>
    </div>
  );
}

function ScanHub({ next, goToFlow, kind }: ScreenProps & { kind: ScanKind }) {
  const [cow, setCow] = useState("Gowri");
  const [sheet, setSheet] = useState(false);
  const selected = HERD.find((c) => c.name === cow) ?? HERD[0];
  const start = (k: ScanKind) => (k === kind ? next() : goToFlow(SCAN_FLOW[k], FLOW_START[k]));
  const hot = (k: ScanKind) => (k === kind ? u.hotspot : "");
  return (
    <div className={u.screen}>
      <div className={s.hubHeader}>
        <button type="button" className={`${u.btnReset} ${s.back} ${s.backGreen}`} onClick={() => goToFlow("gs-home")} aria-label="Back">
          <ArrowLeft size={16} color="#1B4332" />
        </button>
        <button type="button" className={`${u.btnReset} ${s.upgradeBtn}`} onClick={() => goToFlow("gs-pratham")}>
          <ProCrownIcon size={19} color="#fff" />
          Upgrade to Pro
        </button>
        {/* The scan counter was removed from the header in prod; the slot keeps the badge centred */}
        <span className={s.counterSlot} aria-hidden="true" />
      </div>
      <div className={u.scroll}>
        <div className={s.herdBand}>
          <div className={s.cowCard}>
            <img src={gimg(selected.image)} alt="" />
            <span className={s.cowInfo}>
              <b>{selected.name}</b>
              <small>{selected.breed}</small>
            </span>
            <button type="button" className={`${u.btnReset} ${s.changeCow}`} onClick={() => setSheet(true)}>
              Change Cow
              <ChevronRight size={12} style={{ transform: "rotate(90deg)" }} />
            </button>
          </div>

          <section className={s.section}>
            <h3 className={s.sectionTitle}>Disease Diagnosis</h3>
            <div className={s.diseaseCard}>
              <span className={s.urgent}>Urgent</span>
              <span className={s.diseaseCopy}>
                <b>Cow unwell or Off-feed?</b>
                <span>Instant diagnosis in under a minute.</span>
              </span>
              <button type="button" className={`${u.btnReset} ${s.diseaseBtn} ${hot("disease")}`} onClick={() => start("disease")}>
                Start Disease Check
              </button>
            </div>
          </section>

          <section className={s.section}>
            <h3 className={s.sectionTitle}>Routine Scans</h3>
            <div className={s.routineRow}>
              {[
                { k: "status" as const, pill: "Recommended", pillBg: "#FFF1C7", img: "animal-status-illustration.png", title: "Animal Status", sub: "Weight & Health Score", action: "Scan Cow" },
                { k: "market" as const, pill: "Instant", pillBg: "#E0F2E9", img: "market-valuation-illustration.png", title: "Market Valuation", sub: "Final Price Estimate", action: "Check Value" },
              ].map((c) => (
                <button key={c.k} type="button" className={`${u.btnReset} ${s.routineCard} ${hot(c.k)}`} onClick={() => start(c.k)}>
                  <span className={s.timePill} style={{ background: c.pillBg }}>
                    {c.pill}
                  </span>
                  <img src={gimg(c.img)} alt="" />
                  <b>{c.title}</b>
                  <small>{c.sub}</small>
                  <span className={s.cardDivider} />
                  <span className={s.routineAction}>
                    {c.action}
                    <i>
                      <ChevronRight size={14} />
                    </i>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className={s.feedBand}>
          <h3 className={s.sectionTitle}>Feed &amp; Digestion</h3>
          <div className={s.dungCard}>
            <div className={s.dungRow}>
              <img src={gimg("dung-scan-illustration.png")} alt="" />
              <span className={s.dungDetails}>
                <span className={s.dungHead}>
                  <b>Dung Scan</b>
                  <span className={s.popular}>Popular</span>
                </span>
                <small>Check Digestion &amp; Feed Quality</small>
              </span>
            </div>
            <button type="button" className={`${u.btnReset} ${s.dungBtn} ${hot("dung")}`} onClick={() => start("dung")}>
              Scan Now
            </button>
          </div>
        </div>

        <div className={s.reportBand}>
          <span className={s.reportDivider} />
          <div className={s.reportCard}>
            <span className={s.ellipse1} />
            <span className={s.ellipse2} />
            <img src={gimg("health-report-mascot.png")} alt="" className={s.mascot} />
            <span className={s.reportCopy}>
              <b>360° Cow Health Report</b>
              <span>
                Disease risks, health score,
                <br />
                market value, and more.
              </span>
            </span>
            <button type="button" className={`${u.btnReset} ${s.reportBtn} ${hot("full")}`} onClick={() => start("full")}>
              Scan Now
              <i>
                <ChevronRight size={12} color="#E6C370" />
              </i>
            </button>
          </div>
        </div>
      </div>
      {sheet && (
        <HerdSheet
          selected={cow}
          onClose={() => setSheet(false)}
          onSelect={(name) => {
            setCow(name);
            setSheet(false);
          }}
          onAdd={() => goToFlow("gs-herd", "gs-add-cow")}
        />
      )}
    </div>
  );
}

// ---------- LOADING step + subscription gate ----------

function SettingUp() {
  return (
    <div className={s.center}>
      <span className={s.loadIcon}>
        <ShieldCheck size={28} color="#004691" />
      </span>
      <b className={s.h4}>Setting up your scan...</b>
      <small className={s.muted}>Verifying subscription</small>
    </div>
  );
}

function Loading({ next, back, kind }: ScreenProps & { kind: ScanKind }) {
  useEffect(() => {
    const t = setTimeout(next, 1400);
    return () => clearTimeout(t);
  }, [next]);
  return (
    <div className={u.screen}>
      <ScanTopBar kind={kind} onBack={back} />
      <SettingUp />
    </div>
  );
}

function Gate({ back, goToFlow }: ScreenProps) {
  return (
    <div className={u.screen}>
      <ScanTopBar kind="full" onBack={back} />
      <SettingUp />
      <GauAlert
        title="Feature Not Available"
        message="This feature is not included in your current plan. Upgrade to unlock it."
        actions={[
          { label: "Cancel", onPress: back },
          { label: "Upgrade", onPress: () => goToFlow("gs-pratham"), primary: true },
        ]}
      />
    </div>
  );
}

// ---------- IMAGE_CAPTURE (orchestrator-steps/ImageCaptureStep.jsx, prod Nov 2026) ----------
// A landing per scan type (constants/landingConfig.js): round back button and the title over a 240 hero
// photo, a white sheet overlapping it with the question and one help line, HOW IT WORKS in three pictures,
// then Open Camera / Choose from Gallery.

const LANDING: Record<ScanKind, { headline: string; help: string; step1: string; hero: string; step1Img: string }> = {
  full: { headline: "How healthy is she?", help: "Health, disease risk and market value from one photo.", step1: "FULL SIDE PHOTO", hero: "scan-hero-side-cow.webp", step1Img: "scan-step-take-photo-side.webp" },
  disease: { headline: "Is she unwell?", help: "Spot signs of disease early. Result in under a minute.", step1: "FULL SIDE PHOTO", hero: "scan-hero-side-cow.webp", step1Img: "scan-step-take-photo-side.webp" },
  status: { headline: "How is she doing?", help: "Her breed, health score and milk estimate.", step1: "FULL SIDE PHOTO", hero: "scan-hero-side-cow.webp", step1Img: "scan-step-take-photo-side.webp" },
  market: { headline: "What is she worth?", help: "A fair price range from one photo.", step1: "FULL SIDE PHOTO", hero: "scan-hero-side-cow.webp", step1Img: "scan-step-take-photo-side.webp" },
  dung: { headline: "Is she digesting well?", help: "Her dung shows how well she digests her feed.", step1: "DUNG PHOTO", hero: "scan-hero-dung.webp", step1Img: "scan-step-take-photo-dung.webp" },
};

// Screen ids per scan type: the disease flow has the bare ids, the others a suffix
const sid = (base: string, kind: ScanKind) => (kind === "disease" ? base : `${base}-${kind}`);

// scan-orchestrator-screen.jsx getImageInstruction / getReviewHint
const INSTRUCTION = (kind: ScanKind) => (kind === "dung" ? "Align the cow dung in the center of the frame" : "Capture the full side profile of the cow");
const REVIEW_HINT = (kind: ScanKind) =>
  kind === "dung" ? "Make sure the whole dung sample is clearly visible." : "Make sure the full body of the cow is visible in the frame.";
// constants/captureFraming.js: a head-to-tail side profile is 4:3, a dung pile square
const ASPECT = (kind: ScanKind) => (kind === "dung" ? "1 / 1" : "4 / 3");

function Capture({ go, back, kind }: ScreenProps & { kind: ScanKind }) {
  const c = LANDING[kind];
  const steps = [
    { img: c.step1Img, label: c.step1 },
    { img: "scan-step-get-report.webp", label: "GET REPORT" },
    { img: "scan-step-take-action.webp", label: "TAKE ACTION" },
  ];
  return (
    <div className={u.screen}>
      <div className={s.landTop}>
        <button type="button" className={`${u.btnReset} ${s.landBack}`} onClick={back} aria-label="Back to scan hub">
          <ChevronLeft size={24} color="#12324F" />
        </button>
        <span className={s.landTitles}>
          <b>{SCAN_TITLE[kind]}</b>
          <small>Gowri</small>
        </span>
      </div>
      <div className={`${u.scroll} ${s.landScroll}`}>
        <img className={s.landHero} src={gimg(c.hero)} alt="" />
        <div className={s.landSheet}>
          <b className={s.landHeadline}>{c.headline}</b>
          <p className={s.landHelp}>{c.help}</p>
          <div className={s.landDivider}>
            <i />
            <span>HOW IT WORKS</span>
            <i />
          </div>
          <div className={s.landSteps}>
            {steps.map((st, i) => (
              <span key={st.label} className={s.landStep}>
                <span className={s.landStepImg}>
                  <img src={gimg(st.img)} alt="" />
                  <b>{i + 1}</b>
                </span>
                <small>{st.label}</small>
              </span>
            ))}
          </div>
          <span className={s.landSpacer} />
          <div className={s.landButtons}>
            <button type="button" className={`${u.btnReset} ${s.landCamera} ${u.hotspot}`} onClick={() => go(sid("gs-camera", kind))}>
              <Camera size={22} />
              Open Camera
            </button>
            <button type="button" className={`${u.btnReset} ${s.landGallery}`} onClick={() => go(sid("gs-confirm", kind))}>
              <ImageIcon size={22} />
              Choose from Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- IMAGE_CAMERA (orchestrator-steps/CameraCaptureStep.jsx) ----------
// The app's own camera (not the OS one): framing box with corner marks, a hint pill, gallery and shutter

function CameraStep({ next, back, go, kind }: ScreenProps & { kind: ScanKind }) {
  const photo = gimg(SCAN_PHOTO[kind]);
  return (
    <div className={`${u.screen} ${s.camRoot}`}>
      <img className={s.camFeed} src={photo} alt="" />
      <div className={s.camTop}>
        <button type="button" className={`${u.btnReset} ${s.camIcon}`} onClick={back} aria-label="Back">
          <ArrowLeft size={22} />
        </button>
        <b>{SCAN_TITLE[kind]}</b>
        <span className={s.camIconSpace} />
      </div>
      <div className={s.frameWrap}>
        <div className={s.frameBox} style={{ aspectRatio: ASPECT(kind) }}>
          <img src={photo} alt="" />
          <i className={s.cTL} />
          <i className={s.cTR} />
          <i className={s.cBL} />
          <i className={s.cBR} />
        </div>
        <span className={s.hintPill}>{INSTRUCTION(kind)}</span>
      </div>
      <div className={s.camBottom}>
        <button type="button" className={`${u.btnReset} ${s.galleryBtn}`} onClick={() => go(sid("gs-confirm", kind))} aria-label="Choose from Gallery">
          <Images size={24} />
        </button>
        <button type="button" className={`${u.btnReset} ${s.shutter} ${u.hotspot}`} onClick={next} aria-label="Take photo">
          <span>
            <Camera size={28} />
          </span>
        </button>
        <span className={s.galleryBtn} style={{ visibility: "hidden" }} />
      </div>
    </div>
  );
}

// ---------- IMAGE_CONFIRM (orchestrator-steps/ImageConfirmStep.jsx + components/ImageCropEditor.jsx) ----------
// The photo fills the screen; ✕ / ✓ on top, the same pair as Kissan's crop camera. Cropping is opt-in.

function CropEditor({ kind, onDone }: { kind: ScanKind; onDone: () => void }) {
  return (
    <div className={`${u.screen} ${s.cropRoot}`}>
      <div className={s.cropTop}>
        <b>Crop Photo</b>
        <small>Pinch to zoom and drag to fit the animal inside the box</small>
      </div>
      <div className={s.cropStage}>
        <div className={s.cropWindow} style={{ aspectRatio: ASPECT(kind) }}>
          <img src={gimg(SCAN_PHOTO[kind])} alt="" />
          <i style={{ left: "33.33%" }} className={s.guideV} />
          <i style={{ left: "66.66%" }} className={s.guideV} />
          <i style={{ top: "33.33%" }} className={s.guideH} />
          <i style={{ top: "66.66%" }} className={s.guideH} />
        </div>
      </div>
      <div className={s.cropBottom}>
        <span className={s.action}>
          <button type="button" className={`${u.btnReset} ${s.roundBtn} ${s.rejectBtn}`} onClick={onDone} aria-label="Cancel">
            <X size={30} />
          </button>
          <small>Cancel</small>
        </span>
        <button type="button" className={`${u.btnReset} ${s.resetBtn}`}>
          <RotateCcw size={18} />
          Reset
        </button>
        <span className={s.action}>
          <button type="button" className={`${u.btnReset} ${s.roundBtn} ${s.confirmBtn} ${u.hotspot}`} onClick={onDone} aria-label="Apply">
            <Check size={30} />
          </button>
          <small>Apply</small>
        </span>
      </div>
    </div>
  );
}

function Confirm({ next, back, kind }: ScreenProps & { kind: ScanKind }) {
  const [cropping, setCropping] = useState(false);
  if (cropping) return <CropEditor kind={kind} onDone={() => setCropping(false)} />;
  return (
    <div className={`${u.screen} ${s.reviewRoot}`}>
      <img className={s.reviewImg} src={gimg(SCAN_PHOTO[kind])} alt="Captured photo" />
      <div className={s.reviewTop}>
        <p>{REVIEW_HINT(kind)}</p>
      </div>
      <div className={s.reviewBottom}>
        <button type="button" className={`${u.btnReset} ${s.cropBtn}`} onClick={() => setCropping(true)}>
          <Crop size={18} />
          Crop Photo
        </button>
        <div className={s.actionRow}>
          <span className={s.action}>
            <button type="button" className={`${u.btnReset} ${s.roundBtn} ${s.rejectBtn}`} onClick={back} aria-label="Try Again">
              <X size={32} />
            </button>
            <small>Try Again</small>
          </span>
          <span className={s.action}>
            <button type="button" className={`${u.btnReset} ${s.roundBtn} ${s.confirmBtn} ${u.hotspot}`} onClick={next} aria-label="Continue">
              <Check size={32} />
            </button>
            <small>Continue</small>
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------- ANALYZING (orchestrator-steps/AnalyzingStep.jsx) ----------

const ANALYSIS: Record<ScanKind, { title: string; subtitle: string; steps: string[]; tip: string }> = {
  disease: {
    title: "Diagnosing condition",
    subtitle: "Usually takes 15–30 seconds",
    steps: ["Image received", "Detecting visual symptoms", "Matching against conditions", "Generating diagnosis"],
    tip: "Don't close the app. Our AI is cross-referencing visual evidence with known cattle diseases.",
  },
  status: {
    title: "Analyzing your cow",
    subtitle: "Usually takes 30–60 seconds",
    steps: ["Image received", "Detecting breed & body condition", "Evaluating health parameters", "Generating report"],
    tip: "Don't close the app. We're analyzing body condition, breed purity, and economic parameters.",
  },
  full: {
    title: "Full health analysis",
    subtitle: "Usually takes 1–2 minutes",
    steps: ["Image received", "Detecting breed & body condition", "Scanning for diseases", "Evaluating all systems", "Generating comprehensive report"],
    tip: "Don't close the app. We're running a complete health assessment across all body systems.",
  },
  dung: {
    title: "Analyzing dung sample",
    subtitle: "Usually takes 10–15 seconds",
    steps: ["Image received", "Checking consistency", "Analyzing color and texture", "Generating recommendations"],
    tip: "Don't close the app. We're comparing against thousands of farm samples to give you the most accurate verdict.",
  },
  market: {
    title: "Analyzing your cow",
    subtitle: "Usually takes 30–60 seconds",
    steps: ["Image received", "Detecting breed & body condition", "Evaluating health parameters", "Generating report"],
    tip: "Don't close the app. We're analyzing body condition, breed purity, and economic parameters.",
  },
};

const STEP_MS = 800;

function Analyzing({ next, back, kind }: ScreenProps & { kind: ScanKind }) {
  const c = ANALYSIS[kind];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setTimeout(active >= c.steps.length ? next : () => setActive((a) => a + 1), active >= c.steps.length ? 300 : STEP_MS);
    return () => clearTimeout(t);
  }, [active, c.steps.length, next]);
  return (
    <div className={u.screen}>
      <ScanTopBar kind={kind} onBack={back} />
      <div className={s.analyzeBody}>
        <div className={s.ringWrap}>
          <span className={s.ring} />
          <span className={s.ringImg}>
            <img src={gimg(SCAN_PHOTO[kind])} alt="" />
          </span>
        </div>
        <div className={s.analyzeTitle}>
          <b className={s.h3}>{c.title}</b>
          <small className={s.muted}>{c.subtitle}</small>
        </div>
        <div className={s.steps}>
          {c.steps.map((label, i) => {
            const st = i < active ? "done" : i === active ? "active" : "pending";
            return (
              <span key={label} className={`${s.step} ${s[st]}`}>
                {st === "done" ? (
                  <CheckCircle2 size={24} color="#fff" fill="#16a34a" />
                ) : st === "active" ? (
                  <i className={s.activeCircle}>
                    <i />
                  </i>
                ) : (
                  <i className={s.pendingCircle} />
                )}
                {label}
                {st === "active" ? "..." : ""}
              </span>
            );
          })}
        </div>
        <div className={s.analyzeTip}>{c.tip}</div>
      </div>
    </div>
  );
}

// ---------- BREED_SELECT (orchestrator-steps/BreedSelectStep.jsx) ----------

const BREED_OPTIONS = ["HF Crossbreed", "Jersey Crossbreed", "Gir", "Sahiwal", "None of the Above"];

function BreedSelect({ next, back }: ScreenProps) {
  const [sel, setSel] = useState<string | null>(null);
  return (
    <div className={u.screen}>
      <ScanTopBar kind="status" onBack={back} />
      <div className={s.breedBody}>
        <div>
          <b className={s.h3}>Select your cow&apos;s breed</b>
          <p className={s.sub} style={{ textAlign: "left", marginTop: 8 }}>
            We couldn&apos;t identify the exact breed from the image. Please select the closest match.
          </p>
        </div>
        <div className={s.options}>
          {BREED_OPTIONS.map((o, i) => (
            <button key={o} type="button" className={`${u.btnReset} ${s.option} ${sel === o ? s.optionOn : ""} ${i === 2 && !sel ? u.hotspot : ""}`} onClick={() => setSel(o)}>
              <i className={s.radio}>{sel === o && <i />}</i>
              <b>{o}</b>
              {sel === o && <Check size={20} color="#004691" />}
            </button>
          ))}
        </div>
        <button type="button" className={`${u.btnReset} ${u.primary} ${sel ? "" : u.primaryDisabled}`} disabled={!sel} onClick={next}>
          Proceed
        </button>
      </div>
    </div>
  );
}

// ---------- ERROR (orchestrator-steps/ErrorStep.jsx) ----------

function ErrorScreen({ go, back }: ScreenProps) {
  return (
    <div className={u.screen}>
      <ScanTopBar kind="disease" onBack={back} />
      <div className={s.confirmBody}>
        <div className={s.previewArea}>
          <span className={s.errorIcon}>
            <CircleAlert size={48} color="#FF3B30" />
          </span>
          <b className={s.h3}>Oops!</b>
          <p className={s.sub}>Could not start the scan. Please try again.</p>
        </div>
        <div className={s.btnStack}>
          <button type="button" className={`${u.btnReset} ${u.primary} ${u.hotspot}`} onClick={() => go("gs-capture")}>
            <RotateCw size={20} />
            Try Again
          </button>
          <button type="button" className={`${u.btnReset} ${u.secondary}`} onClick={() => go("gs-hub")}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Udder Not Detected modal (scan-orchestrator-screen.jsx) ----------

function UdderNotDetected({ next, go, back }: ScreenProps) {
  return (
    <div className={u.screen}>
      <ScanTopBar kind="market" onBack={back} />
      <SettingUp />
      <div className={u.center} role="presentation">
        <div className={s.udderCard} role="alertdialog" aria-label="Udder Not Detected">
          <img src={gimg("gowri-side.jpg")} alt="" />
          <b>Udder Not Detected</b>
          <p>To provide an accurate health and production report, the cow&apos;s udder must be clearly visible in the photo.</p>
          <div className={s.udderBtns}>
            <button type="button" className={`${u.btnReset} ${s.udderSecondary}`} onClick={() => go("gs-capture-market")}>
              Re-upload
            </button>
            <button type="button" className={`${u.btnReset} ${s.udderPrimary} ${u.hotspot}`} onClick={next}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const withKind = (C: ComponentType<ScreenProps & { kind: ScanKind }>, kind: ScanKind) => {
  const Bound = (p: ScreenProps) => <C {...p} kind={kind} />;
  Bound.displayName = `${C.name}-${kind}`;
  return Bound;
};

export const gauScanScreens: Record<string, ComponentType<ScreenProps>> = {
  "gs-hub": withKind(ScanHub, "disease"),
  "gs-loading": withKind(Loading, "disease"),
  "gs-capture": withKind(Capture, "disease"),
  "gs-camera": withKind(CameraStep, "disease"),
  "gs-confirm": withKind(Confirm, "disease"),
  "gs-analyzing": withKind(Analyzing, "disease"),
  "gs-error": ErrorScreen,

  "gs-hub-status": withKind(ScanHub, "status"),
  "gs-capture-status": withKind(Capture, "status"),
  "gs-camera-status": withKind(CameraStep, "status"),
  "gs-confirm-status": withKind(Confirm, "status"),
  "gs-analyzing-status": withKind(Analyzing, "status"),
  "gs-breed": BreedSelect,

  "gs-hub-market": withKind(ScanHub, "market"),
  "gs-capture-market": withKind(Capture, "market"),
  "gs-camera-market": withKind(CameraStep, "market"),
  "gs-confirm-market": withKind(Confirm, "market"),
  "gs-analyzing-market": withKind(Analyzing, "market"),
  "gs-udder": UdderNotDetected,

  "gs-hub-dung": withKind(ScanHub, "dung"),
  "gs-capture-dung": withKind(Capture, "dung"),
  "gs-camera-dung": withKind(CameraStep, "dung"),
  "gs-confirm-dung": withKind(Confirm, "dung"),
  "gs-analyzing-dung": withKind(Analyzing, "dung"),

  "gs-hub-full": withKind(ScanHub, "full"),
  "gs-gate-full": Gate,
  "gs-capture-full": withKind(Capture, "full"),
  "gs-camera-full": withKind(CameraStep, "full"),
  "gs-confirm-full": withKind(Confirm, "full"),
  "gs-analyzing-full": withKind(Analyzing, "full"),
};
