"use client";

// Add a delivery address (app/(address)/add-new-address, Nov 2026), built on the site for first-time,
// mobile-only farmers, in three steps:
//   1. Pincode: "Can you deliver to me?" is answered before anything is typed (auto-check at 6 digits;
//      GPS can fill it).
//   2. Map: opens on that pincode; the farmer drags the map under a fixed pin. Skippable.
//   3. Details: the pincode already gives taluk / district / state; name and phone come from the
//      account, so usually only "house no. & street" is typed.
// Saving returns to the cart with the new address selected. The site checks pincodes against its
// serviceability API and shows Google Maps; here a small table stands in for the API (Karnataka
// pincodes deliver) and the map is illustrated. Nothing is sent.
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { AlertCircle, ArrowLeft, Check, ChevronRight, Crosshair, Loader2, MapPin, Phone, Search } from "lucide-react";
import type { ScreenProps } from "../kissan/KissanScreens";
import a from "./gsAddress.module.css";
import { PHONE, cartActions } from "./gsData";
import { Page, cx } from "./GsShared";

type PlaceInfo = { place: string; taluk: string; district: string; state: string; area: string; road: string };

// Stand-in for the site's pincode lookup (villages, taluk, district, state) and serviceability check
const KNOWN: Record<string, PlaceInfo> = {
  "571428": { place: "Maddur", taluk: "Maddur", district: "Mandya", state: "Karnataka", area: "Kesthur", road: "Temple Road" },
  "560078": { place: "J. P. Nagar", taluk: "Bengaluru South", district: "Bengaluru Urban", state: "Karnataka", area: "J. P. Nagar 3rd Phase", road: "9th Cross Road" },
  "572101": { place: "Tumakuru", taluk: "Tumakuru", district: "Tumakuru", state: "Karnataka", area: "Kyathsandra", road: "BH Road" },
  "573201": { place: "Hassan", taluk: "Hassan", district: "Hassan", state: "Karnataka", area: "Vidyanagar", road: "BM Road" },
};
const isPin = (p: string) => /^[1-9]\d{5}$/.test(p);
const delivers = (p: string) => /^5[6-9]/.test(p);

// The address being added, kept across the three steps (each step is its own screen, as each is a URL)
const draft = { pincode: "", pinned: false };

const ACCOUNT = { name: "Ramesh Gowda", phone: "9845012345" };
const formatPhone = (p: string) => `${p.slice(0, 5)} ${p.slice(5)}`;

// ---------- Shell: header, scrolling main, footer button ----------

function Shell({ nav, title, white, footer, children }: { nav: ScreenProps; title?: string; white?: boolean; footer: ReactNode; children: ReactNode }) {
  return (
    <Page nav={nav} font="roboto" cartPage>
      <div className={a.screen}>
        <header className={cx(a.header, !!title && a.headerRule)}>
          <button type="button" onClick={nav.back} aria-label="Back" className={a.back}>
            <ArrowLeft size={22} strokeWidth={2} />
          </button>
          {title && <h1>{title}</h1>}
        </header>
        <main className={cx(a.main, white && a.mainWhite)}>{children}</main>
        <footer className={a.footer}>{footer}</footer>
      </div>
    </Page>
  );
}

// ---------- Step 1: pincode ----------

