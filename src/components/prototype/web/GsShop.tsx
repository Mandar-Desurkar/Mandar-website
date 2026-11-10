"use client";

// Products list (app/(products)/products, Inter) and the product page (app/(products)/product-details,
// Roboto) of gausampurna.com, phone and desktop. The product page carries Dairy Fortune's full
// content from the live site; other products show their own name, pack, price and image.
import { useEffect, useState, type ReactNode } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Heart, MapPin, Phone, Plus, Share2, Star, Tag, Truck } from "lucide-react";
import type { ScreenProps } from "../kissan/KissanScreens";
import s from "./gsWeb.module.css";
import p from "./gsShop.module.css";
import { CATEGORIES, PHONE, PRODUCTS, cartActions, img, inr, offPct, prepaid, productById, useCart, useDesktop } from "./gsData";
import {
  AppStrip,
  BikeIcon,
  DeliveryDate,
  DesktopHeader,
  Footer,
  LimeStrip,
  Page,
  PageNav,
  ProductRow,
  ProductTile,
  Stars,
  Stepper,
  WhatsAppFab,
  cx,
  useNav,
} from "./GsShared";

// ---------- Products ----------

const PROMOS = [
  { big: "1L+", rest: "Farmers Using" },
  { big: "From ₹190", rest: "Starting At" },
  { big: "15+ days", rest: "Avg Results" },
];

export function GsProducts(props: ScreenProps) {
  const desktop = useDesktop();
  const [cat, setCat] = useState(-1);
  const [promo, setPromo] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPromo((n) => (n + 1) % PROMOS.length), 3000);
    return () => clearInterval(t);
  }, []);

  if (desktop) {
    return (
      <Page nav={props} overlay={<WhatsAppFab />}>
        <DesktopHeader />
        <main className={p.dProducts}>
          <h1>Products</h1>
          <div className={p.dChips}>
            {["All", ...CATEGORIES.map((c) => c.name)].map((c, n) => (
              <button key={c} type="button" className={cx(p.dChip, cat === n - 1 && p.dChipOn)} onClick={() => setCat(n - 1)}>
                {c}
              </button>
            ))}
          </div>
          <h2>Explore By Categories</h2>
          <div className={p.dCatGrid}>
            {CATEGORIES.map((c, n) => (
              <button key={c.name} type="button" className={p.dCatCard} onClick={() => setCat(n)}>
                <b>{c.name}</b>
                <img src={c.image} alt="" />
              </button>
            ))}
          </div>
          <p className={p.showing}>Showing {PRODUCTS.length} products</p>
          <div className={p.dGrid}>
            {PRODUCTS.map((x) => (
              <ProductTile key={x.id} p={x} />
            ))}
          </div>
        </main>
        <Footer />
      </Page>
    );
  }

  return (
    <Page nav={props} bottom={<FloatingCart />}>
      <LimeStrip />
      <PageNav title="Products" />
      <div className={p.catStrip}>
        {CATEGORIES.map((c, n) => (
          <button key={c.name} type="button" className={cx(p.catCircle, cat === n && p.catCircleOn)} onClick={() => setCat(cat === n ? -1 : n)}>
            <span>
              <img src={c.image} alt="" />
            </span>
            {c.name}
          </button>
        ))}
      </div>
      <div className={p.listWrap}>
        <div className={p.promo}>
          <button type="button" onClick={() => setPromo((promo + PROMOS.length - 1) % PROMOS.length)} aria-label="Previous">
            <ChevronLeft size={20} />
          </button>
          <p>
            <b>{PROMOS[promo].big}</b> {PROMOS[promo].rest}
          </p>
          <button type="button" onClick={() => setPromo((promo + 1) % PROMOS.length)} aria-label="Next">
            <ChevronRight size={20} />
          </button>
        </div>
        {PRODUCTS.map((x) => (
          <ProductRow key={x.id} p={x} />
        ))}
        <div className={p.trustTriple}>
          <span>
            <i className={p.leaf}>❦</i>
            <b>100%</b> Organic
          </span>
          <span>
            <i>👨🏻‍⚕️</i>
            <b>Vet</b> Approved
          </span>
          <span>
            <img src={img("kmf.webp")} alt="" />
            <b>KMF</b> Certified
          </span>
        </div>
        <div className={p.decide}>
          <h3>
            Cannot decide which one to buy? <span className={p.available}>Available</span>
          </h3>
          <p>We&apos;ll suggest the right product based on your cow&apos;s age, breed, and milk yield.</p>
          <span className={p.decideBtn}>
            <Phone size={18} /> Call {PHONE}
          </span>
        </div>
      </div>
      <Footer />
    </Page>
  );
}

