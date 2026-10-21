---
name: seo-and-social-sharing
description: Make the portfolio discoverable and look good when shared. Use for anything about SEO, search ranking, Google indexing, page title/description, Open Graph / Twitter / LinkedIn link previews, OG images, favicons, sitemap.xml, robots.txt, canonical URLs, or structured data (JSON-LD Person schema).
---

# SEO and social sharing

For a personal portfolio the goals are: rank #1 for the owner's name, show a strong preview
card when the link is pasted into LinkedIn/Slack/WhatsApp/X, and give recruiters a correct
title and summary in search results.

Read `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md`
before editing. Metadata exports only work in Server Components, so they go in
`src/app/layout.tsx`, never in the `"use client"` `page.tsx`.

## Known gap in this site

`page.tsx` renders only the **active tab** (default `about`). Experience, Projects, Education
and Contact are not in the server HTML, so crawlers never see them. Pick one fix:

- **Preferred:** move each section's content into a plain data module (`src/data/*.ts`) and
  render a visually hidden, crawlable summary (or `<noscript>` fallback) in a Server Component.
  Alternatively, render all sections and hide inactive ones with CSS rather than unmounting them.
- At minimum, put the key facts (role, companies, flagship projects) into the `description`
  and the JSON-LD below.

## Checklist

### 1. Root metadata (`src/app/layout.tsx`)
```ts
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://<domain>'),
  title: { default: 'Mandar Desurkar | Product Manager', template: '%s | Mandar Desurkar' },
  description: '<= 155 chars, includes name + role + 1 differentiator>',
  alternates: { canonical: '/' },
  openGraph: { type: 'profile', url: '/', siteName: 'Mandar Desurkar', locale: 'en_US' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};
```
- Lead the title with the person's name; recruiters search the name.
- Without `metadataBase`, OG image URLs are relative and previews break.

### 2. OG image
Add `src/app/opengraph-image.tsx` (generated with `ImageResponse` from `next/og`; export
`alt`, `size = { width: 1200, height: 630 }`, `contentType = 'image/png'`) **or** a static
`src/app/opengraph-image.png` at 1200×630. Use the desktop/wallpaper look with name and title
in large text, and keep the important content inside the centre 1000×500 because LinkedIn crops.
Add `twitter-image` the same way, or rely on the OG fallback.

### 3. `src/app/sitemap.ts` and `src/app/robots.ts`
Return `MetadataRoute.Sitemap` / `MetadataRoute.Robots`. Robots should allow `/` and point
`sitemap` at `${siteUrl}/sitemap.xml`. Docs:
`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/`.

### 4. Icons
Replace the default Next `favicon.ico`. Add `src/app/icon.png` (512×512) and
`src/app/apple-icon.png` (180×180). Next wires them up automatically.

### 5. JSON-LD Person schema
Render it in `layout.tsx` (see `node_modules/next/dist/docs/01-app/02-guides/json-ld.md`):
```tsx
<script type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c') }} />
```
Include `@type: Person`, `name`, `jobTitle`, `url`, `image`, `sameAs` (LinkedIn, GitHub),
`alumniOf`, `worksFor`. Keep it consistent with the visible content.

### 6. Semantics
- Exactly one `<h1>` on the initial render (the name, in `Hero`). Sections use `<h2>`.
- Meaningful `alt` on the profile photo ("Mandar Desurkar, product manager"), not "image".
- Descriptive link text: not "click here", and no icon-only links without `aria-label`.

## Verify
```bash
npm run build && npm start
curl -s localhost:3000 | grep -Eo '<(title|meta|link)[^>]*>' | head -40
curl -s localhost:3000/robots.txt; curl -s localhost:3000/sitemap.xml
```
After deploying, test the preview with LinkedIn Post Inspector
(https://www.linkedin.com/post-inspector/) and https://opengraph.xyz, and validate the
structured data with https://search.google.com/test/rich-results. Then submit the sitemap in
Google Search Console.