export function GsAddrPincode(props: ScreenProps) {
  const [pincode, setPincode] = useState(draft.pincode);
  const [status, setStatus] = useState<"idle" | "checking" | "serviceable" | "unserviceable">(isPin(draft.pincode) ? (delivers(draft.pincode) ? "serviceable" : "unserviceable") : "idle");
  const [locating, setLocating] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const complete = isPin(pincode);
  const info = KNOWN[pincode];
  const place = info ? [info.place, info.district, info.state].join(", ") : "";
  const confirmed = complete && status === "serviceable";

  useEffect(() => {
    const id = window.setTimeout(() => input.current?.focus(), 250);
    return () => window.clearTimeout(id);
  }, []);

  const change = (v: string) => {
    const next = v.replace(/\D/g, "").slice(0, 6);
    setPincode(next);
    draft.pincode = next;
    draft.pinned = false;
    if (!isPin(next)) return setStatus("idle");
    setStatus("checking");
    window.setTimeout(() => setStatus(delivers(next) ? "serviceable" : "unserviceable"), 650);
  };
  const locate = () => {
    setLocating(true);
    window.setTimeout(() => {
      setLocating(false);
      change("571428");
    }, 800);
  };

  return (
    <Shell
      nav={props}
      white
      footer={
        <button type="button" className={a.primary} disabled={!confirmed} onClick={() => props.goToFlow("web-address", "gw-addr-map")}>
          Continue
        </button>
      }
    >
      <div className={a.pinStep}>
        <h1>Where should we deliver?</h1>
        <p className={a.hint}>Enter your area pincode to check delivery</p>
        <input
          ref={input}
          value={pincode}
          onChange={(e) => change(e.target.value)}
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          placeholder="6-digit pincode"
          aria-label="Pincode"
          className={cx(a.pinInput, complete && status === "unserviceable" && a.pinBad, confirmed && a.pinGood)}
        />
        <div aria-live="polite">
          {complete && status === "checking" && (
            <p className={a.checking}>
              <Loader2 size={16} className={a.spin} />
              Checking delivery availability…
            </p>
          )}
          {confirmed && (
            <div className={a.okBox}>
              <span className={a.okTick}>
                <Check size={14} strokeWidth={3} />
              </span>
              <div>
                <p className={a.okTitle}>We deliver to {pincode}</p>
                {place && <p className={a.place}>{place}</p>}
              </div>
            </div>
          )}
          {complete && status === "unserviceable" && (
            <div className={a.badBox}>
              <AlertCircle size={20} strokeWidth={2.2} />
              <div>
                <p className={a.badTitle}>Sorry, we don&apos;t deliver to {pincode} yet</p>
                <p className={a.badHelp}>We&apos;re reaching new areas every month. Call us and we&apos;ll help you.</p>
                <div className={a.badActions}>
                  <a href={`tel:${PHONE}`} className={a.callUs}>
                    <Phone size={16} strokeWidth={2.2} />
                    Call us
                  </a>
                  <button
                    type="button"
                    className={a.tryAnother}
                    onClick={() => {
                      change("");
                      input.current?.focus();
                    }}
                  >
                    Try another pincode
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {!confirmed && status !== "checking" && (
          <button type="button" className={a.gps} onClick={locate} disabled={locating}>
            <span className={a.gpsIcon}>{locating ? <Loader2 size={20} className={a.spin} /> : <Crosshair size={20} strokeWidth={2.2} />}</span>
            <span className={a.gpsText}>
              <b>{locating ? "Finding your location…" : "Use my current location"}</b>
              <small>We&apos;ll find your pincode</small>
            </span>
            <ChevronRight size={20} strokeWidth={2} className={a.gpsChev} />
          </button>
        )}
      </div>
    </Shell>
  );
}

// ---------- Step 2: map ----------

export function GsAddrMap(props: ScreenProps) {
  const pincode = draft.pincode || "571428";
  const info = KNOWN[pincode] ?? { place: "Your area", taluk: "", district: "", state: "Karnataka", area: "Your area", road: "" };
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [moving, setMoving] = useState(false);
  const [reading, setReading] = useState(true);
  const [locating, setLocating] = useState(false);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const timer = useRef(0);

  // "Geocoding" the spot under the pin after the map settles
  const settle = () => {
    setReading(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setReading(false), 700);
  };
  useEffect(() => {
    timer.current = window.setTimeout(() => setReading(false), 700);
    return () => window.clearTimeout(timer.current);
  }, []);

  const down = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    setMoving(true);
  };
  const move = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    setOffset({ x: d.ox + e.clientX - d.x, y: d.oy + e.clientY - d.y });
  };
  const up = () => {
    if (!drag.current) return;
    drag.current = null;
    setMoving(false);
    settle();
  };
  const locate = () => {
    setLocating(true);
    window.setTimeout(() => {
      setLocating(false);
      setOffset({ x: 0, y: 0 });
      settle();
    }, 700);
  };
  const title = info.area;
  const line2 = [info.road, info.place, info.district, `${info.state} ${pincode}`].filter(Boolean).join(", ");
  const next = (pinned: boolean) => {
    draft.pinned = pinned;
    props.goToFlow("web-address", "gw-addr-details");
  };

  return (
    <Page nav={props} font="roboto" cartPage>
      <div className={a.mapScreen}>
        <div className={a.mapHeader}>
          <button type="button" onClick={props.back} aria-label="Back" className={a.back}>
            <ArrowLeft size={22} strokeWidth={2} />
          </button>
          <label className={a.mapSearch}>
            <Search size={18} strokeWidth={2} />
            <input placeholder="Search village, area or landmark" aria-label="Search village, area or landmark" />
          </label>
        </div>
        <div className={a.mapArea} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
          <div className={a.mapLayer} style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }} aria-hidden="true">
            <svg viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
              <rect width="800" height="800" fill="#eef0e9" />
              <path d="M0 520 C 180 470 260 600 420 560 S 700 470 800 520 L800 800 L0 800Z" fill="#dfe9d3" />
              <path d="M520 0 L800 0 L800 300 C 700 260 640 180 520 0Z" fill="#dfe9d3" />
              <rect x="90" y="120" width="180" height="140" rx="10" fill="#cfe3c2" />
              <rect x="560" y="430" width="150" height="110" rx="10" fill="#cfe3c2" />
              <path d="M620 610 C 660 650 720 660 800 640 L800 800 L600 800Z" fill="#bcd9f0" />
              <g stroke="#ffffff" strokeLinecap="round" fill="none">
                <path d="M-20 380 L820 330" strokeWidth="26" />
                <path d="M380 -20 L330 820" strokeWidth="22" />
                <path d="M-20 140 L440 120 L820 160" strokeWidth="12" />
                <path d="M120 820 L180 420 L120 -20" strokeWidth="10" />
                <path d="M560 -20 L600 380 L700 820" strokeWidth="10" />
                <path d="M-20 650 L360 600 L820 700" strokeWidth="10" />
              </g>
              <g stroke="#f6d48b" strokeLinecap="round" fill="none">
                <path d="M-20 380 L820 330" strokeWidth="14" />
              </g>
              <g fill="#dde1e6">
                <rect x="200" y="200" width="60" height="40" rx="4" />
                <rect x="420" y="190" width="70" height="50" rx="4" />
                <rect x="430" y="420" width="60" height="60" rx="4" />
                <rect x="220" y="430" width="70" height="40" rx="4" />
                <rect x="240" y="690" width="60" height="40" rx="4" />
              </g>
            </svg>
          </div>
          <div className={a.pinWrap}>
            <span className={cx(a.tip, moving && a.tipHidden)}>
              <b>Your order will be delivered here</b>
              <small>Move the map to adjust</small>
              <i />
            </span>
            <svg width="40" height="48" viewBox="0 0 40 48" className={a.pin} style={{ transform: moving ? "translateY(-10px)" : "none" }} aria-hidden="true">
              <path d="M20 47C20 47 37 30.5 37 18.5C37 8.8 29.4 1.5 20 1.5S3 8.8 3 18.5C3 30.5 20 47 20 47Z" fill="#004691" stroke="#fff" strokeWidth="2.5" />
              <circle cx="20" cy="18" r="6.5" fill="#fff" />
            </svg>
            <span className={cx(a.ground, moving && a.groundWide)} />
          </div>
          <button type="button" className={a.locPill} onClick={locate} disabled={locating} onPointerDown={(e) => e.stopPropagation()}>
            {locating ? <Loader2 size={16} className={a.spin} /> : <Crosshair size={16} strokeWidth={2.2} />}
            {locating ? "Finding your location…" : "Use current location"}
          </button>
          <span className={a.mapNote}>Illustrated map · the site uses Google Maps</span>
        </div>
        <div className={a.mapSheet}>
          <div className={a.spot}>
            <MapPin size={20} strokeWidth={2.2} />
            <div>
              {reading || moving ? (
                <div className={a.skeleton}>
                  <i />
                  <i />
                </div>
              ) : (
                <>
                  <p className={a.spotTitle}>{title}</p>
                  <p className={a.spotLine}>{line2}</p>
                </>
              )}
            </div>
          </div>
          <button type="button" className={cx(a.primary, a.confirm)} disabled={reading || moving} onClick={() => next(true)}>
            Confirm location
          </button>
          <button type="button" className={a.skip} onClick={() => next(false)}>
            Skip map, type address
          </button>
        </div>
      </div>
    </Page>
  );
}

