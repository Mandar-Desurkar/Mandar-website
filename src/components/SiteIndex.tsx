// A plain index of the whole site in the home page's HTML. Every section of the desktop opens on a
// click, so without this the server-rendered page holds only the About text. Search engines, AI
// crawlers and screen-reader users get the summary, roles, education, skills, every case study (as
// real links), the resume and contact. It's visually hidden and says only what the windows say.
import { caseStudies } from "@/data/caseStudies";
import { experiences, kpis, profile } from "@/data/resume";
import { resumeDocument } from "@/data/resumeDocument";
import { splitTitle } from "@/lib/siteText";
import { principles } from "@/data/notebook";

const plain = (s: string) => s.replace(/\*\*/g, "");

export default function SiteIndex() {
  return (
    <nav className="visually-hidden" aria-label="Site index">
      <h2>
        {profile.name}, {profile.role}
      </h2>
      <p>{profile.summary}</p>
      <p>Key results: {kpis.map((k) => `${k.prefix}${k.value}${k.suffix} ${k.label}`).join(", ")}.</p>

      <h3>Experience</h3>
      <ul>
        {experiences
          .filter((e) => !e.isFuture)
          .map((e) => (
            <li key={`${e.company}-${e.period}`}>
              {e.role}, {e.company} ({e.period}). {e.summary}
            </li>
          ))}
      </ul>

      <h3>Education</h3>
      <ul>
        {resumeDocument.education.map((ed) => (
          <li key={ed.school}>
            {ed.school} ({ed.period}): {ed.detail}
          </li>
        ))}
      </ul>

      <h3>Skills</h3>
      <ul>
        {resumeDocument.skills.map((s) => (
          <li key={s.label}>
            {s.label}: {s.items}
          </li>
        ))}
      </ul>

      <h3>Product principles</h3>
      <ol>
        {principles.map((p) => (
          <li key={p.title}>
            {p.title} {p.body}
          </li>
        ))}
      </ol>

      <h3>Case studies</h3>
      <ul>
        {caseStudies.map((cs) => {
          const { name, line } = splitTitle(cs.title);
          return (
            <li key={cs.slug}>
              <a href={`/case-studies/${cs.slug}`}>{name}</a>: {line}. {plain(cs.card.metric)}.
            </li>
          );
        })}
      </ul>

      <h3>Resume and contact</h3>
      <ul>
        <li>
          <a href={profile.resumeUrl}>Resume</a>
        </li>
        <li>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </li>
        <li>
          <a href={profile.linkedin}>LinkedIn</a>
        </li>
        <li>
          <a href="/llms.txt">Site summary for AI assistants (llms.txt)</a>
        </li>
      </ul>
    </nav>
  );
}
