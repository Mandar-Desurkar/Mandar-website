"use client";

// The product page of gausampurna.com (app/products/[id]), phone and desktop, as redesigned in the
// site's code in November 2026: ProductGallery, ProductInfo (title, rating, overview, USPs, pack and
// price, the prepaid offer strip, delivery and serviceability, Add to Cart ↔ stepper, Buy Now, trust
// row), YouMightLike, ProductDetailSections, ProductReviewsSection, ProductFaqSection and, on phones,
// the sticky ProductActionBar. Content is each product's own, from the live page (gsProducts.ts);
// images are the store's originals. Roboto throughout, as the site's .pdp-roboto.
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  BadgeCheck,
  BadgePercent,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Crosshair,
  Heart,
  Loader2,
  MapPin,
  Minus,
  Package,
  Plus,
  Search,
  Share2,
  Stethoscope,
  Truck,
  Users,
} from "lucide-react";
import type { ScreenProps } from "../kissan/KissanScreens";
import q from "./gsPdp.module.css";
import { PRODUCTS, cartActions, deliveryDate, img, inr, offPct, packLabel, perUnit, prepaid, productById, useCart, useDesktop, type Product } from "./gsData";
import { PRODUCT_CONTENT } from "./gsProducts";
import { AppStrip, BikeIcon, DesktopHeader, Footer, LimeStrip, Page, PageNav, cx, useNav } from "./GsShared";

// ---------- Small helpers ----------

// lib/withAmount.jsx: a sentence with "{amount}", the amount emphasised
const withAmount = (template: string, amount: string) => {
  const [before, after = ""] = template.split("{amount}");
  return (
    <>
      {before}
      <b className={q.amount}>{amount}</b>
      {after}
    </>
  );
};

// ProductDetailSections helpers: lines from stored text; how-to-use copy runs sentences together
const toLines = (text: string, sentences = false) =>
  String(text || "")
    .split(/\n+/)
    .flatMap((l) => (sentences ? l.split(/(?<=[.!?])\s*(?=[A-Z])/) : [l]))
    .map((l) => l.trim())
    .filter(Boolean);
const clean = (t: string) => String(t || "").replace(/[\s:]+$/, "").trim();

// shared/StarRating: gold fill in quarters, grey when empty
function StarRating({ rating, size, count = 5 }: { rating: number; size: number; count?: number }) {
  return (
    <span className={q.stars} aria-label={`${rating.toFixed(1)} out of 5`}>
      {Array.from({ length: count }, (_, i) => i).map((i) => {
        const fill = Math.max(0, Math.min(1, Math.round((rating - i) * 4) / 4));
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
            <defs>
              <linearGradient id={`st${i}-${Math.round(fill * 100)}`}>
                <stop offset={`${fill * 100}%`} stopColor="#f5b301" />
                <stop offset={`${fill * 100}%`} stopColor="#e5e7eb" />
              </linearGradient>
            </defs>
            <path fill={`url(#st${i}-${Math.round(fill * 100)})`} d="M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.54L12 17.5l-5.87 3.08 1.12-6.54L2.5 9.41l6.56-.95z" />
          </svg>
        );
      })}
    </span>
  );
}

// lib/useAttentionNudge.js: once the button is 60% on screen for 1.5s, grow-and-settle 3 × 0.9s;
// again after 10s if still unused; at most twice; never for reduced motion
function useNudge(enabled: boolean) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const runs = useRef(0);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    let visible = false;
    const play = () => {
      if (!visible || runs.current >= 2) return;
      runs.current += 1;
      setActive(true);
      timer = window.setTimeout(() => {
        setActive(false);
        timer = window.setTimeout(play, 10000);
      }, 2700);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.intersectionRatio >= 0.6;
        window.clearTimeout(timer);
        if (visible) timer = window.setTimeout(play, 1500);
      },
      { root: el.closest("[data-gs-scroll]"), threshold: [0, 0.6, 1] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [enabled]);
  return [ref, active && enabled] as const;
}

