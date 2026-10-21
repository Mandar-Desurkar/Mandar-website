/* eslint-disable @next/next/no-img-element -- fixed-size mock screens inside a phone frame */
"use client";

// Gau Sampurna Shop, recreated from the `prod` branch: products/products-screen.jsx (Shop tab with
// ShopPromoBands marquee, Recommended, CropFieldPromo, Explore categories, product list),
// products-search-screen.jsx, product-detail-screen.jsx (+ ProductInfo, ProductDetailSections,
// ProductReviewsSection, ProductCTABar), cart/cart-screen.jsx (Checkout with PaymentOptions,
// BillSummary, CancellationPolicy, DeliveryAddressCard, ChooseAddressBottomSheet),
// address/address-map-screen.jsx + add-address-screen.jsx, orders/order-confirmation.jsx,
// orders/order-list-screen.jsx and orders/order-details-screen.jsx. Product data from
// assets/data/product.js; orders and addresses are samples.
import { useMemo, useState, type ComponentType } from "react";
import {
  ArrowLeft,
  Bell,
  Bike,
  Car,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  ExternalLink,
  LocateFixed,
  MapPin,
  Minus,
  Plus,
  Search,
  Share2,
  ShoppingCart,
  Star,
  Trash2,
  User,
  Wallet,
  X,
} from "lucide-react";
import sh from "./gauShop.module.css";
import h from "./gauHome.module.css";
import { GauSheet, GauTabBar, PRODUCTS, ProductCard, gimg, rupee, u, useToast } from "./GauShared";
import { CATEGORIES, CategoryStrip, ProductRow } from "./GauHome";
import type { ScreenProps } from "../kissan/KissanScreens";

const DF = PRODUCTS[0];
const ONLINE_OFF = 10;

const ADDRESSES = [
  { id: "home", tag: "Home", name: "Mandar D", phone: "98XXXXXX21", line: "#14, 2nd Cross, Near Milk Dairy, Gubbi Road", place: "Tumakuru, Karnataka 572101", isDefault: true },
  { id: "farm", tag: "Farm", name: "Mandar D", phone: "98XXXXXX21", line: "Survey No. 112, Hosahalli", place: "Kunigal Taluk, Tumakuru, Karnataka 572130", isDefault: false },
];

function deliveryDate() {
  const d = new Date();
  d.setDate(d.getDate() + 4);
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
}

function ShopHeader({ goToFlow }: { goToFlow: ScreenProps["goToFlow"] }) {
  return (
    <div className={h.header}>
      <span className={h.loc}>
        <MapPin size={20} /> <span>Tumakuru</span>
        <ChevronDown size={20} color="#000" />
      </span>
      <span className={h.right}>
        <button type="button" className={`${u.btnReset} ${h.circle}`} onClick={() => goToFlow("gs-shop", "gs-search")} aria-label="Search">
          <Search size={18} />
        </button>
        <button type="button" className={`${u.btnReset} ${h.circle}`} onClick={() => goToFlow("gs-account", "gs-notifications")} aria-label="Notifications">
          <Bell size={18} />
          <span className={h.badge}>3</span>
        </button>
        <button type="button" className={`${u.btnReset} ${h.avatar}`} onClick={() => goToFlow("gs-account")} aria-label="Profile">
          <User size={22} fill="#94A3B8" />
        </button>
      </span>
    </div>
  );
}

// ---------- Shop tab (products-screen.jsx) ----------

const ANNOUNCEMENTS = ["Free delivery on orders above ₹499", "COD all over India", "Lab-Tested", "Lowest Price"];

