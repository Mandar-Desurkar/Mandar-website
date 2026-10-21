/* eslint-disable @next/next/no-img-element -- fixed-size mock screens inside a phone frame */
"use client";

// Gau Sampurna Cattle Trading, recreated from the `prod` branch: cattle/all-cattle.jsx (All / My Cattle
// segments, type chips, Filter panel, components/Cattle/CattleCard.jsx), cattle-details-screen.jsx
// (specs, Gau Swastha AI report, verify overlay, sticky Call / WhatsApp), mycattle/images-upload-screen.jsx,
// mycattle/sell-cattle-screen.jsx and verify-screen.jsx (₹49 verification with coupon). Listings are samples.
import { useState, type ComponentType } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Camera,
  ChevronDown,
  ChevronRight,
  Droplet,
  FileScan,
  Images,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  User,
  Video,
  Weight,
  X,
} from "lucide-react";
import t from "./gauTrading.module.css";
import { GauAlert, GauSheet, GauTabBar, gimg, u, useToast } from "./GauShared";
import type { ScreenProps } from "../kissan/KissanScreens";

type Listing = { id: string; breed: string; category: "Cow" | "Buffalo"; images: string[]; location: string; milk: string; lactation: string; age: string; price: number; seller: string; verified: boolean };

const LISTINGS: Listing[] = [
  { id: "c1", breed: "HF Crossbreed", category: "Cow", images: ["trade-cow1.webp", "trade-cow2.webp"], location: "Kunigal, Tumakuru", milk: "14 L", lactation: "2nd", age: "4y 6m", price: 68000, seller: "Ramesh K", verified: true },
  { id: "c2", breed: "Murrah", category: "Buffalo", images: ["trade-buffalo.webp"], location: "Mandya", milk: "10 L", lactation: "3rd", age: "6y", price: 82000, seller: "Lokesh", verified: false },
  { id: "c3", breed: "Gir", category: "Cow", images: ["trade-cow3.webp", "trade-cow.webp"], location: "Hassan", milk: "9 L", lactation: "1st", age: "3y 2m", price: 54000, seller: "Shivanna", verified: true },
];

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function CattleCard({ c, onOpen, hint }: { c: Listing; onOpen: () => void; hint?: boolean }) {
  const [idx, setIdx] = useState(0);
  return (
    <div className={`${t.card} ${hint ? u.hotspot : ""}`}>
      <div className={t.imageWrap}>
        <div className={t.track} onScroll={(e) => setIdx(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
          {c.images.map((img) => (
            <button key={img} type="button" className={u.btnReset} onClick={onOpen}>
              <img src={gimg(img)} alt={`${c.breed} for sale`} />
            </button>
          ))}
        </div>
        <span className={t.categoryChip}>{c.category}</span>
        {c.verified && (
          <span className={t.verifiedChip}>
            <BadgeCheck size={13} /> Verified
          </span>
        )}
        {c.images.length > 1 && (
          <>
            <span className={t.counter}>
              {idx + 1}/{c.images.length}
            </span>
            <span className={t.dots}>
              {c.images.map((img, i) => (
                <i key={img} className={i === idx ? t.dotOn : ""} />
              ))}
            </span>
          </>
        )}
      </div>
      <button type="button" className={`${u.btnReset} ${t.body}`} onClick={onOpen}>
        <span className={t.titleRow}>
          <b>{c.breed}</b>
          <ChevronRight size={22} color="#94A3B8" />
        </span>
        <span className={t.locationRow}>
          <MapPin size={13} /> {c.location}
        </span>
        <span className={t.pills}>
          {[
            [Droplet, "Milk/day", c.milk],
            [Droplet, "Lactation", c.lactation],
            [Calendar, "Age", c.age],
          ].map(([Icon, label, value]) => {
            const I = Icon as typeof Droplet;
            return (
              <span key={label as string} className={t.pill}>
                <I size={14} color="#004691" />
                <span>
                  <small>{label as string}</small>
                  <b>{value as string}</b>
                </span>
              </span>
            );
          })}
        </span>
        <span className={t.priceRow}>
          <span>
            <small>Price</small>
            <b>{inr(c.price)}</b>
          </span>
          <span className={t.seller}>
            <User size={14} /> {c.seller}
          </span>
        </span>
      </button>
      <div className={t.actions}>
        <a className={t.call} href="tel:+919535339311" onClick={(e) => e.preventDefault()}>
          <Phone size={17} /> Call
        </a>
        <a className={t.whatsapp} href="https://wa.me/" onClick={(e) => e.preventDefault()}>
          <MessageCircle size={18} /> WhatsApp
        </a>
      </div>
    </div>
  );
}

// ---------- Trading tab (all-cattle.jsx) ----------

function Trading({ go, goToFlow }: ScreenProps) {
  const [tab, setTab] = useState<"all" | "my">("all");
  const [type, setType] = useState<"All" | "Cow" | "Buffalo">("All");
  const [filter, setFilter] = useState(false);
  const [sort, setSort] = useState<string | null>(null);
  const [pendingSort, setPendingSort] = useState<string | null>(null);
  let list = LISTINGS.filter((c) => type === "All" || c.category === type);
  if (sort === "Low to High price") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "High Milk") list = [...list].sort((a, b) => parseInt(b.milk) - parseInt(a.milk));
  return (
    <div className={`${u.screen} ${t.grey}`}>
      <div className={t.header}>
        <div className={t.headerTop}>
          <b>Trading</b>
          <button
            type="button"
            className={`${u.btnReset} ${t.filterBtn}`}
            onClick={() => {
              setPendingSort(sort);
              setFilter(true);
            }}
            aria-label="Filter cattle"
          >
            <SlidersHorizontal size={22} color={sort ? "#D3D800" : "#fff"} />
          </button>
        </div>
        <div className={t.segment}>
          {(
            [
              ["all", "All Cattle"],
              ["my", "My Cattle"],
            ] as const
          ).map(([id, label]) => (
            <button key={id} type="button" className={`${u.btnReset} ${t.segTab} ${tab === id ? t.segOn : ""}`} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className={`${u.scroll} ${t.list}`}>
        {tab === "all" ? (
          <>
            <div className={t.chipRow}>
              {(["All", "Cow", "Buffalo"] as const).map((c) => (
                <button key={c} type="button" className={`${u.btnReset} ${t.chip} ${type === c ? t.chipOn : ""}`} onClick={() => setType(c)}>
                  {c}
                </button>
              ))}
            </div>
            {list.map((c, i) => (
              <CattleCard key={c.id} c={c} hint={i === 0} onOpen={() => go("gs-cattle-details")} />
            ))}
          </>
        ) : (
          <div className={t.empty}>
            <img src={gimg("cattle-trading.webp")} alt="" />
            <b>You haven&apos;t listed any cattle yet.</b>
            <small>List your cattle to reach thousands of buyers.</small>
            <button type="button" className={`${u.btnReset} ${t.sellBtn} ${u.hotspot}`} onClick={() => go("gs-sell-upload")}>
              <Plus size={20} /> Sell Cattle
            </button>
          </div>
        )}
      </div>
      {tab === "all" && (
        <button type="button" className={`${u.btnReset} ${t.fab}`} onClick={() => go("gs-sell-upload")}>
          <Plus size={20} /> Sell Cattle
        </button>
      )}
      <GauTabBar active="trading" goToFlow={goToFlow} />
      {filter && (
        <GauSheet label="Filter Cattle" onClose={() => setFilter(false)}>
          <div className={t.sheetHead}>
            <b>Filter Cattle</b>
            <button type="button" className={`${u.btnReset} ${t.close}`} onClick={() => setFilter(false)} aria-label="Close">
              <X size={18} />
            </button>
          </div>
          {["Nearby Location", "Low to High price", "High Milk"].map((o) => (
            <button key={o} type="button" className={`${u.btnReset} ${t.filterOption} ${pendingSort === o ? t.filterOn : ""}`} onClick={() => setPendingSort(pendingSort === o ? null : o)}>
              <i className={t.radio}>{pendingSort === o && <i />}</i>
              {o}
            </button>
          ))}
          <button
            type="button"
            className={`${u.btnReset} ${u.primary}`}
            style={{ marginTop: 12 }}
            onClick={() => {
              setSort(pendingSort);
              setFilter(false);
            }}
          >
            Apply Filter
          </button>
        </GauSheet>
      )}
    </div>
  );
}

// ---------- Cattle details (cattle-details-screen.jsx) ----------

function CattleDetails({ back, goToFlow }: ScreenProps) {
  const c = LISTINGS[0];
  const [idx, setIdx] = useState(0);
  const specs: [ComponentType<{ size?: number; color?: string }>, string, string][] = [
    [Calendar, "Age", c.age],
    [Droplet, "Milk/day", "14 L/day"],
    [Droplet, "Lactation", c.lactation],
    [User, "Gender", "Female"],
    [Weight, "Weight", "420 kg"],
    [ShieldCheck, "Pregnant", "No"],
    [ShieldCheck, "Has Calves", "Yes"],
    [MapPin, "Location", c.location],
  ];
  return (
    <div className={`${u.screen} ${t.grey}`}>
      <div className={t.plainHeader}>
        <button type="button" className={`${u.btnReset} ${t.back}`} onClick={back} aria-label="Back">
          <ArrowLeft size={22} />
        </button>
        <b>Cattle Details</b>
        <span style={{ width: 36 }} />
      </div>
      <div className={u.scroll}>
        <div className={t.detailImages}>
          <div className={t.track} onScroll={(e) => setIdx(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
            {c.images.map((img) => (
              <img key={img} src={gimg(img)} alt={c.breed} />
            ))}
          </div>
          <span className={t.dots}>
            {c.images.map((img, i) => (
              <i key={img} className={i === idx ? t.dotOn : ""} />
            ))}
          </span>
        </div>
        <div className={t.content}>
          <div className={t.dCard}>
            <span className={t.dTitle}>
              <b>{c.breed}</b>
              <span className={t.verifiedBadge}>
                <BadgeCheck size={13} /> Verified
              </span>
            </span>
            <span className={t.dPrice}>{inr(c.price)}</span>
            <span className={t.dSeller}>
              <User size={16} /> Seller: {c.seller}
            </span>
          </div>
          <div className={t.dCard}>
            <b className={t.dSection}>Specifications</b>
            <div className={t.specGrid}>
              {specs.map(([Icon, label, value]) => (
                <span key={label} className={t.spec}>
                  <i>
                    <Icon size={18} color="#004691" />
                  </i>
                  <span>
                    <small>{label}</small>
                    <b>{value}</b>
                  </span>
                </span>
              ))}
            </div>
          </div>
          <div className={t.dCard}>
            <b className={t.dSection}>Description</b>
            <p>Calm, healthy HF cross in her 2nd lactation. Regularly vaccinated and dewormed. Selling because I&apos;m reducing my herd.</p>
          </div>
          <div className={t.dCard}>
            <span className={t.reportHead}>
              <FileScan size={18} color="#004691" />
              <b className={t.dSection}>Gau Swastha AI Report</b>
            </span>
            {[
              ["Breed Grade", "A3"],
              ["Body Condition Score", "3.5"],
              ["Approx. Milk Yield", "13 L/day"],
              ["Market Value", "₹64,000 – ₹70,000"],
            ].map(([label, value]) => (
              <span key={label} className={t.reportRow}>
                <span>{label}</span>
                <b>{value}</b>
              </span>
            ))}
            <button type="button" className={`${u.btnReset} ${t.outlineBtn} ${u.hotspot}`} onClick={() => goToFlow("market-value", "gs-market-report")}>
              View Full Report
            </button>
          </div>
        </div>
      </div>
      <div className={t.contactBar}>
        <a className={t.call} href="tel:+919535339311" onClick={(e) => e.preventDefault()}>
          <Phone size={18} /> Call
        </a>
        <a className={t.whatsapp} href="https://wa.me/" onClick={(e) => e.preventDefault()}>
          <MessageCircle size={19} /> WhatsApp
        </a>
      </div>
    </div>
  );
}

// ---------- Sell: upload photos (images-upload-screen.jsx) ----------

const ANGLES = ["Front", "Side", "Rear"] as const;
const ANGLE_IMG: Record<string, string> = { Front: "trade-cow.webp", Side: "trade-cow1.webp", Rear: "trade-cow2.webp" };

function SellUpload({ back, next }: ScreenProps) {
  const [done, setDone] = useState<string[]>([]);
  const [sheet, setSheet] = useState<string | null>(null);
  const all = ANGLES.every((a) => done.includes(a));
  return (
    <div className={`${u.screen} ${t.grey}`}>
      <div className={t.plainHeader}>
        <button type="button" className={`${u.btnReset} ${t.back}`} onClick={back} aria-label="Back">
          <ArrowLeft size={22} />
        </button>
        <b>Sell Cattle</b>
        <span style={{ width: 36 }} />
      </div>
      <div className={`${u.scroll} ${t.formBody}`}>
        <b className={t.uploadTitle}>Upload Photos and Video</b>
        <div className={t.angles}>
          {ANGLES.map((a, i) => (
            <button key={a} type="button" className={`${u.btnReset} ${t.angle} ${!done.includes(a) && i === done.length ? u.hotspot : ""}`} onClick={() => setSheet(a)}>
              {done.includes(a) ? (
                <img src={gimg(ANGLE_IMG[a])} alt={`${a} photo`} />
              ) : (
                <span className={t.emptyAngle}>
                  <Camera size={24} color="#004691" />
                  Click To Upload
                </span>
              )}
              <small>{a}</small>
            </button>
          ))}
        </div>
        <span className={t.fieldLabel}>All angle video</span>
        <button type="button" className={`${u.btnReset} ${t.videoBox}`} onClick={() => setSheet("Video")}>
          <Video size={26} color="#004691" />
          <span>Video upload is optional</span>
        </button>
        <small className={t.note}>Note: Please upload video between 15sec to 30sec</small>
      </div>
      <div className={u.footer}>
        <button type="button" className={`${u.btnReset} ${u.primary} ${all ? "" : u.primaryDisabled}`} disabled={!all} onClick={next}>
          Next
        </button>
      </div>
      {sheet && (
        <GauSheet label="Choose an Option" onClose={() => setSheet(null)}>
          <b className={t.sheetTitle}>{sheet === "Video" ? "Record a short video" : `${sheet} photo`}</b>
          <small className={t.sheetSub}>
            {sheet === "Video" ? "Record a short video (15-30 seconds) of your cow walking." : `Capture a clear photo of your cow from the ${sheet === "Rear" ? "behind" : sheet?.toLowerCase()}.`}
          </small>
          <div className={t.uploadOptions}>
            {[
              [sheet === "Video" ? Video : Camera, sheet === "Video" ? "Record Video" : "Take Photo"],
              [Images, "Choose from Gallery"],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Camera;
              return (
                <button
                  key={label as string}
                  type="button"
                  className={`${u.btnReset} ${t.uploadOption}`}
                  onClick={() => {
                    if (sheet !== "Video") setDone((d) => [...new Set([...d, sheet])]);
                    setSheet(null);
                  }}
                >
                  <I size={22} color="#004691" />
                  {label as string}
                </button>
              );
            })}
          </div>
        </GauSheet>
      )}
    </div>
  );
}

// ---------- Sell: details form (sell-cattle-screen.jsx) ----------

function YesNo({ value, onChange }: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <span className={t.radios}>
      {[true, false].map((v) => (
        <button key={String(v)} type="button" className={`${u.btnReset} ${t.radioOpt}`} onClick={() => onChange(v)}>
          <i className={t.radio}>{value === v && <i />}</i>
          {v ? "Yes" : "No"}
        </button>
      ))}
    </span>
  );
}

function SellForm({ back, go }: ScreenProps) {
  const [category, setCategory] = useState<"Cow" | "Buffalo" | null>("Cow");
  const [gender, setGender] = useState("Female");
  const [pregnant, setPregnant] = useState<boolean | null>(false);
  const [calf, setCalf] = useState<boolean | null>(true);
  const [success, setSuccess] = useState(false);
  const breeds = category === "Buffalo" ? ["Murrah", "Jaffarabadi", "Mehsana", "Nili-Ravi", "Surti", "Other"] : ["Gir", "Holstein Friesian", "Jersey", "Sahiwal", "Other"];
  return (
    <div className={`${u.screen} ${t.grey}`}>
      <div className={t.plainHeader}>
        <button type="button" className={`${u.btnReset} ${t.back}`} onClick={back} aria-label="Back">
          <ArrowLeft size={22} />
        </button>
        <b>Sell Cattle</b>
        <span style={{ width: 36 }} />
      </div>
      <div className={`${u.scroll} ${t.formBody}`}>
        <div className={t.formCard}>
          <b className={t.formTitle}>Photos &amp; Video</b>
          <small className={t.note}>Please upload clear photos from all angles</small>
          <div className={t.thumbs}>
            {ANGLES.map((a) => (
              <span key={a}>
                <img src={gimg(ANGLE_IMG[a])} alt="" />
                <small>
                  {a}
                  <em>*</em>
                </small>
              </span>
            ))}
          </div>
        </div>
        <div className={t.formCard}>
          <b className={t.formTitle}>Seller Information</b>
          {[
            ["Name", "Mandar D"],
            ["Phone Number", "98XXXXXX21"],
            ["Pincode", "572101"],
          ].map(([label, value]) => (
            <label key={label} className={t.field}>
              <span>
                {label}
                <em>*</em>
              </span>
              <input defaultValue={value} />
            </label>
          ))}
        </div>
        <div className={t.formCard}>
          <b className={t.formTitle}>Cattle Information</b>
          <span className={t.field}>
            <span>
              Category<em>*</em>
            </span>
            <span className={t.segRow}>
              {(["Cow", "Buffalo"] as const).map((c) => (
                <button key={c} type="button" className={`${u.btnReset} ${t.segBtn} ${category === c ? t.segBtnOn : ""}`} onClick={() => setCategory(c)}>
                  {c}
                </button>
              ))}
            </span>
          </span>
          <label className={t.field}>
            <span>
              Breed<em>*</em>
            </span>
            <span className={t.selectWrap}>
              <select defaultValue={breeds[0]} key={category}>
                {breeds.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
              <ChevronDown size={18} color="#64748B" />
            </span>
          </label>
          <span className={t.field}>
            <span>
              Gender<em>*</em>
            </span>
            <span className={t.segRow}>
              {["Female", "Male"].map((g) => (
                <button key={g} type="button" className={`${u.btnReset} ${t.segBtn} ${gender === g ? t.segBtnOn : ""}`} onClick={() => setGender(g)}>
                  {g}
                </button>
              ))}
            </span>
          </span>
          {[
            ["Milk Per Day (Liters)", "14"],
            ["Lactation Number", "2"],
            ["Price (₹)", "68000"],
          ].map(([label, value]) => (
            <label key={label} className={t.field}>
              <span>
                {label}
                <em>*</em>
              </span>
              <input defaultValue={value} inputMode="numeric" />
            </label>
          ))}
        </div>
        <div className={t.formCard}>
          <b className={t.formTitle}>More Information</b>
          <div className={t.twoCol}>
            {[
              ["Age (Years)", "4"],
              ["Age (Months)", "6"],
            ].map(([label, value]) => (
              <label key={label} className={t.field}>
                <span>
                  {label}
                  <em>*</em>
                </span>
                <input defaultValue={value} inputMode="numeric" />
              </label>
            ))}
          </div>
          <span className={t.field}>
            <span>
              Is Cattle Pregnant?<em>*</em>
            </span>
            <YesNo value={pregnant} onChange={setPregnant} />
          </span>
          <span className={t.field}>
            <span>
              Is Calf Present?<em>*</em>
            </span>
            <YesNo value={calf} onChange={setCalf} />
          </span>
          <label className={t.field}>
            <span>
              Weight (KG)<em>*</em>
            </span>
            <input defaultValue="420" inputMode="numeric" />
          </label>
          <label className={t.field}>
            <span>
              Description<em>*</em>
            </span>
            <textarea rows={3} defaultValue="Calm, healthy HF cross in her 2nd lactation. Regularly vaccinated and dewormed." />
          </label>
        </div>
      </div>
      <div className={u.footer}>
        <button type="button" className={`${u.btnReset} ${u.primary} ${u.hotspot}`} onClick={() => setSuccess(true)}>
          List Cattle for Sale
        </button>
      </div>
      {success && (
        <GauAlert
          title="Cattle Listed Successfully"
          message="Your cattle has been listed for sale. Interested buyers will contact you soon."
          actions={[{ label: "OK", onPress: () => go("gs-sell-verify"), primary: true }]}
        />
      )}
    </div>
  );
}

// ---------- Verify (verify-screen.jsx) ----------

function Verify({ go, goToFlow }: ScreenProps) {
  const [modal, setModal] = useState(false);
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(false);
  const toast = useToast();
  const fee = 49;
  const discount = applied ? 49 : 0;
  return (
    <div className={`${u.screen} ${t.grey}`}>
      <div className={t.plainHeader}>
        <span style={{ width: 36 }} />
        <b>Trading</b>
        <span style={{ width: 36 }} />
      </div>
      <div className={t.verifyBody}>
        <div className={t.insights}>
          <b>Unlock Trusted Insights</b>
          <span>for your cattle</span>
        </div>
        <div className={t.verifyCard}>
          <span className={t.verifyHead}>
            Verify your cattle by <b>Gau Swasth</b>
          </span>
          {["Life time health records", "Trusted Marketplace Access", "Verified reports attract better buyers & fair prices."].map((b) => (
            <span key={b} className={t.benefit}>
              <BadgeCheck size={18} color="#16A34A" /> {b}
            </span>
          ))}
          <button type="button" className={`${u.btnReset} ${u.primary} ${u.hotspot}`} onClick={() => setModal(true)}>
            Get Verified Now
          </button>
          <button type="button" className={`${u.btnReset} ${t.skip}`} onClick={() => goToFlow("gs-trading")}>
            Skip
          </button>
        </div>
      </div>
      {modal && (
        <div className={u.center} role="presentation" onClick={() => setModal(false)}>
          <div className={t.payModal} role="dialog" aria-label="Pay to get verified" onClick={(e) => e.stopPropagation()}>
            <b>Pay ₹49 to Get Verified Now</b>
            <small>An AI health scan of your listing adds a Verified badge and a Gau Swastha report buyers can trust.</small>
            <span className={t.couponLabel}>Have a coupon code?</span>
            <span className={t.couponRow}>
              <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Enter coupon" disabled={applied} aria-label="Coupon code" />
              {applied ? (
                <button
                  type="button"
                  className={`${u.btnReset} ${t.remove}`}
                  onClick={() => {
                    setApplied(false);
                    setCode("");
                  }}
                >
                  Remove
                </button>
              ) : (
                <button type="button" className={`${u.btnReset} ${t.apply}`} onClick={() => code && setApplied(true)}>
                  Apply
                </button>
              )}
            </span>
            {applied && <small className={t.applied}>Coupon {code} applied. You save ₹49.</small>}
            <span className={t.priceRow2}>
              Verification Fee <b>₹{fee.toFixed(2)}</b>
            </span>
            {applied && (
              <span className={`${t.priceRow2} ${t.discount}`}>
                Discount <b>-₹{discount.toFixed(2)}</b>
              </span>
            )}
            <span className={`${t.priceRow2} ${t.total}`}>
              Total <b>₹{(fee - discount).toFixed(2)}</b>
            </span>
            <span className={t.modalBtns}>
              <button type="button" className={`${u.btnReset} ${u.secondary}`} onClick={() => setModal(false)}>
                Cancel
              </button>
              <button
                type="button"
                className={`${u.btnReset} ${u.primary}`}
                onClick={() => {
                  setModal(false);
                  toast.show("Your cattle verification has been submitted.");
                  setTimeout(() => go("gs-cattle-details"), 1500);
                }}
              >
                Pay Now
              </button>
            </span>
          </div>
        </div>
      )}
      {toast.node}
    </div>
  );
}

export const gauTradingScreens: Record<string, ComponentType<ScreenProps>> = {
  "gs-trading": Trading,
  "gs-cattle-details": CattleDetails,
  "gs-sell-upload": SellUpload,
  "gs-sell": SellForm,
  "gs-sell-verify": Verify,
};
