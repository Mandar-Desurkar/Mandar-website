// A case study, rendered from src/data/caseStudies.ts as a long-form editorial page that can be
// shared on its own (LinkedIn, email). Statically generated for every slug; unknown slugs 404.
// Design language: a "field report". Hairline rules and type hierarchy instead of boxes, section
// headlines that state the takeaway, and purpose-built figures (waffle chart, journey map with an
// emotion curve, annotated screen, engine pipeline) where a list would hide the idea.
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CircleAlert,
  Droplets,
  Annoyed,
  Frown,
  Info,
  Lightbulb,
  LandPlot,
  Laugh,
  Meh,
  Smile,
  Languages,
  Map as MapIcon,
  MapPin,
  Milk,
  PawPrint,
  Play,
  Quote,
  Scale,
  Sprout,
  Store,
  Target,
  Wallet,
  Wheat,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import RichText from "@/components/RichText";
import { CaseStudyView, CopyLinkButton, TrackedCite, TrackedLink } from "@/components/case-study/CaseStudyTracking";
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
    alternates: { canonical: `/case-studies/${cs.slug}` },
    openGraph: { title: cs.title, description: cs.subtitle, type: "article", images: [{ url: cs.cover, alt: cs.title }] },
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

// An icon for each persona fact, so the profile scans like a card rather than a table
const ATTR_ICONS: Record<string, LucideIcon> = {
  Place: MapPin,
  Land: LandPlot,
  Water: Droplets,
  Grows: Sprout,
  Owns: BookOpen,
  Scope: MapIcon,
  Tools: Wrench,
  // Dairy farmers (Gau Sampurna)
  Herd: PawPrint,
  Milk: Milk,
  Feed: Wheat,
  Market: Store,
  Money: Wallet,
  Language: Languages,
};

