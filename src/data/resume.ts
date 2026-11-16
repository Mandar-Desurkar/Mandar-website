// Single source of truth for portfolio content, kept in sync with the resume.
// Text wrapped in **double asterisks** renders bold (see components/RichText.tsx).

export const profile = {
  name: "Mandar Desurkar",
  role: "Associate Product Manager",
  location: "Bangalore, India",
  email: "mandardesurkar3@gmail.com",
  phone: "+91 8073118693",
  linkedin: "https://www.linkedin.com/in/mandar-desurkar/",
  // Status badge on the About photo
  availability: "Open to PM roles",
  // The About window, desktop only. {tag:word} renders a coloured link to that work.
  // Positioning, same message as `intro`: a product builder whose lead story is two consumer apps taken
  // from 0→1, then the range from the resume summary. The header above already says "Product builder".
  about: [
    "I've spent 3+ years building AI-powered products from 0→1, above all two consumer {build:apps} for India's farmers: Kissan Sampurna and Gau Sampurna.",
    "I owned both from discovery and the first {write:PRD} to launch, AI features and {grow:monetization} via freemium and a D2C store.",
    "In all, 6 products from 0→1, including an LLM chatbot and the CRM, rider app and ERP behind ₹12 Cr+ a year in sales. Building in‑house cut tool costs by ₹27L+ a year.",
  ],
  // The PDF-style resume viewer (src/app/resume); its Download button serves the generated PDF
  resumeUrl: "/resume",
  // ("in‑house" uses a non-breaking hyphen so it never splits across lines.)
  // The phone About intro, one string per paragraph, under the "I'm a product builder." headline: the
  // two consumer apps and their 0→1, then the range and impact from the resume summary. The KPI row
  // right below carries installs, MAU and trial conversion. Supports **bold** via RichText.
  intro: [
    "I've spent 3+ years building AI-powered products from 0→1, above all two consumer apps for India's farmers, **Kissan Sampurna** and **Gau Sampurna**. I owned both from discovery and the first PRD to launch, AI features, a freemium subscription and a D2C store.",
    "In all, **6 products from 0→1**: the two apps, an LLM chatbot, and the CRM, rider app and ERP behind ₹12 Cr+ a year in sales. Building in‑house cut tool costs by ₹27L+ a year.",
  ],
  // Full resume summary, for longer-form use (e.g. structured data).
  summary:
    "Associate Product Manager with 3+ years of experience building AI-powered 0→1 consumer apps. Built 6 products from 0→1 (2 consumer apps with 250K+ installs and 55K+ MAU, an LLM chatbot, a CRM, a rider app and an ERP) and monetized the apps with a freemium subscription and D2C commerce, tripling trial conversion. The CRM and delivery platforms now power ₹12 Cr+ in annual sales, and in-house builds cut tool costs by ₹27L+ a year. Open to APM and Product Manager roles in AI, consumer tech, growth or D2C.",
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
  // Label under the phone home-screen icon when the name is too long for two lines
  shortName?: string;
  caption: string;
  icon: string;
  // A website rather than an app: the phone home screen and Spotlight show `phoneIcon` (the clean
  // app icon) with a globe chip on the tile, instead of `icon`, whose globe is baked into the image
  isWebsite?: boolean;
  phoneIcon?: string;
  website: string;
  prototype?: "kissan-sampurna" | "gau-sampurna" | "gau-sampurna-web";
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
  {
    // The Gau Sampurna website (D2C store), prototyped from the site's code
    name: "Gau Sampurna Website",
    shortName: "Gau Website",
    caption: "D2C cattle care store",
    icon: "/apps/gau-sampurna-web-icon.png",
    isWebsite: true,
    phoneIcon: "/apps/gau-sampurna-icon.png",
    website: "https://www.gausampurna.com/",
    prototype: "gau-sampurna-web",
  },
];

