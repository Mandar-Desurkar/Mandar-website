@AGENTS.md
@docs/PROJECT_CONTEXT.md

> Keep `docs/PROJECT_CONTEXT.md` up to date: after any meaningful change, update its current
> state, backlog and changelog. Put project knowledge there or in this file, never only in
> chat or in local Claude memory, so it survives switching accounts or machines.

# Project: Mandar Desurkar portfolio

Personal portfolio styled as a macOS desktop. Next.js 16 App Router, React 19, TypeScript,
CSS Modules + tokens in `src/app/globals.css`, framer-motion. One page (`src/app/page.tsx`);
sections are tabs in `WindowContext.activeTab` rendered inside `DraggableWindow`.

## Commands
- `npm run dev`: local dev server
- `npx tsc --noEmit && npm run lint`: run after every change
- `npm run build`: required before saying a route/metadata/config change works
- `bash .claude/skills/ship-check/scripts/preflight.sh`: full pre-deploy gate

## Project skills (`.claude/skills/`)
| Skill | Use when |
|---|---|
| `nextjs-16-conventions` | Any Next.js API, routing, metadata, config, server/client boundary |
| `add-portfolio-section` | Adding/removing a desktop section (tab, icon, dock item, window size) |
| `ui-design-system` | Creating or restyling components; tokens, typography, motion |
| `responsive-design` | Layout, breakpoints, mobile/touch behaviour |
| `accessibility-audit` | Interactive UI, keyboard, screen readers, contrast, reduced motion |
| `performance-audit` | Images, SVGs, bundle size, Core Web Vitals, Lighthouse |
| `seo-and-social-sharing` | Metadata, OG images, sitemap, robots, JSON-LD |
| `portfolio-content` | Writing or reviewing any copy, projects, experience, metrics |
| `web-security` | Headers/CSP, forms, env vars, personal-data exposure |
| `ship-check` | Before deploy/merge to `prod` |
