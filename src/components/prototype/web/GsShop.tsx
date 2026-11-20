"use client";

// Products list (app/(products)/products, Inter) of gausampurna.com, phone and desktop. The product
// page is GsPdp.tsx.
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Phone } from "lucide-react";
import type { ScreenProps } from "../kissan/KissanScreens";
import p from "./gsShop.module.css";
import { CATEGORIES, PHONE, PRODUCTS, img, inr, productById, useCart, useDesktop } from "./gsData";
import { BikeIcon, DesktopHeader, Footer, LimeStrip, Page, PageNav, ProductRow, ProductTile, WhatsAppFab, cx, useNav } from "./GsShared";

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
