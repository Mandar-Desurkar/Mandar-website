"use client";

// Shared parts of the Gau Sampurna website prototype: the page shell (its own scroll area plus an
// optional pinned bottom bar), the phone and desktop headers, the menu, footer, product cards and
// small pieces (stars, accordion, section titles). Each mirrors the site's component of the same
// role (components/NewHomePageComponents, components/layout, components/products).
import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  ChevronDown,
  ChevronRight,
  Clock,
  Globe,
  Heart,
  HelpCircle,
  Mail,
  MapPin,
  Menu,
  Minus,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  Star,
  Stethoscope,
  Truck,
  User,
  Users,
  X,
} from "lucide-react";
import { FaFacebookF, FaGooglePlay, FaInstagram, FaLinkedinIn, FaWhatsapp, FaYoutube } from "react-icons/fa";
import type { ScreenProps } from "../kissan/KissanScreens";
import s from "./gsWeb.module.css";
import { roboto } from "../fonts";
import { EMAIL, PHONE, cartActions, deliveryDate, img, inr, offPct, prepaid, useCart, useDesktop, type Product } from "./gsData";

export const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

// ---------- Navigation ----------

const NavContext = createContext<ScreenProps | null>(null);
// The page root, so menus and sheets can cover the whole page (pinned bars included), not just the
// scrolling content they are declared in
const OverlayRoot = createContext<HTMLElement | null>(null);

// Inside a Page the screen's navigation comes from context; a screen component itself (which
// renders the Page) passes its own props
export function useNav(own?: ScreenProps) {
  const p = useContext(NavContext) ?? own ?? null;
  const goToFlow = p?.goToFlow ?? (() => {});
  return {
    home: () => goToFlow("web-shop", "gw-home"),
    products: () => goToFlow("web-shop", "gw-products"),
    product: (id: string) => {
      cartActions.view(id);
      goToFlow("web-shop", "gw-product");
    },
    cart: () => goToFlow("web-shop", "gw-checkout"),
    confirmed: () => goToFlow("web-shop", "gw-confirmed"),
    swastha: () => goToFlow("web-swastha", "gw-swastha"),
    trading: () => goToFlow("web-trading", "gw-trading"),
    vet: () => goToFlow("web-vet", "gw-vet"),
    back: () => p?.back(),
  };
}

// ---------- Page shell ----------

type PageProps = {
  nav: ScreenProps;
  font?: "lato" | "inter" | "roboto";
  bottom?: ReactNode;
  overlay?: ReactNode;
  children: ReactNode;
};

export function Page({ nav, font = "inter", bottom, overlay, children }: PageProps) {
  const desktop = useDesktop();
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  return (
    <NavContext.Provider value={nav}>
      <OverlayRoot.Provider value={root}>
        <div ref={setRoot} className={cx(s.page, desktop && s.desk, s[font], roboto.variable)} data-desktop={desktop || undefined}>
          <div className={s.scroll} data-gs-scroll>
            {children}
          </div>
          {bottom}
          {overlay}
        </div>
      </OverlayRoot.Provider>
    </NavContext.Provider>
  );
}

// Scrolls the page's own scroll area to an element with this id
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---------- Icons ----------

