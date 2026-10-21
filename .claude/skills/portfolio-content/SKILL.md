---
name: portfolio-content
description: Write and review the words on the portfolio, including the hero/about intro, experience bullets, project case studies, education, and contact copy, as a product manager hiring expert would. Use when adding or editing any text content, projects, roles, metrics, or calls to action, or when the user asks to make the portfolio more impressive, recruiter-friendly, or clearer.
---

# Portfolio content

The owner is a **Product Manager**. Readers are recruiters (about 30 seconds of scanning),
hiring managers (looking for evidence of judgement and impact), and peers. The playful OS theme
earns attention; the content has to earn the interview.

## Principles

1. **Lead with outcomes, not activities.** "Grew activation 18% → 27% in 2 quarters by
   redesigning onboarding" beats "Responsible for onboarding".
2. **Every claim gets a number or a concrete artefact.** Percentages, users, revenue, time saved,
   team size, launch dates. If confidential, use relative numbers ("2.3×", "top-3 driver of NPS").
3. **Show PM judgement.** For flagship work, say what you decided *not* to do and why.
4. **Real over impressive.** Fake or placeholder work is worse than less work. Any `#` link, lorem
   text or invented metric must be replaced or removed before shipping.
5. **Scannable.** Short paragraphs, bold the key metric, 3–5 bullets per role, most recent first.
6. **One voice.** First person, active verbs, consistent tense (past for past roles).

## Formats

**Hero / About (Hero.tsx)**: name, one-line positioning (who you help + how + proof),
2–3 sentence story, and a primary CTA (Contact / Resume) visible without scrolling.
> "Product manager who turns messy B2B workflows into products people pay for. 0→1 launches at
> X and Y; currently building Z."

**Experience bullet (Experience.tsx)**: *Action verb + what + measurable result + how*.
> "Launched self-serve billing for 4k SMB accounts, cutting sales-assisted upgrades by 40% and
> adding $1.2M ARR in year one."

**Project case study (Projects.tsx)**: keep cards short and link to a deeper write-up.
- Card: title, one-line problem, **headline metric**, role, 3 tags, live/demo link.
- Case study: Context → Problem & evidence → Options considered → Decision & trade-offs →
  Execution (team, timeline) → Outcome (metrics) → What I'd do differently.

**Contact (Contact.tsx)**: one clear ask ("Hiring for a PM role? Let's talk."), email as the
primary action, LinkedIn second, plus a downloadable resume PDF (`public/resume.pdf`, linked
with `download`).

## Data hygiene

- Content arrays are currently hard-coded inside components (e.g. `projects` in `Projects.tsx`).
  When editing them, move them into typed modules under `src/data/` (`projects.ts`,
  `experience.ts`) with an exported type, so content edits never touch JSX and the SEO
  `seo-and-social-sharing` skill can reuse the same data for JSON-LD.
- Use stable `key`s (a slug), not array indices.

## Pre-publish content audit

```bash
grep -rnE 'href="#"|link: "#"|github: "#"|lorem|TODO|TBD|example\.com' src/
```
Then, for each section, check:
- [ ] Every metric is true and defensible in an interview
- [ ] No placeholder projects or links remain (the current `Projects.tsx` entries such as
      "OmniChannel Analytics" and "FinTrack" look like placeholders; confirm with the owner)
- [ ] Dates, titles and company names match LinkedIn and the resume exactly
- [ ] Spelling and grammar pass; consistent capitalisation of product names
- [ ] Contact details: decide deliberately whether a personal phone number should be public (see
      `web-security`)
- [ ] Jokes and easter eggs (dock "Imposter Syndrome", popups) stay light and never undercut
      credibility

Never invent metrics, employers, or projects on the owner's behalf. When information is
missing, leave a clearly marked `TODO(owner):` and list the questions to ask.
