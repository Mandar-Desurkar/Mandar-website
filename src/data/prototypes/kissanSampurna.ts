// Interactive prototype content for Kissan Sampurna (opened from Experience / Projects).
// Screens are recreated from the app's real code, assets and English copy (kissansampurna-app):
//   - AI Crop Doctor: `prod` branch (the live design; identical to dev for these screens)
//   - Crop Guide and Farm Monitoring: `dev` branch
// Screen ids must be unique across flows. PM notes explain the product reasoning; edit freely.

export type PrototypeScreen = { id: string; title: string; note: string };
export type PrototypeFlow = { id: string; title: string; summary: string; screens: PrototypeScreen[] };
export type Prototype = {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  flows: PrototypeFlow[];
};

export const kissanSampurnaPrototype: Prototype = {
  id: "kissan-sampurna",
  name: "Kissan Sampurna",
  tagline: "AI farming app for Indian farmers",
  logo: "/prototypes/kissan-sampurna/logo.webp",
  flows: [
    {
      id: "crop-doctor",
      title: "AI Crop Doctor",
      summary: "One photo → diagnosis → treatment plan",
      screens: [
        {
          id: "crop-doctor",
          title: "Crop Doctor",
          note:
            "Set expectations before the camera opens. Three pictorial steps (photo → report → action) explain the feature without much reading, which matters for first-time smartphone users. Free users who've used up their scans are routed to the subscription screen from this CTA.",
        },
        {
          id: "select-crop",
          title: "Select crop",
          note:
            "Crop first, photo second, so the diagnosis has context. Popular crops sit on top for one-tap selection, and \"Can't find your crop?\" turns missing coverage into a demand signal through crop requests.",
        },
        {
          id: "scan-method",
          title: "Scan method",
          note:
            "Coach the photo, not just the model. \"Clear photo, better diagnosis\" plus a do/don't guide tackles blurry and far-away shots before they reach the AI.",
        },
        {
          id: "analyzing",
          title: "Analyzing",
          note:
            "Make the wait feel like work. A visible scanning state while the model runs reassures farmers the photo is being analysed, not stuck.",
        },
        {
          id: "report",
          title: "Diagnosis report",
          note:
            "Lead with urgency and money, not Latin names. Severity, an action banner and revenue loss per acre (₹) come before the science. Then a day-by-day treatment plan turns a diagnosis into something a farmer can act on today.",
        },
      ],
    },
    {
      id: "crop-guide",
      title: "Crop Guide",
      summary: "A few questions → top crops for this farm",
      screens: [
        {
          id: "cg-season",
          title: "Planting season",
          note:
            "One question per screen, answered with pictures. Big image cards make a recommendation engine usable for low-literacy farmers, and the questions come from the server, so the questionnaire can change without an app release.",
        },
        {
          id: "cg-irrigation",
          title: "Water source",
          note:
            "Multi-select, because most farms mix water sources (rain plus borewell or canal). Water access is one of the strongest filters on which crops can actually work.",
        },
        {
          id: "cg-budget",
          title: "Budget per acre",
          note:
            "Ask for money in bands, not exact figures. Farmers answer ranges easily, and each band maps to a level of seed, fertilizer, labour and protection spend.",
        },
        {
          id: "cg-report",
          title: "Recommendation",
          note:
            "Explain the pick, don't just rank it. A % match, a pass/fail fit check and a comparison with alternatives make a top-5 out of 100+ crops (ranked across 655K+ farm profiles) feel trustworthy. \"Go to my farm\" hands off into Farm Monitoring for the season. Sample values for this demo.",
        },
      ],
    },
    {
      id: "farm-monitoring",
      title: "Farm Monitoring",
      summary: "Map the field → satellite health → what to do",
      screens: [
        {
          id: "fm-mark",
          title: "Mark your farm",
          note:
            "Two ways to map a field: draw it on the map, or walk the boundary dropping pins, for farmers who can't read a satellite view. \"Save for later\" keeps setup from blocking first use.",
        },
        {
          id: "fm-map",
          title: "Draw boundary",
          note:
            "A precise boundary means the satellite readings belong to this farm alone. A live acreage estimate gives instant feedback while drawing, and Undo / Clear all make mistakes cheap.",
        },
        {
          id: "fm-complete",
          title: "Setup complete",
          note:
            "A clear \"your farm is now monitored\" moment, with the next action (See the Insights) front and centre, and adding another farm one tap away.",
        },
        {
          id: "fm-report",
          title: "Satellite report",
          note:
            "From data to action. Satellite vegetation indices become red and yellow zones, then \"Do This\" cards (which can be read aloud) tell the farmer exactly what to do, with \"Mark as done\" to close the loop. Confirming the crop stage keeps the advice accurate. Sample values for this demo.",
        },
      ],
    },
  ],
};
