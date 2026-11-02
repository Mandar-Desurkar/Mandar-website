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
    // The whole report as one long screenshot; width and height are its pixels
    anatomy: { image: string; width: number; height: number; intro: string; callouts: CaseStudyCallout[] };
    engineIntro: string;
    pipeline: { input: string; stages: CaseStudyStage[]; output: string };
    engineRules: string[];
    // Optional: a real output of the system, shown under the pipeline
    evidence?: { image: string; width: number; height: number; caption: string };
    decisions: CaseStudyDecision[];
  };
  outcomes: { intro: string; metrics: CaseStudyMetric[]; impact: string[]; measureNext: { metric: string; how: string; tells: string }[] };
  learnings: string[];
  prototype: { id: "kissan-sampurna"; flow: string };
  sources: CaseStudySource[];
};

const IMG = "/case-studies/crop-guide";
const FM = "/case-studies/farm-monitoring";
const CD = "/case-studies/crop-doctor";

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
        takeaway: "**7.7K+** farmers a month at peak, on rules the agronomists own.",
        text: "The engine ranks crops for **655K+** farm profiles, and the agronomy team retunes it **without an app release**.",
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
        image: `${IMG}/05-report-full.webp`,
        width: 786,
        height: 6630,
        intro: "The report is where trust is won or lost. Every element answers a question a farmer would ask before spending a season on it. This is the whole report, top to bottom.",
        // x, y: the element the callout points at, as % of the full-length screenshot
        callouts: [
          { x: 9, y: 5.4, title: "The decision first", body: "One crop, named in the largest type on the screen. Details come after the answer, not before it." },
          { x: 10, y: 8.15, title: "Suitability, not a promise", body: "The % is the crop's score out of the maximum, labelled 'match'. It never claims a yield." },
          { x: 76, y: 9.59, title: "Something to do this week", body: "A sowing window turns a recommendation into an action with a date range." },
          { x: 92, y: 12.16, title: "The reasons, at a glance", body: "Five checks (soil, water, season, budget, profit) passed or failed, each in one word." },
          { x: 92.5, y: 18.84, title: "Honest about money", body: "Profit potential carries its own level, so the farmer knows how sure we are." },
          { x: 8, y: 24.03, title: "Answer becomes a relationship", body: "One tap tracks the crop on the farm in Farm Monitoring for the rest of the season." },
          { x: 10, y: 26.8, title: "The trade-offs in view", body: "The rest of the top 5, each with its match, one tap from its own report." },
          { x: 73, y: 45.4, title: "The weather it needs", body: "Temperature, rainfall and humidity ranges for the crop, each marked against the farmer's area." },
          { x: 10, y: 58.7, title: "Risks, with the fix", body: "The pests and diseases to expect, each with what to do about it." },
          { x: 78.7, y: 72.9, title: "Tips ranked by impact", body: "Practical tips tagged High or Medium, so the farmer knows where to start." },
          { x: 10, y: 85.8, title: "Why it pays beyond one season", body: "What the crop does for the soil and for income, beyond this harvest." },
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
  {
    slug: "farm-monitoring",
    title: "Farm Monitoring: satellite maps that tell a farmer what to do, and where",
    subtitle:
      "How I turned satellite imagery into a farm report a smallholder can act on: three colour maps of the field and zone-by-zone advice cards, in 13 Indian languages.",
    product: "Kissan Sampurna",
    cover: `${FM}/06-report.webp`,
    tags: ["AgriTech", "Satellite / remote sensing", "Advisory UX", "0→1"],
    card: {
      problem: "A farmer checks the field from its edge, so problems in the middle are found late and treated everywhere.",
      metric: "9.8K+ MAU and 1.6K+ DAU at peak, in 13 languages",
      stats: [
        { value: "9.8K+", label: "Peak MAU" },
        { value: "3", label: "Maps per report" },
        { value: "13", label: "Languages" },
      ],
    },
    meta: [
      { label: "Role", value: "Associate Product Manager" },
      { label: "Company", value: "Silo Fortune" },
      { label: "Team", value: "Engineering, design, data science" },
      { label: "Platform", value: "Mobile app, 13 Indian languages" },
      { label: "Timeline", value: "2025–26" },
    ],
    glance: [
      {
        label: "The challenge",
        takeaway: "Farmers find problems late, then treat the whole field.",
        text: "Stress starts in patches nobody sees from the field's edge, so the fix is one dose everywhere, and crops use only about **30%** of the nitrogen applied.",
        source: "nue",
      },
      {
        label: "Our approach",
        takeaway: "Satellite maps turned into zone-by-zone actions.",
        text: "Sentinel-2 imagery becomes three colour maps of the farm (growth, moisture, nutrition) and cards that say **where** to act and **what** to do.",
      },
      {
        label: "The impact",
        takeaway: "**9.8K+** farmers a month watching their fields from space.",
        text: "**1.6K+** daily users at peak, in **13** Indian languages.",
      },
    ],
    heroScreens: [`${FM}/03-draw.webp`, `${FM}/06-report.webp`, `${FM}/08-full-details.webp`],
    headlines: {
      problem: "The problem nobody sees until it has spread",
      people: "Two farmers who can't watch every row",
      today: "Today a field is checked from its edge",
      principles: "Six insights, six design rules",
      solution: "Map the farm once, then get told what to do and where",
      engine: "From satellite pixels to a card a farmer can act on",
      decisions: "What I chose, and what each choice cost",
      outcomes: "9.8K+ farmers a month, watching their fields from space",
      reflection: "What I'd do differently",
    },
    problem: {
      featured: {
        value: 30,
        label: "of the nitrogen fertiliser a farmer applies is used by the crop",
        caption: "Out of every 100 kg spread across a field, the crop takes up about 30. The rest is lost to the environment, and so is the money spent on it.",
        source: "nue",
      },
      intro:
        "A smallholder sees the crop from the bund. Nitrogen shortage, dry patches and early pest pressure start in one part of the field, and by the time they show from the edge, part of the season is lost. The usual fix is to treat the whole field the same way. Satellites can pick up that stress before the eye can; what's missing is a way to turn a colour map into something a farmer will act on.",
      stats: [
        { value: "~86%", label: "of India's farmers are small or marginal, with no agronomist, drone or sensor of their own", source: "census-share" },
        { value: "1 : 1,156", label: "extension workers to farmers", source: "extension" },
        { value: "2 years", label: "between soil tests under the Soil Health Card scheme, on a printed card", source: "shc-pib" },
      ],
      statement:
        "Farmers can't see what is happening inside their own field while the crop is growing. Soil tests come every two years and advice comes from the input dealer, so problems are spotted late and fixed with the same blanket dose everywhere, usually more urea.",
      hmw: "How might we show every farmer what is happening across their field this week, and tell them exactly where to act, in a way they can follow without an agronomist?",
    },
    personasNote:
      "Composite personas, built from the field context above and the farms in the app's sample data, not individual interviewees.",
    personas: [
      {
        name: "Savitha, 38",
        role: "Smallholder farmer",
        attrs: [
          { label: "Place", value: "Tumakuru, Karnataka" },
          { label: "Land", value: "2.4 acres" },
          { label: "Water", value: "Borewell with drip" },
          { label: "Grows", value: "Wheat this rabi" },
        ],
        quote: "By the time I see yellow leaves from the road, the damage is already done.",
        goals: ["Catch a problem while it is still small", "Spend on fertiliser only where it is needed", "Advice in Kannada she can follow"],
        frustrations: ["Can't walk every row every day", "The dealer recommends what he sells", "Soil card is two years old and hard to read"],
      },
      {
        name: "Mahesh, 52",
        role: "Farmer with scattered plots",
        attrs: [
          { label: "Place", value: "Near Tumakuru" },
          { label: "Land", value: "Three plots, 5 acres in all" },
          { label: "Water", value: "Canal and borewell" },
          { label: "Grows", value: "Different crops per plot" },
        ],
        quote: "My plots are kilometres apart. I visit one and worry about the other two.",
        goals: ["See every plot from one place", "Know which plot needs him first", "Track whether his fixes worked"],
        frustrations: ["Travel time between plots", "No record of what he did last season", "Advice that ignores which crop is where"],
      },
    ],
    journeyIntro: "How a farmer like Savitha looks after a standing crop today, and where it goes wrong.",
    journey: [
      {
        step: "Walk the edge",
        feel: 1,
        feeling: "Routine",
        does: "Checks the crop from the bund when there is time.",
        pain: "The middle of the field goes unseen; a 2.4-acre plot is too big to walk row by row every day.",
      },
      {
        step: "Spot it late",
        feel: -1,
        feeling: "Worried",
        does: "Notices yellowing or wilting once it shows from the edge.",
        pain: "Stress is visible from the bund only once it has spread, and part of the yield is already gone.",
      },
      {
        step: "Ask the dealer",
        feel: 0,
        feeling: "Hopeful",
        does: "Asks the input dealer or a neighbour what to apply.",
        pain: "With one extension worker per 1,156 farmers, the dealer is often the only adviser.",
        source: "extension",
      },
      {
        step: "Treat everything",
        feel: -1,
        feeling: "Unsure",
        does: "Spreads the same dose across the whole field, usually urea.",
        pain: "Fields are patchy, so the healthy part gets fertiliser it doesn't need and the weak part may still get too little.",
        source: "blaes",
      },
      {
        step: "Check the soil card",
        feel: -1,
        feeling: "Confused",
        does: "Looks at a printed soil card, if there is one.",
        pain: "A soil test every two years can't say what the crop needs this week.",
        source: "shc-pib",
      },
      {
        step: "Wait for harvest",
        feel: -2,
        feeling: "In the dark",
        does: "Waits to see whether the fix worked.",
        pain: "No feedback until harvest, so next season repeats the same guess.",
      },
    ],
    principles: [
      {
        insight: "An index map means nothing to most farmers: a value of 0.42 doesn't say whether to worry.",
        principle: "Never show an index. Show three colours, name each in plain words (Low, Medium, High vigour) and use the same scale on every map.",
      },
      {
        insight: "Problems start in part of a field: in one smallholder study, fertilisation explained at least half of the within-field variation in greenness on half the fields.",
        principle: "Point to the zone, not the farm. Every card says where (red zone, yellow zone, whole farm) and which map shows it.",
        source: "blaes",
      },
      {
        insight: "A diagnosis that doesn't end in an action gets read and forgotten.",
        principle: "Every card ends in one thing to do this week, and 'Mark as done' closes the loop.",
      },
      {
        insight: "Farmers act on advice they trust, and trust needs a reason.",
        principle: "Put 'How we know this' on every card, one tap away and never in the way.",
      },
      {
        insight: "What's right depends on the crop's stage, and the satellite can't see the sowing date.",
        principle: "Ask the farmer to confirm the stage, so advice matches where the crop really is.",
      },
      {
        insight: "Many farmers know their land by walking it, not from a satellite view.",
        principle: "Offer two ways to map a field: draw it on the map, or walk the boundary dropping pins.",
      },
    ],
    solution: {
      intro:
        "Farm Monitoring is set up once per field and then reports on it all season. A farmer adds the farm with a few questions, maps its boundary, and gets a report of three satellite maps with advice cards for each zone.",
      beforeReport: [
        {
          title: "Every field in one place",
          what: "My Farms lists each field with its satellite thumbnail, crop and area. A field saved without a boundary shows 'Locate your Farm', so an unfinished setup is easy to resume.",
          why: "Farmers with scattered plots, like Mahesh, need one view of all of them, and setup often happens in two sittings.",
          screens: [{ image: `${FM}/01-my-farms.webp`, label: "My Farms" }],
        },
        {
          title: "Map the field your way",
          what: "Draw the boundary by tapping the corners on a satellite map, or walk around the field dropping pins. The area updates live, with Undo, Redo and Clear all.",
          why: "A precise boundary means the readings belong to this farm alone. Walking suits farmers who can't read a view from above; pins placed too close together are rejected.",
          screens: [
            { image: `${FM}/02-mark.webp`, label: "Choose a way" },
            { image: `${FM}/03-draw.webp`, label: "Draw" },
            { image: `${FM}/04-walk.webp`, label: "Walk" },
          ],
        },
        {
          title: "A clear 'you're set' moment",
          what: "'Your farm is now monitored', with See the Insights as the next step and Add another Farm one tap away.",
          why: "Setup has to end in something the farmer can feel; the report follows immediately rather than at some later date.",
          screens: [{ image: `${FM}/05-complete.webp`, label: "Setup complete" }],
        },
      ],
      afterReport: [
        {
          title: "Depth for those who want it",
          what: "Full Details holds the growth timeline with today's stage, pest and disease risk with a Crop Doctor hand-off, leaf moisture, heat effects and good habits.",
          why: "Most farmers need the actions; some want the reasons. Keeping depth off the main report keeps the report short.",
          screens: [{ image: `${FM}/08-full-details.webp`, label: "Full details" }],
        },
        {
          title: "Proof that it's working",
          what: "History lists every past report by day, with its status, so a farmer can see the field move from Needs Attention to Healthy.",
          why: "Without a before and after, a farmer can't tell whether acting on the advice paid off.",
          screens: [{ image: `${FM}/09-history.webp`, label: "History" }],
        },
        {
          title: "Useful between seasons",
          what: "With no crop growing, the report shows live moisture, soil temperature, weather and UV, with 'See What to Plant' into Crop Guide.",
          why: "A field is monitored all year, not only while a crop stands, and the next decision is what to sow.",
          screens: [{ image: `${FM}/10-no-crop.webp`, label: "No crop" }],
        },
      ],
      anatomy: {
        image: `${FM}/07-report-full.webp`,
        width: 786,
        height: 4938,
        intro: "The report turns three satellite maps into a short list of actions. Every element answers a question a farmer would ask. This is the whole report, top to bottom (sample values).",
        callouts: [
          { x: 9.4, y: 6.52, title: "Status before detail", body: "One status in large type (Needs Attention, Healthy) with the reason in one sentence under it." },
          { x: 90.6, y: 7.15, title: "Freshness you can see", body: "'Updated 2 hr ago' and Sync, because satellite data has a date and stale advice is wrong advice." },
          { x: 90.6, y: 23.61, title: "Three maps, one scale", body: "Growth, Moisture and Nutrition share the same red, yellow and green, so a farmer learns to read it once." },
          { x: 56.5, y: 27.65, title: "Words, never index values", body: "The legend says Low, Medium or High Vigour and Dry or Moist, not NDVI numbers." },
          { x: 10.2, y: 33.84, title: "Where, and on which map", body: "A zone chip (Red zone, Whole farm) and a map chip tie each card to the colours above." },
          { x: 10.2, y: 37.54, title: "One action, then done", body: "Each card is one thing to do this week. Mark as done turns advice into a record." },
          { x: 90.8, y: 39.65, title: "The reason, on demand", body: "'How we know this' explains the evidence behind the card, one tap away." },
          { x: 94.9, y: 66.93, title: "Vitals in plain words", body: "Crop growth, nitrogen, soil moisture and root-zone temperature, each in a word or a number." },
          { x: 87, y: 86.16, title: "The farmer corrects the model", body: "Confirming or changing the crop stage keeps the advice matched to where the crop really is." },
          { x: 29.8, y: 88.81, title: "Depth off the main report", body: "View Full Details holds the timeline, pest risk, leaf moisture and heat effects." },
        ],
      },
      engineIntro:
        "Behind the report is a pipeline I specified with the data science team. Each farm boundary goes through the same four stages:",
      pipeline: {
        input: "Farm boundary",
        stages: [
          { title: "Capture", caption: "Recent, cloud-checked imagery of just this farm.", items: ["Sentinel-2, 10 m bands", "New pass about every 5 days", "Clipped to the boundary"] },
          { title: "Map", caption: "Three indices, each split into three classes.", items: ["Growth (vigour)", "Moisture", "Nutrition"] },
          { title: "Read", caption: "Readings combined with what the farmer told us.", items: ["Crop and sowing date", "Irrigation and soil", "Weather and heat"] },
          { title: "Advise", caption: "A fixed report structure, written as actions.", items: ["Overall status and reason", "Cards per zone", "Immediate and short-term tasks"] },
        ],
        output: "Zone-by-zone advice",
      },
      engineRules: [
        "**Every map carries its own date, cloud cover and reliability.** A cloudy pass and a real problem must never look the same.",
        "**Zones are shares of the field, not a single score.** On the real farm above, 36% of the field showed low vigour, 51% was dry and 17% was low in nutrients: three different problems, in three different places.",
        "**The crop and its stage shape the advice.** The sowing date sets the stage, and the farmer can confirm or correct it from the report.",
        "**One report structure for every farm:** overall condition, crop growth, nitrogen and fertiliser need, soil and root zone, water stress, weather and heat, pest and spray, then clear recommendations.",
      ],
      evidence: {
        image: `${FM}/real-satellite-maps.webp`,
        width: 1552,
        height: 608,
        caption: "Real pipeline output for one 2.45 ha farm: Sentinel-2 pass of 9 Oct 2026, 0% cloud, all three maps rated reliable. The farm name is removed. The app shows these same maps with the plain-word legend.",
      },
      decisions: [
        {
          decision: "Three colours instead of index values",
          why: "An index number asks the farmer to interpret it; a colour with a plain word does that work for them.",
          tradeoff: "Less precision on the main report, so the detail lives in Full Details for those who want it.",
        },
        {
          decision: "Advice per zone, not one score per field",
          why: "Problems start in part of the field, so a field-level average would hide exactly what matters.",
          tradeoff: "Zones need an accurate boundary, which is why I invested in two ways to map a field.",
        },
        {
          decision: "Walk-to-mark alongside drawing",
          why: "Reading a satellite view is a skill many farmers don't have; everyone can walk their own field.",
          tradeoff: "Walking takes longer and depends on phone GPS, so pins too close together are rejected and the area updates live.",
        },
        {
          decision: "Ask the farmer to confirm the crop stage",
          why: "Stage changes what is right to do, and the satellite can't see the sowing date.",
          tradeoff: "One more question on the report, kept to a single tap: Yes, Confirm or Change stage.",
        },
      ],
    },
    outcomes: {
      intro: "Farm Monitoring shipped in Kissan Sampurna in 13 languages. Reports refresh on demand with Sync, which is part of the paid plan; the app routes non-subscribers to the plans.",
      metrics: [
        { value: "9.8K+", label: "monthly active users at peak" },
        { value: "1.6K+", label: "daily active users at peak" },
        { value: "13", label: "Indian languages" },
        { value: "3", label: "satellite maps in every report" },
      ],
      impact: [
        "Crop Guide hands off into Farm Monitoring, so a recommendation becomes a crop that is tracked all season.",
        "Mark as done and History give the farmer, and the team, a record of what was advised and what was acted on.",
        "Between seasons the same field still reports moisture, soil temperature and weather, and points to Crop Guide.",
      ],
      measureNext: [
        { metric: "Action rate", how: "Share of advice cards marked as done within 7 days", tells: "Whether the advice is clear and trusted enough to act on" },
        { metric: "Zone recovery", how: "Change in the red-zone share between the report before and after an action", tells: "Whether acting on the card actually fixed the problem" },
        { metric: "Input savings", how: "Fertiliser spend per acre for monitored versus unmonitored farms", tells: "Whether zone advice ends blanket dosing" },
        { metric: "Season retention", how: "Share of farms still synced in the last month of the crop", tells: "Whether the report stays useful all season" },
      ],
    },
    learnings: [
      "**Ground-truth the red zones.** Satellite stress is a signal, not a diagnosis. I'd build a light field-check loop from day one, so the team learns which colours turn out to be real problems.",
      "**Push, don't wait.** Today the farmer opens the report. The bigger win is an alert when a zone turns red, read aloud in the farmer's language.",
      "**Respect small fields.** At 10 m, one acre is only about 40 pixels, and edge pixels mix with the neighbour's crop. I'd set a minimum field size and buffer the edges before showing zones.",
    ],
    prototype: { id: "kissan-sampurna", flow: "farm-report" },
    sources: [
      { id: "nue", label: "Indian research can help cut nitrogen fertiliser waste: crops generally use up 30 per cent of nitrogen fertiliser applied", publisher: "Down To Earth", date: "21 Jan 2021", url: "https://www.downtoearth.org.in/agriculture/indian-research-can-help-cut-nitrogen-fertiliser-waste-75165" },
      { id: "census-share", label: "Agriculture Census 2015-16: small and marginal holders about 86% of operational holders", publisher: "PIB, Ministry of Agriculture & Farmers Welfare", date: "14 Mar 2023", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1906888" },
      { id: "extension", label: "Point of no agri-returns, Part 5: one extension functionary for every 1,156 farmers", publisher: "Down To Earth", date: "25 Jan 2018", url: "https://www.downtoearth.org.in/science-technology/50-000-dedicated-scientists-still-agriculture-is-an-orphan-of-science-59570" },
      { id: "shc-pib", label: "Soil Health Card, 'Swasth Dharaa, Khet Haraa': a printed report on 12 soil parameters, with guidance every 2 years; 25 crore cards distributed", publisher: "PIB, Ministry of Agriculture & Farmers Welfare", date: "Aug 2025", url: "https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/aug/doc2025816613501.pdf" },
      { id: "blaes", label: "Blaes et al., Quantifying fertilizer application response variability with VHR satellite NDVI time series in a rainfed smallholder cropping system of Mali", publisher: "Remote Sensing 8(7)", date: "2016", url: "https://oar.icrisat.org/9948/1/remotesensing-08-00531.pdf" },
      { id: "sentinel", label: "Sentinel-2 facts and figures: 10 m visible and near-infrared bands, five-day revisit with two satellites", publisher: "European Space Agency", date: "Mission page", url: "https://www.esa.int/Our_Activities/Observing_the_Earth/Copernicus/Sentinel-2/Facts_and_figures" },
    ],
  },
  {
    slug: "crop-doctor",
    title: "AI Crop Doctor: one photo to the disease, its stage and a plan for each day",
    subtitle:
      "How I shipped a computer-vision crop diagnosis that tells a smallholder how bad it is, what waiting will cost and what to do each day, as the paid core of Kissan Sampurna.",
    product: "Kissan Sampurna",
    cover: `${CD}/08-report.webp`,
    tags: ["AgriTech", "Computer vision", "Freemium", "Low-literacy UX"],
    card: {
      problem: "Farmers guess the disease from a few spots on a leaf, then spray what the shop sells.",
      metric: "4.8K+ MAU at peak, one photo to a stage-by-stage plan",
      stats: [
        { value: "4.8K+", label: "Peak MAU" },
        { value: "5", label: "Severity stages" },
        { value: "7-day", label: "Treatment plan" },
      ],
    },
    meta: [
      { label: "Role", value: "Associate Product Manager" },
      { label: "Company", value: "Silo Fortune" },
      { label: "Team", value: "Engineering, design, data science" },
      { label: "Platform", value: "Mobile app, 13 Indian languages" },
      { label: "Timeline", value: "2025–26" },
    ],
    glance: [
      {
        label: "The challenge",
        takeaway: "Farmers guess the disease, then guess the spray.",
        text: "Pests and diseases take up to **40%** of the world's crop each year, and in one North Indian study the shop selling the pesticide was farmers' top adviser.",
        source: "fao",
      },
      {
        label: "Our approach",
        takeaway: "One photo to the disease, its stage and a dated plan.",
        text: "A vision model checks the photo, names the disease and its **severity stage**, prices the loss for the farmer's own farm and lays out a **day-by-day** treatment.",
      },
      {
        label: "The impact",
        takeaway: "**4.8K+** farmers a month at peak.",
        text: "The paid core of the freemium model: advisory stays free to bring farmers in, and diagnosis sits on the **subscription**.",
      },
    ],
    heroScreens: [`${CD}/05-camera.webp`, `${CD}/08-report.webp`, `${CD}/10-history.webp`],
    headlines: {
      problem: "Spots on a leaf, and a week to get it right",
      people: "Two farmers guessing at the same spots",
      today: "Today the diagnosis comes from the shop counter",
      principles: "Six insights, six design rules",
      solution: "One photo, then an answer that says how bad and what next",
      engine: "From a phone photo to a plan for each day",
      decisions: "What I chose, and what each choice cost",
      outcomes: "4.8K+ farmers a month, diagnosing from a photo",
      reflection: "What I'd do differently",
    },
    problem: {
      featured: {
        value: 40,
        label: "of global crop production is lost to pests each year",
        caption: "Out of every 100 plants grown, up to 40 are lost to pests and diseases. Plant diseases alone cost the world over $220 billion a year.",
        source: "fao",
      },
      intro:
        "A smallholder notices spots on a few leaves and has to decide, that week, what it is and what to spray. Many diseases look alike, the nearest adviser is usually the shop selling the spray, and every day of a wrong guess lets the disease move to its next stage. Apps that name a disease from a photo already exist; a name alone doesn't say how urgent it is, what waiting will cost or what to do tomorrow.",
      stats: [
        { value: "32.6%", label: "of farmers in a North Indian study got pesticide advice from the retailer, the top source", source: "sachan" },
        { value: "55%", label: "of the same farmers didn't read and follow the pesticide label", source: "sachan" },
        { value: "~42%", label: "of India's farm households get any technical advice at all", source: "nso" },
      ],
      statement:
        "Farmers can't tell which disease they are looking at or how far it has gone, so they spray what the shop recommends, at a dose they can't read, and find out too late whether it worked.",
      hmw: "How might we turn one photo of a sick leaf into a diagnosis a farmer trusts, a sense of how urgent it is, and a plan for each day, in their own language?",
    },
    personasNote:
      "Composite personas, built from the field context above and the app's farmer base in Karnataka, not individual interviewees.",
    personas: [
      {
        name: "Shivanna, 49",
        role: "Smallholder farmer",
        attrs: [
          { label: "Place", value: "Mandya, Karnataka" },
          { label: "Land", value: "3 acres" },
          { label: "Water", value: "Canal" },
          { label: "Grows", value: "Paddy" },
        ],
        quote: "The shop gave me a spray for the spots. Two weeks later half the field had turned brown.",
        goals: ["Know what it is before paying for a spray", "Know whether the crop can still be saved", "Instructions in Kannada he can follow"],
        frustrations: ["The shop recommends what it stocks", "Spots from different diseases look the same", "Dose instructions in small print"],
      },
      {
        name: "Kavya, 29",
        role: "Vegetable grower",
        attrs: [
          { label: "Place", value: "Near Belagavi, Karnataka" },
          { label: "Land", value: "1.5 acres" },
          { label: "Water", value: "Borewell with drip" },
          { label: "Grows", value: "Tomato and chilli" },
        ],
        quote: "Every video on my phone shows a different disease that looks like mine.",
        goals: ["An answer the same evening", "A plan she can follow day by day", "Proof that the spray worked"],
        frustrations: ["Videos aren't about her crop or its stage", "No adviser to call after dark", "Paying twice when the first spray was wrong"],
      },
    ],
    journeyIntro: "How a farmer like Shivanna deals with a diseased crop today, and where it goes wrong.",
    journey: [
      {
        step: "Spot the signs",
        feel: 0,
        feeling: "Uneasy",
        does: "Notices brown spots on a few leaves.",
        pain: "Early spots from different diseases look alike, and the first days are when treatment works best.",
      },
      {
        step: "Ask the shop",
        feel: 0,
        feeling: "Hopeful",
        does: "Shows a leaf, or describes it, at the pesticide shop.",
        pain: "In one North Indian study the pesticide retailer was farmers' top source of advice, ahead of government extension.",
        source: "sachan",
      },
      {
        step: "Spray what's sold",
        feel: -1,
        feeling: "Unsure",
        does: "Buys the recommended product and mixes it by eye.",
        pain: "More than half of the farmers in the same study didn't read and follow the label.",
        source: "sachan",
      },
      {
        step: "Wait and watch",
        feel: -1,
        feeling: "Anxious",
        does: "Waits to see whether the spots stop spreading.",
        pain: "Nothing tells the farmer whether it's working, while the disease moves on to its next stage.",
      },
      {
        step: "Spray again",
        feel: -2,
        feeling: "Frustrated",
        does: "Tries a second product when the first one doesn't work.",
        pain: "Two sprays cost twice as much, and the first one never helped.",
      },
      {
        step: "Count the loss",
        feel: -2,
        feeling: "Defeated",
        does: "Finds out at harvest how much of the crop was lost.",
        pain: "Pests and diseases take up to 40% of global crop production every year.",
        source: "fao",
      },
    ],
    principles: [
      {
        insight: "Farmers act on urgency and money, not on Latin names.",
        principle: "Lead with severity and the loss on the farmer's own farm; the disease's scientific name comes last.",
      },
      {
        insight: "A blurry or far-away photo gets a confident wrong answer.",
        principle: "Coach the photo and check it before diagnosing; send back a reason, never a guess.",
      },
      {
        insight: "Many diseases look alike, especially across crops.",
        principle: "Ask for the crop first, so the diagnosis only considers that crop's diseases.",
      },
      {
        insight: "A disease moves: what works on day 1 is the wrong treatment by day 8.",
        principle: "Diagnose the stage, not just the disease, and match the treatment to the stage.",
      },
      {
        insight: "Advice without a follow-up never shows whether it worked.",
        principle: "End every plan with 'Rescan and decide' on day 7.",
      },
      {
        insight: "Farmers trust what they can see for themselves.",
        principle: "Show the exact spots the model found, cropped from the farmer's own photo.",
      },
    ],
    solution: {
      intro:
        "AI Crop Doctor takes a farmer from a sick leaf to a plan in a few taps: pick the crop, learn how to take the photo, take it, confirm it, and read a report that is ready within about 90 seconds.",
      beforeReport: [
        {
          title: "Set expectations first",
          what: "Three pictures (take photo, get report, take action) explain the feature before the camera opens.",
          why: "Many users are new to smartphones, so pictures carry the promise without reading. Free users who have used their scans see the plans from this button, before they spend effort on a photo.",
          screens: [{ image: `${CD}/01-home.webp`, label: "Crop Doctor" }],
        },
        {
          title: "Crop first, then the photo",
          what: "Popular crops in one tap, seven categories for the rest, and 'Can't find your crop?' to request one, with an optional region.",
          why: "Knowing the crop narrows the diagnosis to that crop's diseases. A missing crop becomes a demand signal, and the region tells the team where to collect training photos first.",
          screens: [
            { image: `${CD}/02-select-crop.webp`, label: "Select crop" },
            { image: `${CD}/03-request.webp`, label: "Request a crop" },
          ],
        },
        {
          title: "Coach the photo, not just the model",
          what: "'Clear photo, better diagnosis' with a do and don't guide, then a custom camera with a framing box and a close-versus-far guide that can be read aloud.",
          why: "Bad diagnoses often start as bad photos: blurry, too far away or with no plant in frame. Fixing the input is cheaper than fixing the model.",
          screens: [
            { image: `${CD}/04-scan-method.webp`, label: "Scan method" },
            { image: `${CD}/05-camera.webp`, label: "Camera" },
          ],
        },
        {
          title: "Confirm before spending a scan",
          what: "Try Again or Continue, then a designed wait: a scan line sweeps the photo, three checks tick off (colour, disease pattern, damage) and tips rotate.",
          why: "A blurry photo never uses up a scan. The report takes 40 to 90 seconds, so the wait shows progress instead of a spinner.",
          screens: [
            { image: `${CD}/06-review.webp`, label: "Review" },
            { image: `${CD}/07-analyzing.webp`, label: "Analysis" },
          ],
        },
      ],
      afterReport: [
        {
          title: "Good news is a result too",
          what: "A healthy crop gets a green confirmation straight away, with Try Again for the next plant.",
          why: "There's no report to wade through when nothing is wrong, and checking the next plant takes seconds.",
          screens: [{ image: `${CD}/09-healthy.webp`, label: "Healthy" }],
        },
        {
          title: "Every scan, kept",
          what: "Report history lists every scan with its crop, disease, date and severity, newest first, with a new scan one tap away.",
          why: "A rescan on day 7 only means something next to the first report.",
          screens: [{ image: `${CD}/10-history.webp`, label: "History" }],
        },
      ],
      anatomy: {
        image: `${CD}/08-report-full.webp`,
        width: 786,
        height: 7810,
        intro: "The report answers, in order, what a farmer asks about a sick crop: how bad is it, what is it, what will it cost, and what do I do today. This is the whole report, top to bottom (the app's own sample report).",
        callouts: [
          { x: 88, y: 5.5, title: "Severity before science", body: "A Moderate badge colours the report and 'Immediate action required' says how urgent it is, before any scientific name." },
          { x: 8, y: 17.85, title: "Proof on their own photo", body: "Zoomed crops of the farmer's photo show the exact signs the model found: oval brown spots, merged lesions, yellowing." },
          { x: 92, y: 24.55, title: "Weather joins the diagnosis", body: "Heavy rain on Thursday favours fungal spread, so the card says to finish spraying by Wednesday." },
          { x: 90, y: 31.45, title: "Money at stake, on their farm", body: "Revenue loss is a range for the farmer's own acreage, not a national average." },
          { x: 47, y: 33.5, title: "How fast it gets worse", body: "A timeline of the stages, with today marked, shows the loss 4 and 8 days either side." },
          { x: 12, y: 38.46, title: "Pick the farm it's on", body: "Switching between the farmer's farms recalculates the loss for that farm's size." },
          { x: 53, y: 45.6, title: "What waiting looks like", body: "The leaf at the last stage, today and the next, with the forecast: about 45% to 80% spread in 4 days." },
          { x: 9.4, y: 55.5, title: "A plan with dates", body: "Steps matched to today's stage, each dated Today, Tomorrow, 2 days later." },
          { x: 86, y: 59.2, title: "Done, not just read", body: "Mark as Completed turns each step into a record." },
          { x: 9.4, y: 71.2, title: "Rescan and decide", body: "The last step is a rescan on day 7: step up if it's still spreading, keep preventive cover if not." },
          { x: 10, y: 80, title: "Stop the next outbreak", body: "Preventive actions for the rest of the season: clean seed, spacing, watering at the base." },
          { x: 9.2, y: 95.4, title: "Back into the farm", body: "Farm Monitor and Crop Guide are one tap away, so a diagnosis leads back to the field." },
        ],
      },
      engineIntro:
        "Behind the report is a vision pipeline I integrated with the engineering and data science teams. Every photo goes through the same four stages:",
      pipeline: {
        input: "One photo of the leaf",
        stages: [
          { title: "Check", caption: "Turn back a photo the model can't read, with the reason.", items: ["Resized before upload", "Too blurry, too dark, no plant", "Healthy plants return at once"] },
          { title: "Diagnose", caption: "Name the disease within the chosen crop.", items: ["Disease and its type", "The part of the plant affected", "Early signs located on the photo"] },
          { title: "Stage", caption: "Place it on a five-stage scale.", items: ["Healthy to Total Loss", "Spread and days to the next stage", "Loss per acre at each stage"] },
          { title: "Plan", caption: "Treatment for this stage, from a knowledge base.", items: ["Dated, day-by-day steps", "Label dose and pre-harvest interval", "Preventive actions"] },
        ],
        output: "A plan for each day",
      },
      engineRules: [
        "**A bad photo is turned back, not guessed.** The check names its reason (too blurry, too dark, no plant found), so the farmer knows what to fix, and no scan is spent.",
        "**Healthy is an answer.** A healthy plant comes back straight away with a green confirmation, not a report.",
        "**The stage picks the treatment.** In the app's sample for rice brown spot, an early spot gets a protectant fungicide, a spreading one a systemic, an infection spread containment of the rest of the field, and a total loss a plan to remove and reset.",
        "**The wait is part of the design.** Reports take 40 to 90 seconds, so they are built in the background; the app checks every 10 seconds and fills the wait with the scan animation and tips.",
      ],
      decisions: [
        {
          decision: "Crop first, then the photo",
          why: "Knowing the crop narrows the diagnosis to that crop's diseases, and look-alike symptoms are where wrong sprays begin.",
          tradeoff: "One more step before the camera, kept to a tap with popular crops on top and 'Request crop' for the rest.",
        },
        {
          decision: "Stage and money, not just a disease name",
          why: "A name doesn't say whether to act today; the stage, the spread and the loss on the farmer's own farm do.",
          tradeoff: "Stage and loss are estimates, so loss is always shown as a range, never as one number.",
        },
        {
          decision: "Check the photo before diagnosing it",
          why: "A confident wrong answer costs the farmer a spray and costs us their trust; a rejected photo costs one retake.",
          tradeoff: "Some farmers have to retake, so the rejection names the reason and the camera guide shows what a good photo looks like.",
        },
        {
          decision: "Diagnosis on the paid plan, advisory free",
          why: "Every scan runs a model, and a sick crop is the moment the value is clearest; free advisory brings farmers in first.",
          tradeoff: "Free users meet the paywall at a worrying moment, so the plan opens with a ₹1 trial and a reminder before any charge.",
        },
      ],
    },
    outcomes: {
      intro: "AI Crop Doctor shipped in Kissan Sampurna as the paid core of the freemium model: core advisory stays free to drive adoption, and diagnosis sits on the subscription.",
      metrics: [
        { value: "4.8K+", label: "monthly active users at peak" },
        { value: "5", label: "severity stages, each with its own plan" },
        { value: "7-day", label: "plan that ends in a rescan" },
        { value: "1", label: "photo from a sick leaf to a plan" },
      ],
      impact: [
        "The day-7 rescan turns one diagnosis into a check of whether the treatment worked.",
        "Crop requests, with their regions, tell the team which crops to collect training photos for next.",
        "Diagnosis is where free users meet the plans, so it carries the subscription that keeps the advisory free.",
      ],
      measureNext: [
        { metric: "Accuracy", how: "Agreement between the diagnosis and an agronomist's review, on a weekly sample for each crop", tells: "Whether the model is right often enough to act on" },
        { metric: "Photo quality", how: "Share of photos turned back, by reason and by phone model", tells: "Where the coaching or the camera needs work" },
        { metric: "Rescan rate", how: "Share of reports rescanned between day 7 and day 10", tells: "Whether farmers follow the plan to the end" },
        { metric: "Recovery", how: "Change in stage between the first scan and the rescan", tells: "Whether following the plan stops the spread" },
        { metric: "Trial start", how: "Share of free users who start the ₹1 trial from a scan", tells: "Whether diagnosis earns the subscription" },
      ],
    },
    learnings: [
      "**Prove accuracy in the field, not the lab.** A model that scores well on test images can still miss on a dusty leaf in noon light. I'd publish an agronomist-reviewed sample for each crop before adding the next one.",
      "**Show doubt when the model has it.** Some diseases look alike. When two are close, the report should show both and what to check, rather than one confident answer.",
      "**Make the dose impossible to miss.** More than half the farmers in one study didn't read the pesticide label, so the dose and pre-harvest interval should be read aloud at the step where they apply.",
    ],
    prototype: { id: "kissan-sampurna", flow: "crop-doctor" },
    sources: [
      { id: "fao", label: "Climate change fans spread of pests and threatens plants and crops: up to 40 percent of global crop production lost to pests each year; plant diseases cost over $220 billion", publisher: "Food and Agriculture Organization of the UN", date: "2 Jun 2021", url: "https://www.fao.org/newsroom/detail/Climate-change-fans-spread-of-pests-and-threatens-plants-and-crops-new-FAO-study/en" },
      { id: "sachan", label: "Sachan et al., Agricultural pesticide use and misuse among North Indian farmers (387 farmers, rural Lucknow): 32.6% got pesticide information from retailers; 55% did not read and follow the label", publisher: "Journal of Family Medicine and Primary Care 11(10)", date: "Oct 2022", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9810978/" },
      { id: "nso", label: "Situation Assessment of Agricultural Households, NSS 77th round (2019): access to technical advice", publisher: "National Statistical Office, via PARI", date: "Sep 2021", url: "https://ruralindiaonline.org/en/library/resource/situation-assessment-of-agricultural-households-and-land-and-livestock-holdings-of-households-in-rural-india/" },
    ],
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
