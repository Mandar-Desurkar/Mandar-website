// Sample data and shared state for the Sales CRM prototype (the telecaller's side of the Silo ERP).
// Every name, number and order here is invented: the real CRM holds customers' phone numbers, so
// none of its data is used. Field names, stages, dispositions, activity types and copy follow the
// ERP's own code (pages/telecaller/crm, prod branch, 21 Nov 2026). Products and prices are the Gau
// Sampurna catalogue the website prototype uses. State survives moving between screens and resets
// when the prototype is opened again.
import { useSyncExternalStore } from "react";
import { PRODUCTS as GS_PRODUCTS } from "../web/gsData";

export const AGENT = "Rekha M";
export const DOMAIN = "erp.silofortune.com";

// ---------- Enums (constants/leadEnums.js) ----------

export const LEAD_STAGES = ["New Lead", "Engaged", "Lapsed", "RTU", "FTU", "Not Qualified", "Not Reachable", "Max Call Done"] as const;
export type Stage = (typeof LEAD_STAGES)[number];

export const LEAD_SOURCES = [
  "Organic Search", "Referral Sites", "Direct Traffic", "Social Media", "Inbound Email", "Inbound Phone call",
  "Outbound Phone call", "Pay per Click Ads", "FB Lead Ads", "Google Lead Ads", "web visit/Login", "WhatsApp Inbound",
  "App sign up", "Gau swasth Subscriber", "add to cart", "browsed 3 pages", "Outlet", "medusa", "Telecaller",
];

// Dark-theme badge colours are the ERP's light ones; the ERP uses the same pair in both themes
export const STAGE_COLORS: Record<string, { bg: string; text: string }> = {
  "New Lead": { bg: "#DBEAFE", text: "#1D4ED8" },
  Engaged: { bg: "#D1FAE5", text: "#047857" },
  Lapsed: { bg: "#FEF3C7", text: "#B45309" },
  RTU: { bg: "#E0E7FF", text: "#4338CA" },
  FTU: { bg: "#FCE7F3", text: "#BE185D" },
  "Not Qualified": { bg: "#FEE2E2", text: "#B91C1C" },
  "Not Reachable": { bg: "#F3F4F6", text: "#4B5563" },
  "Max Call Done": { bg: "#FFEDD5", text: "#C2410C" },
};

// Gau Sampurna's two-level disposition (DISPOSITIONS_GS). The FTU/RTU-only and cancelled-order-only
// reasons are left out: the sample lead is a New Lead with no cancelled order, so the ERP hides them too.
export const DISPOSITIONS = [
  {
    main: "Not Connected",
    subs: ["Ringing No Response", "Busy", "Switched off", "Not Reachable/Out of Coverage", "Invalid Number"],
  },
  {
    main: "Connected",
    subs: [
      "Call Back", "Order Booked", "Interested", "Do Not Call", "Wrong Number", "Non-Farmer - Random Visitor",
      "No Lactating / Milking Cows Currently", "Price / Budget Concerns", "Prefers Local Shop / Offline Purchase (Non Service)",
      "Wants Free Samples First", "Non Dairy Farmer", "Dairy Farmer Not Looking For Anything",
      "Non Serviceable - Pincode Mandatory", "Call dropped", "Language Barrier", "Delivery Status Enquiry",
      "Call Back Request - Vet Doctor", "Non-Serviceable Pincode – Customer Not Ready for Prepaid",
      "D+6 Orders – Customer Not Ready for Prepaid",
    ],
  },
];
export const CALLBACK_SUBS = ["Call Back", "Call Back Request - Vet Doctor", "D+6 Orders – Customer Not Ready for Prepaid"];
const COWS = ["1-3", "3-5", "5+", "Don't want to Disclose"];
export const EXTRA_FIELDS: Record<string, { key: string; label: string; options: string[] }[]> = {
  "No Lactating / Milking Cows Currently": [{ key: "How many cows", label: "How many cows", options: COWS }],
  "Dairy Farmer Not Looking For Anything": [{ key: "How many cows", label: "How many cows", options: COWS }],
  "Non Dairy Farmer": [{ key: "How many Acres of Farm", label: "How many Acres of Farm", options: ["1-3", "3-5", "5+", "Don't want to disclose"] }],
  "Language Barrier": [{ key: "Language Barrier", label: "Language", options: ["Hindi", "English", "Tamil", "Telugu", "Kannada", "Malayalam", "Marathi", "Other"] }],
};

