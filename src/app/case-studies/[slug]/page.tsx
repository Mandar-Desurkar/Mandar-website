// A case study, rendered from src/data/caseStudies.ts as a long-form editorial page that can be
// shared on its own (LinkedIn, email). Statically generated for every slug; unknown slugs 404.
// Design language: a "field report". Hairline rules and type hierarchy instead of boxes, section
// headlines that state the takeaway, and purpose-built figures (waffle chart, journey map with an
// emotion curve, annotated screen, engine pipeline) where a list would hide the idea.
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowUpRight, Play } from "lucide-react";
import RichText from "@/components/RichText";
import { CaseStudyView, TrackedLink } from "@/components/case-study/CaseStudyTracking";
import { ReadingProgress, TableOfContents, type TocItem } from "@/components/case-study/ReadingNav";
import { caseStudies, getCaseStudy, type CaseStudy, type CaseStudyFeature } from "@/data/caseStudies";
import { profile } from "@/data/resume";
import styles from "./CaseStudy.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  return {
    title: `${cs.title} | ${profile.name}`,
    description: cs.subtitle,
    openGraph: { title: cs.title, description: cs.subtitle, type: "article" },
  };
}

const TOC: { id: keyof CaseStudy["headlines"]; label: string }[] = [
  { id: "problem", label: "Problem" },
  { id: "people", label: "People" },
  { id: "today", label: "Today" },
  { id: "principles", label: "Principles" },
  { id: "solution", label: "Solution" },
  { id: "engine", label: "Engine" },
  { id: "decisions", label: "Decisions" },
  { id: "outcomes", label: "Outcomes" },
  { id: "reflection", label: "Reflection" },
];

// Footnote marker: the number of a source in the list at the end of the page
function Cite({ cs, id }: { cs: CaseStudy; id?: string }) {
  if (!id) return null;
  const n = cs.sources.findIndex((s) => s.id === id) + 1;
  if (!n) return null;
  return (
    <a href={`#source-${n}`} className={styles.cite} aria-label={`Source ${n}`}>
      {n}
    </a>
  );
}

function Section({ cs, id, n, children }: { cs: CaseStudy; id: keyof CaseStudy["headlines"]; n: number; children: ReactNode }) {
  const label = TOC.find((t) => t.id === id)?.label;
  return (
    <section className={styles.section} id={id} aria-labelledby={`${id}-title`}>
      <p className={styles.kicker}>
        <span>{String(n).padStart(2, "0")}</span> {label}
      </p>
      <h2 id={`${id}-title`} className={styles.headline}>
        {cs.headlines[id]}
      </h2>
      {children}
    </section>
  );
}

// A screenshot in a phone bezel
function Device({ src, alt = "", sizes, eager }: { src: string; alt?: string; sizes: string; eager?: boolean }) {
  return (
    <span className={styles.device}>
      <Image src={src} alt={alt} width={393} height={852} sizes={sizes} {...(eager ? { loading: "eager" as const, fetchPriority: "high" as const } : {})} />
    </span>
  );
}

// 10 × 10 waffle: one square per farm household
function Waffle({ value }: { value: number }) {
  const filled = Math.round(value);
  return (
    <span className={styles.waffle} role="img" aria-label={`${value} out of 100`}>
      {Array.from({ length: 100 }, (_, i) => (
        <i key={i} className={i < filled ? styles.on : undefined} />
      ))}
    </span>
  );
}

