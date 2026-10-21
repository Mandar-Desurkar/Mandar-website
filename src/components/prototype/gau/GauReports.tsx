/* eslint-disable @next/next/no-img-element -- fixed-size mock screens inside a phone frame */
"use client";

// Gau Sampurna full reports, recreated from the `prod` branch: diagnosis-results-screen.jsx (the
// structured 5-section /diagnose report), animal-status-report-screen.jsx (Animal Status, the
// focused Market Value layout and the Full Health Checkup with its Status / Diseases / Nutrition
// anchors), cow-dung-results-screen.jsx, BlurOverlay + ViewFullReportBanner (what a free user sees).
// All values are illustrative samples.
import { useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bug,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Crown,
  Eye,
  Info,
  ListChecks,
  Lock,
  Phone,
  Plus,
  Share2,
  ShieldCheck,
  Sparkles,
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

// BlurOverlay: premium content stays on the page but frosted, with the lock on top
function Locked({ children, onUnlock, bg = "#F8FBF8" }: { children: ReactNode; onUnlock: () => void; bg?: string }) {
  return (
    <div className={r.locked} style={{ background: bg }}>
      <div className={r.blurred} aria-hidden="true">
        {children}
      </div>
      <button type="button" className={`${u.btnReset} ${r.unlock}`} onClick={onUnlock}>
        <Lock size={22} color="#004691" />
        Unlock Full Report
      </button>
    </div>
  );
}

// Pro members (isGoldActive) get the same sections without the frost
function Open({ children }: { children: ReactNode; onUnlock?: () => void; bg?: string }) {
  return <div className={r.open}>{children}</div>;
}

// ViewFullReportBanner: collapsed bar pinned under the report, expands into the upsell
function PremiumBanner({ onPlans }: { onPlans: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={r.bannerRoot}>
      <span className={r.bannerFade} />
      <div className={r.bannerCard}>
        <button type="button" className={`${u.btnReset} ${r.handleRow}`} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          <span className={r.handleLeft}>
            <i className={r.handlePill} />
            {!open && <small>Tap to expand</small>}
          </span>
          <span className={r.handleChevron} style={{ transform: open ? "rotate(180deg)" : undefined }}>
            <ChevronUp size={18} color="#004691" />
          </span>
        </button>
        {open ? (
          <div className={r.bannerOpen}>
            <span className={r.bannerTop}>
              <span className={r.premiumBadge}>🔥 PREMIUM</span>
              <span className={r.lockChip}>
                <Lock size={11} /> Members only
              </span>
            </span>
            <b>Unlock the Full Report</b>
            <p>Free users see verdicts only. Premium members get complete recommendations, treatment plans &amp; vet guidance.</p>
            <span className={r.perks}>
              {["Recommendations", "Treatment plans", "Vet guidance"].map((p) => (
                <span key={p}>
                  <BadgeCheck size={12} /> {p}
                </span>
              ))}
            </span>
            <button type="button" className={`${u.btnReset} ${r.plansCta} ${u.hotspot}`} onClick={onPlans}>
              <Crown size={16} /> View Plans <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className={r.compactBar}>
            <span className={r.compactLeft}>
              <i>
                <Lock size={14} color="#004691" />
              </i>
              <span>
                <small>PREMIUM ONLY</small>
                <b>Unlock Full Report</b>
              </span>
            </span>
            <button type="button" className={`${u.btnReset} ${r.compactCta}`} onClick={onPlans}>
              View Plans <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
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

// ---------- 1. Disease diagnosis (diagnosis-results-screen.jsx) ----------

const INDICATORS = [
  { name: "Udder swelling", desc: "Rear quarters look swollen and uneven in the side photo", clear: false },
  { name: "Teat lesions", desc: "No visible cuts or scabs on the teats", clear: true },
  { name: "Udder skin colour", desc: "Slight reddening on the rear left quarter", clear: false },
  { name: "Body posture", desc: "Standing normally, no sign of pain while standing", clear: true },
  { name: "Milk vein", desc: "Milk vein looks normal", clear: true },
];

function Diagnosis({ back, goToFlow }: ScreenProps) {
  const unlock = () => goToFlow("gs-pratham");
  return (
    <div className={u.screen}>
      <ReportHeader title="Disease Diagnosis" onBack={back} />
      <div className={`${u.scroll} ${r.body}`}>
        <div className={r.heroImg}>
          <img src={gimg("gowri-side.jpg")} alt="" />
        </div>
        <div className={r.cattleCard}>
          <img src={gimg("gowri-avatar.jpg")} alt="" />
          <span>
            <b>Gowri</b>
            <small>Breed: Gir · Weight: 412 kg</small>
            <small>
              <CalendarDays size={12} /> 21 Oct 2026
            </small>
          </span>
        </div>

        <div className={r.dxStatus}>
          <b>Mastitis</b>
          <span className={r.sevBadge} style={{ background: "#FFF3F0", color: "#dc2626" }}>
            <i style={{ background: "#dc2626" }} /> NEEDS VET
          </span>
        </div>

        <div className={r.card}>
          <span className={r.dxTitle}>
            <ListChecks size={18} /> Indicators Checked
          </span>
          <small className={r.countLabel}>2 of 5 indicators flagged</small>
          {INDICATORS.map((it) => (
            <span key={it.name} className={r.indicator}>
              <i className={it.clear ? r.dotClear : r.dotFlag}>{it.clear ? "✓" : "!"}</i>
              <span>
                <b>{it.name}</b>
                <small>{it.desc}</small>
              </span>
            </span>
          ))}
        </div>

        <div className={r.card}>
          <span className={r.dxTitle}>
            <Sparkles size={18} /> Diagnosis Reason
          </span>
          <Locked onUnlock={unlock}>
            <span className={r.reasonBadge}>Early stage</span>
            <p className={r.barText}>Swelling and asymmetry on the rear quarters, with reddening of the skin, match early clinical mastitis.</p>
          </Locked>
        </div>

        <div className={r.card}>
          <span className={r.dxTitle}>
            <ShieldCheck size={18} /> Prevention Rules
          </span>
          <Locked onUnlock={unlock}>
            <p className={r.barText}>• Teat dip after every milking</p>
            <p className={r.barText}>• Clean, dry bedding every day</p>
            <p className={r.barText}>• Milk healthy cows first, Gowri last</p>
          </Locked>
        </div>

        <div className={r.warnCard}>
          <span className={r.warnHead}>
            <TriangleAlert size={18} /> EARLY WARNING SIGNS
          </span>
          <Locked onUnlock={unlock} bg="#FFF8E1">
            <p className={r.warnText}>Watch for these over the next 48 hours:</p>
            {["Clots or flakes in the milk", "Hot, hard or painful udder", "Sudden drop in milk yield"].map((w) => (
              <span key={w} className={r.warnRow}>
                <i />
                {w}
              </span>
            ))}
          </Locked>
        </div>

        <VetAlert signs={["Fever, or the cow stops eating", "Milk turns watery or bloody", "The udder turns cold or blue"]} />
        <Recommended goToFlow={goToFlow} />
      </div>
      <PremiumBanner onPlans={unlock} />
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

const HEALTH_PARAMS = [
  { name: "Body condition", value: "Good · BCS 3.5", status: "NORMAL" },
  { name: "Udder", value: "Slight swelling on rear quarters", status: "MODERATE" },
  { name: "Coat & skin", value: "Glossy, no lesions", status: "NORMAL" },
  { name: "Hooves & legs", value: "Straight stance", status: "NORMAL" },
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

function StatusReport({ back, goToFlow, full }: ScreenProps & { full?: boolean }) {
  const unlock = () => goToFlow("gs-pratham");
  // The full report is Pro-only, so it renders unlocked; Animal Status shows the free view
  const Gated = full ? Open : Locked;
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
          <Gated onUnlock={unlock}>
            <p className={r.triage} style={{ color: RED }}>VET · Udder swelling</p>
            <p className={r.triage} style={{ color: "#B26A00" }}>WATCH · Slightly low body fat · Mild limp</p>
            <p className={r.triage} style={{ color: GREEN }}>CLEAR · Coat, eyes, posture, rumen fill and 24 more</p>
          </Gated>
        </section>

        <section className={r.section}>
          <span className={r.sectionTitle}>
            <Sparkles size={15} /> AI SUMMARY
          </span>
          <Gated onUnlock={unlock}>
            <span className={r.summaryStatus}>Needs attention</span>
            <p className={r.barText}>Gowri is in good body condition but shows early udder swelling. Treat early to protect her milk yield.</p>
          </Gated>
        </section>

        <section className={r.patternCard}>
          <span className={r.sectionTitle} style={{ color: ORANGE }}>
            <TriangleAlert size={15} /> PATTERN DETECTED
          </span>
          <Gated onUnlock={unlock} bg="#FFF3E0">
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
          <Gated onUnlock={unlock}>
            <p className={r.flag} style={{ color: RED }}>RED FLAGS · Rear udder swelling</p>
            <p className={r.flag} style={{ color: GREEN }}>POSITIVE · Strong frame, healthy coat, good rumen fill</p>
          </Gated>
        </section>

        <section className={r.section}>
          <span className={r.sectionTitle}>HEALTH PARAMETERS</span>
          {HEALTH_PARAMS.map((p) => (
            <span key={p.name} className={r.param}>
              <span>
                <b>{p.name}</b>
                <small>{p.value}</small>
              </span>
              <span className={r.sevBadge} style={{ background: SEV[p.status].bg, color: SEV[p.status].color }}>
                <i style={{ background: SEV[p.status].color }} />
                {p.status}
              </span>
            </span>
          ))}
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
                          <Gated onUnlock={unlock}>
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
          <Gated onUnlock={unlock}>
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
          <Gated onUnlock={unlock}>
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
          <Gated onUnlock={unlock}>
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
      {!full && <PremiumBanner onPlans={unlock} />}
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
  const dung = PRODUCTS[3];
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
