// Case studies: the long-form write-ups behind the work, each rendered at /case-studies/<slug>.
// Facts about the product come from the app's code and the recommendation engine's scoring
// reference; every public statistic carries a `source` id that links to `sources` (each one was
// checked against the original page). `**text**` renders bold through RichText.

export type CaseStudySource = { id: string; label: string; publisher: string; date: string; url: string };
export type CaseStudyStat = { value: string; label: string; source: string };
export type CaseStudyPersona = {
  name: string;
  role: string;
  attrs: { label: string; value: string }[];
  quote: string;
  goals: string[];
  frustrations: string[];
  internal?: boolean;
};
// `feel` (-2 anxious … +2 confident) draws the journey map's emotion curve; it is a design
// synthesis of the pain points, labelled illustrative on the page
export type CaseStudyStep = { step: string; does: string; pain: string; feel: number; feeling: string; source?: string };
export type CaseStudyPrinciple = { insight: string; principle: string; source?: string };
// One thing the product does: what the farmer sees, and the reasoning behind it
export type CaseStudyFeature = { title: string; what: string; why: string; screens: { image: string; label: string }[] };
export type CaseStudyDecision = { decision: string; why: string; tradeoff: string };
export type CaseStudyMetric = { value: string; label: string };
export type CaseStudyCallout = { x: number; y: number; title: string; body: string };
export type CaseStudyStage = { title: string; caption: string; items: string[] };

export type CaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  product: string;
  cover: string;
  tags: string[];
  // Card on the Case Studies list
  // Stats are the feature card's proof row in the desktop window
  card: { problem: string; metric: string; stats: { value: string; label: string }[] };
  meta: { label: string; value: string }[];
  // At a glance, consulting-style: challenge → approach → impact, each one plain takeaway (numbers
  // in bold inside it) and one supporting sentence
  glance: { label: string; takeaway: string; text: string; source?: string }[];
  // Section headlines state the takeaway; the kicker above each names the section
  // The three phones in the hero: left, centre, right
  heroScreens: [string, string, string];
  headlines: Record<"problem" | "people" | "today" | "principles" | "solution" | "engine" | "decisions" | "outcomes" | "reflection", string>;
  problem: {
    intro: string;
    // Shown as a 10 × 10 waffle chart
    featured: { value: number; label: string; caption: string; source: string };
    stats: CaseStudyStat[];
    statement: string;
    hmw: string;
  };
  personasNote: string;
  personas: CaseStudyPersona[];
  journeyIntro: string;
  journey: CaseStudyStep[];
  principles: CaseStudyPrinciple[];
  solution: {
    intro: string;
    // The feature cards either side of the annotated report
    beforeReport: CaseStudyFeature[];
    afterReport: CaseStudyFeature[];
    // Annotated screenshot: callout positions are % of the image
    anatomy: { image: string; intro: string; callouts: CaseStudyCallout[] };
    engineIntro: string;
    pipeline: { input: string; stages: CaseStudyStage[]; output: string };
    engineRules: string[];
    decisions: CaseStudyDecision[];
  };
  outcomes: { intro: string; metrics: CaseStudyMetric[]; impact: string[]; measureNext: { metric: string; how: string; tells: string }[] };
  learnings: string[];
  prototype: { id: "kissan-sampurna"; flow: string };
  sources: CaseStudySource[];
};

const IMG = "/case-studies/crop-guide";