// Phone: a bar that appears once something is in the cart (mobile/CartFloatingBar.jsx)
function FloatingCart() {
  const nav = useNav();
  const { count, lines } = useCart();
  if (count === 0) return null;
  const total = Object.entries(lines).reduce((a, [id, q]) => a + productById(id).price * q, 0);
  return (
    <button type="button" className={p.floatCart} onClick={nav.cart}>
      <span>
        <b>
          {count} {count > 1 ? "Items" : "Item"}
        </b>
        <small>₹{inr(total)}</small>
      </span>
      <span className={p.floatCta}>
        <BikeIcon size={18} /> View Cart <ChevronRight size={16} />
      </span>
    </button>
  );
}

// ---------- Product page ----------

const DF_GALLERY = [img("p-dairy-fortune.webp"), img("df-2.webp"), img("df-3.webp"), img("df-4.webp"), img("df-5.webp")];
const DF_BENEFITS = [
  { label: "Higher Fat & SNF", src: img("b-fat-snf.webp") },
  { label: "Better Digestion", src: img("b-digestion.webp") },
  { label: "Strong Immunity", src: img("b-immunity.webp") },
  { label: "Successsful Insemination", src: img("b-insemination.webp") },
  { label: "More Milk", src: img("b-more-milk.webp") },
];
const DF_FEATURES = [
  "Improves body condition score (BCS), enhances coat shine, and prevents hoof-related problems.",
  "Optimizes feed intake, reduces bad vices, and controls aflatoxin levels in milk.",
  "Enhances milk production, improving milk fat percentage and SNF levels.",
  "Supports reproductive health by preventing repeat breeding and boosting conception rates.",
  "Prevents subclinical and clinical mastitis, promoting udder health.",
];
const DF_DOSAGE = [
  ["Calves", "25–50 grams/day"],
  ["Non-Breeding Heifers", "100 grams/day"],
  ["Breeding Heifers", "200 grams/day"],
  ["Dairy Cows/Buffalo", "100–150 grams/day"],
  ["Cows/Buffaloes (10L/day)", "300–350 grams/day"],
  ["Cows/Buffaloes (15L/day)", "350–400 grams/day"],
  ["Cows Producing 20L/day", "400–500 grams/day"],
  ["Above 20L Milk", "+100 grams/day for every extra 5L"],
];
const DF_INGREDIENTS = ["Vitamin A", "Vitamin D3", "Vitamin E", "Beta Carotene", "Biotin", "Cobalt", "Copper", "Selenium", "Calcium", "Phosphorus", "Herbal Rumino toric", "Myco-Toxin Binder", "RP-Lysine & Metheonine", "Liver Tonic & Liver Health Booster", "Natural Bypass Fat & Protein", "Rumen Buffers"];
const DF_REVIEWS = [
  { name: "Ramesh Naik", place: "Uttara Kannada, Karnataka", before: "Repeat breeding problem.", text: "Dairy Fortune supported better breeding health and helped reduce repeat breeding issues.", stars: 4 },
  { name: "Geetha M", place: "Hassan, Karnataka", before: "Fluctuating milk yield.", text: "After feeding Dairy Fortune, my cow’s milk production became more consistent.", stars: 4 },
  { name: "Prakash Gowda", place: "Mysuru, Karnataka", before: "Poor feed intake.", text: "The product helped improve feed intake and overall performance of my dairy animals.", stars: 5 },
];

