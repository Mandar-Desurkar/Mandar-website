"use client";

// The Notebook window, in the style of macOS Notes: a list of notes on the left, the open note on the
// right (on phones the list becomes a row of tabs). Three notes: Product Principles (pinned), Field
// Notes and Now.
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Pin } from "lucide-react";
import styles from "./Notebook.module.css";
import RichText from "./RichText";
import { caseStudies } from "@/data/caseStudies";
import { differently, fieldNotes, now, principles, type NoteId } from "@/data/notebook";
import { NOTE_EVENT, takeRequestedNote } from "@/lib/notebookNav";
import { trackEvent } from "@/lib/analytics";

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
    id: "field",
    title: "Field Notes",
    snippet: "What farmers taught me, and what it changed",
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

function FieldNotes() {
  return (
    <>
      <p className={styles.lede}>
        Six things farmers and field research taught me, and what each one
        changed in the product.
      </p>
      <div className={styles.field}>
        {fieldNotes.map((f) => {
          const cs = study(f.slug);
          return (
            <Link
              key={f.slug}
              href={`/case-studies/${f.slug}`}
              className={styles.fieldCard}
              onClick={() =>
                trackEvent("Opened Case Study", {
                  slug: f.slug,
                  placement: "notebook",
                })
              }
            >
              {cs && (
                <span className={styles.fieldArt}>
                  <Image
                    src={cs.thumb}
                    alt=""
                    width={240}
                    height={134}
                    sizes="120px"
                  />
                </span>
              )}
              <span className={styles.fieldText}>
                <span className={styles.fieldTag}>{studyName(f.slug)}</span>
                <span className={styles.found}>{f.finding}</span>
                <span className={styles.changed}>
                  <ArrowRight size={13} aria-hidden="true" /> {f.change}
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      <h3 className={styles.subhead}>What I’d do differently</h3>
      <ul className={styles.differently}>
        {differently.map((d) => (
          <li key={d.slug}>
            <span className={styles.fieldTag}>{d.name}</span>
            <p>
              <RichText text={d.text} />
            </p>
          </li>
        ))}
      </ul>
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

export default function Notebook() {
  const [note, setNote] = useState<NoteId>(
    () => takeRequestedNote() ?? "principles",
  );

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
  const current = NOTES.find((n) => n.id === note)!;

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
                  className={`${styles.item} ${n.id === note ? styles.itemOn : ""}`}
                  aria-current={n.id === note ? "page" : undefined}
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
        {note === "field" && <FieldNotes />}
        {note === "now" && <Now />}
      </article>
    </div>
  );
}
