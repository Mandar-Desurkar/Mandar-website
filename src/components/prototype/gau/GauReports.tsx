/* eslint-disable @next/next/no-img-element -- fixed-size mock screens inside a phone frame */
"use client";

// Gau Sampurna full reports, recreated from the `prod` branch (synced 2026-11-04 at 5b36102):
// diagnosis-results-screen.jsx + components/DiseaseReport.jsx (the 31-disease Gau Gopalan Seva report),
// animal-status-report-screen.jsx (Animal Status, the focused Market Value layout and the Full Health
// Checkup with its Status / Diseases / Nutrition anchors) and cow-dung-results-screen.jsx. Reports are
// not a paid surface any more (scan/hooks/useReportUnlocked.js): the allowance is spent when a scan
// starts, so nothing is blurred and there is no "Unlock Full Report" banner. Values are samples.
import { useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Brain,
  Bug,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  CircleHelp,
  CircleMinus,
  Eye,
  Info,
  ListChecks,
  Phone,
  Plus,
  Share2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TriangleAlert,
  Weight,
} from "lucide-react";
import r from "./gauReports.module.css";
import { PRODUCTS, ProductCard, gimg, rupee, u } from "./GauShared";
import type { ScreenProps } from "../kissan/KissanScreens";

const GREEN = "#008026";
const ORANGE = "#E65100";
const RED = "#C62828";
const YELLOW = "#F9A825";

function ReportHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className={r.header}>
      <button type="button" className={`${u.btnReset} ${r.circle}`} onClick={onBack} aria-label="Back">
        <ArrowLeft size={18} />
      </button>
      <span className={r.headerTitle}>{title}</span>
      <span className={r.circle} aria-hidden="true">
        <Share2 size={17} />
      </span>
    </div>
  );
}

function VetAlert({ signs, label = "Free vet helpline · Call now" }: { signs: string[]; label?: string }) {
  return (
    <div className={r.vetCard}>
      <span className={r.vetAccent} />
      <div className={r.vetBody}>
        <span className={r.vetHead}>
          <i>!</i>
          Call a vet immediately if
        </span>
        {signs.map((sgn) => (
          <span key={sgn} className={r.vetBullet}>
            <i />
            {sgn}
          </span>
        ))}
        <a className={r.vetCall} href="tel:9686762626" onClick={(e) => e.preventDefault()}>
          <Phone size={18} /> {label}
        </a>
      </div>
    </div>
  );
}

function Recommended({ goToFlow }: { goToFlow: ScreenProps["goToFlow"] }) {
  return (
    <section className={r.recSection}>
      <span className={r.sectionTitle}>RECOMMENDED FOR YOU</span>
      <div className={u.hScroll} style={{ padding: "0 0 4px" }}>
        {PRODUCTS.slice(0, 3).map((p) => (
          <ProductCard key={p.id} p={p} onOpen={() => goToFlow("gs-shop", "gs-product")} />
        ))}
      </div>
    </section>
  );
}

// ---------- 1. Disease diagnosis (components/DiseaseReport.jsx, ui_version 1.1) ----------
// One pass over all 31 conditions. Every condition is detected, suspected, ruled out or not assessable
// (the photo could not show it); severity only appears on a positive finding.

const TONE = { Moderate: { bg: "#FFF3E0", fg: ORANGE }, Mild: { bg: "#FFFDE7", fg: YELLOW }, Severe: { bg: "#FFEBEE", fg: RED } } as const;
const SLATE = "#64748B";

type Finding = {
  name: string;
  grade: keyof typeof TONE;
  confidence?: string;
  suspected?: boolean;
  shows: string[];
  why: string;
  against?: string[];
  urgency: string;
  confirm: string;
  ask: string[];
};

const FINDINGS: Finding[] = [
  {
    name: "Mastitis",
    grade: "Moderate",
    confidence: "HIGH",
    shows: ["Rear quarters look swollen and uneven", "Reddening on the rear left quarter"],
    why: "Swelling and asymmetry on the rear quarters, with reddened skin, match early clinical mastitis.",
    against: ["No visible cuts or scabs on the teats"],
    urgency: "Moderate. Treat within 24 hours to protect this lactation's milk.",
    confirm: "Strip the first milk from each quarter into a dark cup and look for clots. A vet confirms with a CMT test and prescribes treatment; keep her milk out of the can until the withdrawal period ends.",
    ask: ["Are there clots or flakes in her milk?", "Is the udder hot or painful to touch?", "Has her milk dropped in the last two days?"],
  },
  {
    name: "Tick Infestation",
    grade: "Mild",
    suspected: true,
    shows: ["Small dark spots on the udder and inner thigh that may be ticks"],
    why: "The spots sit where ticks gather, but the photo is too far away to be sure.",
    urgency: "Mild. Check her this week.",
    confirm: "Part the hair at the udder, ears and tail base and look for ticks. Ask the vet about a tick treatment for the whole herd.",
    ask: ["Have you seen ticks on her or the other cows?", "When was she last treated for ticks?"],
  },
];

