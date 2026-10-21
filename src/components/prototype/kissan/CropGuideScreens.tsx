/* eslint-disable @next/next/no-img-element -- fixed-size mock screens inside a phone frame */
"use client";

// Crop Guide, recreated from the `dev` branch (code/screens/crop-guide/*): the start / select-farm
// screen, every wizard question (use-crop-guide-flow.js QUESTION_ROUTES), the report with all of
// components/report-sections.jsx, "no crop fits" and the history list. Two paths, as in the app
// and the owner's flow chart: a farmer with a farm answers only what the farm doesn't know
// (season → budget → farm type); a new farmer answers the full set and gets a farm created.
// Option values and copy come from the code; report numbers are illustrative sample values.
import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import {
  Bug,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CloudRain,
  Crosshair,
  EllipsisVertical,
  Droplets,
  Info,
  Leaf,
  MapPin,
  Pencil,
  Search,
  Sprout,
  Thermometer,
  Wheat,
} from "lucide-react";
import base from "./kissan.module.css";
import s from "./kissanFlows.module.css";
import g from "./cropGuide.module.css";
import { KissanTabBar, ui } from "./KissanShared";
import type { ScreenProps } from "./KissanScreens";

const img = (file: string) => `/prototypes/kissan-sampurna/${file}`;

// The app branches on the wizard's question list; the prototype remembers which path the farmer
// took (picked a farm, or started without one) so shared steps know where to go next.
let hasFarmPath = false;

// ---------- Shared: TopBarNew + PrimaryButton (pill) ----------

export function TopBarNew({
  title,
  menu = false,
  onBack,
  onMenu,
  right,
}: {
  title: string;
  menu?: boolean;
  onBack?: () => void;
  onMenu?: () => void;
  right?: ReactNode;
}) {
  return (
    <div className={s.topBarNew}>
      {onBack === undefined ? (
        <span className={s.backCircle} aria-hidden="true">
          <BackChevron />
        </span>
      ) : (
        <button type="button" className={`${ui.btnReset} ${s.backCircle}`} onClick={onBack} aria-label="Back">
          <BackChevron />
        </button>
      )}
      <span className={s.topBarNewTitle}>{title}</span>
      {right ??
        (onMenu ? (
          <button type="button" className={`${ui.btnReset} ${s.topBarSpacer}`} onClick={onMenu} aria-label="More options">
            <EllipsisVertical size={20} color="#111827" />
          </button>
        ) : (
          <span className={s.topBarSpacer} aria-hidden="true">
            {menu ? "⋮" : ""}
          </span>
        ))}
    </div>
  );
}

function BackChevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M15 5l-7 7 7 7" fill="none" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
      style={disabled ? { opacity: 0.5, cursor: "default" } : undefined}
    >
      {label}
    </button>
  );
}

function QuestionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className={s.heading}>
      <p className={s.qTitle}>{title}</p>
      {subtitle && <p className={s.qSubtitle}>{subtitle}</p>}
    </div>
  );
}

const CTA_LAST = "See Crop Recommendations";

// ---------- Start: select your farm (crop-guide-start-screen + select-farm-screen.jsx) ----------

const FARMS = [
  { id: "east", name: "East Plot", location: "Tumakuru, Karnataka", acres: "2.4", crop: null, image: "cg-farm-home.webp" },
  { id: "lakshmi", name: "Lakshmi Farm", location: "Hebbal, Bengaluru", acres: "1.2", crop: "Rice", image: "cg-farm-north.webp" },
];