function Shop({ go, goToFlow }: ScreenProps) {
  const [category, setCategory] = useState<string | null>(null);
  const toast = useToast();
  const run = (
    <span className={sh.annRun}>
      {ANNOUNCEMENTS.map((a) => (
        <span key={a}>
          {a} <Star size={14} fill="#fff" color="#fff" />
        </span>
      ))}
    </span>
  );
  return (
    <div className={u.screen}>
      <ShopHeader goToFlow={goToFlow} />
      <div className={u.scroll}>
        <div className={sh.announcement} aria-label={ANNOUNCEMENTS.join(", ")}>
          <span className={sh.annTrack}>
            {run}
            {run}
          </span>
        </div>
        <div className={sh.band}>
          <div className={u.sectionHead}>
            <h3 className={u.sectionTitle}>Recommended for you</h3>
          </div>
          <div className={u.hScroll}>
            {PRODUCTS.slice(1, 4).map((p, i) => (
              <ProductCard key={p.id} p={p} hint={i === 0} onOpen={() => go("gs-product")} />
            ))}
          </div>
        </div>
        <div className={sh.cropPromo}>
          <img src={gimg("crop-field-promo.webp")} alt="" />
          <div className={sh.cropRow}>
            <span>
              <b>Also have crop field?</b>
              <small>Monitor your crop day to day</small>
            </span>
            <button type="button" className={`${u.btnReset} ${sh.visit}`} onClick={() => toast.show("Opens the Kissan Sampurna app")}>
              Visit <ExternalLink size={16} />
            </button>
          </div>
        </div>
        <div className={sh.band}>
          <CategoryStrip selected={category} onSelect={setCategory} />
        </div>
        <div className={h.listHead}>
          {category ? CATEGORIES.find((c) => c.id === category)?.label.replace("\n", " ") : "All Products"}
          <span>{PRODUCTS.length} products</span>
        </div>
        {PRODUCTS.map((p) => (
          <ProductRow key={p.id} p={p} onOpen={() => go("gs-product")} />
        ))}
        <div style={{ height: 16 }} />
      </div>
      <GauTabBar active="shop" goToFlow={goToFlow} />
      {toast.node}
    </div>
  );
}

// ---------- Search (products-search-screen.jsx) ----------

