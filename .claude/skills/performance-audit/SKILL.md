---
name: performance-audit
description: Measure and improve load speed and Core Web Vitals (LCP, INP, CLS) for this portfolio. Use when the site feels slow, before deploying, when adding images/SVGs/fonts/videos/dependencies, or when the user mentions performance, Lighthouse, PageSpeed, bundle size, or page weight.
---

# Performance audit

Targets (75th percentile, mobile): **LCP < 2.5s, INP < 200ms, CLS < 0.1**. Total page weight
on first load should stay **under ~1.5 MB**. A recruiter on hotel Wi-Fi or a phone will leave a
portfolio that takes 8s to show a name.

## Start with the asset report

```bash
bash .claude/skills/performance-audit/scripts/asset-report.sh
```
It lists every file in `public/` by size and flags anything over 200 KB, plus whether it is
referenced in `src/`.

## Known hot spots in this repo

1. **`public/icons/Folder*.svg` are 0.6–10 MB each.** They almost certainly embed base64 raster
   images. `next/image` does not optimise SVGs, so the browser downloads all of them on first
   paint (~40 MB for the five desktop icons). Fix: export each folder icon as a **PNG/WebP at
   2× display size** (112×112 for a 56px icon, a few KB each) and let `next/image` serve it,
   or redraw it as a small vector. Delete unused `Folder6–8.svg` after checking with grep.
   Check for embedded rasters with `grep -c "data:image" public/icons/Folder.svg`.
2. **`wallpaper.jpg` (~1.3 MB) is a CSS `background` on `html, body`.** CSS backgrounds bypass
   `next/image`, so there is no resizing or AVIF/WebP. Fix: compress it (target < 300 KB, e.g.
   `npx --yes sharp-cli -i public/wallpaper.jpg -o public/wallpaper.avif -f avif -q 50`) and use
   `image-set()` with AVIF/WebP/JPEG fallbacks, or render it as a fixed
   `<Image fill priority sizes="100vw" placeholder="blur">` behind the desktop.
   `background-attachment: fixed` also janks scrolling on mobile.
3. **BootScreen** hides content for 1.25s on every visit, which directly delays LCP. Show it only
   on the first visit per session (`sessionStorage`), skip it under `prefers-reduced-motion`,
   and keep the real content rendered underneath it so LCP can fire.
4. **Whole page is `"use client"`**, so all content ships as JS and hydrates. Move static content
   to Server Components or data modules (see `nextjs-16-conventions`).
5. **framer-motion** is about 30+ KB gzip. Consider `LazyMotion` + `domAnimation` with `m.` components.
6. **Two icon libraries.** `lucide-react` tree-shakes per icon. Make sure `react-icons` imports
   stay per-family (`react-icons/fa`), never the root package.
7. **System font stack**: no web-font cost, which is good. If a custom font is added, use
   `next/font` (self-hosted, `display: swap`, subset) and never a `<link>` to Google Fonts.

## Image rules

- Always `next/image` for raster images, with explicit `width`/`height` (or `fill` + a sized
  parent) to avoid CLS.
- `priority` only on the single LCP image (profile photo in `Hero`).
- Give `sizes` whenever the rendered width is responsive.
- Source photos: ≤ 2× the largest display size. A 256px avatar needs a ~512px source, not 4000px.

## Measure

```bash
npm run build          # read the route table: First Load JS should stay well under ~150 KB
npm start &            # always measure the production build, never dev
npx --yes lighthouse http://localhost:3000 --preset=desktop --view
npx --yes lighthouse http://localhost:3000 --form-factor=mobile --screenEmulation.mobile --view
```
- Watch the Network panel with "Disable cache" + "Fast 4G" throttling: total transfer size, and
  what the LCP element is.
- For live field data after deploy: PageSpeed Insights (https://pagespeed.web.dev) or Vercel
  Speed Insights.
- Bundle breakdown: `node_modules/next/dist/docs/01-app/02-guides/package-bundling.md`.

## Report format

A table of issue → measured cost (KB or ms) → fix → expected gain, ordered by gain. Re-measure
after fixing and report before/after numbers, not guesses.
