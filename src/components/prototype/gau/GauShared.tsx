/* eslint-disable @next/next/no-img-element -- fixed-size mock screens inside a phone frame */
"use client";

// Shared Gau Sampurna prototype UI, from the `prod` branch: TenantTabBar + TabButton (Gau Swastha's
// 5-tab layout with the prominent Scan button), the back-circle top bar, bottom sheet, alert, toast
// and the product card used on Home, Shop and product pages.
import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { ArrowLeft, Minus, Plus, Star } from "lucide-react";
import u from "./gauShared.module.css";
import type { ScreenProps } from "../kissan/KissanScreens";
import { HomeIcon, ProductsIcon, ReportsIcon, ScannerIcon, TradingIcon } from "./GauIcons";

export { u };

export const gimg = (file: string) => `/prototypes/gau-sampurna/${file}`;

export type GauTab = "home" | "herd" | "scan" | "shop" | "reports" | "trading";

function CowIcon({ size = 24 }: { size?: number }) {
  return <span className={u.cowMask} style={{ width: size + 4, height: size }} aria-hidden="true" />;
}

const TABS: { key: GauTab; label: string; Icon: ComponentType<{ size?: number; color?: string }>; flow: string; screen?: string }[] = [
  { key: "home", label: "Home", Icon: HomeIcon, flow: "gs-home" },
  { key: "herd", label: "Herd", Icon: CowIcon, flow: "gs-herd" },
  { key: "scan", label: "Scan", Icon: ScannerIcon, flow: "disease-check" },
  { key: "shop", label: "Shop", Icon: ProductsIcon, flow: "gs-shop" },
  { key: "trading", label: "Trading", Icon: TradingIcon, flow: "gs-trading" },
];

// When the delivery pincode isn't serviceable, TenantTabBar swaps the Shop tab for Reports
const REPORTS_TAB = { key: "reports" as const, label: "Reports", Icon: ReportsIcon, flow: "gs-history", screen: "gs-reports" };

export function GauTabBar({ active, goToFlow, reports }: { active?: GauTab; goToFlow: ScreenProps["goToFlow"]; reports?: boolean }) {
  const tabs = reports ? TABS.map((t) => (t.key === "shop" ? REPORTS_TAB : t)) : TABS;
  return (
    <nav className={u.tabBar} aria-label="App tabs">
      {tabs.map(({ key, label, Icon, flow, screen }) =>
        key === "scan" ? (
          <button key={key} type="button" className={`${u.btnReset} ${u.tab}`} onClick={() => goToFlow(flow)} aria-label="Scan">
            <span className={u.scanCircle}>
              <Icon size={24} color="#fff" />
            </span>
          </button>
        ) : (
          <button
            key={key}
            type="button"
            className={`${u.btnReset} ${u.tab} ${key === active ? u.tabActive : ""}`}
            onClick={key === active ? undefined : () => goToFlow(flow, screen)}
            aria-current={key === active ? "page" : undefined}
          >
            <Icon size={22} />
            {label}
          </button>
        )
      )}
    </nav>
  );
}

export function GauTopBar({ title, onBack, right }: { title: string; onBack?: () => void; right?: ReactNode }) {
  return (
    <div className={u.topBar}>
      <button type="button" className={`${u.btnReset} ${u.backBtn}`} onClick={onBack} aria-label="Back">
        <ArrowLeft size={16} />
      </button>
      <span className={u.topTitle}>{title}</span>
      <span className={u.topSpacer}>{right}</span>
    </div>
  );
}

export function GauSheet({ children, onClose, label }: { children: ReactNode; onClose: () => void; label: string }) {
  return (
    <div className={u.overlay} onClick={onClose} role="presentation">
      <div className={u.sheet} role="dialog" aria-label={label} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function GauAlert({
  title,
  message,
  actions,
}: {
  title: string;
  message?: ReactNode;
  actions: { label: string; onPress: () => void; primary?: boolean }[];
}) {
  return (
    <div className={u.center} role="presentation">
      <div className={u.alert} role="alertdialog" aria-label={title}>
        <b>{title}</b>
        {message && <p>{message}</p>}
        <div className={u.alertActions}>
          {actions.map((a) => (
            <button key={a.label} type="button" className={`${u.btnReset} ${a.primary ? u.primary : u.secondary}`} style={{ minHeight: 42, fontSize: 14 }} onClick={a.onPress}>
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function useToast(ms = 1800) {
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    if (!text) return;
    const t = setTimeout(() => setText(null), ms);
    return () => clearTimeout(t);
  }, [text, ms]);
  const node = text ? (
    <span className={u.toast} role="status">
      {text}
    </span>
  ) : null;
  return { show: setText, node };
}

// Catalogue from the app's own product data (assets/data/product.js) plus the vet-pick packs
export type Product = { id: string; title: string; desc: string; variant: string; price: number; mrp: number; rating: number; reviews: number; image: string };

export const PRODUCTS: Product[] = [
  { id: "dairy-fortune", title: "Dairy Fortune", desc: "Cow Supplementary feed", variant: "10 kg", price: 2340, mrp: 3000, rating: 3.7, reviews: 9, image: "prod-dairy-fortune.webp" },
  { id: "bio-bloom", title: "Bio Bloom", desc: "Udder & teat care", variant: "500 ml", price: 449, mrp: 560, rating: 4.4, reviews: 128, image: "prod-bio-bloom.webp" },
  { id: "nitro-power", title: "Nitro Power", desc: "Energy for milking cows", variant: "1 kg", price: 690, mrp: 850, rating: 4.2, reviews: 86, image: "prod-nitro-power.webp" },
  { id: "micro-nutri", title: "Micro Nutri", desc: "Mineral mixture", variant: "1 kg", price: 299, mrp: 380, rating: 4.5, reviews: 212, image: "prod-micro-nutri.webp" },
  { id: "immune-fortune", title: "Immune Fortune", desc: "Animal immunity booster", variant: "500 ml", price: 2340, mrp: 3000, rating: 3.7, reviews: 9, image: "prod-generic.webp" },
];

export const rupee = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function ProductCard({ p, onOpen, hint }: { p: Product; onOpen?: () => void; hint?: boolean }) {
  const [qty, setQty] = useState(0);
  const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
  return (
    <div className={`${u.productCard} ${hint ? u.hotspot : ""}`}>
      <button type="button" className={`${u.btnReset} ${u.productImg}`} onClick={onOpen} aria-label={p.title}>
        <span className={u.offBadge}>{off}% off</span>
        <img src={gimg(p.image)} alt="" />
      </button>
      <div className={u.productBody}>
        <span className={u.descPill}>{p.desc}</span>
        <span className={u.productTitle}>{p.title}</span>
        <span className={u.rating}>
          <Star size={14} color="#EAA208" />
          {p.rating.toFixed(1)} <small>({p.reviews})</small>
        </span>
        <span className={u.weight}>{p.variant}</span>
        <span className={u.priceRow}>
          <span className={u.price}>{rupee(p.price)}</span>
          <span className={u.mrp}>{rupee(p.mrp)}</span>
        </span>
        {qty > 0 ? (
          <span className={u.stepper}>
            <button type="button" className={u.btnReset} onClick={() => setQty((q) => q - 1)} aria-label="Remove one">
              <Minus size={16} />
            </button>
            {qty}
            <button type="button" className={u.btnReset} onClick={() => setQty((q) => q + 1)} aria-label="Add one">
              <Plus size={16} />
            </button>
          </span>
        ) : (
          <button type="button" className={`${u.btnReset} ${u.addBtn}`} onClick={() => setQty(1)}>
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}
