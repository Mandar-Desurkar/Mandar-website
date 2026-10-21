---
name: web-security
description: Security and privacy hardening for the portfolio, covering HTTP security headers and CSP, contact-form/server-action safety, environment variables and secrets, external links, dependency vulnerabilities, and protecting personal contact info from scrapers. Use when adding forms, API routes, third-party scripts/analytics, env vars, or next.config headers, or before deploying.
---

# Web security and privacy

A static portfolio has a small attack surface, but it is still a public site under your name.
The realistic risks are spam and scraping of personal data, a contact form abused for spam or
injection, leaked API keys, and missing headers that fail security scanners recruiters
sometimes run.

## 1. Security headers (`next.config.ts`)

Add an `async headers()` returning, for `source: '/(.*)'`:

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-Frame-Options` | `DENY` (or CSP `frame-ancestors 'none'`) |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), browsing-topics=()` |

Also set `poweredByHeader: false`. For a Content-Security-Policy, follow
`node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md` (nonce via `proxy.ts`
in v16, since `middleware.ts` is deprecated). Start in `Content-Security-Policy-Report-Only`
and tighten once nothing breaks. Verify with `curl -sI <url>` and https://securityheaders.com.

## 2. Personal data exposure

- The email and phone number are in plain HTML in `Contact.tsx`, so scrapers will harvest them.
  Options: drop the phone number (recruiters email first), replace mailto with a contact form,
  or at least assemble the address client-side.
- Don't publish a home address, date of birth, or anything usable for account recovery.
- `public/` is fully public. Never put a resume with a phone number or address there unless that is
  intended, and strip EXIF/GPS from photos (`exiftool -all= public/*.jpg`).

## 3. `NoInspect.tsx` is not security

Blocking right-click, DevTools shortcuts, copy, and "screenshots" protects nothing: View Source,
curl, and the phone's screenshot button all still work. It does break legitimate use (copying the
email, accessibility tools, recruiters saving notes) and the `alert()` popups look hostile.
Recommend removing it, or at minimum stop blocking copy. Never treat it as a reason something
is "protected".

## 4. Contact form / Server Actions (if added)

- Validate every field **on the server** with a schema (e.g. `zod`); limit lengths; reject
  unexpected fields. Client validation is UX only.
- Spam control: a honeypot field + time-to-submit check, then Cloudflare Turnstile or hCaptcha
  if spam continues. Rate-limit by IP (e.g. Upstash Ratelimit on Vercel).
- Send email via a provider API (Resend, Postmark) with the key in a **server-only** env var.
  Never interpolate user input into email headers (header injection); escape it when rendering HTML.
- Return generic errors to the client; log details server-side.
- Read `node_modules/next/dist/docs/01-app/02-guides/server-actions.md` and `data-security.md`.

## 5. Secrets and environment variables

- Only `NEXT_PUBLIC_*` variables reach the browser, so never prefix a secret with it.
- `.env*.local` stays git-ignored (check `.gitignore`). Before committing:
  `git diff --cached | grep -iE "api[_-]?key|secret|token|password"`.
- Set production values in the hosting dashboard, not in committed files.

## 6. Links and third-party code

- Every `target="_blank"` link gets `rel="noopener noreferrer"`.
  Check: `grep -rn 'target="_blank"' src/ | grep -v noopener`
- `window.open(url, '_blank')` (used in `Dock.tsx`) should pass `'noopener,noreferrer'` as the third argument.
- Load third-party scripts (analytics) with `next/script` and add their domains to the CSP.
  Prefer privacy-friendly analytics (Vercel Analytics, Plausible) and no cookie banner is needed.

## 7. Dependencies

```bash
npm audit --omit=dev       # fix high/critical; don't blindly `npm audit fix --force`
npm outdated               # keep next / react on patched minors
```
