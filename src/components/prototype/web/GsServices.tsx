"use client";

// The service pages of gausampurna.com, phone and desktop: Gau Swastha (components/GauSwasth),
// Cattle Trading (components/CattleTrading) and Ask a Vet (components/AskVet). Copy is the live
// pages'. Sections are shortened to the ones that carry the pitch; the vet form books a sample
// consultation (nothing is sent).
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Bot,
  Camera,
  CheckCircle2,
  Clock,
  Download,
  Globe,
  Heart,
  Headphones,
  Lightbulb,
  MessageCircle,
  Phone,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Stethoscope,
  TrendingUp,
  Upload,
  UserCheck,
  Users,
  Video,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import type { ScreenProps } from "../kissan/KissanScreens";
import v from "./gsServices.module.css";
import { img, useDesktop } from "./gsData";
import { Accordion, DesktopHeader, Footer, Page, SiteNav, WhatsAppFab, cx, scrollToId } from "./GsShared";

// ---------- Shared service-page pieces ----------

function Shell({ nav, children, overlay }: { nav: ScreenProps; children: ReactNode; overlay?: ReactNode }) {
  const desktop = useDesktop();
  return (
    <Page nav={nav} overlay={<><WhatsAppFab />{overlay}</>}>
      {desktop ? <DesktopHeader /> : <SiteNav />}
      {children}
      <Footer />
    </Page>
  );
}

function Badge({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className={v.badge}>
      {icon}
      {children}
    </span>
  );
}

function Head({ badge, icon, title, accent, after, sub }: { badge: string; icon: ReactNode; title: string; accent?: string; after?: string; sub?: string }) {
  return (
    <div className={v.head}>
      <Badge icon={icon}>{badge}</Badge>
      <h2>
        {title} {accent && <em>{accent}</em>}
        {after && <> {after}</>}
      </h2>
      {sub && <p>{sub}</p>}
    </div>
  );
}