export const ACTIVITY_TYPES: Record<string, string> = {
  created: "Created",
  assignment: "Assignment",
  field_update: "Field Update",
  stage_change: "Stage Change",
  note: "Note",
  call_log: "Call Log",
  order: "Order",
  order_update: "Order Update",
  order_escalated: "Escalated to CRM",
  order_verification: "CRM Verification",
  whatsapp_send: "WhatsApp",
  whatsapp_received: "WhatsApp (received)",
};

export const STATES = [
  "Andhra Pradesh", "Bihar", "Gujarat", "Haryana", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal",
];

// ---------- Products: the store's catalogue, as the order drawer lists it ----------
// cost_price is the MRP; selling_price is the price the customer is billed by default.
export type CrmProduct = { uid: string; name: string; mrp: number; sellingPrice: number };
export const PRODUCTS: CrmProduct[] = GS_PRODUCTS.map((p) => ({
  uid: p.id,
  name: `${p.name} ${p.pack}`,
  mrp: p.mrp,
  sellingPrice: p.price,
}));
export const productByUid = (uid: string) => PRODUCTS.find((p) => p.uid === uid);
// On top of the company's own discount (MRP − selling price) a telecaller may give up to another 10%
export const extraDiscountCap = (sellingPrice: number) => Math.max(0, sellingPrice * 0.1);

// ---------- Dates: the ERP shows IST as DD-MM-YYYY, HH:MM ----------

