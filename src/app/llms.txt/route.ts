// /llms.txt: a short plain-text guide to the site for AI assistants (llmstxt.org). Built at build time.
import { llmsTxt } from "@/lib/siteText";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