export const caseStudies: CaseStudy[] = [
  {
    slug: "crop-guide",
    title: "Crop Guide: the right crop for this field, this season, this budget",
    subtitle:
      "How I designed a crop recommendation feature for India's smallholder farmers, and the no-code engine that ranks the top 5 of 100+ crops for each farm.",
    product: "Kissan Sampurna",
    cover: `${IMG}/05-report.webp`,
    tags: ["AgriTech", "0→1", "Recommendation engine", "Low-literacy UX"],
    card: {
      problem: "Most small farmers pick a crop by habit, by what neighbours plant or by last season's price.",
      metric: "Top 5 of 100+ crops for 655K+ farm profiles, 7.7K+ MAU at peak",
      stats: [
        { value: "7.7K+", label: "Peak MAU" },
        { value: "655K+", label: "Farm profiles" },
        { value: "Top 5", label: "Of 100+ crops" },
      ],
    },
    meta: [
      { label: "Role", value: "Associate Product Manager" },
      { label: "Company", value: "Silo Fortune" },
      { label: "Team", value: "Engineering, design, data science" },
      { label: "Platform", value: "Mobile app, 13 Indian languages" },
      { label: "Timeline", value: "2025–26" },
    ],
    heroScreens: [`${IMG}/02-season.webp`, `${IMG}/05-report.webp`, `${IMG}/06-report-compare.webp`],
    glance: [
      {
        label: "The challenge",
        takeaway: "Farmers pick crops without advice that fits their field.",
        text: "Only **42%** of farm households get any technical advice, and on about a hectare one wrong crop can cost a season's income.",
        source: "nso",
      },
      {
        label: "Our approach",
        takeaway: "Three questions to a ranked, explained shortlist.",
        text: "A rules engine filters out crops that can't work, scores the rest on soil, budget and rotation, and explains the **top 5 of 100+**.",
      },
      {
        label: "The impact",
        takeaway: "Personal crop advice for **655K+** farm profiles.",
        text: "Peaked at **7.7K+ monthly users** in Kissan Sampurna, and the agronomy team retunes the rules **without an app release**.",
      },
    ],
    headlines: {
      problem: "A one-hectare farm can't afford a wrong guess",
      people: "Two farmers and the person who keeps the rules right",
      today: "Today the choice runs on habit and hearsay",
      principles: "Five insights, five design rules",
      solution: "A short conversation, then an answer that explains itself",
      engine: "Filter, score, rank, and show the reasoning",
      decisions: "What I chose, and what each choice cost",
      outcomes: "7.7K+ monthly users at peak, tunable without code",
      reflection: "What I'd do differently",
    },
    problem: {
      featured: {
        value: 42.2,
        label: "of agricultural households had access to any technical advice on farming",
        caption: "Out of every 100 farm households, about 42 got advice of any kind. The rest decide alone.",
        source: "nso",
      },
      intro:
        "Indian agriculture is overwhelmingly small: a typical farmer works about a hectare, so a single wrong crop choice can wipe out a year's income. Yet the decision is rarely informed by anything specific to that farm.",
      stats: [
        { value: "~86%", label: "of India's operational holders are small or marginal farmers", source: "census-share" },
        { value: "1.08 ha", label: "average size of an operational holding", source: "census-size" },
        { value: "1.93M ha", label: "of rice area, mostly in the north-west and west, needs a gradual shift to protect groundwater", source: "water" },
      ],
      statement:
        "Small farmers choose crops without advice that fits their land, water and money, so they follow habit and the crowd. That leads to crops the water can't sustain, gluts when everyone plants the same thing, and losses a one-hectare farm can't absorb.",
      hmw: "How might we give every farmer a crop recommendation they understand, trust and can act on this season, in under a minute?",
    },
    personasNote:
      "Composite personas, built from the field context above and the app's farmer base in Karnataka, not individual interviewees.",
    personas: [
      {
        name: "Ramesh, 46",
        role: "Smallholder farmer",
        attrs: [
          { label: "Place", value: "Tumakuru, Karnataka" },
          { label: "Land", value: "2.4 acres" },
          { label: "Water", value: "Rain plus a borewell" },
          { label: "Grows", value: "Ragi, groundnut" },
        ],
        quote: "I grow what my father grew. When I tried tomato like everyone else, the price fell to nothing.",
        goals: ["A crop that survives a weak monsoon", "A fair price at the local mandi", "Advice in Kannada he can follow"],
        frustrations: [
          "Borewell runs low mid-season",
          "Seed advice comes from the dealer selling the seed",
          "Official cards and tables are hard to read",
        ],
      },
      {
        name: "Lakshmi, 34",
        role: "Farmer looking to switch crops",
        attrs: [
          { label: "Place", value: "Hebbal, Bengaluru outskirts" },
          { label: "Land", value: "1.2 acres" },
          { label: "Water", value: "Borewell" },
          { label: "Grows", value: "Rice today" },
        ],
        quote: "I want to try something that pays more near the city, but I can't afford to lose a season experimenting.",
        goals: ["Switch to a higher-value crop", "Stay within a tight budget per acre", "Compare options before committing"],
        frustrations: [
          "YouTube advice is generic, not for her soil or budget",
          "No way to compare crops side by side",
          "Unsure which crops her water supports",
        ],
      },
      {
        name: "The agronomy lead",
        role: "Internal user",
        attrs: [
          { label: "Owns", value: "Crop rules for 100+ crops" },
          { label: "Scope", value: "India's agro-climatic zones" },
          { label: "Tools", value: "The engine's scoring sheets" },
        ],
        quote: "When a recommendation is wrong for a region, I need to fix it today, not in the next app release.",
        goals: ["Correct a crop's zone, soil or season fit quickly", "Change the questions without engineering", "See why a crop ranked where it did"],
        frustrations: ["Every rule change needs an engineer", "Logic hidden in code is hard to audit"],
        internal: true,
      },
    ],
    journeyIntro: "How a farmer like Ramesh decides what to sow today, and where it goes wrong.",
    journey: [
      {
        step: "Look back",
        feel: 1,
        feeling: "Sure of habit",
        does: "Repeats last season's crop, or plants what neighbours are planting.",
        pain: "Herd planting creates gluts. In 2025 farmers around Tumakuru expanded tomato expecting better prices, and Kolar prices collapsed.",
        source: "glut",
      },
      {
        step: "Ask around",
        feel: 0,
        feeling: "Hopeful",
        does: "Talks to relatives, the input dealer and middlemen about seed and prices.",
        pain: "Fewer than half of farm households get any technical advice, and the dealer usually recommends what he stocks.",
        source: "nso",
      },
      {
        step: "Guess the water",
        feel: -1,
        feeling: "Uneasy",
        does: "Hopes the monsoon and the borewell will last the crop.",
        pain: "Water-hungry crops end up where the water won't last, depleting groundwater and risking the harvest.",
        source: "water",
      },
      {
        step: "Guess the money",
        feel: -2,
        feeling: "Anxious",
        does: "Buys seed, fertiliser and labour, often on credit.",
        pain: "On about one hectare, one failed season can erase the year's margin.",
        source: "census-size",
      },
      {
        step: "Read official advice",
        feel: -1,
        feeling: "Confused",
        does: "Gets a soil card or a printed recommendation, if anything.",
        pain: "Advice that isn't understood or trusted isn't followed: farmers skip soil health card recommendations they can't read or don't believe.",
        source: "shc-trust",
      },
      {
        step: "Sow and hope",
        feel: -2,
        feeling: "Exposed",
        does: "Plants, then finds out at harvest whether the bet paid off.",
        pain: "No feedback loop, so the same mistake repeats next season.",
      },
    ],
    principles: [
      {
        insight: "Farmers have plenty of opinions around them; what's missing is fit to their own field.",
        principle: "Recommend for this field, this season and this budget, never a generic 'best crop'.",
      },
      {
        insight: "A clearer soil card raised farmer comprehension from 0.5% to 33%: format decides whether advice is used.",
        principle: "Pictures over text, money in bands, dates as 'last week', and a plain 'why' behind every pick.",
        source: "shc-trial",
      },
      {
        insight: "Every extra question loses a farmer, and many details (zone, soil) can be inferred.",
        principle: "Ask only what the farmer knows. Infer the rest from location; reuse what a mapped farm already knows.",
      },
      {
        insight: "A bad recommendation costs a season; no recommendation costs nothing.",
        principle: "Eliminate crops that can't work before scoring, and say so honestly when nothing fits.",
      },
      {
        insight: "The first version of agronomy rules will be wrong somewhere in a country this varied.",
        principle: "Make the engine and the questionnaire editable by the agronomy team, without code or releases.",
      },
    ],
    solution: {
      intro:
        "Crop Guide turns the decision into a short, picture-led conversation and an explained top 5. A farmer with a mapped farm answers 3 questions; a new farmer answers up to 10 and gets a farm in Farm Monitoring at the end.",
      beforeReport: [
        {
          title: "Start from the farm",
          what: "A farmer with a mapped farm picks it and goes straight to 3 questions. A new farmer answers up to 10 and ends up with a farm in Farm Monitoring.",
          why: "A mapped farm already knows its location, crop and water, so asking again would only add steps.",
          screens: [{ image: `${IMG}/01-select-farm.webp`, label: "Pick a farm" }],
        },
        {
          title: "Questions in pictures",
          what: "One question at a time, answered by tapping big image cards: the season, every water source on the farm, and a budget band.",
          why: "Picture cards work for low-literacy farmers. Most farms mix rain with a borewell or canal, so water is multi-select, and ranges are easier to answer than exact amounts. Questions come from the server, so they change without a release.",
          screens: [
            { image: `${IMG}/02-season.webp`, label: "Season" },
            { image: `${IMG}/03-water.webp`, label: "Water" },
            { image: `${IMG}/04-budget.webp`, label: "Budget" },
          ],
        },
      ],
      afterReport: [
        {
          title: "The top 5, compared",
          what: "The report ranks all five crops by match, and a tap opens any of them.",
          why: "The farmer is betting a season on this, so the choice stays theirs, with the trade-offs in view.",
          screens: [{ image: `${IMG}/06-report-compare.webp`, label: "Compare crops" }],
        },
        {
          title: "An honest dead end",
          what: "When no crop fits the answers, the app says so and offers the seasons where crops do fit, one tap away.",
          why: "A forced pick would spend the trust the report earns. The farmer's credit isn't used either.",
          screens: [{ image: `${IMG}/07-no-fit.webp`, label: "No crop fits" }],
        },
      ],
      anatomy: {
        image: `${IMG}/05-report.webp`,
        intro: "The report is where trust is won or lost. Every element answers a question a farmer would ask before spending a season on it.",
        // x, y: the element the callout points at, as % of the screenshot
        callouts: [
          { x: 9, y: 21, title: "The decision first", body: "One crop, named in the largest type on the screen. Details come after the answer, not before it." },
          { x: 10, y: 31.7, title: "Suitability, not a promise", body: "The % is the crop's score out of the maximum, labelled 'match'. It never claims a yield." },
          { x: 76, y: 37.3, title: "Something to do this week", body: "A sowing window turns a recommendation into an action with a date range." },
          { x: 92, y: 47.3, title: "The reasons, at a glance", body: "Five checks (soil, water, season, budget, profit) passed or failed, each in one word." },
          { x: 92.5, y: 73.3, title: "Honest about money", body: "Profit potential carries its own level, so the farmer knows how sure we are." },
          { x: 8, y: 93.5, title: "Answer becomes a relationship", body: "One tap tracks the crop on the farm in Farm Monitoring for the rest of the season." },
        ],
      },
      engineIntro:
        "Under the screens is a rules engine I designed with the data science team. Every crop in the catalogue goes through the same three stages:",
      pipeline: {
        input: "100+ crops",
        stages: [
          { title: "Filter", caption: "Hard rules. A zero on any one eliminates the crop.", items: ["Agro-climatic zone", "Season", "Irrigation method", "Planning horizon"] },
          { title: "Score", caption: "Soft scores of 0, 1 or 2, each weighted.", items: ["Soil, 13 USDA texture classes", "Budget per acre", "Crop rotation"] },
          { title: "Rank", caption: "Total ÷ maximum = suitability %.", items: ["Sort by weighted total", "Keep the top 5", "Attach the reasons"] },
        ],
        output: "Top 5, explained",
      },
      engineRules: [
        "**Water is best-fit:** a farm with several sources is scored on the best one, so adding a source can only add crops, never remove them.",
        "**Missing data is neutral:** if a farm's soil class is unknown, soil is skipped rather than used to eliminate crops.",
        "**Every rule lives in a sheet, never in code:** a wrong region, a wrong texture or a factor that's too strong is fixed in the scoring reference by the agronomy team.",
      ],
      decisions: [
        {
          decision: "Filter first, then score",
          why: "A crop the water can't support shouldn't appear at 60%; elimination keeps the top 5 trustworthy.",
          tradeoff: "Some farms get no result, so I designed the 'no crop fits' screen with season suggestions instead of a weak pick.",
        },
        {
          decision: "Dropped the risk, fodder and labour questions in v3",
          why: "Each added a step for every farmer while zone, season, water, soil, budget and rotation already drove the ranking.",
          tradeoff: "Less nuance for livestock farmers; farm type is still asked so the advice can account for it.",
        },
        {
          decision: "Show 'suitability %' and the five checks behind it",
          why: "A bare ranking asks for blind trust; showing why a crop fits is what makes farmers act on it.",
          tradeoff: "More to read on the report, so each check is a single word: Excellent, Good, Perfect.",
        },
        {
          decision: "A no-code engine and server-driven questions",
          why: "Agronomy rules for a country this varied will need constant correction; engineering shouldn't be the bottleneck.",
          tradeoff: "Upfront work to build the scoring reference and a flexible questionnaire format.",
        },
      ],
    },
    outcomes: {
      intro: "Crop Guide shipped in Kissan Sampurna as part of the free core advisory that drives adoption, while AI diagnostics sit behind the subscription.",
      metrics: [
        { value: "7.7K+", label: "monthly active users at peak" },
        { value: "655K+", label: "farm profiles the engine ranks crops for" },
        { value: "Top 5", label: "of 100+ crops, explained for each farm" },
        { value: "0", label: "app releases needed to retune rules or questions" },
      ],
      impact: [
        "Every run ends in a farm in Farm Monitoring, turning a one-off answer into a season-long relationship with the field.",
        "The agronomy team owns the rules: regional fixes don't wait for an app release.",
        "The honest 'no crop fits' path protects trust and the farmer's credit instead of forcing a weak pick.",
      ],
      measureNext: [
        { metric: "Adoption", how: "Share of recommendations where the farmer logs the recommended crop on their farm within 30 days", tells: "Whether the advice is trusted enough to act on" },
        { metric: "Outcome", how: "Season-end yield and income against the farmer's previous season", tells: "Whether acting on it actually pays" },
        { metric: "Retention", how: "Share of farmers who run Crop Guide again the next season", tells: "Whether the first season earned a second" },
        { metric: "Engine health", how: "'No crop fits' rate by agro-climatic zone", tells: "Where the scoring reference has gaps" },
      ],
    },
    learnings: [
      "**Design for a market, not one farm.** If every farmer in a district gets the same top pick, Crop Guide could create the glut it is meant to prevent. The next version should spread recommendations using local acreage signals.",
      "**Close the loop at harvest.** Usage shows the feature is wanted; only season-end outcomes show it works. I would build the follow-up check-in into v1, not after.",
      "**Explain in the farmer's language, out loud.** Pictures carry the questions; reading the report aloud in the farmer's language would carry the answer to farmers who can't read it.",
    ],
    prototype: { id: "kissan-sampurna", flow: "crop-guide" },
    sources: [
      { id: "census-share", label: "Agriculture Census 2015-16: small and marginal holders about 86% of operational holders", publisher: "PIB, Ministry of Agriculture & Farmers Welfare", date: "14 Mar 2023", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1906888" },
      { id: "census-size", label: "Agriculture Census 2015-16: average operational holding 1.08 hectares", publisher: "PIB, Ministry of Agriculture & Farmers Welfare", date: "27 Mar 2026", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2246182" },
      { id: "nso", label: "Situation Assessment of Agricultural Households, NSS 77th round (2019): access to technical advice", publisher: "National Statistical Office, via PARI", date: "Sep 2021", url: "https://ruralindiaonline.org/en/library/resource/situation-assessment-of-agricultural-households-and-land-and-livestock-holdings-of-households-in-rural-india/" },
      { id: "water", label: "Prem Chand et al., Sustainable intensification of water guzzling crops: identifying suitable cropping districts of India", publisher: "Indian Journal of Agricultural Sciences 91", date: "2021", url: "https://epubs.icar.org.in/index.php/IJAgS/article/view/115779" },
      { id: "glut", label: "Kolar tomato farmers suffer as prices drop", publisher: "Hortidaily", date: "14 May 2025", url: "https://www.hortidaily.com/article/9731980/kolar-tomato-farmers-suffer-as-prices-drop/" },
      { id: "shc-trust", label: "Addressing fertiliser imbalance in India: poor understanding of and limited trust in soil health cards", publisher: "IDinsight", date: "Jul 2019", url: "https://www.idinsight.org/publication/addressing-fertiliser-imbalance-in-india/" },
      { id: "shc-trial", label: "Improving India's soil health card scheme: redesigned card raised comprehension from 0.5% to 33%", publisher: "IDinsight", date: "Nov 2020", url: "https://www.idinsight.org/project/improving-indias-soil-health-card-scheme-and-agricultural-markets/" },
    ],
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
