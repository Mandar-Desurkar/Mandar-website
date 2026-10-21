/* eslint-disable @next/next/no-img-element -- fixed-size mock screens inside a phone frame */
"use client";

// Gau Sampurna Herd tab, recreated from the `prod` branch: gau-swastha-tenant/farm/my-herd-screen.jsx
// (the Herd tab, /(farm)/herd-health and /(farm)/cow-details/[id] all render it: a pager with a
// Summary page and one profile page per cow, plus the Edit Cow modal) and add-cow-screen.jsx.
// cow-details-screen.jsx and all-cows-screen.jsx are no longer routed. Herd values are samples.
import { useState, type ComponentType } from "react";
import {
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Droplets,
  FileText,
  Info,
  LayoutGrid,
  Minus,
  Pencil,
  Plus,
  RotateCw,
  ScanLine,
  Search,
  TriangleAlert,
  X,
} from "lucide-react";
import s from "./gauHerd.module.css";
import { GauSheet, GauTabBar, PRODUCTS, ProductCard, gimg, rupee, u, useToast } from "./GauShared";
import { HERD } from "./GauHome";
import type { ScreenProps } from "../kissan/KissanScreens";

const BADGE: Record<string, { bg: string; dot: string }> = {
  Critical: { bg: "#E60023", dot: "#FFA39E" },
  Healthy: { bg: "#32A071", dot: "#0BFF96" },
  "Scan Due": { bg: "#D97706", dot: "#FDE68A" },
};

const LIST_STATUS: Record<string, { text: string; color: string; dot: string }> = {
  Critical: { text: "Needs attention", color: "#C20F10", dot: "#C20F10" },
  Healthy: { text: "Healthy", color: "#02A345", dot: "#02A345" },
  "Scan Due": { text: "Scan due", color: "#6C757D", dot: "#94A3B8" },
};

const REPORT_BADGE: Record<string, { bg: string; dot: string; color: string }> = {
  Critical: { bg: "#FFCBC8", dot: "#E60023", color: "#E60023" },
  Healthy: { bg: "#32A071", dot: "#0BFF96", color: "#FFFFFF" },
  "Scan Due": { bg: "#FEF3C7", dot: "#D97706", color: "#D97706" },
};

// Per-cow sample profile (cow_meta from /farm-cows)
const PROFILE: Record<string, { calved: string; pregnant: string; current: number | null; potential: number | null; loss: number | null; value: string | null; asOf: string; lactation?: string; scans: { title: string; time: string; status: string; flow: string; screen: string }[] }> = {
  Gowri: {
    calved: "2",
    pregnant: "No",
    current: 9,
    potential: 13,
    loss: 4200,
    value: "₹78,000 – ₹86,000",
    asOf: "As of 18 Oct",
    lactation: "Low Yield",
    scans: [
      { title: "Disease Check", time: "Today", status: "Critical", flow: "disease-check", screen: "gs-diagnosis" },
      { title: "Animal Status", time: "12 days ago", status: "Healthy", flow: "animal-status", screen: "gs-status-report" },
    ],
  },
  Ganga: {
    calved: "3",
    pregnant: "5 mo",
    current: 14,
    potential: 15,
    loss: null,
    value: "₹92,000 – ₹1,00,000",
    asOf: "As of 15 Oct",
    scans: [{ title: "Animal Status", time: "3 days ago", status: "Healthy", flow: "animal-status", screen: "gs-status-report" }],
  },
  Narmada: { calved: "1", pregnant: "No", current: null, potential: null, loss: null, value: null, asOf: "Not yet assessed", scans: [] },
};

function HerdSwitcher({ tab, setTab, onAdd }: { tab: string; setTab: (t: string) => void; onAdd: () => void }) {
  return (
    <div className={s.switcher}>
      <div className={s.switcherScroll}>
        <button type="button" className={`${u.btnReset} ${s.tabItem}`} onClick={onAdd}>
          <span className={s.addCircle}>
            <Plus size={22} color="#64748B" />
          </span>
          <span className={s.tabLabel}>Add Cow</span>
        </button>
        <button type="button" className={`${u.btnReset} ${s.tabItem}`} onClick={() => setTab("summary")} aria-pressed={tab === "summary"}>
          <span className={`${s.summaryCircle} ${tab === "summary" ? s.summaryActive : ""}`}>
            <LayoutGrid size={22} color={tab === "summary" ? "#fff" : "#004691"} />
          </span>
          <span className={`${s.tabLabel} ${tab === "summary" ? s.tabLabelActive : ""}`}>Summary</span>
          {tab === "summary" && <span className={s.indicator} />}
        </button>
        {HERD.map((c) => (
          <button key={c.name} type="button" className={`${u.btnReset} ${s.tabItem}`} onClick={() => setTab(c.name)} aria-pressed={tab === c.name}>
            <span className={s.avatarWrap}>
              <img src={gimg(c.image)} alt="" className={s.avatar} />
              <span className={s.avatarDot} style={{ background: LIST_STATUS[c.status].dot }} />
            </span>
            <span className={`${s.tabLabel} ${tab === c.name ? s.tabLabelActive : ""}`}>{c.name}</span>
            {tab === c.name && <span className={s.indicator} />}
          </button>
        ))}
      </div>
    </div>
  );
}

