// This visit's journey through the site, for the Notebook's "Your visit, measured" funnel. Fed by
// trackEvent (lib/analytics), kept in sessionStorage so it survives opening a case study page and coming
// back, and gone when the tab closes. Nothing leaves the browser.
import { useSyncExternalStore } from "react";

export const JOURNEY_STEPS = [
  { id: "landed", label: "Landed on the site" },
  { id: "explored", label: "Opened a window" },
  { id: "case", label: "Read a case study" },
  { id: "prototype", label: "Tried a prototype" },
  { id: "contact", label: "Got in touch" },
] as const;
export type JourneyStep = (typeof JOURNEY_STEPS)[number]["id"];

const KEY = "md-journey";
const EMPTY: JourneyStep[] = ["landed"];
let steps: JourneyStep[] | null = null;
const listeners = new Set<() => void>();

const load = (): JourneyStep[] => {
  if (steps) return steps;
  try {
    const raw = sessionStorage.getItem(KEY);
    steps = raw ? (JSON.parse(raw) as JourneyStep[]) : [...EMPTY];
  } catch {
    steps = [...EMPTY];
  }
  return steps;
};

function mark(step: JourneyStep) {
  const cur = load();
  if (cur.includes(step)) return;
  steps = [...cur, step];
  try {
    sessionStorage.setItem(KEY, JSON.stringify(steps));
  } catch {
    /* private mode: keep it in memory */
  }
  listeners.forEach((l) => l());
}

// Map tracked events to journey steps
export function recordJourney(event: string, props: Record<string, unknown>) {
  if (event === "Opened Section" && props.section !== "about") mark("explored");
  if (event === "Opened Case Study" || event === "Viewed Case Study") mark("case");
  if (event === "Opened Prototype") mark("prototype");
  if (event === "Clicked Contact Method" || event === "Downloaded vCard") mark("contact");
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export const useJourney = () => useSyncExternalStore(subscribe, load, () => EMPTY);
