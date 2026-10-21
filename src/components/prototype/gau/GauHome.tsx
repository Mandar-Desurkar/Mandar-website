/* eslint-disable @next/next/no-img-element -- fixed-size mock screens inside a phone frame */
"use client";

// Gau Sampurna Home, recreated from the `prod` branch: gau-swastha-tenant/home/home-screen-gau-swastha.jsx
// and its live sections (home-header, health-alert-banner + 2-step symptom check, quick-action-buttons,
// my-herd-section, recommended-for-you-section, recent-scans-section, home-products-section with
// explore-dairy-supplies, category-content-banner and products/ParentProductCard). The category strip,
// stats banner and product row are exported for the Shop tab. Herd and scan values are samples.
import { useEffect, useState, type ComponentType } from "react";
import {
  ArrowUpRight,
  Bell,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplets,
  LayoutGrid,
  MapPin,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Star,
  TriangleAlert,
  User,
  X,
} from "lucide-react";
import h from "./gauHome.module.css";
import { GauSheet, GauTabBar, PRODUCTS, ProductCard, gimg, rupee, u, useToast, type Product } from "./GauShared";
import type { ScreenProps } from "../kissan/KissanScreens";

// ---------- Explore Dairy Supplies + stats banner + ParentProductCard (shared with Shop) ----------

export const CATEGORIES = [
  { id: "increase-milk", label: "Increase\nMilk", bg: "#F7E6D8", stats: ["Boost daily milk by 15–25% with science-backed nutrition.", "From ₹1400 Start Trial", "15+ days Avg Results", "1L+ Farmers Using"] },
  { id: "pre-delivery-care", label: "Pre-Delivery\nCare", bg: "#E8F3E9", stats: ["Prepare your cow for a safe calving.", "From ₹450 Start Trial", "15+ days Avg Results"] },
  { id: "cattle-health", label: "Cattle\nHealth", bg: "#F7E8E1", stats: ["Protect your herd from heat stress and seasonal disease.", "From ₹450 Start Trial", "9,500+ Farmers Using"] },
  { id: "udder-care", label: "Udder\nCare", bg: "#E7F0E8", stats: ["Prevent mastitis with pre- and post-milking hygiene.", "From ₹400 Start Trial", "8,000+ Farmers Using"] },
  { id: "calf-nutrition", label: "Calf\nNutrition", bg: "#EAF2F7", stats: ["Strong calves grow into productive cows."] },
  { id: "weakness-care", label: "Weakness\nCare", bg: "#F3E8F7", stats: ["Restore energy after illness or calving."] },
  { id: "summer-problem", label: "Summer\nProblem", bg: "#E9F4F1", stats: ["Beat heat stress in peak summer."] },
  { id: "mastitis-free", label: "Mastitis\nFree", bg: "#F2EFE8", stats: ["Keep udders healthy and milk clean."] },
];

const ALL_STATS = ["Science-backed nutrition for every stage", "From ₹190 Starting at", "1L+ Farmers Using"];

export function CategoryStrip({ selected, onSelect }: { selected: string | null; onSelect: (id: string | null) => void }) {
  return (
    <div>
      <p className={h.catTitle}>Explore Dairy Supplies</p>
      <div className={u.hScroll}>
        <button type="button" className={`${u.btnReset} ${h.cat} ${!selected ? h.catOn : ""}`} style={{ background: "#F0F4F9" }} onClick={() => onSelect(null)}>
          <span className={h.allIcon}>
            <LayoutGrid size={36} />
          </span>
          {"All\nCategories"}
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`${u.btnReset} ${h.cat} ${selected === c.id ? h.catOn : ""}`}
            style={{ background: c.bg }}
            onClick={() => onSelect(c.id)}
          >
            <img src={gimg(`cat-${c.id}.webp`)} alt="" />
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function StatBanner({ category }: { category: string | null }) {
  const tiles = (category && CATEGORIES.find((c) => c.id === category)?.stats) || ALL_STATS;
  const [i, setI] = useState(0);
  // Auto-advances every 3.2s, like the app; arrows step manually
  useEffect(() => {
    const t = setInterval(() => setI((n) => n + 1), 3200);
    return () => clearInterval(t);
  }, []);
  const text = tiles[i % tiles.length];
  const m = text.match(/^(From ₹[\d,]+|[\d,.]+L?\+?(?: days)?)\s(.+)$/);
  return (
    <div className={h.statBanner}>
      <button type="button" className={u.btnReset} onClick={() => setI((n) => n + tiles.length - 1)} aria-label="Previous">
        <ChevronLeft size={24} />
      </button>
      <span className={h.statText}>
        {m ? (
          <>
            <b>{m[1]}</b> {m[2]}
          </>
        ) : (
          text
        )}
      </span>
      <button type="button" className={u.btnReset} onClick={() => setI((n) => n + 1)} aria-label="Next">
        <ChevronRight size={24} />
      </button>
    </div>
  );
}

const DELIVERY = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 4);
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
})();

