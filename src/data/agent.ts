// Chai, the desk cat: the actions its replies can offer, shared by the API route (which picks them)
// and the chat panel (which renders them as buttons). Knowledge and answers live server-side in
// src/lib/agent/, so the visitor's bundle carries only this list.

export const CAT_NAME = "Chai";

export const CASE_STUDY_ACTIONS = {
  "case:crop-guide": "Read: Crop Guide",
  "case:farm-monitoring": "Read: Farm Monitoring",
  "case:crop-doctor": "Read: AI Crop Doctor",
  "case:cattle-health": "Read: Cattle Health Check",
  "case:market-value": "Read: Market Value",
  "case:dung-check": "Read: Cow Dung Check",
} as const;

export const AGENT_ACTIONS = {
  open_about: "Open About Me",
  open_experience: "Open Experience",
  open_education: "Open Education",
  open_case_studies: "Open Case Studies",
  open_contact: "Get in touch",
  view_resume: "View resume",
  try_kissan: "Try Kissan Sampurna",
  try_gau: "Try Gau Sampurna",
  ...CASE_STUDY_ACTIONS,
} as const;

export type AgentAction = keyof typeof AGENT_ACTIONS;
export const AGENT_ACTION_IDS = Object.keys(AGENT_ACTIONS) as [AgentAction, ...AgentAction[]];
export const isAgentAction = (v: unknown): v is AgentAction => typeof v === "string" && v in AGENT_ACTIONS;

export type AgentTurn = { role: "user" | "assistant"; content: string };
export type AgentReply = { reply: string; actions: AgentAction[]; mode: "ai" | "offline" };

// Limits the route enforces, mirrored in the panel so the input never sends what would be refused
export const AGENT_LIMITS = { maxChars: 400, maxTurns: 10 } as const;

// The first things a visitor can ask, one tap each
export const STARTER_QUESTIONS = [
  "What has Mandar built?",
  "Show me his best case study",
  "Is he open to new roles?",
  "How do I reach him?",
];
