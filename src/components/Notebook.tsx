"use client";

// The Notebook window, in the style of macOS Notes: a list of notes on the left, the open note on the
// right (on phones the list becomes a row of tabs). Four notes: Product Principles (pinned), Field
// Notes, This Site Is a Product (live visit funnel, release notes, roadmap) and Now.
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Check, Pin } from "lucide-react";
import styles from "./Notebook.module.css";
import RichText from "./RichText";
import { caseStudies } from "@/data/caseStudies";
import {
  builtStats,
  differently,
  fieldNotes,
  now,
  principles,
  releases,
  roadmap,
  type NoteId,
} from "@/data/notebook";
import { profile } from "@/data/resume";
import { useWindow } from "@/context/WindowContext";
import { JOURNEY_STEPS, useJourney } from "@/lib/journey";
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
  {
    id: "product",
    title: "This Site Is a Product",
    snippet: "Your visit, measured. Release notes. Roadmap.",
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

function VisitFunnel() {
  const done = useJourney();
  const { openSection, openPrototype } = useWindow();
  const count = JOURNEY_STEPS.filter((s) => done.includes(s.id)).length;
  const next = JOURNEY_STEPS.find((s) => !done.includes(s.id));
  const go = () => {
    if (!next) return;
    trackEvent("Clicked Journey Next Step", { step: next.id });
    if (next.id === "explored" || next.id === "case")
      openSection("projects", "notebook");
    if (next.id === "prototype") openPrototype("kissan-sampurna", "notebook");
    if (next.id === "contact") openSection("contact", "notebook");
  };
  const nextLabel: Record<string, string> = {
    explored: "Open Case Studies",
    case: "Read a case study",
    prototype: "Try a prototype",
    contact: "Get in touch",
  };
  return (
    <section className={styles.funnel} aria-label="Your visit, measured">
      <div className={styles.funnelHead}>
        <h3>Your visit, measured</h3>
        <span className={styles.funnelCount}>
          {count} of {JOURNEY_STEPS.length}
        </span>
      </div>
      <p className={styles.funnelNote}>
        The same funnel I’d watch for any product, for your visit only. It never
        leaves your browser.
      </p>
      <ol className={styles.steps}>
        {JOURNEY_STEPS.map((s, i) => {
          const on = done.includes(s.id);
          return (
            <li key={s.id} className={on ? styles.stepOn : undefined}>
              <span className={styles.stepMark} aria-hidden="true">
                {on ? <Check size={11} strokeWidth={3} /> : i + 1}
              </span>
              <span>{s.label}</span>
              <span className={styles.stepBar} aria-hidden="true">
                <span style={{ width: on ? "100%" : "0%" }} />
              </span>
            </li>
          );
        })}
      </ol>
      {next ? (
        <button type="button" className={styles.nextStep} onClick={go}>
          Next step: {nextLabel[next.id]}{" "}
          <ArrowRight size={13} aria-hidden="true" />
        </button>
      ) : (
        <p className={styles.funnelDone}>
          Full funnel. Thank you for the visit.
        </p>
      )}
    </section>
  );
}

function SiteAsProduct() {
  return (
    <>
      <p className={styles.lede}>
        I run this portfolio the way I’d run any product: instrumented, shipped
        in versions, with a roadmap and a way to ask for features.
      </p>
      <dl className={styles.stats}>
        {builtStats.map((s) => (
          <div key={s.label}>
            <dd>{s.value}</dd>
            <dt>{s.label}</dt>
          </div>
        ))}
      </dl>

      <VisitFunnel />

      <h3 className={styles.subhead}>Roadmap</h3>
      <div className={styles.roadmap}>
        {(
          [
            ["Now", roadmap.now],
            ["Next", roadmap.next],
            ["Later", roadmap.later],
          ] as const
        ).map(([label, items]) => (
          <div key={label} className={styles.lane}>
            <span className={styles.laneLabel}>{label}</span>
            <ul>
              {items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <a
        className={styles.request}
        href={`mailto:${profile.email}?subject=${encodeURIComponent("Feature request for your portfolio")}`}
        onClick={() => trackEvent("Requested Site Feature", {})}
      >
        Request a feature <ArrowUpRight size={13} aria-hidden="true" />
      </a>

      <h3 className={styles.subhead}>Release notes</h3>
      <ol className={styles.releases}>
        {releases.map((r) => (
          <li key={r.version}>
            <div className={styles.releaseHead}>
              <span className={styles.version}>v{r.version}</span>
              <strong>{r.title}</strong>
              <span className={styles.releaseDate}>{r.date}</span>
            </div>
            <ul>
              {r.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </li>
        ))}
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
        {note === "product" && <SiteAsProduct />}
        {note === "now" && <Now />}
      </article>
    </div>
  );
}
