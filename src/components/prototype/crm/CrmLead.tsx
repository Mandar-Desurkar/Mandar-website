"use client";

// The lead profile (LeadDetailPage): profile sidebar with click-to-call and actions, the Activity
// History / Lead Details / Tasks / Orders tabs, and Notes. Each screen of both flows is this page in
// a different moment of the call: dialling, on the call, ordering, hung up, dispositioned.
import { useEffect, useRef, useState, type RefObject } from "react";
import {
  ArrowLeft, ArrowRightLeft, CheckSquare, ChevronDown, ChevronUp, Edit2, FileText, Mail, MessageSquare, MoreVertical, Pause,
  Phone, Play, RefreshCw, ShoppingCart, StickyNote, TrendingUp, UserPlus,
} from "lucide-react";
import styles from "./crm.module.css";
import type { ScreenProps } from "../kissan/KissanScreens";
import { useDesktop } from "../web/webMode";
import CrmShell, { useUnbuilt } from "./CrmShell";
import { StageBadge } from "./CrmLeads";
import { CreateOrderDrawer, CustomerOrders, DispositionDrawer } from "./CrmDrawers";
import {
  ACTIVITY_TYPES, AGENT, CAMPAIGN, FORM_ANSWERS, MAIN_LEAD, crm, trackCrm, displayName, fmtDate, fmtDateTime, isoDay, leadAge, money, useCrm,
  type Activity,
} from "./crmData";

export type Tab = "activity" | "details" | "tasks" | "orders" | "whatsapp";
const SUB_TABS: [Tab, string][] = [
  ["activity", "Activity History"],
  ["details", "Lead Details"],
  ["tasks", "Tasks"],
  ["orders", "Orders"],
  ["whatsapp", "WhatsApp"],
];
const PROFILE_SCREEN: Record<string, string> = { activity: "crm-p-activity", details: "crm-p-details", tasks: "crm-p-tasks", orders: "crm-p-orders" };

const ICONS: Record<string, typeof Phone> = {
  created: UserPlus,
  assignment: ArrowRightLeft,
  field_update: FileText,
  stage_change: ArrowRightLeft,
  note: MessageSquare,
  call_log: Phone,
  order: ShoppingCart,
  order_update: ShoppingCart,
};

type DetailProps = {
  tab: Tab;
  onTab: (t: Tab) => void;
  onBack: () => void;
  onCall: () => void;
  onCreateOrder: () => void;
  hintCreateOrder?: boolean;
};

function LeadDetail({ tab, onTab, onBack, onCall, onCreateOrder, hintCreateOrder }: DetailProps) {
  const unbuilt = useUnbuilt();
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const [logCall, setLogCall] = useState(false);
  const focusNotes = () => {
    notesRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    notesRef.current?.focus();
  };
  return (
    <>
      <button type="button" className={styles.backLink} onClick={onBack}>
        <ArrowLeft className={styles.ico} /> Back to Manage Leads
      </button>
      <div className={styles.detailGrid}>
        <Sidebar onCall={onCall} onCreateOrder={onCreateOrder} onNote={focusNotes} onTasks={() => onTab("tasks")} hintCreateOrder={hintCreateOrder} />

        <div className={styles.card}>
          <div className={styles.subTabs}>
            {SUB_TABS.map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`${styles.tab} ${tab === id ? styles.tabActive : ""}`}
                onClick={() => (id === "whatsapp" ? unbuilt("WhatsApp chat", "The WhatsApp chat isn't part of this prototype.") : onTab(id))}
              >
                {label}
              </button>
            ))}
          </div>
          <div className={styles.tabBody}>
            {tab === "activity" && <Timeline onOrder={() => onTab("orders")} />}
            {tab === "details" && <Details />}
            {tab === "tasks" && (
              <div className={styles.task}>
                <div className={styles.taskL}>
                  <span className={styles.taskIcon}>
                    <Phone />
                  </span>
                  <div>
                    <h4 className={styles.taskTitle}>Phone Call: {displayName(MAIN_LEAD)}</h4>
                    <p className={styles.taskSub}>Log a call with this lead</p>
                  </div>
                </div>
                <button type="button" className={styles.btnPrimary} onClick={() => setLogCall(true)}>
                  Log Call
                </button>
              </div>
            )}
            {tab === "orders" && <OrdersTab onAmend={onCreateOrder} />}
          </div>
        </div>

        <Notes inputRef={notesRef} />
      </div>

      {logCall && (
        <DispositionDrawer
          onClose={() => setLogCall(false)}
          onSave={(d) => {
            crm.dispose(d);
            setLogCall(false);
            onTab("activity");
          }}
        />
      )}
    </>
  );
}

