---
name: ship-check
description: Pre-deploy release gate for the portfolio. Runs typecheck, lint, production build, placeholder/link/secret scans and asset-weight checks, then walks the launch checklist (SEO, a11y, performance, security, content) and deployment to Vercel. Use when the user says ship, deploy, release, go live, launch, "is it ready", or before merging to main/prod.
argument-hint: "[--skip-build]"
---

# Ship check

Run this before every deploy. It is a gate: report each item as PASS / FAIL / WARN and do
not call the site "ready" while any FAIL remains.

## 1. Automated preflight

```bash
bash .claude/skills/ship-check/scripts/preflight.sh
```
It runs, in order: `tsc --noEmit`, `npm run lint`, `npm run build`, scans for placeholder
links/TODOs/lorem/console.log, unsafe `target="_blank"`, likely secrets, heavy assets in
`public/`, and missing SEO files. It exits non-zero if a hard check fails.
Pass `--skip-build` for a quick re-check after small fixes.

## 2. Manual launch checklist

Use the matching skill for depth; here just confirm the outcome.

**Content** (`portfolio-content`)
- [ ] No placeholder projects/links; every metric is real
- [ ] Resume link works; contact CTA is obvious

**SEO and sharing** (`seo-and-social-sharing`)
- [ ] `metadataBase`, title, description, OG image, `sitemap.ts`, `robots.ts`, icons, JSON-LD
- [ ] Link preview checked in LinkedIn Post Inspector after deploy

**Accessibility** (`accessibility-audit`)
- [ ] Every section, dock item and popup reachable and operable by keyboard alone
- [ ] axe: 0 serious/critical issues; reduced motion respected

**Performance** (`performance-audit`)
- [ ] Lighthouse mobile ≥ 90 Performance on the production build
- [ ] No asset in `public/` over ~300 KB that loads on first paint

**Responsive** (`responsive-design`)
- [ ] 375 / 768 / 1280 / 1920 px: no horizontal scroll, nothing hidden behind dock/menu bar

**Security** (`web-security`)
- [ ] Security headers set; `npm audit --omit=dev` has no high/critical issues
- [ ] No secrets in the repo; personal info exposure is deliberate

**Runtime**
- [ ] `npm start` → browser console has no errors or hydration warnings
- [ ] Custom `not-found.tsx` exists (a branded 404 fits the OS theme, e.g. "File not found")

## 3. Deploy (confirm with the user first; this is outward-facing)

Recommended host: **Vercel** (zero-config for Next.js 16).
1. Make sure the working tree is committed. Never deploy uncommitted work.
2. Branch flow in this repo: work lands on `main`, and `prod` is the release branch. Ask which
   branch the host deploys from before merging or pushing.
3. Set `NEXT_PUBLIC_SITE_URL` (used by `metadataBase`/sitemap) in the Vercel project env.
4. Connect the custom domain; enforce HTTPS and pick one canonical host (apex or `www`, redirect
   the other).
5. After deploy: open the live URL on desktop and phone, re-run Lighthouse against it, check
   `/robots.txt` and `/sitemap.xml`, test the OG preview, and submit the sitemap to Google
   Search Console.
6. Optional: enable Vercel Analytics and Speed Insights for real-user Core Web Vitals.

## Report

End with a short table of every check and its status, the FAIL items with file:line and a
proposed fix, and an explicit verdict: **Ready to ship** or **Blocked by N issues**.