// The site's add-to-cart glyph ("Speedy Delivery", Jenie Tomboc, The Noun Project), as in
// components/icons/DeliveryBikeIcon.jsx
export function BikeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 2843 2410" fill="currentColor" aria-hidden="true">
      <path d="M2570 1345c161,0 270,130 243,291 -27,161 -179,292 -340,292 -161,0 -270,-131 -243,-292 27,-161 179,-291 340,-291zm-19 112c99,0 166,80 149,179 -16,99 -110,179 -208,179 -99,0 -166,-80 -149,-179 16,-99 110,-179 208,-179zm-901 -421l311 121c19,8 37,33 29,54l-111 303c-41,111 119,103 156,17 46,-109 141,-346 146,-395 12,-115 -192,-174 -288,-214l69 -226c3,-10 21,-18 28,-12l76 72c28,27 58,49 123,37 30,-6 153,-48 229,-81 124,-53 78,-152 -28,-122 -60,16 -140,54 -206,67 -41,-40 -100,-109 -151,-180 -63,-88 -250,-141 -292,-2l-134 440c-29,95 -24,95 43,121zm724 -243l50 355c-191,154 -258,226 -374,479l-344 0 -79 -299c220,-101 215,-173 -1,-202l-597 2 -953 0c-35,0 -69,28 -75,63l0 0c-6,35 17,63 52,63l887 0c-29,58 -48,124 -53,208 42,-21 244,-265 487,-132 123,68 168,254 248,379l507 0c88,-233 203,-494 517,-419 90,22 110,88 197,14 -59,-174 -232,-179 -271,-203 -35,-22 -25,-60 -42,-105 50,-12 126,-9 132,-100 -4,-78 -99,-83 -164,-89l-24 -51 -100 37 0 0zm-1407 -295l322 0 210 0c38,0 65,31 58,69l-76 416c-6,38 -42,69 -80,69l-532 0c-38,0 -65,-31 -58,-69l0 -3 -514 0c-35,0 -58,-28 -52,-63l0 0c7,-35 40,-63 75,-63l516 0 19 -103 387 0c35,0 69,-28 75,-63l0 0c7,-35 -17,-64 -51,-64l-389 0 -706 0c-35,0 -58,-28 -52,-63l0 0c6,-35 40,-63 75,-63l773 0zm1095 -498c53,0 95,25 118,64l0 0 68 79c4,4 -4,20 -11,19l-40 -4 -1 3c-15,88 -99,160 -187,160 -89,0 -149,-72 -134,-160 15,-89 99,-161 187,-161zm-845 1345c161,0 270,130 243,291 -27,161 -179,292 -340,292 -161,0 -270,-131 -243,-292 27,-161 179,-291 340,-291zm-19 112c99,0 166,80 149,179 -16,99 -110,179 -208,179 -99,0 -166,-80 -149,-179 16,-99 110,-179 208,-179z" />
    </svg>
  );
}

export function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <span className={s.stars} aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= Math.round(rating) ? s.starOn : s.starOff} fill="currentColor" strokeWidth={0} />
      ))}
    </span>
  );
}

export function GooglePlayButton({ dark = false }: { dark?: boolean }) {
  return (
    <span className={cx(s.playBtn, dark && s.playBtnDark)}>
      <FaGooglePlay size={dark ? 22 : 16} />
      <span>
        <small>GET IT ON</small>
        <b>Google Play</b>
      </span>
    </span>
  );
}

// ---------- Strips ----------

export function AppStrip() {
  return (
    <div className={s.appStrip}>
      <p>
        Get vet advice on the <b>Gau Sampurna</b> app
      </p>
      <GooglePlayButton />
    </div>
  );
}

export function LimeStrip() {
  return (
    <div className={s.limeStrip}>
      <span>Free Delivery</span>
      <i aria-hidden="true" />
      <span>Cash on Delivery</span>
    </div>
  );
}

function LangPill() {
  return (
    <span className={s.langPill}>
      <Globe size={16} strokeWidth={2} />
      EN
      <ChevronDown size={13} strokeWidth={2.4} />
    </span>
  );
}

// ---------- Phone headers ----------

// Home navbar (NewHomePageComponents/components/Navbar.jsx): menu, round logo, search, language
export function HomeNav() {
  const [menu, setMenu] = useState(false);
  return (
    <>
      <nav className={s.homeNav}>
        <button type="button" className={s.iconBtn} onClick={() => setMenu(true)} aria-label="Navigation menu">
          <Menu size={26} strokeWidth={2.2} />
        </button>
        <img src={img("logo.webp")} alt="Gau Sampurna" className={s.navLogo} />
        <span className={s.navSpacer} />
        <button type="button" className={s.iconBtn} aria-label="Search">
          <Search size={23} strokeWidth={2} />
        </button>
        <LangPill />
      </nav>
      {menu && <MenuDrawer onClose={() => setMenu(false)} />}
    </>
  );
}

// Products and product pages: back arrow and a title
export function PageNav({ title, eyebrow }: { title: string; eyebrow?: string }) {
  const nav = useNav();
  const [menu, setMenu] = useState(false);
  return (
    <>
      <nav className={s.pageNav}>
        {eyebrow && (
          <button type="button" className={s.iconBtn} onClick={() => setMenu(true)} aria-label="Navigation menu">
            <Menu size={24} strokeWidth={2.2} />
          </button>
        )}
        <button type="button" className={s.iconBtn} onClick={nav.back} aria-label="Back">
          <ArrowLeft size={22} strokeWidth={2.4} />
        </button>
        <span className={s.pageNavTitle}>
          {eyebrow && <small>{eyebrow}</small>}
          {title}
        </span>
        <button type="button" className={s.iconBtn} aria-label="Search">
          <Search size={23} strokeWidth={2} />
        </button>
        <LangPill />
      </nav>
      {menu && <MenuDrawer onClose={() => setMenu(false)} />}
    </>
  );
}

