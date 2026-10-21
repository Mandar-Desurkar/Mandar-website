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
- Mobile: phones and touch tablets get a full-width sheet + dock and an edge-to-edge prototype
  viewer (see "Mobile & responsive layout").
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
| 2026-10-21 | Phones and touch tablets get their own layout (full-width window sheet + iOS-style dock), not a shrunken desktop | Most visits come from LinkedIn on a phone; drag, resize and double-click are mouse interactions |
| 2026-10-21 | Sections size to their window with container queries (`@container window`), not the viewport | The window is a fraction of the screen on desktop, so viewport queries clipped the hero at ~1024px |
| 2026-10-21 | On phones the prototype app fills the screen edge to edge (no iPhone mock) with bars + bottom sheets | The visitor's phone is the device; a phone-in-a-phone mock was unreadable |

## Backlog (from the first `ship-check` run, 2026-10-21)

- [x] **Perf (2026-10-21):** the 8 folder SVGs (~48 MB, raster inside SVG) were replaced by five
      ~1.8 KB WebPs (`public/icons/folder*.webp`, rendered from the SVGs in headless Chrome), so
      `public/` went 48.8 MB → 11 MB. Phones get a 17 KB `wallpaper-mobile.webp` instead of the
      1.3 MB `wallpaper.jpg`. Still open: compress `wallpaper.jpg` for desktop; delete the default
      Next SVGs.
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
- [x] Pushed `prod` and `dev` to origin (2026-10-21) using the Mandar-Desurkar account.

## Mobile & responsive layout (2026-10-21)

- **One "phone layout" query**, used by the structural CSS and by `src/hooks/useIsMobile.ts`:
  `(max-width: 767.98px), (max-width: 1023.98px) and (pointer: coarse), (max-height: 500px) and
  (pointer: coarse)`, i.e. phones, touch tablets in portrait, and phones in landscape. Keep JS and
  CSS identical if it changes (globals.css, `MobileDock`, `DesktopIcon` modules).
- **Phone layout:** `DraggableWindow` renders a fixed full-width sheet (`.mobile-window`, top 40px,
  above the dock; no drag/resize; only the red Close, with a 44px touch target). `MobileDock.tsx` is an
  iOS-style dock with the five sections (re-tapping the open one scrolls it to top). With the window
  closed the folders form a 4-column home screen. Desktop icons open with one tap on any touch screen
  and are keyboard-accessible.
