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
| 2026-10-21 | Music autoplays muted, never with sound | Unexpected sound is the top complaint about portfolio audio (recruiters open links at work), and browsers only allow muted autoplay |
| 2026-10-21 | Music lives in a desktop widget, not the menu bar | Owner's call: a visible widget is discoverable at a glance, while a menu-bar icon hid the player behind a click. Matches macOS Sonoma desktop widgets |
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
- [ ] **Resume:** export the PDF from Overleaf to `public/resume.pdf` (the hero button is built and appears automatically; fix the stray `z` in the LaTeX first); put the
      deployed site URL into the resume's `YOUR-PORTFOLIO-LINK` placeholder.
- [x] **Music licensing → decided 2026-10-21: local only.** The Jailer 2 songs and covers are
      git-ignored (`/public/music/one-sun-one-moon.*`, `/public/music/ala-bolelo.*`) and marked
      `localOnly` in `src/data/music.ts`, so production builds list only `track.mp3` (verified:
      the prod build plays "Desktop Lo-fi" muted; the widget doesn't disappear).
- (history) **Music licensing (was open):** `one-sun-one-moon.mp3` and `ala-bolelo.mp3`
      (Jailer 2, Sun Pictures / Anirudh) are commercial songs, ripped from YouTube. Hosting it on a public
      site without a license is copyright infringement and can trigger a takedown notice to
      the host. Options: keep it for local use only, replace it with a licensed or
      royalty-free track, or link to the official YouTube/Spotify release instead.
- [ ] **Music:** `public/music/track.mp3` is an original synthesized placeholder loop
      ("Desktop Lo-fi", 49s, 770 KB). Swap in the owner's chosen owned or royalty-free track
      (~128 kbps, < 4 MB) and update the title and artist in `src/data/music.ts`.
- [x] **Hero CTAs** now open the Projects / Contact windows via `setActiveTab` (2026-10-21).
- [ ] **SEO:** add `metadataBase`, OG image, `sitemap.ts`, `robots.ts`, `icon.png`, JSON-LD.
      Only the active tab is in server HTML, so other sections aren't crawlable.
- [ ] **A11y:** desktop icons/dock items are clickable `div`s (no keyboard access);
      no reduced-motion handling.
- [ ] **Security/UX:** `NoInspect.tsx` blocks copy (including the email); `Dock.tsx`
      `window.open` lacks `noopener`.
- [ ] Add `src/app/not-found.tsx` (OS-themed 404).
- [ ] Push `prod` and `dev` to origin. Committed locally on 2026-10-21; the push was rejected (403)
      because git was signed in as `mandar-desurkar3`, not the repo owner `Mandar-Desurkar`.

## Kissan Sampurna interactive prototype

- **Reference repo:** `kissansampurna-org/kissansampurna-app`, shallow-cloned for **read-only
  design reference** (an Expo / React Native app in JSX): `dev` → `_external/kissansampurna-app/`,
  `prod` → `_external/kissansampurna-app-prod/`.
- **Source per flow (owner's choice, 2026-10-21):** AI Crop Doctor from **prod**; Crop Guide and
  Farm Monitoring from **dev**. Diffing prod vs dev showed the Crop Doctor screens, components,
  theme, assets and en.json copy are identical. Only `disease-report-rv2.jsx` differs, and only
  in navigation targets. Prod's 2nd tab is named `crop-advisor` (dev: `crop-guide`). It's excluded from git (`.gitignore`), TypeScript (`tsconfig` exclude) and ESLint.
  Never run its scripts or install its deps. Delete the folder whenever you like; nothing
  imports it.
- **What ships:** a web recreation of the app screens built from its real tokens (`#004691`,
  CTA `#01438A`, lime `#D3D800`), Lato font (OFL, self-hosted via `next/font/local` in
  `src/components/prototype/fonts/`), English copy from `en.json`, and copied assets in
  `public/prototypes/kissan-sampurna/` (~1 MB, loaded only when opened).
- **Code:** `PrototypeViewer.tsx` (a macOS window with a flow sidebar, PM note per screen,
  and a scaled iPhone frame; ←/→/Esc; analytics `Opened / Viewed Prototype Screen / Closed
  Prototype`), `kissan/KissanScreens.tsx` + `kissan.module.css` (the screens),
  `KissanPrototype.tsx` (loaded on demand via `next/dynamic`). Content and PM notes live in
  `src/data/prototypes/kissanSampurna.ts`. Opened from the Experience group title ("▶ View app
  prototype") and the Projects card.
- **Flow 1 built (2026-10-21): AI Crop Doctor**: Crop Doctor → Select crop → Scan method →
  Analyzing (auto-advances) → Diagnosis report (Brown Spot / Rice, from the repo's
  `diseaseReportMock.js`, no internal IDs). Verified in headless Chrome with screenshots.
- **Gotcha:** `globals.css` forces the system font with `!important` on `*`, so the phone
  content re-applies Lato with `!important` in `PrototypeViewer.module.css`.
- **Flows 2–3 built (2026-10-21, from dev):** **Crop Guide**: season → water source
  (multi-select) → budget per acre → recommendation report (TOP PICK Wheat, 94% match, 5/5 fit
  checks, top-5 comparison) in `kissan/CropGuideScreens.tsx`. **Farm Monitoring**: mark your farm
  → draw boundary (animated pins) → setup complete → satellite report (Needs Attention, Growth /
  Water / Food zones, Do This cards with Mark as done / read aloud, vitals, crop stage + confirm)
  in `kissan/FarmMonitoringScreens.tsx`. Shared styles live in `kissan/kissanFlows.module.css`.
  Report values are illustrative and labelled "Sample values" in the PM notes.
- **Cross-flow links:** screens get `goToFlow(flowId, screenId?)`. Crop Guide "Go to my farm" →
  Farm Monitoring; farm report "Scan with Crop Doctor" → Crop Doctor (analytics method
  `cross_flow`).
- **Map gotcha:** `fm-farm-illustration.webp` has its own red outline baked in (x≈458–650), so
  the map and satellite views frame a clean region (viewBox x≈764–1087) via SVG `<image>`. The
  boundary `FIELD` points are traced in the image's own pixel coordinates; zones are clipped to it.
- **Still to build:** Free trial → Subscription (paywall, 2.4%→8% story) and Onboarding (13
  languages).
- [ ] **Confidentiality:** confirm Silo Fortune is OK with showing these screens and assets
  publicly before deploying.

## Gau Sampurna interactive prototype

- **Reference repo:** `silo-prod/gausampurna-react-app`, `prod` branch, shallow-cloned read-only to
  `_external/gausampurna-app-prod/` (git/tsc/eslint ignore it). It contains Firebase config files
  (`google-services.json`, `GoogleService-Info.plist`); never copy them anywhere.
- **Same brand system** as Kissan (`#004691`, lime `#D3D800`, text `#231F20`, Lato headings),
  so it reuses `PrototypeViewer` and the self-hosted Lato.
- **Flows (2026-10-21):** *AI Disease Check*: Scan hub (Gowri, "Cow unwell or Off-feed?") →
  photo guide (side profile + tips) → analyzing (live steps) → Report Ready "1/31 conditions" →
  diagnosis (CLEAR / NEEDS VET indicators, warning signs, free vet helpline). *Animal Status &
  Value*: hub → body photo guide (udder tip) → analyzing → status report (Grade A2 purity scale,
  BCS, milk capacity, est. market value ₹78–86k + buying rec, health checks, daily ration). Prod
  screens **31 diseases from one side photo** (resume says 20+, so consider updating).
- **Code:** `src/data/prototypes/gauSampurna.ts`, `src/components/prototype/gau/GauScreens.tsx` +
  `gau.module.css`, `src/components/prototype/GauPrototype.tsx` (next/dynamic). Assets resized
  from ~10 MB to 412 KB in `public/prototypes/gau-sampurna/`. Report values are illustrative.
- **Hero card:** Gau now uses the official app icon (prod `app.json` → `assets/icons/app-icon.png`
  → `public/apps/gau-sampurna-icon.png`) and an active **Try app**. The website logo version was
  removed.
- **Fix:** children of scrolling flex columns had `flex-shrink: 1`, so the photo box collapsed to
  0 and the last card got squeezed. Set `flex-shrink: 0` (also applied to the Kissan flows).
- [ ] Experience's "Kissan & Gau Sampurna" group still opens only the Kissan prototype; consider a
  second pill for Gau.

## Analytics

- **Amplitude** (`@amplitude/unified@^1`, 1.1.43), initialized once in
  `src/instrumentation-client.ts` (Next.js runs it on the client before hydration) via
  `initAll` with autocapture and **session replay at 100%**. The API key is hardcoded there
  (public ingestion key; the repo has no env system yet). Move it to `NEXT_PUBLIC_AMPLITUDE_API_KEY`
  with a missing-key guard when environments are set up.
- Only explicit event: **`Viewed Home Page`** (fires on load, carries `prompt_version: 'BA400.4'`,
  which is safe to remove once verified). For more events use `npx @amplitude/wizard` or the
  Amplitude MCP; don't invent a taxonomy.
- Cost: the Amplitude chunk is about **186 KB gzipped** (autocapture + session-replay recorder)
  and loads before the app is interactive. Revisit if Lighthouse scores drop. Session replay
  records every visit, so consider a short privacy note on the site.
- [ ] Owner to confirm on the Amplitude Setup page: checklist flips **and** `Viewed Home Page`
  appears in the live event feed.
- No AI/LLM code in the repo, so Agent Analytics was skipped.
- **Full tracking plan** (owner request, 2026-10-21) lives in `src/lib/analytics.ts`, typed
  via `trackEvent(name, props)`. Add new events there first. 33 explicit events cover: boot
  funnel; `Opened Section` (section + source: desktop_icon / menu_bar / system_menu / hero_cta /
  notification); `Left Section` dwell time (switched / closed / minimized / page_hidden); window
  chrome (close / minimize / maximize / restore / move / resize); `Clicked Contact Method`
  (email / linkedin / phone, the north star); external links; music (played with trigger, paused,
  muted/unmuted, skipped, restarted, seeked, finished, notes, load errors); hiring notification
  (viewed / clicked / dismissed); `Hit Content Protection` (evidence on whether `NoInspect`
  frustrates real visitors). `Dock.tsx` isn't rendered, so it isn't instrumented.
- All section opens go through `openSection()` in `WindowContext`. This also fixed a bug where
  menu bar links didn't reopen a closed window.

## Feature ideas roadmap (proposed 2026-10-21, not yet approved)

Goal: turn visits into interviews. North star = resume downloads + "Send a memo" clicks per visitor.

- **Now:** ~~analytics~~ (Amplitude added 2026-10-21); resume PDF + "Hire me" CTA; 2–3 case studies (Sampurna freemium funnel 2.4→8%,
  CRM routing, Rider app) as a `PRD.app` / Notes window; fix the
  40 MB of SVG icons; remove `NoInspect` (blocks copying the email).
- **Next:** working Spotlight (⌘K command palette, using the existing search icon);
  ~~one-time "Open to PM roles" notification~~ (built 2026-10-21); `Changelog.app` (the portfolio's release notes);
  `Field Notes` (farm-visit photos and user quotes); a Swimming → PM story in Beyond Work; make
  the fake tray icons functional (Control Center → dark mode / wallpaper; battery → "Open to work").
- **Later:** site-wide "PM annotations" toggle; `Terminal.app` easter egg (`whoami`,
  `open resume`); an interactive RICE "prioritize this backlog" game; a live public metrics
  dashboard of the portfolio's own analytics; product teardowns.
- **Guardrails:** each addition must keep resume/contact one click away, stay fast, and degrade
  to a simple layout on mobile. No fake metrics.

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
- 2026-10-21: Fixed the About window overflow. The hero now uses the short `profile.intro`
  (keep it ≤ ~3 lines / ~190 chars) instead of the full resume `summary`; KPI cards
  top-align and the label is shortened to "Monthly Sales", so values line up. Uncommitted.
- 2026-10-21: About window polish. Height 70vh → 78vh (owner's preferred size; still capped
  at `100vh - 84px`). Intro rewritten in first person, naming the current role and company.
  KPI label "Trial Uplift" (fits on one line). Hero buttons are real buttons that open the
  Projects / Contact windows ("Open Projects.app", "Send a memo"). Photo alt text includes the
  role. Uncommitted.
- 2026-10-21: About window default size is now **65vw × 64vh**, the owner's preferred layout
  from a screenshot: "I'm a product builder." on one line and no empty space below the CTAs.
  On short screens the content scrolls inside the window. Uncommitted.
- 2026-10-21: Added a menu-bar music player (`MusicPlayer.tsx`, config in
  `src/data/music.ts`) in the system tray. It autoplays **muted** and looping 2s after load
  (after the boot screen), with one-click Unmute in a macOS-style Now Playing popover.
  `preload="none"` means no bytes are fetched before then. A visitor who pauses is remembered
  in localStorage. Supports Media Session (media keys / lock screen), Esc and outside-click
  close, and reduced motion. It hides in production if the track file is missing. Uncommitted.
- 2026-10-21: Moved the music player out of the menu bar into a **macOS-style desktop widget**
  (top-left, 232px, z-index 5 so windows cover it; rendered in `page.tsx`). Hidden below 768px
  and does not stream there. Added the placeholder track. Music hadn't played before because
  no file existed. Contact window: 55vw × 68vh (was 50 × 60) plus side padding so the tilted
  dashed card and the "SYSTEM HALTED" footer are no longer clipped. Uncommitted.
- 2026-10-21: Restyled the widget to match the macOS **small Music widget** (owner's reference
  screenshot): 170px card with cover top-left, bold title, "Artist • Album" subtitle and solid
  ◀◀ ❚❚ ▶▶ controls. The heart slot is the mute toggle, blue while muted for discoverability.
  The progress bar was removed. `src/data/music.ts` is now a `tracks` playlist: ◀◀ restarts the
  song (or goes to the previous track within its first 3s), ▶▶ goes to the next track and
  restarts when there's only one. Media keys support previous/next. Uncommitted.
- 2026-10-21: Added "One Sun One Moon" (Anirudh, Jailer 2) as track 1, with the placeholder
  loop as track 2. The embedded 1280px art was stripped from the MP3 (3.07 MB → 1.73 MB, full
  3:36 kept) and saved as a cropped 512px square cover `one-sun-one-moon.jpg` (54 KB).
  Licensing flagged in the backlog. Uncommitted.
- 2026-10-21: Design pass on the widget to make it feel native rather than "vibe coded".
  Custom SF Symbols-style SVG controls replace lucide's puffy filled icons. The mute toggle is
  a plain speaker glyph, Apple Music red while muted (no blue circle). Apple type scale: title
  15/600, subtitle 13/400 in secondary label grey. Widget glass rgba(255,255,255,.86) with a
  hairline edge and layered shadow, fixed 170×170, controls pinned to the bottom. The cover is
  re-cropped to a clean square of the song title (no stray "10M views"). Verified with a
  headless-Chrome render of the real CSS. Tip: screenshotting the live dev page headless only
  captures the boot screen, so render a standalone preview instead.
- 2026-10-21: Interaction design and product thinking for the widget (now 170×212).
  **Scrubbable progress bar**: elapsed / `-remaining` times, click or drag to seek, thickens
  with a knob on hover, `role="slider"` with arrow keys ±5s and Home/End. **Micro-interactions**:
  the cover shrinks when paused (Apple Music cue), volume fades in on unmute (400ms) and out
  on pause (200ms), play/pause icons morph, buttons press, the cover slides on track change,
  and the widget fades in after boot. All motion respects `MotionConfig reducedMotion="user"`.
  **Product personality**: while muted the subtitle reads "Muted for you · Why?". "Why?" or ⓘ
  flips the widget to **Product notes** (`playerNotes` in `src/data/music.ts`), with Esc/Done
  to return and focus managed. Copy note: "Muted on purpose / by design · Why?" truncated
  "Why?" at 170px, so the layout now keeps "Why?" from shrinking and the label is shortened.
  2026-10-21 follow-up: the owner removed the "Muted… · Why?" subtitle for a cleaner layout.
  The subtitle always shows "Artist • Album"; muted state is signalled by the red speaker
  icon alone, and Product notes open only via the ⓘ button (now a quieter grey than the
  speaker).
  2026-10-21: Added `HiringNotification.tsx`, a macOS-style banner ("📬 Open to PM roles",
  CTA **"Let's talk"** → Contact; copy in `hiringNudge` in `src/data/resume.ts`). It appears
  20s into a first visit, once per visitor (localStorage `hiring-nudge-seen`, set when shown).
  It's skipped if Contact was already opened, waits for the tab to be visible, auto-dismisses
  after 12s (paused on hover/focus), sits at z-index 10001, and is full width on phones.
  2026-10-21: Hero CTAs reworked for Indian recruiter behaviour. Primary is **View Resume**
  (recruiters ask for the CV first and forward it on WhatsApp/email or upload it to an ATS;
  "view" in a new tab asks less than "download"). Secondary is **Connect on LinkedIn** (India's
  default professional channel, a low-commitment action). "Open Projects.app" was removed
  because the hero's job is conversion and projects are one click away elsewhere. Until
  `public/resume.pdf` exists (a HEAD check on mount), the hero shows **Connect on LinkedIn** +
  **Get in touch**. Events: `Opened Resume`, `Clicked Contact Method` with `placement: "hero"`.
  2026-10-21: Hero intro rewritten for impact: "Associate PM at **Silo Fortune**. I've shipped
  **5 products from 0→1**, from AI that diagnoses crop and cattle disease in one photo to a
  sales CRM and delivery stack." It leads with role and company, uses a concrete 0→1 count
  (Kissan, Gau, CRM, rider app + ERP, AltQube) and a vivid AI example, and doesn't repeat the
  KPI cards. Measured at the real ~490px column: 3 lines. Bold via `RichText`; non-breaking
  space keeps "5 products" together.
  2026-10-21: The owner preferred the previous hero intro, so it's restored ("I take
  AI-powered products from 0→1…").
  2026-10-21: **Music player bugs found by real-browser testing** (puppeteer-core + system
  Chrome, scripts in the session scratchpad):
  (1) Crash: `onLoadedMetadata` read `e.currentTarget` inside a functional setState; React
  nulls it by then, so "Cannot read properties of null (reading 'duration')" unmounted the
  widget. Fixed by reading the value first.
  (2) Next/Previous loaded but never played: `goTo` set `audio.src` by hand, then React
  re-assigned `src` and aborted `play()`. Now React owns `src` and playback starts in an
  effect via `useEffectEvent` after the index changes.
  (3) Muted autoplay never worked: Chrome only exempts **`<video>`** from the autoplay policy,
  not muted `<audio>` (NotAllowedError 5/5 runs). The player now uses a hidden `<video>`
  (1px, opacity 0, not display:none) and autoplay succeeds 5/5. Safety net: if `play()` is
  still blocked, it starts muted on the first pointerdown/keydown (trigger
  `first_interaction`), verified with a simulated blocking browser.
  Verified flows: autoplay muted, unmute, pause/play, next, previous, auto-advance at end,
  product notes + Esc, Amplitude events decoded from gzipped payloads.
  2026-10-21: Widget moved to `top: 84px` so its top edge aligns with the open window's top
  (measured 84px at 1512×860, 1440×780 and 1920×1000). Added **"Ala Bolelo"** (Anirudh, Jailer 2)
  as track 2; the playlist is One Sun One Moon → Ala Bolelo → Desktop Lo-fi. Audio stripped of
  embedded art (3.9 → 1.9 MB, full 4:01). Cover `ala-bolelo.jpg` is a square crop of the singer
  with the title band behind (the title crosses her eyes, so it can't be avoided).
  **KPI count-up**: `CountUp` in `Hero.tsx` uses framer `animate`, 0.7s ease-out, 0.1s stagger,
  starting as the cards appear. Decimals only while counting, so 3× and ₹1 Cr+ visibly tick.
  Final values sit in an `srOnly` span for screen readers; reduced motion shows the final
  values immediately. `kpis` data now has `{prefix, value, suffix, decimals, label}`.
  All verified in headless Chrome.
  2026-10-21: Built the Kissan Sampurna interactive prototype (flow 1, AI Crop Doctor). See the
  "Kissan Sampurna interactive prototype" section.
  2026-10-21: Prototype now uses the prod design for Crop Doctor (verified identical) and adds
  the Crop Guide and Farm Monitoring flows from dev, with cross-flow links.
  2026-10-21: **"Apps I've built" shelf** under the hero photo (data: `shippedApps` in
  `src/data/resume.ts`). Kissan Sampurna uses the official prod icon (`app.json` →
  `assets/logo/new_logo.png`, copied to `public/apps/kissan-sampurna.webp`) with a ▶ badge and
  opens the prototype (`Opened Prototype`, placement `hero`). Gau Sampurna is a muted dashed
  "SOON" placeholder: add `icon` + `prototype` to make it live. Sized so the About window still
  fits without scrolling at 1512×860 (right column 404px ≤ left 414px).
  Redesigned the same day into **App Store-style rows** (icon · name · "caption · Website ↗" ·
  GET-style pill) after the home-screen grid's chips collided. Kissan: **▶ Try it** (prototype)
  plus a link to **kissansampurna.com**. Gau Sampurna: official logo (downloaded from
  gausampurna.com `/icons/Logo.png`, padded to a square to match Kissan's badge scale →
  `public/apps/gau-sampurna.png`) with **Visit ↗** to **gausampurna.com**; add `prototype` to
  make it a Try-it row. Website clicks are tracked as `Clicked External Link`
  (`link_type: app_website`, `placement: hero_icon | hero_chip`). Right column 410px ≤ left 414px.
  Owner feedback: app vs website CTAs were confusing, so it's now **two equal cards** (one per
  app), each with the SAME two CTAs in the same order: **📱 Try app** (solid blue = in-site
  prototype) on top and **🌐 Website ↗** (outline + ↗ = external) below. A missing prototype
  shows a dashed, disabled **App · soon**. Names wrap to two lines; the caption lives in the card
  tooltip and a screen-reader span. The grid uses `repeat(2, minmax(0, 1fr))` (with plain 1fr,
  the unwrapped name pushed a card past the window edge). The polaroid's bottom border is
  40→32px to keep the About window from scrolling (right 411px ≤ left 414px).
- [ ] Pre-existing: on shorter screens (e.g. 1440×780) the About text column alone (505px) is
  taller than the 64vh window, so the window scrolls. Consider a min height for About.
  2026-10-21: Added the Gau Sampurna prototype (prod branch). See its section.
  2026-10-21: Committed all work since 44e86cd to `prod` and fast-forwarded `dev` (local; push
  still needs the GitHub account switch to Mandar-Desurkar). Fixed preflight's `_blank`/noopener
  check to handle multi-line JSX.
  Next idea (not built): a site-wide "PM annotations" toggle showing the reasoning behind other
  design decisions.
- 2026-10-21: Committed everything (Claude setup + UI/content) on `prod`, fast-forwarded
  `dev` locally. Push pending a GitHub account switch.