// Hero KPI cards count up from 0 to `value`; `decimals` is used only while counting, so small
// numbers (3, 1) still visibly tick before landing on the clean final value.
export const kpis = [
  { prefix: "", value: 250, suffix: "K+", decimals: 0, label: "App Installs" },
  { prefix: "", value: 55, suffix: "K+", decimals: 0, label: "MAU" },
  { prefix: "", value: 3, suffix: "×", decimals: 1, label: "Trial Conversion" },
  { prefix: "₹", value: 1, suffix: " Cr+", decimals: 1, label: "Monthly Sales" },
];

// `prototype` makes the group title open an interactive app prototype (see src/components/prototype).
export type ExperienceGroup = { title?: string; prototype?: "kissan-sampurna"; bullets: string[] };

export type Experience = {
  role: string;
  company: string;
  period: string;
  summary: string;
  // Company logo on a white square (public/logos), shown in the desktop Experience timeline
  logo?: string;
  groups?: ExperienceGroup[];
  isFuture?: boolean;
};

export const experiences: Experience[] = [
  {
    role: "Associate Product Manager",
    company: "Silo Fortune Private Limited",
    period: "09/2025 - Present",
    logo: "/logos/silo-fortune.png",
    summary:
      "Omnichannel D2C company (app, telesales, 98 outlets across 4 states). Own product strategy and roadmap for two consumer apps, Kissan Sampurna and Gau Sampurna, and the internal sales and delivery platforms behind them.",
    // Bullets are word for word from the owner's LaTeX resume (2026-11-16), in its order. The resume's single
    // "Consumer Apps (0→1 Launch, Growth & AI Features)" list is split in two here so the phone's folding
    // groups stay short: launch/growth/monetization (bullets 1–6), then the AI features (7–11).
    groups: [
      {
        title: "Kissan Sampurna & Gau Sampurna Apps: 0→1 Launch, Growth & Monetization",
        prototype: "kissan-sampurna",
        bullets: [
          "Scaled two consumer apps from **0→1 to 250K+ installs and 55K+ MAU**, owning discovery, PRDs, roadmap and the first version's design in Figma, and leading a 15-person team (Engineering, Design, Data Science) from build to release.",
          "**Tripled onboarding-to-trial conversion (2.4% → 7.2%)** by A/B testing paywalls, adding behaviour-triggered nudges and restructuring onboarding around Amplitude drop-offs, taking install-to-trial from 1.4% to 4.2%.",
          "**Lifted DAU by 15% and saved ₹12L+ a year** in vendor fees by building an in-house, event-based push notification system that fires alerts on disease-risk, weather and other real-time events.",
          "Defined the freemium model and raised **trial-to-paid from 27% to 30%** via an A/B test on the trial plan.",
          "Generated **₹3L+ in monthly D2C orders** across the website (₹2L+) and Gau Sampurna's in-app store (₹1L+, 15+ SKUs).",
          "**Cut drop-off at the crop selection step by 15%** with fuzzy search, voice search and state-based crop ranking, helping farmers find their crop faster across most features.",
        ],
      },
      {
        title: "Kissan Sampurna & Gau Sampurna Apps: AI Features",
        bullets: [
          "Built **Farm Monitoring** from scratch so farmers track crop health, disease risk and irrigation needs across their farm via satellite without field visits, in 13 languages (9.8K+ MAU, 1.6K+ peak DAU).",
          "Created **Crop Guide** to answer farmers' \"what should I plant?\" with a no-code engine that ranks the top 5 of 100+ crops for 655K+ farm profiles by climate, soil, budget and rotation, reaching 7.7K+ MAU.",
          "Shipped **Crop Doctor** end to end, using computer vision to detect crop diseases, their severity and disease stage from one photo for an instant diagnosis without waiting for an expert (4.8K+ MAU).",
          "Developed cattle AI for Gau Sampurna that detects 20+ diseases from a photo, scores health, predicts market value and gives cattle-buying recommendations.",
          "Launched an **LLM-powered chatbot** on the D2C website and app that helps users describe and diagnose their problems in plain language.",
        ],
      },
      {
        title: "Sales, Lifecycle Messaging & Delivery Platforms",
        bullets: [
          "Delivered a 0→1 in-house CRM for 150+ telecallers that now handles 130K+ leads and **₹1 Cr+ in monthly sales (₹12 Cr+ a year)**, with lead scoring and same-language routing, avoiding **₹15L+ a year** in CRM licences.",
          "**Saved 6,000+ agent-hours a month** by automating click-to-call, call recording and WhatsApp follow-ups.",
          "Replaced manual fulfillment with end-to-end tracking across 98 outlets in 4 states by owning a 0→1 rider app and outlet ERP, used by 100+ riders for **9K+ deliveries a month** and ₹3L+ daily UPI collections.",
          "**Cut order cancellations by ~8% and RTO by 4%** with a closed-loop disposition flow and an RTO-risk score on every order.",
          "Designed **cohort-based WhatsApp lifecycle journeys** for lead gen and D2C (lead nurture, cart recovery, delivery confirmation, win-back, replenishment), with frequency caps and CRM sync.",
        ],
      },
    ],
  },
  {
    role: "Product Management Intern",
    company: "AltQube",
    period: "06/2023 - 08/2025",
    logo: "/logos/altqube.png",
    summary:
      "Part-time internship alongside B.E. studies at a wealth management startup. From Oct 2024, also worked on Silo Fortune's apps through AltQube's partnership, converting to full-time APM at Silo in Sep 2025.",
    groups: [
      {
        bullets: [
          "Helped launch a 0→1 hyper-personalized wealth management platform (web & mobile) with an 8-member team, designing its 80+ first-release screens in Figma, as AUM grew past ₹1 Cr.",
          "Enabled in-app investing across 9 fintech partners and 42 AMCs, and co-developed a SEBI-compliant AI recommendation engine using 12+ investor parameters.",
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
    "Competed professionally for 7+ years, representing India at the **World Open Water Championships 2018** (Israel) in the 5 km event against 200+ elite athletes from 50+ countries.",
    "Led India's national relay team and won 3 National Gold, 2 Silver and 1 Bronze medals.",
  ],
  // Headline numbers for the swimming story, all from the resume and the press coverage
  stats: [
    { value: "7+", label: "years competing", note: "2013 – 2020" },
    { value: "3", label: "national golds", note: "plus 2 silver, 1 bronze" },
    // All About Belgaum, 28 Aug 2018: "two daily sessions covering 10 to 12 km"
    { value: "12 km", label: "trained every day", note: "in two sessions" },
    // All About Belgaum, 28 Aug 2018: gold at the 1st National Junior Open Water Swimming Championship,
    // Malpe, 30–31 Dec 2017, the result that earned his World Juniors selection
    { value: "Gold", label: "national junior champion", note: "Malpe 2017 · qualified for World Juniors" },
  ],
  // The owner's own upload of his race; plays in place on the page (youtube-nocookie)
  video: {
    id: "sGlckZy6Bdk",
    title: "Mandar Desurkar's 5 km race at the FINA World Junior Open Water Swimming Championship 2018, Israel (Part 2)",
    // On the poster: what it is, then where and when
    headline: "My 5 km race at the FINA World Junior Championships",
    meta: "Eilat, Israel · 2018 · Part 2",
  },
  // Press coverage, shown as a list of links above the photos. Articles were read and match their
  // headline and date; the Facebook posts couldn't be opened, so their lines come from the post links
  // and they carry no date.
  press: [
    {
      headline: "Mandar to participate in FINA World Junior Open Water Swimming Championship to be held at Israel",
      source: "All About Belgaum",
      date: "28 Aug 2018",
      url: "https://allaboutbelgaum.com/sports/mandar-to-participate-in-fina-world-junior-open-water-swimming-championship-to-be-held-at-israel/",
    },
    {
      headline: "Mandar Desurkar bagged another gold at the 1st National Junior Open Water Swimming Championship",
      source: "All About Belgaum on Facebook",
      url: "https://www.facebook.com/allaboutbelgaum/posts/mandar-desurkar-bagged-another-gold-at-the-1st-national-junior-open-water-swimmi/10155313174758553/",
    },
    {
      headline: "Mandar Desurkar amongst sports talent under STEPP Karnataka-2018 initiative",
      source: "All About Belgaum",
      date: "4 Jan 2019",
      url: "https://allaboutbelgaum.com/news/mandar-desurkar-amongst-sports-talent-under-stepp-karnataka-2018-initiative/",
    },
    {
      headline: "Mandar Desurkar secured third place in the open category 5 km at the Swimathon",
      source: "All About Belgaum on Facebook",
      url: "https://www.facebook.com/allaboutbelgaum/photos/mandar-desurkar-secured-third-place-in-the-open-category-5-km-at-the-swimathon-2/10155456911103553/",
    },
    {
      headline: "International swimmer Master Mandar Maruti Desurkar of KLE's International School",
      source: "All About Belgaum on Facebook",
      url: "https://www.facebook.com/allaboutbelgaum/posts/international-swimmer-master-mandar-maruti-desurkar-of-kles-international-school/10156648727653553/",
    },
  ] as { headline: string; source: string; date?: string; url: string }[],
  // Photos the owner supplied, as one compact justified row (no cropping); any photo opens full size
  photos: [
    [
      { src: "/beyond-work/race-start-eilat.webp", width: 1440, height: 806, caption: "Race start, FINA World Junior Open Water Championships, Eilat 2018" },
      { src: "/beyond-work/team-india-portrait.webp", width: 800, height: 1200, caption: "Team India, 2018" },
      { src: "/beyond-work/medal-trophy.webp", width: 643, height: 933, caption: "With a medal and trophy" },
      { src: "/beyond-work/team-india.webp", width: 1200, height: 900, caption: "Representing India, Eilat 2018" },
      { src: "/beyond-work/fina-certificate.webp", width: 1600, height: 1131, caption: "FINA certificate, Eilat 2018" },
    ],
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
    metrics: ["250K+ installs", "25K+ MAU", "13 languages"],
    description:
      "Two farmer apps launched with a 15-person team: satellite crop monitoring, computer-vision diagnosis of crop and 20+ cattle diseases, a crop recommendation engine across 655K+ farm profiles, and a 32+ SKU marketplace.",
    tags: ["AgriTech", "AI / CV", "Mobile"],
    prototype: "kissan-sampurna",
  },
  {
    slug: "sampurna-growth",
    title: "Freemium Growth Engine",
    context: "Silo Fortune · Growth & monetization",
    metrics: ["2.4% → 7.2% onboarding-to-trial", "27% → 30% trial-to-paid", "+3% install-to-signup"],
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
      "Replaced Excel tracking for 150+ telecallers with automated lead capture, rule-based routing by language and region, Exotel click-to-call and WhatsApp follow-ups.",
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
  { label: "Tools & Analytics", items: "Figma, ClickUp, Mixpanel, Amplitude, Google Analytics, Lucidchart, Canva" },
  {
    label: "Domains",
    items:
      "FinTech & WealthTech, Consumer Mobile Apps (B2C), CRM & Sales Platforms, ERP & Last-Mile Delivery, AI/Computer Vision Features",
  },
];

// Desktop Skills & Toolkit: the Product & UX skills by stage of the work, and the product behind each
// domain. Keep every item identical to `skills` above, which the phone and Spotlight read.
export const skillStages = [
  { label: "Strategy", items: ["0→1 Product Development", "Product Strategy", "Roadmapping", "Feature Prioritization", "GTM Planning"] },
  { label: "Discovery & design", items: ["User Research", "Usability Testing", "Competitive Research", "UI/UX"] },
  { label: "Growth", items: ["Monetization (Freemium & Subscription)", "Funnel Optimization", "A/B Testing"] },
  { label: "Delivery", items: ["PRD Writing", "Agile/Scrum"] },
];

export const domainProof: Record<string, string> = {
  "FinTech & WealthTech": "AltQube Wealth Platform",
  "Consumer Mobile Apps (B2C)": "Kissan & Gau Sampurna",
  "AgriTech & Dairy-tech": "Kissan & Gau Sampurna",
  "CRM & Sales Platforms": "Sales CRM & Telecalling",
  "ERP & Last-Mile Delivery": "Rider App & Outlet ERP",
  "AI/Computer Vision Features": "Crop & cattle diagnosis",
};
