"use client";

// Shared parts of the Gau Sampurna website prototype: the page shell (its own scroll area plus an
// optional pinned bottom bar), the phone and desktop headers, the menu, footer, product cards and
// small pieces (stars, accordion, section titles). Each mirrors the site's component of the same
// role (components/NewHomePageComponents, components/layout, components/products).
import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ComponentType, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
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
import {
  IoBagHandleOutline,
  IoCallOutline,
  IoChatbubblesOutline,
  IoChevronForward,
  IoClose,
  IoHeartOutline,
  IoHelpCircleOutline,
  IoHomeOutline,
  IoInformationCircleOutline,
  IoLeafOutline,
  IoLogIn,
  IoMailOutline,
  IoMedkitOutline,
  IoNewspaperOutline,
  IoPersonOutline,
  IoReceiptOutline,
} from "react-icons/io5";
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
// Opens the cart as a right-side drawer over the current page (the site's intercepted /cart route).
// Null on the full-page checkout screen itself, where the cart is already the page.
const CartDrawerCtx = createContext<(() => void) | null>(null);

// The cart view lives in GsCart.tsx, which imports this file; it registers itself here so the page
// shell can host it in the drawer without an import cycle
export type CartViewProps = { inDrawer?: boolean; onClose?: () => void };
let CartViewImpl: ComponentType<CartViewProps> | null = null;
export function registerCartView(c: ComponentType<CartViewProps>) {
  CartViewImpl = c;
}