const pad = (n: number) => String(n).padStart(2, "0");
export const fmtDateTime = (d: Date) =>
  `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
export const fmtDate = (d: Date) => `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
export const isoDay = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const minsAgo = (m: number) => new Date(Date.now() - m * 60_000);
export const money = (n: number) => `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ---------- Leads ----------

export type Lead = {
  uid: string;
  first_name: string;
  last_name: string;
  mobile: string;
  email?: string;
  address_line?: string;
  city: string;
  district: string;
  taluk: string;
  state: string;
  pincode: string;
  source: string;
  stage: Stage;
  lead_number: string;
  outlet_name: string;
  created_at: Date;
  last_activity_at: Date;
  calls_attempted: number;
  disposition?: string;
  sub_disposition?: string;
};

const L = (
  uid: string, first: string, last: string, mobile: string, city: string, district: string, pincode: string,
  stage: Stage, source: string, createdMins: number, activityMins: number, calls: number, disp?: string, sub?: string,
): Lead => ({
  uid, first_name: first, last_name: last, mobile, city, district, taluk: city, state: "Karnataka", pincode, source, stage,
  lead_number: `LEAD-${uid.toUpperCase()}`, outlet_name: `${district} Outlet`,
  created_at: minsAgo(createdMins), last_activity_at: minsAgo(activityMins), calls_attempted: calls,
  disposition: disp, sub_disposition: sub,
});

// The lead the flow follows: a dairy farmer who filled a Facebook lead form 25 minutes ago
export const MAIN_UID = "7f3a21c9b4";
export const LEADS: Lead[] = [
  { ...L(MAIN_UID, "Ramesh", "Gowda", "9845012345", "Maddur", "Mandya", "571428", "New Lead", "FB Lead Ads", 25, 24, 0), address_line: "House 12, 3rd Cross, Temple Road" },
  L("2c81e07a5d", "Shivanna", "K", "9000011201", "Channapatna", "Ramanagara", "562160", "Engaged", "FB Lead Ads", 180, 42, 2, "Connected", "Call Back"),
  L("b49d3f1e60", "Lakshmamma", "", "9000011202", "Kunigal", "Tumakuru", "572130", "New Lead", "Google Lead Ads", 95, 61, 1, "Not Connected", "Ringing No Response"),
  L("e0c5a8b712", "Basavaraj", "Patil", "9000011203", "Gokak", "Belagavi", "591307", "FTU", "Outlet", 4320, 300, 3, "Connected", "Order Booked"),
  L("5d27fa9c03", "Manjunath", "H", "9000011204", "Arsikere", "Hassan", "573103", "Not Qualified", "FB Lead Ads", 240, 230, 1, "Connected", "Non Dairy Farmer"),
  L("91be4d6a28", "Savitha", "R", "9000011205", "Malavalli", "Mandya", "571430", "RTU", "App sign up", 12960, 1440, 5, "Connected", "Interested"),
  L("a6f0137ce9", "Nagaraj", "B", "9000011206", "Holenarasipura", "Hassan", "573211", "Not Reachable", "FB Lead Ads", 2880, 520, 4, "Not Connected", "Switched off"),
  L("3e9c62b0d4", "Prakash", "Naik", "9000011207", "Sirsi", "Uttara Kannada", "581401", "Lapsed", "web visit/Login", 43200, 10080, 6, "Connected", "Price / Budget Concerns"),
  L("c7140e5fa1", "Girish", "M", "9000011208", "Hunsur", "Mysuru", "571105", "New Lead", "WhatsApp Inbound", 12, 12, 0),
  L("68ad9b2f37", "Kavitha", "S", "9000011209", "Davanagere", "Davanagere", "577001", "Engaged", "Inbound Phone call", 1500, 95, 2, "Connected", "Call Back Request - Vet Doctor"),
];
export const MAIN_LEAD = LEADS[0];

// The main lead's Facebook form answers and campaign (custom_fields / campaign_data)
export const FORM_ANSWERS: Record<string, string> = {
  "How many cows": "3-5",
  "What problem are you facing?": "Low milk yield",
  "Preferred language": "Kannada",
};
export const CAMPAIGN: Record<string, string> = {
  platform: "facebook",
  campaign_name: "GS | Dairy Fortune | KA | Lead Form",
  ad_name: "Milk yield video, Kannada",
  form_name: "Dairy Fortune enquiry",
};

export const displayName = (l: Lead) => [l.first_name, l.last_name].filter(Boolean).join(" ") || l.lead_number;
export const leadAge = (created: Date) => {
  const days = Math.floor((Date.now() - created.getTime()) / 86_400_000);
  return days === 0 ? "Today" : days === 1 ? "1 day" : `${days} days`;
};

// ---------- Session state (the main lead's timeline, notes, call and order) ----------

export type Activity = {
  uid: string;
  type: keyof typeof ACTIVITY_TYPES;
  at: Date;
  by?: string;
  body?: string;
  from_stage?: string;
  to_stage?: string;
  outcome?: string;
  direction?: "IN" | "OUT";
  recording?: number; // seconds
  orderNo?: string;
};
export type OrderItem = { uid: string; name: string; qty: number; mrp: number; sellingPrice: number; discount: number };
export type Order = {
  order_number: string;
  at: Date;
  status: "pending";
  items: OrderItem[];
  total: number;
  payment: "cod" | "prepaid";
  prepaid?: number;
  delivery: string; // YYYY-MM-DD
  collection: "doorstep" | "outlet_pickup";
  outlet: string;
  address: string;
};
export type CallState = "idle" | "connecting" | "connected" | "ended";

type State = {
  theme: "dark" | "light";
  activities: Activity[];
  notes: Activity[];
  orders: Order[];
  call: CallState;
  callStarted: number;
  callSeconds: number;
  outbound: number;
  disposed: boolean;
  // Activities from the latest action, which the timeline animates in
  fresh: string[];
};

const seedActivities = (): Activity[] => [
  { uid: "a2", type: "assignment", at: minsAgo(24), body: `Assigned to ${AGENT} by System` },
  { uid: "a1", type: "created", at: minsAgo(25), body: `Lead ${MAIN_LEAD.lead_number} created` },
];
const fresh = (): State => ({
  theme: "dark",
  activities: seedActivities(),
  notes: [],
  orders: [],
  call: "idle",
  callStarted: 0,
  callSeconds: 0,
  outbound: 0,
  disposed: false,
  fresh: [],
});

let state: State = fresh();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const SERVER = fresh();
export const useCrm = () => useSyncExternalStore(subscribe, () => state, () => SERVER);
const set = (patch: Partial<State>) => {
  state = { ...state, ...patch };
  emit();
};
let seq = 10;
const uid = () => `a${++seq}`;

export const crm = {
  reset() {
    state = { ...fresh(), theme: state.theme };
    emit();
  },
  toggleTheme() {
    set({ theme: state.theme === "dark" ? "light" : "dark" });
  },
  // Click-to-call: the softphone connects, then the customer answers
  dial() {
    if (state.call === "connecting" || state.call === "connected") return;
    set({ call: "connecting", outbound: state.outbound + 1, disposed: false });
    setTimeout(() => {
      if (state.call === "connecting") set({ call: "connected", callStarted: Date.now() });
    }, 1400);
  },
  // Jumping straight to a screen that shows a live call
  ensureCall() {
    if (state.call === "connected") return;
    set({ call: "connected", callStarted: Date.now() - 48_000, outbound: Math.max(1, state.outbound), disposed: false });
  },
  hangup() {
    const secs = state.call === "connected" ? Math.max(35, Math.round((Date.now() - state.callStarted) / 1000)) : 0;
    set({ call: "ended", callSeconds: secs });
  },
  // An ended call that still needs its disposition (for jumping straight to that screen)
  ensureEnded() {
    if (state.call === "ended") return;
    set({ call: "ended", callSeconds: 192, outbound: Math.max(1, state.outbound), disposed: false });
  },
  dispose(d: { disposition: string; sub: string; note?: string; followUp?: string; extra?: Record<string, string> }) {
    const now = new Date();
    const connected = d.disposition === "Connected";
    const add: Activity[] = [];
    if (d.extra && Object.keys(d.extra).length) {
      add.push({ uid: uid(), type: "field_update", at: now, by: AGENT, body: Object.entries(d.extra).map(([k, v]) => `${k}: — → ${v}`).join("\n") });
    }
    add.push({
      uid: uid(),
      type: "call_log",
      at: now,
      by: AGENT,
      direction: "OUT",
      outcome: connected ? "Answered" : "Not Answered",
      body: `${d.disposition} · ${d.sub}${d.note ? ` — ${d.note}` : ""}${d.followUp ? `\nCallback: ${d.followUp}` : ""}`,
      recording: connected ? state.callSeconds || 192 : undefined,
    });
    set({ activities: [...add.reverse(), ...state.activities], call: "idle", disposed: true, fresh: add.map((a) => a.uid) });
  },
  hasCallLog() {
    return state.activities.some((a) => a.type === "call_log");
  },
  addNote(text: string) {
    const n: Activity = { uid: uid(), type: "note", at: new Date(), by: AGENT, body: text };
    set({ notes: [n, ...state.notes], activities: [n, ...state.activities], fresh: [n.uid] });
  },
  placeOrder(o: Omit<Order, "order_number" | "at" | "status">) {
    const now = new Date();
    const order_number = `ORD-CRM-${isoDay(now).replace(/-/g, "")}-${String(4100 + state.orders.length + 7)}`;
    const order: Order = { ...o, order_number, at: now, status: "pending" };
    const a: Activity = { uid: uid(), type: "order", at: now, by: AGENT, body: `Order ${order_number} placed — ${money(o.total)}`, orderNo: order_number };
    set({ orders: [order, ...state.orders], activities: [a, ...state.activities], fresh: [a.uid] });
    return order;
  },
  // Amend: the open order keeps its number; its items and total change
  amendOrder(orderNo: string, items: OrderItem[]) {
    const now = new Date();
    const total = items.reduce((s, it) => s + (it.mrp - it.discount) * it.qty, 0);
    let updated = state.orders[0];
    const orders = state.orders.map((o) => (o.order_number === orderNo ? (updated = { ...o, items, total }) : o));
    const a: Activity = { uid: uid(), type: "order_update", at: now, by: AGENT, body: `Order ${orderNo} amended — ${money(total)}`, orderNo };
    set({ orders, activities: [a, ...state.activities], fresh: [a.uid] });
    return updated;
  },
  // A sample order, for opening the "Order placed" screen directly
  ensureOrder() {
    if (state.orders.length) return;
    const p = PRODUCTS[0];
    crm.placeOrder({
      items: [{ uid: p.uid, name: p.name, qty: 1, mrp: p.mrp, sellingPrice: p.sellingPrice, discount: p.mrp - p.sellingPrice }],
      total: p.sellingPrice,
      payment: "cod",
      delivery: isoDay(new Date(Date.now() + 3 * 86_400_000)),
      collection: "doorstep",
      outlet: MAIN_LEAD.outlet_name,
      address: `${MAIN_LEAD.address_line}, ${MAIN_LEAD.city}`,
    });
  },
};

// Pincode serviceability, as the order drawer checks it (usePincodeServiceability). Sample table.
export function serviceability(pin: string): { status: "idle" | "serviceable" | "unserviceable"; message: string; district?: string; taluk?: string; state?: string } {
  if (pin.length !== 6) return { status: "idle", message: "" };
  const lead = LEADS.find((l) => l.pincode === pin);
  if (lead) return { status: "serviceable", message: `Serviceable — ${lead.outlet_name}`, district: lead.district, taluk: lead.taluk, state: lead.state };
  if (pin.startsWith("5")) return { status: "serviceable", message: "Serviceable — Mandya Outlet", state: "Karnataka" };
  return { status: "unserviceable", message: "Not serviceable at this pincode" };
}