// Journey map: stages as columns, an emotion curve across them, the pain point under each
function JourneyMap({ cs }: { cs: CaseStudy }) {
  const steps = cs.journey;
  const W = 600;
  const H = 120;
  const x = (i: number) => (W / steps.length) * (i + 0.5);
  const y = (feel: number) => H / 2 - feel * 24;
  const pts = steps.map((s, i) => [x(i), y(s.feel)] as const);
  const d = pts.reduce((acc, [px, py], i) => {
    if (i === 0) return `M ${px} ${py}`;
    const [qx, qy] = pts[i - 1];
    const mx = (qx + px) / 2;
    return `${acc} C ${mx} ${qy}, ${mx} ${py}, ${px} ${py}`;
  }, "");
  const tone = (feel: number) => (feel > 0 ? styles.toneGood : feel < 0 ? styles.toneBad : styles.toneMid);
  return (
    <figure className={styles.journey}>
      <div className={styles.journeyGrid} style={{ ["--cols" as string]: steps.length }}>
        <span className={styles.rowLabel} style={{ gridRow: 1 }}>
          Stage
        </span>
        <span className={styles.rowLabel} style={{ gridRow: 2 }}>
          Feeling
          <small>illustrative</small>
        </span>
        <span className={styles.rowLabel} style={{ gridRow: 3 }}>
          Pain point
        </span>

        {steps.map((s, i) => (
          // Explicit column: the curve has a fixed position, so auto-placed steps would skip past it
          <div key={s.step} className={styles.step} style={{ gridColumn: i + 2 }}>
            <div className={styles.stage}>
              <span className={styles.stageNum}>{i + 1}</span>
              <h3>{s.step}</h3>
              <p>{s.does}</p>
              <span className={`${styles.feeling} ${tone(s.feel)}`}>{s.feeling}</span>
            </div>
            <span className={styles.curveSlot} aria-hidden="true" />
            <p className={styles.painCell}>
              {s.pain}
              <Cite cs={cs} id={s.source} />
            </p>
          </div>
        ))}

        <div className={styles.curve} aria-hidden="true">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="journeyFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#004691" stopOpacity="0.14" />
                <stop offset="1" stopColor="#004691" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="0" x2={W} y1={H / 2} y2={H / 2} className={styles.curveBase} />
            <path d={`${d} L ${x(steps.length - 1)} ${H} L ${x(0)} ${H} Z`} fill="url(#journeyFill)" />
            <path d={d} className={styles.curveLine} />
          </svg>
          {steps.map((s, i) => (
            <span key={s.step} className={`${styles.curveDot} ${tone(s.feel)}`} style={{ left: `${(x(i) / W) * 100}%`, top: `${(y(s.feel) / H) * 100}%` }} />
          ))}
        </div>
      </div>
    </figure>
  );
}