// Inside a Page the screen's navigation comes from context; a screen component itself (which
// renders the Page) passes its own props
export function useNav(own?: ScreenProps) {
  const p = useContext(NavContext) ?? own ?? null;
  const openDrawer = useContext(CartDrawerCtx);
  const goToFlow = p?.goToFlow ?? (() => {});
  const checkoutPage = () => {
    cartActions.buyNow(null);
    goToFlow("web-shop", "gw-checkout");
  };
  return {
    home: () => goToFlow("web-shop", "gw-home"),
    products: () => goToFlow("web-shop", "gw-products"),
    product: (id: string) => {
      cartActions.view(id);
      goToFlow("web-shop", "gw-product");
    },
    // In-app navigation to /cart opens the drawer; on the checkout page itself it is the page
    cart: () => {
      cartActions.buyNow(null);
      if (openDrawer) openDrawer();
      else checkoutPage();
    },
    checkoutPage,
    // Buy Now checks out this item alone, in its own cart, as the site does
    buyNow: (id: string) => {
      cartActions.buyNow(id);
      goToFlow("web-shop", "gw-checkout");
    },
    addAddress: () => goToFlow("web-address", "gw-addr-pincode"),
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

export function Page({ nav, font = "inter", bottom, overlay, children, cartPage = false }: PageProps & { cartPage?: boolean }) {
  const desktop = useDesktop();
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const [drawer, setDrawer] = useState(false);
  return (
    <NavContext.Provider value={nav}>
      <OverlayRoot.Provider value={root}>
        <CartDrawerCtx.Provider value={cartPage ? null : () => setDrawer(true)}>
          <div ref={setRoot} className={cx(s.page, desktop && s.desk, s[font], roboto.variable)} data-desktop={desktop || undefined}>
            <div className={s.scroll} data-gs-scroll>
              {children}
            </div>
            {bottom}
            {overlay}
            {drawer && CartViewImpl && <CartDrawer View={CartViewImpl} onClosed={() => setDrawer(false)} />}
          </div>
        </CartDrawerCtx.Provider>
      </OverlayRoot.Provider>
    </NavContext.Provider>
  );
}

// components/cart/CartDrawer.jsx: the cart page in a right-side sheet, 95% wide, over the page it was
// opened from; the dimmed strip, Esc and the cart's ✕ close it (280ms slide)
const SLIDE_MS = 280;
function CartDrawer({ View, onClosed }: { View: ComponentType<CartViewProps>; onClosed: () => void }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const close = () => {
    setShown(false);
    window.setTimeout(onClosed, SLIDE_MS);
  };
  useEffect(() => {
    // Esc closes the drawer only, not the prototype player behind it
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopImmediatePropagation();
      close();
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  });
  return (
    <div className={s.cartDrawer} role="dialog" aria-modal="true" aria-label="Cart">
      <button type="button" aria-label="Close cart" tabIndex={-1} className={s.cartDrawerDim} style={{ opacity: shown ? 1 : 0 }} onClick={close} />
      <div className={s.cartDrawerPanel} style={{ transform: shown ? "none" : "translateX(100%)" }}>
        <CartDrawerCtx.Provider value={null}>
          <View inDrawer onClose={close} />
        </CartDrawerCtx.Provider>
      </div>
    </div>
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

// TopMarketingBanner: ✕ on the left (as in Apple's Smart App Banner), the message, a compact "Get app"
// pill with the Play Store mark. Dismissing hides it on every page (the site remembers for 14 days).
let appBannerDismissed = false;
export function AppStrip() {
  const [hidden, setHidden] = useState(appBannerDismissed);
  if (hidden) return null;
  return (
    <div className={s.appStrip} role="region" aria-label="Gau Sampurna app">
      <button
        type="button"
        className={s.appStripClose}
        aria-label="Dismiss"
        onClick={() => {
          appBannerDismissed = true;
          setHidden(true);
        }}
      >
        <X size={16} strokeWidth={2.4} />
      </button>
      <p>
        Get vet advice on the <b>Gau Sampurna</b> app
      </p>
      <span className={s.getApp}>
        <img src={img("google-play.webp")} alt="" />
        Get app
      </span>
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

// LangToggle: fixed-width pill (globe + "EN"); the menu lists each language in its own script first.
// The prototype is in English, so the menu shows the choice but the page stays English.
const LANGUAGES = [
  { id: "en", native: "English", english: "" },
  { id: "kn", native: "ಕನ್ನಡ", english: "Kannada" },
  { id: "te", native: "తెలుగు", english: "Telugu" },
  { id: "pa", native: "ਪੰਜਾਬੀ", english: "Punjabi" },
];
function LangPill() {
  const [open, setOpen] = useState(false);
  return (
    <span className={s.langWrap}>
      <button type="button" className={s.langPill} aria-haspopup="listbox" aria-expanded={open} aria-label="Language: English. Change language" onClick={() => setOpen((v) => !v)}>
        <Globe size={16} strokeWidth={2.2} />
        EN
      </button>
      {open && (
        <span className={s.langMenu} role="listbox" aria-label="Choose language">
          {LANGUAGES.map((l) => (
            <button key={l.id} type="button" role="option" aria-selected={l.id === "en"} className={cx(s.langOpt, l.id === "en" && s.langOptOn)} onClick={() => setOpen(false)}>
              <b>{l.native}</b>
              {l.english && <small>{l.english}</small>}
              <Check size={16} strokeWidth={2.6} className={l.id === "en" ? undefined : s.invisible} />
            </button>
          ))}
        </span>
      )}
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
      {menu && <MenuDrawer onClose={() => setMenu(false)} active="home" />}
    </>
  );
}

// Products and product pages: back arrow and a title
export function PageNav({ title, eyebrow, active }: { title: string; eyebrow?: string; active?: MenuActive }) {
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
      {menu && <MenuDrawer onClose={() => setMenu(false)} active={active} />}
    </>
  );
}

// Service pages (Gau Swastha, Cattle Trading, Ask a Vet): the site-wide header
export function SiteNav({ active }: { active?: MenuActive } = {}) {
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
      {menu && <MenuDrawer onClose={() => setMenu(false)} active={active} />}
    </>
  );
}

export type MenuActive = "home" | "products" | "swastha" | "vet" | "trading";

function MenuDrawer({ onClose, active }: { onClose: () => void; active?: MenuActive }) {
  const root = useContext(OverlayRoot);
  return root ? createPortal(<MenuDrawerBody onClose={onClose} active={active} />, root) : null;
}

// Staggered reveal shared by every block in the drawer (Navbar.jsx `reveal`)
const reveal = (open: boolean, i: number, axis: "x" | "y" = "x") => ({
  opacity: open ? 1 : 0,
  transform: open ? "none" : axis === "x" ? "translateX(-12px)" : "translateY(8px)",
  transitionDelay: open ? `${100 + i * 28}ms` : "0ms",
});

// Navbar.jsx SideDrawer: compact brand header with Login / Sign Up, quick tiles (Home · You · Orders ·
// Cart), two lists of outline-icon rows, a "Reach a human" card, the language picker, then socials
function MenuDrawerBody({ onClose, active }: { onClose: () => void; active?: MenuActive }) {
  const nav = useNav();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const close = () => {
    setOpen(false);
    window.setTimeout(onClose, 300);
  };
  const go = (fn?: () => void) => () => {
    if (!fn) return;
    onClose();
    fn();
  };
  const tiles = [
    { label: "Home", Icon: IoHomeOutline, on: nav.home, on2: active === "home" },
    { label: "You", Icon: IoPersonOutline },
    { label: "My Orders", Icon: IoReceiptOutline },
    { label: "Cart", Icon: null, on: nav.cart, badge: count },
  ];
  const shop = [
    { label: "All Products", Icon: IoBagHandleOutline, on: nav.products, on2: active === "products" },
    { label: "Gau Swastha", Icon: IoMedkitOutline, on: nav.swastha, on2: active === "swastha" },
    { label: "Ask a Vet", Icon: IoChatbubblesOutline, on: nav.vet, on2: active === "vet" },
    { label: "Cattle Trading", Icon: IoLeafOutline, on: nav.trading, on2: active === "trading" },
    { label: "Farmer Stories & Tips", Icon: IoNewspaperOutline },
  ];
  const account = [
    { label: "Wishlist", Icon: IoHeartOutline },
    { label: "About Us", Icon: IoInformationCircleOutline },
    { label: "Contact Us", Icon: IoHelpCircleOutline },
  ];
  let n = 0;
  return (
    <div className={s.drawerWrap} onClick={close} style={{ opacity: open ? 1 : 0 }}>
      <aside className={s.drawer} onClick={(e) => e.stopPropagation()} aria-label="Menu" style={{ transform: open ? "none" : "translateX(-101%)" }}>
        <div className={s.drawerHead}>
          <div className={s.drawerBrand}>
            <span className={s.drawerLogo}>
              <img src={img("logo.webp")} alt="Gau Sampurna" />
            </span>
            <span>
              <b>Gau Sampurna</b>
              <small>Healthier cows. Higher profits.</small>
            </span>
            <button type="button" className={s.drawerClose} onClick={close} aria-label="Close menu">
              <IoClose size={24} />
            </button>
          </div>
          <span className={s.drawerLogin} style={reveal(open, 0, "y")}>
            <IoLogIn size={19} /> Login / Sign Up
          </span>
        </div>
        <nav className={s.drawerNav}>
          <div className={s.drawerTiles} style={reveal(open, n++, "y")}>
            {tiles.map((t) => (
              <button key={t.label} type="button" className={cx(s.drawerTile, t.on2 && s.drawerTileOn)} onClick={go(t.on)} aria-current={t.on2 ? "page" : undefined}>
                <span className={s.drawerTileIcon}>
                  {t.Icon ? <t.Icon size={22} /> : <BikeIcon size={26} />}
                  {!!t.badge && <i className={s.drawerBadge}>{t.badge > 99 ? "99+" : t.badge}</i>}
                </span>
                {t.label}
              </button>
            ))}
          </div>
          <p className={s.drawerLabel} style={reveal(open, n++)}>Shop &amp; Explore</p>
          <ul>
            {shop.map((l) => (
              <li key={l.label} style={reveal(open, n++)}>
                <button type="button" className={cx(s.drawerLink, l.on2 && s.drawerLinkOn)} onClick={go(l.on)} aria-current={l.on2 ? "page" : undefined}>
                  <l.Icon size={22} className={s.drawerLinkIcon} />
                  <span>{l.label}</span>
                  <IoChevronForward size={16} className={s.drawerChev} />
                </button>
              </li>
            ))}
          </ul>
          <p className={s.drawerLabel} style={reveal(open, n++)}>Account &amp; Support</p>
          <ul>
            {account.map((l) => (
              <li key={l.label} style={reveal(open, n++)}>
                <button type="button" className={s.drawerLink}>
                  <l.Icon size={22} className={s.drawerLinkIcon} />
                  <span>{l.label}</span>
                  <IoChevronForward size={16} className={s.drawerChev} />
                </button>
              </li>
            ))}
          </ul>
          <div className={s.drawerHuman} style={reveal(open, n++, "y")}>
            <p>Reach a Human</p>
            <span className={s.drawerHumanPhone}>
              <i>
                <IoCallOutline size={18} />
              </i>
              <span>
                <b>{PHONE}</b>
                <small>7 AM – 7 PM · All 7 days</small>
              </span>
            </span>
            <span className={s.drawerHumanMail}>
              <IoMailOutline size={16} />
              {EMAIL}
            </span>
          </div>
          <div className={s.drawerLang} style={reveal(open, n++, "y")}>
            <button type="button" aria-expanded={langOpen} onClick={() => setLangOpen((v) => !v)}>
              <Globe size={18} />
              <span>Language</span>
              <b>English</b>
              <ChevronDown size={16} className={langOpen ? s.chevUp : undefined} />
            </button>
            {langOpen &&
              LANGUAGES.map((l) => (
                <span key={l.id} className={cx(s.drawerLangOpt, l.id === "en" && s.drawerLangOptOn)}>
                  <b>{l.native}</b>
                  <small>{l.english || "English"}</small>
                  {l.id === "en" && <Check size={16} strokeWidth={3} />}
                </span>
              ))}
          </div>
        </nav>
        <div className={s.drawerFoot}>
          <span className={s.drawerSocials}>
            <i><FaFacebookF size={14} /></i>
            <i><FaInstagram size={14} /></i>
            <i><FaYoutube size={14} /></i>
          </span>
          <small>© 2026 Silo Fortune Pvt. Ltd.</small>
        </div>
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