// ---------- Step 3: details ----------

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className={a.label}>
        {label}
      </label>
      {children}
      {error && <p className={a.error}>{error}</p>}
      {!error && hint && <p className={a.fieldHint}>{hint}</p>}
    </div>
  );
}

export function GsAddrDetails(props: ScreenProps) {
  const pincode0 = draft.pincode || "571428";
  const info = KNOWN[pincode0];
  const [house, setHouse] = useState("");
  const [village, setVillage] = useState(info?.place ?? "");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState(pincode0);
  const [taluk, setTaluk] = useState(info?.taluk ?? "");
  const [district, setDistrict] = useState(info?.district ?? "");
  const [state, setState] = useState(info?.state ?? "");
  const [editPlace, setEditPlace] = useState(!info);
  const [name, setName] = useState(ACCOUNT.name);
  const [phone, setPhone] = useState(ACCOUNT.phone);
  const [editContact, setEditContact] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const pinOk = isPin(pincode) && delivers(pincode);
  const placeLine = [taluk, district, state].filter((v, i, all) => v && all.indexOf(v) === i).join(", ");
  const input = (err?: string) => cx(a.input, !!err && a.inputBad);
  const clear = (key: string) => errors[key] && setErrors((e) => ({ ...e, [key]: "" }));

  const save = () => {
    const e: Record<string, string> = {};
    if (!house.trim()) e.house = "Please enter house no. and street";
    if (!village.trim()) e.village = "Please enter your village or area";
    if (!isPin(pincode)) e.pincode = "Please enter a 6-digit pincode";
    if (!district.trim()) e.district = "Please enter district";
    if (!state.trim()) e.state = "Please enter state";
    if (!name.trim()) e.name = "Please enter your name";
    if (!/^\d{10}$/.test(phone)) e.phone = "Please enter a 10-digit mobile number";
    setErrors(e);
    if (Object.values(e).some(Boolean)) {
      if (e.district || e.state) setEditPlace(true);
      if (e.name || e.phone) setEditContact(true);
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      cartActions.addAddress({
        name: name.trim(),
        phone: formatPhone(phone),
        street: [house.trim(), landmark.trim()].filter(Boolean).join(", "),
        locality: village.trim(),
        taluk,
        district: district.trim(),
        state: state.trim(),
        pincode,
        isDefault,
        pinned: draft.pinned,
      });
      draft.pincode = "";
      draft.pinned = false;
      props.goToFlow("web-shop", "gw-checkout");
    }, 600);
  };

  return (
    <Shell
      nav={props}
      title="Address details"
      footer={
        <button type="button" className={a.primary} onClick={save} disabled={saving}>
          {saving && <Loader2 size={20} className={a.spin} />}
          {saving ? "Saving…" : "Save address"}
        </button>
      }
    >
      <div className={a.details}>
        {draft.pinned && (
          <section className={a.pinCard}>
            <span className={a.pinCardIcon}>
              <MapPin size={20} strokeWidth={2.2} />
            </span>
            <div>
              <p className={a.pinSet}>
                Pinned on map <Check size={16} strokeWidth={2.5} />
              </p>
              <p className={a.pinArea}>{[info?.area, district].filter(Boolean).join(", ")}</p>
            </div>
            <button type="button" className={a.link} onClick={props.back}>
              Change
            </button>
          </section>
        )}

        <section>
          <h2 className={a.h2}>Address</h2>
          <div className={a.card}>
            <Field id="addr-house" label="House no., building, street *" error={errors.house}>
              <input id="addr-house" className={input(errors.house)} value={house} placeholder="e.g. House 12, 3rd Cross" autoComplete="address-line1" onChange={(e) => (setHouse(e.target.value), clear("house"))} />
            </Field>
            <Field id="addr-village" label="Village / area *" error={errors.village}>
              <input id="addr-village" className={input(errors.village)} value={village} placeholder="Your village or area name" onChange={(e) => (setVillage(e.target.value), clear("village"))} />
            </Field>
            <Field id="addr-landmark" label="Landmark (optional)">
              <input id="addr-landmark" className={input()} value={landmark} placeholder="Near temple, school, dairy…" onChange={(e) => setLandmark(e.target.value)} />
            </Field>
            <Field id="addr-pincode-form" label="Pincode *" error={errors.pincode}>
              <input
                id="addr-pincode-form"
                className={cx(input(errors.pincode || (isPin(pincode) && !delivers(pincode) ? "x" : "")), a.tabular)}
                value={pincode}
                inputMode="numeric"
                maxLength={6}
                placeholder="6-digit pincode"
                onChange={(e) => (setPincode(e.target.value.replace(/\D/g, "").slice(0, 6)), clear("pincode"))}
              />
              {!errors.pincode && isPin(pincode) && (
                <p className={cx(a.notice, pinOk ? a.noticeOk : a.noticeBad)}>
                  {pinOk ? <Check size={14} strokeWidth={2.5} /> : <AlertCircle size={14} strokeWidth={2.2} />}
                  {pinOk ? `Delivery available at ${pincode}` : `Sorry, we don't deliver to ${pincode} yet`}
                </p>
              )}
            </Field>
            {editPlace ? (
              <div className={a.placeEdit}>
                <Field id="addr-taluk" label="Taluk">
                  <input id="addr-taluk" className={input()} value={taluk} onChange={(e) => setTaluk(e.target.value)} />
                </Field>
                <div className={a.twoCol}>
                  <Field id="addr-district" label="District *" error={errors.district}>
                    <input id="addr-district" className={input(errors.district)} value={district} onChange={(e) => (setDistrict(e.target.value), clear("district"))} />
                  </Field>
                  <Field id="addr-state" label="State *" error={errors.state}>
                    <input id="addr-state" className={input(errors.state)} value={state} onChange={(e) => (setState(e.target.value), clear("state"))} />
                  </Field>
                </div>
              </div>
            ) : (
              <div className={a.placeBox}>
                <div>
                  <p>Taluk · District · State</p>
                  <b>{placeLine}</b>
                </div>
                <button type="button" className={a.link} onClick={() => setEditPlace(true)}>
                  Edit
                </button>
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className={a.h2}>Contact for delivery</h2>
          <div className={a.card}>
            {editContact ? (
              <>
                <Field id="addr-name" label="Full name *" error={errors.name}>
                  <input id="addr-name" className={input(errors.name)} value={name} placeholder="e.g. Ramesh Kumar" autoComplete="name" onChange={(e) => (setName(e.target.value), clear("name"))} />
                </Field>
                <Field id="addr-phone" label="Mobile number *" error={errors.phone} hint="Delivery partner will call this number">
                  <div className={cx(a.phoneField, !!errors.phone && a.inputBad)}>
                    <span>+91</span>
                    <input id="addr-phone" type="tel" inputMode="numeric" value={phone} onChange={(e) => (setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)), clear("phone"))} />
                  </div>
                </Field>
              </>
            ) : (
              <div className={a.contact}>
                <div>
                  <p className={a.contactName}>{name}</p>
                  <p className={a.contactPhone}>
                    <Phone size={14} strokeWidth={2} />
                    +91 {formatPhone(phone)}
                  </p>
                  <p className={a.contactNote}>Delivery partner will call this number</p>
                </div>
                <button type="button" className={a.link} onClick={() => setEditContact(true)}>
                  Edit
                </button>
              </div>
            )}
          </div>
        </section>

        <label className={a.toggleRow}>
          <span>Use as my default address</span>
          <span className={a.switchWrap}>
            <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
            <i className={a.track} />
            <i className={a.knob} />
          </span>
        </label>
      </div>
    </Shell>
  );
}
