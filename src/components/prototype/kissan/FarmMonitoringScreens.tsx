/* eslint-disable @next/next/no-img-element -- fixed-size mock screens inside a phone frame */
"use client";

// Farm Monitoring, recreated from the `dev` branch (code/screens/farm-monitoring/*), following the
// owner's FMFM flow chart. Setup flow: my-farms (+ info sheet) → add-farm-questions (YES / NO paths)
// → mark-your-farm (+ save-for-later dialog) → mark-farm-map (draw or walk) → farm-setup-complete.
// Report flow: farm-report (growing + pre-planting variants, generating state) with the kebab menu
// (history, rename, crop, irrigation, map change, delete), change-stage sheet, farm-full-details and
// farm-history. Copy comes from en.json (farmMonitoring.*); farm values are illustrative samples.
import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import {
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Cloud,
  Droplets,
  Info,
  Leaf,
  Locate,
  MapPin,
  Pencil,
  PlusCircle,
  Search,
  Sprout,
  Sun,
  Thermometer,
  Trash2,
  X,
} from "lucide-react";
import base from "./kissan.module.css";
import s from "./kissanFlows.module.css";
import g from "./cropGuide.module.css";
import f from "./farmMonitoring.module.css";
import { KissanTabBar, ui } from "./KissanShared";
import type { ScreenProps } from "./KissanScreens";
import { TopBarNew } from "./CropGuideScreens";

const img = (file: string) => `/prototypes/kissan-sampurna/${file}`;

function GradientButton({
  label,
  onClick,
  hint,
  disabled,
  icon,
}: {
  label: string;
  onClick: () => void;
  hint?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`${ui.btnReset} ${f.gradientCta} ${hint && !disabled ? base.hotspot : ""} ${disabled ? f.disabled : ""}`}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled}
    >
      {icon}
      {label}
    </button>
  );
}

function Toast({ text }: { text: string }) {
  return (
    <span className={f.toast} role="status">
      <CheckCircle2 size={16} /> {text}
    </span>
  );
}

// ---------- My Farms (my-farms-screen.jsx + farm-info-sheet.jsx) ----------

const INFO_ITEMS = [
  ["Crop Health", "fm-info-crop-health.webp"],
  ["Water Level", "fm-info-water-level.webp"],
  ["Weather Impact", "fm-info-weather-impact.webp"],
  ["Early Alerts", "fm-info-early-alerts.webp"],
];