function SearchScreen({ back, go }: ScreenProps) {
  const [q, setQ] = useState("milk");
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return PRODUCTS.filter((p) => `${p.title} ${p.desc}`.toLowerCase().includes(s) || (s === "milk" && p.id !== "bio-bloom"));
  }, [q]);
  return (
    <div className={u.screen}>
      <div className={sh.searchBar}>
        <button type="button" className={`${u.btnReset} ${sh.plainIcon}`} onClick={back} aria-label="Back">
          <ArrowLeft size={22} />
        </button>
        <label className={sh.searchField}>
          <Search size={18} color="#64748B" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" aria-label="Search products" />
          {q && (
            <button type="button" className={u.btnReset} onClick={() => setQ("")} aria-label="Clear">
              <X size={16} color="#64748B" />
            </button>
          )}
        </label>
      </div>
      <div className={`${u.scroll} ${sh.searchBody}`}>
        {!q.trim() ? (
          <div className={sh.chips}>
            <span className={sh.chipsLabel}>Popular searches</span>
            {["Milk", "Mastitis", "Calcium", "Calf", "Udder"].map((c) => (
              <button key={c} type="button" className={`${u.btnReset} ${sh.chip}`} onClick={() => setQ(c.toLowerCase())}>
                {c}
              </button>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className={sh.noResults}>
            <Search size={44} color="#CBD5E1" />
            <b>No results found</b>
            <small>No results for “{q}”. Try different keywords or check spelling</small>
          </div>
        ) : (
          <>
            <span className={sh.resultCount}>
              {results.length} result(s) for “{q}”
            </span>
            {results.map((p) => (
              <ProductRow key={p.id} p={p} onOpen={() => go("gs-product")} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ---------- Product detail (product-detail-screen.jsx) ----------

const VARIANTS = [
  { id: "2kg", label: "2 kg", price: 1200, mrp: 1500, off: 20 },
  { id: "10kg", label: "10 kg", price: 2340, mrp: 3000, off: 22 },
];

const BENEFITS = [
  "Enhances milk production, improving milk fat percentage and SNF levels.",
  "Supports reproductive health by preventing repeat breeding and boosting conception rates.",
  "Prevents subclinical and clinical mastitis, promoting udder health.",
  "Improves body condition score (BCS), enhances coat shine, and prevents hoof-related problems.",
  "Optimizes feed intake, reduces bad vices, and controls aflatoxin levels in milk.",
];

const REVIEWS = [
  { name: "Rajesh", place: "Hassan", text: "Dairy Fortune significantly boosted my cows' milk production. I've seen improved health and fewer veterinary visits since using this supplement. Worth every rupee!" },
  { name: "Jayamma", place: "Mysore", text: "As a woman farmer, I needed a reliable product. Dairy Fortune has improved my herd's nutrition and digestion. Milk fat content increased, and I'm earning more from the same cattle." },
];

const SECTIONS = [
  { title: "Key Features and Benefits", body: BENEFITS },
  {
    title: "Product Description",
    body: [
      "Dairy Fortune is a complete feed supplement designed for all stages of a cow's lifecycle: calf, heifer, milking, pregnant, and dry cows. Enriched with cow-specific minerals, essential vitamins, liver tonics, rumenotorics, toxin binders, and natural bypass fat and protein.",
    ],
  },
  { title: "How to Use", body: ["Feed separately: mix the daily dose with a handful of cattle feed.", "Or mix into the full ration once a day."] },
  { title: "Additional Information", body: ["Not for Human consumption.", "For Dairy Cow/Buffalo use only.", "Store Dairy Fortune in a cool, dry place."] },
  { title: "FAQ", body: ["Can I give it to pregnant cows? Yes, it is designed for every stage, including pregnancy."] },
];

function ProductDetail({ back, go }: ScreenProps) {
  const [variant, setVariant] = useState(VARIANTS[1]);
  const [qty, setQty] = useState(0);
  const [more, setMore] = useState(false);
  const [open, setOpen] = useState<string | null>(SECTIONS[0].title);
  const prepaid = Math.round(variant.price * (1 - ONLINE_OFF / 100));
  return (
    <div className={`${u.screen} ${sh.pdpScreen}`}>
      <div className={sh.pdpHeader}>
        <button type="button" className={`${u.btnReset} ${sh.plainIcon}`} onClick={back} aria-label="Back">
          <ArrowLeft size={22} />
        </button>
        <span className={sh.pdpTitle}>{DF.title}</span>
        <span className={sh.pdpRight}>
          <Share2 size={20} />
          <button type="button" className={`${u.btnReset} ${sh.cartIcon}`} onClick={() => go("gs-cart")} aria-label="Cart">
            <ShoppingCart size={22} />
            {qty > 0 && <i>{qty}</i>}
          </button>
        </span>
      </div>
      <div className={`${u.scroll} ${sh.pdpBody}`}>
        <div className={sh.gallery}>
          <img src={gimg(DF.image)} alt={DF.title} />
          <span className={sh.galleryDots}>
            <i className={sh.galleryDotOn} />
            <i />
            <i />
          </span>
        </div>
        <div className={sh.infoCard}>
          <span className={sh.brandRow}>
            Cow Supplementary feed <CircleCheck size={13} color="#A98B2F" /> <em>Gau Sampurna Verified</em>
          </span>
          <b className={sh.infoTitle}>{DF.title}</b>
          <button type="button" className={`${u.btnReset} ${sh.seeMore}`} onClick={() => setMore((m) => !m)}>
            {more ? "See less" : "See more"} <ChevronDown size={16} style={{ transform: more ? "rotate(180deg)" : undefined }} />
          </button>
          {more && (
            <ul className={sh.descList}>
              {BENEFITS.slice(0, 3).map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
          <span className={sh.stars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={15} fill={i <= 3.7 ? "#F59E0B" : "none"} color="#F59E0B" />
            ))}
            <b>3.7</b> <small>(9 reviews)</small>
          </span>
          <div className={sh.variants}>
            {VARIANTS.map((v) => (
              <button key={v.id} type="button" className={`${u.btnReset} ${sh.variant} ${variant.id === v.id ? sh.variantOn : ""}`} onClick={() => setVariant(v)}>
                <b>{v.label}</b>
                <span>{rupee(v.price)}</span>
                <small>
                  MRP <s>{rupee(v.mrp)}</s>
                </small>
                <em>{v.off}% off</em>
              </button>
            ))}
            <span className={sh.prepaidSquare}>
              <span>
                Pay <b>₹{prepaid}</b> only
              </span>
              <small>10% off with</small>
              <i>Online Payment</i>
            </span>
          </div>
          <div className={sh.priceBlock}>
            <span>
              <b>{rupee(variant.price)}</b> <s>{rupee(variant.mrp)}</s> <em>{variant.off}% off</em>
            </span>
            <small>Inclusive of all taxes</small>
            <small className={sh.perFeed}>₹{(variant.price / (variant.id === "10kg" ? 100 : 20)).toFixed(2)} / feed (100 g)</small>
          </div>
          <span className={sh.deliveryPill}>
            <Car size={17} /> FREE delivery — {deliveryDate()}
          </span>
          <span className={sh.locRow}>
            <MapPin size={14} /> Delivering to Tumakuru 572101 · <b>Update location</b>
          </span>
          <span className={sh.stock}>In Stock</span>
          {qty === 0 ? (
            <button type="button" className={`${u.btnReset} ${sh.addBtn} ${u.hotspot}`} onClick={() => setQty(1)}>
              <Bike size={20} /> Add to Cart
            </button>
          ) : (
            <div className={sh.stepperRow}>
              <span className={sh.stepper}>
                <button type="button" className={u.btnReset} onClick={() => setQty((q) => q - 1)} aria-label="Remove one">
                  {qty === 1 ? <Trash2 size={18} /> : <Minus size={18} />}
                </button>
                {qty}
                <button type="button" className={u.btnReset} onClick={() => setQty((q) => q + 1)} aria-label="Add one">
                  <Plus size={18} />
                </button>
              </span>
              <button type="button" className={`${u.btnReset} ${sh.goCart} ${u.hotspot}`} onClick={() => go("gs-cart")}>
                <ShoppingCart size={18} /> Go to Cart
              </button>
            </div>
          )}
          <div className={sh.trust}>
            {[
              ["🐄", "1,00,000", "Farmers using"],
              ["🏅", "KMF", "Certified"],
              ["👨🏻‍⚕️", "Vet", "Recommended"],
            ].map(([e, b, s]) => (
              <span key={b}>
                <i>{e}</i>
                <b>{b}</b>
                <small>{s}</small>
              </span>
            ))}
          </div>
        </div>

        <div className={sh.youMightLike}>
          <b className={sh.blockTitle}>You might also like</b>
          <div className={u.hScroll} style={{ padding: "0 0 4px" }}>
            {PRODUCTS.slice(1, 4).map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>

        <div className={sh.sections}>
          {SECTIONS.map((sec) => (
            <div key={sec.title} className={sh.accordion}>
              <button type="button" className={`${u.btnReset} ${sh.accHead}`} onClick={() => setOpen(open === sec.title ? null : sec.title)} aria-expanded={open === sec.title}>
                {sec.title}
                <ChevronDown size={18} style={{ transform: open === sec.title ? "rotate(180deg)" : undefined }} />
              </button>
              {open === sec.title && (
                <ul className={sh.descList}>
                  {sec.body.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className={sh.reviews}>
          <span className={sh.reviewsHead}>
            <b className={sh.blockTitle}>Customer Reviews</b>
            <small>See All</small>
          </span>
          {REVIEWS.map((r) => (
            <div key={r.name} className={sh.review}>
              <span className={sh.reviewer}>
                <i>{r.name[0]}</i>
                <span>
                  <b>
                    {r.name} <CircleCheck size={12} color="#16A34A" />
                  </b>
                  <small>{r.place}</small>
                </span>
                <span className={sh.reviewStars}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </span>
              </span>
              <p>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={sh.ctaBar}>
        <span>
          <small>{variant.label}</small>
          <b>{rupee(variant.price)}</b>
        </span>
        <button type="button" className={`${u.btnReset} ${sh.ctaBtn}`} onClick={() => (qty ? go("gs-cart") : setQty(1))}>
          {qty ? "Go to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

// ---------- Checkout (cart-screen.jsx) ----------

function Checkout({ back, go }: ScreenProps) {
  const [qty, setQty] = useState(1);
  const [pay, setPay] = useState<"online" | "cod">("online");
  const [sheet, setSheet] = useState(false);
  const [addr, setAddr] = useState(ADDRESSES[0]);
  const [pending, setPending] = useState(ADDRESSES[0].id);
  const [placing, setPlacing] = useState(false);
  const mrp = DF.mrp * qty;
  const sub = DF.price * qty;
  const promo = pay === "online" ? Math.round(sub * (ONLINE_OFF / 100)) : 0;
  const total = sub - promo;
  const place = () => {
    setPlacing(true);
    setTimeout(() => go("gs-confirmation"), 1200);
  };
  return (
    <div className={`${u.screen} ${sh.grey}`}>
      <div className={sh.plainHeader}>
        <button type="button" className={`${u.btnReset} ${sh.plainIcon}`} onClick={back} aria-label="Back">
          <ArrowLeft size={24} />
        </button>
        <b>Checkout</b>
        <span style={{ width: 24 }} />
      </div>
      <div className={`${u.scroll} ${sh.checkoutBody}`}>
        <b className={sh.itemsTitle}>Items({qty})</b>
        <div className={sh.itemsCard}>
          <div className={sh.cartItem}>
            <img src={gimg(DF.image)} alt="" />
            <span className={sh.cartInfo}>
              <b>{DF.title}</b>
              <small>{DF.variant}</small>
              <span>
                <strong>{rupee(DF.price)}</strong> <s>{rupee(DF.mrp)}</s>
              </span>
              <small className={sh.deliverBy}>Delivering by {deliveryDate()}</small>
            </span>
            <span className={sh.qtyBox}>
              <button type="button" className={u.btnReset} onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Remove one">
                {qty === 1 ? <Trash2 size={15} /> : <Minus size={15} />}
              </button>
              {qty}
              <button type="button" className={u.btnReset} onClick={() => setQty((q) => q + 1)} aria-label="Add one">
                <Plus size={15} />
              </button>
            </span>
          </div>
        </div>
        <p className={sh.addMore}>
          Forgot something?{" "}
          <button type="button" className={u.btnReset} onClick={back}>
            Add More Items
          </button>
        </p>

        <b className={sh.sectionTitle}>Select Payment Option</b>
        <div className={sh.payCard}>
          <button type="button" className={`${u.btnReset} ${sh.payOption} ${pay === "online" ? sh.payOn : ""}`} onClick={() => setPay("online")}>
            <span className={sh.payIcon}>
              UPI <ChevronRight size={14} />
            </span>
            <span className={sh.payBody}>
              <span>
                <b>Pay Online</b> <em>{ONLINE_OFF}% OFF</em>
              </span>
              <small>UPI, Card, Wallets</small>
            </span>
            <span className={sh.payRight}>
              <b>₹{(sub * 0.9).toFixed(2)}</b>
              <i className={sh.radio}>{pay === "online" && <i />}</i>
            </span>
          </button>
          <span className={sh.divider} />
          <button type="button" className={`${u.btnReset} ${sh.payOption} ${pay === "cod" ? sh.payOn : ""}`} onClick={() => setPay("cod")}>
            <span className={sh.payIcon}>
              <Wallet size={20} color="#004691" />
            </span>
            <span className={sh.payBody}>
              <b>Cash on Delivery</b>
            </span>
            <span className={sh.payRight}>
              <b>₹{sub.toFixed(2)}</b>
              <i className={sh.radio}>{pay === "cod" && <i />}</i>
            </span>
          </button>
        </div>

        <b className={sh.sectionTitle}>Bill Summary</b>
        <div className={sh.bill}>
          <span>
            Item Total <span>
              <s>{rupee(mrp)}</s> {rupee(sub)}
            </span>
          </span>
          {promo > 0 && (
            <span className={sh.green}>
              Promo <span>-{rupee(promo)}</span>
            </span>
          )}
          <span>
            Delivery Fee <span className={sh.green}>FREE</span>
          </span>
          <span className={sh.divider} />
          <span className={sh.grand}>
            Grand Total <span>{rupee(total)}</span>
          </span>
          <span className={sh.savings}>
            Total Savings <span>{rupee(mrp - total)}</span>
          </span>
        </div>

        <div className={sh.policy}>
          <b>Cancellation Policy</b>
          <small>Orders can be cancelled before they are shipped. Once shipped, they can&apos;t be cancelled.</small>
        </div>
      </div>
      <div className={sh.sticky}>
        <div className={sh.addrCard}>
          <MapPin size={18} color="#004691" />
          <span>
            <small>Delivering to</small>
            <b>
              {addr.tag} · {addr.line}
            </b>
          </span>
          <button
            type="button"
            className={`${u.btnReset} ${sh.change}`}
            onClick={() => {
              setPending(addr.id);
              setSheet(true);
            }}
          >
            Change
          </button>
        </div>
        <div className={sh.ctaRow}>
          <span>
            <small>
              {qty} {qty === 1 ? "Item" : "Items"}
            </small>
            <b>{rupee(total)}</b>
          </span>
          <button type="button" className={`${u.btnReset} ${sh.placeBtn} ${u.hotspot}`} onClick={place} disabled={placing}>
            {pay === "online" ? "Proceed to Pay" : "Place Order"}
          </button>
        </div>
      </div>
      {placing && (
        <div className={sh.processing}>
          <span className={sh.spinner} />
          <b>Processing order...</b>
        </div>
      )}
      {sheet && (
        <GauSheet label="Choose a delivery address" onClose={() => setSheet(false)}>
          <div className={sh.sheetHead}>
            <b>Choose a delivery address</b>
            <button type="button" className={`${u.btnReset} ${sh.closeBtn}`} onClick={() => setSheet(false)} aria-label="Close">
              <X size={18} />
            </button>
          </div>
          <small className={sh.sheetLabel}>Saved Addresses</small>
          {ADDRESSES.map((a) => (
            <button key={a.id} type="button" className={`${u.btnReset} ${sh.addrOption} ${pending === a.id ? sh.addrOn : ""}`} onClick={() => setPending(a.id)}>
              <i className={sh.radio}>{pending === a.id && <i />}</i>
              <span>
                <b>
                  {a.tag} {a.isDefault && <em>Default</em>}
                </b>
                <small>
                  {a.line}, {a.place}
                </small>
                <small>
                  {a.name} · {a.phone}
                </small>
              </span>
            </button>
          ))}
          <button type="button" className={`${u.btnReset} ${sh.addAddr}`} onClick={() => go("gs-address-map")}>
            <Plus size={18} /> Add Address
          </button>
          <button
            type="button"
            className={`${u.btnReset} ${u.primary}`}
            onClick={() => {
              setAddr(ADDRESSES.find((a) => a.id === pending) ?? ADDRESSES[0]);
              setSheet(false);
            }}
          >
            Confirm Selection
          </button>
        </GauSheet>
      )}
    </div>
  );
}

// ---------- Address map + add address ----------

function AddressMap({ back, next }: ScreenProps) {
  return (
    <div className={u.screen}>
      <div className={sh.map} aria-hidden="true">
        <svg viewBox="0 0 375 520" preserveAspectRatio="xMidYMid slice">
          <rect width="375" height="520" fill="#EAF0E6" />
          <path d="M0 140 L375 110 M0 330 L375 360 M90 0 L120 520 M260 0 L230 520" stroke="#fff" strokeWidth="14" />
          <path d="M0 230 Q190 200 375 250" stroke="#FCD34D" strokeWidth="10" fill="none" />
          <rect x="140" y="160" width="70" height="50" rx="6" fill="#D6E4CF" />
          <rect x="280" y="380" width="80" height="60" rx="6" fill="#CFE0F5" />
          <rect x="20" y="380" width="60" height="90" rx="6" fill="#D6E4CF" />
        </svg>
        <span className={sh.pin}>
          <MapPin size={40} fill="#004691" color="#fff" />
        </span>
        <span className={sh.pinTip}>Your order will be delivered here</span>
      </div>
      <div className={sh.mapTop}>
        <button type="button" className={`${u.btnReset} ${sh.mapBack}`} onClick={back} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <label className={sh.mapSearch}>
          <Search size={16} color="#64748B" />
          <input placeholder="Search address or landmark..." aria-label="Search address" />
        </label>
      </div>
      <button type="button" className={`${u.btnReset} ${sh.locate}`} aria-label="Use current location">
        <LocateFixed size={20} color="#004691" />
      </button>
      <div className={sh.mapSheet}>
        <span className={sh.mapAddr}>
          <MapPin size={20} color="#004691" />
          <span>
            <b>Gubbi Road</b>
            <small>2nd Cross, Tumakuru, Karnataka 572101</small>
          </span>
        </span>
        <button type="button" className={`${u.btnReset} ${u.primary} ${u.hotspot}`} onClick={next}>
          Confirm Address
        </button>
      </div>
    </div>
  );
}

function AddAddress({ back, go }: ScreenProps) {
  const [tag, setTag] = useState("Home");
  const toast = useToast();
  const fields: [string, string, string, boolean][] = [
    ["Full Address", "#14, 2nd Cross, Gubbi Road", "required", true],
    ["Landmark", "Near...", "optional", false],
    ["City / Village", "Tumakuru", "required", true],
    ["Taluk", "Tumakuru", "required", true],
    ["District", "Tumakuru", "required", true],
    ["State", "Karnataka", "required", true],
    ["Pincode", "572101", "required", true],
  ];
  return (
    <div className={`${u.screen} ${sh.grey}`}>
      <div className={sh.plainHeader}>
        <button type="button" className={`${u.btnReset} ${sh.plainIcon}`} onClick={back} aria-label="Back">
          <ArrowLeft size={24} />
        </button>
        <b>Add Address</b>
        <span style={{ width: 24 }} />
      </div>
      <div className={`${u.scroll} ${sh.formBody}`}>
        <button type="button" className={`${u.btnReset} ${sh.useLoc}`}>
          <LocateFixed size={16} /> Use my location
        </button>
        <span className={sh.formLabel}>CONTACT DETAILS</span>
        <div className={sh.formCard}>
          <label>
            <span>
              Full Name <em>required</em>
            </span>
            <input defaultValue="Mandar D" />
          </label>
          <label>
            <span>
              Phone Number <em>required</em>
            </span>
            <input defaultValue="98XXXXXX21" inputMode="tel" />
          </label>
        </div>
        <span className={sh.formLabel}>SHIPPING DETAILS</span>
        <div className={sh.formCard}>
          {fields.map(([label, value, req, filled]) => (
            <label key={label}>
              <span>
                {label} <em>{req}</em>
              </span>
              <input defaultValue={filled ? value : ""} placeholder={filled ? undefined : value} />
            </label>
          ))}
        </div>
        <span className={sh.formLabel}>Save As</span>
        <div className={sh.tags}>
          {["Home", "Farm", "Other"].map((t) => (
            <button key={t} type="button" className={`${u.btnReset} ${sh.tag} ${tag === t ? sh.tagOn : ""}`} onClick={() => setTag(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className={u.footer}>
        <button
          type="button"
          className={`${u.btnReset} ${u.primary} ${u.hotspot}`}
          onClick={() => {
            toast.show("Address saved");
            setTimeout(() => go("gs-cart"), 700);
          }}
        >
          Save Address
        </button>
      </div>
      {toast.node}
    </div>
  );
}

// ---------- Order confirmation (order-confirmation.jsx) ----------

function Confirmation({ go, goToFlow }: ScreenProps) {
  return (
    <div className={`${u.screen} ${sh.grey}`}>
      <div className={`${u.scroll} ${sh.confirmBody}`}>
        <div className={sh.successHero}>
          <span className={sh.successIcon}>
            <Check size={40} color="#fff" strokeWidth={3} />
          </span>
          <b>Thank you for shopping with us!</b>
          <small>Order #GS10482 · Paid online</small>
        </div>
        <div className={sh.confirmCard}>
          <span className={sh.confirmRow}>
            <small>Estimated Delivery</small>
            <b>{deliveryDate()}</b>
          </span>
          <span className={sh.divider} />
          <span className={sh.confirmRow}>
            <small>Delivery Address</small>
            <b>
              {ADDRESSES[0].line}, {ADDRESSES[0].place}
            </b>
          </span>
        </div>
        <div className={sh.confirmCard}>
          <b className={sh.cardTitle}>Items</b>
          <div className={sh.cartItem}>
            <img src={gimg(DF.image)} alt="" />
            <span className={sh.cartInfo}>
              <b>{DF.title}</b>
              <small>
                {DF.variant} · Qty 1
              </small>
            </span>
            <b>{rupee(DF.price)}</b>
          </div>
        </div>
        <div className={sh.confirmCard}>
          <b className={sh.cardTitle}>Bill Summary</b>
          <div className={sh.bill} style={{ padding: 0, border: 0 }}>
            <span>
              Item Total <span>{rupee(DF.price)}</span>
            </span>
            <span className={sh.green}>
              Discount <span>-{rupee(234)}</span>
            </span>
            <span>
              Delivery Fee <span className={sh.green}>FREE</span>
            </span>
            <span className={sh.divider} />
            <span className={sh.grand}>
              Grand Total <span>{rupee(DF.price - 234)}</span>
            </span>
          </div>
        </div>
      </div>
      <div className={u.footer}>
        <button type="button" className={`${u.btnReset} ${u.primary} ${u.hotspot}`} onClick={() => go("gs-order-details")}>
          View Order Details
        </button>
        <button type="button" className={`${u.btnReset} ${u.secondary}`} onClick={() => goToFlow("gs-home")}>
          Return Home
        </button>
      </div>
    </div>
  );
}

// ---------- My Orders (order-list-screen.jsx) + order details (order-details-screen.jsx) ----------

const ORDERS = [
  { id: "GS10482", date: "21 Oct", status: "Confirmed", tone: "#004691", items: [PRODUCTS[0]], total: 2106 },
  { id: "GS10311", date: "02 Oct", status: "Shipped", tone: "#D97706", items: [PRODUCTS[3], PRODUCTS[1]], total: 670 },
  { id: "GS10027", date: "14 Sep", status: "Delivered", tone: "#16A34A", items: [PRODUCTS[2]], total: 621 },
];

function MyOrders({ back, go }: ScreenProps) {
  const [q, setQ] = useState("");
  const list = ORDERS.filter((o) => !q || `${o.id} ${o.items.map((i) => i.title).join(" ")}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className={`${u.screen} ${sh.grey}`}>
      <div className={sh.plainHeader}>
        <button type="button" className={`${u.btnReset} ${sh.plainIcon}`} onClick={back} aria-label="Back">
          <ArrowLeft size={24} />
        </button>
        <b>My Orders</b>
        <span style={{ width: 24 }} />
      </div>
      <label className={sh.orderSearch}>
        <Search size={16} color="#64748B" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by product or order #" aria-label="Search orders" />
      </label>
      <div className={`${u.scroll} ${sh.ordersBody}`}>
        {list.length === 0 ? (
          <p className={sh.empty}>No orders match your search.</p>
        ) : (
          list.map((o, i) => (
            <button key={o.id} type="button" className={`${u.btnReset} ${sh.orderCard} ${i === 0 ? u.hotspot : ""}`} onClick={() => go("gs-order-details")}>
              <span className={sh.orderTop}>
                <span>
                  <b>Order #{o.id}</b>
                  <small>Placed on {o.date}</small>
                </span>
                <em style={{ color: o.tone, background: `${o.tone}14` }}>{o.status}</em>
              </span>
              <span className={sh.orderItems}>
                {o.items.map((it) => (
                  <img key={it.id} src={gimg(it.image)} alt="" />
                ))}
                <span>
                  {o.items.map((it) => it.title).join(", ")}
                  <small>
                    {o.items.length} {o.items.length === 1 ? "item" : "items"} · {rupee(o.total)}
                  </small>
                </span>
                <ChevronRight size={18} color="#94A3B8" />
              </span>
            </button>
          ))
        )}
        {list.length > 0 && <small className={sh.allLoaded}>All orders loaded</small>}
      </div>
    </div>
  );
}

const STEPS = ["Order Placed", "Confirmed", "Packed", "Shipped", "Delivered"];

function OrderDetails({ back, go }: ScreenProps) {
  const at = 1;
  return (
    <div className={`${u.screen} ${sh.grey}`}>
      <div className={sh.plainHeader}>
        <button type="button" className={`${u.btnReset} ${sh.plainIcon}`} onClick={back} aria-label="Back">
          <ArrowLeft size={24} />
        </button>
        <b>Order #GS10482</b>
        <span style={{ width: 24 }} />
      </div>
      <div className={`${u.scroll} ${sh.checkoutBody}`}>
        <div className={sh.confirmCard}>
          <span className={sh.confirmRow}>
            <small>Order ID</small>
            <b>#GS10482</b>
          </span>
          <span className={sh.confirmRow}>
            <small>Estimated Delivery</small>
            <b>{deliveryDate()}</b>
          </span>
          <div className={sh.progress}>
            {STEPS.map((st, i) => (
              <span key={st} className={i <= at ? sh.stepDone : undefined}>
                <i>{i <= at && <Check size={11} color="#fff" strokeWidth={3} />}</i>
                <small>{st === "Order Placed" ? "Placed" : st}</small>
              </span>
            ))}
          </div>
        </div>
        <div className={sh.confirmCard}>
          <b className={sh.cardTitle}>Items</b>
          <div className={sh.cartItem}>
            <img src={gimg(DF.image)} alt="" />
            <span className={sh.cartInfo}>
              <b>{DF.title}</b>
              <small>{DF.variant} · Qty 1</small>
            </span>
            <b>{rupee(DF.price)}</b>
          </div>
        </div>
        <div className={sh.confirmCard}>
          <b className={sh.cardTitle}>Delivery Address</b>
          <small className={sh.addrText}>
            {ADDRESSES[0].name}
            <br />
            {ADDRESSES[0].line}, {ADDRESSES[0].place}
            <br />
            Phone: {ADDRESSES[0].phone}
          </small>
        </div>
        <div className={sh.confirmCard}>
          <span className={sh.confirmRow}>
            <small>Payment Method</small>
            <b>Online Payment</b>
          </span>
        </div>
        <div className={sh.confirmCard}>
          <b className={sh.cardTitle}>Bill Summary</b>
          <div className={sh.bill} style={{ padding: 0, border: 0 }}>
            <span>
              MRP Total <span>{rupee(DF.mrp)}</span>
            </span>
            <span className={sh.green}>
              Product Discount <span>-{rupee(DF.mrp - DF.price)}</span>
            </span>
            <span className={sh.green}>
              Promo Discount <span>-{rupee(234)}</span>
            </span>
            <span>
              Delivery Fee <span className={sh.green}>FREE</span>
            </span>
            <span className={sh.divider} />
            <span className={sh.grand}>
              Grand Total <span>{rupee(DF.price - 234)}</span>
            </span>
          </div>
        </div>
        <button type="button" className={`${u.btnReset} ${u.secondary}`} onClick={() => go("gs-orders")}>
          Back to Orders
        </button>
      </div>
    </div>
  );
}

export const gauShopScreens: Record<string, ComponentType<ScreenProps>> = {
  "gs-shop": Shop,
  "gs-search": SearchScreen,
  "gs-product": ProductDetail,
  "gs-cart": Checkout,
  "gs-address-map": AddressMap,
  "gs-address-add": AddAddress,
  "gs-confirmation": Confirmation,
  "gs-orders": MyOrders,
  "gs-order-details": OrderDetails,
};

export { ADDRESSES };