function Sidebar({
  onCall, onCreateOrder, onNote, onTasks, hintCreateOrder,
}: { onCall: () => void; onCreateOrder: () => void; onNote: () => void; onTasks: () => void; hintCreateOrder?: boolean }) {
  const s = useCrm();
  const unbuilt = useUnbuilt();
  const [propsOpen, setPropsOpen] = useState(true);
  const [menu, setMenu] = useState(false);
  const msg = s.call === "connecting" ? "Connecting via softphone…" : s.call === "connected" ? "Connected — talk to the customer." : null;
  const actions = [
    { icon: StickyNote, label: "Note", onClick: onNote },
    { icon: CheckSquare, label: "Tasks", onClick: onTasks },
    { icon: TrendingUp, label: "Sales Activity", disabled: true },
    { icon: Mail, label: "Email", disabled: true },
    { icon: ShoppingCart, label: "Create Order", onClick: onCreateOrder, hint: hintCreateOrder },
  ];
  return (
    <div className={`${styles.card} ${styles.side}`}>
      <div className={styles.sideTop}>
        <div style={{ minWidth: 0 }}>
          <h2 className={styles.leadName}>{displayName(MAIN_LEAD)}</h2>
          <StageBadge stage={MAIN_LEAD.stage} />
        </div>
        <div className={styles.moreWrap}>
          <button type="button" className={styles.more} aria-label="More options" onClick={() => setMenu(!menu)}>
            <MoreVertical className={styles.ico} style={{ width: 20, height: 20 }} />
          </button>
          {menu && (
            <div className={styles.menu}>
              <button
                type="button"
                onClick={() => {
                  setMenu(false);
                  unbuilt("Update Lead");
                }}
              >
                Update Lead
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.phoneRow}>
        <Phone className={styles.ico} />
        <button type="button" className={styles.phoneBtn} title="Call via in-browser softphone" onClick={onCall}>
          {MAIN_LEAD.mobile}
        </button>
      </div>
      {msg && <p className={styles.callMsg}>{msg}</p>}

      <div className={styles.actGrid}>
        {actions.map(({ icon: Icon, label, onClick, disabled, hint }) => (
          <button key={label} type="button" disabled={disabled} onClick={onClick} className={`${styles.actBtn} ${hint ? styles.actHint : ""}`}>
            <Icon className={styles.ico} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <button type="button" className={styles.propsToggle} onClick={() => setPropsOpen(!propsOpen)}>
        Lead Properties
        {propsOpen ? <ChevronUp className={styles.ico} /> : <ChevronDown className={styles.ico} />}
      </button>
      {propsOpen && (
        <div className={styles.props}>
          {(
            [
              ["Owner", AGENT],
              ["Source", MAIN_LEAD.source],
              ["Lead Age", leadAge(MAIN_LEAD.created_at)],
              ["Lead Number", MAIN_LEAD.lead_number],
              ["Outlet", MAIN_LEAD.outlet_name],
              ["Orders", s.orders.length],
              ["Calls Attempted (Outbound)", s.outbound],
            ] as [string, string | number][]
          ).map(([k, v]) => (
            <div key={k} className={styles.propRow}>
              <span>{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.sideOrders}>
        <CustomerOrders title="Customer Orders" compact collapsible />
      </div>
    </div>
  );
}

// ---------- Activity History ----------

function Recording({ seconds }: { seconds: number }) {
  const [on, setOn] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT((x) => (x + 1 >= seconds ? (setPlaying(false), seconds) : x + 1)), 1000);
    return () => clearInterval(id);
  }, [playing, seconds]);
  const mmss = (n: number) => `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`;
  return (
    <div className={styles.recording}>
      <span className={styles.recDur}>{mmss(seconds)}</span>
      {on ? (
        <div className={styles.player}>
          <button type="button" onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause" : "Play"} style={{ display: "flex" }}>
            {playing ? <Pause className={styles.icoSm} /> : <Play className={styles.icoSm} />}
          </button>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>
            {mmss(t)} / {mmss(seconds)}
          </span>
          <span className={styles.playerBar}>
            <span style={{ width: `${(t / seconds) * 100}%` }} />
          </span>
        </div>
      ) : (
        <button
          type="button"
          className={styles.recBtn}
          onClick={() => {
            setOn(true);
            setPlaying(true);
            trackCrm("played_recording");
          }}
        >
          ▶ Play recording
        </button>
      )}
    </div>
  );
}

function Timeline({ onOrder }: { onOrder: () => void }) {
  const { activities, fresh: freshIds } = useCrm();
  const desktop = useDesktop();
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [spin, setSpin] = useState(false);
  const list = activities.filter((a) => (!type || a.type === type) && (!date || isoDay(a.at) === date));

  const body = (a: Activity) => {
    if (!a.orderNo || !a.body) return a.body;
    const i = a.body.indexOf(a.orderNo);
    return (
      <>
        {a.body.slice(0, i)}
        <button type="button" className={styles.tlOrderLink} onClick={onOrder}>
          {a.orderNo}
        </button>
        {a.body.slice(i + a.orderNo.length)}
      </>
    );
  };

  return (
    <div>
      <div className={styles.tlFilters}>
        <select className={styles.select} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Activity Types</option>
          {Object.entries(ACTIVITY_TYPES).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <input className={styles.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button
          type="button"
          className={styles.refresh}
          title="Refresh activity"
          onClick={() => {
            setSpin(true);
            setTimeout(() => setSpin(false), 700);
          }}
        >
          <RefreshCw className={`${styles.ico} ${spin ? styles.spin : ""}`} />
          {!desktop && "Refresh"}
        </button>
      </div>
      <div className={styles.tl}>
        {list.map((a) => {
          const Icon = ICONS[a.type] ?? FileText;
          const fresh = freshIds.includes(a.uid);
          const fieldDiff = a.type === "field_update" ? a.body?.split("\n") : null;
          return (
            <div key={a.uid} className={`${styles.card} ${styles.tlItem} ${fresh ? styles.tlNew : ""}`}>
              <span className={styles.tlIcon}>
                <Icon className={styles.ico} />
              </span>
              <div className={styles.tlMain}>
                <div className={styles.tlHead}>
                  <span className={styles.tlLabel}>{ACTIVITY_TYPES[a.type]}</span>
                  {a.direction && <span className={styles.dir}>{a.direction}</span>}
                  {a.by && <span className={styles.by}>by {a.by}</span>}
                </div>
                {a.from_stage && a.to_stage && (
                  <p className={styles.tlLine}>
                    {a.from_stage} → {a.to_stage}
                  </p>
                )}
                {a.outcome && <p className={styles.tlLine}>Outcome: {a.outcome}</p>}
                {fieldDiff ? (
                  fieldDiff.map((line) => {
                    const [k, rest] = line.split(": ");
                    const [from, to] = rest.split(" → ");
                    return (
                      <p key={k} className={styles.tlBody}>
                        <b style={{ fontWeight: 500 }}>{k}:</b> <span className={styles.muted}>{from}</span> → {to}
                      </p>
                    );
                  })
                ) : (
                  <p className={styles.tlBody}>{body(a)}</p>
                )}
                {a.recording && <Recording seconds={a.recording} />}
              </div>
              <span className={styles.tlDate}>{fmtDateTime(a.at)}</span>
            </div>
          );
        })}
        {list.length === 0 && <div className={styles.tlEmpty}>No activities match the selected filters.</div>}
      </div>
    </div>
  );
}

// ---------- Lead Details ----------

function Details() {
  const unbuilt = useUnbuilt();
  const [hide, setHide] = useState(false);
  const fields: [string, string][] = [
    ["First Name", MAIN_LEAD.first_name],
    ["Last Name", MAIN_LEAD.last_name],
    ["Mobile", MAIN_LEAD.mobile],
    ["Email", ""],
    ["Address", MAIN_LEAD.address_line ?? ""],
    ["City", MAIN_LEAD.city],
    ["District", MAIN_LEAD.district],
    ["Taluk", MAIN_LEAD.taluk],
    ["State", MAIN_LEAD.state],
    ["Pincode", MAIN_LEAD.pincode],
    ["Source", MAIN_LEAD.source],
    ["Stage", MAIN_LEAD.stage],
    ["Owner", AGENT],
    ["Outlet", MAIN_LEAD.outlet_name],
    ["Do Not Call", "No"],
    ["Follow-up", ""],
    ["Created", fmtDateTime(MAIN_LEAD.created_at)],
    ["Notes", ""],
  ];
  const title = (k: string) => k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <div>
      <div className={styles.detailsTop}>
        <label className={styles.check}>
          <input type="checkbox" checked={hide} onChange={(e) => setHide(e.target.checked)} />
          Hide empty fields
        </label>
        <button type="button" className={`${styles.btnOutline} ${styles.editBtn} ${styles.btnSm}`} onClick={() => unbuilt("Update Lead")}>
          <Edit2 className={styles.ico} /> Edit
        </button>
      </div>
      <div className={styles.fields}>
        {fields
          .filter(([, v]) => !hide || v)
          .map(([k, v]) => (
            <div key={k}>
              <p className={styles.fieldLabel}>{k}</p>
              <p className={styles.fieldValue}>{v || "—"}</p>
            </div>
          ))}
      </div>
      <div className={styles.fieldSection}>
        <h3>Form Answers</h3>
        <div className={styles.fields}>
          {Object.entries(FORM_ANSWERS).map(([k, v]) => (
            <div key={k}>
              <p className={styles.fieldLabel}>{k}</p>
              <p className={styles.fieldValue}>{v}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.fieldSection}>
        <h3>Campaign / UTM</h3>
        <div className={styles.fields}>
          {Object.entries(CAMPAIGN).map(([k, v]) => (
            <div key={k}>
              <p className={styles.fieldLabel}>{title(k)}</p>
              <p className={styles.fieldValue}>{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Orders tab (LeadOrdersTab) ----------

function OrdersTab({ onAmend }: { onAmend: () => void }) {
  const { orders } = useCrm();
  if (!orders.length) return <p className={`${styles.muted} ${styles.center}`} style={{ padding: "32px 0", margin: 0 }}>No orders found for this number.</p>;
  return (
    <div className={styles.tableScroll}>
      <table className={styles.ordersTable}>
        <thead>
          <tr>
            <th>Order</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
            <th className={styles.right}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.order_number}>
              <td>
                <span className={styles.tlOrderLink} style={{ fontWeight: 500 }}>
                  {o.order_number}
                </span>
              </td>
              <td className={styles.muted}>{fmtDateTime(o.at)}</td>
              <td style={{ color: "var(--warning)" }}>pending</td>
              <td>
                <button type="button" className={styles.amendBtn} onClick={onAmend} title="Add or remove items on this order">
                  <Edit2 className={styles.icoXs} /> Amend
                </button>
              </td>
              <td className={styles.right}>{money(o.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.muted} style={{ margin: "12px 0 0", fontSize: 12 }}>
        Delivery by {fmtDate(new Date(orders[0].delivery))} · {orders[0].payment === "cod" ? "Cash on Delivery" : "Prepaid"}
      </p>
    </div>
  );
}

// ---------- Notes ----------

function Notes({ inputRef }: { inputRef: RefObject<HTMLTextAreaElement | null> }) {
  const { notes } = useCrm();
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);
  return (
    <div className={`${styles.card} ${styles.notes}`}>
      <h3 className={styles.h3}>Notes</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          setAdding(true);
          setTimeout(() => {
            crm.addNote(text.trim());
            setText("");
            setAdding(false);
          }, 400);
        }}
      >
        <textarea ref={inputRef} className={styles.textarea} rows={3} placeholder="Add a note..." value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit" className={`${styles.btnPrimary} ${styles.btnSm}`} disabled={adding || !text.trim()}>
          {adding ? "Adding..." : "Add Note"}
        </button>
      </form>
      <div className={styles.notesList}>
        {notes.length === 0 ? (
          <p className={`${styles.muted} ${styles.center}`} style={{ margin: 0, padding: "16px 0" }}>
            No notes yet.
          </p>
        ) : (
          notes.map((n) => (
            <div key={n.uid} className={styles.noteItem}>
              <p>{n.body}</p>
              <p className={styles.noteMeta}>
                {n.by} · {fmtDateTime(n.at)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ---------- Screens ----------

const toLeads = (sp: ScreenProps) => () => sp.goToFlow("lead-to-order", "crm-leads");

// Flow 1, screen 2: the profile, before the call
export function CrmLeadScreen(sp: ScreenProps) {
  return (
    <CrmShell onHangup={() => sp.go("crm-disposition")}>
      <LeadDetail
        tab="activity"
        onTab={(t) => sp.goToFlow("lead-profile", PROFILE_SCREEN[t])}
        onBack={toLeads(sp)}
        onCall={() => sp.next()}
        onCreateOrder={() => sp.go("crm-order")}
      />
    </CrmShell>
  );
}

// Flow 1, screen 3: click-to-call rings the customer; on the call, the agent books the order
export function CrmCallScreen(sp: ScreenProps) {
  const s = useCrm();
  useEffect(() => {
    if (s.call === "idle" || s.call === "ended") crm.dial();
    // dial once on arrival
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <CrmShell onHangup={() => sp.go("crm-disposition")}>
      <LeadDetail
        tab="activity"
        onTab={(t) => sp.goToFlow("lead-profile", PROFILE_SCREEN[t])}
        onBack={toLeads(sp)}
        onCall={crm.dial}
        onCreateOrder={() => sp.next()}
        hintCreateOrder={s.call === "connected"}
      />
    </CrmShell>
  );
}

// Flow 1, screen 4: the Create Order drawer, opened during the call
export function CrmOrderScreen(sp: ScreenProps) {
  return (
    <CrmShell onHangup={() => sp.go("crm-disposition")}>
      <LeadDetail tab="activity" onTab={() => {}} onBack={toLeads(sp)} onCall={crm.dial} onCreateOrder={() => {}} />
      <CreateOrderDrawer onClose={() => sp.go("crm-call")} onPlaced={() => sp.next()} />
    </CrmShell>
  );
}

// Flow 1, screen 5: the order is on the timeline and in Customer Orders; the call is still live
export function CrmPlacedScreen(sp: ScreenProps) {
  const s = useCrm();
  const [drawer, setDrawer] = useState(false);
  useEffect(() => crm.ensureOrder(), []);
  return (
    <CrmShell onHangup={() => sp.next()} hintHangup={s.call === "connected"}>
      <LeadDetail
        tab="activity"
        onTab={(t) => sp.goToFlow("lead-profile", PROFILE_SCREEN[t])}
        onBack={toLeads(sp)}
        onCall={crm.dial}
        onCreateOrder={() => setDrawer(true)}
      />
      {drawer && <CreateOrderDrawer onClose={() => setDrawer(false)} onPlaced={() => setDrawer(false)} />}
    </CrmShell>
  );
}

// Flow 1, screen 6: the call has ended, so the DispositionGate asks for its outcome
export function CrmDispositionScreen(sp: ScreenProps) {
  const s = useCrm();
  useEffect(() => {
    crm.ensureOrder();
    if (s.call === "connected" || s.call === "connecting") crm.hangup(true);
    else if (s.call === "idle" && !s.disposed) crm.ensureEnded();
    // once on arrival
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <CrmShell onDisposed={() => sp.next()}>
      <LeadDetail
        tab="activity"
        onTab={(t) => sp.goToFlow("lead-profile", PROFILE_SCREEN[t])}
        onBack={toLeads(sp)}
        onCall={() => sp.go("crm-call")}
        onCreateOrder={() => sp.go("crm-order")}
      />
    </CrmShell>
  );
}

// Flow 1, screen 7: the call log with its disposition and recording, at the top of the timeline
export function CrmLoggedScreen(sp: ScreenProps) {
  useEffect(() => {
    crm.ensureOrder();
    if (!crm.hasCallLog()) {
      crm.ensureEnded();
      crm.dispose({ disposition: "Connected", sub: "Order Booked" }, true);
    }
  }, []);
  return (
    <CrmShell>
      <LeadDetail
        tab="activity"
        onTab={(t) => sp.goToFlow("lead-profile", PROFILE_SCREEN[t])}
        onBack={toLeads(sp)}
        onCall={() => sp.goToFlow("lead-to-order", "crm-call")}
        onCreateOrder={() => sp.goToFlow("lead-to-order", "crm-order")}
      />
    </CrmShell>
  );
}

// Flow 2: the profile's tabs, one screen each
function ProfileScreen({ sp, tab }: { sp: ScreenProps; tab: Tab }) {
  const [drawer, setDrawer] = useState(false);
  return (
    <CrmShell>
      <LeadDetail
        tab={tab}
        onTab={(t) => sp.go(PROFILE_SCREEN[t])}
        onBack={toLeads(sp)}
        onCall={() => sp.goToFlow("lead-to-order", "crm-call")}
        onCreateOrder={() => setDrawer(true)}
      />
      {drawer && <CreateOrderDrawer onClose={() => setDrawer(false)} onPlaced={() => setDrawer(false)} />}
    </CrmShell>
  );
}
export const CrmProfileActivity = (sp: ScreenProps) => <ProfileScreen sp={sp} tab="activity" />;
export const CrmProfileDetails = (sp: ScreenProps) => <ProfileScreen sp={sp} tab="details" />;
export const CrmProfileTasks = (sp: ScreenProps) => <ProfileScreen sp={sp} tab="tasks" />;
export const CrmProfileOrders = (sp: ScreenProps) => <ProfileScreen sp={sp} tab="orders" />;