function Testimonials({ items }: { items: { name: string; text: string }[] }) {
  return (
    <section className={v.section}>
      <Head badge="Trusted by 10,000+ Farmers" icon={<Users size={13} />} title="What Our Farmers Say" accent="About Us" sub="Real experiences from farmers managing their cattle with our solutions." />
      <div className={v.tRow}>
        {items.map((t) => (
          <article key={t.name} className={v.tCard}>
            <header>
              <span className={v.tAvatar}>
                <Users size={20} />
              </span>
              <b>{t.name}</b>
              <i className={v.quoteMark}>❝</i>
            </header>
            <p>{t.text}</p>
            <footer>
              <span className={v.tStars}>
                {[0, 1, 2, 3, 4].map((n) => (
                  <Star key={n} size={13} fill="currentColor" strokeWidth={0} />
                ))}
              </span>
              <small>★ 5.0</small>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(-1);
  return (
    <section className={v.section}>
      <Head badge="Got Questions? We've Got Answers" icon={<MessageCircle size={13} />} title="Frequently Asked" accent="Questions" />
      <div className={v.faqGrid}>
        {items.map((f, n) => (
          <Accordion key={f.q} q={f.q} a={f.a} open={open === n} onToggle={() => setOpen(open === n ? -1 : n)} icon={false} />
        ))}
      </div>
      <div className={v.help}>
        <Badge icon={<Sparkles size={12} />}>Still Have Questions?</Badge>
        <h3>Need More Help?</h3>
        <p>Our support team is always ready to help you</p>
        <div>
          <span className={v.helpWhite}>
            <Headphones size={14} /> Contact Support
          </span>
          <span className={v.helpGhost}>💬 WhatsApp Us</span>
        </div>
      </div>
    </section>
  );
}

function StepPhone({ n, src, alt }: { n: number; src: string; alt: string }) {
  return (
    <div className={v.stepPhone}>
      <img src={src} alt={alt} />
      <span>{n}</span>
    </div>
  );
}

// ---------- Gau Swastha ----------

const GS_SLIDES = [
  { src: img("gs-car1.webp"), title: "Gau Swastha - Cattle Health Scanner", sub: "Precision Cow Health at Your Fingertips.", cta: "Start Health Scan" },
  { src: img("gs-car2.webp"), title: "Scan Cow Images For Health Report", sub: "One Photo, Complete Insights.", cta: "Get Precision Report" },
];

const GS_STATS = [
  { big: "35", unit: "sec", text: "Get your cattle diagnosed in 35 seconds." },
  { big: "15+", text: "Different health parameters analyzed" },
  { big: "95%", text: "AI accuracy in health assessment" },
  { big: "24/7", text: "Available anytime, anywhere" },
];

const GS_STEPS = [
  { Icon: Upload, title: "Upload Photo", text: "Take a high quality image of your cow and upload it to our Gau Swastha Cattle health scanner.", cta: "Try Upload Photo Now", shot: "gs-step1.webp" },
  { Icon: Bot, title: "AI Analysis", text: "Our advanced Gau Swastha AI scans and analyzes your cattle's health condition using cutting-edge computer vision technology.", cta: "Try AI Analysis Now", shot: "gs-step2.webp" },
  { Icon: Download, title: "Get Report", text: "Receive a comprehensive health report with detailed diagnosis, health score, and expert treatment recommendations instantly.", cta: "Try Get Report Now", shot: "gs-step3.webp" },
];

const GS_REPORT = [
  ["Body Weight Monitoring", "Track changes in your cow's weight for nutritional and health assessments."],
  ["Decision Support (Buy/Sell)", "Informed recommendations on whether to buy or sell a cow based on its health metrics."],
  ["Milk Production Capacity", "An estimated projection of your cow's milk yield."],
  ["Market Value Assessment", "A data-driven estimation of your cow's current market value."],
  ["Reproductive Ability", "Insights into the breeding potential and reproductive health of your cow."],
  ["Cow Udder Sampling & Health Recommendations", "Specific advice related to udder health."],
  ["Diagnosis & prevention of common cattle diseases", "Key insights to help you detect and prevent the most common cattle problems."],
  ["Nutritional Recommendations", "Customized feeding plans to ensure optimal health and productivity."],
];

const GS_METHODS = [
  { Icon: Smartphone, title: "Through the Gau Sampurna App", text: "Download our mobile app for the most convenient cattle health scanning experience", steps: ["Download the Gau Sampurna App from your app store", "Register your mobile number and create your account within the app", 'Tap on the "Gau Swastha" section', "Upload a clear left-side image of your cow"], cta: "Download App" },
  { Icon: Globe, title: "Through Our Website", text: "Access our web-based platform directly from your browser for instant analysis", steps: ["Visit our website in your browser", "Select your preferred language", "Register your mobile number on the website", "Upload a clear left-side image of your cow"], cta: "Visit Website" },
  { Icon: MessageCircle, title: "Using Gau Swastha WhatsApp Number", text: "Get your cattle health report directly through WhatsApp for ultimate convenience", steps: ["Save our dedicated Gau Swastha WhatsApp number: 95352 11780 to your mobile contacts", 'Send "Hi" to the Gau Swastha WhatsApp number', "Select your preferred language from the options provided", "Upload a clear left-side image of your cow"], cta: "Start WhatsApp Chat" },
];

const GS_FAQ = [
  { q: "What is Gau Swastha?", a: "Gau Swastha is India’s first AI-powered tool that analyses a cow’s health and generates a comprehensive report from a single image. It provides insights into weight, milk yield, market price, breeding capacity, and more." },
  { q: "What kind of image do I need to upload for analysis?", a: "For best results, please upload a clear, well-lit image of your cow’s left side. Ensure the entire body is visible in the frame, with no obstructions." },
  { q: "Can Gau Swastha help with disease diagnosis?", a: "Gau Swastha provides diagnostic insights and recommendations for preventing common diseases based on observable physical characteristics. However, it is not a substitute for a veterinarian’s direct examination and professional diagnosis, especially in complex or acute health cases. Always consult a qualified veterinarian if your animal is sick." },
  { q: "How long does it take to get the health report?", a: "Once you upload the image and complete the payment, the AI quickly analyses it, and your complete health report is usually ready for download within minutes." },
  { q: "Can I get reports for multiple cows?", a: "Yes, you can generate reports for multiple cows by submitting individual images and completing the process for each cow." },
];

export function GsSwastha(props: ScreenProps) {
  const [slide, setSlide] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setSlide((n) => (n + 1) % GS_SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);
  const sl = GS_SLIDES[slide];
  return (
    <Shell nav={props}>
      <section className={v.hero}>
        {GS_SLIDES.map((x, n) => (
          <img key={x.src} src={x.src} alt={x.title} className={cx(v.heroImg, n === slide && v.heroImgOn)} />
        ))}
        <div className={v.heroShade} />
        <div className={cx(v.heroCopy, v.heroLow)}>
          <Badge icon={<Sparkles size={12} />}>AI-Driven Health Solutions for Your Cow</Badge>
          <h1>{sl.title}</h1>
          <p>{sl.sub}</p>
          <button type="button" className={v.btnBlue} onClick={() => scrollToId("gs-report")}>
            {sl.cta} <ArrowRight size={15} />
          </button>
        </div>
        <div className={v.heroDots}>
          {GS_SLIDES.map((x, n) => (
            <button key={x.src} type="button" className={cx(v.heroDot, n === slide && v.heroDotOn)} onClick={() => setSlide(n)} aria-label={`Slide ${n + 1}`} />
          ))}
        </div>
      </section>

      <section className={cx(v.section, v.intro)}>
        <div className={v.introText}>
          <Badge icon={<Smartphone size={13} />}>#1 AI-Powered Cattle Health Solution</Badge>
          <h2 className={v.bigTitle}>
            Gau Swastha <em>India&apos;s First AI Tool</em> That Detects Cow Health from a Single Photo
          </h2>
          <p>Gone are the days of guesswork in cattle care. With Gau Swastha, you can get a complete health report for your dairy cow with just one photo. This simple and innovative solution allows you to assess your cow&apos;s health directly from your phone or computer—anytime, anywhere.</p>
        </div>
        <div className={v.reportCard}>
          <h3>Get Your Cow Report</h3>
          <small>AI-powered cattle health diagnosis</small>
          <img src={img("gs-hero.webp")} alt="Gau Swastha AI Scanner demonstration" />
          <ul>
            <li>
              <CheckCircle2 size={15} /> Instant AI analysis
            </li>
            <li>
              <CheckCircle2 size={15} /> Comprehensive report for only ₹49
            </li>
            <li>
              <CheckCircle2 size={15} /> Trusted by thousands of farmers
            </li>
          </ul>
          <button type="button" className={v.btnNavy} onClick={() => scrollToId("gs-report")}>
            Get Report Now <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section className={cx(v.section, v.tinted)}>
        <Head badge="Advanced AI-Powered Features" icon={<Sparkles size={13} />} title="Why Choose" accent="Gau Swastha?" sub="An advanced AI-based tool designed to analyse your cow's body and provide a comprehensive health report, utilizing sophisticated algorithms to deliver valuable insights and detailed health records." />
        <div className={v.stats}>
          {GS_STATS.map((st) => (
            <div key={st.text}>
              <b>
                {st.big}
                {st.unit && <small> {st.unit}</small>}
              </b>
              <p>{st.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={v.section}>
        <Head badge="Simple 3-Step Process" icon={<Zap size={13} />} title="How" accent="Gau Swastha" after="Works" sub="Get instant cattle health insights in just 3 simple steps. No Expertise Needed. Just one click and get result!" />
        <div className={v.zigzag}>
          {GS_STEPS.map((st, n) => (
            <div key={st.title} className={cx(v.zig, n % 2 === 1 && v.zigFlip)}>
              <div className={v.zigCard}>
                <span className={v.zigIcon}>
                  <st.Icon size={20} />
                </span>
                <h3>{st.title}</h3>
                <p>{st.text}</p>
                <span className={v.btnNavySm}>
                  {st.cta} <ArrowRight size={13} />
                </span>
              </div>
              <StepPhone n={n + 1} src={img(st.shot)} alt={`${st.title} screen`} />
            </div>
          ))}
        </div>
      </section>

      <section className={cx(v.section, v.tinted)} id="gs-report">
        <Head badge="Comprehensive Health Report" icon={<ShieldCheck size={13} />} title="What's Included in Your" accent="Cow Health Report?" sub="Each comprehensive Gau Swastha report provides critical information to help you manage your herd effectively" />
        <div className={v.included}>
          <ul className={v.incList}>
            {GS_REPORT.map(([k, t]) => (
              <li key={k}>
                <i />
                <span>
                  <b>{k}:</b> {t}
                </span>
              </li>
            ))}
          </ul>
          <div className={v.pdfCard}>
            <h3>Comprehensive Health Analysis</h3>
            <img src={img("gs-report.webp")} alt="Gau Swasth Report PDF" />
            <small>Get your detailed PDF report with comprehensive analysis and recommendations</small>
          </div>
        </div>
        <div className={v.center}>
          <span className={v.btnNavy}>
            Generate Your Report Now <ArrowRight size={16} />
          </span>
          <small className={v.muted}>Only ₹49 - Get instant access to your cow&apos;s health insights</small>
        </div>
      </section>

      <section className={v.section}>
        <Head badge="Multiple Access Methods" icon={<Wand2 size={13} />} title="Get Your Cattle Health Report:" accent="Three Convenient Methods" sub="Choose the method that suits you best to access your cow's health report" />
        <div className={v.methods}>
          {GS_METHODS.map((m) => (
            <div key={m.title} className={v.method}>
              <span className={v.methodIcon}>
                <m.Icon size={20} />
              </span>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
              <ol>
                {m.steps.map((x, n) => (
                  <li key={x}>
                    <span>{n + 1}</span>
                    {x}
                  </li>
                ))}
              </ol>
              <span className={v.btnNavyFull}>
                {m.cta} <ArrowRight size={14} />
              </span>
            </div>
          ))}
        </div>
      </section>

      <Testimonials
        items={[
          { name: "Kumar", text: '"In my dairy farm, we now use Gau Swastha to check the health of all our cows. No need to wait for the veterinary doctor to come. Sitting at home, I get the report on my phone. Very convenient!"' },
          { name: "Gowramma", text: '"Earlier it was difficult to estimate the weight of the cow. Now with Gau Swastha, I get accurate weight information. I also get tips on what to do for milk production. This is truly a boon for farmers!"' },
          { name: "Suresh", text: '"I used it to check the health of the new calf on our farm. This helped me understand if its growth was proper. Good product!"' },
        ]}
      />
      <Faq items={GS_FAQ} />
    </Shell>
  );
}

// ---------- Cattle Trading ----------

const CT_STEPS = [
  { Icon: Camera, title: "1. Upload Your Cattle Photo", text: "Upload high quality photo of your cattle with essential information like Breed, Age, Lactation, market price etc.", shot: "ct-step1.webp" },
  { Icon: ShieldCheck, title: "2. Scan for Price & Health", text: "Our AI tool or WhatsApp bot can be used to assess the market value and health score (Optional).", shot: "ct-step2.webp" },
  { Icon: UserCheck, title: "3. Go Live and Get Buyers", text: "Buyers can directly message sellers or make offers, enabling secure and transparent cattle trading online without middlemen.", shot: "ct-step3.webp" },
];

const CT_SCAN = [
  { Icon: TrendingUp, title: "Instant Price Estimation", text: "Get an instant price estimate from a photo." },
  { Icon: Heart, title: "Health Scoring", text: "Health assessment using an AI model." },
  { Icon: Lightbulb, title: "Auto-fill Details", text: "Auto-fill breed, weight, and age – saves time." },
  { Icon: ScanLine, title: "Flexible Scanning", text: "Option to scan via WhatsApp or in-app camera." },
];

const CT_GET = [
  { Icon: Phone, title: "Direct buyer call on WhatsApp", text: "Verified buyers contact you directly" },
  { Icon: ShieldCheck, title: "Consult with vet before pickup", text: "Optional veterinary consultation" },
  { Icon: Bell, title: "WhatsApp notifications", text: "Get notified of buyer inquiries instantly" },
  { Icon: Clock, title: "Quick response support", text: "24/7 customer support available" },
];

const CT_TRUST = [
  { Icon: Users, title: "No Middlemen", text: "Communicate directly with buyers" },
  { Icon: Bot, title: "AI Support", text: "Price estimation and health insights." },
  { Icon: TrendingUp, title: "Quick Sales", text: "Most listings get sold in less than 5 days." },
  { Icon: Star, title: "Payment after Buyer Confirmation", text: "Secure & transparent payment process" },
  { Icon: ShieldCheck, title: "Vet Facility", text: "Optional expert assistance from a vet for your cattle" },
  { Icon: BadgeCheck, title: "Verified Buyers", text: "Only verified and trusted buyers." },
];

const CT_FAQ = [
  { q: "How to sell cows in GauSampurna?", a: "Register in gausampurna app or website. In the cattle trading section, post your cow and get notified if someone wants to buy your cow." },
  { q: "Do you charge for posting cattle?", a: "No! You can post a maximum of 5 cattle for free." },
  { q: "Can anyone view my listing?", a: "Your listing is visible to local buyers who can reach out to you directly." },
  { q: "What is AI scanner?", a: "Upload a sharp image — our technology identifies health, breed, weight, and provides an estimate of the price." },
  { q: "Can I seek assistance from a vet?", a: "Yes, you can schedule a video consultation with our licensed vet at any time." },
  { q: "How are payments handled?", a: "The buyer pays upon pickup and confirmation — 100% secure and transparent." },
];

export function GsTrading(props: ScreenProps) {
  return (
    <Shell nav={props}>
      <section className={cx(v.hero, v.heroCenter)}>
        <img src={img("ct-hero.webp")} alt="Cattle trading background" className={cx(v.heroImg, v.heroImgOn)} />
        <div className={v.heroShade} />
        <div className={v.heroCopy}>
          <h1>
            Buy &amp; Sell Healthy Cattle Online – <em>Fast, Easy &amp; Trusted</em>
          </h1>
          <p className={v.heroBold}>Sell your cow or buffalo in 2 minutes. Verified buyers, AI health scan, and vet support included.</p>
          <div className={v.heroBtns}>
            <button type="button" className={v.btnNavy} onClick={() => scrollToId("ct-steps")}>
              Post Cattle Now – It&apos;s FREE!
            </button>
            <button type="button" className={v.btnOutline} onClick={() => scrollToId("ct-scan")}>
              Check Price via AI Scan
            </button>
          </div>
        </div>
      </section>

      <section className={v.section}>
        <Head badge="Connecting Farmers" icon={<Users size={13} />} title="Welcome" accent="to the Cattle Trading" sub="Trusted cattle trading platform for buying and selling cows and buffaloes. If you are looking to expand your herd or wanting to sell healthy, productive cattle, our platform connects you directly with verified buyers and sellers near you." />
      </section>

      <section className={v.section} id="ct-steps">
        <Head badge="Simple 3-Step Process" icon={<Zap size={13} />} title="Post Your Cattle in" accent="3 Easy Steps" sub="Simple process to get your cattle in front of genuine buyers" />
        <div className={v.zigzag}>
          {CT_STEPS.map((st, n) => (
            <div key={st.title} className={cx(v.zig, n % 2 === 1 && v.zigFlip)}>
              <div className={v.zigCard}>
                <span className={v.zigIcon}>
                  <st.Icon size={20} />
                </span>
                <h3>{st.title}</h3>
                <p>{st.text}</p>
              </div>
              <StepPhone n={n + 1} src={img(st.shot)} alt={st.title} />
            </div>
          ))}
        </div>
        <div className={v.center}>
          <span className={v.btnNavy}>
            Start Listing Now <ArrowRight size={15} />
          </span>
        </div>
      </section>

      <section className={cx(v.section, v.tinted)} id="ct-scan">
        <Head badge="AI-Powered Technology" icon={<Sparkles size={13} />} title="AI-Powered" accent="Cattle Scanner" />
        <p className={v.freeWith}>(Free with Listing)</p>
        <div className={v.scanGrid}>
          <div className={v.feat4}>
            {CT_SCAN.map((f) => (
              <div key={f.title} className={v.feat}>
                <span className={v.featIcon}>
                  <f.Icon size={16} />
                </span>
                <b>{f.title}</b>
                <small>{f.text}</small>
              </div>
            ))}
            <div className={v.scanBtns}>
              <span className={v.btnNavySm}>Scan through WhatsApp</span>
              <span className={v.btnOutlineSm}>
                <Smartphone size={13} /> Use AI Scanner in App
              </span>
            </div>
          </div>
          <img src={img("gs-report.webp")} alt="Gau Swasth Analysis" className={v.scanReport} />
        </div>
      </section>

      <section className={v.section}>
        <Head badge="Premium Benefits" icon={<Star size={13} />} title="What You Get With" accent="Every Listing" sub="Complete support from listing to sale with our comprehensive platform" />
        <div className={v.cards4}>
          {CT_GET.map((f) => (
            <div key={f.title} className={v.whiteCard}>
              <span className={v.methodIcon}>
                <f.Icon size={18} />
              </span>
              <b>{f.title}</b>
              <small>{f.text}</small>
            </div>
          ))}
        </div>
        <div className={v.center}>
          <span className={v.btnNavy}>Post Your Cattle for Free</span>
          <small className={v.muted}>Join thousands of satisfied sellers</small>
        </div>
      </section>

      <section className={cx(v.section, v.tinted)}>
        <Head badge="Trusted Platform" icon={<ShieldCheck size={13} />} title="Why" accent="Farmers Trust Us" sub="Built by farmers, for farmers, using cutting-edge technology." />
        <div className={v.trust6}>
          {CT_TRUST.map((f) => (
            <div key={f.title}>
              <span className={v.trustIcon}>
                <f.Icon size={22} />
              </span>
              <b>{f.title}</b>
              <small>{f.text}</small>
            </div>
          ))}
        </div>
      </section>

      <Testimonials
        items={[
          { name: "Ravi", text: '"Sold buffalo in 2 days using the app. Received ₹3,000 more than mandi price!"' },
          { name: "Anita", text: '"AI scanner identified sickness early and vet treated it quickly."' },
          { name: "Kishore", text: '"Too easy! Uploaded a pic and began receiving calls."' },
        ]}
      />
      <section className={v.ready}>
        <h2>Ready to Start Selling?</h2>
        <p>Join thousands of farmers who trust us for their cattle trading needs</p>
        <span className={v.helpWhite}>Download App &amp; Start Selling</span>
      </section>
      <Faq items={CT_FAQ} />
    </Shell>
  );
}

// ---------- Ask a Vet ----------

const VET_SERVICES = [
  { Icon: Smartphone, title: "From Your Farm", text: "Consult from the comfort of your home — no need to transport sick animals." },
  { Icon: Stethoscope, title: "Certified Vets", text: "Get access to qualified veterinary doctors who specialize in cattle care." },
  { Icon: Heart, title: "Farmer-Friendly Care", text: "Fast, affordable, and accessible animal care, designed for farmers." },
  { Icon: Video, title: "Virtual Vet Visits", text: "Complete online consultations with video calls and detailed assessments" },
];

const VET_STEPS = [
  { title: "Register on Gau Sampurna", text: "Sign up with just your mobile number and a few basic details — quick and simple.", shot: "vet-vetLogin.webp" },
  { title: "Fill up the consultation form", text: "Share your cattle’s basic details — breed, age, and any specific concerns you may have.", shot: "vet-vetForm.webp" },
  { title: "Describe your cattle's problem", text: "Share detailed symptoms, upload photos if needed, and describe the specific health issues your cattle are experiencing.", shot: "vet-vetProblem.webp" },
  { title: "Get a call or video consultation", text: "Get personalized consultation and treatment recommendations from our certified veterinary experts through call or video.", shot: "vet-vetVideo.webp" },
];

const VET_FAQ = [
  { q: "How do I book a consultation?", a: "Book by filling out the form or tap the WhatsApp button for instant help." },
  { q: "How long does it take to get a response?", a: "Usually within 30 minutes during working hours. Emergency cases are given priority." },
  { q: "Can I send photos or videos of the problem?", a: "Absolutely! You can upload photos during booking or send them via WhatsApp for better diagnosis." },
  { q: "What types of animals do you consult for?", a: "We primarily consult for cows, buffaloes and calves." },
  { q: "Is there a charge for consultation?", a: "Consultations can be free or paid, based on the type of service you need." },
  { q: "Can I speak in my local language?", a: "Yes, our vet team includes professionals who can speak Hindi, Kannada, English and other local languages." },
];

export function GsVet(props: ScreenProps) {
  const [booked, setBooked] = useState(false);
  const [form, setForm] = useState({ name: "Ramesh Patil", mobile: "9876543210", type: "Cow", age: "5", weight: "350", pregnant: "No", problem: "Milk yield has dropped for a week and she is eating less." });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });

  const modal = booked && (
    <div className={v.modalWrap}>
      <div className={v.modal} role="dialog" aria-modal="true">
        <button type="button" className={v.modalClose} onClick={() => setBooked(false)} aria-label="Close">
          <X size={16} />
        </button>
        <span className={v.modalTick}>
          <CheckCircle2 size={30} />
        </span>
        <h3>Consultation Booked Successfully!</h3>
        <p>Your veterinary consultation request has been submitted successfully. Our expert will contact you within 24 hours.</p>
        <button type="button" className={v.modalBtn} onClick={() => setBooked(false)}>
          Continue
        </button>
        <small>Sample booking: nothing was sent.</small>
      </div>
    </div>
  );

  return (
    <Shell nav={props} overlay={modal}>
      <section className={v.hero}>
        <img src={img("vet-hero.webp")} alt="Veterinary consultation background" className={cx(v.heroImg, v.heroImgOn, v.vetHeroImg)} />
        <div className={v.heroShade} />
        <div className={v.heroCopy}>
          <Badge icon={<Video size={12} />}>Online Veterinary Consultation</Badge>
          <h1>
            Consult a Vet Online
            <em className={v.sky}>Anytime, Anywhere</em>
          </h1>
          <p>No need to leave your farm or wait for hours, connect with a qualified veterinary doctor for cows and buffaloes right from your mobile.</p>
          <div className={v.heroChips}>
            <span>
              <Clock size={14} /> 24/7 Available
            </span>
            <span>
              <Smartphone size={14} /> Mobile Friendly
            </span>
            <span>
              <Video size={14} /> Video Consultation
            </span>
          </div>
          <button type="button" className={v.btnNavy} onClick={() => scrollToId("vet-form")}>
            Start Consultation Now <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section className={v.section}>
        <Head badge="Modern Veterinary Care" icon={<Stethoscope size={13} />} title="Why Online Veterinary Consultation?" sub="In today’s fast-paced world, farmers often need instant access to expert veterinary care. Our online vet consultation service is designed for convenience, accuracy, and trust. Whenever you need veterinary doctors for cows, our expert vets will be there to give your cattle’s the attention they deserve." />
        <p className={v.callout}>Our online veterinary service offers comprehensive support, from virtual consultations to expert advice for your livestock.</p>
        <div className={v.head}>
          <h2 className={v.h2Plain}>Our Complete Veterinary Services</h2>
          <p>Comprehensive cattle care made simple — all available on one platform.</p>
        </div>
        <div className={v.cards4}>
          {VET_SERVICES.map((f) => (
            <div key={f.title} className={v.blueCard}>
              <span className={v.gradIcon}>
                <f.Icon size={20} />
              </span>
              <b>{f.title}</b>
              <small>{f.text}</small>
            </div>
          ))}
        </div>
      </section>

      <section className={cx(v.section, v.tinted)}>
        <Head badge="Simple Process" icon={<CheckCircle2 size={13} />} title="How" accent="It Works" sub="Get expert veterinary consultation for your cattle in just 4 simple steps" />
        <div className={v.vetSteps}>
          {VET_STEPS.map((st, n) => (
            <div key={st.title} className={cx(v.vetStep, n % 2 === 1 && v.zigFlip)}>
              <img src={img(st.shot)} alt={st.title} />
              <div>
                <span className={v.stepChip}>Step {n + 1}</span>
                <h3>{st.title}</h3>
                <p>{st.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={v.section} id="vet-form">
        <Head badge="Book Consultation" icon={<Phone size={13} />} title="Book Your Consultation" sub="Fill in the details below, and our expert veterinarians will get back to you shortly." />
        <form
          className={v.form}
          onSubmit={(e) => {
            e.preventDefault();
            setBooked(true);
          }}
        >
          <label>
            Your Name <i>*</i>
            <input value={form.name} onChange={set("name")} placeholder="Enter your name" />
          </label>
          <label>
            Mobile Number <i>*</i>
            <input value={form.mobile} onChange={set("mobile")} placeholder="Enter your number" inputMode="numeric" />
          </label>
          <label>
            Cattle Type <i>*</i>
            <select value={form.type} onChange={set("type")}>
              <option>Cow</option>
              <option>Buffalo</option>
            </select>
          </label>
          <label>
            Age (in years) <i>*</i>
            <input value={form.age} onChange={set("age")} placeholder="e.g. 3" inputMode="numeric" />
          </label>
          <label>
            Weight (in kg) <i>*</i>
            <input value={form.weight} onChange={set("weight")} placeholder="e.g. 350" inputMode="numeric" />
          </label>
          <label>
            Pregnant? <i>*</i>
            <select value={form.pregnant} onChange={set("pregnant")}>
              <option>Yes</option>
              <option>No</option>
              <option>Not Sure</option>
            </select>
          </label>
          <div className={v.upload}>
            <span>Upload Cattle Photo</span>
            <div>
              <Upload size={20} />
              <b>Choose File</b>
              <small>Supported formats: JPG, PNG (Max 5MB)</small>
            </div>
          </div>
          <label className={v.full}>
            Describe the problem faced by cattle <i>*</i>
            <textarea value={form.problem} onChange={set("problem")} rows={3} placeholder="Describe symptoms, behavior changes, etc." />
          </label>
          <button type="submit" className={cx(v.btnNavy, v.formSubmit)}>
            Book Consultation
          </button>
        </form>
      </section>

      <Testimonials
        items={[
          { name: "Ramesh Yadav", text: '"My cow suddenly became very weak and her stomach was swelling. I got really scared. Then I called the Gau Sampurna doctor. He told me a home remedy that I can do myself. Within some time, my cow started getting better."' },
          { name: "Geeta Bai", text: '"My cow had a small wound on her foot, and pus was coming out. I sent that photo on WhatsApp to Gau Sampurna. Their doctor replied quickly and told me which cream to apply. I used it and in a few days, the wound dried up and my cow started walking fine."' },
          { name: "Nagaraj", text: '"The doctors are very supportive and professional. I just sent a photo of my cow, and they quickly helped me with the right advice. It was simple, fast, and really effective!"' },
        ]}
      />
      <Faq items={VET_FAQ} />
    </Shell>
  );
}
