/* eslint-disable @next/next/no-img-element -- fixed-size mock screens inside a phone frame */
"use client";

// Gau Sampurna scan history, recreated from the `prod` branch: scan/scan-history-screen.jsx (date
// badges + scan-type and cow filter chips), reports/reports-tab-screen.jsx (the Reports tab that
// replaces Shop when delivery isn't serviceable: Total Scans card, filter sheet) and
// scan/scan-chat-screen.jsx (replay of an older chat-style scan session). Entries are samples.
import { useState, type ComponentType } from "react";
import { ArrowLeft, ChevronRight, FileText, RefreshCw, ScanLine, Send, SlidersHorizontal, X } from "lucide-react";
import s from "./gauHistory.module.css";
import { GauSheet, GauTabBar, gimg, u } from "./GauShared";
import type { ScreenProps } from "../kissan/KissanScreens";

type ScanType = "full" | "status" | "market" | "disease" | "dung";

const META: Record<ScanType, { color: string; label: string; flow: string; screen: string }> = {
  full: { color: "#2196F3", label: "Full Health", flow: "full-health", screen: "gs-full-report" },
  status: { color: "#008026", label: "Animal Status", flow: "animal-status", screen: "gs-status-report" },
  market: { color: "#C9931F", label: "Market Value", flow: "market-value", screen: "gs-market-report" },
  disease: { color: "#FF7043", label: "Disease Diagnosis", flow: "disease-check", screen: "gs-diagnosis" },
  dung: { color: "#8D6E63", label: "Cow Dung", flow: "dung-scan", screen: "gs-dung-results" },
};

const REPORTS: { type: ScanType; cow: string | null; breed?: string; month: string; day: string; time: string; image: string }[] = [
  { type: "disease", cow: "Gowri", breed: "Gir", month: "OCT", day: "21", time: "09:42 AM", image: "gowri-side.jpg" },
  { type: "status", cow: "Ganga", breed: "HF Crossbreed", month: "OCT", day: "18", time: "06:15 PM", image: "cow-ganga.webp" },
  { type: "dung", cow: "Narmada", month: "OCT", day: "15", time: "07:30 AM", image: "dung-sample.webp" },
  { type: "market", cow: "Gowri", breed: "Gir", month: "OCT", day: "12", time: "11:05 AM", image: "gowri-side.jpg" },
  { type: "dung", cow: null, month: "OCT", day: "08", time: "08:10 AM", image: "dung-sample.webp" },
  { type: "full", cow: "Ganga", breed: "HF Crossbreed", month: "SEP", day: "30", time: "05:20 PM", image: "cow-ganga.webp" },
];

const COWS = ["Gowri", "Ganga", "Narmada"];

