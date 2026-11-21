"use client";

// The right-hand drawers of the telecaller CRM: Call Disposition (PhoneCallFormDrawer) and
// Create Order (CreateOrderDrawer), plus the customer's order history both of them sit beside.
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AlertCircle, Calendar, CheckCircle, Clock, Edit3, ExternalLink, Info, Package, Plus, ShoppingBag, ChevronDown, ChevronUp, Trash2, Undo2, X } from "lucide-react";
import styles from "./crm.module.css";
import { useDesktop } from "../web/webMode";
import {
  CALLBACK_SUBS, DISPOSITIONS, EXTRA_FIELDS, MAIN_LEAD, PRODUCTS, STATES, crm, displayName, extraDiscountCap, fmtDate,
  isoDay, money, productByUid, serviceability, useCrm, type Order, type OrderItem,
} from "./crmData";

// ---------- DrawerPanel ----------

export function DrawerPanel({
  title, onClose, footer, children, extraWide, fixedBody,
}: { title: string; onClose: () => void; footer?: ReactNode; children: ReactNode; extraWide?: boolean; fixedBody?: boolean }) {
  return (
    <div className={styles.drawerWrap}>
      <div className={styles.drawerScrim} onClick={onClose} aria-hidden="true" />
      <div className={`${styles.drawer} ${extraWide ? styles.drawerXWide : ""}`} role="dialog" aria-label={title}>
        <div className={styles.drawerHead}>
          <h2>{title}</h2>
          <button type="button" className={styles.drawerClose} onClick={onClose} aria-label="Close">
            <X />
          </button>
        </div>
        <div className={`${styles.drawerBody} ${fixedBody ? styles.orderBodyFixed : ""}`}>{children}</div>
        {footer && <div className={styles.drawerFoot}>{footer}</div>}
      </div>
    </div>
  );
}

const FieldMsg = ({ tone = "error", children }: { tone?: "error" | "success" | "warning"; children: ReactNode }) => {
  const Icon = tone === "success" ? CheckCircle : AlertCircle;
  const cls = tone === "success" ? styles.msgSuccess : tone === "warning" ? styles.msgWarning : styles.msgError;
  return (
    <div className={`${styles.fieldMsg} ${cls}`}>
      <Icon className={styles.icoXs} />
      <span>{children}</span>
    </div>
  );
};

// ---------- Call Disposition ----------

export type Disposition = { disposition: string; sub: string; note?: string; followUp?: string; extra?: Record<string, string> };

