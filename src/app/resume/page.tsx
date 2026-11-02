// The resume as a PDF-style document: A4 pages on a viewer canvas, typeset like the owner's LaTeX
// resume. Server-rendered, so the text is real (searchable, selectable, crawlable); the viewer chrome
// (zoom, page counter, download, print) is a small client component.
import type { Metadata } from "next";
import { Libertinus_Serif } from "next/font/google";
import localFont from "next/font/local";
import RichText from "@/components/RichText";
import ResumeViewer from "@/components/resume/ResumeViewer";
import { resumeDocument as doc, type ResumeEntry } from "@/data/resumeDocument";
import styles from "./Resume.module.css";

// Libertinus Serif: the open continuation of Linux Libertine, the face of the owner's LaTeX template.
// Only this route loads it; static weights, so the printed PDF embeds small subsets.
const serif = Libertinus_Serif({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-resume",
  // No metric-matched Times fallback in the stack, so the arrow font below is what fills in for →
  adjustFontFallback: false,
});

// Google's Latin subset of Libertinus has no →, so it comes from Libertinus Math, as LaTeX's \rightarrow
// does in the template: a 5 KB subset holding only that glyph (OFL)
const arrow = localFont({
  src: "../../components/resume/fonts/libertinus-math-arrow.ttf",
  display: "swap",
  variable: "--font-resume-arrow",
});

export const metadata: Metadata = {
  title: "Resume · Mandar Desurkar",
  description:
    "Resume of Mandar Desurkar, Associate Product Manager: AI-powered 0→1 products, 250K+ installs, tripled trial conversion, Rs. 1 Cr+ monthly sales.",
  alternates: { canonical: "/resume" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

// One role or activity: title and dates on one line, then its groups of bullets. `from` / `to` pick
// groups, so a long entry can continue on the next page the way LaTeX breaks it
function Entry({ entry, from = 0, to, continued }: { entry: ResumeEntry; from?: number; to?: number; continued?: boolean }) {
  return (
    <div className={styles.entry}>
      {!continued && (
        <p className={styles.entryHead}>
          <span>{entry.title}</span>
          <span>{entry.period}</span>
        </p>
      )}
      {entry.groups.slice(from, to).map((g, i) => (
        <div key={g.title ?? i} className={styles.group}>
          {g.title && <p className={styles.groupTitle}>{g.title}</p>}
          <ul>
            {g.bullets.map((b) => (
              <li key={b}>
                <RichText text={b} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function ResumePage() {
  const [silo, altqube] = doc.experience;
  return (
    <ResumeViewer className={`${serif.variable} ${arrow.variable}`} pages={2}>
      {/* Page 1: who, education and the first three Silo Fortune groups; the page breaks where the LaTeX one does */}
      <article className={styles.page} data-page="1" aria-label="Page 1">
        <header className={styles.head}>
          <h1 className={styles.name}>{doc.name}</h1>
          <hr className={styles.rule} />
          <p className={styles.contact}>
            {doc.contact.map((c, i) => (
              <span key={c.label}>
                {i > 0 && <span className={styles.sep} aria-hidden="true">-</span>}
                {c.href ? (
                  <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                    {c.label}
                  </a>
                ) : (
                  c.label
                )}
              </span>
            ))}
          </p>
        </header>

        <p className={styles.summary}>
          <strong className={styles.lead}>Summary —</strong> <RichText text={doc.summary} />
        </p>

        <Section title="Education">
          {doc.education.map((e) => (
            <div key={e.school} className={styles.entry}>
              <p className={styles.entryHead}>
                <span>{e.school}</span>
                <span>{e.period}</span>
              </p>
              <p className={styles.degree}>
                {e.detail.split(" | ").map((part, i) => (
                  <span key={part}>
                    {i > 0 && <span className={styles.bar} aria-hidden="true">|</span>}
                    {part}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </Section>

        <Section title="Experience">
          <Entry entry={silo} to={3} />
        </Section>
      </article>

      {/* Page 2: the last Silo Fortune group, AltQube (still under Experience), Beyond Work and Skills */}
      <article className={styles.page} data-page="2" aria-label="Page 2">
        <Entry entry={silo} from={3} continued />
        <Entry entry={altqube} />

        <Section title="Beyond Work">
          {doc.beyondWork.map((b) => (
            <Entry key={b.title} entry={b} />
          ))}
        </Section>

        <Section title="Skills">
          <div className={styles.skills}>
            {doc.skills.map((s) => (
              <p key={s.label}>
                <strong>{s.label}:</strong> {s.items}
              </p>
            ))}
          </div>
        </Section>
      </article>
    </ResumeViewer>
  );
}