function Chip({ label, active, color = "#008026", onClick }: { label: string; active: boolean; color?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`${u.btnReset} ${s.chip}`}
      style={active ? { background: `${color}18`, borderColor: color, color } : undefined}
      onClick={onClick}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

// ---------- Scan History (scan-history-screen.jsx) ----------

function ScanHistory({ goToFlow, back }: ScreenProps) {
  const [type, setType] = useState<ScanType | null>(null);
  const [cow, setCow] = useState<string | null>(null);
  const list = REPORTS.filter((r) => (!type || r.type === type) && (!cow || r.cow === cow));
  return (
    <div className={u.screen}>
      <div className={s.header}>
        <button type="button" className={`${u.btnReset} ${s.iconBtn}`} onClick={back} aria-label="Back">
          <ArrowLeft size={24} color="#333" />
        </button>
        <span className={s.title}>Scan History</span>
        <span className={s.iconBtn} aria-hidden="true">
          <RefreshCw size={20} color="#555" />
        </span>
      </div>
      <div className={s.filterBar}>
        <div className={s.chipRow}>
          <Chip label="All" active={!type} onClick={() => setType(null)} />
          {(Object.keys(META) as ScanType[]).map((k) => (
            <Chip key={k} label={META[k].label} color={META[k].color} active={type === k} onClick={() => setType(k)} />
          ))}
        </div>
        <div className={s.chipRow}>
          <Chip label="All cows" color="#004691" active={!cow} onClick={() => setCow(null)} />
          {COWS.map((c) => (
            <Chip key={c} label={c} color="#004691" active={cow === c} onClick={() => setCow(c)} />
          ))}
        </div>
      </div>
      <div className={`${u.scroll} ${s.list}`}>
        {list.length === 0 ? (
          <div className={s.empty}>
            <b>No scans match your filters</b>
            <button
              type="button"
              className={`${u.btnReset} ${s.retry}`}
              onClick={() => {
                setType(null);
                setCow(null);
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          list.map((r, i) => {
            const m = META[r.type];
            const cowLine = [r.cow, r.type !== "dung" ? r.breed : null].filter(Boolean).join("  ·  ") || "Unlinked scan";
            return (
              <button key={i} type="button" className={`${u.btnReset} ${s.item} ${i === 0 ? u.hotspot : ""}`} onClick={() => goToFlow(m.flow, m.screen)}>
                <span className={s.dateBadge} style={{ background: `${m.color}20`, color: m.color }}>
                  <small>{r.month}</small>
                  <b>{r.day}</b>
                </span>
                <span className={s.info}>
                  <span className={s.itemTitle}>
                    <i style={{ background: m.color }} />
                    {m.label}
                  </span>
                  <span className={s.cowLine}>{cowLine}</span>
                  <small>{r.time}</small>
                </span>
                <ChevronRight size={22} color="#ddd" />
              </button>
            );
          })
        )}
        <button type="button" className={`${u.btnReset} ${s.chatLink}`} onClick={() => goToFlow("gs-history", "gs-scan-chat")}>
          Older chat-style scan (Sep) <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ---------- Reports tab (reports-tab-screen.jsx) ----------

function ReportsTab({ goToFlow }: ScreenProps) {
  const [sheet, setSheet] = useState(false);
  const [type, setType] = useState<ScanType | null>(null);
  const [cow, setCow] = useState<string | null>(null);
  const [tempType, setTempType] = useState<ScanType | null>(null);
  const [tempCow, setTempCow] = useState<string | null>(null);
  const active = (type ? 1 : 0) + (cow ? 1 : 0);
  const list = REPORTS.filter((r) => (!type || r.type === type) && (!cow || r.cow === cow));
  return (
    <div className={u.screen}>
      <div className={s.header}>
        <span className={s.iconBtn} />
        <span className={s.title}>Reports</span>
        <span className={s.iconBtn} aria-hidden="true">
          <RefreshCw size={20} color="#64748B" />
        </span>
      </div>
      <div className={s.dashboard}>
        <div className={s.totalCard}>
          <ScanLine size={30} color="#fff" />
          <small>Total Scans</small>
          <b>{REPORTS.length}</b>
        </div>
        <div className={s.compactFilter}>
          <span>
            {active ? `${list.length} of ${REPORTS.length} scans` : `${REPORTS.length} scans`}
          </span>
          {active > 0 && (
            <button
              type="button"
              className={`${u.btnReset} ${s.clear}`}
              onClick={() => {
                setType(null);
                setCow(null);
              }}
            >
              Clear
            </button>
          )}
          <button
            type="button"
            className={`${u.btnReset} ${s.filterBtn} ${u.hotspot}`}
            onClick={() => {
              setTempType(type);
              setTempCow(cow);
              setSheet(true);
            }}
          >
            <SlidersHorizontal size={16} />
            Filters{active ? ` · ${active}` : ""}
          </button>
        </div>
      </div>
      <div className={`${u.scroll} ${s.list}`}>
        {list.map((r, i) => {
          const m = META[r.type];
          return (
            <button key={i} type="button" className={`${u.btnReset} ${s.reportItem}`} onClick={() => goToFlow(m.flow, m.screen)}>
              <img src={gimg(r.image)} alt="" />
              <span className={s.info}>
                <b className={s.reportName}>{r.cow ?? "Unlinked scan"}</b>
                <span className={s.typeRow}>
                  <i style={{ background: m.color }} />
                  {m.label}
                </span>
                <small>
                  {Number(r.day)} {r.month.charAt(0) + r.month.slice(1).toLowerCase()} · {r.time}
                </small>
              </span>
              <ChevronRight size={22} color="#CBD5E1" />
            </button>
          );
        })}
      </div>
      <GauTabBar active="reports" reports goToFlow={goToFlow} />
      {sheet && (
        <GauSheet label="Filter scans" onClose={() => setSheet(false)}>
          <div className={s.sheetHead}>
            <b>Filter scans</b>
            <button type="button" className={`${u.btnReset} ${s.close}`} onClick={() => setSheet(false)} aria-label="Close">
              <X size={18} />
            </button>
          </div>
          <span className={s.sheetLabel}>Scan type</span>
          <div className={s.wrapRow}>
            <Chip label="All" active={!tempType} onClick={() => setTempType(null)} />
            {(Object.keys(META) as ScanType[]).map((k) => (
              <Chip key={k} label={META[k].label} color={META[k].color} active={tempType === k} onClick={() => setTempType(k)} />
            ))}
          </div>
          <span className={s.sheetLabel}>Cow</span>
          <div className={s.wrapRow}>
            <Chip label="All" color="#004691" active={!tempCow} onClick={() => setTempCow(null)} />
            {COWS.map((c) => (
              <Chip key={c} label={c} color="#004691" active={tempCow === c} onClick={() => setTempCow(c)} />
            ))}
          </div>
          <div className={s.sheetActions}>
            <button
              type="button"
              className={`${u.btnReset} ${u.secondary}`}
              onClick={() => {
                setTempType(null);
                setTempCow(null);
              }}
            >
              Clear all
            </button>
            <button
              type="button"
              className={`${u.btnReset} ${u.primary}`}
              onClick={() => {
                setType(tempType);
                setCow(tempCow);
                setSheet(false);
              }}
            >
              Apply
            </button>
          </div>
        </GauSheet>
      )}
    </div>
  );
}

// ---------- Scan chat replay (scan-chat-screen.jsx) ----------

type Msg = { user?: boolean; text?: string; image?: string; options?: string[]; report?: boolean };

const SESSION: Msg[] = [
  { text: "Namaste! Which cow do you want to check today?" },
  { user: true, text: "Narmada" },
  { text: "Please take a clear side photo of Narmada, from head to tail." },
  { user: true, image: "cow-narmada.webp" },
  { text: "We couldn't identify the exact breed. Please select the closest match.", options: ["HF Crossbreed", "Jersey Crossbreed", "Gir", "Sahiwal", "None of the Above"] },
  { user: true, text: "Jersey Crossbreed" },
  { text: "Your Health Scan report is ready.", report: true },
];

function ScanChat({ back, goToFlow }: ScreenProps) {
  const [msgs, setMsgs] = useState<Msg[]>(SESSION);
  const [input, setInput] = useState("");
  const send = () => {
    if (!input.trim()) return;
    setMsgs((m) => [...m, { user: true, text: input }]);
    setInput("");
    setTimeout(() => setMsgs((m) => [...m, { text: "I can help you with cattle health analysis. Please use the scan options to get started." }]), 800);
  };
  return (
    <div className={`${u.screen} ${s.chatScreen}`}>
      <div className={s.chatTop}>
        <button type="button" className={`${u.btnReset} ${s.iconBtn}`} onClick={back} aria-label="Back">
          <ArrowLeft size={22} color="#333" />
        </button>
        <span className={s.title}>Health Scan</span>
        <span className={s.iconBtn} />
      </div>
      <div className={`${u.scroll} ${s.messages}`}>
        {msgs.map((m, i) =>
          m.image ? (
            <div key={i} className={s.imgBubble}>
              <img src={gimg(m.image)} alt="Uploaded side photo" />
            </div>
          ) : m.report ? (
            <div key={i} className={s.botRow}>
              <span className={s.botIcon}>
                <img src={gimg("logo.png")} alt="" />
              </span>
              <div className={s.reportCard}>
                <span>
                  <FileText size={18} color="#004691" /> Health Scan · Narmada
                </span>
                <small>Jersey Crossbreed · Grade A3 · BCS 3/5</small>
                <button type="button" className={`${u.btnReset} ${s.viewReport} ${u.hotspot}`} onClick={() => goToFlow("animal-status", "gs-status-report")}>
                  VIEW FULL REPORT
                </button>
              </div>
            </div>
          ) : (
            <div key={i} className={m.user ? s.userRow : s.botRow}>
              {!m.user && (
                <span className={s.botIcon}>
                  <img src={gimg("logo.png")} alt="" />
                </span>
              )}
              <div className={m.user ? s.userBubble : s.botBubble}>
                {m.text}
                {m.options && (
                  <span className={s.options}>
                    {m.options.map((o) => (
                      <span key={o} className={`${s.option} ${o === "Jersey Crossbreed" ? s.optionOn : ""}`}>
                        {o}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            </div>
          )
        )}
      </div>
      <div className={s.inputBar}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask me anything..." aria-label="Message" />
        <button type="button" className={`${u.btnReset} ${s.send}`} style={{ background: input.trim() ? "#004691" : "#E2E8F0" }} onClick={send} aria-label="Send">
          <Send size={18} color="#fff" style={{ transform: "rotate(-30deg)" }} />
        </button>
      </div>
    </div>
  );
}

export const gauHistoryScreens: Record<string, ComponentType<ScreenProps>> = {
  "gs-history": ScanHistory,
  "gs-reports": ReportsTab,
  "gs-scan-chat": ScanChat,
};