- **Sections use container queries** on the window (`.window-content-scroll { container: window /
  inline-size }`): `< 600px` phone tuning, `≥ 600px` desktop padding and row CTAs, `≥ 800px`
  side-by-side hero, Projects 2/3 columns at `640/960px`. The hero shows a compact "identity row"
  (small polaroid + Apps I've built) below 800px so the headline, KPIs and CTA are in the first screen.
- **Music widget:** only on mouse screens ≥ 1100px (it collided with the centred window below that);
  nothing streams where it's hidden.
- **Prototype viewer on phones:** `PrototypeMobile.tsx` (state stays in `PrototypeViewer`). App screen
  edge to edge (no fake status bar or bezel), scaled down below 375px wide, capped at 430px and shown
  as a rounded card on tablets. Top bar: close · app/flow · flows; bottom bar: ‹ · "n / N title, PM
  note" · › (continues into the next/previous flow). Bottom sheets for PM notes (screen chips, restart)
  and flows (Kissan/Gau switch, every screen). One-time coach mark (localStorage
  `prototype-mobile-hint-seen`). Landscape phones get a "rotate your phone" prompt.
- **Viewport:** `layout.tsx` exports `viewport` with `viewportFit: "cover"` so bars respect safe areas.
- **Verified** (headless Chrome, touch emulation): every Kissan (52) and Gau (76) screen at 375×667,
  site sections at 375×667 and 393×852, viewer at 360×740 and 430×932, landscape 852×393, iPad
  768×1024 / 1024×768, desktop 1024 / 1280 / 1440, plus 320 / 360 / 390 / 430px on a production build
  and all prototype screens at 360×800. No horizontal overflow. Still to do: a check on a real phone
  over the LAN (`npm run dev -- -H 0.0.0.0`) — emulation can't reproduce iOS safe areas or toolbars.

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
- **Code:** `PrototypeViewer.tsx` (redesigned in Figma Presentation Mode with authentic tab strip, document tabs, dropdown title, settings toggle, 1-click flow/screen pills, native macOS traffic light window controls with hover glyphs `✕`/`−`/`＋`, and a scaled iPhone frame; ←/→/Esc; analytics `Opened / Viewed Prototype Screen / Closed
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
- **Still to build:** Kissan onboarding / login (13 languages). The free trial → subscription paywall
  shipped in the coverage pass (flow "Free trial & plan").
- [ ] **Confidentiality:** confirm Silo Fortune is OK with showing these screens and assets
  publicly before deploying.

## Gau Sampurna interactive prototype

- **Reference repo:** `silo-prod/gausampurna-react-app`, `prod` branch, shallow-cloned read-only to
  `_external/gausampurna-app-prod/` (git/tsc/eslint ignore it). It contains Firebase config files
  (`google-services.json`, `GoogleService-Info.plist`); never copy them anywhere.
- **Same brand system** as Kissan (`#004691`, lime `#D3D800`, text `#231F20`, Lato headings),
  so it reuses `PrototypeViewer` and the self-hosted Lato.
- **Coverage (2026-10-21): 13 flows / 76 screens**, every live route in prod (checklist and the
  list of dead routes left out: `docs/prototype-coverage-plan.md`). Flows, in viewer order: Home ·
  AI Disease Check · Animal Status · Market Value · Dung Scan · 360° Health Report (Pro gate) · Scan
  History & Reports · My Herd · Shop & orders · Cattle Trading · Pratham plan (paywall) · Account ·
  Welcome & sign-up. Free-user reports show premium sections frosted with an "Unlock Full Report"
  banner; the 360° report (Pro only) renders unlocked. Prod screens **31 diseases from one side
  photo** (resume says 20+, so consider updating).
- **Code:** one file per area in `src/components/prototype/gau/`: `GauShared.tsx` (tab bar with the
  Reports-tab variant, sheets, alerts, toast, product card), `GauHome`, `GauHerd`, `GauScan` (hub +
  orchestrator steps for all five scan types), `GauReports`, `GauHistory`, `GauPratham`, `GauShop`,
  `GauTrading`, `GauAccount`, `GauWelcome`, each with its own CSS module. Flows and PM notes:
  `src/data/prototypes/gauSampurna.ts`. `GauPrototype.tsx` merges the screen maps. The old
  `GauScreens.tsx` / `gau.module.css` were removed. Assets: `public/prototypes/gau-sampurna/` (1.8 MB,
  99 files; onboarding art downloaded from the app's public S3 bucket). Values are illustrative.
- **Hero card:** Gau now uses the official app icon (prod `app.json` → `assets/icons/app-icon.png`
  → `public/apps/gau-sampurna-icon.png`) and an active **Try app**. The website logo version was
  removed.
- **Fix:** children of scrolling flex columns had `flex-shrink: 1`, so the photo box collapsed to
  0 and the last card got squeezed. Set `flex-shrink: 0` (also applied to the Kissan flows).
- [ ] Experience's "Kissan & Gau Sampurna" group still opens only the Kissan prototype; consider a
  second pill for Gau.
- [ ] Gau sample catalogue: Bio Bloom, Nitro Power and Micro Nutri names/prices were inferred from
  image file names; confirm or replace with real catalogue data.

## Analytics

- **Amplitude** (`@amplitude/unified@^1`, 1.1.43), initialized once in
  `src/instrumentation-client.ts` (Next.js runs it on the client before hydration) via
  `initAll` with autocapture and **session replay at 100%**. The API key is hardcoded there
  (public ingestion key; the repo has no env system yet). Move it to `NEXT_PUBLIC_AMPLITUDE_API_KEY`
  with a missing-key guard when environments are set up.
- Only explicit event: **`Viewed Home Page`** (fires on load, carries `prompt_version: 'BA400.4'`,
  which is safe to remove once verified). For more events use `npx @amplitude/wizard` or the
  Amplitude MCP; don't invent a taxonomy.
- **Firebase Web SDK & Analytics** (`firebase@^13.0.0`):
  - Project ID: `mandar-portfolio`, Measurement ID: `G-JKRX4FZQRD`.
  - Configured in `src/lib/firebase.ts` with env variables in `.env.local` (`NEXT_PUBLIC_FIREBASE_*`) and `.env.example`.
  - Client analytics initialized in `src/instrumentation-client.ts`.
  - Typed tracking plan in `src/lib/analytics.ts` dual-logs every event to both Amplitude and Firebase Analytics in real time.
- Cost: the Amplitude chunk is about **186 KB gzipped** (autocapture + session-replay recorder)
  and loads before the app is interactive. Revisit if Lighthouse scores drop. Session replay
  records every visit, so consider a short privacy note on the site.
- [ ] Owner to confirm on the Amplitude Setup page: checklist flips **and** `Viewed Home Page`
  appears in the live event feed.
- [ ] Owner to verify in Firebase Console that `view_home_page` and incoming events appear in the DebugView / Realtime dashboard.
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
  **Minimal redesign (owner: "clumsy and packed")**: the cards and four bold buttons were replaced by a
  quiet list under the photo (232px, the photo's width): 32px icon, app name, then text links
  📱 **Try app** (blue = in-site prototype) · 🌐 **Website ↗** (grey = external). No borders or
  shadows. The hero keeps one primary CTA (LinkedIn). The polaroid is back to its original 260px /
  40px bottom border. Right column 390px ≤ left 414px.
  **Icon fix (owner: one small, one big)**: Kissan's `new_logo.png` is mostly transparent padding
  (logo = 54% of width) while Gau's filled 81%. Both are now re-rendered the same way: logo cropped
  to its bounds and scaled to **90% width on a white 256px square** →
  `public/apps/kissan-sampurna-icon.png` / `gau-sampurna-icon.png` (old `.webp` deleted). The icon
  slot is 40px (radius 10). Right column 398px ≤ left 414px. Use the same recipe for any new app.
  2026-10-21: **Prototype coverage pass** (owner: "a lot of screens and flows are missing"). Plan and
  checklist: `docs/prototype-coverage-plan.md`. Kissan now has 7 flows / ~60 screens: Home & Weather
  (new, incl. the weather report), AI Crop Doctor (category, request crop, camera + guide, review,
  laser analysis view, full rv2 report, healthy result, history), Crop Guide (both paths from the
  owner's flow chart, all report sections, no-fit, history), Farm Monitoring setup + report
  (My Farms, add-farm questions, draw/walk marking, menu edits, full details, history, no-crop),
  Free trial & plan (3-step paywall + ₹1 trial). Shared UI in `kissan/KissanShared.tsx` (tab bar,
  CustomAlert, sheet). Viewer `ScreenProps` gained `back()` and `go(screenId)` for branches. Fixed a
  hydration error in `Hero.tsx` from the `?prototype=` deep link (now read after mount).
- [ ] Pre-existing: on shorter screens (e.g. 1440×780) the About text column alone (505px) is
  taller than the 64vh window, so the window scrolls. Consider a min height for About.
  2026-10-21: Added the Gau Sampurna prototype (prod branch). See its section.
  2026-10-21: Committed all work since 44e86cd to `prod` and fast-forwarded `dev`, then **pushed
  both to GitHub** (e577dc2). Pushing requires the repo owner account: `gh auth switch --user
  Mandar-Desurkar`, push with `-c credential.helper= -c 'credential.helper=!gh auth
  git-credential'`, then switch back to mandar-desurkar3. Fixed preflight's `_blank`/noopener
  check to handle multi-line JSX.
  Next idea (not built): a site-wide "PM annotations" toggle showing the reasoning behind other
  design decisions.
- 2026-10-21: Committed everything (Claude setup + UI/content) on `prod`, fast-forwarded
  `dev` locally. Push pending a GitHub account switch.
- 2026-10-21: Committed the minimal apps shelf + equal-size app icons on `prod`, fast-forwarded
  `dev`, pushed both to GitHub.
- 2026-10-21: Replaced the prototype viewer with an authentic, minimal **Figma Prototype Presentation UI** based directly on the user's Figma desktop screenshots: top Figma document tab strip (`⌂`, `Kissan Sampurna App - Prototype`, `Gau Sampurna Mobile App`), presentation bar with Figma logo, collapsible sidebar toggle `[| ]`, centered title dropdown (`Kissan Sampurna App ˅`), avatar `MD`, blue `Share prototype` button, clean collapsible `Flows` sidebar with `✓ Active flow` and `Description` PM notes, pure deep-dark canvas (no dot grid, no bottom floating pill), centered iPhone frame, and seamless switching between Kissan and Gau. Removed unnecessary static tabs.
- 2026-10-21: Enhanced prototype sidebar UX: added screen count badges per flow (`5 screens`, etc.), nested list of all screen frames with active blue indicator and direct 1-click switching, plus quick interactive screen selector pills `[1] [2] [3]...` in the Description section.
- 2026-10-21: Polished prototype viewer UI: added macOS traffic light controls (close, minimize, maximize) on the top-left tab strip beside the home icon, eliminated the duplicate `#` in the screen list (`# 1. Crop Doctor`), removed the redundant bottom `< Screen 1 of 5 >` stepper in favor of the quick pills, and eliminated sidebar scrollbar clutter.
- 2026-10-21: **Mobile re-check** (owner asked "are you sure?"). Re-tested the pushed code as a production
  build at 320/360/390/430px and swept all 128 prototype screens at 360×800. Fixed: hero "Website ↗"
  link clipped at 360px (narrow rule: smaller polaroid, links wrap, no stray "·"); menu-bar clock and
  home-screen icons overflowing at 320px; iOS Safari zooming the viewer when a prototype input is
  focused (inputs get 16px text on iOS only). Uncommitted.
- 2026-10-21: **Mobile & responsive pass** (owner: "make sure it works properly on mobile, especially
  the prototype"). See "Mobile & responsive layout". Also fixed: a prototype bug where an auto-advancing
  screen's timer, still running during its exit animation, pulled the viewer back to the previous flow
  (`goTo` now ignores calls from a screen that is no longer current); hero clipping at ~1024px
  (container queries); 48 MB of folder SVGs replaced by WebPs. The `responsive-design` skill now
  documents the shared phone query, container queries and the built phone layout. Committed as
  0b9ff98 on `prod` (on top of the Firebase commit bb45251), `dev` fast-forwarded, both pushed.
- 2026-10-21: **Gau Sampurna full coverage** (owner: "add all the flows, screens and design"). Rebuilt
  the prototype from the prod repo route by route: 13 flows / 76 screens covering home, herd, all five
  AI scans with every orchestrator step and full reports, scan history / reports tab / chat replay,
  Pratham paywall (trial, failed, expired, success), shop to order tracking, cattle trading (sell +
  ₹49 verification), account, and welcome / login / onboarding. Dead routes documented in
  `docs/prototype-coverage-plan.md`. Verified in headless Chrome and `next build`. Committed as
  4be32e4 on `dev`, `prod` fast-forwarded, both pushed. The Firebase files were left uncommitted.
  Note: a parallel Firebase analytics change (`src/lib/firebase.ts`, `analytics.ts`,
  `instrumentation-client.ts`) logs `logFirebaseEvent is not defined` and Firebase 400s in the
  browser; it is separate from the prototype work.