export function DispositionDrawer({
  required, initialDisposition = "", onClose, onSave,
}: { required?: boolean; initialDisposition?: string; onClose: () => void; onSave: (d: Disposition) => void }) {
  const [direction, setDirection] = useState<"outbound" | "inbound">("outbound");
  const [disposition, setDisposition] = useState(initialDisposition);
  const [sub, setSub] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [extra, setExtra] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const subs = DISPOSITIONS.find((d) => d.main === disposition)?.subs ?? [];
  const needsCallback = CALLBACK_SUBS.includes(sub);
  const extraFields = EXTRA_FIELDS[sub] ?? [];

  const submit = () => {
    setError(null);
    if (!sub) return setError("Pick a disposition.");
    if (needsCallback && !followUp) return setError("A callback needs a date & time.");
    for (const f of extraFields) if (!extra[f.key]) return setError(`${f.label} is required.`);
    setSaving(true);
    setTimeout(() => {
      const fu = followUp ? new Date(followUp) : null;
      onSave({
        disposition,
        sub,
        note: note.trim() || undefined,
        followUp: fu ? `${fmtDate(fu)}, ${String(fu.getHours()).padStart(2, "0")}:${String(fu.getMinutes()).padStart(2, "0")}` : undefined,
        extra: Object.keys(extra).length ? extra : undefined,
      });
    }, 500);
  };

  return (
    <DrawerPanel
      title={`Call Disposition: ${displayName(MAIN_LEAD)}`}
      onClose={required ? () => {} : onClose}
      footer={
        <>
          {!required && (
            <button type="button" className={styles.btnOutline} onClick={onClose}>
              Cancel
            </button>
          )}
          <button type="button" className={styles.btnPrimary} disabled={saving || !sub} onClick={submit}>
            {saving ? "Saving..." : "Save Disposition"}
          </button>
        </>
      }
    >
      <form className={styles.form} onSubmit={(e) => (e.preventDefault(), submit())}>
        {error && <div className={styles.errBanner}>{error}</div>}
        <div>
          <span className={styles.label}>Direction</span>
          <div className={styles.seg}>
            {(["outbound", "inbound"] as const).map((d) => (
              <button key={d} type="button" className={direction === d ? styles.segOn : ""} onClick={() => setDirection(d)}>
                {d}
              </button>
            ))}
          </div>
        </div>
        <label>
          <span className={styles.label}>Disposition *</span>
          <select className={styles.select} value={disposition} onChange={(e) => (setDisposition(e.target.value), setSub(""), setExtra({}))}>
            <option value="" disabled>
              Select…
            </option>
            {DISPOSITIONS.map((d) => (
              <option key={d.main}>{d.main}</option>
            ))}
          </select>
        </label>
        {disposition && (
          <label>
            <span className={styles.label}>Sub-disposition *</span>
            <select className={styles.select} value={sub} onChange={(e) => (setSub(e.target.value), setExtra({}))}>
              <option value="" disabled>
                Select…
              </option>
              {subs.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
        )}
        {needsCallback && (
          <label>
            <span className={styles.label}>Callback Date & Time *</span>
            <input type="datetime-local" className={styles.input} value={followUp} onChange={(e) => setFollowUp(e.target.value)} />
          </label>
        )}
        {extraFields.map((f) => (
          <label key={f.key}>
            <span className={styles.label}>{f.label} *</span>
            <select className={styles.select} value={extra[f.key] ?? ""} onChange={(e) => setExtra((p) => ({ ...p, [f.key]: e.target.value }))}>
              <option value="" disabled>
                Select…
              </option>
              {f.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
        ))}
        <label>
          <span className={styles.label}>Notes</span>
          <textarea className={styles.textarea} rows={3} placeholder="Call notes..." value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      </form>
    </DrawerPanel>
  );
}

// ---------- Customer orders (CustomerOrdersList) ----------

export function CustomerOrders({
  title, compact, collapsible, onAmend,
}: { title: string; compact?: boolean; collapsible?: boolean; onAmend?: (o: Order) => void }) {
  const { orders } = useCrm();
  const [open, setOpen] = useState(true);
  const head = (
    <span className={styles.ordersHeadL}>
      <ShoppingBag className={styles.ico} />
      <span>{title}</span>
      {orders.length > 0 && <span className={styles.countChip}>{orders.length}</span>}
    </span>
  );
  return (
    <div>
      {collapsible ? (
        <button type="button" className={styles.ordersHead} onClick={() => setOpen(!open)}>
          {head}
          {open ? <ChevronUp className={styles.ico} /> : <ChevronDown className={styles.ico} />}
        </button>
      ) : (
        <div className={styles.ordersHead} style={{ marginBottom: 12 }}>
          {head}
        </div>
      )}
      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.length === 0 && <div className={styles.emptyBox}>No previous orders found for {MAIN_LEAD.mobile}.</div>}
          {orders.map((o) => (
            <div key={o.order_number} className={`${styles.orderCard} ${styles.orderCardOpen}`}>
              <div className={styles.orderCardTop}>
                <span className={styles.orderNo} title="Click to view full order details">
                  <span>{o.order_number}</span>
                  <ExternalLink className={styles.icoXs} />
                </span>
                <span className={styles.status}>
                  <Clock className={styles.icoXs} /> Pending
                </span>
              </div>
              <div className={styles.orderMeta}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Calendar className={styles.icoXs} /> {fmtDate(o.at)}
                </span>
                <strong>{money(o.total)}</strong>
                <span style={{ textTransform: "capitalize", fontSize: 11 }}>
                  {o.payment === "cod" ? "COD" : `upi (Prepaid ${money(o.prepaid ?? 0)})`}
                </span>
              </div>
              {(!compact || o.items.length > 0) && (
                <div className={styles.orderItems}>
                  <div className={styles.orderItemsHead}>
                    <Package className={styles.icoXs} /> Items ({o.items.length})
                  </div>
                  {o.items.map((it) => (
                    <div key={it.uid} className={styles.orderItem}>
                      <span>
                        {it.name} <span className={styles.muted}>× {it.qty}</span>
                      </span>
                      <span className={styles.muted}>{money((it.mrp - it.discount) * it.qty)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className={styles.orderFoot}>
                <span>
                  Outlet: <span style={{ color: "var(--text2)" }}>{o.outlet}</span>
                </span>
                <span>Delivery: {fmtDate(new Date(o.delivery))}</span>
              </div>
              <div className={styles.orderActs}>
                {onAmend ? (
                  <button type="button" className={styles.amendBtn} onClick={() => onAmend(o)} title="Add or remove items on this active order">
                    <Edit3 className={styles.icoXs} /> Amend This Order
                  </button>
                ) : (
                  <span />
                )}
                <span className={styles.detailsLink}>
                  Details <ExternalLink className={styles.icoXs} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Create Order ----------

type Form = {
  customer_name: string;
  customer_phone: string;
  house_no: string;
  street: string;
  address_line: string;
  village: string;
  post: string;
  hobli: string;
  state: string;
  district: string;
  taluk: string;
  pincode: string;
  collection_type: "doorstep" | "outlet_pickup";
  mode_of_payment: "cod" | "prepaid";
  payment_method: "upi" | "online" | "card";
  payment_sub_method: string;
  prepaid_amount: string;
  cash_received_date: string;
  transaction_reference: string;
  transaction_notes: string;
  expected_delivery_date: string;
};

const fromLead = (): Form => ({
  customer_name: displayName(MAIN_LEAD),
  customer_phone: MAIN_LEAD.mobile,
  house_no: "",
  street: "",
  address_line: MAIN_LEAD.address_line ?? "",
  village: "",
  post: "",
  hobli: "",
  state: MAIN_LEAD.state,
  district: MAIN_LEAD.district,
  taluk: MAIN_LEAD.taluk,
  pincode: MAIN_LEAD.pincode,
  collection_type: "doorstep",
  mode_of_payment: "cod",
  payment_method: "upi",
  payment_sub_method: "",
  prepaid_amount: "",
  cash_received_date: "",
  transaction_reference: "",
  transaction_notes: "",
  expected_delivery_date: "",
});

const SUB_OPTIONS: Record<string, { value: string; label: string }[]> = {
  upi: [
    { value: "phonepe", label: "PhonePe" },
    { value: "googlepay", label: "Google Pay" },
    { value: "paytm", label: "Paytm" },
  ],
  online: [
    { value: "neft", label: "NEFT" },
    { value: "rtgs", label: "RTGS" },
  ],
};

type Current = { product_id: string; quantity: number; discount: number; mrp: number; selling: number; base: number };
const EMPTY_ITEM: Current = { product_id: "", quantity: 1, discount: 0, mrp: 0, selling: 0, base: 0 };

export function CreateOrderDrawer({ onClose, onPlaced }: { onClose: () => void; onPlaced: (o: Order) => void }) {
  const desktop = useDesktop();
  const { orders } = useCrm();
  const [form, setForm] = useState<Form>(fromLead);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [cur, setCur] = useState<Current>(EMPTY_ITEM);
  const [itemError, setItemError] = useState<{ field: string; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // An open order opens the drawer in amend mode, as the ERP does, unless the agent backs out
  const [amending, setAmending] = useState<Order | null>(orders[0] ?? null);
  const [removed, setRemoved] = useState<string[]>([]);
  const errRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) errRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [error]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((p) => ({ ...p, [k]: v }));
  const pin = serviceability(form.pincode);
  const today = isoDay(new Date());
  const total = items.reduce((s, it) => s + (it.mrp - it.discount) * it.qty, 0);
  const prepaidOver = form.mode_of_payment === "prepaid" && (parseFloat(form.prepaid_amount) || 0) > total;
  const maxDiscount = cur.base + extraDiscountCap(cur.selling);
  const openConflict = orders.length && !amending ? orders[0] : null;
  const blocked = new Set(openConflict ? openConflict.items.map((i) => i.uid) : []);

  // Required + empty → red border, optional + empty → yellow, as the ERP marks fields
  const fb = (v: string, req = false) => (v ? "" : req ? styles.reqEmpty : styles.optEmpty);

  const pickProduct = (id: string) => {
    const p = productByUid(id);
    setItemError(null);
    if (!p) return setCur(EMPTY_ITEM);
    const base = Math.max(0, p.mrp - p.sellingPrice);
    setCur({ product_id: id, quantity: 1, discount: base, mrp: p.mrp, selling: p.sellingPrice, base });
  };

  const addItem = () => {
    if (!cur.product_id) return setItemError({ field: "product", message: "Please select a product" });
    if (cur.quantity < 1) return setItemError({ field: "quantity", message: "Quantity must be at least 1" });
    if (cur.discount > cur.mrp) return setItemError({ field: "discount", message: "Discount cannot exceed the MRP" });
    if (cur.discount > maxDiscount) {
      return setItemError({
        field: "discount",
        message: `Cannot exceed ₹${maxDiscount.toFixed(2)} (₹${cur.base.toFixed(2)} baseline + 10% of selling price ₹${cur.selling.toFixed(2)})`,
      });
    }
    const p = productByUid(cur.product_id)!;
    setItems((prev) => [...prev, { uid: p.uid, name: p.name, qty: cur.quantity, mrp: cur.mrp, sellingPrice: cur.selling, discount: cur.discount }]);
    setCur(EMPTY_ITEM);
    setItemError(null);
  };

  const submit = () => {
    setError(null);
    if (pin.status === "idle") {
      setPinError("Enter a valid 6-digit pincode");
      return;
    }
    setPinError(null);
    if (amending) {
      const kept = amending.items.filter((i) => !removed.includes(i.uid));
      if (!kept.length && !items.length) return setError("An order must have at least one item. Cancel the order directly instead of removing every item.");
      setSubmitting(true);
      setTimeout(() => {
        onPlaced(crm.amendOrder(amending.order_number, [...kept, ...items]));
      }, 700);
      return;
    }
    const checks: [boolean, string][] = [
      [!form.customer_name.trim(), "Customer name is required"],
      [!form.customer_phone, "Customer phone is required"],
      [!/^\d{10}$/.test(form.customer_phone), "Valid 10-digit phone number is required"],
      [!form.state || !form.district || !form.taluk, "State, District and Taluk are required"],
      [!form.expected_delivery_date, "Expected delivery date is required"],
      [items.length === 0, "At least one product is required"],
      [form.mode_of_payment === "prepaid" && !form.prepaid_amount, "Prepaid amount is required"],
      [form.mode_of_payment === "prepaid" && !form.cash_received_date, "Cash received date is required for prepaid orders"],
    ];
    const failed = checks.find(([bad]) => bad);
    if (failed) return setError(failed[1]);
    if (prepaidOver) return;
    setSubmitting(true);
    setTimeout(() => {
      const order = crm.placeOrder({
        items,
        total,
        payment: form.mode_of_payment,
        prepaid: form.mode_of_payment === "prepaid" ? parseFloat(form.prepaid_amount) || 0 : undefined,
        delivery: form.expected_delivery_date,
        collection: form.collection_type,
        outlet: pin.status === "serviceable" ? pin.message.replace("Serviceable — ", "") : "Unassigned",
        address: [form.house_no, form.street, form.address_line, form.taluk].filter(Boolean).join(", "),
      });
      onPlaced(order);
    }, 900);
  };

  const keptItems = amending ? amending.items.filter((i) => !removed.includes(i.uid)) : [];
  const zeroItems = !!amending && keptItems.length === 0 && items.length === 0;

  const footer = (
    <>
      <button type="button" className={styles.btnOutline} onClick={onClose}>
        Cancel
      </button>
      {amending ? (
        <button type="button" className={styles.btnPrimary} style={{ background: "var(--warning)" }} disabled={submitting || zeroItems} onClick={submit}>
          {submitting ? "Applying Amendment..." : "Save & Apply Amendment"}
        </button>
      ) : (
        <button type="button" className={styles.btnPrimary} disabled={submitting} onClick={submit}>
          {submitting ? "Creating..." : "Create Order"}
        </button>
      )}
    </>
  );

  const text = (k: keyof Form, label: string, req = false, extra?: { span2?: boolean; numeric?: number }) => (
    <label className={extra?.span2 ? styles.span2 : undefined}>
      <span className={styles.label}>
        {label}
        {req ? " *" : ""}
      </span>
      <input
        className={`${styles.input} ${fb(form[k] as string, req)}`}
        value={form[k] as string}
        inputMode={extra?.numeric ? "numeric" : undefined}
        maxLength={extra?.numeric}
        onChange={(e) => set(k, (extra?.numeric ? e.target.value.replace(/\D/g, "") : e.target.value) as Form[typeof k])}
      />
    </label>
  );

  return (
    <DrawerPanel
      title={amending ? `Amending Order: ${amending.order_number} — ${displayName(MAIN_LEAD)}` : `Create Order — ${displayName(MAIN_LEAD)}`}
      onClose={onClose}
      footer={footer}
      extraWide
      fixedBody={desktop}
    >
      <div className={styles.orderGrid}>
        <div className={styles.orderLeft}>
          <CustomerOrders
            title="Customer Order History"
            onAmend={(o) => {
              setAmending(o);
              setRemoved([]);
              setItems([]);
            }}
          />
        </div>

        <div className={styles.orderRight}>
          <form className={styles.form} style={{ gap: 24 }} onSubmit={(e) => (e.preventDefault(), submit())}>
            {amending && (
              <div className={styles.warnBanner} style={{ alignItems: "center", justifyContent: "space-between", border: "1px solid var(--warning)" }}>
                <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Edit3 className={styles.ico} />
                  <span>
                    <b style={{ display: "block" }}>Amending Order: {amending.order_number}</b>
                    <span style={{ fontSize: 12 }}>Items you add are credited to you. Removed items are deducted from the original adder.</span>
                  </span>
                </span>
                <button
                  type="button"
                  className={styles.btnOutline}
                  style={{ padding: "6px 12px", fontSize: 12, borderColor: "rgba(217,119,6,.4)" }}
                  onClick={() => {
                    setAmending(null);
                    setRemoved([]);
                    setItems([]);
                  }}
                >
                  Cancel Amendment
                </button>
              </div>
            )}

            {openConflict && (
              <div className={styles.warnBanner}>
                <Info className={styles.ico} />
                <span>
                  This customer already has an open order for: {openConflict.items.map((i) => `${i.name} (${openConflict.order_number})`).join(", ")}. To add or change items on that
                  order, click <b>&quot;Amend This Order&quot;</b> on the left.
                </span>
              </div>
            )}

            {error && (
              <div ref={errRef} className={styles.errBanner}>
                <AlertCircle className={styles.ico} />
                <span>{error}</span>
              </div>
            )}

            <section className={styles.section}>
              <h3>Customer Information</h3>
              <div className={styles.cols3}>
                {text("customer_name", "Customer Name", true)}
                {text("customer_phone", "Phone Number", true, { numeric: 10 })}
                {text("house_no", "House No.")}
                {text("street", "Street")}
                {text("address_line", "Address Line", false, { span2: true })}
                {text("village", "Village")}
                {text("post", "Post")}
                {text("hobli", "Hobli")}
                <label>
                  <span className={styles.label}>State *</span>
                  <select className={`${styles.select} ${fb(form.state, true)}`} value={form.state} onChange={(e) => set("state", e.target.value)}>
                    <option value="">Select state</option>
                    {STATES.map((st) => (
                      <option key={st}>{st}</option>
                    ))}
                  </select>
                </label>
                {text("district", "District", true)}
                {text("taluk", "Taluk", true)}
                <label>
                  <span className={styles.label}>Pincode *</span>
                  <input
                    className={`${styles.input} ${pin.status === "serviceable" ? styles.okBorder : pin.status === "unserviceable" ? styles.optEmpty : styles.reqEmpty}`}
                    value={form.pincode}
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter pincode"
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "");
                      const r = serviceability(v);
                      // Pincode → geography auto-fill (usePincodeAutofill)
                      setForm((p) => ({ ...p, pincode: v, state: r.state ?? p.state, district: r.district ?? p.district, taluk: r.taluk ?? p.taluk }));
                      if (v.length === 6) setPinError(null);
                    }}
                  />
                  {pin.status === "idle" && pinError ? (
                    <FieldMsg>{pinError}</FieldMsg>
                  ) : pin.status === "serviceable" ? (
                    <FieldMsg tone="success">{pin.message}</FieldMsg>
                  ) : pin.status === "unserviceable" ? (
                    <FieldMsg tone="warning">{pin.message}</FieldMsg>
                  ) : null}
                </label>
              </div>
            </section>

            <section className={styles.section}>
              <h3>{amending ? "Add or Remove Items" : "Add Items"}</h3>

              {amending && (
                <div className={styles.orderItems} style={{ padding: 14, marginBottom: 20 }}>
                  <div className={styles.orderItemsHead} style={{ justifyContent: "space-between" }}>
                    <span>Existing Items in Order ({keptItems.length})</span>
                    <span style={{ textTransform: "none", fontWeight: 400 }}>Order Total: {money(amending.total)}</span>
                  </div>
                  {keptItems.map((it) => (
                    <div key={it.uid} className={styles.orderCard} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                      <div>
                        <b>
                          {it.name} <span className={styles.muted}>× {it.qty}</span>
                        </b>
                        <div className={styles.muted} style={{ fontSize: 11 }}>
                          Line Total: {money((it.mrp - it.discount) * it.qty)}
                        </div>
                      </div>
                      <button type="button" className={styles.trash} style={{ gap: 4, alignItems: "center", fontSize: 12 }} onClick={() => setRemoved((r) => [...r, it.uid])}>
                        <Trash2 className={styles.icoSm} /> Remove
                      </button>
                    </div>
                  ))}
                  {removed.length > 0 && (
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px dashed var(--border)" }}>
                      <div style={{ color: "var(--error)", fontSize: 11, fontWeight: 600 }}>Marked for Removal ({removed.length}):</div>
                      {amending.items
                        .filter((i) => removed.includes(i.uid))
                        .map((it) => (
                          <div key={it.uid} className={styles.errBanner} style={{ marginTop: 6, padding: "6px 10px", fontSize: 12, justifyContent: "space-between" }}>
                            <s>
                              {it.name} × {it.qty}
                            </s>
                            <button type="button" style={{ display: "flex", gap: 2, alignItems: "center", fontWeight: 600, textDecoration: "underline" }} onClick={() => setRemoved((r) => r.filter((x) => x !== it.uid))}>
                              <Undo2 className={styles.icoXs} /> Undo
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                  {zeroItems && (
                    <div className={styles.errBanner} style={{ marginTop: 8, fontSize: 12 }}>
                      An order must have at least one item. Add a product before removing the last one.
                    </div>
                  )}
                </div>
              )}

              <div className={styles.itemRow}>
                <label>
                  <span className={styles.labelXs}>Select Product</span>
                  <select className={`${styles.select} ${itemError?.field === "product" ? styles.reqEmpty : ""}`} value={cur.product_id} onChange={(e) => pickProduct(e.target.value)}>
                    <option value="">Select Product</option>
                    {PRODUCTS.map((p) => (
                      <option key={p.uid} value={p.uid} disabled={blocked.has(p.uid)}>
                        {p.name}
                        {blocked.has(p.uid) && openConflict ? ` (open order ${openConflict.order_number})` : ""}
                      </option>
                    ))}
                  </select>
                  {itemError?.field === "product" && <FieldMsg>{itemError.message}</FieldMsg>}
                </label>
                <label>
                  <span className={styles.labelXs}>MRP</span>
                  <input className={styles.input} readOnly value={cur.product_id ? `₹${cur.mrp.toFixed(2)}` : "—"} />
                </label>
                <label>
                  <span className={styles.labelXs}>Selling Price</span>
                  <input className={styles.input} readOnly value={cur.product_id ? `₹${cur.selling.toFixed(2)}` : "-"} />
                </label>
                <label>
                  <span className={styles.labelXs}>Discount</span>
                  <input
                    className={`${styles.input} ${itemError?.field === "discount" ? styles.reqEmpty : ""}`}
                    type="number"
                    min={0}
                    step="0.01"
                    disabled={!cur.product_id}
                    value={cur.discount}
                    onChange={(e) => {
                      setCur((p) => ({ ...p, discount: parseFloat(e.target.value) || 0 }));
                      if (itemError?.field === "discount") setItemError(null);
                    }}
                  />
                  {itemError?.field === "discount" && <FieldMsg>{itemError.message}</FieldMsg>}
                </label>
                <label>
                  <span className={styles.labelXs}>Quantity</span>
                  <input
                    className={`${styles.input} ${itemError?.field === "quantity" ? styles.reqEmpty : ""}`}
                    type="number"
                    min={1}
                    value={cur.quantity}
                    onChange={(e) => setCur((p) => ({ ...p, quantity: parseInt(e.target.value) || 1 }))}
                  />
                  {itemError?.field === "quantity" && <FieldMsg>{itemError.message}</FieldMsg>}
                </label>
              </div>

              {cur.product_id && (
                <div className={styles.formula}>
                  MRP ₹{cur.mrp.toFixed(2)} − Discount ₹{cur.discount.toFixed(2)} = Item Total <b>₹{(cur.mrp - cur.discount).toFixed(2)}</b>
                </div>
              )}
              <div className={styles.addRow}>
                {cur.product_id && (
                  <span className={styles.muted}>
                    Subtotal: <span className={styles.green}>₹{((cur.mrp - cur.discount) * cur.quantity).toFixed(2)}</span>
                  </span>
                )}
                <button type="button" className={styles.btnSoft} onClick={addItem}>
                  <Plus className={styles.ico} /> Add Item
                </button>
              </div>

              {items.length > 0 && (
                <div className={styles.tableScroll}>
                  <table className={styles.itemsTable}>
                    <thead>
                      <tr>
                        {["Product", "MRP", "Selling Price", "Discount", "Item Total", "Qty", "Subtotal", ""].map((h) => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((it, i) => (
                        <tr key={`${it.uid}-${i}`}>
                          <td style={{ whiteSpace: "normal" }}>{it.name}</td>
                          <td>₹{it.mrp.toFixed(2)}</td>
                          <td>₹{it.sellingPrice.toFixed(2)}</td>
                          <td>₹{it.discount.toFixed(2)}</td>
                          <td className={styles.green}>₹{(it.mrp - it.discount).toFixed(2)}</td>
                          <td>
                            <input
                              className={styles.qtyInput}
                              type="number"
                              min={1}
                              value={it.qty}
                              onChange={(e) => setItems((p) => p.map((x, j) => (j === i ? { ...x, qty: Math.max(1, parseInt(e.target.value) || 1) } : x)))}
                            />
                          </td>
                          <td style={{ fontWeight: 500 }}>₹{((it.mrp - it.discount) * it.qty).toFixed(2)}</td>
                          <td>
                            <button type="button" className={styles.trash} onClick={() => setItems((p) => p.filter((_, j) => j !== i))} aria-label="Remove item">
                              <Trash2 className={styles.ico} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {!amending && (
              <section className={styles.section}>
                <h3>Order Details</h3>
                <div className={styles.cols3}>
                  <label>
                    <span className={styles.label}>Collection Type *</span>
                    <select className={styles.select} value={form.collection_type} onChange={(e) => set("collection_type", e.target.value as Form["collection_type"])}>
                      <option value="doorstep">Doorstep Delivery</option>
                      <option value="outlet_pickup">Outlet Pickup</option>
                    </select>
                  </label>
                  <label>
                    <span className={styles.label}>Mode of Payment *</span>
                    <select
                      className={styles.select}
                      value={form.mode_of_payment}
                      onChange={(e) => {
                        const v = e.target.value as Form["mode_of_payment"];
                        setForm((p) => ({ ...p, mode_of_payment: v, payment_method: "upi", payment_sub_method: "", prepaid_amount: "", cash_received_date: "", transaction_reference: "", transaction_notes: "" }));
                      }}
                    >
                      <option value="cod">Cash on Delivery</option>
                      <option value="prepaid">Prepaid</option>
                    </select>
                  </label>
                  <label>
                    <span className={styles.label}>Expected Delivery Date *</span>
                    <input
                      type="date"
                      min={today}
                      className={`${styles.input} ${fb(form.expected_delivery_date, true)}`}
                      value={form.expected_delivery_date}
                      onChange={(e) => set("expected_delivery_date", e.target.value)}
                      onClick={(e) => {
                        try {
                          e.currentTarget.showPicker?.();
                        } catch {
                          /* unsupported */
                        }
                      }}
                    />
                  </label>
                </div>

                {form.mode_of_payment === "prepaid" && (
                  <>
                    <div className={styles.cols3} style={{ marginTop: 16 }}>
                      <label>
                        <span className={styles.label}>Payment Method *</span>
                        <select className={styles.select} value={form.payment_method} onChange={(e) => setForm((p) => ({ ...p, payment_method: e.target.value as Form["payment_method"], payment_sub_method: "" }))}>
                          <option value="upi">UPI</option>
                          <option value="online">Online Transfer</option>
                          <option value="card">Card</option>
                        </select>
                      </label>
                      {SUB_OPTIONS[form.payment_method] && (
                        <label>
                          <span className={styles.label}>{form.payment_method === "upi" ? "UPI App *" : "Transfer Type *"}</span>
                          <select className={`${styles.select} ${fb(form.payment_sub_method, true)}`} value={form.payment_sub_method} onChange={(e) => set("payment_sub_method", e.target.value)}>
                            <option value="">Select {form.payment_method === "upi" ? "UPI App" : "Transfer Type"}</option>
                            {SUB_OPTIONS[form.payment_method].map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                      <label>
                        <span className={styles.label}>Prepaid Amount (₹) *</span>
                        <input
                          type="number"
                          min={0}
                          className={`${styles.input} ${prepaidOver ? styles.reqEmpty : fb(form.prepaid_amount, true)}`}
                          placeholder="Enter prepaid amount"
                          value={form.prepaid_amount}
                          onChange={(e) => set("prepaid_amount", e.target.value)}
                        />
                        {prepaidOver && <FieldMsg>Cannot exceed the order total (₹{total.toFixed(2)})</FieldMsg>}
                      </label>
                      <label>
                        <span className={styles.label}>Transaction ID / Reference *</span>
                        <input
                          className={`${styles.input} ${fb(form.transaction_reference, true)}`}
                          placeholder={form.payment_method === "upi" ? "UPI Transaction ID" : "Transaction Reference"}
                          value={form.transaction_reference}
                          onChange={(e) => set("transaction_reference", e.target.value)}
                        />
                      </label>
                      <label>
                        <span className={styles.label}>Cash Received Date *</span>
                        <input type="date" className={`${styles.input} ${fb(form.cash_received_date, true)}`} value={form.cash_received_date} onChange={(e) => set("cash_received_date", e.target.value)} />
                      </label>
                    </div>
                    <label style={{ display: "block", marginTop: 16 }}>
                      <span className={styles.label}>Payment Remarks</span>
                      <textarea
                        rows={2}
                        className={`${styles.textarea} ${fb(form.transaction_notes)}`}
                        placeholder="Add any notes about this payment..."
                        value={form.transaction_notes}
                        onChange={(e) => set("transaction_notes", e.target.value)}
                      />
                      {form.payment_sub_method && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--success)" }}>
                          <CheckCircle className={styles.ico} /> Payment will be recorded via {form.payment_sub_method}
                        </span>
                      )}
                    </label>
                  </>
                )}
              </section>
            )}

            <div className={styles.total}>
              <span>Estimated Total:</span>
              <strong>₹{total.toFixed(2)}</strong>
              {form.mode_of_payment === "prepaid" && !amending && (
                <div style={{ marginTop: 4 }}>
                  <span className={styles.muted} style={{ marginRight: 8 }}>
                    Balance Due:
                  </span>
                  <strong style={{ color: prepaidOver ? "var(--error)" : "var(--text)" }}>₹{(total - (parseFloat(form.prepaid_amount) || 0)).toFixed(2)}</strong>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </DrawerPanel>
  );
}
