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
- Profile photo (2026-10-21): `public/profile-photo.jpg` (640px, full frame) for the About hero /
  desktop polaroid, and `public/profile-avatar.jpg` (320px head-and-shoulders crop) for the round
  avatars (home widget, Contact card, hiring notification). To change the photo, replace both.
- **Content source of truth: `src/data/resume.ts`** (profile, KPIs, experience, projects,
  beyond work, skills), synced with the owner's LaTeX resume on 2026-10-21. Edit content
  there, not in JSX. `**text**` renders bold through `src/components/RichText.tsx`.
- Owner: Associate Product Manager at Silo Fortune (09/2025–present), previously PM Intern at
  AltQube (06/2023–09/2025); B.E. ISE, M. S. Ramaiah Institute of Technology (CGPA 8.30);
  former Team India open-water swimmer.
- Project Claude skills live in `.claude/skills/` (index in `CLAUDE.md`).
- Mobile: phones and touch tablets get an **iOS-style UI** (home screen with widgets, app icons and
  a contact dock; each section opens as a full-screen iOS app with a tab bar) and an edge-to-edge
  prototype viewer (see "Mobile & responsive layout").
- Context auto-sync: a Stop hook (`.claude/hooks/update-context.sh`, registered in
  `.claude/settings.json`) makes Claude update this file before ending any response in which
  project files changed.
- Branch workflow: `prod` and `dev` are kept in sync on GitHub; commit on one, then
  fast-forward the other.

## Decisions

