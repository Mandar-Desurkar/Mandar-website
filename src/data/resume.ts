// Single source of truth for portfolio content, kept in sync with the resume.
// Text wrapped in **double asterisks** renders bold (see components/RichText.tsx).

export const profile = {
  name: "Mandar Desurkar",
  role: "Associate Product Manager",
  location: "Bangalore, India",
  email: "mandardesurkar3@gmail.com",
  phone: "+91 8073118693",
  linkedin: "https://www.linkedin.com/in/mandar-desurkar/",
  // Export the resume PDF from Overleaf to public/resume.pdf. Until it exists, the hero
  // falls back to "Connect on LinkedIn" + "Get in touch".
  resumeUrl: "/resume.pdf",
  // Short hero line; keep it to about 3 lines so the About window fits without scrolling.
  // Supports **bold** via RichText.
  intro:
    "I take AI-powered products from 0→1, from the first PRD to launch, growth and monetization. Currently Associate PM at Silo Fortune, building agritech apps for India's farmers.",
  // Full resume summary, for longer-form use (e.g. structured data).
  summary:
    "Associate Product Manager with 2.5+ years of owning AI-powered 0→1 products, from strategy, PRDs and roadmaps to launch, growth and monetization. I grew two agritech apps to 250K+ installs, shipped computer-vision diagnostics and satellite farm monitoring, and built the CRM and last-mile stack behind ₹1 Cr+ of sales a month.",
  metaDescription:
    "Associate Product Manager building AI-powered 0→1 products: 250K+ app installs, 3× trial conversion, and the CRM behind ₹1 Cr+ in monthly sales.",
};

// One-time macOS-style notification shown ~20s into a first visit (HiringNotification.tsx)
export const hiringNudge = {
  title: "📬 Open to PM roles",
  body: "Looking for my next Product Manager role, building AI-powered 0→1 products.",
  cta: "Let's talk",
};

// "Apps I've built" shelf under the hero photo. Tapping the icon runs the richest action
// available: the interactive prototype if there is one, otherwise the live website.
export type ShippedApp = {
  name: string;
  caption: string;
  icon: string;
  website: string;
  prototype?: "kissan-sampurna" | "gau-sampurna";
};

export const shippedApps: ShippedApp[] = [
  {
    name: "Kissan Sampurna",
    caption: "Crop advisory",
    icon: "/apps/kissan-sampurna-icon.png",
    website: "https://www.kissansampurna.com/",
    prototype: "kissan-sampurna",
  },
  {
    name: "Gau Sampurna",
    caption: "Dairy farming app",
    icon: "/apps/gau-sampurna-icon.png", // official app icon (prod app.json)
    website: "https://www.gausampurna.com/",
    prototype: "gau-sampurna",
  },
];

// Hero KPI cards count up from 0 to `value`; `decimals` is used only while counting, so small
// numbers (3, 1) still visibly tick before landing on the clean final value.
export const kpis = [
  { prefix: "", value: 250, suffix: "K+", decimals: 0, label: "App Installs" },
  { prefix: "", value: 3, suffix: "×", decimals: 1, label: "Trial Uplift" },
  { prefix: "₹", value: 1, suffix: " Cr+", decimals: 1, label: "Monthly Sales" },
];

// `prototype` makes the group title open an interactive app prototype (see src/components/prototype).
export type ExperienceGroup = { title?: string; prototype?: "kissan-sampurna"; bullets: string[] };

export type Experience = {
  role: string;
  company: string;
  period: string;
  summary: string;
  groups?: ExperienceGroup[];
  isFuture?: boolean;
};

