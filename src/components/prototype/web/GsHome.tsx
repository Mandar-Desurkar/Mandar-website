"use client";

// Home page: the phone layout (NewHomePageComponents/MobileHomeScreen.jsx, Lato) and the desktop
// layout (app/page.jsx desktop tree, Inter) of gausampurna.com.
import { useEffect, useState } from "react";
import { Banknote, ChevronRight, ClipboardList, Phone, PhoneCall, ShoppingCart, Star } from "lucide-react";
import type { ScreenProps } from "../kissan/KissanScreens";
import s from "./gsWeb.module.css";
import h from "./gsHome.module.css";
import { CATEGORIES, HOME_FAQ, PHONE, PRODUCTS, TESTIMONIALS, img, useDesktop } from "./gsData";
import {
  Accordion,
  AppStrip,
  BestSellerCard,
  CartCallBar,
  DesktopBestSeller,
  DesktopHomeHeader,
  Footer,
  GooglePlayButton,
  HomeNav,
  LimeStrip,
  Page,
  SectionTitle,
  TrustRow,
  WhatsAppFab,
  cx,
  useNav,
} from "./GsShared";

const HEROES = [img("hero1.webp"), img("hero2.webp"), img("hero3.webp")];

const RECOGNISED = [
  { name: "Startup India", src: img("r-startup.webp") },
  { name: "MSME", src: img("r-msme.webp") },
  { name: "Government of Karnataka", src: img("r-govt.webp") },
  { name: "Department of Animal Husbandry", src: img("r-animal-husbandry.webp") },
  { name: "Udyam", src: img("r-udyam.webp") },
];

export default function GsHome(props: ScreenProps) {
  const desktop = useDesktop();
  return desktop ? <DesktopHome {...props} /> : <PhoneHome {...props} />;
}

// ---------- Phone ----------

function PhoneHome(props: ScreenProps) {
  return (
    <Page nav={props} font="lato" bottom={<CartCallBar />}>
      <AppStrip />
      <div className={h.sticky}>
        <LimeStrip />
      </div>
      <HomeNav />
      <main className={h.main}>
        <HeroCarousel />
        <TrustRow />
        <BestSellers />
        <Categories />
        <HowItWorks />
        <Testimonials />
        <AppBanner />
        <BeforeYouOrder />
        <Recognised />
        <Footer />
      </main>
    </Page>
  );
}

function HeroCarousel() {
  const nav = useNav();
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % HEROES.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className={h.heroWrap} aria-label="Gau Sampurna offers">
      <div className={h.hero}>
        {HEROES.map((src, n) => (
          <img key={src} src={src} alt="Farmer with healthy cattle" className={cx(h.heroImg, n === i && h.heroImgOn)} />
        ))}
        <div className={h.heroShade} />
        <div className={h.heroCopy}>
          <h1>
            Healthier Cows
            <mark>Higher Profits</mark>
          </h1>
          <p>
            Science-backed dairy nutrition delivered to your village
            <br />
            Cash on delivery, Free shipping.
          </p>
          <button type="button" onClick={nav.products}>
            Explore Category <ChevronRight size={18} strokeWidth={2.6} />
          </button>
        </div>
      </div>
      <div className={h.dots}>
        {HEROES.map((src, n) => (
          <button key={src} type="button" className={cx(h.dot, n === i && h.dotOn)} onClick={() => setI(n)} aria-label={`Slide ${n + 1}`} />
        ))}
      </div>
    </section>
  );
}