// Retake hints cluster by body part, so eleven instructions become six photos worth taking
const UNCHECKED = [
  { region: "Mouth and feet", hint: "Close-up of the mouth, tongue and all four feet", names: ["Foot and Mouth Disease", "Wooden Tongue", "Listeriosis"] },
  { region: "Udder and teats", hint: "Side and rear view of the udder showing all four quarters; image of milk in strip cup if possible", names: ["Mammillitis", "Thelitis"] },
  { region: "Eyes", hint: "Close-up of both eyes in daylight", names: ["Pink Eye", "Squamous Cell Carcinoma (eye)"] },
  { region: "Skin", hint: "Close-up of the skin on the neck and back", names: ["Dermatophilosis", "Warts"] },
  { region: "Face", hint: "Front view of face showing both ears and eyes", names: ["Lumpy Jaw"] },
  { region: "Full side view", hint: "Side view with the cow walking", names: ["Knuckling of Fetlock"] },
];

const RULED_OUT: { name: string; reason: string; noted?: string }[] = [
  { name: "Bloat", reason: "Left flank is not distended." },
  { name: "Traumatic Reticuloperitonitis", reason: "Normal, relaxed stance." },
  { name: "Ketosis", reason: "Alert, with a full rumen.", noted: "slightly low body fat" },
  { name: "Diarrhoea", reason: "Hindquarters are clean." },
  { name: "Radial Nerve Paralysis", reason: "Bears weight on both forelegs." },
  { name: "Medial Patellar Luxation", reason: "Hind legs are straight." },
  { name: "Achilles Tendon Rupture", reason: "Hocks look normal." },
  { name: "Flying Scapula", reason: "Shoulders sit level." },
  { name: "Tetanus", reason: "No stiffness in the stance." },
  { name: "Hygroma", reason: "No swelling on the knees." },
  { name: "Milk Fever", reason: "Standing and alert." },
  { name: "Abscess", reason: "No lumps on the body." },
  { name: "Lantana Toxicity", reason: "Skin is not cracked or yellowed." },
  { name: "Lumpy Skin Disease", reason: "No nodules on the skin." },
  { name: "Fly Menace", reason: "No fly clusters on the body." },
  { name: "Prolapse", reason: "Nothing visible at the vulva." },
  { name: "Prescapular Lymph Node Enlargement", reason: "Not clearly enlarged.", noted: "the node in front of the shoulder looks slightly full, explained by the tick load" },
  { name: "Blood Parasites", reason: "Gums and eyes are not pale." },
];

function Chip({ label, bg, fg, icon }: { label: string; bg: string; fg: string; icon?: ReactNode }) {
  return (
    <span className={r.dxChip} style={{ background: bg, color: fg }}>
      {icon}
      {label}
    </span>
  );
}

function Field({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className={r.dxField}>
      <span className={r.dxFieldHead}>
        {icon}
        {label}
      </span>
      {children}
    </div>
  );
}

function Bullets({ items, color, round }: { items: string[]; color: string; round?: boolean }) {
  return (
    <span className={r.dxBullets}>
      {items.map((line) => (
        <span key={line} className={r.dxBulletRow}>
          {round ? <Circle size={14} color={color} /> : <i style={{ background: color }} />}
          {line}
        </span>
      ))}
    </span>
  );
}

