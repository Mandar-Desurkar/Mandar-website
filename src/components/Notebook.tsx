"use client";

// The Notebook window, in the style of macOS Notes: a list of notes on the left, the open note on the
// right (on phones the list becomes a row of tabs). Three notes: Product Principles (pinned), Case
// Studies and Now.
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowUpRight, Pin } from "lucide-react";
import styles from "./Notebook.module.css";
import { caseStudies } from "@/data/caseStudies";
import { now, principles, type NoteId } from "@/data/notebook";
import { NOTE_EVENT, takeRequestedNote } from "@/lib/notebookNav";
import { trackEvent } from "@/lib/analytics";

// Spelled-out count for the copy ("Seven case studies")
const COUNT_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];
const countWord = (n: number) => COUNT_WORDS[n] ?? String(n);

const NOTES: {
  id: NoteId;
  title: string;
  snippet: string;
  pinned?: boolean;
}[] = [
  {
    id: "principles",
    title: "Product Principles",
    snippet: "Seven beliefs, each with the decision that proves it",
    pinned: true,
  },
  {
    id: "case-studies",
    title: "Case Studies",
    snippet: `${countWord(caseStudies.length)} features, from problem to outcome`,
  },
  { id: "now", title: "Now", snippet: now.items[0].text },
];

const study = (slug: string) => caseStudies.find((c) => c.slug === slug);
const studyName = (slug: string) => study(slug)?.title.split(":")[0] ?? slug;

function ProofLink({ slug, children }: { slug: string; children: ReactNode }) {
  return (
    <Link
      href={`/case-studies/${slug}`}
      className={styles.proof}
      onClick={() =>
        trackEvent("Opened Case Study", { slug, placement: "notebook" })
      }
    >
      {children}
      <ArrowUpRight size={12} aria-hidden="true" />
    </Link>
  );
}

function Principles() {
  return (
    <>
      <p className={styles.lede}>
        What I believe about building products, learned building them for
        farmers. Each one links to a decision where it cost something.
      </p>
      <ol className={styles.principles}>
        {principles.map((p, i) => (
          <li key={p.title}>
            <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
              <div className={styles.proofs}>
                {p.proof.map((pr) => (
                  <ProofLink key={pr.decision} slug={pr.slug}>
                    <span className={styles.proofStudy}>
                      {studyName(pr.slug)}
                    </span>{" "}
                    {pr.decision}
                  </ProofLink>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

// "Peak MAU" → "peak MAU", "Of 100+ crops" → "of 100+ crops": lower-case words, keep acronyms
const inSentence = (label: string) => label.replace(/\b([A-Z])([a-z])/g, (_, a: string, b: string) => a.toLowerCase() + b);

// The case studies as an index: one row each with its cover as a small tile, the feature, the kind of
// problem, its promise and its headline numbers
function CaseStudiesNote() {
  return (
    <>
      <p className={styles.lede}>
        {countWord(caseStudies.length)} features I took from a user problem to a measured outcome. Each study
        shows the decisions behind it, and what they cost.
      </p>
      <ol className={styles.caseList}>
        {caseStudies.map((cs, i) => {
          const [name, line = ""] = cs.title.split(": ");
          return (
            <li key={cs.slug}>
              <Link
                href={`/case-studies/${cs.slug}`}
                className={styles.caseRow}
                onClick={() => trackEvent("Opened Case Study", { slug: cs.slug, placement: "notebook" })}
              >
                <span className={styles.caseThumb}>
                  <Image src={cs.thumbDesk || cs.thumb} alt="" width={240} height={161} sizes="(max-width: 767px) 96px, 132px" />
                  <span className={styles.caseIndex}>{String(i + 1).padStart(2, "0")}</span>
                </span>
                <span className={styles.caseMain}>
                  <span className={styles.caseHead}>
                    <span className={styles.caseTitle}>{name}</span>
                    <span className={styles.caseTheme}>{cs.card.theme}</span>
                  </span>
                  {line && <span className={styles.caseLine}>{line.charAt(0).toUpperCase() + line.slice(1)}</span>}
                  <span className={styles.caseStats}>
                    {cs.card.stats
                      // A number the line already states isn't repeated ("One side photo, 31 conditions screened")
                      .filter((s) => !line.toLowerCase().includes(s.label.toLowerCase()))
                      .map((s) => (
                        <span key={s.label} className={styles.caseStat}>
                          <strong>{s.value}</strong> {inSentence(s.label)}
                        </span>
                      ))}
                  </span>
                </span>
                <ArrowUpRight size={16} className={styles.caseGo} aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}

function Now() {
  return (
    <>
      <p className={styles.lede}>
        What I’m doing right now. Updated {now.updated}.
      </p>
      <dl className={styles.now}>
        {now.items.map((it) => (
          <div key={it.label}>
            <dt>{it.label}</dt>
            <dd>{it.text}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

export default function Notebook({ initialNote }: { initialNote?: NoteId }) {
  const [note, setNote] = useState<NoteId>(
    () => takeRequestedNote() ?? initialNote ?? "principles",
  );

  useEffect(() => {
    const req = takeRequestedNote();
    if (req) {
      setNote(req);
    } else if (initialNote) {
      setNote(initialNote);
    }
  }, [initialNote]);

  // The desktop sticky can ask for a note while the window is already open
  useEffect(() => {
    const onNote = (e: Event) => {
      const id = (e as CustomEvent<NoteId>).detail;
      if (id) setNote(id);
      takeRequestedNote();
    };
    window.addEventListener(NOTE_EVENT, onNote);
    return () => window.removeEventListener(NOTE_EVENT, onNote);
  }, []);

  const pick = (id: NoteId) => {
    if (id === note) return;
    setNote(id);
    trackEvent("Opened Note", { note: id, source: "sidebar" });
  };
  const current = NOTES.find((n) => n.id === note) ?? NOTES[1];

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar} aria-label="Notes">
        <div className={styles.sideInner}>
          <span className={styles.folder}>Notebook</span>
          <ul className={styles.list}>
            {NOTES.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  className={`${styles.item} ${n.id === note || (note === "field" && n.id === "case-studies") ? styles.itemOn : ""}`}
                  aria-current={n.id === note || (note === "field" && n.id === "case-studies") ? "page" : undefined}
                  onClick={() => pick(n.id)}
                >
                  <span className={styles.itemTitle}>
                    {n.pinned && (
                      <Pin
                        size={11}
                        className={styles.pin}
                        aria-hidden="true"
                      />
                    )}
                    {n.title}
                  </span>
                  <span className={styles.itemSnippet}>{n.snippet}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <article className={styles.note} key={note}>
        <p className={styles.date}>Mandar Desurkar · {now.updated}</p>
        <h2 className={styles.title}>{current.title}</h2>
        {note === "principles" && <Principles />}
        {(note === "case-studies" || note === "field") && <CaseStudiesNote />}
        {note === "now" && <Now />}
      </article>
    </div>
  );
}