function Summary({ setTab, goToFlow }: { setTab: (t: string) => void; goToFlow: ScreenProps["goToFlow"] }) {
  const [showAll, setShowAll] = useState(false);
  const cows = showAll ? HERD : HERD.slice(0, 2);
  return (
    <div className={s.page}>
      <section className={s.dashboard}>
        <h3 className={s.dashTitle}>Herd Health Dashboard</h3>
        <div className={s.kpiRow}>
          {[
            { label: "Critical", n: 1, bg: "#F9DCDC", dot: "#C20F10", color: "#C20F10" },
            { label: "Scan Due", n: 1, bg: "#D8E0E8", dot: "#6C757D", color: "#475569" },
            { label: "Healthy", n: 1, bg: "#CBF9DF", dot: "#02A345", color: "#02A345" },
          ].map((k) => (
            <div key={k.label} className={s.kpi} style={{ background: k.bg }}>
              <span className={s.kpiHead}>
                <i style={{ background: k.dot }} />
                {k.label}
              </span>
              <span className={s.kpiNum} style={{ color: k.color }}>
                {k.n}
              </span>
            </div>
          ))}
        </div>
        <div className={s.valRow}>
          <div className={`${s.valCard} ${s.valBlue}`}>
            <span className={s.valLabel}>Total Herd Value</span>
            <span className={s.valText}>₹1.7L – ₹1.86L</span>
            <span className={s.dividerWhite} />
            <span className={s.valSub}>latest values</span>
            <span className={s.valMissing}>1 cow without a value</span>
          </div>
          <div className={`${s.valCard} ${s.valLime}`}>
            <span className={s.valLabel}>Total Milk</span>
            <span className={s.valText}>23 Litres</span>
            <span className={s.dividerBlack} />
            <span className={s.valSub}>Avg per cow: 11.5 L</span>
          </div>
        </div>
      </section>

      <section className={s.registered}>
        <h3 className={s.heading}>Registered Cattle ({HERD.length})</h3>
        <div className={s.cattleList}>
          {cows.map((c, i) => (
            <div key={c.name} className={`${s.cowCard} ${i === 0 ? u.hotspot : ""}`}>
              <button type="button" className={`${u.btnReset} ${s.cowRow}`} onClick={() => setTab(c.name)}>
                <img src={gimg(c.image)} alt="" className={s.cowThumb} />
                <span className={s.cowInfo}>
                  <span className={s.cowNameRow}>
                    <b>{c.name}</b>
                    <span className={s.breedPill}>{c.breed}</span>
                  </span>
                  <span className={s.cowStatus} style={{ color: LIST_STATUS[c.status].color }}>
                    {LIST_STATUS[c.status].text}
                  </span>
                </span>
              </button>
              <button type="button" className={`${u.btnReset} ${s.quickScan}`} onClick={() => goToFlow("dung-scan")} aria-label={`Dung scan for ${c.name}`}>
                <ScanLine size={18} color="#fff" />
              </button>
              <ChevronRight size={20} color="#94A3B8" />
            </div>
          ))}
        </div>
        <button type="button" className={`${u.btnReset} ${s.viewAll}`} onClick={() => setShowAll((v) => !v)}>
          {showAll ? "Show fewer cows" : `View all ${HERD.length} cows`}
          <ChevronDown size={16} style={{ transform: showAll ? "rotate(180deg)" : undefined }} />
        </button>
      </section>

      <div className={s.infoCard}>
        <span className={s.infoIcon}>
          <Info size={18} color="#004691" />
        </span>
        <span>
          <b>Important Update</b>
          <small>A Weekly dung scan catches feed and digestion problems early, before milk drops.</small>
        </span>
      </div>

      <section>
        <div className={u.sectionHead} style={{ padding: 0 }}>
          <h3 className={s.heading}>Recommended for you</h3>
          <button type="button" className={`${u.btnReset} ${u.link}`} onClick={() => goToFlow("gs-shop")}>
            View all
          </button>
        </div>
        <div className={u.hScroll} style={{ padding: "0 0 4px" }}>
          {PRODUCTS.slice(1, 4).map((p) => (
            <ProductCard key={p.id} p={p} onOpen={() => goToFlow("gs-shop", "gs-product")} />
          ))}
        </div>
      </section>
    </div>
  );
}