function SelectFarm({ go, goToFlow }: ScreenProps) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className={base.screen}>
      <TopBarNew title="Crop Guide" />
      <div className={base.scroll}>
        <div className={g.body}>
          <div>
            <p className={g.title}>Select your farm</p>
            <p className={g.subtitle}>Choose the field you&apos;re planning for today.</p>
          </div>
          {FARMS.map((f) => {
            const on = selected === f.id;
            return (
              <button
                key={f.id}
                type="button"
                className={`${ui.btnReset} ${g.farmCard} ${on ? g.farmCardOn : ""} ${!selected && f.id === "east" ? ui.hotspot : ""}`}
                onClick={() => setSelected(f.id)}
              >
                <img src={img(f.image)} alt="" />
                <span className={g.farmInfo}>
                  <b>{f.name}</b>
                  <span className={g.farmLoc}>
                    <MapPin size={14} /> {f.location}
                  </span>
                  <span className={g.chips}>
                    {f.crop && (
                      <span className={g.chip}>
                        <Sprout size={13} /> {f.crop}
                      </span>
                    )}
                    <span className={g.chip}>{f.acres} acres</span>
                  </span>
                </span>
                {!on && <span className={g.radio} />}
              </button>
            );
          })}
          <button
            type="button"
            className={`${ui.btnReset} ${g.addFarm}`}
            onClick={() => {
              hasFarmPath = false;
              go("cg-location");
            }}
          >
            + Add another farm
          </button>
        </div>
      </div>
      <div className={s.footer}>
        <PillButton
          label="Continue"
          disabled={!selected}
          hint={!!selected}
          onClick={() => {
            hasFarmPath = true;
            go("cg-season");
          }}
        />
      </div>
      <KissanTabBar active="guide" goToFlow={goToFlow} />
    </div>
  );
}

// ---------- Where is your farm? (farm-location-screen.jsx) ----------

function FarmLocation({ next }: ScreenProps) {
  const [method, setMethod] = useState<"current" | "pincode">("current");
  useEffect(() => {
    hasFarmPath = false;
  }, []);
  return (
    <div className={base.screen}>
      <TopBarNew title="Crop Guide" />
      <div className={base.scroll}>
        <div className={g.body}>
          <div>
            <p className={g.title}>Where is your farm?</p>
            <p className={g.subtitle}>Choose one option for local crop advice and weather updates.</p>
          </div>
          <div className={g.hero} style={{ backgroundImage: `url(${img("cg-farm-landscape.webp")})` }}>
            <span className={g.heroPill}>
              <Sprout size={14} /> Better advice starts here
            </span>
          </div>
          <div className={g.methods}>
            <span className={g.sectionLabel}>CHOOSE A LOCATION METHOD</span>
            <button
              type="button"
              className={`${ui.btnReset} ${g.method} ${method === "current" ? g.methodOn : ""}`}
              onClick={() => setMethod("current")}
            >
              <span className={g.methodRow}>
                <span className={g.methodIcon}>
                  <Crosshair size={22} />
                </span>
                <span className={g.methodText}>
                  <b>Use current location</b>
                  <span>Fastest · uses your phone&apos;s location</span>
                </span>
                <span className={`${g.radio} ${method === "current" ? g.radioOn : ""}`} />
              </span>
            </button>
            <span className={g.orRow}>OR</span>
            <button
              type="button"
              className={`${ui.btnReset} ${g.method} ${method === "pincode" ? g.methodOn : ""}`}
              onClick={() => setMethod("pincode")}
            >
              <span className={g.methodRow}>
                <span className={g.methodIcon}>
                  <MapPin size={22} />
                </span>
                <span className={g.methodText}>
                  <b>Enter a pincode</b>
                  <span>Use the area where your farm is</span>
                </span>
                <span className={`${g.radio} ${method === "pincode" ? g.radioOn : ""}`} />
              </span>
              <span className={g.pinInput} style={method === "pincode" ? { color: "#1f2937" } : undefined}>
                {method === "pincode" ? "572101" : "6-digit pincode"}
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className={s.footer}>
        <PillButton label="Continue" hint onClick={next} />
      </div>
    </div>
  );
}

// ---------- Planting season (planting-season-screen.jsx) ----------

