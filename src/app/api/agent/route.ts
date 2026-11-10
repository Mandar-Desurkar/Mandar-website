// POST /api/agent: Chai the desk cat answers a visitor's question about the portfolio.
// With ANTHROPIC_API_KEY set (Vercel project env), Claude answers from the facts in
// src/lib/agent/knowledge.ts and picks up to two site actions through a structured output. Without
// a key, or if the call fails, the same facts answer through keyword intents, so the cat never
// goes silent. Inputs are length-capped and rate-limited per visitor; no data is stored.
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { AGENT_ACTION_IDS, AGENT_LIMITS, isAgentAction, type AgentReply, type AgentTurn } from "@/data/agent";
import { SYSTEM_PROMPT, offlineAnswer } from "@/lib/agent/knowledge";

const ReplySchema = z.object({
  reply: z.string(),
  actions: z.array(z.enum(AGENT_ACTION_IDS)).max(2),
});

// A small per-instance limiter: enough to stop a script from running up the bill. Serverless
// instances don't share it, so it bounds cost per instance, not globally.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_REQUESTS;
}

function readTurns(body: unknown): AgentTurn[] | null {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const turns = raw.slice(-AGENT_LIMITS.maxTurns).map((m) => ({
    role: (m as AgentTurn)?.role,
    content: String((m as AgentTurn)?.content ?? "").slice(0, AGENT_LIMITS.maxChars).trim(),
  }));
  if (turns.some((t) => (t.role !== "user" && t.role !== "assistant") || !t.content)) return null;
  // The conversation must start with the visitor and end with their question
  while (turns.length && turns[0].role !== "user") turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== "user") return null;
  return turns as AgentTurn[];
}

let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic());

async function askClaude(turns: AgentTurn[]): Promise<Omit<AgentReply, "mode"> | null> {
  const response = await getClient().beta.messages.parse({
    model: "claude-opus-5-5",
    max_tokens: 2000,
    // A short chat answer: low effort keeps it quick and cheap
    output_config: { effort: "low", format: betaZodOutputFormat(ReplySchema) },
    // On a policy decline the API retries on a suitable model inside the same call
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    messages: turns,
  });
  if (response.stop_reason === "refusal" || response.stop_reason === "max_tokens") return null;
  const parsed = response.parsed_output;
  if (!parsed?.reply) return null;
  return { reply: parsed.reply.trim(), actions: parsed.actions.filter(isAgentAction).slice(0, 2) };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  const turns = readTurns(body);
  if (!turns) return Response.json({ error: "bad_request" }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const question = turns[turns.length - 1].content;

  if (rateLimited(ip)) {
    const reply: AgentReply = {
      reply: "Mrrp, that's a lot of questions! I need a short nap. The buttons below still work.",
      actions: ["open_case_studies", "open_contact"],
      mode: "offline",
    };
    return Response.json(reply, { status: 429 });
  }

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const answer = await askClaude(turns);
      if (answer) return Response.json({ ...answer, mode: "ai" } satisfies AgentReply);
    } catch (error) {
      if (error instanceof Anthropic.RateLimitError) console.warn("[agent] rate limited by the API");
      else if (error instanceof Anthropic.AuthenticationError) console.error("[agent] invalid ANTHROPIC_API_KEY");
      else if (error instanceof Anthropic.APIError) console.error(`[agent] API error ${error.status}: ${error.message}`);
      else console.error("[agent] unexpected error", error);
    }
  }

  return Response.json({ ...offlineAnswer(question), mode: "offline" } satisfies AgentReply);
}