// One card per thing the product does: the screens, what it does and why it works that way
function FeatureList({ features }: { features: CaseStudyFeature[] }) {
  return (
    <div className={styles.features}>
      {features.map((f) => {
        const several = f.screens.length > 1;
        return (
          <article key={f.title} className={`${styles.feature} ${several ? styles.featureWide : ""}`}>
            <div className={styles.featureText}>
              <h3>{f.title}</h3>
              <dl>
                <div>
                  <dt>What it does</dt>
                  <dd>{f.what}</dd>
                </div>
                <div>
                  <dt>Why it works this way</dt>
                  <dd>{f.why}</dd>
                </div>
              </dl>
            </div>
            <div className={styles.featureScreens} {...(several ? { tabIndex: 0, role: "group", "aria-label": `${f.title}, scroll sideways on phones` } : {})}>
              {f.screens.map((s) => (
                <figure key={s.image}>
                  <Device src={s.image} alt={`${f.title}: ${s.label}`} sizes="(max-width: 759px) 58vw, 230px" />
                  {several && <figcaption>{s.label}</figcaption>}
                </figure>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default async function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();
  const prototypeHref = `/?prototype=${cs.prototype.id}&flow=${cs.prototype.flow}`;
  const [season, report, compare] = cs.heroScreens;
  const toc: TocItem[] = TOC.map((t) => ({ id: t.id, label: t.label }));
  const minutes = Math.max(1, Math.round(JSON.stringify(cs).split(/\s+/).length / 230));
  const { featured } = cs.problem;

  return (
    <div className={styles.page}>
      <CaseStudyView slug={cs.slug} />

      <header className={styles.topBar}>
        <TrackedLink slug={cs.slug} cta="back" href="/?section=projects" className={styles.back}>
          <ArrowLeft size={18} aria-hidden="true" />
          <span>Case studies</span>
        </TrackedLink>
        <span className={styles.topTitle}>{profile.name}</span>
        <TrackedLink slug={cs.slug} cta="prototype" href={prototypeHref} className={styles.topCta}>
          <Play size={13} aria-hidden="true" />
          <span>Try the prototype</span>
        </TrackedLink>
        <ReadingProgress />
      </header>

      {/* ---------- Hero: brand canvas ---------- */}
      <section className={styles.hero} aria-labelledby="case-title">
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <p className={styles.heroKicker}>
              Case study <span aria-hidden="true">·</span> {cs.product} <span aria-hidden="true">·</span> {minutes} min read
            </p>
            <h1 id="case-title" className={styles.title}>
              {cs.title}
            </h1>
            <p className={styles.subtitle}>{cs.subtitle}</p>
          </div>
          <div className={styles.heroDevices} aria-hidden="true">
            <Device src={season} sizes="(max-width: 767px) 34vw, 220px" />
            <Device src={report} sizes="(max-width: 767px) 40vw, 260px" eager />
            <Device src={compare} sizes="(max-width: 767px) 34vw, 220px" />
          </div>
          <dl className={styles.heroMeta}>
            {cs.meta.map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- At a glance: challenge → approach → impact, joined by one progress line ---------- */}
      <section className={styles.glance} aria-label="At a glance">
        <ol className={styles.glancePanel}>
          {cs.glance.map((g) => (
            <li key={g.label}>
              <span className={styles.glanceDot} aria-hidden="true" />
              <p className={styles.glanceLabel}>{g.label}</p>
              <p className={styles.glanceTakeaway}>
                <RichText text={g.takeaway} />
              </p>
              <p className={styles.glanceText}>
                <RichText text={g.text} />
                <Cite cs={cs} id={g.source} />
              </p>
            </li>
          ))}
        </ol>
      </section>

      <div className={styles.layout}>
        <aside className={styles.tocCol}>
          <TableOfContents items={toc} />
        </aside>

        <article className={styles.main}>
          {/* 01 Problem */}
          <Section cs={cs} id="problem" n={1}>
            <p className={styles.lead}>{cs.problem.intro}</p>

            <figure className={styles.featuredStat}>
              <Waffle value={featured.value} />
              <figcaption>
                <b>{featured.value}%</b>
                <span>
                  {featured.label}
                  <Cite cs={cs} id={featured.source} />
                </span>
                <em>{featured.caption}</em>
              </figcaption>
            </figure>

            <dl className={styles.statStrip}>
              {cs.problem.stats.map((s) => (
                <div key={s.label}>
                  <dt>{s.value}</dt>
                  <dd>
                    {s.label}
                    <Cite cs={cs} id={s.source} />
                  </dd>
                </div>
              ))}
            </dl>

            <blockquote className={styles.pullQuote}>
              <p>{cs.problem.statement}</p>
              <footer>Problem statement</footer>
            </blockquote>

            <p className={styles.hmw}>
              <span className={styles.hmwLabel}>How might we</span>
              <span className={styles.hmwText}>{cs.problem.hmw.replace(/^How might we /, "")}</span>
            </p>
          </Section>

          {/* 02 People */}
          <Section cs={cs} id="people" n={2}>
            <p className={styles.note}>{cs.personasNote}</p>
            <div className={styles.personas}>
              {cs.personas.map((p) => (
                <article key={p.name} className={styles.persona}>
                  <header className={styles.personaHead}>
                    <span className={`${styles.monogram} ${p.internal ? styles.monogramInternal : ""}`} aria-hidden="true">
                      {p.name.charAt(0)}
                    </span>
                    <span>
                      <h3>{p.name}</h3>
                      <span className={styles.personaRole}>{p.role}</span>
                    </span>
                  </header>
                  <dl className={styles.attrs}>
                    {p.attrs.map((a) => (
                      <div key={a.label}>
                        <dt>{a.label}</dt>
                        <dd>{a.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <blockquote className={styles.personaQuote}>“{p.quote}”</blockquote>
                  <div className={styles.needs}>
                    <div>
                      <h4>Needs</h4>
                      <ul>
                        {p.goals.map((g) => (
                          <li key={g}>{g}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>Struggles</h4>
                      <ul className={styles.struggles}>
                        {p.frustrations.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Section>

          {/* 03 Today */}
          <Section cs={cs} id="today" n={3}>
            <p className={styles.lead}>{cs.journeyIntro}</p>
            <JourneyMap cs={cs} />
          </Section>

          {/* 04 Principles */}
          <Section cs={cs} id="principles" n={4}>
            <ol className={styles.principles}>
              {cs.principles.map((p, i) => (
                <li key={p.principle}>
                  <span className={styles.bigNum}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className={styles.insight}>
                      <span>Insight</span>
                      {p.insight}
                      <Cite cs={cs} id={p.source} />
                    </p>
                    <p className={styles.rule}>
                      <span>Design rule</span>
                      {p.principle}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          {/* 05 Solution */}
          <Section cs={cs} id="solution" n={5}>
            <p className={styles.lead}>{cs.solution.intro}</p>
            <FeatureList features={cs.solution.beforeReport} />

            <h3 className={styles.subhead}>Anatomy of a recommendation</h3>
            <p>{cs.solution.anatomy.intro}</p>
            <figure className={styles.anatomy}>
              <div className={styles.anatomyShot}>
                <Device src={cs.solution.anatomy.image} alt="The Crop Guide report, annotated" sizes="(max-width: 767px) 80vw, 320px" />
                {/* Markers sit in the margin beside the phone, with a leader to the element they explain */}
                {cs.solution.anatomy.callouts.map((c, i) => {
                  const left = c.x < 50;
                  return (
                    <span
                      key={c.title}
                      className={`${styles.callout} ${left ? styles.calloutLeft : styles.calloutRight}`}
                      style={{ top: `${c.y}%`, ["--x" as string]: `${c.x}%` }}
                      aria-hidden="true"
                    >
                      <span className={styles.leader} />
                      <span className={styles.marker}>{i + 1}</span>
                    </span>
                  );
                })}
              </div>
              <ol className={styles.legend}>
                {cs.solution.anatomy.callouts.map((c, i) => (
                  <li key={c.title}>
                    <span className={styles.legendNum}>{i + 1}</span>
                    <div>
                      <b>{c.title}</b>
                      <p>{c.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </figure>

            <FeatureList features={cs.solution.afterReport} />
          </Section>

          {/* 06 Engine */}
          <Section cs={cs} id="engine" n={6}>
            <p className={styles.lead}>{cs.solution.engineIntro}</p>
            <figure className={styles.pipeline} aria-label="How the engine ranks crops">
              <span className={`${styles.endpoint} ${styles.endpointIn}`}>{cs.solution.pipeline.input}</span>
              {cs.solution.pipeline.stages.map((st, i) => (
                <div key={st.title} className={styles.pipeStage}>
                  <span className={styles.pipeNum}>Stage {i + 1}</span>
                  <h3>{st.title}</h3>
                  <p>{st.caption}</p>
                  <ul>
                    {st.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
              <span className={`${styles.endpoint} ${styles.endpointOut}`}>{cs.solution.pipeline.output}</span>
            </figure>
            <ul className={styles.ruleNotes}>
              {cs.solution.engineRules.map((r) => (
                <li key={r}>
                  <RichText text={r} />
                </li>
              ))}
            </ul>
          </Section>

          {/* 07 Decisions */}
          <Section cs={cs} id="decisions" n={7}>
            <ol className={styles.decisions}>
              {cs.solution.decisions.map((d, i) => (
                <li key={d.decision}>
                  <span className={styles.decisionId}>D{i + 1}</span>
                  <h3>{d.decision}</h3>
                  <p>
                    <span>Why</span>
                    {d.why}
                  </p>
                  <p>
                    <span>Trade-off</span>
                    {d.tradeoff}
                  </p>
                </li>
              ))}
            </ol>
          </Section>

          {/* 08 Outcomes */}
          <Section cs={cs} id="outcomes" n={8}>
            <p className={styles.lead}>{cs.outcomes.intro}</p>
            <div className={styles.outcomePanel}>
              <dl className={styles.outcomeMetrics}>
                {cs.outcomes.metrics.map((m) => (
                  <div key={m.label}>
                    <dt>{m.value}</dt>
                    <dd>{m.label}</dd>
                  </div>
                ))}
              </dl>
              <ul className={styles.outcomeImpact}>
                {cs.outcomes.impact.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
            <h3 className={styles.subhead}>Measurement plan</h3>
            <table className={styles.plan}>
              <thead>
                <tr>
                  <th scope="col">Metric</th>
                  <th scope="col">How it&apos;s measured</th>
                  <th scope="col">What it tells us</th>
                </tr>
              </thead>
              <tbody>
                {cs.outcomes.measureNext.map((m) => (
                  <tr key={m.metric}>
                    <th scope="row">{m.metric}</th>
                    <td data-label="How it's measured">{m.how}</td>
                    <td data-label="What it tells us">{m.tells}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {/* 09 Reflection */}
          <Section cs={cs} id="reflection" n={9}>
            <ol className={styles.reflection}>
              {cs.learnings.map((l, i) => (
                <li key={l}>
                  <span className={styles.bigNum}>{String(i + 1).padStart(2, "0")}</span>
                  <p>
                    <RichText text={l} />
                  </p>
                </li>
              ))}
            </ol>
          </Section>

          {/* CTA */}
          <section className={styles.cta} aria-labelledby="cta-title">
            <div className={styles.ctaText}>
              <p className={styles.heroKicker}>Interactive prototype</p>
              <h2 id="cta-title">See it working</h2>
              <p>Every screen in this case study is in the prototype, rebuilt from the app&apos;s real code and assets. Tap through the whole flow.</p>
              <div className={styles.ctaRow}>
                <TrackedLink slug={cs.slug} cta="prototype" href={prototypeHref} className={styles.ctaPrimary}>
                  <Play size={16} aria-hidden="true" />
                  Try the Crop Guide prototype
                </TrackedLink>
                <TrackedLink slug={cs.slug} cta="back" href="/?section=projects" className={styles.ctaSecondary}>
                  More case studies
                </TrackedLink>
              </div>
            </div>
            <div className={styles.ctaDevice} aria-hidden="true">
              <Device src={report} sizes="220px" />
            </div>
          </section>

          {/* Sources */}
          <section className={styles.sources} aria-labelledby="sources-title">
            <h2 id="sources-title">Sources</h2>
            <ol>
              {cs.sources.map((s, i) => (
                <li key={s.id} id={`source-${i + 1}`}>
                  <TrackedLink slug={cs.slug} cta="source" href={s.url} external>
                    {s.label}
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </TrackedLink>
                  <span>
                    {s.publisher} · {s.date}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </article>
      </div>
    </div>
  );
}
