// The Notebook window (macOS Notes): how I think, and what I learned in the field. Everything here comes
// from the case studies (their principles, decisions and learnings), written in first person for the
// owner to edit.
// - principles: portfolio-level beliefs, each linked to the case study decision that proves it
// - fieldNotes: one research finding per study and what it changed in the product
// - differently: one "what I'd do differently" per study (the case studies' own learnings)
// - now: the "Now" sticky on the desktop and the Now note
import { caseStudies } from "./caseStudies";

export type NoteId = "principles" | "case-studies" | "now" | "field";

export type Proof = { slug: string; decision: string };
export const principles: { title: string; body: string; proof: Proof[] }[] = [
  {
    title: "Fit beats best.",
    body: "I recommend for this field, this season and this budget. A generic “best” answer is somebody else’s answer.",
    proof: [{ slug: "crop-guide", decision: "Filter first, then score" }],
  },
  {
    title: "Never make the user interpret a number.",
    body: "If a farmer has to decode it, I haven’t finished designing it: three colours instead of an index, a price range instead of a promise.",
    proof: [
      { slug: "farm-monitoring", decision: "Three colours instead of index values" },
      { slug: "market-value", decision: "A range, never a single price" },
    ],
  },
  {
    title: "Every screen ends in one thing to do.",
    body: "Advice that doesn’t end in an action gets read and forgotten, so each report closes with what to do this week and when to check again.",
    proof: [
      { slug: "farm-monitoring", decision: "Advice per zone, not one score per field" },
      { slug: "crop-doctor", decision: "Stage and money, not just a disease name" },
    ],
  },
  {
    title: "Trust is the product.",
    body: "A confident wrong answer costs more than no answer. We check the photo before diagnosing, say “suspected” when we aren’t sure, and show how we know.",
    proof: [
      { slug: "cattle-health", decision: "Suspected is not detected" },
      { slug: "crop-doctor", decision: "Check the photo before diagnosing it" },
    ],
  },
  {
    title: "A paywall should never feel like a trick.",
    body: "Show value first, charge at a moment that feels fair, and never put safety behind a plan.",
    proof: [
      { slug: "cattle-health", decision: "Charge when the scan starts, not on the report" },
      { slug: "crop-doctor", decision: "Diagnosis on the paid plan, advisory free" },
    ],
  },
  {
    title: "Ask only what the user knows.",
    body: "Every extra question loses someone. Infer what you can, and let people start before they’ve set everything up.",
    proof: [
      { slug: "crop-guide", decision: "Dropped the risk, fodder and labour questions in v3" },
      { slug: "dung-check", decision: "Allow a dung scan without a cow" },
    ],
  },
  {
    title: "Build it so the experts can fix it without me.",
    body: "The first rules will be wrong somewhere. The agronomy team edits the engine and the questions themselves, without code or a release.",
    proof: [{ slug: "crop-guide", decision: "A no-code engine and server-driven questions" }],
  },
];

export const fieldNotes: { slug: string; finding: string; change: string }[] = [
  {
    slug: "crop-guide",
    finding: "A clearer soil card raised farmers’ comprehension from 0.5% to 33%. Format decides whether advice gets used.",
    change: "Pictures over text, money in bands, dates as “last week”, and a plain “why” behind every pick.",
  },
  {
    slug: "farm-monitoring",
    finding: "Many farmers know their land by walking it, not from a satellite view.",
    change: "Two ways to map a field: draw it on the map, or walk the boundary dropping pins.",
  },
  {
    slug: "crop-doctor",
    finding: "A disease moves: what works on day 1 is the wrong treatment by day 8.",
    change: "Diagnose the stage, not just the disease, and end every plan with “Rescan and decide” on day 7.",
  },
  {
    slug: "cattle-health",
    finding: "Farmers trust the local vet more than any app.",
    change: "Serious findings go to a vet, with the exact signs that mean “call now”. The vet line is never behind a paywall.",
  },
  {
    slug: "market-value",
    finding: "A number on its own starts an argument at the cattle market.",
    change: "Show the facts behind the price (breed purity, milk capacity, lactation) so the farmer can defend it.",
  },
  {
    slug: "dung-check",
    finding: "Most dung problems are fixed by changing the feed, and farmers distrust being sold to.",
    change: "Feed fix first, product second: one matched product, and only where we can deliver.",
  },
];

// One learning per study, by index into that study's `learnings`
const DIFFERENTLY: [string, number][] = [
  ["crop-guide", 1],
  ["farm-monitoring", 0],
  ["crop-doctor", 1],
  ["cattle-health", 0],
  ["market-value", 0],
  ["dung-check", 0],
  ["telecaller-qa", 0],
];
export const differently = DIFFERENTLY.flatMap(([slug, i]) => {
  const cs = caseStudies.find((c) => c.slug === slug);
  const text = cs?.learnings[i];
  return cs && text ? [{ slug, name: cs.title.split(":")[0], text }] : [];
});

// The "Now" sticky on the desktop and the Now note. Owner: update monthly.
export const now = {
  updated: "November 2026",
  items: [
    { label: "Building", text: "Kissan Sampurna and Gau Sampurna at Silo Fortune: AI features for farmers, and the CRM and delivery tools behind the sales." },
    { label: "Recently shipped", text: "Cattle Health Check: one side photo screens a cow for 31 conditions." },
    { label: "Looking for", text: "APM or Product Manager roles in AI, consumer tech, growth or D2C." },
  ],
};