// Service pages (Gau Swastha, Cattle Trading, Ask a Vet): the site-wide header
export function SiteNav() {
  const nav = useNav();
  const { count } = useCart();
  const [menu, setMenu] = useState(false);
  return (
    <>
      <nav className={s.siteNav}>
        <button type="button" className={s.brand} onClick={nav.home}>
          <img src={img("logo.webp")} alt="" />
          Gau Sampurna
        </button>
        <span className={s.navSpacer} />
        <button type="button" className={s.iconBtn} aria-label="Search">
          <Search size={21} strokeWidth={2} />
        </button>
        <button type="button" className={s.cartPill} onClick={nav.cart} aria-label="My Cart">
          <BikeIcon size={18} />
          <span className={s.cartCount}>{count}</span>
        </button>
        <button type="button" className={s.iconBtn} onClick={() => setMenu(true)} aria-label="Navigation menu">
          <Menu size={24} strokeWidth={2} />
        </button>
      </nav>
      {menu && <MenuDrawer onClose={() => setMenu(false)} />}
    </>
  );
}

function MenuDrawer({ onClose }: { onClose: () => void }) {
  const root = useContext(OverlayRoot);
  return root ? createPortal(<MenuDrawerBody onClose={onClose} />, root) : null;
}

function MenuDrawerBody({ onClose }: { onClose: () => void }) {
  const nav = useNav();
  const go = (fn: () => void) => () => {
    onClose();
    fn();
  };
  const shop = [
    { label: "All Products", on: nav.products },
    { label: "Gau Swastha", on: nav.swastha },
    { label: "Ask a Vet", on: nav.vet },
    { label: "Cattle Trading", on: nav.trading },
  ];
  return (
    <div className={s.drawerWrap} onClick={onClose}>
      <aside className={s.drawer} onClick={(e) => e.stopPropagation()} aria-label="Menu">
        <header className={s.drawerHead}>
          <img src={img("logo.webp")} alt="Gau Sampurna" />
          <button type="button" className={s.iconBtn} onClick={onClose} aria-label="Close menu">
            <X size={22} />
          </button>
        </header>
        <div className={s.drawerAuth}>
          <span>Login</span>
          <span>Sign Up</span>
        </div>
        <p className={s.drawerLabel}>Shop &amp; Explore</p>
        {shop.map((l) => (
          <button key={l.label} type="button" className={s.drawerLink} onClick={go(l.on)}>
            {l.label}
            <ChevronRight size={16} />
          </button>
        ))}
        <p className={s.drawerLabel}>Reach a Human</p>
        <p className={s.drawerPhone}>
          <Phone size={16} /> {PHONE}
          <small>7 AM – 7 PM · All 7 days</small>
        </p>
      </aside>
    </div>
  );
}

// Pinned phone bar: View Cart and Call (components/ButtonBottomBar.jsx)
export function CartCallBar() {
  const nav = useNav();
  const { count } = useCart();
  return (
    <div className={s.cartCallBar}>
      <button type="button" className={s.viewCartBtn} onClick={nav.cart}>
        <BikeIcon size={20} /> View Cart{count > 0 ? ` (${count})` : ""}
      </button>
      <span className={s.callBtn}>
        <Phone size={18} fill="currentColor" /> Call
      </span>
    </div>
  );
}

// ---------- Desktop headers ----------

// Home page header stack (desktop/DesktopHeaderStack.jsx): blue top bar, then the cream nav
export function DesktopHomeHeader() {
  const nav = useNav();
  const { count } = useCart();
  return (
    <header className={s.dHomeHeader}>
      <div className={s.dTopBar}>
        <span>
          <Phone size={13} /> +91-63619-57466
        </span>
        <span>
          <Mail size={13} /> contact@silofortune.com
        </span>
        <span className={s.navSpacer} />
        <span>Download the App</span>
        <span>Track Order</span>
        <span>
          <HelpCircle size={13} /> Help &amp; Support
        </span>
      </div>
      <div className={s.dCreamNav}>
        <img src={img("logo.webp")} alt="Gau Sampurna" className={s.dCreamLogo} />
        <nav>
          <button type="button" onClick={nav.products}>Products</button>
          <button type="button" onClick={nav.swastha}>Gau Sampurna</button>
          <button type="button">About Us</button>
          <button type="button">Press &amp; Media</button>
          <button type="button">Contact Us</button>
        </nav>
        <span className={s.dCreamSearch}>
          <span>Search for products...</span>
          <i>
            <Search size={14} />
          </i>
        </span>
        <span className={s.dLang}>
          <Globe size={14} /> English <ChevronDown size={13} />
        </span>
        <span className={s.dLogin}>
          <User size={15} /> Login / Register
        </span>
        <button type="button" className={s.dCreamCart} onClick={nav.cart}>
          <ShoppingCart size={17} />
          {count > 0 && <i>{count}</i>}
          Cart
        </button>
      </div>
    </header>
  );
}