export const experiences: Experience[] = [
  {
    role: "Chief Product Officer / Founder",
    company: "TBD",
    period: "Future",
    summary:
      "Building the next generation of intuitive tech. Leading product vision, scaling teams, and shipping category-defining products.",
    isFuture: true,
  },
  {
    role: "Associate Product Manager",
    company: "Silo Fortune Private Limited",
    period: "09/2025 - Present",
    summary:
      "Owning AI-powered 0→1 farmer apps and the sales and last-mile stack behind them, working with engineering, design and data science.",
    groups: [
      {
        title: "Kissan Sampurna & Gau Sampurna Apps: 0→1 Launch & AI Features",
        prototype: "kissan-sampurna",
        bullets: [
          "Led the launch of two farmer apps with a **15-person team** (Engineering, Design, Data Science) to **250K+ combined installs** and 20K+ MAU, and designed the V1 UI/UX hands-on in Figma, from user flows to developer-ready screens.",
          "**Shipped AI-powered satellite monitoring**, letting farmers geotag field boundaries on their phones to track crop health (via vegetation indices), disease risk and irrigation needs across the whole farm, with alerts in **13 languages**.",
          "Architected a no-code **crop recommendation engine** that ranks each farmer's **top 5 of 100+ crops** across **655K+ farm profiles** by climate zone, soil, budget and rotation.",
          "Integrated **computer vision models** that diagnose crop diseases with their **severity stage** and **20+ cattle diseases** from one photo, and estimate cattle price, BCS and dung score.",
          "Grew both apps into a one-stop farmer platform with a **32+ SKU** marketplace, weather alerts and market price forecasts.",
        ],
      },
      {
        title: "Kissan Sampurna & Gau Sampurna Apps: Growth & Monetization",
        bullets: [
          "Defined the **freemium monetization model**, keeping core advisory free to drive adoption while gating AI diagnostics behind a paid subscription.",
          "Lifted install-to-signup conversion **from 26% to 32%** by redesigning onboarding around drop-off funnel analytics.",
          "**Tripled install-to-trial conversion (2.4% → 8%)** with redesigned paywalls and behaviour-triggered engagement nudges, reaching **55% trial-to-paid**.",
        ],
      },
      {
        title: "Internal Sales CRM & Telecalling Platform",
        bullets: [
          "Delivered a 0→1 in-house CRM replacing legacy Excel tracking for **150+ telecallers**, now powering **₹1 Cr+ in monthly sales** across **130K+ leads/month**.",
          "Automated lead capture from D2C web and app channels for the **32+ SKU** catalog, following each customer from first touchpoint to repeat purchase.",
          "Engineered **rule-based lead routing** by agent language, region and lead source, matching every farmer with a local, same-language agent to sustain **9% lead-to-sale conversion**.",
          "Integrated Exotel click-to-call, auto-call recording and automated WhatsApp follow-up flows, eliminating manual dialing and **saving 6,000+ agent-hours/month** (~40 hours/agent).",
        ],
      },
      {
        title: "Sampurna Rider App & Outlet ERP: Last-Mile Logistics",
        bullets: [
          "Drove the 0→1 build of a custom rider app and outlet ERP, from PRD to UI/UX prototypes, replacing manual order fulfillment with end-to-end tracking from CRM sale to doorstep delivery.",
          "Architected serviceability-based order routing across **98 outlets in 4 states**, while piloting algorithmic rider assignment to eliminate manual order allocation by outlet managers.",
          "Deployed the rider app to **100+ in-house riders** handling **9K+ deliveries/month**, with in-app map navigation, photo + 4-digit OTP proof of delivery, and instant SMS/WhatsApp updates.",
          "Digitized doorstep payment collection via cash and dynamic in-app UPI QR codes, reconciling **₹3L+ in daily collections** against delivered orders.",
          "Designed a closed-loop delivery disposition flow escalating cancellations and postponements back to the CRM for verification, **cutting order cancellations by ~8%** and lifting deliveries per rider.",
        ],
      },
    ],
  },
  {
    role: "Product Management Intern",
    company: "AltQube",
    period: "06/2023 - 09/2025",
    summary:
      "Built a hyper-personalized wealth management platform from 0→1 alongside engineers, designers, data scientists and economists.",
    groups: [
      {
        bullets: [
          "Launched a 0→1 hyper-personalized wealth management platform (web & mobile) with a **15-member cross-functional team**, scaling AUM past **₹1 Cr**.",
          "Owned V1 product design end-to-end in Figma, taking **80+ screens** from research-backed user flows and wireframes to high-fidelity interactive prototypes.",
          "Co-developed a SEBI-compliant **AI recommendation engine** analyzing **12+ investor parameters** (risk tolerance, financial goals, behavioral patterns) to deliver real-time portfolio suggestions in the \"Build Your Own Portfolio\" feature.",
          "Unlocked direct in-app investing by connecting **9 fintech partners** (Razorpay, Signzy, CAMS, KFintech, CVL, MF Central and 3 others) and **42 AMCs**, documenting **40+ APIs** across equity execution, mutual fund processing and e-KYC.",
        ],
      },
    ],
  },
];