const SEASONS = [
  { value: "Kharif", image: "cg-season-kharif.webp" },
  { value: "Rabi", image: "cg-season-rabi.webp" },
  { value: "Summer", image: "cg-season-summer.webp" },
  { value: "Annual", image: "cg-season-long-term.webp" },
];

function Season({ next, go }: ScreenProps) {
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
        <PillButton
          label="Continue"
          onClick={() => (hasFarmPath ? go("cg-budget") : next())}
          disabled={!season}
          hint={!!season}
        />
      </div>
    </div>
  );
}

// ---------- Are you currently growing a crop? (growing-crop-screen.jsx) ----------

function Growing({ next, go }: ScreenProps) {
  const [value, setValue] = useState<"Yes" | "No" | null>(null);
  const options = [
    { value: "Yes" as const, image: "cg-grow-yes.webp", banner: "You're already growing - let's track it!" },
    { value: "No" as const, image: "cg-grow-no.webp" },
  ];
  return (
    <div className={base.screen}>
      <TopBarNew title="Crop Guide" />
      <div className={base.scroll}>
        <div className={g.body}>
          <p className={g.title}>Are you currently growing a crop?</p>
          {options.map((o) => {
            const on = value === o.value;
            return (
              <button
                key={o.value}
                type="button"
                className={`${ui.btnReset} ${g.growCard} ${on ? g.growCardOn : ""} ${!value && o.value === "Yes" ? ui.hotspot : ""}`}
                onClick={() => setValue(o.value)}
              >
                <img src={img(o.image)} alt="" />
                <span className={g.growRow}>
                  <span>{o.value}</span>
                  {on ? (
                    <span className={g.greenCheck}>
                      <Check size={16} />
                    </span>
                  ) : (
                    <span className={g.radio} style={{ borderColor: "#6b7280" }} />
                  )}
                </span>
                {on && o.banner && <span className={g.growBanner}>{o.banner}</span>}
              </button>
            );
          })}
        </div>
      </div>
      <div className={s.footer}>
        <PillButton
          label="Continue"
          disabled={!value}
          hint={!!value}
          onClick={() => (value === "No" ? go("cg-previous") : next())}
        />
      </div>
    </div>
  );
}

// ---------- Crop picker (which-crop-screen.jsx, field crop | previous_crop) ----------

const CATALOG = [
  ["Wheat", "crop-wheat.webp"],
  ["Paddy", "crop-rice.webp"],
  ["Maize", "crop-maize.webp"],
  ["Cotton", "crop-cotton.webp"],
  ["Soybean", "cg-crop-soyabean.webp"],
  ["Sugarcane", "cg-crop-sugarcane.webp"],
  ["Ragi", "crop-ragi.webp"],
  ["Jowar", "crop-jowar.webp"],
];

