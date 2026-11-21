"use client";

// Manage Leads (CrmLayout → LeadsPage): the telecaller's lead list. Desktop shows the AG Grid with
// the telecaller's columns (LeadsTable); phones get LeadsMobileCards, as the ERP switches at md.
import { useMemo, useState } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, ListFilter, Mail, MapPin, Phone, Plus, RefreshCw, Search, SlidersHorizontal, StickyNote, User, X } from "lucide-react";
import styles from "./crm.module.css";
import type { ScreenProps } from "../kissan/KissanScreens";
import { useDesktop } from "../web/webMode";
import CrmShell, { useToast } from "./CrmShell";
import {
  AGENT, LEAD_SOURCES, LEAD_STAGES, LEADS, MAIN_UID, STAGE_COLORS, STATES, displayName, fmtDateTime, isoDay, useCrm, type Lead,
} from "./crmData";

export function StageBadge({ stage }: { stage: string }) {
  const c = STAGE_COLORS[stage] ?? { bg: "#F3F4F6", text: "#4B5563" };
  return (
    <span className={styles.badge} style={{ background: c.bg, color: c.text }}>
      {stage}
    </span>
  );
}

const TABS = ["Leads", "Queue", "Orders", "Activities", "WhatsApp"];

export function CrmTabNav() {
  const toast = useToast();
  return (
    <div className={`${styles.card} ${styles.tabNav}`}>
      {TABS.map((t) => (
        <button
          key={t}
          type="button"
          className={`${styles.tab} ${t === "Leads" ? styles.tabActive : ""}`}
          onClick={() => t !== "Leads" && toast(`The ${t} tab isn't part of this prototype.`)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

// The main lead's row reflects what happened in this session (calls, disposition, last activity)
function useLeads(): Lead[] {
  const s = useCrm();
  return useMemo(() => {
    const call = s.activities.find((a) => a.type === "call_log");
    const [disp, sub] = call?.body?.split("\n")[0].split(" — ")[0].split(" · ") ?? [];
    return LEADS.map((l) =>
      l.uid === MAIN_UID
        ? { ...l, calls_attempted: s.outbound, disposition: disp, sub_disposition: sub, last_activity_at: s.activities[0]?.at ?? l.last_activity_at }
        : l
    );
  }, [s.activities, s.outbound]);
}

type Range = "" | "today" | "yesterday" | "month";
const inRange = (d: Date, r: Range) => {
  if (!r) return true;
  const now = new Date();
  if (r === "today") return isoDay(d) === isoDay(now);
  if (r === "yesterday") return isoDay(d) === isoDay(new Date(now.getTime() - 86_400_000));
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
};
const PRESETS: [Range | "custom", string][] = [
  ["today", "Today"],
  ["yesterday", "Yesterday"],
  ["month", "This Month"],
  ["custom", "Custom"],
];

function DateRange({ heading, value, onChange }: { heading: string; value: Range; onChange: (r: Range) => void }) {
  const now = new Date();
  const from = value === "today" ? isoDay(now) : value === "yesterday" ? isoDay(new Date(now.getTime() - 86_400_000)) : value === "month" ? isoDay(new Date(now.getFullYear(), now.getMonth(), 1)) : "";
  const to = value === "yesterday" ? from : value ? isoDay(now) : "";
  return (
    <div className={styles.dateRange}>
      <span className={styles.dateHeading}>
        <Calendar className={styles.icoSm} /> {heading}
      </span>
      <div className={styles.presets}>
        {PRESETS.map(([k, label]) => (
          <button
            key={k}
            type="button"
            className={`${styles.preset} ${(value || "custom") === k ? styles.presetOn : ""}`}
            onClick={() => onChange(k === "custom" ? "" : (k as Range))}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={styles.dateFields}>
        <label className={styles.dateField}>
          From
          <input className={styles.input} type="date" value={from} readOnly />
        </label>
        <span className={styles.dash}>–</span>
        <label className={styles.dateField}>
          To
          <input className={styles.input} type="date" value={to} readOnly />
        </label>
      </div>
    </div>
  );
}

const COLS: { h: string; w: number; num?: boolean }[] = [
  { h: "Lead Name", w: 180 },
  { h: "Actions", w: 140 },
  { h: "Calls Attempted", w: 150, num: true },
  { h: "City", w: 140 },
  { h: "Created", w: 170 },
  { h: "Last Activity", w: 170 },
  { h: "Disposition", w: 150 },
  { h: "Sub Disposition", w: 220 },
  { h: "Owner", w: 130 },
  { h: "State", w: 120 },
  { h: "Zip", w: 100 },
  { h: "Stage", w: 150 },
];

export default function CrmLeadsScreen({ next, go }: ScreenProps) {
  return (
    <CrmShell onHangup={() => go("crm-disposition")}>
      <CrmTabNav />
      <LeadsPage
        onOpen={(l) => (l.uid === MAIN_UID ? next() : null)}
        onCall={(l) => (l.uid === MAIN_UID ? go("crm-call") : null)}
      />
    </CrmShell>
  );
}

function LeadsPage({ onOpen, onCall }: { onOpen: (l: Lead) => void; onCall: (l: Lead) => void }) {
  const desktop = useDesktop();
  const toast = useToast();
  const s = useCrm();
  const all = useLeads();
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("");
  const [source, setSource] = useState("");
  const [stateF, setStateF] = useState("");
  const [created, setCreated] = useState<Range>("");
  const [activity, setActivity] = useState<Range>("");
  const [ordered, setOrdered] = useState<Range>("");
  const [spinning, setSpinning] = useState(false);

  const only = (l: Lead, fn: (l: Lead) => void) => {
    if (l.uid === MAIN_UID) return fn(l);
    toast(`This prototype follows ${displayName(LEADS[0])}. Open his profile to continue.`);
  };

  const leads = all.filter((l) => {
    const hay = [displayName(l), l.mobile, l.lead_number].join(" ").toLowerCase();
    if (q.trim() && !hay.includes(q.trim().toLowerCase())) return false;
    if (stage && l.stage !== stage) return false;
    if (source && l.source !== source) return false;
    if (stateF && l.state !== stateF) return false;
    if (!inRange(l.created_at, created)) return false;
    if (!inRange(l.last_activity_at, activity)) return false;
    if (ordered && !(l.uid === MAIN_UID && s.orders.some((o) => inRange(o.at, ordered)))) return false;
    return true;
  });

  const label = { today: "Today", yesterday: "Yesterday", month: "This Month", "": "" };
  const chips: { k: string; text: string; clear: () => void }[] = [];
  if (stage) chips.push({ k: "stage", text: `Lead Stage: ${stage}`, clear: () => setStage("") });
  if (source) chips.push({ k: "source", text: `Lead Source: ${source}`, clear: () => setSource("") });
  if (stateF) chips.push({ k: "state", text: `State: ${stateF}`, clear: () => setStateF("") });
  if (created) chips.push({ k: "created", text: `Created: ${label[created]}`, clear: () => setCreated("") });
  if (activity) chips.push({ k: "activity", text: `Last Activity: ${label[activity]}`, clear: () => setActivity("") });
  if (ordered) chips.push({ k: "order", text: `Order Date: ${label[ordered]}`, clear: () => setOrdered("") });
  const clearAll = () => {
    setQ("");
    chips.forEach((c) => c.clear());
  };

  return (
    <div className={`${styles.card} ${styles.shadow}`}>
      <div className={styles.leadsBody}>
        <div className={styles.leadsHead}>
          <div className={styles.titleRow}>
            <h1 className={styles.h1}>Manage Leads</h1>
            <span className={styles.countPill} title="Total leads matching the current filters">
              {leads.length}
            </span>
            <button
              type="button"
              className={styles.iconBtn}
              aria-label="Refresh"
              onClick={() => {
                setSpinning(true);
                setTimeout(() => setSpinning(false), 700);
              }}
            >
              <RefreshCw className={`${styles.ico} ${spinning ? styles.spin : ""}`} />
            </button>
          </div>
          <div className={styles.headBtns}>
            <button type="button" className={styles.btnOutline} onClick={() => toast("The Advanced Filter (query builder) isn't part of this prototype.")}>
              <SlidersHorizontal className={styles.ico} /> Advanced Filter
            </button>
            <button type="button" className={styles.btnPrimary} onClick={() => toast("Add New Lead isn't part of this prototype.")}>
              <Plus className={styles.ico} /> Add New Lead
            </button>
          </div>
        </div>

        <div className={styles.filters}>
          <div className={styles.filterRow}>
            <div className={styles.searchBox}>
              <Search className={styles.ico} />
              <input className={styles.input} placeholder="Search by name, mobile, email..." value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <select className={`${styles.select} ${styles.filterSelect}`} value={stage} onChange={(e) => setStage(e.target.value)}>
              <option value="">Lead Stage</option>
              {LEAD_STAGES.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
            <select className={`${styles.select} ${styles.filterSelect}`} value={source} onChange={(e) => setSource(e.target.value)}>
              <option value="">Lead Source</option>
              {LEAD_SOURCES.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
            <button type="button" className={`${styles.ownerSelect} ${styles.filterSelect}`} onClick={() => toast(`A telecaller's list holds only their own leads (${AGENT}).`)}>
              <span>Lead Owner</span>
              <ChevronDown className={styles.ico} />
            </button>
            <select className={`${styles.select} ${styles.filterSelect}`} defaultValue="">
              <option value="">Agency</option>
              <option>In-house</option>
            </select>
            <select className={`${styles.select} ${styles.filterSelect}`} value={stateF} onChange={(e) => setStateF(e.target.value)}>
              <option value="">State</option>
              {STATES.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
          <div className={styles.dateRow}>
            <DateRange heading="Created" value={created} onChange={setCreated} />
            <DateRange heading="Last Activity" value={activity} onChange={setActivity} />
            <DateRange heading="Order Date" value={ordered} onChange={setOrdered} />
            {(chips.length > 0 || q) && (
              <button type="button" className={styles.btnOutline} style={{ marginLeft: desktop ? "auto" : 0, padding: "8px 16px" }} onClick={clearAll}>
                Clear
              </button>
            )}
          </div>
          {chips.length > 0 && (
            <div className={styles.chips}>
              {chips.map((c) => (
                <span key={c.k} className={styles.chip}>
                  {c.text}
                  <button type="button" onClick={c.clear} aria-label="Remove filter" style={{ display: "flex", color: "inherit" }}>
                    <X className={styles.icoXs} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {leads.length === 0 ? (
          <div className={`${styles.muted} ${styles.center}`} style={{ padding: "48px 0" }}>
            No leads found.
          </div>
        ) : desktop ? (
          <div className={styles.grid}>
            <table className={styles.gridTable}>
              <colgroup>
                {COLS.map((c) => (
                  <col key={c.h} style={{ width: c.w }} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  {COLS.map((c) => (
                    <th key={c.h} className={c.num ? styles.thNum : undefined}>
                      <span className={styles.thInner}>
                        {c.h}
                        {c.h !== "Actions" && <ListFilter className={`${styles.icoSm} ${styles.thFilter}`} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.uid}>
                    <td>
                      <button type="button" className={styles.nameLink} onClick={() => only(l, onOpen)}>
                        {displayName(l)}
                      </button>
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        <button type="button" className={styles.rowAct} title="Add note" onClick={() => only(l, onOpen)}>
                          <StickyNote className={styles.ico} />
                        </button>
                        <button type="button" className={styles.rowAct} title="Email" onClick={() => toast("This lead has no email.")}>
                          <Mail className={styles.ico} />
                        </button>
                        <button type="button" className={`${styles.rowAct} ${styles.rowCall}`} title="Call" onClick={() => only(l, onCall)}>
                          <Phone className={styles.ico} />
                        </button>
                      </div>
                    </td>
                    <td className={styles.num}>{l.calls_attempted}</td>
                    <td>{l.city || "—"}</td>
                    <td>{fmtDateTime(l.created_at)}</td>
                    <td>{fmtDateTime(l.last_activity_at)}</td>
                    <td>{l.disposition || "—"}</td>
                    <td>{l.sub_disposition || "—"}</td>
                    <td>{AGENT}</td>
                    <td>{l.state || "—"}</td>
                    <td>{l.pincode || "—"}</td>
                    <td>
                      <StageBadge stage={l.stage} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.cards}>
            {leads.map((l) => (
              <div key={l.uid} className={`${styles.card} ${styles.leadCard}`}>
                <div className={styles.leadCardTop}>
                  <button type="button" className={styles.leadCardName} onClick={() => only(l, onOpen)}>
                    {displayName(l)}
                  </button>
                  <StageBadge stage={l.stage} />
                </div>
                <div className={styles.leadCardRows}>
                  <div className={styles.leadCardRow}>
                    <MapPin className={styles.ico} />
                    {l.city}, {l.state} {l.pincode}
                  </div>
                  <div className={styles.leadCardRow}>
                    <User className={styles.ico} />
                    {AGENT}
                  </div>
                  <div className={styles.leadCardRow}>
                    <Calendar className={styles.ico} />
                    Last activity: {fmtDateTime(l.last_activity_at)}
                  </div>
                  <div className={styles.leadCardRow}>
                    <Phone className={styles.ico} />
                    Calls attempted: {l.calls_attempted}
                  </div>
                </div>
                <div className={styles.leadCardFoot}>
                  <button type="button" className={styles.tap44} title="Add note" onClick={() => only(l, onOpen)}>
                    <StickyNote className={styles.ico} />
                  </button>
                  <button type="button" className={styles.callPill} onClick={() => only(l, onCall)}>
                    <Phone className={styles.ico} /> Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.pager}>
        <span className={styles.pagerText}>
          Showing {leads.length ? 1 : 0}–{leads.length} of {leads.length}
        </span>
        <div className={styles.pagerBtns}>
          <div className={styles.pages}>
            <button type="button" className={styles.pageBtn} disabled aria-label="Previous page">
              <ChevronLeft className={styles.ico} />
            </button>
            <button type="button" className={`${styles.pageBtn} ${styles.pageOn}`}>
              1
            </button>
            <button type="button" className={styles.pageBtn} disabled aria-label="Next page">
              <ChevronRight className={styles.ico} />
            </button>
          </div>
          <span className={styles.pageSize}>
            Show
            <select className={styles.select} defaultValue={50}>
              {[25, 50, 100, 200].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </span>
        </div>
      </div>
    </div>
  );
}