// Every other page (components/layout/Header.jsx on desktop)
export function DesktopHeader() {
  const nav = useNav();
  const { count } = useCart();
  return (
    <header className={s.dHeader}>
      <button type="button" className={s.dBrand} onClick={nav.home}>
        <img src={img("logo.webp")} alt="" />
        Gau Sampurna
      </button>
      <span className={s.dLocation}>
        <small>Your Location</small>
        <b>
          Select Location <ChevronDown size={13} />
        </b>
      </span>
      <span className={s.dSearch}>
        <Search size={15} /> Search for &quot;cattle feed&quot;, &quot;supplements&quot;
      </span>
      <span className={s.dLang}>
        <Globe size={15} /> English <ChevronDown size={13} />
      </span>
      <span className={s.dLogin}>
        <User size={15} /> Login
      </span>
      <button type="button" className={s.dMyCart} onClick={nav.cart}>
        <BikeIcon size={18} /> My Cart <i>{count}</i>
      </button>
    </header>
  );
}

export function WhatsAppFab() {
  return (
    <span className={s.waFab} aria-hidden="true">
      <FaWhatsapp size={26} />
    </span>
  );
}

// ---------- Footer ----------

export function Footer() {
  const nav = useNav();
  return (
    <footer className={s.footer}>
      <div className={s.footBrand}>
        <img src={img("logo.webp")} alt="" />
        Gau Sampurna
      </div>
      <div className={s.footCols}>
        <div>
          <h4 className={s.footLime}>Registered Office</h4>
          <p className={s.footRow}>
            <MapPin size={18} />
            <span>
              Silo Fortune Pvt. Ltd.,
              <br />
              2nd Floor, 558, 9th Cross Rd,
              <br />
              3rd Phase, J. P. Nagar,
              <br />
              Bengaluru, Karnataka – 560078
            </span>
          </p>
          <p className={s.footRow}>
            <Phone size={18} /> {PHONE}
          </p>
          <p className={s.footRow}>
            <Mail size={18} /> {EMAIL}
          </p>
          <p className={s.footRow}>
            <Clock size={18} /> Office Hours: 7 AM – 7 PM · All 7 days
          </p>
          <h4 className={s.footLime}>Follow Our Journey</h4>
          <div className={s.socials}>
            <span><FaFacebookF /></span>
            <span><FaInstagram /></span>
            <span><FaLinkedinIn /></span>
            <span><FaYoutube /></span>
          </div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <button type="button" onClick={nav.products}>Products</button>
          <button type="button" onClick={nav.swastha}>Gau Swastha</button>
          <button type="button">About Us</button>
          <button type="button">Press &amp; Media</button>
          <button type="button">Blog</button>
          <button type="button">Contact Us</button>
        </div>
        <div>
          <h4>Policies</h4>
          <button type="button">Shipping Policy</button>
          <button type="button">Non-Returnable Items Policy</button>
          <button type="button">Privacy Policy</button>
          <button type="button">Terms &amp; Conditions</button>
        </div>
      </div>
      <img src={img("footer-art.webp")} alt="Made in Bengaluru for India's dairy farmers" className={s.footArt} />
      <p className={s.copyright}>© 2026 Silo Fortune Pvt. Ltd. All rights reserved.</p>
    </footer>
  );
}