function BestSellers() {
  const nav = useNav();
  return (
    <section>
      <div className={h.gutter}>
        <SectionTitle eyebrow="MOST ORDERED" title="Best sellers this month" action={{ label: "See All", on: nav.products }} />
      </div>
      <div className={h.hScroll}>
        {PRODUCTS.slice(0, 4).map((p) => (
          <BestSellerCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}

function Categories() {
  const nav = useNav();
  return (
    <section className={h.gutter}>
      <SectionTitle eyebrow="SHOP BY NEED" title="Explore By Categories" />
      <div className={h.catGrid}>
        {CATEGORIES.map((c) => (
          <button key={c.name} type="button" className={h.cat} onClick={nav.products}>
            <span className={h.catTile}>
              <img src={c.image} alt="" />
            </span>
            {c.name}
          </button>
        ))}
      </div>
    </section>
  );
}

const STEPS = [
  { Icon: ClipboardList, title: "Choose your product", text: "Browse or call us if confused" },
  { Icon: ShoppingCart, title: "Add to cart & place order", text: "Enter your village, that's it" },
  { Icon: PhoneCall, title: "Our team calls to confirm", text: "Every order, before dispatch" },
  { Icon: Banknote, title: "Pay cash on delivery", text: "Pay only when you see it" },
];

function HowItWorks() {
  return (
    <section className={h.how}>
      <p className={h.howEyebrow}>FIRST TIME ORDERING?</p>
      <h2>How it works</h2>
      <div className={h.howGrid}>
        {STEPS.map((st, n) => (
          <div key={st.title} className={h.howCard}>
            <span className={h.howNum}>{n + 1}</span>
            <st.Icon size={30} strokeWidth={1.7} />
            <h3>{st.title}</h3>
            <p>{st.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section>
      <div className={h.gutter}>
        <SectionTitle eyebrow="REAL FARMERS, REAL RESULTS" title="Hear it from them" />
      </div>
      <div className={h.tScroll}>
        {TESTIMONIALS.map((t) => (
          <article key={t.name} className={h.tCard}>
            <header>
              <span className={h.tAvatar}>{t.name[0]}</span>
              <span className={h.tWho}>
                <b>{t.name}</b>
                <small>{t.place}</small>
              </span>
              <span className={h.tStars}>
                {[0, 1, 2, 3, 4].map((n) => (
                  <Star key={n} size={15} fill="currentColor" strokeWidth={0} />
                ))}
              </span>
            </header>
            <blockquote>&ldquo;{t.text}&rdquo;</blockquote>
            <footer>
              <span className={h.tVerified}>✓ VERIFIED FARMER</span>
              <span className={h.tProduct}>{t.product.toUpperCase()}</span>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

function AppBanner() {
  return (
    <section className={h.appBanner}>
      <h2>Download the Gau Sampurna app</h2>
      <p>Get veterinary advice in your language. Photos, audio, video — your village vet in your pocket.</p>
      <GooglePlayButton dark />
    </section>
  );
}

function BeforeYouOrder() {
  const [open, setOpen] = useState(0);
  return (
    <section className={h.gutter}>
      <SectionTitle eyebrow="COMMON QUESTIONS" title="Before you order" />
      <div className={h.faqList}>
        {HOME_FAQ.map((f, n) => (
          <Accordion key={f.q} q={f.q} a={f.a} open={open === n} onToggle={() => setOpen(open === n ? -1 : n)} />
        ))}
      </div>
    </section>
  );
}

function Recognised() {
  return (
    <section className={h.recognised}>
      <p className={s.eyebrow}>RECOGNISED BY</p>
      <div className={h.recGrid}>
        {RECOGNISED.map((r) => (
          <span key={r.name} className={h.recTile}>
            <img src={r.src} alt={r.name} />
          </span>
        ))}
      </div>
    </section>
  );
}

// ---------- Desktop ----------

const WHY = [
  { title: "1,00,000+ Farmers Trust Us", text: "Dairy farmers across Karnataka use Gau Sampurna every day." },
  { title: "Pay Only On Delivery", text: "No advance. Pay cash when the pack is in your hand." },
  { title: "A Real Person Answers", text: `Call ${PHONE}. Our team speaks your language.` },
  { title: "Direct From The Company", text: "Every pack comes from us. No duplicates, no middlemen." },
  { title: "Results You Can See", text: "More milk, healthier cattle, visible in days, not months." },
  { title: "Delivery To Your Village", text: "We deliver in Karnataka, Andhra Pradesh, Telangana, and Punjab." },
];

const D_STEPS = [
  { title: "Tell Us Your Cow's Problem", text: "Less milk? Weak calf? Cracked teats? Call or WhatsApp our team, and we will tell you the right product.", cta: `Unsure? Call ${PHONE}` },
  { title: "Place Your Order, Pay Nothing Now", text: "Order on WhatsApp, by phone, or right here on this site. No advance payment.", cta: "Shop Products" },
  { title: "We Confirm, Then Deliver To Your Door", text: "Our team calls you to confirm your order. Pay cash when the pack reaches your hand.", cta: "Track Order" },
  { title: "Feed As Per The Pack, See The Change", text: "Mix it into the daily feed as written on the pack. Results show within days. Call us anytime if you have a question.", cta: "Help & Support" },
];

const FAQ_TABS = ["All", "Delivery", "Invoicing", "Shipping", "Returns", "Customer Service"];

function DesktopHome(props: ScreenProps) {
  const nav = useNav(props);
  const [faq, setFaq] = useState(0);
  return (
    <Page nav={props} overlay={<WhatsAppFab />}>
      <DesktopHomeHeader />
      <div className={h.dWrap}>
        <section className={h.dHero} style={{ backgroundImage: `url(${img("d-hero.webp")})` }}>
          <div className={h.dHeroCopy}>
            <h1>
              HEALTHIER COWS,
              <br />
              HIGHER PROFITS
            </h1>
            <p>All you need for cattle care, veterinary advice, health products, nutrition, disease prevention, and daily tips.</p>
            <div className={h.dHeroCtas}>
              <button type="button" className={h.dHeroPrimary} onClick={props.next}>
                Shop Products <ChevronRight size={14} />
              </button>
              <span className={h.dHeroGhost}>
                <Phone size={14} /> Call {PHONE}
              </span>
            </div>
            <div className={h.dTrusted}>
              <span className={h.dAvatars}>
                <img src={img("farmer1.webp")} alt="" />
                <img src={img("farmer2.webp")} alt="" />
                <img src={img("farmer3.webp")} alt="" />
              </span>
              <b>
                Trusted by 1,00,000+
                <br />
                Happy Farmers
              </b>
            </div>
          </div>
        </section>

        <section className={h.dCatBand}>
          <div className={h.dCatIntro}>
            <h2>Shop by Category</h2>
            <p>Find the right products for every cattle health need.</p>
            <button type="button" onClick={nav.products}>
              View All Products <ChevronRight size={13} />
            </button>
          </div>
          <div className={h.dCatRow}>
            {CATEGORIES.map((c) => (
              <button key={c.name} type="button" className={h.dCat} onClick={nav.products}>
                <img src={c.image} alt="" />
                {c.name}
              </button>
            ))}
          </div>
          <span className={h.dCatNext} aria-hidden="true">
            <ChevronRight size={16} />
          </span>
        </section>

        <section>
          <div className={h.dSecHead}>
            <div>
              <h2>Best Sellers</h2>
              <p>Top rated products loved by thousands of farmers</p>
            </div>
            <button type="button" className={h.dOutline} onClick={nav.products}>
              View All Products <ChevronRight size={13} />
            </button>
          </div>
          <div className={h.dBestGrid}>
            {PRODUCTS.slice(0, 5).map((p, n) => (
              <DesktopBestSeller key={p.id} p={p} best={n < 3} />
            ))}
          </div>
        </section>

        <section className={h.dWhy}>
          <h2>Why Choose Us?</h2>
          <div className={h.dWhyGrid}>
            {WHY.map((w, n) => (
              <div key={w.title} className={h.dWhyCard}>
                <span>
                  <img src={img(`why${n + 1}.webp`)} alt="" />
                </span>
                <div>
                  <h3>{w.title}</h3>
                  <p>{w.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={h.dHow}>
          <div className={h.dHowHead}>
            <h2>
              How It <b>Works</b>
            </h2>
            <p>Our mission is to make premium nutrition accessible to every farmer in India. Our process is designed for trust and ease.</p>
          </div>
          <div className={h.dHowGrid}>
            {D_STEPS.map((st, n) => (
              <div key={st.title} className={h.dHowCard}>
                <span className={h.dHowNum}>0{n + 1}</span>
                <i />
                <img src={img(`step${n + 1}.webp`)} alt="" />
                <h3>{st.title}</h3>
                <p>{st.text}</p>
                <span className={h.dHowCta} onClick={n === 1 ? nav.products : undefined}>
                  {st.cta} <ChevronRight size={12} />
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className={h.dFaq}>
          <div className={h.dFaqLeft}>
            <h2>Frequently Asked Questions</h2>
            <div className={h.dStill}>
              <h3>
                Still have questions? <span className={h.available}>Available</span>
              </h3>
              <p>Can&apos;t find the answer you&apos;re looking for? Speak with our support team for personalized assistance.</p>
              <span className={h.dCallBtn}>
                <Phone size={13} /> Call {PHONE}
              </span>
            </div>
          </div>
          <div className={h.dFaqRight}>
            <div className={h.dTabs}>
              {FAQ_TABS.map((t, n) => (
                <span key={t} className={cx(h.dTab, n === 0 && h.dTabOn)}>
                  {t}
                </span>
              ))}
            </div>
            {HOME_FAQ.map((f, n) => (
              <Accordion key={f.q} q={f.q} a={n === 0 ? "Yes! We deliver across all districts in Karnataka. Simply enter your PIN code at checkout to confirm delivery availability." : f.a} open={faq === n} onToggle={() => setFaq(faq === n ? -1 : n)} icon={false} />
            ))}
          </div>
        </section>

        <section className={h.dApp}>
          <img src={img("app-phones.webp")} alt="Gau Sampurna mobile app preview" className={h.dAppPhones} />
          <div>
            <h2>
              Download the <b>Gau Sampurna</b> App
            </h2>
            <h3>Everything your cattle need, right in your pocket.</h3>
            <p>Get personalized product recommendations, track your orders, access expert cattle care tips, and shop anytime, anywhere all from the Gau Sampurna app.</p>
            <GooglePlayButton />
          </div>
        </section>
      </div>
      <Footer />
    </Page>
  );
}