// Where the shopper said to deliver (the site keeps it in localStorage); null until they pick one
type Spot = { locality: string; district: string; state: string; pincode: string };
let savedSpot: Spot | null = null;
const SAMPLE_SPOT: Spot = { locality: "Maddur", district: "Mandya", state: "Karnataka", pincode: "571428" };

// ---------- Gallery (ProductGallery) ----------

function Gallery({ x, shots }: { x: Product; shots: string[] }) {
  const desktop = useDesktop();
  const [i, setI] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const go = (n: number) => {
    setI(n);
    const el = track.current;
    if (el) el.scrollTo({ left: n * el.clientWidth, behavior: "smooth" });
  };
  if (desktop) {
    return (
      <div className={q.dGallery}>
        <div className={q.dShot}>
          <img src={shots[i]} alt={`${x.name} - View ${i + 1}`} />
        </div>
        <div className={q.dThumbs} role="tablist">
          {shots.map((src, n) => (
            <button key={src} type="button" role="tab" aria-selected={n === i} className={cx(q.dThumb, n === i && q.dThumbOn)} onClick={() => setI(n)}>
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className={q.gallery}>
      <div className={q.slides} ref={track} onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
        {shots.map((src, n) => (
          <div key={src} className={q.slide} aria-hidden={n !== i}>
            <img src={src} alt={`${x.name} - View ${n + 1}`} />
          </div>
        ))}
      </div>
      <div className={q.shotBtns}>
        <span className={q.shotBtn}>
          <Heart size={16} />
        </span>
        <span className={q.shotBtn}>
          <Share2 size={16} />
        </span>
      </div>
      {shots.length > 1 && (
        <div className={q.thumbs}>
          {shots.map((src, n) => (
            <button key={src} type="button" className={cx(q.thumb, n === i && q.thumbOn)} onClick={() => go(n)} aria-label={`View ${n + 1}`}>
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- USPs (ProductUsps) ----------

// Two balanced lines per title, so every USP has the same height
function twoLines(title: string): [string, string] {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return [title, " "];
  let best = 1;
  let diff = Infinity;
  for (let k = 1; k < words.length; k++) {
    const d = Math.abs(words.slice(0, k).join(" ").length - words.slice(k).join(" ").length);
    if (d < diff) {
      diff = d;
      best = k;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

function Usps({ usps }: { usps: { title: string; image: string | null }[] }) {
  if (!usps.length) return null;
  return (
    <div className={q.usps}>
      {usps.map((u) => {
        const [a, b] = twoLines(u.title);
        return (
          <div key={u.title} className={q.usp}>
            <span className={q.uspCircle}>{u.image && <img src={u.image} alt={u.title} />}</span>
            <span className={q.uspTitle}>
              <span>{a}</span>
              <span>{b}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Product info (ProductInfo) ----------

function ProductInfo({ x, onAdd, onBuyNow, ctaRef }: { x: Product; onAdd: () => void; onBuyNow: () => void; ctaRef: (el: HTMLDivElement | null) => void }) {
  const nav = useNav();
  const c = PRODUCT_CONTENT[x.id];
  const { lines } = useCart();
  const qty = lines[x.id] ?? 0;
  const [expanded, setExpanded] = useState(false);
  const [spot, setSpot] = useState<Spot | null>(savedSpot);
  const [sheet, setSheet] = useState(false);
  const [bump, setBump] = useState(false);
  const [nudgeRef, nudging] = useNudge(qty === 0);
  const unit = perUnit(x.price, x.pack);
  const overview = c.overview;
  const joined = overview.join(" ");

  const step = (d: number) => {
    cartActions.setQty(x.id, Math.min(10, qty + d));
    setBump(true);
    window.setTimeout(() => setBump(false), 350);
  };
  const pick = (sp: Spot) => {
    savedSpot = sp;
    setSpot(sp);
    setSheet(false);
  };

  return (
    <div className={q.info}>
      <div>
        <h1 className={q.title}>{x.name}</h1>
        <button
          type="button"
          className={q.ratingBtn}
          onClick={() => document.getElementById("product-reviews")?.scrollIntoView({ behavior: "smooth", block: "start" })}
          aria-label={`Rated ${x.rating.toFixed(1)} out of 5, ${x.reviews} reviews. Go to reviews`}
        >
          <StarRating rating={x.rating} size={15} />
          <b>{x.rating.toFixed(1)}</b>
          <i aria-hidden="true">·</i>
          <span>{x.reviews.toLocaleString("en-IN")} reviews</span>
          <ChevronRight size={14} strokeWidth={2.5} />
        </button>
        {overview.length > 0 && (
          <div className={q.overview}>
            {expanded && overview.length > 1 ? (
              <ul className={q.checks}>
                {overview.map((l) => (
                  <li key={l}>
                    <Check size={16} strokeWidth={2.5} />
                    {l}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={cx(q.overviewText, !expanded && q.clamp2)}>{joined}</p>
            )}
            {(overview.length > 1 || joined.length > 90) && (
              <button type="button" className={q.seeMore} aria-expanded={expanded} onClick={() => setExpanded((v) => !v)}>
                {expanded ? "See less" : "See more"}
                <ChevronDown size={16} strokeWidth={2.5} className={expanded ? q.flip : undefined} />
              </button>
            )}
          </div>
        )}
      </div>

      <Usps usps={c.usps} />

      {/* One pack: a flat price panel */}
      <div className={q.pack}>
        <span className={q.packChip}>
          <Package size={16} strokeWidth={2.2} />
          {packLabel(x.pack)}
        </span>
        <div className={q.priceRow}>
          <span className={q.price}>₹{inr(x.price)}</span>
          {x.mrp > x.price && (
            <span className={q.mrp}>
              MRP <s>₹{inr(x.mrp)}</s>
            </span>
          )}
          <span className={q.off}>{offPct(x)}% off</span>
        </div>
        <p className={q.taxes}>
          {unit && (
            <span>
              ₹{unit.value}/{unit.unit} ·{" "}
            </span>
          )}
          Inclusive of all taxes
        </p>
      </div>

      {/* Online payment offer: the one highlighted thing on the page */}
      <div className={q.offer}>
        <span className={q.shine} aria-hidden="true" />
        <BadgePercent size={18} strokeWidth={2.4} className={q.offerBadge} />
        <p>{withAmount("Pay only {amount} with Online Payment", `₹${inr(prepaid(x.price))}`)}</p>
      </div>

      {/* Delivery */}
      <div className={q.delivery}>
        <p className={q.free}>
          <Truck size={16} strokeWidth={2} />
          <span>
            FREE delivery — all locations<span className={q.date}> · {deliveryDate()}</span>
          </span>
        </p>
        <p className={q.to}>
          <MapPin size={16} />
          <span>
            Delivering to {spot ? `${spot.locality} ${spot.pincode}` : "your location"} ·{" "}
            <button type="button" onClick={() => setSheet(true)}>
              Update location
            </button>
          </span>
        </p>
        {spot && (
          <p className={q.ok}>
            <Check size={16} strokeWidth={2.5} />
            Delivery available at {spot.pincode}
          </p>
        )}
      </div>

      {sheet && <LocationSheet onClose={() => setSheet(false)} onPick={pick} />}

      {/* Add to Cart ↔ stepper + Go to Cart */}
      <div id="pdp-primary-cta" ref={ctaRef} className={q.ctaRow}>
        {qty === 0 ? (
          <button type="button" ref={nudgeRef} className={cx(q.addBig, nudging && q.nudge)} onClick={onAdd}>
            <span className={q.bike}>
              <BikeIcon size={26} />
            </span>
            Add to Cart
          </button>
        ) : (
          <>
            <div className={q.stepBig}>
              <button type="button" onClick={() => step(-1)} aria-label={qty === 1 ? "Remove from cart" : "Decrease quantity"}>
                <Minus size={20} strokeWidth={2.5} />
              </button>
              <span className={bump ? q.pop : undefined}>{qty}</span>
              <button type="button" onClick={() => step(1)} disabled={qty >= 10} aria-label="Increase quantity">
                <Plus size={20} strokeWidth={2.5} />
              </button>
            </div>
            <button type="button" className={q.goCart} onClick={nav.cart}>
              <BikeIcon size={26} />
              Go to Cart
            </button>
          </>
        )}
      </div>
      <button type="button" className={q.buyNow} onClick={onBuyNow}>
        Buy Now
      </button>

      {/* Trust: three equal columns split by hairlines */}
      <ul className={q.trust}>
        <li>
          <span className={q.trustIcon}>
            <Users size={20} strokeWidth={2} />
          </span>
          <b>1,00,000+</b>
          <small>Farmers using</small>
        </li>
        <li>
          <span className={cx(q.trustIcon, q.trustImg)}>
            <img src={img("kmf.webp")} alt="" />
          </span>
          <b>KMF</b>
          <small>Certified</small>
        </li>
        <li>
          <span className={q.trustIcon}>
            <Stethoscope size={20} strokeWidth={2} />
          </span>
          <b>Vet</b>
          <small>Approved</small>
        </li>
      </ul>
    </div>
  );
}

// "Select Your Location": a bottom sheet on phones, a dialog on desktop
function LocationSheet({ onClose, onPick }: { onClose: () => void; onPick: (s: Spot) => void }) {
  const [query, setQuery] = useState("");
  const [locating, setLocating] = useState(false);
  const locate = () => {
    setLocating(true);
    window.setTimeout(() => onPick(SAMPLE_SPOT), 700);
  };
  const results = query.trim().length >= 3 ? [SAMPLE_SPOT] : [];
  return (
    <div className={q.sheetWrap}>
      <div className={q.sheetDim} onClick={onClose} />
      <div className={q.locSheet}>
        <div className={q.handle} />
        <h3>Select Your Location</h3>
        <button type="button" className={q.useLoc} onClick={locate} disabled={locating}>
          {locating ? <Loader2 size={20} className={q.spin} /> : <Crosshair size={20} />}
          {locating ? "Fetching location…" : "Use My Current Location"}
        </button>
        <div className={q.orRow}>
          <span />
          OR SEARCH MANUALLY
          <span />
        </div>
        <label className={q.locSearch}>
          <Search size={20} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter Village, Town, or Pincode" onKeyDown={(e) => e.key === "Escape" && onClose()} />
        </label>
        {results.length > 0 && (
          <div className={q.locResults}>
            {results.map((r) => (
              <button key={r.pincode} type="button" onClick={() => onPick(r)}>
                <b>
                  {r.locality} - {r.pincode}
                </b>
                <small>
                  {r.locality}, {r.district}, {r.state}, India
                </small>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- You may need this (YouMightLike) ----------

function MiniCard({ p, compact }: { p: Product; compact?: boolean }) {
  const nav = useNav();
  const { lines } = useCart();
  const inCart = (lines[p.id] ?? 0) > 0;
  const online = prepaid(p.price);
  return (
    <div className={cx(q.mini, compact && q.miniCompact)} role="link" tabIndex={0} onClick={() => nav.product(p.id)} onKeyDown={(e) => e.key === "Enter" && nav.product(p.id)}>
      <div className={q.miniShot}>
        <img src={p.image} alt={p.name} />
        <span className={q.miniOff}>{offPct(p)}% off</span>
      </div>
      <div className={q.miniBody}>
        <h4 className={compact ? q.clamp1 : q.clamp2}>{p.name}</h4>
        <div className={q.miniMeta}>
          <span className={q.miniPack}>{packLabel(p.pack)}</span>
          <span className={q.miniRating}>
            <StarRating rating={1} size={11} count={1} />
            <b>{p.rating.toFixed(1)}</b>({p.reviews.toLocaleString("en-IN")})
          </span>
        </div>
        <div className={q.miniPrice}>
          <span>₹{inr(p.price)}</span>
          <s>₹{inr(p.mrp)}</s>
        </div>
        {!compact && (
          <span className={q.miniOffer}>
            <BadgePercent size={14} strokeWidth={2.4} />
            Pay only ₹{inr(online)}
          </span>
        )}
        <button
          type="button"
          className={cx(q.miniAdd, inCart && q.miniAdded)}
          disabled={inCart}
          onClick={(e) => {
            e.stopPropagation();
            cartActions.add(p.id);
          }}
          aria-label={inCart ? `${p.name} is in your cart` : `Add ${p.name} to cart`}
        >
          {inCart ? (
            <>
              <Check size={16} strokeWidth={2.6} />
              Added
            </>
          ) : (
            <>
              <Plus size={16} strokeWidth={2.6} />
              Add
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function YouMightLike({ products, title = "You may need this", compact = false }: { products: Product[]; title?: string; compact?: boolean }) {
  if (!products.length) return null;
  const rail = (
    <div className={cx(q.rail, compact && q.railCompact)}>
      {products.slice(0, 4).map((p) => (
        <MiniCard key={p.id} p={p} compact={compact} />
      ))}
    </div>
  );
  if (compact) {
    return (
      <section className={q.ymlCompact}>
        <h2>{title}</h2>
        <div className={q.railWrap}>
          {rail}
          {products.length > 2 && <span className={q.railFade} aria-hidden="true" />}
        </div>
      </section>
    );
  }
  return (
    <section className={q.yml}>
      <h3>{title}</h3>
      {rail}
    </section>
  );
}

// ---------- Detail sections (ProductDetailSections) ----------

function Accordion({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className={q.acc}>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls={id}>
        <span>{title}</span>
        <ChevronDown size={20} className={open ? q.flip : undefined} />
      </button>
      {open && (
        <div id={id} className={q.accBody}>
          {children}
        </div>
      )}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  if (items.length === 1) return <p className={q.text}>{items[0]}</p>;
  return (
    <ul className={q.bullets}>
      {items.map((l) => (
        <li key={l}>
          <i />
          <span>{l}</span>
        </li>
      ))}
    </ul>
  );
}

function DetailSections({ x }: { x: Product }) {
  const c = PRODUCT_CONTENT[x.id];
  const litres = (d: string) => {
    const m = d.match(/(\d+(?:\.\d+)?)\s*L\s*\/\s*day/i);
    return m ? Number(m[1]) : null;
  };
  const dosages = c.dosages
    .map((d, i) => ({ d, i, l: litres(d.who) }))
    .sort((a, b) => (a.l !== null && b.l !== null ? a.l - b.l : a.l !== null ? -1 : b.l !== null ? 1 : a.i - b.i))
    .map(({ d }) => d);
  const realQty = (v: string) => v && !/^(na|n\/a|-|none)$/i.test(v);
  const withAmounts = c.ingredients.some((it) => realQty(it.qty));
  const description = toLines(c.description);
  return (
    <div className={q.sections}>
      {c.benefits.length > 0 && (
        <Accordion title="Key Features and Benefits" defaultOpen>
          <ul className={q.checkList}>
            {c.benefits.map((b) => (
              <li key={b}>
                <Check size={16} strokeWidth={2.6} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </Accordion>
      )}
      {dosages.length > 0 && (
        <Accordion title="Product Dosage Specification">
          <dl className={q.dose}>
            {dosages.map((d) => {
              const [main, ...notes] = toLines(d.dose);
              return (
                <div key={d.who}>
                  <dt>{clean(d.who)}</dt>
                  <dd>
                    {main && <b>{main}</b>}
                    {notes.map((n) => (
                      <small key={n}>{n}</small>
                    ))}
                  </dd>
                </div>
              );
            })}
          </dl>
        </Accordion>
      )}
      {c.howTo.length > 0 && (
        <Accordion title="How to Use?">
          <div className={q.howList}>
            {c.howTo.map((h) => {
              const steps = toLines(h.steps, true);
              return (
                <div key={h.title + h.steps}>
                  {h.image && <img src={h.image} alt="" loading="lazy" className={q.howImg} />}
                  {h.title && <p className={q.subTitle}>{h.title}</p>}
                  {steps.length > 1 ? (
                    <ol className={q.steps}>
                      {steps.map((st, n) => (
                        <li key={st}>
                          <i>{n + 1}</i>
                          <span>{st}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <Bullets items={steps} />
                  )}
                </div>
              );
            })}
          </div>
        </Accordion>
      )}
      {c.info.length > 0 && (
        <Accordion title="Additional Information">
          <div className={q.infoList}>
            {c.info.map((inf) => (
              <div key={inf.title + inf.content}>
                {inf.title && <p className={q.subTitleTight}>{inf.title}</p>}
                <Bullets items={toLines(inf.content)} />
              </div>
            ))}
          </div>
        </Accordion>
      )}
      {c.ingredients.length > 0 && (
        <Accordion title="Key Ingredients">
          {withAmounts ? (
            <>
              {c.ingredientsBasis && <p className={q.basis}>{c.ingredientsBasis}</p>}
              <dl className={q.ingTable}>
                {c.ingredients.map((it, n) => (
                  <div key={`${it.name}-${n}`}>
                    <dt>{it.name}</dt>
                    <dd>{realQty(it.qty) ? it.qty : "—"}</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : (
            <ul className={q.ingNames}>
              {c.ingredients.map((it, n) => (
                <li key={`${it.name}-${n}`}>
                  <i />
                  <span>{it.name}</span>
                </li>
              ))}
            </ul>
          )}
        </Accordion>
      )}
      {description.length > 0 && (
        <Accordion title="Product Description">
          <p className={q.subTitleTight}>About {x.name}</p>
          <Bullets items={description} />
        </Accordion>
      )}
    </div>
  );
}

// ---------- Reviews (ProductReviewsSection) ----------

function ReviewText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (el && !expanded) setOverflows(el.scrollHeight > el.clientHeight + 1);
  }, [text, expanded]);
  return (
    <div className={q.revTextWrap}>
      <p ref={ref} className={cx(q.revText, !expanded && q.clamp4)}>
        {text}
      </p>
      {(overflows || expanded) && (
        <button type="button" className={q.readMore} onClick={() => setExpanded((v) => !v)}>
          {expanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
}

const INITIAL_REVIEWS = 3;

function Reviews({ x }: { x: Product }) {
  const all = PRODUCT_CONTENT[x.id].reviews;
  const [shown, setShown] = useState(INITIAL_REVIEWS);
  const ref = useRef<HTMLElement>(null);
  if (!all.length) return null;
  // One critical (≤3★) review kept within the first three, as the site does
  const ordered = [...all];
  if (!ordered.slice(0, INITIAL_REVIEWS).some((r) => r.rating <= 3)) {
    const at = ordered.findIndex((r) => r.rating <= 3);
    if (at >= INITIAL_REVIEWS) ordered.splice(INITIAL_REVIEWS - 1, 0, ...ordered.splice(at, 1));
  }
  const visible = ordered.slice(0, shown);
  const remaining = Math.max(0, all.length - shown);
  return (
    <section ref={ref} id="product-reviews" className={q.reviews}>
      <div className={q.pad}>
        <h2>Top Customer Reviews</h2>
        <div className={q.revSummary}>
          <b>{x.rating.toFixed(1)}</b>
          <StarRating rating={x.rating} size={16} />
          <span>Based on {x.reviews.toLocaleString("en-IN")} Reviews</span>
        </div>
      </div>
      <div className={q.pad}>
        <div className={q.revList}>
          {visible.map((r, n) => {
            const where = [r.district, r.state].filter(Boolean).join(", ");
            return (
              <article key={`${r.name}-${n}`} className={q.review}>
                <div className={q.revHead}>
                  <span className={q.revAvatar} aria-hidden="true">
                    {r.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <div className={q.revNameRow}>
                      <p>{r.name}</p>
                      <StarRating rating={r.rating} size={13} />
                    </div>
                    {(r.verified || where) && (
                      <p className={q.revMeta}>
                        {r.verified && (
                          <span className={q.verified}>
                            <BadgeCheck size={14} strokeWidth={2.4} />
                            Verified
                          </span>
                        )}
                        {r.verified && where && <i aria-hidden="true">·</i>}
                        {where && (
                          <span className={q.where}>
                            <MapPin size={12} />
                            <span>{where}</span>
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
                {r.challenge && (
                  <p className={q.challenge}>
                    <b>Previous Challenge:</b> {r.challenge}
                  </p>
                )}
                {r.text && <ReviewText text={r.text} />}
              </article>
            );
          })}
        </div>
        {(remaining > 0 || shown > INITIAL_REVIEWS) && (
          <div className={q.moreWrap}>
            {remaining > 0 ? (
              <button type="button" className={q.loadMore} onClick={() => setShown((v) => v + 5)}>
                Load More ({remaining})
                <ChevronDown size={16} strokeWidth={2.5} />
              </button>
            ) : (
              <button
                type="button"
                className={q.showLess}
                onClick={() => {
                  setShown(INITIAL_REVIEWS);
                  ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Show Less
                <ChevronUp size={16} strokeWidth={2.5} />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// ---------- FAQ (ProductFaqSection) ----------

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className={q.faq}>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls={id}>
        <span>{question}</span>
        <ChevronDown size={16} className={open ? q.flip : undefined} />
      </button>
      {open && (
        <div id={id} className={q.faqA}>
          <Bullets items={toLines(answer)} />
        </div>
      )}
    </div>
  );
}

function Faqs({ x }: { x: Product }) {
  const items = PRODUCT_CONTENT[x.id].faqs;
  const [all, setAll] = useState(false);
  const ref = useRef<HTMLElement>(null);
  if (!items.length) return null;
  const visible = all ? items : items.slice(0, 4);
  const hidden = items.length - visible.length;
  return (
    <section ref={ref} id="product-faq" className={q.faqs}>
      <h2>FAQ</h2>
      <div className={q.faqList}>
        {visible.map((f) => (
          <FaqItem key={f.q} question={f.q} answer={f.a} />
        ))}
      </div>
      {items.length > 4 && (
        <div className={q.faqMore}>
          {hidden > 0 ? (
            <button type="button" className={q.loadMore} onClick={() => setAll(true)}>
              Load More ({hidden})
              <ChevronDown size={16} strokeWidth={2.5} />
            </button>
          ) : (
            <button
              type="button"
              className={q.showLess}
              onClick={() => {
                setAll(false);
                ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Show Less
              <ChevronUp size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>
      )}
    </section>
  );
}

// ---------- Phone action bar (ProductActionBar) ----------

function ActionBar({ x, visible, onAdd }: { x: Product; visible: boolean; onAdd: () => void }) {
  const nav = useNav();
  const { lines, count } = useCart();
  const qty = lines[x.id] ?? 0;
  const [justAdded, setJustAdded] = useState(false);
  const [bump, setBump] = useState(false);
  const prevQty = useRef(qty);
  const prevCount = useRef(count);
  const [nudgeRef, nudging] = useNudge(qty === 0 && visible);
  useEffect(() => {
    const added = prevQty.current === 0 && qty > 0;
    prevQty.current = qty;
    if (!added) return;
    setJustAdded(true);
    const id = window.setTimeout(() => setJustAdded(false), 1500);
    return () => window.clearTimeout(id);
  }, [qty]);
  useEffect(() => {
    const grew = count > prevCount.current;
    prevCount.current = count;
    if (!grew) return;
    setBump(true);
    const id = window.setTimeout(() => setBump(false), 360);
    return () => window.clearTimeout(id);
  }, [count]);
  const payOnline = prepaid(x.price * Math.max(qty, 1));
  return (
    <div className={q.bar} aria-hidden={!visible} inert={!visible || undefined} style={{ transform: visible ? "none" : "translateY(calc(100% + 64px))" }}>
      <div className={q.toastWrap} aria-live="polite">
        <span className={q.barToast} style={{ opacity: justAdded ? 1 : 0, transform: justAdded ? "none" : "translateY(8px)" }}>
          <Check size={14} strokeWidth={3} />
          {justAdded ? "Added to cart" : ""}
        </span>
      </div>
      <div className={q.barOfferWrap}>
        <div className={q.barOffer}>
          <span className={q.shine} aria-hidden="true" />
          <BadgePercent size={18} strokeWidth={2.4} className={q.offerBadge} />
          <span className={q.barOfferMain}>{withAmount("Pay only {amount}", `₹${inr(payOnline)}`)}</span>
          <span className={q.barOfferSub}>with Online Payment</span>
        </div>
      </div>
      <div className={q.barRow}>
        <div className={q.barPrice}>
          <div>
            <b>₹{inr(x.price)}</b>
            <s>₹{inr(x.mrp)}</s>
          </div>
          <div>
            <span className={q.barPack}>{packLabel(x.pack)}</span>
            <em>{offPct(x)}% off</em>
          </div>
        </div>
        <div className={q.barActions}>
          {qty === 0 ? (
            <button type="button" ref={nudgeRef} className={cx(q.barAdd, nudging && q.nudge)} onClick={onAdd} aria-label="Add to cart">
              {count > 0 ? (
                <>
                  <Plus size={18} strokeWidth={2.75} />
                  Add
                </>
              ) : (
                <>
                  <span className={q.bike}>
                    <BikeIcon size={26} />
                  </span>
                  Add to Cart
                </>
              )}
            </button>
          ) : (
            <div className={q.barStep} role="group" aria-label="Quantity">
              <button type="button" onClick={() => cartActions.setQty(x.id, qty - 1)} aria-label={qty === 1 ? "Remove from cart" : "Decrease quantity"}>
                <Minus size={18} strokeWidth={2.5} />
              </button>
              <span className={bump ? q.pop : undefined}>{qty}</span>
              <button type="button" onClick={() => cartActions.setQty(x.id, Math.min(10, qty + 1))} disabled={qty >= 10} aria-label="Increase quantity">
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>
          )}
          {count > 0 && (
            <button type="button" className={q.barCheckout} onClick={nav.cart} aria-label={`Checkout, ${count} item${count > 1 ? "s" : ""} in cart`}>
              <BikeIcon size={22} />
              Checkout
              <i className={bump ? q.pop : undefined}>{count > 99 ? "99+" : count}</i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- The page ----------

export function GsProduct(props: ScreenProps) {
  const desktop = useDesktop();
  const nav = useNav(props);
  const { viewing } = useCart();
  const x = productById(viewing);
  const c = PRODUCT_CONTENT[x.id];
  const shots = c.gallery.length ? c.gallery : [x.image];
  const others = PRODUCTS.filter((o) => o.id !== x.id).slice(0, 4);
  // The sticky bar hides while the in-page Add to Cart row is on screen, so there is never two
  const [cta, setCta] = useState<HTMLDivElement | null>(null);
  const [ctaOnScreen, setCtaOnScreen] = useState(true);
  useEffect(() => {
    if (!cta) return;
    const io = new IntersectionObserver(([e]) => setCtaOnScreen(e.isIntersecting), { root: cta.closest("[data-gs-scroll]") });
    io.observe(cta);
    return () => io.disconnect();
  }, [cta]);

  const add = () => cartActions.add(x.id);
  const buyNow = () => nav.buyNow(x.id);

  const right = (
    <>
      <ProductInfo x={x} onAdd={add} onBuyNow={buyNow} ctaRef={setCta} />
      <YouMightLike products={others} />
      <DetailSections x={x} />
      <Reviews x={x} />
      <Faqs x={x} />
    </>
  );

  if (desktop) {
    return (
      <Page nav={props} font="roboto">
        <DesktopHeader />
        <main className={q.dMain}>
          <div className={q.dCols}>
            <div className={q.dLeft}>
              <Gallery x={x} shots={shots} />
            </div>
            <div className={q.dRight}>{right}</div>
          </div>
        </main>
        <Footer />
      </Page>
    );
  }

  return (
    <Page nav={props} font="roboto" bottom={<ActionBar x={x} visible={!ctaOnScreen} onAdd={add} />}>
      <AppStrip />
      <PageNav title={x.name} eyebrow="PRODUCT DETAILS" active="products" />
      <LimeStrip />
      <main className={q.main}>
        <Gallery x={x} shots={shots} />
        <div className={q.mCol}>{right}</div>
      </main>
      <Footer />
    </Page>
  );
}