export const beyondWork = {
  title: "Former International Athlete, Team India",
  discipline: "Open Water Swimming",
  period: "2013 - 2020",
  bullets: [
    "Competed professionally for **7+ years**, representing India at the **World Open Water Championships 2018** (Israel) in the 5 km event against 200+ elite athletes from 50+ countries.",
    "Led the **Indian National Relay Team** at international competition.",
    "Won **3 National Gold**, 2 Silver and 1 Bronze medals in open water swimming.",
  ],
};

export type Project = {
  slug: string;
  title: string;
  context: string;
  metrics: string[];
  description: string;
  tags: string[];
  link?: string;
  prototype?: "kissan-sampurna";
};

export const projects: Project[] = [
  {
    slug: "sampurna-apps",
    title: "Kissan & Gau Sampurna",
    context: "Silo Fortune · AI farmer apps, 0→1",
    metrics: ["250K+ installs", "20K+ MAU", "13 languages"],
    description:
      "Two farmer apps launched with a 15-person team: satellite crop monitoring, computer-vision diagnosis of crop and 20+ cattle diseases, a crop recommendation engine across 655K+ farm profiles, and a 32+ SKU marketplace.",
    tags: ["AgriTech", "AI / CV", "Mobile"],
    prototype: "kissan-sampurna",
  },
  {
    slug: "sampurna-growth",
    title: "Freemium Growth Engine",
    context: "Silo Fortune · Growth & monetization",
    metrics: ["2.4% → 8% install-to-trial", "55% trial-to-paid", "26% → 32% signup"],
    description:
      "Defined the freemium model (core advisory free, AI diagnostics on subscription), then redesigned onboarding, paywalls and behaviour-triggered nudges from funnel drop-off analytics.",
    tags: ["Growth", "Monetization", "Funnels"],
  },
  {
    slug: "sales-crm",
    title: "Sales CRM & Telecalling",
    context: "Silo Fortune · Internal platform, 0→1",
    metrics: ["₹1 Cr+ sales / month", "130K+ leads / month", "6,000+ agent-hrs saved / month"],
    description:
      "Replaced Excel tracking for 150+ telecallers with automated lead capture, rule-based routing by language and region, Exotel click-to-call and WhatsApp follow-ups, sustaining 9% lead-to-sale conversion.",
    tags: ["CRM", "Sales Ops", "Automation"],
  },
  {
    slug: "rider-erp",
    title: "Sampurna Rider App & Outlet ERP",
    context: "Silo Fortune · Last-mile logistics, 0→1",
    metrics: ["9K+ deliveries / month", "98 outlets · 4 states", "~8% fewer cancellations"],
    description:
      "End-to-end tracking from CRM sale to doorstep: serviceability-based routing, a rider app with photo + OTP proof of delivery, and UPI QR collections reconciling ₹3L+ daily.",
    tags: ["Logistics", "ERP", "Mobile"],
  },
  {
    slug: "altqube",
    title: "AltQube Wealth Platform",
    context: "AltQube · WealthTech, 0→1",
    metrics: ["₹1 Cr+ AUM", "9 fintech partners", "42 AMCs"],
    description:
      "Hyper-personalized wealth management on web and mobile, with a SEBI-compliant AI recommendation engine over 12+ investor parameters. Designed 80+ screens in Figma and documented 40+ APIs.",
    tags: ["FinTech", "AI", "Web & Mobile"],
  },
];

export const skills = [
  {
    label: "Product & UX",
    items:
      "0→1 Product Development, Product Strategy, PRD Writing, Roadmapping, Feature Prioritization, Monetization (Freemium & Subscription), Funnel Optimization, A/B Testing, User Research, Usability Testing, Competitive Research, GTM Planning, Agile/Scrum, UI/UX",
  },
  { label: "Technical", items: "Python, SQL, API Integrations & Documentation, Data-Driven Decision Making" },
  { label: "Tools & Analytics", items: "Figma, ClickUp, Power BI, Google Analytics, Lucidchart, Canva, Exotel" },
  {
    label: "Domains",
    items:
      "FinTech & WealthTech, AgriTech & Dairy-tech, CRM & Sales Platforms, ERP & Last-Mile Delivery, AI / Computer Vision Features",
  },
];
