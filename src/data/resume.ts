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
  about: [
    "I build AI {build:products} people actually pay for, and I own them from the first {write:PRD} through launch and {grow:growth}.",
    "Currently Associate PM at Silo Fortune, building agritech apps for India's farmers.",
  ],
  // The PDF-style resume viewer (src/app/resume); its Download button serves the generated PDF
  resumeUrl: "/resume",
  // Short hero line; keep it to about 3 lines so the About window fits without scrolling.
  // Supports **bold** via RichText.
  intro:
    "I take AI-powered products from 0→1, from the first PRD to launch, growth and monetization. Currently Associate PM at Silo Fortune, building agritech apps for India's farmers.",
  // Full resume summary, for longer-form use (e.g. structured data).
  summary:
    "Associate Product Manager with 2.5+ years of owning AI-powered 0→1 products with cross-functional teams, from product strategy, PRDs and roadmaps to launch, growth and monetization. I grew two agritech apps to a combined 250K+ installs, tripled trial conversion through funnel optimization, and shipped computer-vision disease diagnosis and livestock valuation, satellite farm monitoring and a crop recommendation engine. I also built the CRM and last-mile stack behind ₹1 Cr+ of sales a month.",
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
      "Owning AI-powered 0→1 farmer apps and the sales and last-mile stack behind them, working with engineering, design and data science.",
    groups: [
      {
        title: "Kissan Sampurna & Gau Sampurna Apps: 0→1 Launch & AI Features",
        prototype: "kissan-sampurna",
        bullets: [
          "Led the launch of two farmer apps with a **15-person team** (Engineering, Design, Data Science) to **250K+ combined installs** and 25K+ MAU, and designed the V1 UI/UX hands-on in Figma, from user flows to developer-ready screens.",
          "**Shipped AI-powered satellite monitoring**, letting farmers geotag field boundaries on their phones to track crop health (via vegetation indices), disease risk and irrigation needs across the whole farm in **13 languages**, peaking at **9.8K+ MAU** and **1.6K+ DAU**.",
          "Architected a no-code **crop recommendation engine** that ranks each farmer's **top 5 of 100+ crops** across **655K+ farm profiles** by climate zone, soil, budget and rotation, reaching **7.7K+ MAU** at peak.",
          "Integrated **computer vision models** that diagnose crop diseases with their **severity stage** and **20+ cattle diseases** from one photo, and estimate cattle price, BCS and dung score; crop diagnosis peaked at **4.8K+ MAU**.",
          "Grew both apps into a one-stop farmer platform with a **32+ SKU** marketplace, weather alerts and market price forecasts.",
        ],
      },
      {
        title: "Kissan Sampurna & Gau Sampurna Apps: Growth & Monetization",
        bullets: [
          "Defined the **freemium monetization model**, keeping core advisory free to drive adoption while gating AI diagnostics behind a paid subscription.",
          "Restructured onboarding using Amplitude drop-off funnel analytics, lifting install-to-signup conversion by **3%**.",
          "**Tripled onboarding-to-trial conversion (2.4% → 7.2%)** with redesigned paywalls and behaviour-triggered engagement nudges, and raised trial-to-paid **from 27% to 30%**.",
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
        title: "Sampurna Rider App & Outlet ERP: Last-Mile Logistics & Operations",
        bullets: [
          "Drove the 0→1 build of a custom rider app and outlet ERP, from PRD to UI/UX prototypes, replacing manual order fulfillment with end-to-end tracking from CRM sale to doorstep delivery.",
          "Architected serviceability-based order routing across **98 outlets in 4 states**, while piloting algorithmic rider assignment to eliminate manual order allocation by outlet managers.",
          "Deployed the rider mobile app to **100+ in-house riders** handling **9K+ deliveries/month**, with in-app map navigation, photo + 4-digit OTP proof of delivery, and instant SMS/WhatsApp updates.",
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
    logo: "/logos/altqube.png",
    summary:
      "Built a hyper-personalized wealth management platform from 0→1 alongside engineers, designers, data scientists and economists.",
    groups: [
      {
        bullets: [
          "Launched a 0→1 hyper-personalized wealth management platform (web & mobile) with a **15-member cross-functional team** of engineers, designers, data scientists and economists, scaling AUM past **₹1 Cr**.",
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
  { label: "Tools & Analytics", items: "Figma, ClickUp, Mixpanel, Amplitude, Google Analytics, Lucidchart, Canva" },
  {
    label: "Domains",
    items:
      "FinTech & WealthTech, AgriTech & Dairy-tech, CRM & Sales Platforms, ERP & Last-Mile Delivery, AI/Computer Vision Features",
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
  "AgriTech & Dairy-tech": "Kissan & Gau Sampurna",
  "CRM & Sales Platforms": "Sales CRM & Telecalling",
  "ERP & Last-Mile Delivery": "Rider App & Outlet ERP",
  "AI/Computer Vision Features": "Crop & cattle diagnosis",
};
