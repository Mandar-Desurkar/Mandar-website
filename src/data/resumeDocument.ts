// The resume as it reads in the owner's LaTeX source (XCharter version, received 2026-11-19), rendered as a
// PDF-style document at /resume and printed to public/Mandar_Desurkar_Resume.pdf.
// Keep the wording identical to the LaTeX file; `**text**` renders bold. LaTeX's `\,` (Rs.\,1, 5\,km) is a
// thin space (U+2009) here, and `$\sim$` is ∼.
// After editing, regenerate the PDF (see "Resume" in docs/PROJECT_CONTEXT.md).

// `sub`: the italic line under an entry (\entrysub); group titles are the bold product headings (\product)
export type ResumeGroup = { title?: string; bullets: string[] };
export type ResumeEntry = { title: string; period: string; sub?: string; groups: ResumeGroup[] };

export const RESUME_FILE = "/Mandar_Desurkar_Resume.pdf";

export const resumeDocument = {
  name: "Mandar Desurkar",
  // The line under the name, its parts separated by bars
  tagline: ["Associate Product Manager", "AI & Consumer Growth", "0→1 Builder"],
  contact: [
    { label: "+91 8073118693", href: "tel:+918073118693" },
    { label: "mandardesurkar3@gmail.com", href: "mailto:mandardesurkar3@gmail.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/mandar-desurkar/" },
    { label: "Portfolio", href: "https://mandar-desurkar.vercel.app/" },
    { label: "Bangalore" },
  ],
  summary:
    "Associate Product Manager with 3+ years of experience building AI-powered 0→1 consumer apps. Built 6 products from 0→1, including 2 consumer apps with **250K+ installs**, an LLM chatbot, and the CRM and delivery platforms that now power **Rs. 12 Cr+ in annual sales**. **Tripled trial conversion** and monetized the apps through freemium and D2C commerce. Open to APM and PM roles in AI and consumer growth.",
  experience: [
    {
      title: "Associate Product Manager | Silo Fortune Private Limited",
      period: "09/2025 – Present",
      sub: "Omnichannel D2C company (app, telesales, 98 outlets across 4 states). Own product strategy and roadmap for two consumer apps, Kissan Sampurna and Gau Sampurna, and the internal sales and delivery platforms behind them.",
      groups: [
        {
          title: "Consumer Apps (0→1 Launch, Growth & AI Features)",
          bullets: [
            "Scaled two consumer apps from **0→1 to 250K+ installs and 55K+ MAU**, owning discovery, PRDs, roadmap and first-version design, and leading a 15-person team.",
            "**Tripled onboarding-to-trial conversion (2.4% → 7.2%)** by A/B testing paywalls, adding behaviour-triggered nudges and restructuring onboarding around Amplitude drop-offs.",
            "**Lifted DAU by 10% and saved Rs. 20L+ a year** by building event-based push notifications in-house instead of buying a third-party tool.",
            "Chose a freemium model so users see value before paying, raising **trial-to-paid from 27% to 30%**, and added D2C commerce that now brings Rs. 3L+ in monthly orders.",
            "**Cut drop-off at the crop selection step by 15%** with fuzzy search, voice search and state-based ranking.",
            "Built **Farm Monitoring** from scratch so farmers geotag their fields and track crop health, disease risk and irrigation on satellite vegetation maps in 13 languages (9.8K+ MAU, 1.6K+ peak DAU).",
            "Created **Crop Guide**, a no-code engine that answers farmers' “what should I plant?” by ranking the top 5 crops on climate, soil, budget and rotation for 655K+ farm profiles (7.7K+ MAU).",
            "Shipped **Crop Doctor** end to end, using computer vision to detect crop diseases, severity and stage from a photo (4.8K+ MAU).",
            "Developed **cattle AI** for Gau Sampurna that detects 20+ diseases, assesses health, predicts market value and gives buying recommendations.",
            "Launched an **LLM-powered chatbot** on the D2C website and app that helps users describe and diagnose problems in plain language.",
          ],
        },
        {
          title: "Sales & Delivery Platforms",
          bullets: [
            "Delivered a 0→1 CRM for 150+ telecallers that auto-captures leads from lead-gen campaigns, the website and the app, now handling **130K+ leads** and **Rs. 1 Cr+ in monthly sales** with lead scoring and same-language routing, avoiding Rs. 15L+ a year in licences.",
            "**Saved 3,000+ agent-hours a month** by automating click-to-call, call recording and WhatsApp follow-ups.",
            "Replaced manual fulfillment at 98 outlets with a 0→1 rider app and outlet ERP that routes orders to the nearest serviceable outlet, used by 100+ riders for **9K+ monthly deliveries** and Rs. 3L+ in daily UPI collections.",
            "**Cut order cancellations by ∼6% and RTO by 4%** with a closed-loop disposition flow and RTO-risk scoring.",
            "Designed **cohort-based WhatsApp lifecycle journeys** for lead gen and D2C, covering lead nurture, cart recovery, delivery confirmation and win-back.",
          ],
        },
      ],
    },
    {
      title: "Product Management Intern | AltQube",
      period: "06/2023 – 08/2025",
      sub: "Part-time internship alongside B.E. studies at a wealth management startup. From Oct 2024, also worked on Silo Fortune's apps through AltQube's partnership, converting to full-time APM at Silo in Sep 2025.",
      groups: [
        {
          bullets: [
            "Helped launch a 0→1 wealth management platform (web & mobile) with an 8-member team, designing its 80+ first-release screens in Figma as AUM grew past Rs. 1 Cr.",
            "Integrated 9 fintech partners and 42 AMCs for in-app investing, and co-developed a SEBI-compliant AI recommendation engine.",
          ],
        },
      ],
    },
  ] as ResumeEntry[],
  beyondWork: [
    {
      title: "Former International Athlete, Team India | Open Water Swimming",
      period: "2013 – 2020",
      groups: [
        {
          bullets: [
            "Competed professionally for 7+ years, representing India at the **World Open Water Championships 2018** (Israel) in the 5 km event against 200+ athletes from 50+ countries, and led India's relay team there.",
            "Won multiple national medals, including gold, in open water swimming.",
          ],
        },
      ],
    },
  ] as ResumeEntry[],
  education: [
    {
      school: "M. S. Ramaiah Institute of Technology, Bangalore",
      period: "01/2021 – 07/2025",
      detail: "B.E. in Information Science and Engineering | CGPA: 8.30",
    },
  ],
  skills: [
    {
      label: "Product",
      items:
        "0→1 Product Development, Product Strategy, PRDs, Roadmapping, Prioritization, Growth & Monetization (Freemium, Subscription), Funnel Optimization, A/B Testing, User Research, GTM, UI/UX",
    },
    { label: "Technical & Tools", items: "SQL, Python, API Integrations, Figma, Amplitude, Mixpanel, Google Analytics, ClickUp" },
    {
      label: "Domains",
      items: "AI Products (LLM, Computer Vision), Consumer Mobile Apps (B2C), FinTech & WealthTech, CRM & Delivery Platforms",
    },
  ],
};
