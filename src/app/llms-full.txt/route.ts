// /llms-full.txt: the resume and all six case studies in one plain-text file, for AI assistants.
import { llmsFullTxt } from "@/lib/siteText";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsFullTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
