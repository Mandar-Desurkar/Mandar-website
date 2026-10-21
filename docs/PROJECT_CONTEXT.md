# Project context

Living notes so any Claude session (any account, any machine) or collaborator can pick up
where the last one stopped. Loaded automatically through `CLAUDE.md`.

**Keep it current:** after any meaningful change, update "Current state", tick or add backlog
items, and add a dated line to the changelog. Keep entries short and factual.

---

## Goal

Personal portfolio for **Mandar Desurkar (Product Manager)**, styled as a macOS desktop:
wallpaper, desktop folder icons, a draggable/resizable window per section, a dock and a menu
bar. Audience: recruiters and hiring managers, many arriving on mobile via LinkedIn.

## Current state (2026-10-21)

- Stack: Next.js 16.3 App Router, React 19.2, TypeScript, CSS Modules + tokens in
  `src/app/globals.css`, framer-motion, lucide-react, react-icons.
- Sections (tab ids in `WindowContext.activeTab`): `about`, `experience`, `education`,
  `projects`, `contact`.
- Branches: `main` (default), `dev`, `prod` (release). Remote: GitHub `Mandar-Desurkar/Mandar-website`.
- Uncommitted work on `prod` as of 2026-10-21: UI changes across about 20 components/styles;
  `public/profile.jpg` replaced by `public/profile-new.jpg`.
- **Content source of truth: `src/data/resume.ts`** (profile, KPIs, experience, projects,
  beyond work, skills), synced with the owner's LaTeX resume on 2026-10-21. Edit content
  there, not in JSX. `**text**` renders bold through `src/components/RichText.tsx`.
- Owner: Associate Product Manager at Silo Fortune (09/2025–present), previously PM Intern at
  AltQube (06/2023–09/2025); B.E. ISE, M. S. Ramaiah Institute of Technology (CGPA 8.30);
  former Team India open-water swimmer.
- Project Claude skills live in `.claude/skills/` (index in `CLAUDE.md`).
- Context auto-sync: a Stop hook (`.claude/hooks/update-context.sh`, registered in
  `.claude/settings.json`) makes Claude update this file before ending any response in which
  project files changed.
- Branch workflow: `prod` and `dev` are kept in sync on GitHub; commit on one, then
  fast-forward the other.

## Decisions

| Date | Decision | Why |
|---|---|---|
| 2026-10-21 | Keep project knowledge in-repo (`CLAUDE.md`, this file, `.claude/skills/`) | Survives switching Claude accounts and machines; git versions it |
| 2026-10-21 | Added 10 project skills + `preflight.sh` / `asset-report.sh` | Consistent expert workflow for SEO, a11y, perf, content, deploy |
| 2026-10-21 | Hero KPIs = 250K+ installs, 3× trial conversion, ₹1 Cr+ monthly sales | Replaced unverifiable "12+ products / 1M+ users / 4+ years"; every number now traces to the resume |
| 2026-10-21 | Kept the "Future CPO / Founder (TBD)" Experience entry | Intentional easter egg by the owner; flagged as a possible credibility risk, owner to decide |
| 2026-10-21 | Enforce context updates with a Stop hook, triggered only when files changed | Owner wants context kept after every response; a hook is guaranteed, unlike a CLAUDE.md instruction; skipping pure Q&A turns keeps the file free of noise |

## Backlog (from the first `ship-check` run, 2026-10-21)

- [ ] **Perf:** `public/` is 48.8 MB. Folder SVGs (0.6–10 MB each) embed raster images; convert
      them to small PNG/WebP. Compress `wallpaper.jpg` (1.3 MB). Delete unused `Folder6–8.svg`
      and the default Next SVGs.
- [ ] **Lint:** remaining errors elsewhere (e.g. setState in effect, `Navbar.tsx:17`). Fixed on
      2026-10-21: the unused `Terminal` import in Hero and the unescaped apostrophe in Contact.
- [x] **Content:** placeholder projects replaced with 5 real products from the resume (2026-10-21).
- [ ] **Content:** add live links for projects (Play Store links for Kissan/Gau Sampurna?) via
      the optional `link` field in `src/data/resume.ts`. Decide whether to keep the "TBD" future entry.
- [ ] **Resume:** add `public/resume.pdf` and a download button in Contact/Hero; put the
      deployed site URL into the resume's `YOUR-PORTFOLIO-LINK` placeholder.
- [ ] **Hero CTAs** (`#projects`, `#contact`) are hash links and don't switch window tabs;
      wire them to `setActiveTab`.
- [ ] **SEO:** add `metadataBase`, OG image, `sitemap.ts`, `robots.ts`, `icon.png`, JSON-LD.
      Only the active tab is in server HTML, so other sections aren't crawlable.
- [ ] **A11y:** desktop icons/dock items are clickable `div`s (no keyboard access);
      no reduced-motion handling.
- [ ] **Security/UX:** `NoInspect.tsx` blocks copy (including the email); `Dock.tsx`
      `window.open` lacks `noopener`.
- [ ] Add `src/app/not-found.tsx` (OS-themed 404).
- [ ] Push `prod` and `dev` to origin. Committed locally on 2026-10-21; the push was rejected (403)
      because git was signed in as `mandar-desurkar3`, not the repo owner `Mandar-Desurkar`.

## Changelog

- 2026-10-21: Added `.claude/skills/` (10 skills), `.claude/settings.json`, project section
  in `CLAUDE.md`, and this context file.
- 2026-10-21: Added Stop hook `.claude/hooks/update-context.sh` that requires this file to be
  updated whenever project files change.
- 2026-10-21: Synced site content with the resume. Added `src/data/resume.ts` and
  `RichText.tsx`. Hero summary and KPIs; Experience now shows APM product groups with bullets
  plus AltQube; Projects has 5 real product cards with metric chips; Education adds CGPA and a
  Skills & Toolkit card; Contact adds location; page title and description updated.
  `tsc` and `next build` pass.
- 2026-10-21: Committed everything (Claude setup + UI/content) on `prod`, fast-forwarded
  `dev` locally. Push pending a GitHub account switch.