// Footnote marker: the number of a source in the list at the end of the page
function Cite({ cs, id }: { cs: CaseStudy; id?: string }) {
  if (!id) return null;
  const n = cs.sources.findIndex((s) => s.id === id) + 1;
  if (!n) return null;
  return (
    <TrackedCite slug={cs.slug} sourceId={id} n={n} className={styles.cite} />
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

// 10 × 10 waffle: one square per percentage point
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
// The journey as a story read top to bottom: what the farmer does, how it feels, what goes wrong
const MOOD_FACES: Record<number, LucideIcon> = { 2: Laugh, 1: Smile, 0: Meh, [-1]: Annoyed, [-2]: Frown };

function JourneyMap({ cs }: { cs: CaseStudy }) {
  const tone = (feel: number) => (feel > 0 ? styles.toneGood : feel < 0 ? styles.toneBad : styles.toneMid);
  return (
    <figure className={styles.journey}>
      <div className={styles.timelineHead} aria-hidden="true">
        <span>What the farmer does</span>
        <span>Feels</span>
        <span>What goes wrong</span>
      </div>
      <ol className={styles.timeline}>
        {cs.journey.map((s, i) => {
          const Face = MOOD_FACES[Math.max(-2, Math.min(2, s.feel))] ?? Meh;
          return (
            <li key={s.step} className={`${styles.timelineRow} ${tone(s.feel)}`}>
              <div className={styles.tlDoes}>
                <h3>{s.step}</h3>
                <p>{s.does}</p>
              </div>
              <div className={styles.tlRail}>
                <span className={styles.tlNode}>{i + 1}</span>
                <span className={styles.tlMood}>
                  <Face size={18} aria-hidden="true" />
                  {s.feeling}
                </span>
              </div>
              <p className={styles.tlPain}>
                <CircleAlert size={15} aria-hidden="true" />
                <span>
                  {s.pain}
                  <Cite cs={cs} id={s.source} />
                </span>
              </p>
            </li>
          );
        })}
      </ol>
      <figcaption className={styles.timelineNote}>Feelings are illustrative, drawn from the pain points.</figcaption>
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
  // "Crop Guide: the right crop…" → "Crop Guide"
  const featureName = cs.title.split(":")[0];
  // The sidebar suggests the next case study, wrapping round to the first
  const next = caseStudies.length > 1 ? caseStudies[(caseStudies.indexOf(cs) + 1) % caseStudies.length] : undefined;

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
        <ReadingProgress slug={cs.slug} />
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
        {/* Wide screens: a sticky reading companion beside the article (where am I, how long is
            left, where next, and how to reach me) */}
        <aside className={styles.tocCol}>
          <div className={styles.companion}>
            <TableOfContents items={toc} slug={cs.slug} minutes={minutes} />

            {next && (
              <TrackedLink slug={cs.slug} cta="next_case_study" href={`/case-studies/${next.slug}`} className={styles.nextCase}>
                <span className={styles.companionLabel}>Next case study</span>
                <span className={styles.nextThumb} aria-hidden="true">
                  <Image src={next.cover} alt="" width={393} height={852} sizes="96px" />
                </span>
                <b>{next.title.split(":")[0]}</b>
                <span className={styles.nextMeta}>
                  {next.product}
                  <ArrowRight size={14} aria-hidden="true" />
                </span>
              </TrackedLink>
            )}

            <div className={styles.hire}>
              <p className={styles.hireStatus}>
                <span aria-hidden="true" />
                {profile.availability}
              </p>
              <p className={styles.hireText}>Want the story behind the decisions? Happy to walk through it.</p>
              <TrackedLink slug={cs.slug} cta="contact" href="/?section=contact" className={styles.hireCta}>
                Get in touch
              </TrackedLink>
              <CopyLinkButton slug={cs.slug} className={styles.copyLink} />
            </div>
          </div>
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
              {cs.personas.map((p, i) => {
                const [name, age] = p.name.split(", ");
                return (
                  <article key={p.name} className={`${styles.persona} ${p.internal ? styles.personaInternal : styles[`tone${i % 3}`]}`}>
                    {/* Profile header: a tinted band with the avatar sitting on its edge */}
                    <header className={styles.personaHead}>
                      <span className={styles.personaBand} aria-hidden="true" />
                      <span className={styles.monogram} aria-hidden="true">
                        {name.replace(/^The /, "").charAt(0).toUpperCase()}
                      </span>
                      <span className={styles.personaId}>
                        <h3>
                          {name}
                          {age && <span className={styles.personaAge}>, {age}</span>}
                        </h3>
                        <span className={styles.personaRole}>{p.internal && !/internal/i.test(p.role) ? `${p.role} · internal` : p.role}</span>
                      </span>
                    </header>

                    <dl className={styles.attrs}>
                      {p.attrs.map((a) => {
                        const Icon = ATTR_ICONS[a.label] ?? Info;
                        return (
                          <div key={a.label}>
                            <Icon size={15} aria-hidden="true" />
                            <dt>{a.label}</dt>
                            <dd>{a.value}</dd>
                          </div>
                        );
                      })}
                    </dl>

                    <blockquote className={styles.personaQuote}>
                      <Quote size={18} aria-hidden="true" />
                      <p>{p.quote}</p>
                    </blockquote>

                    <div className={styles.needs}>
                      <div className={styles.wants}>
                        <h4>
                          <Target size={14} aria-hidden="true" /> Wants
                        </h4>
                        <ul>
                          {p.goals.map((g) => (
                            <li key={g}>
                              <Check size={14} aria-hidden="true" />
                              {g}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.struggles}>
                        <h4>
                          <CircleAlert size={14} aria-hidden="true" /> Frustrations
                        </h4>
                        <ul>
                          {p.frustrations.map((f) => (
                            <li key={f}>
                              <X size={14} aria-hidden="true" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </Section>

          {/* 03 Today */}
          <Section cs={cs} id="today" n={3}>
            <p className={styles.lead}>{cs.journeyIntro}</p>
            <JourneyMap cs={cs} />
          </Section>

          {/* 04 Principles */}
          <Section cs={cs} id="principles" n={4}>
            {/* Each card reads top to bottom: what we learned, then the rule it turned into */}
            <ol className={styles.principles}>
              {cs.principles.map((p, i) => (
                <li key={p.principle} className={styles.principle}>
                  <div className={styles.insight}>
                    <span className={styles.principleLabel}>
                      <Lightbulb size={14} aria-hidden="true" /> Insight
                    </span>
                    <span className={styles.principleNum} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <p>
                      {p.insight}
                      <Cite cs={cs} id={p.source} />
                    </p>
                  </div>
                  <span className={styles.principleArrow} aria-hidden="true">
                    <ArrowDown size={14} />
                  </span>
                  <div className={styles.rule}>
                    <span className={styles.principleLabel}>Design rule</span>
                    <p>{p.principle}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          {/* 05 Solution */}
          <Section cs={cs} id="solution" n={5}>
            <p className={styles.lead}>{cs.solution.intro}</p>
            <FeatureList features={cs.solution.beforeReport} />

            <h3 className={styles.subhead}>{cs.solution.anatomy.title ?? "Anatomy of a recommendation"}</h3>
            <p>{cs.solution.anatomy.intro}</p>
            <figure className={styles.anatomy}>
              <div className={styles.anatomyShot}>
                <span className={`${styles.device} ${styles.deviceLong}`}>
                  <Image
                    src={cs.solution.anatomy.image}
                    alt={`The full ${featureName} report, annotated`}
                    width={cs.solution.anatomy.width}
                    height={cs.solution.anatomy.height}
                    sizes="(max-width: 767px) 72vw, 300px"
                  />
                </span>
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
            <figure
              className={styles.pipeline}
              aria-label={`How ${featureName} works`}
              style={{ ["--stages" as string]: cs.solution.pipeline.stages.length }}
            >
              {/* Reads top to bottom: what goes in, the stages on one rail, what comes out */}
              <p className={styles.pipeIn}>
                <span>Starts with</span> {cs.solution.pipeline.input}
              </p>
              <ol className={styles.pipeStages}>
                {cs.solution.pipeline.stages.map((st, i) => (
                  <li key={st.title} className={styles.pipeStage}>
                    <span className={styles.pipeNode} aria-hidden="true">{i + 1}</span>
                    <div className={styles.pipeBody}>
                      <span className={styles.pipeNum}>Stage {i + 1}</span>
                      <h3>{st.title}</h3>
                      <p>{st.caption}</p>
                      <ul>
                        {st.items.map((it) => (
                          <li key={it}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ol>
              <p className={styles.pipeOut}>
                <span>Delivers</span> {cs.solution.pipeline.output}
                <ArrowRight size={18} aria-hidden="true" />
              </p>
            </figure>
            {cs.solution.evidence && (
              <figure className={styles.evidence}>
                <Image
                  src={cs.solution.evidence.image}
                  alt={cs.solution.evidence.caption}
                  width={cs.solution.evidence.width}
                  height={cs.solution.evidence.height}
                  sizes="(max-width: 767px) 100vw, 860px"
                />
                <figcaption>
                  <b>Real output</b> {cs.solution.evidence.caption}
                </figcaption>
              </figure>
            )}
            {/* Three rules sit in a row; four read better as two pairs */}
            <ul className={styles.ruleNotes} style={{ ["--rules" as string]: cs.solution.engineRules.length === 4 ? 2 : 3 }}>
              {cs.solution.engineRules.map((r) => (
                <li key={r}>
                  <RichText text={r} />
                </li>
              ))}
            </ul>
          </Section>

          {/* 07 Decisions */}
          <Section cs={cs} id="decisions" n={7}>
            {/* A decision log: the choice, the reason, and what it cost, side by side */}
            <ol className={styles.decisions}>
              {cs.solution.decisions.map((d, i) => (
                <li key={d.decision} className={styles.decision}>
                  <div className={styles.decisionHead}>
                    <span className={styles.decisionId}>D{i + 1}</span>
                    <h3>{d.decision}</h3>
                  </div>
                  <div className={styles.decisionWhy}>
                    <span className={styles.decisionLabel}>
                      <Check size={13} aria-hidden="true" /> Why
                    </span>
                    <p>{d.why}</p>
                  </div>
                  <div className={styles.decisionCost}>
                    <span className={styles.decisionLabel}>
                      <Scale size={13} aria-hidden="true" /> Trade-off
                    </span>
                    <p>{d.tradeoff}</p>
                  </div>
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
              {cs.learnings.map((l, i) => {
                // "**Close the loop at harvest.** Usage shows…" → a title and its explanation
                const [, title, body] = l.match(/^\*\*(.+?)[.:]?\*\*\s*(.*)$/) ?? [null, null, l];
                return (
                  <li key={l} className={styles.lesson}>
                    <span className={styles.lessonNum} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    {title && <h3>{title}</h3>}
                    <p>
                      <RichText text={body} />
                    </p>
                  </li>
                );
              })}
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
                  Try the {featureName} prototype
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
