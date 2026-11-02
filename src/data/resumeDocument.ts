// The resume as it reads in the owner's LaTeX source (exported to HTML on 2026-11-02), rendered as a
// PDF-style document at /resume and printed to public/Mandar_Desurkar_Resume.pdf.
// Keep the wording identical to the LaTeX file; `**text**` renders bold. The four product-group headings
// under Silo Fortune were lost in the HTML export, so they come from `experiences` in resume.ts.
// After editing, regenerate the PDF (see "Resume" in docs/PROJECT_CONTEXT.md).

export type ResumeGroup = { title?: string; bullets: string[] };
export type ResumeEntry = { title: string; period: string; groups: ResumeGroup[] };

export const RESUME_FILE = "/Mandar_Desurkar_Resume.pdf";

export const resumeDocument = {
  name: "Mandar Desurkar",
  contact: [
    { label: "+91 8073118693", href: "tel:+918073118693" },
    { label: "mandardesurkar3@gmail.com", href: "mailto:mandardesurkar3@gmail.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/mandar-desurkar/" },
    { label: "Portfolio", href: "https://mandar-desurkar.vercel.app/" },
    { label: "Bangalore" },
  ],
  summary:
    "Associate Product Manager with 2.5+ years of experience owning **AI-powered 0→1 products** with cross-functional teams, from product strategy, PRDs and roadmaps to launch, growth and monetization. Grew two agritech apps to a combined **250K+ installs**, **tripled trial conversion** through funnel optimization, and shipped **computer vision** disease diagnosis and livestock valuation, satellite farm monitoring, and a crop recommendation engine. Built the CRM and last-mile stack behind **Rs. 1 Cr+ of sales a month**.",
  education: [
    {
      school: "M. S. Ramaiah Institute of Technology, Bangalore",
      period: "01/2021 - 07/2025",
      detail: "B.E. in Information Science and Engineering | CGPA: 8.30",
    },
  ],
  experience: [
    {
      title: "Associate Product Manager - Silo Fortune Private Limited",
      period: "09/2025 - Present",
      groups: [
        {
          title: "Kissan Sampurna & Gau Sampurna Apps: 0→1 Launch & AI Features",
          bullets: [
            "Led the launch of two farmer apps with a **15-person team** (Engineering, Design, Data Science) to **250K+ combined installs** and 25K+ MAU, and designed the V1 UI/UX hands-on in Figma, from user flows to developer-ready screens.",
            "**Shipped AI-powered satellite monitoring**, enabling farmers to geotag field boundaries on smartphones to track crop health (via vegetation indices), disease risks, and irrigation needs across their entire farm in **13 languages**, peaking at **9.8K+ MAU** and **1.6K+ DAU**.",
            "Architected a no-code **crop recommendation engine** that ranks each farmer's **top 5 of 100+ crops** across **655K+ farm profiles** by climate zone, soil, budget, and rotation, reaching **7.7K+ MAU** at peak.",
            "Integrated **computer vision models** that diagnose crop diseases with their **severity stage** and **20+ cattle diseases** from one photo, and estimate cattle price, BCS, and dung score; crop diagnosis peaked at **4.8K+ MAU**.",
            "Grew both apps into a one-stop farmer platform with a **32+ SKU** marketplace, weather alerts, and market price forecasts.",
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
            "Delivered a 0→1 in-house CRM replacing legacy Excel tracking for **150+ telecallers**, now powering **Rs. 1 Cr+ in monthly sales** across **130K+ leads/month**.",
            "Automated lead capture from D2C web and app channels for the **32+ SKU** catalog, following each customer from first touchpoint to repeat purchase.",
            "Engineered **rule-based lead routing** by agent language, region, and lead source, matching every farmer with a local, same-language agent to sustain **9% lead-to-sale conversion**.",
            "Integrated Exotel click-to-call, auto-call recording, and automated WhatsApp follow-up flows, eliminating manual dialing and **saving 6,000+ agent-hours/month** (~40 hours/agent).",
          ],
        },
        {
          title: "Sampurna Rider App & Outlet ERP: Last-Mile Logistics & Operations",
          bullets: [
            "Drove the 0→1 build of a custom rider app and outlet ERP, from PRD to UI/UX prototypes, replacing manual order fulfillment with end-to-end tracking from CRM sale to doorstep delivery.",
            "Architected serviceability-based order routing across **98 outlets in 4 states**, while piloting algorithmic rider assignment to eliminate manual order allocation by outlet managers.",
            "Deployed the rider mobile app to **100+ in-house riders** handling **9K+ deliveries/month**, with in-app map navigation, photo + 4-digit OTP proof of delivery, and instant SMS/WhatsApp updates.",
            "Digitized doorstep payment collection via cash and dynamic in-app UPI QR codes, reconciling **Rs. 3L+ in daily collections** against delivered orders.",
            "Designed a closed-loop delivery disposition flow escalating cancellations and postponements back to the CRM for verification, **cutting order cancellations by ~8%** and lifting deliveries per rider.",
          ],
        },
      ],
    },
    {
      title: "Product Management Intern - AltQube",
      period: "06/2023 - 09/2025",
      groups: [
        {
          bullets: [
            "Launched a 0→1 hyper-personalized wealth management platform (web & mobile) with a **15-member cross-functional team** of engineers, designers, data scientists, and economists, scaling AUM past **Rs. 1 Cr**.",
            "Owned V1 product design end-to-end in Figma, taking **80+ screens** from research-backed user flows and wireframes to high-fidelity interactive prototypes.",
            "Co-developed a SEBI-compliant **AI recommendation engine** analyzing **12+ investor parameters** (risk tolerance, financial goals, behavioral patterns) to deliver real-time portfolio suggestions in the “Build Your Own Portfolio” feature.",
            "Unlocked direct in-app investing by connecting **9 fintech partners** (Razorpay, Signzy, CAMS, KFintech, CVL, MF Central and 3 others) and **42 AMCs**, documenting **40+ APIs** across equity execution, mutual fund processing, and e-KYC.",
          ],
        },
      ],
    },
  ] as ResumeEntry[],
  beyondWork: [
    {
      title: "Former International Athlete, Team India - Open Water Swimming",
      period: "2013 - 2020",
      groups: [
        {
          bullets: [
            "Competed professionally for **7+ years**, representing India at the **World Open Water Championships 2018** (Israel) in the 5 km event against 200+ elite athletes from 50+ countries.",
            "Led the **Indian National Relay Team** at international competition.",
            "Won **3 National Gold**, 2 Silver, and 1 Bronze medals in open water swimming.",
          ],
        },
      ],
    },
  ] as ResumeEntry[],
  skills: [
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
  ],
};