function MyFarms({ next, go, goToFlow }: ScreenProps) {
  const [info, setInfo] = useState(false);
  return (
    <div className={base.screen} style={{ position: "relative" }}>
      <TopBarNew
        title="My Farms"
        right={
          <button type="button" className={`${ui.btnReset} ${s.topBarSpacer}`} onClick={() => setInfo(true)} aria-label="About Farm Monitoring">
            <Info size={22} color="#111827" />
          </button>
        }
      />
      <div className={base.scroll}>
        <div className={f.list}>
          <button type="button" className={`${ui.btnReset} ${f.farmCard}`} onClick={() => goToFlow("farm-report")}>
            <img className={f.farmImg} src={img("fm-farm-satellite.webp")} alt="" />
            <span className={f.farmName}>Lakshmi Farm</span>
            <span className={f.chipRow}>
              <span className={f.chip} style={{ background: "rgba(0,115,255,.1)", borderColor: "rgba(0,115,255,.15)", color: "#0073FF" }}>
                <MapPin size={12} /> Tumakuru, Karnataka
              </span>
              <span className={f.chip} style={{ background: "#ECFDF5", borderColor: "#D1FAE5", color: "#065F46" }}>
                <Leaf size={12} /> Wheat
              </span>
              <span className={f.chip} style={{ background: "rgba(49,98,54,.1)", borderColor: "rgba(27,79,39,.2)", color: "#065F46" }}>
                <Leaf size={12} /> 2.40 Acres
              </span>
            </span>
          </button>
          <button type="button" className={`${ui.btnReset} ${f.farmCard}`} onClick={() => go("fm-mark")}>
            <span className={f.noImage}>
              NO IMAGE
              <span className={f.locateBadge}>
                <Locate size={14} /> Locate your Farm
              </span>
            </span>
            <span className={f.farmName}>Farm_2</span>
            <span className={f.chipRow}>
              <span className={f.chip} style={{ background: "#F1F5F9", borderColor: "#E2E8F0", color: "#475569" }}>
                <MapPin size={12} /> Location Pending
              </span>
            </span>
          </button>
        </div>
      </div>
      <button type="button" className={`${ui.btnReset} ${f.fab} ${base.hotspot}`} onClick={next}>
        + Add Farm
      </button>
      <KissanTabBar active="monitor" goToFlow={goToFlow} />
      {info && (
        <div className={f.infoBackdrop} onClick={() => setInfo(false)} role="presentation">
          <div className={f.infoCard} role="dialog" aria-label="What you'll see" onClick={(e) => e.stopPropagation()}>
            <button type="button" className={`${ui.btnReset} ${f.infoBtn}`} onClick={() => setInfo(false)} aria-label="Close">
              <Info size={16} />
            </button>
            <span className={f.callout}>
              <b>Info:</b>
              Trusted by 50,000+ farmers across India to keep an eye on their farms every day.
            </span>
            <span className={f.infoDivider} />
            <span className={f.infoHeading}>What you&apos;ll see</span>
            <span className={f.infoGrid}>
              {INFO_ITEMS.map(([label, file]) => (
                <span key={label} className={f.infoItem}>
                  <img src={img(file)} alt="" />
                  {label}
                </span>
              ))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Add-farm questions (add-farm-questions-screen.jsx) ----------

function QHead({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <p className={g.title} style={{ fontWeight: 600 }}>
        {title}
      </p>
      <p className={g.subtitle}>{subtitle}</p>
    </div>
  );
}

function GrowStep({ next, go }: ScreenProps) {
  const [value, setValue] = useState<"yes" | "no" | null>(null);
  return (
    <div className={base.screen}>
      <TopBarNew title="Add Your Farm" />
      <div className={base.scroll}>
        <div className={g.body}>
          <QHead title="Are you currently growing a crop?" subtitle="Choose an answer to continue your adventure" />
          {(["yes", "no"] as const).map((v) => {
            const on = value === v;
            return (
              <button
                key={v}
                type="button"
                className={`${ui.btnReset} ${g.growCard} ${on ? (v === "yes" ? g.growCardOn : f.growNoOn) : ""} ${!value && v === "yes" ? ui.hotspot : ""}`}
                onClick={() => setValue(v)}
              >
                <img src={img(v === "yes" ? "cg-grow-yes.webp" : "cg-grow-no.webp")} alt="" />
                <span className={g.growRow}>
                  <span>{v.toUpperCase()}</span>
                  {on ? (
                    <span className={v === "yes" ? g.greenCheck : f.blueCheck}>
                      <Check size={16} />
                    </span>
                  ) : (
                    <span className={g.radio} style={{ borderColor: "#6b7280" }} />
                  )}
                </span>
                {on && (
                  <span className={g.growBanner} style={v === "no" ? { color: "#004691" } : undefined}>
                    {v === "yes" ? "You're already growing - let's track it!" : "Start planning your next season"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className={s.footer}>
        <GradientButton label="Next" disabled={!value} hint onClick={() => (value === "no" ? go("fm-q-prev") : next())} />
      </div>
    </div>
  );
}

const FM_CROPS = [
  ["Rice (Paddy)", "crop-rice.webp"],
  ["Wheat", "crop-wheat.webp"],
  ["Cotton", "crop-cotton.webp"],
  ["Sugarcane", "cg-crop-sugarcane.webp"],
  ["Maize (Corn)", "crop-maize.webp"],
  ["Soyabean", "cg-crop-soyabean.webp"],
];

function CropStep({ onPick, previous, title }: { onPick: () => void; previous?: boolean; title: string }) {
  return (
    <div className={base.screen}>
      <TopBarNew title={title} />
      <div className={base.scroll}>
        <div className={g.body}>
          <QHead
            title={previous ? "Which crop was grown previously?" : "Which crop is growing?"}
            subtitle={previous ? "Select the crop grown in this field last season." : "Select the crop currently growing in this field."}
          />
          <span className={g.search}>
            <span>Search...</span>
            <Search size={20} />
          </span>
          <div className={g.cropGrid}>
            {FM_CROPS.map(([name, file], i) => (
              <button key={name} type="button" className={`${ui.btnReset} ${g.cropCard} ${i === 1 ? ui.hotspot : ""}`} onClick={onPick}>
                <img src={img(file)} alt="" />
                {name}
              </button>
            ))}
            <span className={f.otherCrop}>
              <PlusCircle size={30} />
              <span>
                <b>Other Crop</b>
                Can&apos;t find your crop?
              </span>
              <ChevronRight size={16} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const QCrop = ({ next }: ScreenProps) => <CropStep title="Add Your Farm" onPick={next} />;
const QPrevious = ({ next }: ScreenProps) => <CropStep title="Add Your Farm" previous onPick={next} />;

const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

function SowStep({ title, cta, onDone }: { title: string; cta: string; onDone: () => void }) {
  const [value, setValue] = useState<string | null>(null);
  const week = addDays(new Date(), -new Date().getDay());
  const monthAgo = new Date(week);
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const range = (d: Date) => `${fmt(d)} - ${fmt(addDays(d, 6))}`;
  const opts = [
    ["thisWeek", "This week", range(week)],
    ["lastWeek", "Last week", range(addDays(week, -7))],
    ["monthAgo", "One month ago", range(monthAgo)],
    ["custom", "Custom date", "Select a date"],
  ];
  return (
    <div className={base.screen}>
      <TopBarNew title={title} />
      <div className={base.scroll}>
        <div className={g.body}>
          <img className={g.illustration} src={img("cg-grow-yes.webp")} alt="" />
          <QHead title="When did you sow your seeds?" subtitle="Select the date to get more accurate growth insights." />
          <div className={g.optGrid}>
            {opts.map(([id, t, sub]) => (
              <button
                key={id}
                type="button"
                className={`${ui.btnReset} ${g.opt} ${value === id ? g.optOn : ""} ${!value && id === "lastWeek" ? ui.hotspot : ""}`}
                onClick={() => setValue(id)}
              >
                <span className={`${g.radio} ${value === id ? g.radioOn : ""}`} />
                <span className={g.optText}>
                  <b>{t}</b>
                  <span>{sub}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={s.footer}>
        <GradientButton label={cta} disabled={!value} hint onClick={onDone} />
      </div>
    </div>
  );
}

const QSow = ({ go }: ScreenProps) => <SowStep title="Add Your Farm" cta="Continue" onDone={() => go("fm-q-water")} />;

const WATER = [
  ["Rainfed", "cg-water-rainfed.webp"],
  ["Drip", "cg-water-drip.webp"],
  ["Canal", "cg-water-canal.webp"],
  ["Borewell", "cg-water-borewell.webp"],
];

function WaterStep({ title, cta, initial = [], onDone }: { title: string; cta: string; initial?: string[]; onDone: (sel: string[]) => void }) {
  const [sel, setSel] = useState<string[]>(initial);
  const toggle = (v: string) => setSel((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));
  return (
    <div className={base.screen}>
      <TopBarNew title={title} />
      <div className={base.scroll}>
        <div className={g.body}>
          <QHead title="How do you water your crops?" subtitle="Select your irrigation method (select all that apply)." />
          <div className={g.cropGrid}>
            {WATER.map(([name, file]) => {
              const on = sel.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  className={`${ui.btnReset} ${f.waterCard} ${on ? f.waterCardOn : ""} ${!sel.length && name === "Drip" ? ui.hotspot : ""}`}
                  onClick={() => toggle(name)}
                >
                  <img src={img(file)} alt="" />
                  <span className={f.waterRow}>
                    {name}
                    <span className={`${f.box} ${on ? f.boxOn : ""}`}>{on && <Check size={16} />}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className={s.footer}>
        <GradientButton label={cta} disabled={!sel.length} hint onClick={() => onDone(sel)} />
      </div>
    </div>
  );
}

const QWater = ({ next }: ScreenProps) => <WaterStep title="Add Your Farm" cta="Continue" onDone={next} />;

function NameStep({ next }: ScreenProps) {
  return (
    <div className={base.screen}>
      <TopBarNew title="Add Your Farm" />
      <div className={base.scroll}>
        <div className={g.body}>
          <img className={g.illustration} src={img("cg-grow-yes.webp")} alt="" />
          <QHead title="Give your farm a name" subtitle="This helps you find it easily later." />
          <div>
            <span className={g.nameInput}>
              <span>Farm_3</span>
              <Pencil size={20} color="#6B7280" />
            </span>
            <span className={g.helper} style={{ marginTop: 8 }}>
              <Info size={16} /> You can change this name anytime.
            </span>
          </div>
        </div>
      </div>
      <div className={s.footer}>
        <GradientButton label="Locate your Farm" hint icon={<MapPin size={18} fill="#fff" />} onClick={next} />
      </div>
    </div>
  );
}

// ---------- Mark your farm (mark-your-farm-screen.jsx) ----------

function MarkYourFarm({ go, edit }: ScreenProps & { edit?: boolean }) {
  const [method, setMethod] = useState<"draw" | "walk">("draw");
  const [confirm, setConfirm] = useState(false);
  const methods = [
    { id: "draw" as const, label: "Locate on Map", image: "fm-locate-on-map.webp" },
    { id: "walk" as const, label: "Walk to Mark", image: "fm-walk-to-mark.webp" },
  ];
  return (
    <div className={base.screen} style={{ position: "relative" }}>
      <TopBarNew title={edit ? "Update your farm" : "Mark your farm"} />
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
        {!edit && (
          <button type="button" className={`${ui.btnReset} ${s.saveLater}`} onClick={() => setConfirm(true)}>
            Save for Later
          </button>
        )}
        <GradientButton
          label="Continue"
          hint
          onClick={() => go(edit ? "fr-map-update" : method === "walk" ? "fm-walk" : "fm-map")}
        />
      </div>
      {confirm && (
        <div className={f.backdrop}>
          <div className={f.saveDialog} role="alertdialog" aria-label="Save and finish later?">
            <div>
              <b>Save and finish later?</b>
              <p>
                Your farm details will be saved. To see your report, you&apos;ll need to locate your farm on the map or by
                walking the boundary. You can do this anytime from Farms.
              </p>
            </div>
            <div className={f.dialogActions}>
              <button type="button" className={`${ui.btnReset} ${f.greyOutline}`} onClick={() => go("fm-my-farms")}>
                Yes, save &amp; exit
              </button>
              <button type="button" className={`${ui.btnReset} ${f.blueSolid}`} onClick={() => setConfirm(false)}>
                No, Go back!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Draw boundary + walk to mark (mark-farm-map-screen.jsx) ----------

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

function MarkFarmMap({ go, update }: ScreenProps & { update?: boolean }) {
  // Bumping the key replays the drawing animation ("Clear all" → draw again)
  const [drawKey, setDrawKey] = useState(0);
  const [tip, setTip] = useState(!update);
  return (
    <div className={base.screen}>
      <TopBarNew title={update ? "Update your Map" : "Mark your farm"} />
      <div className={s.mapArea}>
        <svg key={drawKey} className={s.mapSvg} viewBox="764 0 323 404" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <Illustration />
          <polygon className={s.boundaryFill} points={FIELD_POINTS} />
          <polygon className={s.boundaryLine} points={FIELD_POINTS} pathLength={100} />
          {FIELD.map(([x, y], i) => (
            <g key={i} className={s.pin} style={{ animationDelay: `${0.15 + i * 0.16}s` }}>
              <circle cx={x} cy={y} r="5.5" fill="#EF4444" stroke="#fff" strokeWidth="2" />
            </g>
          ))}
        </svg>
        <span className={f.searchBar}>
          <span>Search...</span>
          <Search size={20} color="#6B7280" />
        </span>
        {tip && (
          <span className={f.tipCard}>
            <button type="button" className={`${ui.btnReset} ${f.tipClose}`} onClick={() => setTip(false)} aria-label="Close tip">
              <X size={14} />
            </button>
            <b>Mark Your Field:</b>
            Tap the corners of your field on the map to draw the boundary
          </span>
        )}
      </div>
      <div className={s.mapSheet}>
        <div className={s.mapControls}>
          <span className={s.mapControl}>↶ Undo</span>
          <span className={s.mapControl}>↷ Redo</span>
          <button type="button" className={s.mapControl} onClick={() => setDrawKey((k) => k + 1)}>
            <Trash2 size={13} /> Clear all
          </button>
        </div>
        <div className={s.areaBlock}>
          <span className={s.areaLabel}>Estimated area</span>
          <span className={s.areaValue}>2.40 Acres</span>
          <span className={s.areaCaption}>Based on current boundary</span>
        </div>
        <GradientButton
          label={update ? "Update Boundary" : "Save Boundary"}
          onClick={() => (update ? go("fr-report") : go("fm-complete"))}
          hint
        />
      </div>
    </div>
  );
}

function WalkToMark({ go }: ScreenProps) {
  const [pins, setPins] = useState(1);
  const done = pins >= 3;
  const shown = FIELD.slice(0, Math.min(pins, FIELD.length));
  return (
    <div className={base.screen}>
      <TopBarNew title="Mark your farm" />
      <div className={s.mapArea}>
        <svg className={s.mapSvg} viewBox="764 0 323 404" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <Illustration />
          {shown.length >= 3 && <polygon points={shown.map((p) => p.join(",")).join(" ")} fill="rgba(0,70,145,.2)" stroke="#004691" strokeWidth={3} />}
          {shown.length === 2 && <polyline points={shown.map((p) => p.join(",")).join(" ")} fill="none" stroke="#004691" strokeWidth={3} />}
          {shown.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="6" fill="#004691" stroke="#fff" strokeWidth="2" />
          ))}
        </svg>
        <span className={f.walkHint}>
          <span className={f.walkHintIcon}>
            <MapPin size={20} />
          </span>
          <span>
            Go to the starting point of your field and tap &ldquo;<b>Add Pin</b>&rdquo;
          </span>
        </span>
      </div>
      <div className={f.statusCard}>
        {done && <p className={f.walkInstruction}>Walk around the boundary and add pins.</p>}
        <div className={f.vitals}>
          <span className={f.vital}>
            Pins added
            <b>{pins}</b>
          </span>
          <span className={f.vDivider} />
          {done ? (
            <span className={f.vital}>
              Total Marked
              <b>
                {(0.35 * pins).toFixed(2)}
                <small>acres</small>
              </b>
            </span>
          ) : (
            <p className={f.walkInstruction}>Walk around the boundary and add pins.</p>
          )}
        </div>
        <div className={f.walkActions}>
          <button
            type="button"
            className={`${ui.btnReset} ${done ? f.outlinePill : f.solidPill} ${!done ? base.hotspot : ""}`}
            onClick={() => setPins((n) => Math.min(n + 1, FIELD.length))}
          >
            Add Pin
          </button>
          {done && (
            <button type="button" className={`${ui.btnReset} ${f.solidPill} ${base.hotspot}`} onClick={() => go("fm-complete")}>
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Setup complete (farm-setup-complete-screen.jsx) ----------

function SetupComplete({ go, goToFlow }: ScreenProps) {
  return (
    <div className={base.screen}>
      <TopBarNew title="Mark your farm" />
      <div className={base.scroll}>
        <div className={g.body}>
          <div
            className={g.hero}
            style={{ height: 220, justifyContent: "flex-end", alignItems: "flex-start", backgroundImage: `url(${img("fm-farm-satellite.webp")})` }}
          >
            <span className={g.heroPill} style={{ background: "#ECFDF5", border: "1px solid #D1FAE5", color: "#065F46" }}>
              <CheckCircle2 size={16} /> SETUP COMPLETE
            </span>
          </div>
          <div style={{ textAlign: "center" }}>
            <p className={g.title} style={{ color: "#065F46", fontWeight: 600, textTransform: "uppercase" }}>
              Your farm is now monitored
            </p>
            <p className={g.subtitle} style={{ fontSize: 14 }}>
              Get personalized insights for your crop&apos;s health and growth.
            </p>
          </div>
          <div className={f.gtk} style={{ gap: 4, fontWeight: 400 }}>
            <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <b style={{ fontSize: 16 }}>Farm_3</b>
              <span className={f.chip} style={{ background: "#ECFDF5", borderColor: "#D1FAE5", color: "#065F46" }}>
                ⦿ Active
              </span>
            </span>
            <span style={{ color: "#6B7280", fontSize: 13 }}>Tumakuru, Karnataka</span>
          </div>
        </div>
      </div>
      <div className={s.footer}>
        <button type="button" className={`${ui.btnReset} ${f.outlinePill}`} style={{ width: "100%", flex: "none" }} onClick={() => go("fm-q-grow")}>
          Add another Farm
        </button>
        <GradientButton label="See the Insights" hint onClick={() => goToFlow("farm-report")} />
      </div>
    </div>
  );
}

// ---------- Report shared pieces ----------

function FarmMenu({ onClose, onSelect }: { onClose: () => void; onSelect: (a: string) => void }) {
  const [update, setUpdate] = useState(true);
  return (
    <div className={f.menuBackdrop} onClick={onClose} role="presentation">
      <div className={f.menu} role="menu" onClick={(e) => e.stopPropagation()}>
        <button type="button" role="menuitem" className={`${ui.btnReset} ${f.menuItem}`} onClick={() => onSelect("history")}>
          History
        </button>
        <div>
          <button type="button" className={`${ui.btnReset} ${f.menuItem} ${f.menuAccordion}`} style={{ width: "100%" }} onClick={() => setUpdate((v) => !v)}>
            Update Farm {update ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {update && (
            <div className={f.subItems}>
              {[
                ["crop", "Crop"],
                ["rename", "Rename"],
                ["water", "Water Irrigation"],
                ["map", "Map Change"],
              ].map(([id, label]) => (
                <button key={id} type="button" role="menuitem" className={`${ui.btnReset} ${f.subItem}`} onClick={() => onSelect(id)}>
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
        <span className={f.menuDivider} />
        <button type="button" role="menuitem" className={`${ui.btnReset} ${f.menuItem}`} style={{ color: "#ED0000" }} onClick={() => onSelect("delete")}>
          Delete Farm
        </button>
      </div>
    </div>
  );
}

function FarmDialog({
  icon,
  title,
  body,
  cancel,
  confirm,
  destructive,
  children,
  onCancel,
  onConfirm,
}: {
  icon: "crop" | "water" | "delete";
  title: string;
  body: string;
  cancel: string;
  confirm: string;
  destructive?: boolean;
  children?: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const Icon = icon === "delete" ? Trash2 : icon === "water" ? Droplets : Sprout;
  return (
    <div className={f.backdrop} onClick={onCancel} role="presentation">
      <div className={f.dialog} role="alertdialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <span className={f.dialogBadge} style={{ background: destructive ? "#FBDADA" : "#F1F6D8", color: destructive ? "#DC0000" : "#004691" }}>
          <Icon size={30} />
        </span>
        <p className={f.dialogTitle}>{title}</p>
        <p className={f.dialogBody}>{body}</p>
        {children}
        <div className={f.dialogRow}>
          <button type="button" className={`${ui.btnReset} ${f.cancelBtn}`} onClick={onCancel}>
            {cancel}
          </button>
          <button
            type="button"
            className={`${ui.btnReset} ${f.confirmBtn} ${ui.hotspot}`}
            style={destructive ? { background: "#DC0000" } : undefined}
            onClick={onConfirm}
          >
            {confirm}
          </button>
        </div>
      </div>
    </div>
  );
}

function MoreForFarm({ goToFlow }: Pick<ScreenProps, "goToFlow">) {
  return (
    <div className={f.moreCard}>
      <b>More for your Farm</b>
      <div className={f.moreRow}>
        <button type="button" className={`${ui.btnReset} ${f.moreTile}`} style={{ backgroundImage: `url(${img("cd-xsell-crop-guide.webp")})` }} onClick={() => goToFlow("crop-guide")}>
          <span>
            Crop Guide <ChevronRight size={14} />
          </span>
        </button>
        <span className={f.moreTile} style={{ backgroundImage: `url(${img("fm-refer-friend.webp")})` }}>
          <span>
            Refer a Friend <ChevronRight size={14} />
          </span>
        </span>
      </div>
    </div>
  );
}

// Kebab menu actions shared by the report and full-details screens
function useFarmActions(go: ScreenProps["go"], goToFlow: ScreenProps["goToFlow"]) {
  const [menu, setMenu] = useState(false);
  const [dialog, setDialog] = useState<null | "rename" | "crop" | "delete">(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const select = (a: string) => {
    setMenu(false);
    if (a === "history") go("fr-history");
    else if (a === "water") go("fr-update-water");
    else if (a === "map") go("fr-map-change");
    else setDialog(a as "rename" | "crop" | "delete");
  };

  const overlays = (
    <>
      {menu && <FarmMenu onClose={() => setMenu(false)} onSelect={select} />}
      {dialog === "rename" && (
        <FarmDialog
          icon="crop"
          title="Rename your Farm"
          body="Update the name of the current farm selection for this field."
          cancel="Cancel"
          confirm="Save"
          onCancel={() => setDialog(null)}
          onConfirm={() => {
            setDialog(null);
            setToast("Farm updated");
          }}
        >
          <span className={f.field}>
            New Farm Name
            <span className={f.input}>
              <span>Lakshmi Farm - North</span>
              <Pencil size={18} color="#004691" />
            </span>
          </span>
        </FarmDialog>
      )}
      {dialog === "crop" && (
        <FarmDialog
          icon="crop"
          title="Are you sure to change your crop?"
          body="This action will update the current crop selection for this field. Please confirm before continuing."
          cancel="No"
          confirm="Yes"
          onCancel={() => setDialog(null)}
          onConfirm={() => go("fr-update-crop")}
        />
      )}
      {dialog === "delete" && (
        <FarmDialog
          icon="delete"
          destructive
          title="Delete this farm?"
          body="This will permanently delete farm, crops, scans, and history. Cannot undo."
          cancel="Keep Farm"
          confirm="Delete Farm"
          onCancel={() => setDialog(null)}
          onConfirm={() => goToFlow("farm-monitoring", "fm-my-farms")}
        />
      )}
      {toast && <Toast text={toast} />}
    </>
  );
  return { openMenu: () => setMenu(true), overlays };
}

// ---------- Farm report, growing (farm-report-screen.jsx + components/farm-report/*) ----------

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
const STAGE_OPTIONS = ["Sowing", "Germination", "Seedling", "Vegetative", "Flowering", "Fruit", "Grain", "Maturity", "Harvest"];

function FarmReport({ go, goToFlow }: ScreenProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Growth");
  const [done, setDone] = useState<string[]>([]);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [stagePick, setStagePick] = useState("Vegetative");
  const { openMenu, overlays } = useFarmActions(go, goToFlow);

  return (
    <div className={base.screen} style={{ position: "relative" }}>
      <TopBarNew title="Farm Monitoring Report" onMenu={openMenu} />
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
              <span className={s.updated}>🕒 Updated 2 hr ago</span>
            </span>
          </div>
          <div>
            <p className={s.cropArea}>Wheat · 2.4 acre</p>
            <p className={s.farmLocation}>Lakshmi Farm · Tumakuru, Karnataka</p>
          </div>
          <p className={s.naDescription}>Growth is uneven in the north-east corner, and nitrogen looks low there.</p>
          <span className={s.hr} />
          <div className={s.details}>
            {[
              ["Stage", `${stagePick}, 2 of 5`],
              ["Irrigation", "Drip"],
              ["Soil", "Red loam"],
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
              <button key={t} type="button" role="tab" aria-selected={tab === t} className={`${s.tab} ${tab === t ? s.tabActive : ""}`} onClick={() => setTab(t)}>
                {t}
              </button>
            ))}
          </div>
          <div className={s.overlayWrap}>
            <svg className={s.overlaySvg} viewBox="765 111 320 170" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
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
              <span className={s.stageName}>{stagePick}</span>
            </span>
          </div>
          <div className={s.bars}>
            {STAGES.map((st, i) => (
              <span key={st} className={s.bar} style={{ background: i < 1 ? "#059669" : i === 1 ? "#0F2942" : "#E2E8F0" }} />
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
                <button type="button" className={s.pillOutline} onClick={() => setSheet(true)}>
                  Change stage
                </button>
                <button type="button" className={s.pillSolid} onClick={() => setConfirmed(true)}>
                  ✓ Yes, Confirm
                </button>
              </div>
            </div>
          )}
          <button
            type="button"
            className={`${ui.btnReset} ${f.viewDetails} ${confirmed ? f.viewDetailsSolid : ""} ${confirmed ? base.hotspot : ""}`}
            onClick={() => go("fr-full")}
          >
            View Full Details <ChevronRight size={12} />
          </button>
        </div>

        <MoreForFarm goToFlow={goToFlow} />
      </div>

      {sheet && (
        <div className={f.backdrop} style={{ alignItems: "flex-end", padding: 0 }} onClick={() => setSheet(false)} role="presentation">
          <div className={ui.sheet} style={{ width: "100%" }} role="dialog" aria-label="Change crop stage" onClick={(e) => e.stopPropagation()}>
            <div className={ui.sheetHandle} />
            <div className={f.stageSheetHead}>
              What stage is your crop actually in?
              <button type="button" className={`${ui.btnReset} ${f.sheetClose}`} onClick={() => setSheet(false)} aria-label="Close">
                <X size={14} />
              </button>
            </div>
            <div className={f.stageChips}>
              {STAGE_OPTIONS.map((o) => (
                <button key={o} type="button" className={`${ui.btnReset} ${f.stageChip} ${o === stagePick ? f.stageChipOn : ""}`} onClick={() => setStagePick(o)}>
                  {o}
                </button>
              ))}
            </div>
            <button
              type="button"
              className={`${ui.btnReset} ${f.solidPill}`}
              style={{ width: "100%" }}
              onClick={() => {
                setSheet(false);
                setConfirmed(true);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
      {overlays}
    </div>
  );
}

// ---------- Full details (farm-full-details-screen.jsx) ----------

const TIMELINE = [
  { name: "Sow", note: "Seeds placed, first irrigation done", range: "Day 0–7" },
  { name: "Vegetative", note: "Tillers forming; nitrogen demand is highest now", range: "Day 8–55" },
  { name: "Flower", note: "Ear heads emerge; keep soil moist", range: "Day 56–80" },
  { name: "Fruit set", note: "Grain filling; watch for rust", range: "Day 81–105" },
  { name: "Harvest", note: "Golden, hard grain; stop irrigation 2 weeks before", range: "Day 106–120" },
];

function FullDetails({ go, goToFlow }: ScreenProps) {
  const [more, setMore] = useState<Record<string, boolean>>({});
  const { openMenu, overlays } = useFarmActions(go, goToFlow);
  return (
    <div className={base.screen} style={{ position: "relative" }}>
      <TopBarNew title="Full Details" onMenu={openMenu} />
      <div className={f.badgeRow}>
        <span className={f.cropBadge}>Wheat · Stage 2</span>
      </div>
      <div className={base.scroll}>
        <div className={f.fdBody}>
          <div className={f.timelineCard}>
            <span className={f.timelineHead}>
              Growth Timeline <small>Day 46 of 120</small>
            </span>
            <div>
              {TIMELINE.map((st, i) => {
                const status = i < 1 ? "done" : i === 1 ? "current" : "upcoming";
                return (
                  <div key={st.name} className={`${f.step} ${status === "current" ? f.stepCurrent : ""}`}>
                    <span
                      className={f.ind}
                      style={
                        status === "done"
                          ? { background: "#10B981", color: "#fff" }
                          : status === "current"
                            ? { background: "#004691" }
                            : { border: "2px solid #E2E8F0" }
                      }
                    >
                      {status === "done" ? <Check size={12} /> : <i style={{ width: 8, height: 8, borderRadius: 4, background: status === "current" ? "#fff" : "#CBD5E1" }} />}
                    </span>
                    <span className={f.stepText} style={status === "current" ? { color: "#475569" } : undefined}>
                      <span className={f.stepName} style={{ color: status === "upcoming" ? "#64748B" : status === "current" ? "#0F2942" : "#1E293B" }}>
                        {st.name}
                        {status === "current" && <span className={f.currentBadge}>CURRENT</span>}
                      </span>
                      {st.note}
                    </span>
                    <span className={f.range} style={status === "current" ? { color: "#004691", fontWeight: 700 } : undefined}>
                      {st.range}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={f.insight}>
            <span>
              <span className={f.alertLabel}>Alert</span>
              <span className={f.insightHead}>Pest and Disease Risk</span>
            </span>
            <p className={f.insightBody}>Cool, humid mornings this week favour rust and aphids on wheat at this stage.</p>
            <div className={f.cols}>
              <div className={f.bullets}>
                <span className={f.bullet}>Aphids</span>
                <span className={f.bullet}>Termites</span>
              </div>
              <div className={f.bullets}>
                <span className={f.bullet}>Yellow rust</span>
                <span className={f.bullet}>Powdery mildew</span>
              </div>
            </div>
            <button type="button" className={`${ui.btnReset} ${f.scanCta}`} onClick={() => goToFlow("crop-doctor")}>
              <Camera size={22} /> Scan your Crop
            </button>
          </div>

          {[
            {
              id: "leaf",
              title: "Leaf Moisture",
              badge: { label: "GOOD", bg: "#ECFDF5", border: "#A7F3D0", color: "#047857" },
              body: "Leaves are holding water well across most of the field.",
              bullets: ["Hydration steady over the last 10 days", "Slight dip near the east boundary"],
              dot: "#10B981",
              more: "Leaf water content is read from the satellite's short-wave infrared band and compared with healthy wheat at the same stage.",
            },
            {
              id: "heat",
              title: "Heat Effects",
              badge: { label: "LOW", bg: "#FFF7ED", border: "#FED7AA", color: "#C2410C" },
              body: "Daytime temperatures are within the comfortable range for tillering.",
              bullets: ["No heat stress expected this week", "Night temperatures help tiller growth"],
              dot: "#E28743",
              more: "Heat stress starts above 30 °C during flowering; we will warn you before that window.",
            },
          ].map((c) => (
            <div key={c.id} className={f.insight}>
              <span className={f.insightHead}>
                {c.title}
                <span className={f.statusBadge} style={{ background: c.badge.bg, borderColor: c.badge.border, color: c.badge.color }}>
                  {c.badge.label}
                </span>
              </span>
              <p className={f.insightBody}>{c.body}</p>
              <div className={f.bullets} style={{ ["--dot" as string]: c.dot }}>
                {c.bullets.map((b) => (
                  <span key={b} className={f.bullet}>
                    {b}
                  </span>
                ))}
              </div>
              {more[c.id] && <p className={f.insightBody}>{c.more}</p>}
              <button type="button" className={`${ui.btnReset} ${f.readMore}`} onClick={() => setMore((m) => ({ ...m, [c.id]: !m[c.id] }))}>
                {more[c.id] ? "Read less" : "Read more"} {more[c.id] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>
          ))}

          <div className={f.insight}>
            <span className={f.insightHead}>Good Habits to Keep</span>
            <div className={f.bullets} style={{ ["--dot" as string]: "#94A3B8" }}>
              <span className={f.bullet}>Irrigate early in the morning</span>
              <span className={f.bullet}>Walk the field once a week</span>
              <span className={f.bullet}>Keep bunds free of weeds</span>
            </div>
          </div>
        </div>
      </div>
      {overlays}
    </div>
  );
}

// ---------- History (farm-history-screen.jsx) ----------

const HISTORY = [
  {
    label: "Today",
    items: [{ status: "Needs Attention", time: "09:12 am", note: "Growth is uneven in the north-east corner, and nitrogen looks low there." }],
  },
  {
    label: "14 Oct 2026",
    items: [{ status: "Healthy", time: "06:40 pm", note: "Even growth across the field; moisture is good." }],
  },
  {
    label: "07 Oct 2026",
    items: [
      { status: "Healthy", time: "11:05 am", note: "Crop has established well after sowing." },
      { status: "Generating report…", time: "10:58 am", note: "" },
    ],
  },
];

function History({ go }: ScreenProps) {
  return (
    <div className={base.screen}>
      <TopBarNew title="History" />
      <div className={base.scroll}>
        <div className={f.historyBody}>
          {HISTORY.map((grp, gi) => (
            <div key={grp.label} className={f.group}>
              <span className={f.groupLabel}>{grp.label}</span>
              <div className={f.entries}>
                {grp.items.map((it, ii) => (
                  <button
                    key={it.time}
                    type="button"
                    className={`${ui.btnReset} ${f.entry} ${gi === 1 && ii === 0 ? ui.hotspot : ""}`}
                    onClick={it.note ? () => go("fr-report") : undefined}
                    disabled={!it.note}
                  >
                    <span className={f.entryRow}>
                      <b>{it.status}</b>
                      {it.time}
                    </span>
                    {it.note && <p>{it.note}</p>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Update screens (add-farm-questions in crop / irrigation mode, mark-your-farm edit) ----------

const UpdateCrop = ({ next }: ScreenProps) => <CropStep title="Update Crop" onPick={next} />;

function UpdateSow({ go }: ScreenProps) {
  return <SowStep title="Update Crop" cta="Update" onDone={() => go("fr-report")} />;
}

function UpdateWater({ go }: ScreenProps) {
  const [confirm, setConfirm] = useState<string[] | null>(null);
  return (
    <div style={{ position: "relative", height: "100%" }}>
      <WaterStep title="Update Irrigation Method" cta="Update" initial={["Drip"]} onDone={(sel) => setConfirm(sel)} />
      {confirm && (
        <FarmDialog
          icon="water"
          title="Change irrigation method?"
          body={`Change from Drip to ${confirm.join(", ")}?`}
          cancel="Cancel"
          confirm="Confirm"
          onCancel={() => setConfirm(null)}
          onConfirm={() => go("fr-report")}
        />
      )}
    </div>
  );
}

const MapChange = (p: ScreenProps) => <MarkYourFarm {...p} edit />;
const MapUpdate = (p: ScreenProps) => <MarkFarmMap {...p} update />;

// ---------- Pre-planting report (farm-report-screen.jsx renderPrePlanting + pre-planting-cards.jsx) ----------

function NoCropReport({ go, goToFlow }: ScreenProps) {
  const { openMenu, overlays } = useFarmActions(go, goToFlow);
  const tiles = [
    { label: "Moisture", value: "28%", status: "Moist", Icon: Droplets },
    { label: "Soil Temp", value: "24°C", status: "Mild", Icon: Thermometer },
    { label: "Weather", value: "27°C", status: "Rainy", Icon: Cloud },
    { label: "UV Index", value: "Level 6", status: "High", Icon: Sun },
  ];
  return (
    <div className={base.screen} style={{ position: "relative" }}>
      <TopBarNew title="Farm Monitoring" onMenu={openMenu} />
      <div className={`${base.scroll} ${s.fmReportBody}`}>
        <div className={s.card}>
          <div className={s.naHeader}>
            <span className={s.naTitleStack}>
              <span className={s.warnIcon} style={{ background: "#F1F6D8", color: "#0F2942" }}>
                <Sprout size={22} />
              </span>
              <span className={s.naTitle} style={{ color: "#0F2942" }}>
                No Crop
              </span>
            </span>
            <span className={s.syncStack}>
              <span className={s.syncPill}>↻ Sync</span>
              <span className={s.updated}>🕒 Updated 5 min ago</span>
            </span>
          </div>
          <p className={s.farmLocation}>Farm_2 · Tumakuru, Karnataka</p>
          <span className={s.hr} />
          <div className={s.details}>
            {[
              ["Irrigation", "Canal, Borewell"],
              ["Soil", "Red loam"],
              ["Previous crop", "Paddy"],
            ].map(([label, value]) => (
              <span key={label} className={s.detail}>
                <span className={s.detailLabel}>{label}</span>
                <span className={s.detailValue}>{value}</span>
              </span>
            ))}
          </div>
        </div>
        <div className={f.gtk}>
          Good to Know Before You Plant
          <div className={f.tiles}>
            {tiles.map(({ label, value, status, Icon }) => (
              <span key={label} className={f.tile}>
                <span className={f.tileIcon}>
                  <Icon size={18} />
                </span>
                <small>{label}</small>
                <b>{value}</b>
                <small>{status}</small>
              </span>
            ))}
          </div>
        </div>
        <div className={f.noCrop}>
          <span className={f.noCropBadge}>
            <Sprout size={34} />
          </span>
          <b>No crop growing on this field right now</b>
          <p>You can still see what would grow well here.</p>
          <button type="button" className={`${ui.btnReset} ${f.solidPill} ${base.hotspot}`} style={{ alignSelf: "stretch", flex: "none" }} onClick={() => goToFlow("crop-guide")}>
            See What to Plant
          </button>
          <button type="button" className={`${ui.btnReset} ${f.planted}`} onClick={() => go("fr-update-crop")}>
            Already Planted?
            <small>Update your Farm Details</small>
          </button>
        </div>
        <MoreForFarm goToFlow={goToFlow} />
      </div>
      {overlays}
    </div>
  );
}

// ---------- Generating state (CenterState while the satellite report is processed) ----------

function Generating({ go }: ScreenProps) {
  useEffect(() => {
    const t = setTimeout(() => go("fr-report"), 2600);
    return () => clearTimeout(t);
  }, [go]);
  return (
    <div className={base.screen}>
      <TopBarNew title="Farm Monitoring Report" />
      <div className={f.center}>
        <span className={f.spinner} />
        <b>Generating your farm report</b>
        <p>We&apos;re reading the latest satellite data for your farm. This usually takes under a minute.</p>
      </div>
    </div>
  );
}

export const farmMonitoringScreens: Record<string, ComponentType<ScreenProps>> = {
  "fm-my-farms": MyFarms,
  "fm-q-grow": GrowStep,
  "fm-q-crop": QCrop,
  "fm-q-sow": QSow,
  "fm-q-prev": QPrevious,
  "fm-q-water": QWater,
  "fm-q-name": NameStep,
  "fm-mark": MarkYourFarm,
  "fm-map": MarkFarmMap,
  "fm-walk": WalkToMark,
  "fm-complete": SetupComplete,
  "fr-generating": Generating,
  "fr-report": FarmReport,
  "fr-full": FullDetails,
  "fr-history": History,
  "fr-update-crop": UpdateCrop,
  "fr-update-sow": UpdateSow,
  "fr-update-water": UpdateWater,
  "fr-map-change": MapChange,
  "fr-map-update": MapUpdate,
  "fr-nocrop": NoCropReport,
};