export function GsProduct(props: ScreenProps) {
  const desktop = useDesktop();
  const nav = useNav(props);
  const { viewing, lines, count } = useCart();
  const x = productById(viewing);
  const isDF = x.id === "dairy-fortune";
  const gallery = isDF ? DF_GALLERY : [x.image];
  const [shot, setShot] = useState(0);
  const [open, setOpen] = useState<string>("desc");
  const [toast, setToast] = useState(false);
  const qty = lines[x.id] ?? 0;
  const others = PRODUCTS.filter((o) => o.id !== x.id).slice(0, 4);

  const add = () => {
    cartActions.add(x.id);
    setToast(true);
    window.setTimeout(() => setToast(false), 1600);
  };
  const buyNow = () => {
    if (!qty) cartActions.add(x.id);
    props.next();
  };

  const sections: { id: string; title: string; body: ReactNode }[] = isDF
    ? [
        { id: "features", title: "Key Features and Benefits", body: <ul className={p.bullets}>{DF_FEATURES.map((f) => <li key={f}>{f}</li>)}</ul> },
        {
          id: "desc",
          title: "Product Description",
          body: (
            <>
              <h4 className={p.aboutTitle}>About Dairy Fortune</h4>
              <ul className={p.bullets}>
                <li>Dairy Fortune is a complete feed supplement designed for all stages of a cow&apos;s lifecycle—calf, heifer, milking, pregnant, and dry cows. Enriched with cow-specific minerals, essential vitamins, liver tonics, rumenotorics, toxin binders, and natural bypass fat and protein, it fulfills micronutrient needs, enhances milk production and quality, and supports optimal breeding health.</li>
              </ul>
            </>
          ),
        },
        {
          id: "dose",
          title: "Product Dosage Specification",
          body: (
            <dl className={p.dose}>
              {DF_DOSAGE.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          ),
        },
        { id: "how", title: "How to Use?", body: <ul className={p.bullets}><li>Add Dairy Fortune to regular cattle feed or concentrate feed.</li><li>Mix thoroughly to ensure even distribution.</li><li>Provide it during regular feeding times.</li></ul> },
        { id: "info", title: "Additional Information", body: <ul className={p.bullets}><li>Feed the full dose once daily, preferably in the morning after milking, or split it between the morning and evening milking.</li><li>Always provide fresh, clean drinking water alongside Dairy Fortune feeding.</li><li>Introduce Dairy Fortune gradually if feeding it for the first time, over 3–5 days.</li></ul> },
        { id: "ing", title: "Key Ingredients", body: <div className={p.ingredients}>{DF_INGREDIENTS.map((i) => <span key={i}>{i}</span>)}</div> },
        { id: "faq", title: "FAQ", body: <ul className={p.faqQs}>{["What is Dairy Fortune?", "Can Dairy Fortune improve milk fat and SNF content?", "How does Dairy Fortune improve milk yield?", "Is Dairy Fortune safe for all stages of cows and buffaloes?", "Does Dairy Fortune contain any harmful chemicals or antibiotics?"].map((q) => <li key={q}>{q}<Plus size={16} /></li>)}</ul> },
      ]
    : [{ id: "desc", title: "Product Description", body: <p className={p.plain}>{x.claim}.</p> }];

  const gallerySection = (
    <div className={p.gallery}>
      <div className={p.mainShot}>
        <img src={gallery[shot]} alt={`${x.name} - View ${shot + 1}`} />
        <span className={p.roundBtn} style={{ top: 12 }}>
          <Heart size={18} />
        </span>
        <span className={p.roundBtn} style={{ top: 58 }}>
          <Share2 size={17} />
        </span>
      </div>
      {gallery.length > 1 && (
        <div className={p.thumbs}>
          {gallery.map((g, n) => (
            <button key={g} type="button" className={cx(p.thumb, n === shot && p.thumbOn)} onClick={() => setShot(n)} aria-label={`View ${n + 1}`}>
              <img src={g} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const buyBox = (
    <div className={p.buyBox}>
      <h1 className={p.pName}>{x.name}</h1>
      <span className={p.seeMore}>
        See more <ChevronDown size={16} />
      </span>
      <p className={p.pRating}>
        <Stars rating={x.rating} size={desktop ? 13 : 19} /> <b>{x.rating}</b> <u>({x.reviews} reviews)</u>
      </p>
      {isDF && (
        <div className={p.benefits}>
          {DF_BENEFITS.map((b) => (
            <span key={b.label}>
              <img src={b.src} alt="" />
              {b.label}
            </span>
          ))}
        </div>
      )}
      <div className={p.packs}>
        <div className={p.packCard}>
          <b>{x.pack}</b>
          <strong>₹{x.price}</strong>
          <small>
            MRP <s>₹{x.mrp}</s> <em>{offPct(x)}% off</em>
          </small>
          <small className={p.inStock}>In Stock</small>
        </div>
        {!desktop && (
          <div className={p.prepaidCard}>
            Pay ₹{inr(prepaid(x.price))} only
            <span>10% off with</span>
            <i>Online Payment</i>
          </div>
        )}
      </div>
      {desktop && (
        <div className={p.dOffer}>
          <span className={p.dOfferIcon}>
            <Tag size={16} />
          </span>
          <div>
            <b>
              10% OFF <i>PREPAID OFFER</i>
            </b>
            <small>Pay only ₹{inr(prepaid(x.price))} with Online Payment</small>
          </div>
        </div>
      )}
      <p className={p.delivery}>
        <Truck size={20} />
        <span>
          <b>FREE delivery — all locations</b> · <DeliveryDate />
        </span>
      </p>
      <p className={p.location}>
        <MapPin size={16} /> Delivering to your location · <u>Update location</u>
      </p>
      <button type="button" className={p.bigAdd} onClick={add}>
        <BikeIcon size={22} /> Add to Cart
      </button>
      <button type="button" className={p.buyNow} onClick={buyNow}>
        Buy Now
      </button>
      <div className={p.trust3}>
        <span>
          <i>🐄</i>
          <b>1,00,000+</b>
          Farmers using
        </span>
        <span>
          <img src={img("kmf.webp")} alt="" />
          <b>KMF</b>
          Certified
        </span>
        <span>
          <i>👨🏻‍⚕️</i>
          <b>Vet</b>
          Approved
        </span>
      </div>
    </div>
  );

  const details = (
    <>
      <section className={p.mayNeed}>
        <h2>You may need this</h2>
        <div className={p.mayRow}>
          {others.map((o) => (
            <ProductTile key={o.id} p={o} compact />
          ))}
        </div>
      </section>
      <section className={p.accs}>
        {sections.map((sec) => (
          <div key={sec.id} className={p.pAcc}>
            <button type="button" onClick={() => setOpen(open === sec.id ? "" : sec.id)} aria-expanded={open === sec.id}>
              {sec.title}
              <ChevronDown size={20} className={cx(p.chev, open === sec.id && p.chevUp)} />
            </button>
            {open === sec.id && <div className={p.pAccBody}>{sec.body}</div>}
          </div>
        ))}
      </section>
      {isDF && (
        <section className={p.reviews}>
          <h2>Top Customer Reviews</h2>
          <div className={p.revRow}>
            {DF_REVIEWS.map((r) => (
              <article key={r.name} className={p.review}>
                <header>
                  <span className={p.revAvatar}>{r.name[0]}</span>
                  <span>
                    <b>{r.name}</b>
                    <small>
                      <MapPin size={12} /> {r.place}
                    </small>
                  </span>
                  <span className={p.revStars}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} size={13} fill="currentColor" strokeWidth={0} className={n <= r.stars ? s.starOn : s.starOff} />
                    ))}
                  </span>
                </header>
                <p className={p.challenge}>
                  <b>Previous Challenge</b>
                  {r.before}
                </p>
                <p>{r.text}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );

  const bottomBar = (
    <div className={p.pdpBar}>
      <span className={p.pdpBarPrice}>
        <b>
          ₹{x.price} <em>{offPct(x)}% off</em>
        </b>
        <small>
          <s>₹{x.mrp}</s> {x.pack}
        </small>
      </span>
      {qty > 0 ? (
        <Stepper id={x.id} qty={qty} solid />
      ) : (
        <button type="button" className={p.barAdd} onClick={add}>
          <Plus size={18} /> Add
        </button>
      )}
      <button type="button" className={p.barCheckout} onClick={() => (count ? nav.cart() : add())}>
        <BikeIcon size={18} /> Checkout
      </button>
    </div>
  );

  const toastEl = toast ? <div className={p.toast}>Added to cart</div> : null;

  if (desktop) {
    return (
      <Page nav={props} font="roboto" overlay={toastEl}>
        <DesktopHeader />
        <main className={p.dPdp}>
          <div className={p.dPdpLeft}>{gallerySection}</div>
          <div className={p.dPdpRight}>
            {buyBox}
            {details}
          </div>
        </main>
        <Footer />
      </Page>
    );
  }

  return (
    <Page
      nav={props}
      font="roboto"
      bottom={bottomBar}
      overlay={toastEl}
    >
      <AppStrip />
      <PageNav title={x.name} eyebrow="PRODUCT DETAILS" />
      <LimeStrip />
      {gallerySection}
      <div className={p.mBody}>
        {buyBox}
        {details}
      </div>
      <Footer />
    </Page>
  );
}