// ---------- Section pieces ----------

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: { label: string; on: () => void } }) {
  return (
    <div className={s.secTitle}>
      <div>
        {eyebrow && <p className={s.eyebrow}>{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {action && (
        <button type="button" className={s.secAction} onClick={action.on}>
          {action.label} <ChevronRight size={14} strokeWidth={2.4} />
        </button>
      )}
    </div>
  );
}

export function Accordion({ q, a, open, onToggle, icon = true }: { q: string; a: string; open: boolean; onToggle: () => void; icon?: boolean }) {
  return (
    <div className={cx(s.acc, open && s.accOpen, !icon && s.accPlain)}>
      <button type="button" className={s.accHead} onClick={onToggle} aria-expanded={open}>
        {icon && (
          <span className={s.accIcon}>
            <HelpCircle size={18} />
          </span>
        )}
        <span className={s.accQ}>{q}</span>
        <ChevronDown size={18} className={s.accChev} />
      </button>
      {open && <p className={s.accA}>{a}</p>}
    </div>
  );
}

const TRUST = [
  { Icon: Banknote, l1: "Cash on", l2: "Delivery", tone: "green" },
  { Icon: Truck, l1: "FREE", l2: "Delivery", tone: "blue" },
  { Icon: ShieldCheck, l1: "100%", l2: "Organic", tone: "yellow" },
  { Icon: Stethoscope, l1: "Vet", l2: "Approved", tone: "green" },
  { Icon: null, l1: "KMF", l2: "Certified", tone: "green" },
  { Icon: Users, l1: "1,00,000+", l2: "Farmers Using", tone: "blue" },
  { Icon: BadgeCheck, l1: "Made in", l2: "India", tone: "yellow" },
] as const;

export function TrustRow() {
  return (
    <div className={s.trustRow} aria-label="Why shop with Gau Sampurna">
      {TRUST.map((t) => (
        <div key={t.l2 + t.l1} className={s.trust}>
          <span className={cx(s.trustBubble, s[`tone_${t.tone}`])}>
            {t.Icon ? <t.Icon size={20} strokeWidth={2} /> : <img src={img("kmf.webp")} alt="" />}
          </span>
          <span>
            {t.l1}
            <br />
            {t.l2}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------- Add to cart controls ----------

export function Stepper({ id, qty, solid = false }: { id: string; qty: number; solid?: boolean }) {
  return (
    <span className={cx(s.stepper, solid && s.stepperSolid)}>
      <button type="button" onClick={(e) => (e.stopPropagation(), cartActions.setQty(id, qty - 1))} aria-label="Decrease quantity">
        <Minus size={15} strokeWidth={2.6} />
      </button>
      <b>{qty}</b>
      <button type="button" onClick={(e) => (e.stopPropagation(), cartActions.setQty(id, qty + 1))} aria-label="Increase quantity">
        <Plus size={15} strokeWidth={2.6} />
      </button>
    </span>
  );
}

function AddButton({ p, label = "Add to Cart", bike = false, plus = true }: { p: Product; label?: string; bike?: boolean; plus?: boolean }) {
  const { lines } = useCart();
  const qty = lines[p.id] ?? 0;
  if (qty > 0) return <Stepper id={p.id} qty={qty} solid />;
  return (
    <button type="button" className={s.addBtn} onClick={(e) => (e.stopPropagation(), cartActions.add(p.id))}>
      {bike && <BikeIcon size={18} />}
      {label}
      {plus && !bike && <Plus size={16} strokeWidth={2.2} />}
    </button>
  );
}

// ---------- Product cards ----------

// Home best sellers on the phone (NewHomePageComponents/BestSellerCard.jsx)
export function BestSellerCard({ p }: { p: Product }) {
  const nav = useNav();
  return (
    <article className={s.bsCard} onClick={() => nav.product(p.id)}>
      <span className={s.offTag}>{offPct(p)}% off</span>
      <Heart size={18} className={s.heart} />
      <div className={s.bsImg}>
        <img src={p.image} alt={p.name} />
      </div>
      <div className={s.bsBody}>
        <h3>{p.name}</h3>
        <div className={s.bsMeta}>
          <span className={s.packChip}>{p.pack}</span>
          <span className={s.rate}>
            <Star size={12} fill="currentColor" strokeWidth={0} className={s.starOn} /> {p.rating} <small>({p.reviews})</small>
          </span>
        </div>
        <p className={s.bsPrice}>
          ₹{p.price} <s>₹{p.mrp}</s>
        </p>
        <p className={s.prepaidChip}>Prepaid Price @ ₹{prepaid(p.price)}</p>
        <AddButton p={p} />
      </div>
    </article>
  );
}

// Products list on the phone (components/ProductCard.jsx, list layout)
export function ProductRow({ p }: { p: Product }) {
  const nav = useNav();
  return (
    <article className={s.pRow} onClick={() => nav.product(p.id)}>
      <div className={s.pRowLeft}>
        <span className={s.verified}>
          <ShieldCheck size={13} fill="currentColor" /> GS Verified
        </span>
        <img src={p.image} alt={p.name} />
        <span className={s.packBox}>{p.pack}</span>
      </div>
      <div className={s.pRowBody}>
        <h3>{p.name}</h3>
        <p className={s.claim}>{p.claim}</p>
        <p className={s.rateChip}>
          <Star size={13} fill="currentColor" strokeWidth={0} className={s.starOn} /> <b>{p.rating}</b> <small>({inr(p.reviews)})</small>
        </p>
        <p className={s.pRowPrice}>
          ₹{p.price} <s>MRP: ₹{p.mrp}</s>
        </p>
        <p className={s.pRowOff}>{offPct(p)}% off</p>
        <p className={s.pRowPrepaid}>Prepaid Price: ₹{prepaid(p.price)}</p>
        <p className={s.pRowDelivery}>
          Free Delivery <b><DeliveryDate /></b>
        </p>
        <AddButton p={p} bike />
      </div>
    </article>
  );
}

// Desktop grid tile (products page, "You may need this")
export function ProductTile({ p, compact = false }: { p: Product; compact?: boolean }) {
  const nav = useNav();
  const { lines } = useCart();
  const qty = lines[p.id] ?? 0;
  return (
    <article className={cx(s.tile, compact && s.tileCompact)} onClick={() => nav.product(p.id)}>
      {!compact && <span className={s.offTagDark}>{offPct(p)}% off</span>}
      {!compact && <Heart size={16} className={s.heart} />}
      <div className={s.tileImg}>
        <img src={p.image} alt={p.name} />
      </div>
      <h3>{p.name}</h3>
      {!compact && <p className={s.tileClaim}>{p.claim}</p>}
      <span className={s.packChip}>{p.pack}</span>
      <p className={s.tileRate}>
        <Stars rating={p.rating} /> <b>{p.rating}</b> <small>({p.reviews})</small>
      </p>
      {compact ? (
        <>
          <p className={s.tilePriceInline}>
            ₹{p.price} <s>₹{p.mrp}</s> <em>({offPct(p)}%)</em>
          </p>
          <p className={s.tileNote}>Additional 10% off on prepaid</p>
        </>
      ) : (
        <div className={s.tileFoot}>
          <p className={s.tilePrice}>
            <s>₹{p.mrp}</s>
            ₹{p.price}
          </p>
          {qty > 0 ? (
            <Stepper id={p.id} qty={qty} />
          ) : (
            <button type="button" className={s.plusBtn} onClick={(e) => (e.stopPropagation(), cartActions.add(p.id))} aria-label={`Add ${p.name}`}>
              <Plus size={16} />
            </button>
          )}
        </div>
      )}
    </article>
  );
}

// Desktop home best seller (desktop/DesktopProductCard.jsx)
export function DesktopBestSeller({ p, best }: { p: Product; best: boolean }) {
  const nav = useNav();
  return (
    <article className={s.dbs} onClick={() => nav.product(p.id)}>
      <div className={s.dbsTags}>
        {best && <span className={s.tagBest}>Best Seller</span>}
        <span className={s.tagSave}>Save {offPct(p)}%</span>
      </div>
      <div className={s.dbsImg}>
        <img src={p.image} alt={p.name} />
      </div>
      <h3>{p.name}</h3>
      <p className={s.tileRate}>
        <Stars rating={p.rating} /> <b>{p.rating}</b> <small>({inr(p.reviews)})</small>
      </p>
      <p className={s.dbsClaim}>{p.claim}</p>
      <p className={s.dbsPrepaid}>Prepaid Price: ₹{inr(prepaid(p.price))}</p>
      <p className={s.dbsPrice}>
        ₹{inr(p.price)} <s>₹{inr(p.mrp)}</s>
      </p>
      <span className={s.packChipWide}>{p.pack}</span>
      <div className={s.dbsActions}>
        <span className={s.wishBox}>
          <Heart size={15} />
        </span>
        <AddButton p={p} plus={false} />
      </div>
    </article>
  );
}

// Delivery date (the site's rule: 5 business days), computed on the client only so the server
// and client markup match
const noopSubscribe = () => () => {};
export function DeliveryDate() {
  const text = useSyncExternalStore(noopSubscribe, () => deliveryDate(), () => "");
  return <>{text}</>;
}