export function ProductRow({ p, onOpen, hint }: { p: Product; onOpen: () => void; hint?: boolean }) {
  const [qty, setQty] = useState(0);
  const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
  return (
    <div className={`${h.pRow} ${hint ? u.hotspot : ""}`}>
      <button type="button" className={`${u.btnReset} ${h.pImgCol}`} onClick={onOpen} aria-label={p.title}>
        <img className={h.verified} src={gimg("verified-badge.webp")} alt="GS Verified" />
        <img className={h.pImg} src={gimg(p.image)} alt="" />
        <span className={h.variantBox}>{p.variant}</span>
        <span className={h.options}>2 Options</span>
      </button>
      <div className={h.pInfo}>
        <button type="button" className={u.btnReset} onClick={onOpen}>
          <p className={h.pTitle}>{p.title}</p>
        </button>
        <p className={h.pDesc}>{p.desc}</p>
        <span className={h.star}>
          <Star size={15} color="#FBBD13" fill="#FBBD13" /> {p.rating.toFixed(1)} <small>({p.reviews})</small>
        </span>
        <div className={h.pPrice}>
          {rupee(p.price)} <s>{rupee(p.mrp)}</s> <em>{off}% Off</em>
        </div>
        <div className={h.prepaid}>Prepaid Price: {rupee(Math.round(p.price * 0.99))}</div>
        <div className={h.delivery}>
          Free Delivery by <b>{DELIVERY}</b>
        </div>
        {qty > 0 ? (
          <span className={h.pStepper}>
            <button type="button" className={u.btnReset} onClick={() => setQty((q) => q - 1)} aria-label="Remove one">
              <Minus size={18} />
            </button>
            {qty}
            <button type="button" className={u.btnReset} onClick={() => setQty((q) => q + 1)} aria-label="Add one">
              <Plus size={18} />
            </button>
          </span>
        ) : (
          <button type="button" className={`${u.btnReset} ${h.pAdd}`} onClick={() => setQty(1)}>
            Add to Cart <ShoppingCart size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

// ---------- Home ----------

export const HERD = [
  { name: "Gowri", age: "4 Years", breed: "Gir", status: "Critical", image: "cow-gowri.webp" },
  { name: "Ganga", age: "6 Years", breed: "HF Cross", status: "Healthy", image: "cow-ganga.webp" },
  { name: "Narmada", age: "3 Years", breed: "Jersey", status: "Scan Due", image: "cow-narmada.webp" },
];

export const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Critical: { bg: "#FCEDEC", color: "#C20E10" },
  Healthy: { bg: "#E6F4EB", color: "#206C42" },
  "Scan Due": { bg: "#D9E0E8", color: "#6C757D" },
};

const SYMPTOMS = [
  {
    id: "mastitis",
    title: "Udder swelling or drop in milk",
    desc: "Is there udder swelling, lesions, or a drop in milk production?",
    Icon: Droplets,
    conditions: ["Mastitis", "Mammillitis", "Thelitis"],
    severity: "High",
    sevBg: "#FEF2F2",
    sevColor: "#DC2626",
    advice: "Early detection helps protect milk production and prevent permanent udder damage. A quick scan provides immediate assessment.",
  },
  {
    id: "prolapse",
    title: "Tissue or mass hanging",
    desc: "Is there a mass or tissue hanging out from the back / vulva area?",
    Icon: TriangleAlert,
    conditions: ["Uterine Prolapse"],
    severity: "Critical",
    sevBg: "#FFF1F2",
    sevColor: "#BE123C",
    advice: "Uterine prolapse requires immediate veterinary care. Record a scan now to document the condition for your vet.",
  },
  {
    id: "none",
    title: "None of these",
    desc: "Cow appears normal with no visible udder or pelvic abnormalities.",
    Icon: CheckCircle2,
    conditions: ["General Wellness"],
    severity: "Normal",
    sevBg: "#ECFDF5",
    sevColor: "#059669",
    advice: "No urgent udder symptoms detected. Perform regular wellness scans to keep your herd healthy and productive.",
  },
];

const RECENT = [
  { title: "Disease Check", sub: "Gowri · Gir", time: "Today", status: "Critical Risk", color: "#DC2626", image: "gowri-side.jpg", flow: "disease-check", screen: "gs-diagnosis" },
  { title: "Animal Status", sub: "Ganga · HF Cross", time: "3d ago", status: "Healthy", color: "#16A34A", image: "cow-ganga.webp", flow: "animal-status", screen: "gs-status-report" },
  { title: "Dung Scan", sub: "Narmada · Jersey", time: "6d ago", status: "Mild Risk", color: "#D78B00", image: "dung-sample.webp", flow: "dung-scan", screen: "gs-dung-results" },
];

function Home({ goToFlow }: ScreenProps) {
  const [banner, setBanner] = useState(0);
  const [sheet, setSheet] = useState<null | 1 | 2>(null);
  const [option, setOption] = useState(SYMPTOMS[0]);
  const [category, setCategory] = useState<string | null>(null);
  const toast = useToast();

  const banners = [
    { badge: "Health Alert", badgeBg: "#FFA000", badgeColor: "#fff", title: "Is your cow facing udder problems?", sub: "She may be suffering without you knowing.", cta: "Check Now", bg: "#F6EFE6", image: "banner-udder-cow.webp", onPress: () => setSheet(1) },
    { badge: "Preventive Care", badgeBg: "#CBE5FE", badgeColor: "#004691", title: "Keep your cow Healthy & Productive", sub: "Regular health check helps prevent and improve milk yield.", cta: "Learn More", bg: "#EEF7FC", image: "banner-healthy-cow.webp", onPress: () => goToFlow("disease-check") },
  ];

  return (
    <div className={`${u.screen} ${h.page}`}>
      <div className={u.scroll}>
        {/* home-header.jsx */}
        <div className={h.header}>
          <span className={h.loc}>
            <MapPin size={20} /> <span>Tumakuru</span>
            <ChevronDown size={20} color="#000" />
          </span>
          <span className={h.right}>
            <button type="button" className={`${u.btnReset} ${h.circle}`} onClick={() => goToFlow("gs-account", "gs-notifications")} aria-label="Notifications">
              <Bell size={18} />
              <span className={h.badge}>3</span>
            </button>
            <button type="button" className={`${u.btnReset} ${h.avatar}`} onClick={() => goToFlow("gs-account")} aria-label="Profile">
              <User size={22} fill="#94A3B8" />
            </button>
          </span>
        </div>

        {/* health-alert-banner.jsx */}
        <div className={h.carousel}>
          <div
            className={h.track}
            onScroll={(e) => setBanner(Math.round(e.currentTarget.scrollLeft / 355))}
          >
            {banners.map((b, i) => (
              <button key={b.title} type="button" className={`${u.btnReset} ${h.banner} ${i === 0 ? u.hotspot : ""}`} style={{ background: b.bg }} onClick={b.onPress}>
                <span className={h.quadrant} />
                <img className={h.bannerImg} src={gimg(b.image)} alt="" />
                <span className={h.bannerText} style={{ display: "block" }}>
                  <span className={h.pill} style={{ background: b.badgeBg, color: b.badgeColor }}>
                    {b.badge}
                  </span>
                  <p className={h.headline}>{b.title}</p>
                  <p className={h.sub}>{b.sub}</p>
                  <span className={h.cta}>
                    {b.cta} <ChevronRight size={16} />
                  </span>
                </span>
              </button>
            ))}
          </div>
          <div className={h.dots}>
            {banners.map((b, i) => (
              <i key={b.title} className={i === banner ? h.on : undefined} />
            ))}
          </div>
        </div>

        {/* quick-action-buttons.jsx */}
        <div className={h.quick}>
          <button type="button" className={`${u.btnReset} ${h.qa} ${h.qaBlue}`} onClick={() => goToFlow("disease-check")}>
            <span className={h.qaTop}>
              <img src={gimg("qa-scan-cow.webp")} alt="" />
              <span className={h.arrow}>
                <ArrowUpRight size={14} />
              </span>
            </span>
            Scan Cow
          </button>
          <button type="button" className={`${u.btnReset} ${h.qa}`} onClick={() => goToFlow("gs-herd", "gs-add-cow")}>
            <span className={h.qaTop}>
              <img src={gimg("qa-add-cow.webp")} alt="" />
              <span className={h.arrow}>
                <ArrowUpRight size={14} />
              </span>
            </span>
            Add Cow
          </button>
          <button type="button" className={`${u.btnReset} ${h.qa}`} onClick={() => toast.show("Calling vet helpline 1800 419 7848")}>
            <span className={h.qaTop}>
              <img src={gimg("qa-helpline.webp")} alt="" />
              <span className={h.arrow}>
                <ArrowUpRight size={14} />
              </span>
            </span>
            Helpline
          </button>
        </div>

        {/* my-herd-section.jsx */}
        <div className={h.herd}>
          <div className={h.herdHead}>
            <span>
              My Herd <span className={h.count}>3 Cows</span>
            </span>
            <button type="button" className={`${u.btnReset} ${u.link}`} onClick={() => goToFlow("gs-herd")}>
              View all
            </button>
          </div>
          <div className={h.kpis}>
            {[
              ["Critical", "#FCEDEC", "#C20E10", "#C20E10", 1],
              ["Scan Due", "#D9E0E8", "#6C757D", "#6C757D", 1],
              ["Healthy", "#E6F4EB", "#01A245", "#206C42", 1],
            ].map(([label, bg, dot, num, n]) => (
              <span key={label as string} className={h.kpi} style={{ background: bg as string }}>
                <span>
                  <i style={{ background: dot as string }} />
                  {label}
                </span>
                <b style={{ color: num as string }}>{n}</b>
              </span>
            ))}
          </div>
          <div className={h.cows}>
            {HERD.map((c, i) => (
              <button key={c.name} type="button" className={`${u.btnReset} ${h.cowCard} ${i === 0 ? u.hotspot : ""}`} onClick={() => goToFlow("gs-herd", "gs-cow-details")}>
                <span className={h.cowThumb}>
                  <img src={gimg(c.image)} alt="" />
                </span>
                <span className={h.cowInfo}>
                  <b>{c.name}</b>
                  <span>{c.age}</span>
                  <span>{c.breed}</span>
                </span>
                <span className={h.status} style={STATUS_STYLE[c.status]}>
                  {c.status}
                </span>
                <span className={h.chev}>
                  <ChevronRight size={20} />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* recommended-for-you-section.jsx */}
        <div className={h.reco}>
          <div className={h.eyebrow}>VET SELECTED</div>
          <div className={u.sectionHead}>
            <p className={u.sectionTitle} style={{ fontSize: 18 }}>
              Recommended for you
            </p>
            <button type="button" className={`${u.btnReset} ${u.link}`} onClick={() => goToFlow("gs-shop")}>
              View all
            </button>
          </div>
          <div className={u.hScroll}>
            {PRODUCTS.slice(1, 4).map((p) => (
              <ProductCard key={p.id} p={p} onOpen={() => goToFlow("gs-shop", "gs-product")} />
            ))}
          </div>
        </div>

        {/* recent-scans-section.jsx */}
        <div className={h.recent}>
          <div className={u.sectionHead}>
            <p className={u.sectionTitle}>Recent Scans</p>
          </div>
          <div className={u.hScroll}>
            {RECENT.map((r) => (
              <button key={r.title} type="button" className={`${u.btnReset} ${h.scanCard}`} onClick={() => goToFlow(r.flow, r.screen)}>
                <span className={h.scanImg}>
                  <img src={gimg(r.image)} alt="" />
                  <span className={h.time}>
                    <Clock size={11} /> {r.time}
                  </span>
                </span>
                <span>
                  <div className={h.scanTitle}>{r.title}</div>
                  <div className={h.scanSub}>{r.sub}</div>
                </span>
                <span className={h.hr} />
                <span className={h.statusRow} style={{ color: r.color }}>
                  {r.status} <ChevronRight size={18} />
                </span>
              </button>
            ))}
          </div>
          <button type="button" className={`${u.btnReset} ${h.linkRow}`} onClick={() => goToFlow("gs-history")}>
            View all Scan History <ChevronRight size={18} />
          </button>
        </div>

        {/* home-products-section.jsx */}
        <CategoryStrip selected={category} onSelect={setCategory} />
        <StatBanner key={category ?? "all"} category={category} />
        <div className={h.listHead}>
          {category ? CATEGORIES.find((c) => c.id === category)?.label.replace("\n", " ") : "All Products"}
          <span>
            {PRODUCTS.length} products <Search size={18} />
          </span>
        </div>
        {PRODUCTS.map((p) => (
          <ProductRow key={p.id} p={p} onOpen={() => goToFlow("gs-shop", "gs-product")} />
        ))}
        <div style={{ height: 16 }} />
      </div>
      <GauTabBar active="home" goToFlow={goToFlow} />
      {toast.node}

      {sheet && (
        <GauSheet label="Symptom check" onClose={() => setSheet(null)}>
          <div className={h.sheetHead}>
            <span>
              <span className={h.step}>Step {sheet} of 2</span>
              {sheet === 1 ? "Symptom Check" : "Assessment Result"}
            </span>
            <button type="button" className={u.btnReset} onClick={() => setSheet(null)} aria-label="Close">
              <X size={22} color="#64748B" />
            </button>
          </div>
          {sheet === 1 ? (
            <>
              <p className={h.q}>Is your cow facing udder problems?</p>
              <p className={h.help}>Select the sign that best describes what you are observing:</p>
              {SYMPTOMS.map((o, i) => (
                <button
                  key={o.id}
                  type="button"
                  className={`${u.btnReset} ${h.option} ${i === 0 ? u.hotspot : ""}`}
                  onClick={() => {
                    setOption(o);
                    setSheet(2);
                  }}
                >
                  <span className={h.optIcon}>
                    <o.Icon size={22} />
                  </span>
                  <span>
                    <b>{o.title}</b>
                    {o.desc}
                  </span>
                  <ChevronRight size={22} color="#94A3B8" />
                </button>
              ))}
            </>
          ) : (
            <>
              <div className={h.result}>
                <div className={h.resultHead}>
                  Potential Conditions
                  <span className={h.sev} style={{ background: option.sevBg, color: option.sevColor }}>
                    {option.severity} Severity
                  </span>
                </div>
                <div className={h.tags}>
                  {option.conditions.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </div>
                <p className={h.advice}>{option.advice}</p>
              </div>
              <button type="button" className={`${u.btnReset} ${h.scanCta} ${u.hotspot}`} onClick={() => goToFlow("disease-check", "gs-hub")}>
                <Camera size={20} /> Scan Now for Vet Diagnosis
              </button>
              <button type="button" className={`${u.btnReset} ${h.textBtn}`} onClick={() => setSheet(1)}>
                Check Another Symptom
              </button>
            </>
          )}
        </GauSheet>
      )}
    </div>
  );
}

export const gauHomeScreens: Record<string, ComponentType<ScreenProps>> = {
  "gs-home": Home,
};