function CropPicker({ next, previous }: ScreenProps & { previous?: boolean }) {
  return (
    <div className={base.screen}>
      <TopBarNew title="Crop Guide" />
      <div className={base.scroll}>
        <div className={g.body}>
          <p className={g.title}>{previous ? "Which crop did you grow here before?" : "Which crop is growing?"}</p>
          <span className={g.search}>
            <span>Search...</span>
            <Search size={20} />
          </span>
          <div className={g.cropGrid}>
            {CATALOG.map(([name, file], i) => (
              <button
                key={name}
                type="button"
                className={`${ui.btnReset} ${g.cropCard} ${i === (previous ? 1 : 0) ? ui.hotspot : ""}`}
                onClick={next}
              >
                <img src={img(file)} alt="" />
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
      {previous && (
        <div className={s.footer}>
          <button type="button" className={`${ui.btnReset} ${g.outlineBtn}`} onClick={next}>
            Skip
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- When did you sow your seeds? (sowing-date-screen.jsx) ----------

const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

function SowingDate({ next }: ScreenProps) {
  const [value, setValue] = useState<string | null>(null);
  const week = addDays(new Date(), -new Date().getDay());
  const monthAgo = new Date(week);
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const range = (d: Date) => `${fmt(d)} - ${fmt(addDays(d, 6))}`;
  const opts = [
    { id: "thisWeek", title: "This week", sub: range(week) },
    { id: "lastWeek", title: "Last week", sub: range(addDays(week, -7)) },
    { id: "monthAgo", title: "One month ago", sub: range(monthAgo) },
    { id: "custom", title: "Custom date", sub: value === "custom" ? fmt(addDays(week, -18)) + " 2026" : "Select a date" },
  ];
  return (
    <div className={base.screen}>
      <TopBarNew title="Crop Guide" />
      <div className={base.scroll}>
        <div className={g.body} style={{ gap: 24 }}>
          <img className={g.illustration} src={img("cg-grow-yes.webp")} alt="" />
          <div>
            <p className={g.title}>When did you sow your seeds?</p>
            <p className={g.subtitle}>Select the date to get more accurate growth insights.</p>
          </div>
          <div className={g.optGrid}>
            {opts.map((o) => (
              <button
                key={o.id}
                type="button"
                className={`${ui.btnReset} ${g.opt} ${value === o.id ? g.optOn : ""} ${!value && o.id === "lastWeek" ? ui.hotspot : ""}`}
                onClick={() => setValue(o.id)}
              >
                <span className={`${g.radio} ${value === o.id ? g.radioOn : ""}`} />
                <span className={g.optText}>
                  <b>{o.title}</b>
                  <span>{o.sub}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={s.footer}>
        <PillButton label="Continue" disabled={!value} hint={!!value} onClick={next} />
      </div>
    </div>
  );
}

// ---------- Irrigation (irrigation-screen.jsx, multi-select) ----------

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

// ---------- Budget (crop-budget-screen.jsx) ----------

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
        <PillButton label="Continue" onClick={next} disabled={!budget} hint={!!budget} />
      </div>
    </div>
  );
}

// ---------- What type of farm do you have? (farm-type-screen.jsx) ----------

const FARM_TYPES = [
  { value: "cattle", title: "Cattle farm", hint: "Cows & Buffaloes", image: "cg-livestock-cattle.webp" },
  { value: "goat", title: "Cattle farm", hint: "Goat, Sheep, & Pig", image: "cg-livestock-goat.webp" },
  { value: "poultry", title: "Poultry farm", hint: "Cock, Hen, & Duck", image: "cg-livestock-poultry.webp" },
  { value: "fish", title: "Fisheries", hint: "Fish, Prawns, & Crab", image: "cg-livestock-fish.webp" },
];

function FarmType({ next, go }: ScreenProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const last = hasFarmPath;
  return (
    <div className={base.screen}>
      <TopBarNew title="Crop Guide" />
      <div className={base.scroll}>
        <div className={g.body}>
          <div>
            <p className={g.title}>What type of farm do you have?</p>
            <p className={g.subtitle}>Choose the option that best fits your farm. We&apos;ll tailor practical advice to your animals.</p>
          </div>
          <div className={g.typeGrid}>
            {FARM_TYPES.map((t) => {
              const on = selected === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  className={`${ui.btnReset} ${g.typeCard} ${on ? g.typeCardOn : ""} ${!selected && t.value === "cattle" ? ui.hotspot : ""}`}
                  onClick={() => setSelected(t.value)}
                >
                  <img src={img(t.image)} alt="" />
                  <span className={g.typeRow}>
                    <span className={g.typeText}>
                      <b>{t.title}</b>
                      <span>{t.hint}</span>
                    </span>
                    <span className={`${g.radio} ${on ? g.radioOn : ""}`} />
                  </span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className={`${ui.btnReset} ${g.none} ${selected === "none" ? g.noneOn : ""}`}
            onClick={() => setSelected("none")}
          >
            I don&apos;t have any live stock
          </button>
        </div>
      </div>
      <div className={s.footer}>
        <PillButton
          label={last ? CTA_LAST : "Continue"}
          disabled={!selected}
          hint={!!selected}
          onClick={() => (last ? go("cg-report") : next())}
        />
      </div>
    </div>
  );
}

// ---------- Give your farm a name (farm-name-screen.jsx) ----------

function FarmName({ next }: ScreenProps) {
  return (
    <div className={base.screen}>
      <TopBarNew title="Crop Guide" />
      <div className={base.scroll}>
        <div className={g.body}>
          <img className={g.illustration} src={img("cg-grow-yes.webp")} alt="" />
          <p className={g.title}>Give your farm a name</p>
          <span className={g.nameInput}>
            <span>East Plot</span>
            <Pencil size={20} color="#6B7280" />
          </span>
          <span className={g.helper}>
            <Info size={16} /> We&apos;ll add this farm to Farm Monitoring. You can change the name anytime.
          </span>
        </div>
      </div>
      <div className={s.footer}>
        <PillButton label={CTA_LAST} hint onClick={next} />
      </div>
    </div>
  );
}

// ---------- Report (crop-guide-report-screen.jsx + components/report-sections.jsx) ----------

const FIT = [
  { label: "Soil Match", value: "Excellent", icon: "▦", color: "#2E7D32", bg: "#DCEFE3" },
  { label: "Water Fit", value: "Good", icon: "💧", color: "#2563EB", bg: "#DBEAFE" },
  { label: "Season Fit", value: "Perfect", icon: "☀", color: "#D97706", bg: "#FEF3C7" },
  { label: "Budget Fit", value: "Good", icon: "₹", color: "#9333EA", bg: "#F3E8FF" },
];

// Top 5 for a Rabi, drip-irrigated, ₹10–25k/acre farm (illustrative)
const COMPARE = [
  { name: "Wheat", season: "Rabi", match: 94, window: "Nov 1 – Nov 25" },
  { name: "Mustard", season: "Rabi", match: 88, window: "Oct 10 – Oct 31" },
  { name: "Chickpea", season: "Rabi", match: 84, window: "Oct 15 – Nov 10" },
  { name: "Barley", season: "Rabi", match: 79, window: "Nov 1 – Nov 30" },
  { name: "Potato", season: "Rabi", match: 72, window: "Oct 1 – Oct 25" },
];

const WEATHER = [
  { Icon: Thermometer, label: "Temperature", value: "10 – 25 °C", note: "Cool nights help tillering; warm, dry days at grain fill. Tolerates 5 – 30 °C." },
  { Icon: CloudRain, label: "Rainfall", value: "300 – 450 mm", note: "Most water should come from irrigation at crown-root, tillering and flowering. Tolerates 250 – 600 mm." },
  { Icon: Droplets, label: "Humidity", value: "50 – 70 %", note: "Higher humidity at heading raises rust risk; keep fields airy." },
];

const RISKS = [
  { title: "Yellow rust (Peela ratua)", tag: "Fungal", tone: { bar: "#4D6B1F", bg: "#F6FAEE", icon: "#4D6B1F", tagBg: "#E9F0A6", tagColor: "#3F5A12" }, text: "Sow resistant varieties and spray propiconazole 0.1% at the first yellow stripes." },
  { title: "Aphids (Mahu)", tag: "Pest", tone: { bar: "#C81E1E", bg: "#FFF1F1", icon: "#DC2626", tagBg: "#FAD4D4", tagColor: "#B91C1C" }, text: "Scout from January; spray neem oil 3 ml/L, or imidacloprid if colonies keep growing." },
  { title: "Termites (Deemak)", tag: "Pest", tone: { bar: "#C81E1E", bg: "#FFF1F1", icon: "#DC2626", tagBg: "#FAD4D4", tagColor: "#B91C1C" }, text: "Use well-rotted manure only and treat seed with chlorpyriphos before sowing." },
];

const TIPS = [
  { title: "First irrigation at 21 days", text: "Crown-root initiation needs water; missing it can cut yield by a fifth.", priority: "High", bg: "#DBEAFE", color: "#2563EB" },
  { title: "Split the nitrogen dose", text: "Half at sowing, the rest across the first two irrigations.", priority: "High", bg: "#DCEFE3", color: "#2E7D32" },
  { title: "Line sowing at 20 cm", text: "Saves seed and makes weeding and spraying easier.", priority: "Medium", bg: "#FEF3C7", color: "#D97706" },
];

function Report({ goToFlow }: ScreenProps) {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState<Record<string, boolean>>({ Temperature: true, Rainfall: true, Humidity: true, benefits: true });
  const crop = COMPARE[current];
  const isTop = current === 0;
  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  return (
    <div className={base.screen}>
      <TopBarNew title="Crop Guide Report" />
      <div className={`${base.scroll} ${s.reportBody}`}>
        {!isTop && (
          <div className={g.compareBanner}>
            <Info size={18} /> Comparing {crop.name} with your top pick, Wheat.
          </div>
        )}
        <div className={s.cgHero}>
          <img src={img("cg-report-hero.webp")} alt="" />
          <div className={s.cgHeroShade}>
            <span className={s.topPickBadge}>{isTop ? "☆ TOP PICK FOR YOU" : "ALTERNATIVE PICK"}</span>
            <p className={s.heroCrop}>{crop.name}</p>
            <span className={s.matchPill}>🍃 {crop.match}% Match</span>
            <span className={s.sowRow}>
              📅 Best sowing window: <b>{crop.window}</b>
            </span>
          </div>
        </div>

        <div className={s.card}>
          <div className={s.rowBetween}>
            <p className={s.cardTitle}>Why we recommend {crop.name}</p>
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
          <p className={s.readyTitle}>Ready to grow {crop.name} this season?</p>
          <p className={s.cardBody}>Track {crop.name} on &ldquo;East Plot&rdquo; with Farm Monitoring.</p>
          <button type="button" className={`${s.pillBtn} ${base.hotspot}`} onClick={() => goToFlow("farm-report")}>
            ◎ Go to my farm
          </button>
        </div>

        <div className={s.card}>
          <div>
            <p className={s.cardTitle}>How it compares with other options</p>
            <p className={s.caption}>Compare progress, seasonality, and harvest readiness. Tap a crop to open it.</p>
          </div>
          {COMPARE.map((c, i) => {
            const color = c.match >= 80 ? "#059669" : "#D97706";
            const viewing = i === current;
            return (
              <button
                key={c.name}
                type="button"
                className={`${ui.btnReset} ${s.compareRow} ${viewing ? s.compareCurrent : ""}`}
                onClick={() => setCurrent(i)}
                disabled={viewing}
              >
                <span className={s.compareIcon} style={{ background: c.match >= 80 ? "#D1FAE5" : "#FEF3C7", color }}>
                  🌾
                </span>
                <span className={s.compareBody}>
                  <span className={s.compareHead}>
                    <span className={s.compareName}>{c.name}</span>
                    <span className={s.seasonPill}>{c.season}</span>
                    <span className={s.flex} />
                    {viewing ? (
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
              </button>
            );
          })}
        </div>

        {/* WeatherSuitability */}
        <div className={s.card}>
          <div>
            <p className={s.cardTitle}>Weather Suitability</p>
            <p className={g.caption}>The weather this crop needs to grow well.</p>
          </div>
          {WEATHER.map(({ Icon, label, value, note }) => (
            <button key={label} type="button" className={`${ui.btnReset} ${g.wxRow}`} onClick={() => toggle(label)}>
              <span className={g.wxHead}>
                <Icon size={24} />
                <span>
                  {label}
                  <b>{value}</b>
                </span>
                <span className={g.pill} style={{ background: "#D3D800", color: "#0F2A4A" }}>
                  Ideal
                </span>
                {open[label] ? <ChevronUp size={18} color="#6B7280" /> : <ChevronDown size={18} color="#6B7280" />}
              </span>
              {open[label] && <p className={g.cardBody}>{note}</p>}
            </button>
          ))}
        </div>

        {/* RisksAndSolutions */}
        <div className={s.card} style={{ background: "#F7F9FB" }}>
          <p className={s.cardTitle}>Risks and Solutions</p>
          {RISKS.map((r) => (
            <div key={r.title} className={g.risk} style={{ background: r.tone.bg, borderLeftColor: r.tone.bar }}>
              <span className={g.riskHead}>
                {r.tag === "Pest" ? <Bug size={20} color={r.tone.icon} /> : <Leaf size={20} color={r.tone.icon} />}
                <b>{r.title}</b>
                <span className={g.pill} style={{ background: r.tone.tagBg, color: r.tone.tagColor }}>
                  {r.tag}
                </span>
              </span>
              <p className={g.cardBody}>{r.text}</p>
            </div>
          ))}
        </div>

        {/* PracticalTips */}
        <div className={s.card} style={{ background: "#F8F7F3" }}>
          <div className={s.rowBetween}>
            <p className={s.cardTitle}>Key Practical Tips</p>
            <span className={g.pill} style={{ background: "#E9EDF3", color: "#6B7280" }}>
              {TIPS.length} actionable tips
            </span>
          </div>
          <div className={g.tipList}>
            {TIPS.map((t) => (
              <div key={t.title} className={g.tip}>
                <span className={g.tipIcon} style={{ background: t.bg, color: t.color }}>
                  <Wheat size={22} />
                </span>
                <span style={{ flex: 1 }}>
                  <b>{t.title}</b>
                  <p>{t.text}</p>
                </span>
                <span
                  className={g.pill}
                  style={t.priority === "High" ? { background: "#FDECEC", color: "#DC2626" } : { background: "#FFF7E0", color: "#D97706", border: "1px solid #F7D27A" }}
                >
                  {t.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SoilBenefits */}
        <button type="button" className={`${ui.btnReset} ${s.card}`} onClick={() => toggle("benefits")}>
          <span className={g.benefitHead}>
            <span className={g.benefitIcon}>
              <Leaf size={20} />
            </span>
            <span>Soil &amp; Economic Benefits</span>
            {open.benefits ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </span>
          {open.benefits && (
            <>
              <span className={g.benefitList}>
                <b>For your soil</b>
                <span>Deep roots improve soil structure after a Kharif paddy.</span>
                <span>Residue left after harvest adds organic matter.</span>
              </span>
              <span className={g.benefitList}>
                <b>For your income</b>
                <span>Assured MSP procurement in most mandis.</span>
                <span>Straw sells as fodder, a second income.</span>
              </span>
            </>
          )}
        </button>

        {/* MoreForFarm */}
        <div className={g.more}>
          <b>More for your Farm</b>
          <div className={g.moreRow}>
            <button
              type="button"
              className={`${ui.btnReset} ${g.moreCard}`}
              style={{ backgroundImage: `url(${img("cg-more-farm-monitor.webp")})` }}
              onClick={() => goToFlow("farm-monitoring")}
            >
              <span>
                Farm Monitor <ChevronRight size={16} />
              </span>
            </button>
            <button
              type="button"
              className={`${ui.btnReset} ${g.moreCard}`}
              style={{ backgroundImage: `url(${img("cg-more-crop-guide.webp")})` }}
              onClick={() => goToFlow("crop-guide")}
            >
              <span>
                Crop Guide <ChevronRight size={16} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- No crop fits (no-crop-fit-screen.jsx) ----------

function NoCropFit({ go }: ScreenProps) {
  const seasons = [
    { label: "Kharif", crops: 14, image: "cg-season-kharif.webp" },
    { label: "Annual", crops: 6, image: "cg-season-long-term.webp" },
  ];
  return (
    <div className={base.screen}>
      <TopBarNew title="Crop Guide" />
      <div className={base.scroll}>
        <div className={g.body}>
          <span className={g.noFitIcon}>
            <Sprout size={36} />
          </span>
          <div>
            <p className={g.title}>No crop fits these answers</p>
            <p className={g.subtitle}>Summer with rainfed water only is too dry for the crops grown near you.</p>
          </div>
          <span className={g.credit}>
            <CheckCircle2 size={18} /> Your credit was not used.
          </span>
          <span className={g.sectionLabel} style={{ color: "#6B7280" }}>
            TRY ANOTHER SEASON
          </span>
          {seasons.map((sn, i) => (
            <button
              key={sn.label}
              type="button"
              className={`${ui.btnReset} ${g.seasonRow} ${i === 0 ? ui.hotspot : ""}`}
              onClick={() => go("cg-report")}
            >
              <img src={img(sn.image)} alt="" />
              <span>
                <b>{sn.label}</b>
                <small>{sn.crops} crops</small>
              </span>
              <ChevronRight size={20} color="#004691" />
            </button>
          ))}
        </div>
      </div>
      <div className={s.footer}>
        <button type="button" className={`${ui.btnReset} ${g.outlineBtn}`} onClick={() => go("cg-season")}>
          Change my answers
        </button>
      </div>
    </div>
  );
}

// ---------- My crop guides (crop-guide-history-screen.jsx) ----------

const HISTORY = [
  { date: "Oct 21, 2026", top: "Wheat", score: 94, meta: "East Plot · Rabi", crops: [["Wheat", 94], ["Mustard", 88], ["Chickpea", 84]] },
  { date: "Jun 04, 2026", top: "Paddy", score: 91, meta: "Lakshmi Farm · Kharif", crops: [["Paddy", 91], ["Maize", 86], ["Ragi", 80]] },
];

function History({ go }: ScreenProps) {
  return (
    <div className={base.screen}>
      <TopBarNew title="Crop Guide Reports" />
      <div className={base.scroll}>
        <div className={g.advisory}>
          <div className={g.advisoryHead}>
            <span className={g.advisoryIcon}>
              <Leaf size={24} />
            </span>
            <span>
              <b>Generate New Recommendation</b>
              <span>AI-powered crop recommendations</span>
            </span>
          </div>
          <button type="button" className={`${ui.btnReset} ${g.startNow}`} onClick={() => go("cg-start")}>
            Start Now
          </button>
        </div>
        <p className={g.histTitle}>Previous Reports</p>
        {HISTORY.map((h, i) => (
          <button key={h.date} type="button" className={`${ui.btnReset} ${g.histCard} ${i === 0 ? ui.hotspot : ""}`} onClick={() => go("cg-report")}>
            <span className={g.histHead}>
              <span className={g.histDate}>
                <Calendar size={16} /> {h.date}
              </span>
              <span className={g.statusPill}>
                <Leaf size={14} /> {h.top} · {h.score}%
              </span>
            </span>
            <p className={g.histMeta}>{h.meta}</p>
            <span className={g.cropPills}>
              {h.crops.map(([name, match], k) => (
                <span key={name} className={`${g.cropPill} ${k === 0 ? g.cropPillTop : ""}`}>
                  {name}
                  <small>{` ${match}% >`}</small>
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

const PreviousCrop = (p: ScreenProps) => <CropPicker {...p} previous />;

export const cropGuideScreens: Record<string, ComponentType<ScreenProps>> = {
  "cg-start": SelectFarm,
  "cg-location": FarmLocation,
  "cg-season": Season,
  "cg-growing": Growing,
  "cg-crop": CropPicker,
  "cg-sowing": SowingDate,
  "cg-previous": PreviousCrop,
  "cg-irrigation": Irrigation,
  "cg-budget": Budget,
  "cg-farm-type": FarmType,
  "cg-farm-name": FarmName,
  "cg-report": Report,
  "cg-no-fit": NoCropFit,
  "cg-history": History,
};