function CowProfile({ name, onEdit, goToFlow }: { name: string; onEdit: () => void; goToFlow: ScreenProps["goToFlow"] }) {
  const cow = HERD.find((c) => c.name === name) ?? HERD[0];
  const p = PROFILE[cow.name];
  const [added, setAdded] = useState(false);
  const feed = PRODUCTS[0];
  const last = p.scans[0];
  const lastStatus = last ? last.status : "Scan Due";
  return (
    <div className={s.page}>
      <div className={s.hero}>
        <img src={gimg(cow.image)} alt="" />
        <span className={s.heroShade} />
        <span className={s.heroBadge} style={{ background: BADGE[cow.status].bg }}>
          <i style={{ background: BADGE[cow.status].dot }} />
          {cow.status}
        </span>
        <span className={s.heroName}>{cow.name}</span>
      </div>

      {p.current != null && (
        <section className={s.card}>
          <div className={s.lacHead}>
            <span>
              <Droplets size={20} color="#004691" fill="#004691" />
              Lactation
            </span>
            {p.lactation && <span className={s.lacBadge}>{p.lactation}</span>}
          </div>
          <div className={s.milkRow}>
            <div className={s.milkBox} style={{ background: "#004691", color: "#fff" }}>
              <span>Current milk yield</span>
              <span className={s.dividerWhite} />
              <b>{p.current} L / Day</b>
            </div>
            {p.potential != null && (
              <div className={s.milkBox} style={{ background: "#DADF2B", color: "#002B58" }}>
                <span>Potential milk yield</span>
                <span className={s.dividerBlack} />
                <b>{p.potential} L / Day</b>
              </div>
            )}
          </div>
          {p.loss != null && (
            <>
              <div className={s.lossBox}>
                <span className={s.lossHead}>
                  <i>
                    <TriangleAlert size={13} color="#915E00" />
                  </i>
                  Estimated profit loss
                </span>
                <b>~{rupee(p.loss)}/month</b>
              </div>
              <div className={s.supplement}>
                <img src={gimg("herd-lactation-feed.webp")} alt="" />
                <span className={s.supInfo}>
                  <b>{feed.title}</b>
                  <small>Recommended to close the milk gap</small>
                  <span>
                    <strong>{rupee(feed.price)}</strong> <s>{rupee(feed.mrp)}</s>
                  </span>
                </span>
                <button type="button" className={`${u.btnReset} ${s.supAdd} ${added ? s.supAdded : ""}`} onClick={() => setAdded(true)}>
                  {added ? "Added" : "Add to Cart"}
                </button>
              </div>
            </>
          )}
        </section>
      )}

      <section className={s.market}>
        <button type="button" className={`${u.btnReset} ${s.marketBar}`} onClick={() => goToFlow("market-value")}>
          <RotateCw size={13} />
          Update
        </button>
        <button type="button" className={`${u.btnReset} ${s.marketBody}`} onClick={() => goToFlow("market-value", p.value ? "gs-market-report" : undefined)}>
          <span className={s.marketTitle}>Market value</span>
          <span className={s.marketDate}>{p.asOf}</span>
          <span className={s.marketVal}>{p.value ?? "Tap Update to assess"}</span>
        </button>
      </section>

      <section className={s.sectionWrap}>
        <span className={s.caps}>LAST SCAN</span>
        <button
          type="button"
          className={`${u.btnReset} ${s.reportCard}`}
          onClick={() => (last ? goToFlow(last.flow, last.screen) : goToFlow("dung-scan"))}
        >
          <span className={s.reportIcon}>
            <FileText size={20} color="#004691" />
          </span>
          <span className={s.reportMid}>
            <b>{last ? last.title : "No scans yet"}</b>
            <small>{last ? <>Scanned: <strong>{last.time}</strong></> : "Start with a quick dung scan"}</small>
          </span>
          <span className={s.reportBadge} style={{ background: REPORT_BADGE[lastStatus].bg, color: REPORT_BADGE[lastStatus].color }}>
            <i style={{ background: REPORT_BADGE[lastStatus].dot }} />
            {lastStatus}
          </span>
        </button>
      </section>

      <button type="button" className={`${u.btnReset} ${s.newScan} ${u.hotspot}`} onClick={() => goToFlow("disease-check", "gs-hub")}>
        <ScanLine size={20} />
        New Scan for {cow.name}
      </button>

      <section className={s.sectionWrap}>
        <div className={s.profileHead}>
          <h3 className={s.heading}>Profile Details</h3>
          <button type="button" className={`${u.btnReset} ${s.editBtn}`} onClick={onEdit}>
            <Pencil size={14} />
            Edit
          </button>
        </div>
        <div className={s.grid}>
          <div style={{ background: "#E1DCFB" }}>
            <span>Times calved</span>
            <b>{p.calved}</b>
          </div>
          <div style={{ background: "#C7EDED" }}>
            <span>Breed</span>
            <b className={s.small}>{cow.breed}</b>
          </div>
          <div style={{ background: "#FEDAC2" }}>
            <span>Pregnant</span>
            <b>{p.pregnant}</b>
          </div>
          <div style={{ background: "#FCE9BF" }}>
            <span>Milk yield</span>
            <b className={s.small}>{p.current != null ? `${p.current} L / day` : "—"}</b>
          </div>
        </div>
      </section>

      <section className={s.sectionWrap}>
        <h3 className={s.heading}>Scan History</h3>
        {p.scans.length === 0 ? (
          <p className={s.empty}>No scans recorded for {cow.name} yet.</p>
        ) : (
          p.scans.map((r) => (
            <button key={r.title + r.time} type="button" className={`${u.btnReset} ${s.reportCard}`} onClick={() => goToFlow(r.flow, r.screen)}>
              <span className={s.reportIcon}>
                <FileText size={20} color="#004691" />
              </span>
              <span className={s.reportMid}>
                <b>{r.title}</b>
                <small>
                  Scanned: <strong>{r.time}</strong>
                </small>
              </span>
              <span className={s.reportBadge} style={{ background: REPORT_BADGE[r.status].bg, color: REPORT_BADGE[r.status].color }}>
                <i style={{ background: REPORT_BADGE[r.status].dot }} />
                {r.status}
              </span>
            </button>
          ))
        )}
      </section>
    </div>
  );
}

