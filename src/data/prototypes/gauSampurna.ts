// Interactive prototype content for Gau Sampurna (dairy farming app), opened from the hero's
// "Apps I've built" card. Screens are recreated from the `prod` branch of
// silo-prod/gausampurna-react-app (code/screens/gau-swastha-tenant/scan/*): real colours, Lato,
// English copy and artwork. Report values are illustrative sample values; PM notes are editable.
import type { Prototype } from "./kissanSampurna";

export const gauSampurnaPrototype: Prototype = {
  id: "gau-sampurna",
  name: "Gau Sampurna",
  tagline: "AI dairy farming app",
  logo: "/prototypes/gau-sampurna/logo.png",
  flows: [
    {
      id: "disease-check",
      title: "AI Disease Check",
      summary: "One side photo → 31-disease screening",
      screens: [
        {
          id: "gs-hub",
          title: "Scan hub",
          note:
            "Triage first. The urgent \"Cow unwell or off-feed?\" path sits on top in a dark card, with routine checks below. The cow is selected up front, so every AI report is tied to an animal in the farmer's herd.",
        },
        {
          id: "gs-capture",
          title: "Photo guide",
          note:
            "Coach the photo before the model sees it. One side-profile photo powers disease screening and body analysis, so simple tips (full profile, level angle, daylight) protect accuracy for everything downstream.",
        },
        {
          id: "gs-analyzing",
          title: "Analyzing",
          note:
            "Show the pipeline. Visible steps make a few seconds of AI inference feel trustworthy rather than stuck.",
        },
        {
          id: "gs-ready",
          title: "Report ready",
          note:
            "A one-glance verdict (\"1 of 31 conditions detected\") before any detail, then one clear next step: View Full Report.",
        },
        {
          id: "gs-diagnosis",
          title: "Diagnosis",
          note:
            "Turn AI output into a safe next step. Every indicator is CLEAR or NEEDS VET, followed by early warning signs and a free vet helpline one tap away. The current build screens 31 diseases from one photo. Sample values for this demo.",
        },
      ],
    },
    {
      id: "animal-status",
      title: "Animal Status & Value",
      summary: "One side photo → body score + market price",
      screens: [
        {
          id: "gs-hub-status",
          title: "Scan hub",
          note:
            "Routine scans are framed by outcome (\"Weight & Health Score\", \"Final Price Estimate\") rather than by technology, with clear Recommended / Instant labels.",
        },
        {
          id: "gs-capture-status",
          title: "Body photo guide",
          note:
            "Body analysis needs the udder visible and the whole animal in frame, so the tips change per scan type instead of using one generic guide.",
        },
        {
          id: "gs-analyzing-status",
          title: "Analyzing",
          note: "The same pipeline UI for every scan keeps the experience predictable as new AI checks are added.",
        },
        {
          id: "gs-status-report",
          title: "Status & valuation",
          note:
            "From a photo to a price. Breed purity, body condition score, milk capacity and an estimated market value with a buying recommendation help farmers buy and sell cattle fairly. A feeding plan closes the loop. Sample values for this demo.",
        },
      ],
    },
  ],
};
