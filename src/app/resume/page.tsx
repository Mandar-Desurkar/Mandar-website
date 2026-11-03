// The resume as a PDF-style document: US Letter pages on a viewer canvas, typeset like the owner's LaTeX
// resume. Server-rendered, so the text is real (searchable, selectable, crawlable); the viewer chrome
// (zoom, page counter, download, print) is a small client component.
import type { Metadata } from "next";
import { Charis_SIL } from "next/font/google";
import localFont from "next/font/local";
import { Fragment } from "react";
import ResumeViewer from "@/components/resume/ResumeViewer";
import { resumeDocument as doc, type ResumeEntry } from "@/data/resumeDocument";
import styles from "./Resume.module.css";

// Charis SIL: SIL's extension of Bitstream Charter, the face of the owner's LaTeX resume (XCharter).
// Only this route loads it; static weights, so the printed PDF embeds small subsets.
const serif = Charis_SIL({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-resume",
  adjustFontFallback: false,
});

// Google's Latin subset of Charis has no → or ∼ (LaTeX's \rightarrow and \sim, from its math font), so a
// 6 KB subset of Charis supplies them, ∼ respaced to \sim's width, renamed as its licence (OFL) asks.
// unicode-range keeps it to those two characters, so it can sit first in the stack.
const symbols = localFont({
  src: [
    { path: "../../components/resume/fonts/resume-symbols-regular.ttf", weight: "400" },
    { path: "../../components/resume/fonts/resume-symbols-bold.ttf", weight: "700" },
  ],
  display: "swap",
  variable: "--font-resume-symbols",
  declarations: [{ prop: "unicode-range", value: "U+2192, U+223C" }],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Resume · Mandar Desurkar",
  description:
    "Resume of Mandar Desurkar, Associate Product Manager: AI-powered 0→1 products, 250K+ installs, tripled trial conversion, Rs. 1 Cr+ monthly sales.",
  alternates: { canonical: "/resume" },
};

// Charis draws + a full em wide, Charter 0.83em; a negative margin narrows it while the PDF keeps the real
// character in the same font run, so text extraction (ATS) still reads "250K+"
function plusSigns(text: string) {
  return text.split(/(\+)/g).map((t, k) =>
    t === "+" ? (
      <span key={k} className={styles.plus}>
        +
      </span>
    ) : (
      t
    ),
  );
}

// Bold runs as in RichText, and words joined by a hyphen never split across lines: the LaTeX sets
// \exhyphenpenalty=10000 so ATS parsers don't read "cross-functional" as two words
function ResumeText({ text }: { text: string }) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => {
    const words = part.split(/(\S+-\S+)/g).map((w, j) =>
      j % 2 === 1 ? (
        <span key={j} className={styles.nobreak}>
          {plusSigns(w)}
        </span>
      ) : (
        plusSigns(w)
      ),
    );
    return i % 2 === 1 ? <strong key={i}>{words}</strong> : <Fragment key={i}>{words}</Fragment>;
  });
}

function Section({ title, afterText, children }: { title: string; afterText?: boolean; children: React.ReactNode }) {
  // afterText: the heading follows running text rather than a kept block, which LaTeX spaces 2pt wider
  return (
    <section className={`${styles.section} ${afterText ? styles.afterText : ""}`}>
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
                <ResumeText text={b} />
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
    <ResumeViewer className={`${serif.variable} ${symbols.variable}`} pages={2}>
      {/* Page 1: header, summary and the first three Silo Fortune groups; LaTeX keeps each group whole, so the
          Rider App group doesn't fit and opens page 2 */}
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
                    {plusSigns(c.label)}
                  </a>
                ) : (
                  c.label
                )}
              </span>
            ))}
          </p>
          <hr className={`${styles.rule} ${styles.ruleBelow}`} />
        </header>

        <Section title="Summary">
          <p className={styles.summary}>
            <ResumeText text={doc.summary} />
          </p>
        </Section>

        <Section title="Experience" afterText>
          <Entry entry={silo} to={3} />
        </Section>
      </article>

      {/* Page 2: the rest of Silo Fortune, AltQube (still under Experience), Beyond Work, Education, Skills */}
      <article className={styles.page} data-page="2" aria-label="Page 2">
        <Entry entry={silo} from={3} continued />
        <Entry entry={altqube} />

        <Section title="Beyond Work">
          {doc.beyondWork.map((b) => (
            <Entry key={b.title} entry={b} />
          ))}
        </Section>

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

        <Section title="Skills" afterText>
          <div className={styles.skills}>
            {doc.skills.map((s) => (
              <p key={s.label}>
                <strong>{s.label}:</strong> <ResumeText text={s.items} />
              </p>
            ))}
          </div>
        </Section>
      </article>
    </ResumeViewer>
  );
}
