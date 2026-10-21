---
name: nextjs-16-conventions
description: Ground rules for writing Next.js 16 App Router code in this repo. Use before adding or changing any route, layout, metadata export, next.config option, image, font, proxy/middleware, server action, or "use client" boundary, and whenever unsure whether a Next.js API from memory still exists in v16.
---

# Next.js 16 conventions for this repo

This project runs **Next.js 16.3 + React 19.2**. APIs differ from older training data. The
source of truth is the docs bundled in the installed package, not memory.

## Step 0: look it up locally

```bash
ls node_modules/next/dist/docs/01-app/                       # getting-started, guides, api-reference
grep -rl "<topic>" node_modules/next/dist/docs/01-app | head  # find the right page
```

Useful entry points:

| Need | Doc |
|---|---|
| Metadata, OG images | `01-app/01-getting-started/14-metadata-and-og-images.md` |
| sitemap / robots / icons / manifest | `01-app/03-api-reference/03-file-conventions/01-metadata/` |
| Images | `01-app/01-getting-started/12-images.md`, `03-api-reference/02-components/image.md` |
| Fonts | `01-app/01-getting-started/13-fonts.md` |
| Server vs Client components | `01-app/01-getting-started/05-server-and-client-components.md` |
| next.config options | `01-app/03-api-reference/05-config/01-next-config-js/` |
| Production checklist | `01-app/02-guides/production-checklist.md` |
| CSP / security headers | `01-app/02-guides/content-security-policy.md` |
| JSON-LD | `01-app/02-guides/json-ld.md` |

## v16 changes most likely to bite

- **`middleware.ts` is deprecated, renamed to `proxy.ts`.** Never create `middleware.ts`.
- `params` / `searchParams` passed to pages, layouts and `generateMetadata` are **Promises**; `await` them.
- `metadata` / `generateMetadata` exports work **only in Server Components**. A file starting with
  `"use client"` cannot export metadata.
- Turbopack is the default bundler. Webpack-only plugins/config may not apply.
- Check deprecation notes at the top of any doc page before using an API.

## Server/Client boundary in this codebase

Today `src/app/page.tsx` is entirely `"use client"`, because the whole desktop UI reads
`WindowContext`. Rules for new code:

1. Default to **Server Components**. Add `"use client"` only to the smallest leaf that needs
   state, effects, event handlers, browser APIs, or framer-motion.
2. Keep static content (project lists, experience entries) in plain TS data modules
   (e.g. `src/data/*.ts`) that both server and client code can import.
3. `layout.tsx` is a Server Component. Keep it that way so it can own `metadata`, `viewport`,
   fonts, and JSON-LD.
4. Never pass functions or class instances from a Server to a Client component as props.

## Project idioms

- Path alias `@/*` maps to `src/*`. Import as `@/components/Foo`.
- Styling: CSS Modules per component (`Foo.module.css`) plus global tokens in
  `src/app/globals.css`. See the `ui-design-system` skill.
- Animation: `framer-motion` (`motion`, `AnimatePresence`, `Variants`).
- Icons: `lucide-react` first; `react-icons` only for brand logos (e.g. `FaGithub`, `FaLinkedin`).
- Images: `next/image`. For local SVGs it passes the file through unoptimized, so the SVG itself
  must be small (see `performance-audit`).

## Verify after every change

```bash
npx tsc --noEmit && npm run lint
```

Run `npm run build` before claiming a route, metadata, or config change works: build catches
server/client boundary errors that `dev` lets through.
