// Plain-text versions of the site for search engines and AI assistants, built from the same data the
// pages use, so they never drift from what visitors see:
// - /llms.txt: the short guide in the llms.txt format (llmstxt.org): who, what, and links to each page
// - /llms-full.txt: everything in one file: the resume, the six case studies' stories and numbers
import { caseStudies } from "@/data/caseStudies";
import { kpis, profile, shippedApps, toolApps } from "@/data/resume";
import { resumeDocument } from "@/data/resumeDocument";
import { SITE_URL } from "@/data/site";
import { principles } from "@/data/notebook";

const url = (path: string) => `${SITE_URL}${path}`;
// "Crop Guide: the right crop..." → ["Crop Guide", "The right crop..."]
export const splitTitle = (title: string) => {
  const [name, line = ""] = title.split(": ");
  return { name, line: line && line.charAt(0).toUpperCase() + line.slice(1) };
};
const kpiLine = () => kpis.map((k) => `${k.prefix}${k.value}${k.suffix} ${k.label}`).join(" · ");
const prototypeUrl = (id: string) => url(`/?prototype=${id}`);

export function llmsTxt(): string {
  const apps = [...shippedApps, ...toolApps].filter((a) => a.prototype);
  return [
    `# ${profile.name}`,
    "",
    `> ${profile.summary}`,
    "",
    `Based in ${profile.location}. Key results: ${kpiLine()}. Status: ${profile.availability}.`,
    "",
    "This site is an interactive portfolio styled as a macOS desktop (an iPhone home screen on phones). The pages below hold the same content as plain HTML.",
    "",
    "## Resume",
    "",
    `- [Resume](${url("/resume")}): Full resume: experience, results, education and skills`,
    `- [Everything in one file](${url("/llms-full.txt")}): The resume and all six case studies as plain text`,
    "",
    "## Case studies",
    "",
    ...caseStudies.map((cs) => {
      const { name, line } = splitTitle(cs.title);
      return `- [${name}](${url(`/case-studies/${cs.slug}`)}): ${line} (${cs.product}, ${cs.card.theme}). ${cs.card.metric}.`;
    }),
    "",
    "## Interactive prototypes",
    "",
    ...apps.map((a) => `- [${a.name}](${prototypeUrl(a.prototype!)}): ${a.caption}, a clickable prototype recreated from the product's code`),
    "",
    "## Contact",
    "",
    `- Email: ${profile.email}`,
    `- [LinkedIn](${profile.linkedin})`,
    "",
  ].join("\n");
}

export function llmsFullTxt(): string {
  const r = resumeDocument;
  const out: string[] = [
    `# ${r.name}`,
    "",
    `${r.tagline.join(" | ")} · ${profile.location}`,
    "",
    `Email: ${profile.email} · LinkedIn: ${profile.linkedin} · Portfolio: ${SITE_URL}`,
    "",
    "## Summary",
    "",
    r.summary,
    "",
    `Key results: ${kpiLine()}.`,
    "",
    "## Experience",
    "",
  ];
  for (const e of r.experience) {
    out.push(`### ${e.title} (${e.period})`, "");
    if (e.sub) out.push(e.sub, "");
    for (const g of e.groups) {
      if (g.title) out.push(`#### ${g.title}`, "");
      out.push(...g.bullets.map((b) => `- ${b}`), "");
    }
  }
  out.push("## Beyond work", "");
  for (const e of r.beyondWork) {
    out.push(`### ${e.title} (${e.period})`, "");
    for (const g of e.groups) out.push(...g.bullets.map((b) => `- ${b}`), "");
  }
  out.push("## Education", "");
  for (const ed of r.education) out.push(`- ${ed.school} (${ed.period}): ${ed.detail}`);
  out.push("", "## Skills", "");
  for (const s of r.skills) out.push(`- ${s.label}: ${s.items}`);
  out.push("", "## Product principles", "");
  principles.forEach((p, i) =>
    out.push(`${i + 1}. **${p.title}** ${p.body} (Proof: ${p.proof.map((pr) => `${splitTitle(caseStudies.find((c) => c.slug === pr.slug)?.title ?? pr.slug).name}, "${pr.decision}"`).join("; ")}.)`),
  );
  out.push("", "## Case studies", "");
  for (const cs of caseStudies) {
    const { name, line } = splitTitle(cs.title);
    out.push(`### ${name}: ${line}`, "");
    out.push(`${cs.product} · ${cs.card.theme} · ${url(`/case-studies/${cs.slug}`)}`, "");
    out.push(cs.subtitle, "");
    for (const g of cs.glance) out.push(`- ${g.label}: ${g.takeaway} ${g.text}`);
    out.push("", `Numbers: ${cs.card.stats.map((s) => `${s.value} ${s.label}`).join(" · ")}.`, "");
  }
  return out.join("\n");
}