| Date | Decision | Why |
|---|---|---|
| 2026-10-21 | Write `-webkit-backdrop-filter` **before** `backdrop-filter` in every CSS file | Lightning CSS (Next's CSS pipeline) merges the two and keeps only the last one; with `-webkit-` last, Chrome/Android got no blur at all on any glass surface |
| 2026-10-21 | Phone home keeps the owner's widget/icon positions and mountain wallpaper; only the components were modernised (iOS 26 Liquid Glass, filled glyphs, Search pill) | Owner tried an iOS-grid re-layout with a pastel wallpaper and preferred the original arrangement |
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
- **Phone layout = iOS (2026-10-21).** Shared pieces live in `src/components/ios/`:
  `AppIcon.tsx` (Apple-style squircle via an inline superellipse SVG **mask**, n=5, not border-radius;
  iOS 26 glass sheen + rim; the drop shadow sits on a `.frame` wrapper because masks clip
  box-shadows; gradient + glyph or real app image; `AppTile` is the non-interactive tile), `sections.tsx` (`SECTION_APPS`: filled + outline Ionicons 5 glyphs,
  label, colour and Spotlight keywords per section, used by the home grid, Spotlight and the tab bar),
  `contactApps.tsx` (`CONTACT_APPS`: Phone, Messages, Mail, LinkedIn for the dock and Spotlight),
  `Spotlight.tsx` and `ContactCard.tsx`.
  - **Home screen** (`MobileHome.tsx`, the phone landing page). **Owner-approved layout, keep the
    positions:** medium profile widget (→ About), two small widgets side by side (Impact KPIs →
    Projects; "Currently" role → Experience), a 4-column app grid (the five sections + "Kissan
    Sampurna" / "Gau Sampurna" with full names, which open the prototypes), the iOS **Search** pill
    (opens Spotlight), and a dock of unlabelled contact apps (`Clicked Contact Method`, placement
    `home_dock`). Mountain wallpaper (`wallpaper-mobile.webp`) stays. Widgets are iOS 26 Liquid Glass
    (dark tinted glass, bright rim, sheen); icons use filled glyphs; grid metrics come from `--margin`
    / `--gx` / `--icon` so a small widget is exactly two icon columns wide. Labels may wrap to two lines
    rather than truncate.
  - **Page 2** (swipe left, or tap the page dots above the Search pill): `ios/ClockWidget.tsx`, a
    medium widget in the page-1 Liquid Glass styled like the native iOS Calendar + World Clock widgets
    (SF Pro, red weekday/month, 12-hour time, "Bangalore · 5h 30m ahead of you", weekends grey, today
    on a red disc). Dots are 7pt on a 16pt pitch. It shows **Mandar's time in Bangalore (IST)**, not the visitor's
    (the site plays his phone; helps recruiters abroad), and tapping it opens Contact. Pages are a
    native scroll-snap row (`.pager`); dock, dots and Search stay fixed. Time renders client-only via
    `useSyncExternalStore` (server snapshot null) to avoid hydration mismatches. Event `Viewed Home
    Screen Page` {page, method: swipe | dots}. Dots are hidden in landscape.
  - **Spotlight** (`ios/Spotlight.tsx`): search over the apps, sections and contact actions, also
    matching resume keywords (companies, products, skills). Return opens the first result, Esc/Cancel
    close. Events `Opened Spotlight`, `Selected Spotlight Result`; open source / placement `spotlight`.
  - **Section = full-screen iOS app** (`DraggableWindow` phone branch, classes `mobile-window ios-app`):
    Liquid Glass nav bar with 36pt round glass ‹ (aria-label "Home screen") and Share buttons (44pt
    touch targets); the inline title and a soft blurred scroll edge fade in once the content scrolls; a
    28pt page title on Experience/Education/Projects
    (`ios-grouped`, background `#F2F2F7`, white 12px-radius cards). About and Contact are profile pages
    without a large title. Opening zooms in from 0.9 like an app launch.
  - **Tab bar** (`MobileDock.tsx`, `nav[aria-label="Sections"]`): only while a section is open; iOS 26
    floating glass capsule (62pt, 44pt in landscape), the active tab on a blue-tinted pill with a filled
    glyph, inactive tabs outlined; re-tapping the current tab scrolls to top. The window runs to the
    bottom edge: content scrolls under the bar, a `.mobile-window::after` gradient fades it out behind
    the bar, and `.window-content-scroll::after` adds room so the last card clears it.
  - **Section styling:** each module has a `:global(.ios-app) …` block (not inside a container query,
    so landscape gets it too) that hides the duplicate section heading and turns entries into cards.
    Date brackets come from `.period::before/::after` so the iOS cards can drop them.
  - **Contact** on phones renders `ios/ContactCard.tsx` (iOS Contacts card: photo, name, message/call/
    mail/LinkedIn tiles, grouped rows, Notes, and **Add to Contacts**, a vCard download tracked as
    method `vcard`). The "SYSTEM HALTED" footer is desktop-only.
  - **System touches:** black boot screen with a white glyph and a thin bar (no text);
    `HiringNotification` drops from the top as an iOS banner (15pt text, tinted full-width action).
  - Desktop icons still open with one tap on any touch screen and are keyboard-accessible.
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

- 2026-10-21: Committed this session's phone work as **097613d** on `dev`, fast-forwarded `prod`,
  pushed both (all "Uncommitted" entries below from 2026-10-21's iOS-components pass onward are in
  it). Preflight: build, secrets and links pass; the 2 fails (5 lint errors, assets > 300 KB) and the
  SEO warnings are pre-existing backlog items.
- 2026-10-21: **Icon audit fixes** (owner asked whether the phone icons are modern and correct).
  Contact's cyan paper plane read as Telegram's icon → teal handshake (`PiHandshakeFill`, outline in
  the tab bar). Icon corners now use Apple's continuous squircle (superellipse mask) instead of rounded
  rects, with a glass sheen and rim; Kissan/Gau keep their real white store icons (checked against the
  apps' `app.json`). Per-glyph optical scaling (`glyphScale`, `glyphSize()` in `ios/sections.tsx`) so
  the person and handshake don't look smaller than the briefcase or cap. Contact card action tiles
  switched from outline (lucide) to filled glyphs, as in iOS Contacts. Uncommitted.
- 2026-10-21: Page-2 widget redesigned from the serif "aesthetic" style to native iOS (owner: modern
  iOS design, 12-hour clock): Liquid Glass to match page 1, World Clock offset line, Calendar-widget
  grid. Page dots tightened to the iOS 16pt pitch. Uncommitted.
- 2026-10-21: **Swipeable second home page** on phones with a clock + calendar widget (owner's
  reference: dark "aesthetic" serif widget). IST time, tap → Contact, page dots, new analytics event.
  Verified a real touch swipe snaps to page 2 and updates the dots; 320 / 375 / 393px clean;
  `tsc`, lint and `next build` pass. Uncommitted.
- 2026-10-21: New profile photo (owner-supplied). Replaces `profile-new.jpg` (deleted) with
  `profile-photo.jpg` and a tight `profile-avatar.jpg` crop so the face isn't tiny in small circles.
  New file names so browsers and the image CDN don't serve the old cached photo. Uncommitted.
- 2026-10-21: **Phone section chrome and About header, lighter** (owner: nav buttons and title too big,
  photo too small). Nav buttons are 36pt glass circles with a 44pt touch target (`::after`), smaller
  glyphs, aligned to the 16pt margin; grey-tinted on white pages (About/Contact) instead of a shadow.
  Nav bar 52 → 48pt. Page title 34pt Large Title → 28/34 Title 1. About portrait 52/72/44 → 88pt
  (112pt on tall phones, 72pt on short), hero headline on tall phones 34 → 30/36. CTAs still above the
  tab bar at 375×560. Uncommitted.
- 2026-10-21: **Modern iOS (iPhone 18 / iOS 26) components on the phone UI**, keeping the owner's home
  layout and wallpaper. Liquid Glass widgets and dock; filled Ionicons 5 glyphs on icons and dock; full
  app names ("Kissan Sampurna", "Gau Sampurna", wrapping to two lines when needed); a working iOS
  Search pill → Spotlight (`ios/Spotlight.tsx`, new events `Opened Spotlight` / `Selected Spotlight
  Result`); floating glass tab bar with outline/filled glyphs; round glass nav buttons; scroll-edge fade
  so text no longer runs through the tab bar. Fixed site-wide: no backdrop blur in Chrome/Android
  (prefix order, see Decisions); hero `CountUp` hydration mismatch when reduced motion is on.
  Verified in headless Chrome at 320×568, 375×667, 393×852, 430×932, 852×393 and desktop 1440×900;
  `tsc` and `next build` pass; lint unchanged (pre-existing errors only). Uncommitted.
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
- 2026-10-21: **Figma Mobile Prototype & Full Site Mobile Redesign Pass**:
  - **Mobile Prototype Player (`PrototypeMobile.tsx` & `.module.css`)**: Implemented authentic full-screen Figma mobile prototype mode. Base 375pt design scales proportionally to 100% of viewport width with `transformOrigin: "top left"` (no side letterboxing or horizontal clipping). Added Framer Motion touch swipe gestures (`drag="x"`) to flick between screens, auto-hiding toolbar with a sleek floating bottom mini-pill (`● Flow · 1/2 ^`), top Dynamic Island coach mark pill, 1-tap restart button, and smooth bottom sheets for PM notes and flows.
  - **Mobile Home Screen (`MobileHome.tsx` & `.module.css`)**: Redesigned the Featured Figma Mobile Prototypes showcase widget into full-width stacked touch cards with official Figma SVG badge, `● Full Touch Mode` indicator, unclipped app titles, clear captions, and tactile 40px "Try" buttons.
  - **Mobile Sheet Window (`DraggableWindow.tsx` & `globals.css`)**: Added iOS-style sheet grabber bar (`.mobile-sheet-grabber`) inside `.mobile-sheet-header` above `.mobile-navbar` for authentic bottom-sheet look and feel.
  - **Contact Section Mobile Overhaul (`Contact.module.css`)**: Redesigned `.socials` into a clean full-width vertical action stack with 46px thumb-sized touch targets and active scale states.
  - **Hero & Section Ergonomics**: Constrained `.sparkDoodle` in `Hero.module.css` to prevent horizontal overflow; enhanced `.prototypePill` in `Experience.module.css` and `.prototypeBtn` in `Projects.module.css` for touchscreens; fixed `BootScreen.module.css` for `100dvh` centering. Verified with CDP headless Chrome screenshots and clean production build.
- 2026-10-21: **Mobile Default Home Screen & Prototype Redundancy Cleanup**:
  - **Default Landing Page on Mobile**: In `WindowContext.tsx`, mobile devices (`window.matchMedia(MOBILE_QUERY).matches`) now default to `isClosed: true` on initial mount (unless visiting with a deep link), opening directly onto the iOS-style mobile home screen. Desktop devices continue opening with the About Me window displayed as before.
  - **Eliminated Prototype Redundancy**: Removed duplicate app prototype icons (`Kissan` and `Gau` with blue play badges) and the redundant tip text from `.grid` in `MobileHome.tsx`. The prototypes now live exclusively in the featured Figma Mobile Prototypes showcase.
  - **Streamlined 5-Column Section Grid**: Arranged the 5 section folders (`About`, `Experience`, `Education`, `Projects`, `Contact`) into a single, balanced horizontal row on the home screen above the dock.
- 2026-10-21: **Mobile prototype player fixes** (verification of the combined mobile redesign at
  320–430px and all 128 prototype screens). (1) The collapsed controls pill sat bottom-centre on top
  of both apps' Scan tab; it's now a slim tab on the right edge at mid-height. (2) Swipe used a
  whole-screen Framer drag, which hijacked banner/product carousels and was cancelled by the browser;
  replaced with touch-swipe detection that ignores sideways-only scrollers (verified: carousel swipe
  scrolls the row, plain swipe changes screen). (3) Kissan home was 45px wider than the screen (My
  Crops row had no scroller), so the page wobbled sideways; the row now scrolls. (4) Toolbar drops
  Restart/Hide below 360px so the title stays readable; the coach mark wraps instead of truncating.
  (5) Home widget caption no longer attributes the combined 250K+ installs to Kissan alone.
  Uncommitted.
- 2026-10-21: **Phone home screen simplified** (owner: "too packed and clumsy… without redundancy").
  Removed the section folder grid (it duplicated the dock) and replaced the "Figma Mobile Prototypes"
  card (badge, "Full Touch Mode" tag, two-line captions, "Try" buttons) with one quiet "Apps I've built
  · tap to try" list: icon, name, one-line caption, chevron, whole row tappable. Home is now three
  matching frosted widgets (profile, KPIs, apps) plus the dock. Uncommitted.
- 2026-10-21: **Phone About simplified** (owner: "simple and minimal"). Below a 600px window
  (`@container window (max-width: 599.98px)` in `Hero.module.css`): round 76px photo instead of the
  tilted polaroid, no "Apps I've built" list (the phone home screen has it), no sparkle doodle, KPIs as
  one hairline-divided strip instead of three boxed cards, then LinkedIn + "Get in touch". Phone
  section pages also drop the dotted notebook background (plain white). Desktop unchanged. Uncommitted.
- 2026-10-21: **Phone About fits one screen, iOS type** (owner: CTAs needed a scroll; wanted the iPhone
  font and sizes). Sized for the tightest case (iPhone SE in Safari, ~390px of content): 52px round
  photo, Title 1 headline 28/34, Subheadline intro 15/20, Title 3 numbers, Caption labels, and both
  CTAs in one row (filled "Connect on LinkedIn" ~57% + tinted "Get in touch"). Steps down under 640px
  tall and up to Large Title 34/41 + Body 17 on tall phones (≥ 760px). Measured zero scroll from
  320×568 to 430×932 with no clipped labels. Font stack now explicitly SF Pro Text/Display first
  (`-apple-system`), then `system-ui` (Roboto on Android). Phone section pages use Callout 16 body and
  Title 2 22/28 headings. Uncommitted.
- 2026-10-21: **iOS redesign of the phone UI** (owner: "make it like iPhone OS"). See "Phone layout =
  iOS" under "Mobile & responsive layout". New `src/components/ios/` (AppIcon, sections, ContactCard);
  `MobileHome` rewritten as an iOS home screen; `MobileDock` is now an iOS tab bar; the section sheet
  became a full-screen app with a large title and grouped cards; iOS boot screen and notification
  banner on phones. Verified in headless Chrome (touch emulation): home and all sections at 320×568,
  375×667, 393×852 and landscape 852×393 with no horizontal overflow and no page errors; About still
  fits with no scroll at 320×568; Kissan/Gau icons open and close the prototypes; desktop/laptop
  unchanged (1024/1280/1440). `tsc` and `next build` pass. Uncommitted.