function EditCowModal({ name, onClose, onSave }: { name: string; onClose: () => void; onSave: () => void }) {
  const cow = HERD.find((c) => c.name === name) ?? HERD[0];
  const [pregnant, setPregnant] = useState(PROFILE[cow.name].pregnant !== "No");
  return (
    <div className={u.center} role="presentation" onClick={onClose}>
      <div className={s.modal} role="dialog" aria-label="Edit Cow" onClick={(e) => e.stopPropagation()}>
        <b className={s.modalTitle}>Edit Cow</b>
        <label className={s.inputLabel}>
          Cow Name
          <input className={s.modalInput} defaultValue={cow.name} />
        </label>
        <label className={s.inputLabel}>
          Breed
          <input className={s.modalInput} defaultValue={cow.breed} />
        </label>
        <label className={s.inputLabel}>
          Times Calved
          <input className={s.modalInput} defaultValue={PROFILE[cow.name].calved} inputMode="numeric" />
        </label>
        <div className={s.toggleRow}>
          <span className={s.inputLabel}>Pregnant</span>
          <span className={s.toggleBtns}>
            <button type="button" className={`${u.btnReset} ${pregnant ? s.toggleOn : ""}`} onClick={() => setPregnant(true)}>
              Yes
            </button>
            <button type="button" className={`${u.btnReset} ${!pregnant ? s.toggleOn : ""}`} onClick={() => setPregnant(false)}>
              No
            </button>
          </span>
        </div>
        <div className={s.modalActions}>
          <button type="button" className={`${u.btnReset} ${s.cancel}`} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={`${u.btnReset} ${s.save}`} onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function MyHerd({ go, goToFlow, back, initial }: ScreenProps & { initial: string }) {
  const [tab, setTab] = useState(initial);
  const [editing, setEditing] = useState(false);
  const toast = useToast();
  return (
    <div className={u.screen}>
      <div className={s.header}>
        <button type="button" className={`${u.btnReset} ${s.back}`} onClick={() => (initial === "summary" ? goToFlow("gs-home") : back())} aria-label="Back">
          <ChevronRight size={16} style={{ transform: "rotate(180deg)" }} />
        </button>
        <span className={s.headerTitle}>My Herd</span>
        <span className={s.spacer} />
      </div>
      <HerdSwitcher tab={tab} setTab={setTab} onAdd={() => go("gs-add-cow")} />
      <div className={u.scroll} key={tab}>
        {tab === "summary" ? (
          <Summary setTab={setTab} goToFlow={goToFlow} />
        ) : (
          <CowProfile name={tab} onEdit={() => setEditing(true)} goToFlow={goToFlow} />
        )}
      </div>
      <GauTabBar active="herd" goToFlow={goToFlow} />
      {editing && (
        <EditCowModal
          name={tab}
          onClose={() => setEditing(false)}
          onSave={() => {
            setEditing(false);
            toast.show("Cow details updated");
          }}
        />
      )}
      {toast.node}
    </div>
  );
}

const BREEDS = ["HF Cross", "Gir", "Sahiwal", "Jersey", "Red Sindhi", "Tharparkar", "Kankrej", "Rathi"];
const RANGES = ["0–1.5 months", "1.5–4.5 months", "4.5–7 months", "7+ months"];

function Stepper({ value, onChange }: { value: number | null; onChange: (n: number) => void }) {
  return (
    <div className={s.qtyTrack}>
      <button type="button" className={`${u.btnReset} ${s.qtyMinus}`} onClick={() => onChange(Math.max(0, (value ?? 0) - 1))} aria-label="Decrease">
        <Minus size={20} color="#004691" />
      </button>
      <span className={s.qtyWell}>{value ?? <span className={s.qtyPh}>0</span>}</span>
      <button type="button" className={`${u.btnReset} ${s.qtyPlus}`} onClick={() => onChange((value ?? 0) + 1)} aria-label="Increase">
        <Plus size={20} color="#fff" />
      </button>
    </div>
  );
}

function YesNo({ value, onChange }: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <span className={s.segmented}>
      <button type="button" className={`${u.btnReset} ${value === true ? s.segOn : ""}`} onClick={() => onChange(true)}>
        Yes
      </button>
      <button type="button" className={`${u.btnReset} ${value === false ? s.segOn : ""}`} onClick={() => onChange(false)}>
        No
      </button>
    </span>
  );
}

function AddCow({ back, go }: ScreenProps) {
  const [photo, setPhoto] = useState(false);
  const [photoSheet, setPhotoSheet] = useState(false);
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [breedSheet, setBreedSheet] = useState(false);
  const [search, setSearch] = useState("");
  const [calved, setCalved] = useState<number | null>(null);
  const [pregnant, setPregnant] = useState<boolean | null>(null);
  const [months, setMonths] = useState<number | null>(null);
  const [milking, setMilking] = useState<boolean | null>(null);
  const [milk, setMilk] = useState<number | null>(null);
  const [lastCalved, setLastCalved] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const canSubmit = photo && name.trim() && breed && calved !== null && pregnant !== null && milking !== null;
  const save = () => {
    setSaving(true);
    setTimeout(() => go("gs-herd"), 900);
  };
  return (
    <div className={u.screen}>
      <div className={s.header}>
        <button type="button" className={`${u.btnReset} ${s.back}`} onClick={back} aria-label="Back">
          <ChevronRight size={16} style={{ transform: "rotate(180deg)" }} />
        </button>
        <span className={s.headerTitle}>Add Cow</span>
        <span className={s.spacer} />
      </div>
      <div className={`${u.scroll} ${s.form}`}>
        <div className={s.fCard}>
          <span>
            <b className={s.photoTitle}>Side Photo</b>
            <small className={s.photoSub}>Upload a clear, full-body side photo of the cow.</small>
          </span>
          <button type="button" className={`${u.btnReset} ${s.dashed} ${photo ? s.dashedFilled : u.hotspot}`} onClick={() => setPhotoSheet(true)}>
            {photo ? (
              <>
                <img src={gimg("gowri-side.jpg")} alt="Side photo of the cow" />
                <span className={s.changePill}>
                  <Camera size={14} />
                  Change Photo
                </span>
              </>
            ) : (
              <>
                <span className={s.camCircle}>
                  <Camera size={22} color="#003166" />
                </span>
                Tap to take or pick photo
              </>
            )}
          </button>
        </div>
        <div className={s.fCard}>
          <span className={s.fieldLabel}>Name</span>
          <input className={s.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Gowri" aria-label="Name" />
        </div>
        <div className={s.fCard}>
          <span className={s.fieldLabel}>Breed</span>
          <button type="button" className={`${u.btnReset} ${s.select}`} onClick={() => setBreedSheet(true)}>
            <span className={breed ? "" : s.placeholder}>{breed || "Select cow breed"}</span>
            <ChevronDown size={20} color="#004691" />
          </button>
        </div>
        <div className={s.fCard}>
          <span className={s.fieldLabel}>How many times did the cattle calve?</span>
          <Stepper value={calved} onChange={setCalved} />
        </div>
        <div className={s.fCard}>
          <div className={s.toggleField}>
            <span className={s.fieldLabel}>Pregnant</span>
            <YesNo value={pregnant} onChange={setPregnant} />
          </div>
          {pregnant && (
            <>
              <span className={s.divider} />
              <span className={s.fieldLabel}>How many months?</span>
              <div className={s.months}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((m) => (
                  <button key={m} type="button" className={`${u.btnReset} ${s.month} ${months === m ? s.monthOn : ""}`} onClick={() => setMonths(m)}>
                    {m}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className={s.fCard}>
          <div className={s.toggleField}>
            <span className={s.fieldLabel}>Milking</span>
            <YesNo value={milking} onChange={setMilking} />
          </div>
          {milking && (
            <>
              <span className={s.divider} />
              <span className={s.fieldLabel}>Milk per day (L)</span>
              <Stepper value={milk} onChange={setMilk} />
            </>
          )}
        </div>
        {calved !== null && calved > 0 && (
          <div className={s.fCard}>
            <span className={s.fieldLabel}>When did your cattle last calve?</span>
            <div className={s.ranges}>
              {RANGES.map((r) => (
                <button key={r} type="button" className={`${u.btnReset} ${s.range} ${lastCalved === r ? s.rangeOn : ""}`} onClick={() => setLastCalved(r)}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className={u.footer}>
        <button type="button" className={`${u.btnReset} ${s.saveCattle} ${canSubmit ? "" : s.saveOff}`} disabled={!canSubmit || saving} onClick={save}>
          {saving ? <span className={s.spinner} aria-label="Saving" /> : "Save Cattle"}
        </button>
      </div>

      {photoSheet && (
        <GauSheet label="Add side photo" onClose={() => setPhotoSheet(false)}>
          <div className={s.sheetHead}>
            <b>Add side photo</b>
            <button type="button" className={`${u.btnReset} ${s.closeBtn}`} onClick={() => setPhotoSheet(false)} aria-label="Close">
              <X size={18} />
            </button>
          </div>
          {["Take Photo", "Choose from Gallery"].map((o) => (
            <button
              key={o}
              type="button"
              className={`${u.btnReset} ${s.sheetOption}`}
              onClick={() => {
                setPhoto(true);
                setPhotoSheet(false);
              }}
            >
              <Camera size={18} color="#004691" />
              {o}
            </button>
          ))}
        </GauSheet>
      )}

      {breedSheet && (
        <GauSheet label="Select Breed" onClose={() => setBreedSheet(false)}>
          <div className={s.sheetHead}>
            <b>Select Breed</b>
            <button type="button" className={`${u.btnReset} ${s.closeBtn}`} onClick={() => setBreedSheet(false)} aria-label="Close">
              <X size={18} />
            </button>
          </div>
          <label className={s.searchBox}>
            <Search size={18} color="#6B7280" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search breed..." aria-label="Search breed" />
          </label>
          <div className={s.breedList}>
            {["", ...BREEDS.filter((b) => b.toLowerCase().includes(search.toLowerCase()))].map((b) => (
              <button
                key={b || "none"}
                type="button"
                className={`${u.btnReset} ${s.breedItem} ${breed === b ? s.breedOn : ""}`}
                onClick={() => {
                  setBreed(b);
                  setBreedSheet(false);
                  setSearch("");
                }}
              >
                {b || "Select cow breed"}
                {breed === b && <Check size={18} color="#004691" />}
              </button>
            ))}
          </div>
        </GauSheet>
      )}
    </div>
  );
}

export const gauHerdScreens: Record<string, ComponentType<ScreenProps>> = {
  "gs-herd": (p) => <MyHerd {...p} initial="summary" />,
  "gs-cow-details": (p) => <MyHerd {...p} initial="Gowri" />,
  "gs-add-cow": AddCow,
};