function FindingCard({ f, defaultOpen }: { f: Finding; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const tone = TONE[f.grade];
  return (
    <div className={r.dxFinding} style={{ borderLeftColor: tone.fg }}>
      <button type="button" className={`${u.btnReset} ${r.dxFindingHead}`} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className={r.dxFindingTitle}>
          <b>{f.name}</b>
          <span className={r.dxChipRow}>
            <Chip label={f.grade} bg={tone.bg} fg={tone.fg} />
            {f.confidence && <Chip label={`${f.confidence} confidence`} bg="#EEF2FF" fg="#004691" />}
            {f.suspected && <Chip label="Suspected" bg="#FFF7ED" fg={ORANGE} icon={<CircleHelp size={12} />} />}
          </span>
        </span>
        {open ? <ChevronUp size={24} color={SLATE} /> : <ChevronDown size={24} color={SLATE} />}
      </button>
      {open && (
        <div className={r.dxFindingBody}>
          <Field icon={<Eye size={15} />} label="What the photo shows">
            <Bullets items={f.shows} color={tone.fg} />
          </Field>
          <Field icon={<Brain size={15} />} label="Why this diagnosis">
            <p className={r.dxText}>{f.why}</p>
          </Field>
          {f.against && (
            <Field icon={<CircleMinus size={15} />} label="Points against">
              <Bullets items={f.against} color={SLATE} />
            </Field>
          )}
          <Field icon={<TriangleAlert size={15} />} label="Severity and urgency">
            <p className={r.dxCallout} style={{ background: tone.bg, color: tone.fg }}>
              {f.urgency}
            </p>
          </Field>
          <Field icon={<Stethoscope size={15} />} label="How to confirm and treat">
            <p className={r.dxText}>{f.confirm}</p>
          </Field>
          <Field icon={<CircleHelp size={15} />} label="Check these yourself">
            <Bullets items={f.ask} color="#004691" round />
          </Field>
        </div>
      )}
    </div>
  );
}

function Collapsible({ icon, iconBg, title, subtitle, children }: { icon: ReactNode; iconBg: string; title: string; subtitle: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={r.dxCard}>
      <button type="button" className={`${u.btnReset} ${r.dxCardHead}`} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className={r.dxCardIcon} style={{ background: iconBg }}>
          {icon}
        </span>
        <span className={r.dxCardText}>
          <b>{title}</b>
          <small>{subtitle}</small>
        </span>
        {open ? <ChevronUp size={24} color={SLATE} /> : <ChevronDown size={24} color={SLATE} />}
      </button>
      {open && <div className={r.dxCardBody}>{children}</div>}
    </div>
  );
}

function Diagnosis({ back, go, goToFlow }: ScreenProps) {
  const unchecked = UNCHECKED.reduce((n, g) => n + g.names.length, 0);
  return (
    <div className={u.screen}>
      <ReportHeader title="Disease Diagnosis" onBack={back} />
      <div className={`${u.scroll} ${r.body} ${r.dxBody}`}>
        <div className={r.dxHero}>
          <img src={gimg("gowri-side.jpg")} alt="" />
          <span className={r.dxHeroChips}>
            <Chip label="Gowri" bg="#FFFFFFEE" fg="#0F172A" />
            <Chip label="Right side view" bg="#FFFFFFEE" fg={SLATE} icon={<Camera size={12} />} />
          </span>
        </div>

        <div className={r.dxVerdict} style={{ background: TONE.Moderate.bg }}>
          <span className={r.dxVerdictLabel}>MOST LIKELY</span>
          <b style={{ color: TONE.Moderate.fg }}>Mastitis</b>
          <span className={r.dxVerdictCode}>D28 · Clinical mastitis</span>
          <p>Gowri&apos;s rear quarters are swollen and uneven with reddened skin, which points to mastitis in its early clinical stage.</p>
        </div>

        <div className={r.dxTally}>
          {[
            [FINDINGS.filter((f) => !f.suspected).length, "Detected", RED],
            [FINDINGS.filter((f) => f.suspected).length, "Suspected", ORANGE],
            [RULED_OUT.length, "Ruled out", GREEN],
            [unchecked, "Unchecked", ORANGE],
          ].map(([n, label, color]) => (
            <span key={label as string}>
              <b style={{ color: color as string }}>{n}</b>
              <small>{label}</small>
            </span>
          ))}
        </div>
        <small className={r.dxScreened}>31 diseases screened from one photo</small>

        <div className={r.dxVet}>
          <span>
            <b>A vet should see this cow</b>
            <small>Show them this report. Our helpline is free.</small>
          </span>
          <a className={r.dxVetBtn} href="tel:18004197848" onClick={(e) => e.preventDefault()}>
            <Phone size={16} /> Call
          </a>
        </div>

        <b className={r.dxHeading}>Findings</b>
        {FINDINGS.map((f, i) => (
          <FindingCard key={f.name} f={f} defaultOpen={i === 0} />
        ))}

        <b className={r.dxHeading}>The rest of the screening</b>
        <Collapsible icon={<Camera size={18} color={ORANGE} />} iconBg="#FFF7ED" title={`${unchecked} could not be checked`} subtitle="This photo did not show what they need">
          {UNCHECKED.map((g) => (
            <div key={g.region} className={r.dxRetake}>
              <span className={r.dxRetakeHead}>
                <b>{g.region}</b>
                <small>{g.names.length} check(s)</small>
              </span>
              <span className={r.dxRetakeHint}>
                <Camera size={13} color={SLATE} />
                {g.hint}
              </span>
              <small className={r.dxRetakeNames}>{g.names.join(", ")}</small>
            </div>
          ))}
          <button type="button" className={`${u.btnReset} ${r.dxRescan}`} onClick={() => go("gs-capture")}>
            <Camera size={18} /> Scan again with a new photo
          </button>
        </Collapsible>
        <Collapsible icon={<Check size={18} color={GREEN} />} iconBg="#E8F5E9" title={`${RULED_OUT.length} ruled out`} subtitle="Checked in this photo, nothing found">
          {RULED_OUT.map((it) => (
            <div key={it.name} className={r.dxCleared}>
              <span className={r.dxClearedName}>
                <CheckCircle2 size={15} color={GREEN} />
                <b>{it.name}</b>
              </span>
              <small className={r.dxClearedReason}>{it.reason}</small>
              {it.noted && (
                <span className={r.dxNoted}>
                  <Info size={13} color={ORANGE} />
                  Noted anyway: {it.noted}
                </span>
              )}
            </div>
          ))}
        </Collapsible>

        <Recommended goToFlow={goToFlow} />
      </div>
    </div>
  );
}

// ---------- 2 + 3. Animal Status / Full Health (animal-status-report-screen.jsx) ----------

const PURITY = [
  { label: "C", color: "#9E9E9E", pct: 10 },
  { label: "B", color: YELLOW, pct: 20 },
  { label: "A3", color: "#A5D6A7", pct: 20 },
  { label: "A2", color: "#66BB6A", pct: 25 },
  { label: "A1", color: "#1B5E20", pct: 25 },
];

const PURITY_LEGEND = [
  ["A1", "Highest Purity", ">95%"],
  ["A2", "Very High", "85-95%"],
  ["A3", "High Purity", "75-85%"],
  ["B", "Moderate Purity", "65-75%"],
  ["C", "Low Purity", "<65%"],
];

const SEV: Record<string, { bg: string; color: string }> = {
  URGENT: { bg: "#FFEBEE", color: RED },
  MODERATE: { bg: "#FFF3E0", color: ORANGE },
  NORMAL: { bg: "#E8F5E9", color: GREEN },
  LOW: { bg: "#E8F5E9", color: GREEN },
};

const SYSTEMS = [
  {
    name: "Mammary System",
    diseases: [
      { id: "mast", name: "Mastitis", severity: "MODERATE", detected: true, interp: "Rear quarters look swollen and the skin is reddened.", rec: "Strip-test the milk, milk her last and call a vet for treatment." },
      { id: "teat", name: "Teat injury", severity: "LOW", detected: false, interp: "No cuts or scabs visible.", rec: "Keep using a teat dip after milking." },
    ],
  },
  {
    name: "Skin",
    diseases: [{ id: "lsd", name: "Lumpy Skin Disease", severity: "NORMAL", detected: false, interp: "No raised nodules on the skin.", rec: "Keep the vaccination schedule up to date." }],
  },
  {
    name: "Digestive System",
    diseases: [{ id: "bloat", name: "Bloat", severity: "NORMAL", detected: false, interp: "Left flank looks normal.", rec: "Introduce new green fodder slowly." }],
  },
];

const DIET_TABS = [
  {
    label: "Maize silage based diet",
    rows: [
      ["Maize silage", "15 kg/Day"],
      ["Ragi Straw/Wheat Straw/Paddy Straw", "4 kg/Day"],
      ["Cattle Feed 22% CP", "4 kg/Day"],
      ["Groundnut cake/Soya meal/Mustard Cake", "1 kg/Day"],
      ["Dairy Fortune (Complete Feed Suppliment)", "100 g/Day"],
    ],
  },
  {
    label: "Green & Dry fodder based Diet",
    rows: [
      ["Green Fodder( BNH-11-14/Super Napier/ COFS 29,30)", "25 kg/Day"],
      ["Ragi Straw/Wheat Straw/Paddy Straw", "5 kg/Day"],
      ["Cattle Feed 18-20% CP", "4.5 kg/Day"],
      ["Maize Powder/Wheat Bran", "1 kg/Day"],
      ["Dairy Fortune (Complete Feed Suppliment)", "100 g/Day"],
    ],
  },
];

const RATION = {
  Morning: [["Cattle Feed 22% CP", "2 kg"], ["Green fodder", "10 kg"]],
  Afternoon: [["Dry straw", "3 kg"], ["Water", "40 L"]],
  Evening: [["Cattle Feed 22% CP", "2 kg"], ["Green fodder", "15 kg"], ["Dairy Fortune", "100 g"]],
} as const;

// Reports are not a paid surface (useReportUnlocked): what used to be frosted is simply shown
function Gated({ children }: { children: ReactNode; bg?: string }) {
  return <div className={r.open}>{children}</div>;
}

function StatusReport({ back, goToFlow, full }: ScreenProps & { full?: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const anchors = useRef<Record<string, HTMLElement | null>>({});
  const [dietTab, setDietTab] = useState(0);
  const [meal, setMeal] = useState<keyof typeof RATION>("Morning");
  const [expanded, setExpanded] = useState<string | null>("mast");
  const jump = (key: string) => {
    const el = anchors.current[key];
    const sc = scrollRef.current;
    if (el && sc) sc.scrollTo({ top: el.offsetTop - sc.offsetTop - 8, behavior: "smooth" });
  };
  return (
    <div className={u.screen}>
      <ReportHeader title={full ? "Full Health" : "Gowri - Animal Status"} onBack={back} />
      {full && (
        <div className={r.anchorNav}>
          {[
            ["status", "Status"],
            ["disease", "Diseases"],
            ["nutrition", "Nutrition"],
          ].map(([k, label]) => (
            <button key={k} type="button" className={`${u.btnReset} ${r.anchorBtn}`} onClick={() => jump(k)}>
              {label}
            </button>
          ))}
        </div>
      )}
      <div ref={scrollRef} className={`${u.scroll} ${r.body}`}>
        <div className={r.cattleInfo} ref={(el) => void (anchors.current.status = el)}>
          <img src={gimg("gowri-side.jpg")} alt="" />
          <span>
            <b className={r.breed}>Gir</b>
            <span className={r.metaRow}>
              <span className={r.gradeBadge}>Grade A2</span>
              <span className={r.verified}>
                <BadgeCheck size={13} /> VERIFIED
              </span>
            </span>
            <small>
              <Weight size={12} /> Weight: 412 kg
            </small>
            <small>
              <CalendarDays size={12} /> 21 Oct 2026
            </small>
          </span>
        </div>

        <section className={r.section}>
          <span className={r.sectionTitle}>HEALTH CHECKS</span>
          <div className={r.checksRow}>
            {[
              [28, "CLEAR", GREEN, "#E8F5E9"],
              [2, "WATCH", YELLOW, "#FFF8E1"],
              [1, "VET", RED, "#FFEBEE"],
            ].map(([n, label, color, bg]) => (
              <span key={label} className={r.checkStat} style={{ background: bg as string, color: color as string }}>
                <b>{n}</b>
                {label}
              </span>
            ))}
          </div>
        </section>

        <section className={r.section}>
          <span className={r.sectionTitle}>DETAILED CHECKS</span>
          <Gated>
            <p className={r.triage} style={{ color: RED }}>VET · Udder swelling</p>
            <p className={r.triage} style={{ color: "#B26A00" }}>WATCH · Slightly low body fat · Mild limp</p>
            <p className={r.triage} style={{ color: GREEN }}>CLEAR · Coat, eyes, posture, rumen fill and 24 more</p>
          </Gated>
        </section>

        <section className={r.section}>
          <span className={r.sectionTitle}>
            <Sparkles size={15} /> AI SUMMARY
          </span>
          <Gated>
            <span className={r.summaryStatus}>Needs attention</span>
            <p className={r.barText}>Gowri is in good body condition but shows early udder swelling. Treat early to protect her milk yield.</p>
          </Gated>
        </section>

        <section className={r.patternCard}>
          <span className={r.sectionTitle} style={{ color: ORANGE }}>
            <TriangleAlert size={15} /> PATTERN DETECTED
          </span>
          <Gated bg="#FFF3E0">
            <b>Milk drop + udder swelling</b>
            <p className={r.barText}>Together these point to early mastitis rather than a feed problem.</p>
          </Gated>
        </section>

        <section className={r.section}>
          <span className={r.sectionTitle}>BREED PURITY SCALE</span>
          <div className={r.purityBar}>
            <span className={r.tooltip} style={{ left: "62.5%" }}>
              A2
            </span>
            {PURITY.map((g) => (
              <span key={g.label} style={{ flex: g.pct, background: g.color }} />
            ))}
          </div>
          <div className={r.purityLabels}>
            {PURITY.map((g) => (
              <span key={g.label} style={{ flex: g.pct }} className={g.label === "A2" ? r.purityActive : undefined}>
                {g.label}
              </span>
            ))}
          </div>
          <div className={r.legend}>
            {PURITY_LEGEND.map(([g, badge, range]) => (
              <span key={g} className={g === "A2" ? r.legendOn : undefined}>
                <b>{g}</b> {badge} <small>{range}</small>
              </span>
            ))}
          </div>
        </section>

        <section className={r.section}>
          <span className={r.sectionTitle}>ECONOMIC PARAMETERS</span>
          <div className={r.econGrid}>
            <span>
              <small>Body Condition Score</small>
              <b>
                3.5<em>/5</em>
              </b>
              <i className={r.bcsBar}>
                <i style={{ width: "70%" }} />
              </i>
            </span>
            <span>
              <small>Milk Capacity</small>
              <b>
                12–14 <em>L/day</em>
              </b>
            </span>
            <span>
              <small>Lactation Yield</small>
              <b>
                3,600 <em>L</em>
              </b>
            </span>
            <span>
              <small>Breeding Quality</small>
              <b>Good</b>
            </span>
          </div>
          <div className={r.marketRow}>
            <span>
              <small>Est. Market Value</small>
              <b>₹78,000 – ₹86,000</b>
            </span>
            <span className={r.buyRec}>
              <small>Buying Rec.</small>
              <b>✓ Yes</b>
            </span>
          </div>
        </section>

        <section className={r.section}>
          <span className={r.sectionTitle}>KEY FINDINGS</span>
          <Gated>
            <p className={r.flag} style={{ color: RED }}>RED FLAGS · Rear udder swelling</p>
            <p className={r.flag} style={{ color: GREEN }}>POSITIVE · Strong frame, healthy coat, good rumen fill</p>
          </Gated>
        </section>

        {full && (
          <section className={r.section} ref={(el) => void (anchors.current.disease = el)}>
            <span className={r.sectionTitle}>
              <Bug size={16} color={GREEN} /> DISEASE PREDICTION
            </span>
            {SYSTEMS.map((sys) => (
              <div key={sys.name} className={r.system}>
                <span className={r.systemHead}>
                  {sys.name}
                  <i>{sys.diseases.length}</i>
                </span>
                {sys.diseases.map((d) => {
                  const open = expanded === d.id;
                  return (
                    <div key={d.id} className={`${r.diseaseItem} ${d.detected ? r.detected : ""}`}>
                      <button type="button" className={`${u.btnReset} ${r.diseaseHead}`} onClick={() => setExpanded(open ? null : d.id)} aria-expanded={open}>
                        <b style={d.detected ? { color: ORANGE } : undefined}>{d.name}</b>
                        <span className={r.sevBadge} style={{ background: SEV[d.severity].bg, color: SEV[d.severity].color }}>
                          <i style={{ background: SEV[d.severity].color }} />
                          {d.severity === "LOW" ? "LOW RISK" : d.severity}
                        </span>
                        <ChevronDown size={20} color="#666" style={{ transform: open ? "rotate(180deg)" : undefined }} />
                      </button>
                      {open && (
                        <span className={r.diseaseBody}>
                          <span className={r.diagTitle}>
                            <Eye size={15} /> Interpretation
                          </span>
                          <span className={r.barText}>{d.interp}</span>
                          <span className={r.diagTitle}>
                            <ShieldCheck size={15} /> Recommendation
                          </span>
                          <Gated>
                            <span className={r.barText}>{d.rec}</span>
                          </Gated>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </section>
        )}

        <section className={r.section}>
          <span className={r.sectionTitle}>RECOVERY PLAN</span>
          <Gated>
            {["Day 1 · Strip-test milk and call the vet", "Day 2–4 · Follow the treatment, milk her last", "Day 7 · Re-scan Gowri to confirm recovery"].map((st) => (
              <p key={st} className={r.timelineStep}>
                <i />
                {st}
              </p>
            ))}
          </Gated>
        </section>

        <section className={r.section} ref={(el) => void (anchors.current.nutrition = el)}>
          <span className={r.sectionTitle}>NUTRITION RECOMMENDATIONS - BALANCED RATION</span>
          <div className={r.dietTabs}>
            {DIET_TABS.map((d, i) => (
              <button key={d.label} type="button" className={`${u.btnReset} ${r.dietTab} ${dietTab === i ? r.dietTabOn : ""}`} onClick={() => setDietTab(i)}>
                {d.label}
              </button>
            ))}
          </div>
          <Gated>
            {DIET_TABS[dietTab].rows.map(([item, qty]) => (
              <span key={item} className={r.dietRow}>
                <span>{item}</span>
                <b>{qty}</b>
              </span>
            ))}
          </Gated>
          <small className={r.dietNote}>
            Above feed and fodder recommendations based on body weight and milk production. For Precision Formulation contact Silo Fortune Animal Nutritionist.
          </small>
        </section>

        <section className={r.section}>
          <span className={r.rowBetween}>
            <span className={r.sectionTitle}>DAILY RATION</span>
            <span className={r.dietTag}>Optimized for Milk</span>
          </span>
          <div className={r.dietTabs}>
            {(Object.keys(RATION) as (keyof typeof RATION)[]).map((m) => (
              <button key={m} type="button" className={`${u.btnReset} ${r.dietTab} ${meal === m ? r.dietTabOn : ""}`} onClick={() => setMeal(m)}>
                {m}
              </button>
            ))}
          </div>
          <Gated>
            {RATION[meal].map(([item, qty]) => (
              <span key={item} className={r.dietRow}>
                <span>{item}</span>
                <b>{qty}</b>
              </span>
            ))}
          </Gated>
        </section>

        <Recommended goToFlow={goToFlow} />
        <VetAlert signs={["High fever or she stops eating", "Milk turns watery or bloody", "She cannot stand up"]} />
        <p className={r.disclaimer}>
          Disclaimer: This report is generated by AI based on visual inputs. Estimates for market value and health status are indicative. Please consult a qualified veterinarian or livestock expert for final decisions.
        </p>
      </div>
    </div>
  );
}

// ---------- 4. Market Value (focused layout in animal-status-report-screen.jsx) ----------

function MarketReport({ back, goToFlow }: ScreenProps) {
  return (
    <div className={u.screen}>
      <ReportHeader title="Gowri - Market Value" onBack={back} />
      <div className={`${u.scroll} ${r.mvBody}`}>
        <div className={r.mvHero}>
          <div className={r.mvImage}>
            <img src={gimg("gowri-side.jpg")} alt="" />
            <span className={r.mvVerified}>
              <BadgeCheck size={24} color="#004691" />
            </span>
          </div>
          <small className={r.mvLabel}>ESTIMATED MARKET VALUATION</small>
          <b className={r.mvAmount}>₹78,000 – ₹86,000</b>
        </div>
        <div className={r.mvSectionHead}>
          <span>HEALTH &amp; QUALITY ANALYSIS</span>
          <i>VERIFIED</i>
        </div>
        <div className={r.mvGrid}>
          {[
            ["🐄", "#EFF6FF", "Breed Purity", "Gir (A2)"],
            ["🛡️", "#F5F0E0", "Body Condition Score", "3.5/5"],
            ["△", "#F3F4F6", "Lactation", "Mid lactation"],
            ["⚖️", "#F3F4F6", "Weight", "412 kg"],
          ].map(([icon, bg, label, value]) => (
            <span key={label} className={r.mvCard}>
              <i style={{ background: bg }}>{icon}</i>
              <small>{label}</small>
              <b>{value}</b>
            </span>
          ))}
        </div>
        <div className={r.mvExtra}>
          <span>
            <small>Milk Capacity</small>
            <b>12–14 L/day</b>
          </span>
          <span>
            <small>Lactation Yield</small>
            <b>3,600 L</b>
          </span>
        </div>
        <div className={r.mvBuying}>
          <span>Buying Recommendation</span>
          <b>✓ Yes</b>
        </div>
        <Recommended goToFlow={goToFlow} />
      </div>
    </div>
  );
}

// ---------- 5. Cow dung results (cow-dung-results-screen.jsx) ----------

const SCORE_GUIDE = [
  { score: 1, desc: "Severe Illness", bg: "#FFF1F2", color: "#E11D48" },
  { score: 2, desc: "Digestive Imbalance", bg: "#FFFBEB", color: "#D97706" },
  { score: 3, desc: "Healthy", bg: "#F0FDF4", color: "#16A34A" },
  { score: 4, desc: "Slow Digestion", bg: "#FFFBEB", color: "#D97706" },
  { score: 5, desc: "Bleeding While Passing Dung", bg: "#FFF1F2", color: "#E11D48" },
];

function DungResults({ back, goToFlow }: ScreenProps) {
  const [guide, setGuide] = useState(true);
  const score = 2;
  // Digestion: the complete feed supplement (rumen tonics, toxin binders)
  const dung = PRODUCTS[0];
  return (
    <div className={u.screen}>
      <div className={r.header}>
        <button type="button" className={`${u.btnReset} ${r.circle}`} onClick={back} aria-label="Back">
          <ArrowLeft size={18} />
        </button>
        <span className={r.headerTitle}>Report</span>
        <span className={r.circle} aria-hidden="true">
          <Share2 size={17} />
        </span>
      </div>
      <div className={`${u.scroll} ${r.dungBody}`}>
        <div className={r.notAdded}>
          <TriangleAlert size={32} color="#DADE2B" fill="#DADE2B" stroke="#003166" />
          <b>Cow not added yet</b>
          <small>Add her to track her health</small>
          <button type="button" className={`${u.btnReset} ${r.addThis}`} onClick={() => goToFlow("gs-herd", "gs-add-cow")}>
            <Plus size={18} /> Add this cow
          </button>
        </div>
        <div className={r.dungHero}>
          <img src={gimg("dung-sample.webp")} alt="" />
        </div>
        <div className={r.statusCard}>
          <span className={r.statusTop}>
            <small>Health status</small>
            <small>21 Oct 2026</small>
          </span>
          <span className={r.statusTitle}>
            <b>Digestive Imbalance</b>
            <span className={r.statusBadge}>
              <i /> Warning
            </span>
          </span>
          <div className={r.scale}>
            {[1, 2, 3, 4, 5].map((pos) => {
              const cur = pos === score;
              const healthy = pos === 3;
              return (
                <span key={pos} className={r.scaleCol}>
                  <span className={r.track} style={{ background: healthy ? "#006E2A" : "rgba(0,0,0,0.12)" }}>
                    {cur && <i style={{ background: healthy ? "#006E2A" : "#B4232C" }} />}
                  </span>
                  <b style={{ color: cur ? "#B4232C" : healthy ? "#006E2A" : "#202724", fontWeight: cur || healthy ? 700 : 500 }}>{pos}</b>
                  <small style={{ color: cur ? "#B4232C" : healthy ? "#006E2A" : "transparent" }}>{cur ? "Current" : healthy ? "Healthy" : "·"}</small>
                </span>
              );
            })}
          </div>
        </div>

        <div className={r.contentCard}>
          <span className={r.cardHead}>
            <i style={{ background: "#3B82F6" }}>
              <Eye size={17} color="#fff" />
            </i>
            What we see
          </span>
          <p>Loose, uneven dung that splashes on landing, with some undigested fibre and a slightly sour look.</p>
        </div>
        <div className={r.contentCard}>
          <span className={r.cardHead}>
            <i style={{ background: "#F97316" }}>
              <Info size={18} color="#fff" />
            </i>
            What it means
          </span>
          <p>Feed is passing through too fast, so Gowri is not absorbing all of it. Left alone, milk yield can drop within a week.</p>
          <span className={r.subHead}>COULD BE DUE TO</span>
          {["Too much green fodder or concentrate", "A sudden change in feed", "Early acidosis", "Worm load"].map((c) => (
            <span key={c} className={r.bullet}>
              <i />
              {c}
            </span>
          ))}
        </div>
        <div className={r.contentCard}>
          <span className={r.cardHead}>
            <i style={{ background: "#14B8A6" }}>
              <ListChecks size={18} color="#fff" />
            </i>
            What to do
          </span>
          {["Add 2–3 kg of dry straw to every feed", "Cut concentrate by 1 kg for 3 days", "Give fresh, clean water all day", "Re-scan the dung in 3 days"].map((c) => (
            <span key={c} className={r.bullet}>
              <i />
              {c}
            </span>
          ))}
        </div>
        <div className={r.contentCard}>
          <span className={r.productHead}>
            <b>RECOMMENDED FOR HER</b>
            <i>For digestive imbalance</i>
          </span>
          <button type="button" className={`${u.btnReset} ${r.productRow}`} onClick={() => goToFlow("gs-shop", "gs-product")}>
            <span className={r.productImg}>
              <img src={gimg(dung.image)} alt="" />
            </span>
            <span>
              <b>{dung.title}</b>
              <small>{dung.desc}</small>
              <span>
                <strong>{rupee(dung.price)}</strong> <s>{rupee(dung.mrp)}</s>
              </span>
            </span>
          </button>
          <button type="button" className={`${u.btnReset} ${r.productCta}`} onClick={() => goToFlow("gs-shop", "gs-product")}>
            Add to Cart
          </button>
        </div>
        <div className={r.dungVet}>
          <span className={r.dungVetHead}>
            <b>Call a vet immediately if</b>
            <span>
              <i /> Available
            </span>
          </span>
          <p>The dung turns watery or bloody, or she stops eating for more than a day.</p>
          <a className={r.dungVetCall} href="tel:9686762626" onClick={(e) => e.preventDefault()}>
            <Phone size={18} /> Call 9686762626
          </a>
        </div>
        <div className={r.contentCard}>
          <button type="button" className={`${u.btnReset} ${r.guideHead}`} onClick={() => setGuide((g) => !g)} aria-expanded={guide}>
            Score guide
            <ChevronDown size={22} style={{ transform: guide ? "rotate(180deg)" : undefined }} />
          </button>
          {guide &&
            SCORE_GUIDE.map((g) => (
              <span key={g.score} className={r.guideRow} style={{ background: g.bg }}>
                <b style={{ color: g.color }}>
                  Score {g.score}:{g.score === score ? " · Current" : ""}
                </b>
                <small>{g.desc}</small>
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}

export const gauReportScreens = {
  "gs-diagnosis": Diagnosis,
  "gs-status-report": (p: ScreenProps) => <StatusReport {...p} />,
  "gs-full-report": (p: ScreenProps) => <StatusReport {...p} full />,
  "gs-market-report": MarketReport,
  "gs-dung-results": DungResults,
};
