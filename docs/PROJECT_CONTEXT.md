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

## Current state (2026-10-31)

- **Desktop (redesigned 2026-10-31):** dawn wallpaper (`public/wallpaper-desktop.webp`,
  static), sunrise loader, a slim menu bar (sections, battery, Wi-Fi, clock), and one icon column on the right (five
  sections, then Kissan and Gau, which open their prototypes). Every window is translucent dark glass,
  themed once in `globals.css` (`.os-window:not(.ios-app)`). About is `AboutCard.tsx`. Old About concepts
  remain at `/?about=live | showcase | store | native | classic` until the owner confirms the design;
  then remove them, the `?about` checks in `Hero.tsx` and `DraggableWindow.tsx`, and unused
  `public/about/*`. The music widget is no longer rendered.
- **Phone:** dawn wallpaper crop (`public/wallpaper-phone.webp`, moon placed in the gap between the two
  small widgets) and the Back button in `PhoneBack.tsx`. Keep in-app overlays in `depth` there.
- Stack: Next.js 16.3 App Router, React 19.2, TypeScript, CSS Modules + tokens in
  `src/app/globals.css`, framer-motion, lucide-react, react-icons.
- Sections (tab ids in `WindowContext.activeTab`): `about`, `experience`, `education`,
  `projects` (shown as **Case Studies** since 2026-10-30), `contact`.
- **First visit (desktop, 2026-11-02):** a Mission Control overview of every window (`MissionControl.tsx`)
  that tours them automatically in grid order, then opens About Me; later visits reach it from the menu
  bar's Show all windows button, with hover peeks only.
- **Resume (2026-11-02, re-typeset 2026-11-03):** `/resume` shows the owner's LaTeX resume as a PDF-style document: two US
  Letter pages following the owner's XCharter LaTeX source (Charis SIL, SIL's Charter, via next/font; accent `#1F4E79`, gold
  `#B49A5E`; 0.45/0.5in margins; order Summary → Experience → Beyond Work → Education → Skills) on a grey viewer with a
  dark toolbar (back, file name, page n / 2, zoom −/+/fit, download, print); phones fit the page width and pinch-zoom.
  → and ∼ come from a 6 KB renamed Charis subset (`components/resume/fonts/resume-symbols-*.ttf`, unicode-range); `+` is
  narrowed to Charter's width with CSS (`.plus`), kept in the main font so PDF text extraction reads "250K+"; hyphenated
  words never wrap (the LaTeX forbids breaks at hyphens). Page break: after the CRM group (each group is a LaTeX `keep`;
  if content changes, re-check which groups fit on page 1). Text is real and copyable (NoInspect lets
  copy and right-click through inside `[data-allow-copy]`). Content: `src/data/resumeDocument.ts`, word for
  word from the LaTeX source. Download serves `public/Mandar_Desurkar_Resume.pdf` (95 KB). **After changing the resume, regenerate
  the PDF:** open `/resume` in Chrome → Print → Save as PDF (paper Letter, margins none, background graphics
  on), save over that file. Linked from About Me ("View resume", new tab), the phone hero ("View Resume"), phone
  Search (a "Resume" result) and the phone Contact card (a "resume" row).
- **Case studies** (2026-10-30; Farm Monitoring added 2026-10-31, AI Crop Doctor 2026-11-01): content in `src/data/caseStudies.ts` (typed; every public statistic
  has a `source` id pointing at a verified URL), one statically generated page per slug at
  `/case-studies/<slug>` (`src/app/case-studies/[slug]/page.tsx` + `CaseStudy.module.css`). The Case
  Studies window lists them as feature cards (the "Products I've shipped" list was removed on 2026-11-01),
  and Spotlight has a "Case studies" group. **To add one:** append an entry to `caseStudies`, add
  screenshots under `public/case-studies/<slug>/` (captured from the desktop prototype viewer at 2×),
  and run `next build` (the page prerenders via `generateStaticParams`). Deep links:
  `/?section=projects` opens the window (phones too); `/?prototype=<id>&flow=<flow-id>` opens a
  prototype on a given flow. Events: `Opened Case Study`, `Viewed Case Study`, `Clicked Case Study CTA`.
- Branches: `main` (default), `dev`, `prod` (release). Remote: GitHub `Mandar-Desurkar/Mandar-website`.
- Profile photo (2026-10-21): `public/profile-photo.jpg` (640px, full frame) for the About hero /
  desktop polaroid, and `public/profile-avatar.jpg` (320px head-and-shoulders crop) for the round
  avatars (home widget, Contact card, hiring notification). To change the photo, replace both.
  `public/profile-new.jpg` is a **compatibility copy** of `profile-photo.jpg`, nothing references it:
  pages loaded before the 2026-10-21 deploy (open tabs, Safari / LinkedIn in-app cache) still request
  the old path and showed a broken photo after it was deleted. Safe to delete after a few weeks; when
  renaming public assets in future, keep the old file for a while.
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
| 2026-10-31 | Phone exit uses a history guard added on the first tap; the second Back on home is the browser's own | A site can't close itself, and Chrome skips history entries added without a user gesture |
| 2026-11-02 | Windows sit at true screen centre, 20px under the 30px menu bar and 20px above the bottom; wide windows are sized to stay centred with 48px clear of the desktop icons (never below 760px, where they shift left instead) | Owner's call: centred and evenly framed, never touching the icons. Sizes use `--icons-w` (one or two icon columns); the left shift is computed from `--win-w` |
| 2026-10-30 | Site font: Apple's **SF Pro** on Apple devices (system font), **Inter** elsewhere (self-hosted via `next/font`) | SF Pro's licence forbids web hosting; most visitors are on Android, where the old stack fell back to Roboto. Platform-aware stack because Chrome maps `BlinkMacSystemFont` to `system-ui` everywhere |
| 2026-10-30 | "Projects" renamed **Case Studies** in the UI only; the tab id stays `projects` | Keeps analytics (`Opened Section` history) comparable and avoids touching every wiring point |
| 2026-10-30 | Case studies are real routes (`/case-studies/<slug>`), not views inside the window | Shareable on LinkedIn/email on their own, crawlable, readable long-form on phones |
| 2026-10-30 | Case study personas are labelled composites; outcomes use only verified facts (resume, engine doc, shipped product) | No fake metrics or invented interviewees; adoption added from the resume on 2026-10-31 (7.7K+ MAU at peak) |
| 2026-10-21 | Write `-webkit-backdrop-filter` **before** `backdrop-filter` in every CSS file | Lightning CSS (Next's CSS pipeline) merges the two and keeps only the last one; with `-webkit-` last, Chrome/Android got no blur at all on any glass surface |
| 2026-10-21 | Phone home keeps the owner's widget/icon positions; only the components were modernised (iOS 26 Liquid Glass, filled glyphs, Search pill) | Owner tried an iOS-grid re-layout with a pastel wallpaper and preferred the original arrangement. Wallpaper changed to the dawn photo on 2026-10-31 at the owner's request |
| 2026-10-21 | Keep project knowledge in-repo (`CLAUDE.md`, this file, `.claude/skills/`) | Survives switching Claude accounts and machines; git versions it |
| 2026-10-21 | Added 10 project skills + `preflight.sh` / `asset-report.sh` | Consistent expert workflow for SEO, a11y, perf, content, deploy |
| 2026-10-21 | Hero KPIs = 250K+ installs, 3× trial conversion, ₹1 Cr+ monthly sales | Replaced unverifiable "12+ products / 1M+ users / 4+ years"; every number now traces to the resume |
| 2026-10-21 | Music autoplays muted, never with sound | Unexpected sound is the top complaint about portfolio audio (recruiters open links at work), and browsers only allow muted autoplay |
| 2026-10-21 | Music lives in a desktop widget, not the menu bar | Owner's call: a visible widget is discoverable at a glance, while a menu-bar icon hid the player behind a click. Matches macOS Sonoma desktop widgets |
| 2026-10-31 | Removed the "Future CPO / Founder (TBD)" Experience entry | Owner's call (it had been kept since 2026-10-21 as an easter egg, flagged as a credibility risk) |
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
      the optional `link` field in `src/data/resume.ts`. 
- [x] **Resume (2026-11-02):** built as the `/resume` viewer plus a generated PDF instead (see Current state).
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
- [x] **SEO (2026-10-31):** `metadataBase`, OG/Twitter image, `sitemap.ts`, `robots.ts`, JSON-LD done; `icon.png` still open.
      Only the active tab is in server HTML, so other sections aren't crawlable.
- [ ] **A11y:** desktop icons/dock items are clickable `div`s (no keyboard access);
      no reduced-motion handling.
- [ ] **Security/UX:** `NoInspect.tsx` blocks copy (including the email); `Dock.tsx`
      `window.open` lacks `noopener`.
- [x] Add `src/app/not-found.tsx` (OS-themed 404), 2026-10-31.
- [ ] **Crop Guide report** also changed in the repo (compare options card, blue icons); prototype not yet updated.
- [ ] **Content:** Education's "Python, MySQL, +5 skills" lines are vague; list the skills or drop the line.
- [ ] **Content:** the FINA certificate says **World Junior** Open Water Swimming Championships, Eilat,
      September 2018; the resume and site say "World Open Water Championships 2018". Owner to confirm wording.
- [ ] **Owner to decide:** remove `NoInspect` copy, text-selection and screenshot blocking; add a dock for
      minimized windows.
- [ ] **Farm Monitoring case study, owner to confirm:** "pipeline I specified with the data science team",
      composite personas, publishing the real satellite output, "Timeline: 2025–26", sync as a paid feature.
- [ ] **Phone Back:** test on a real Android phone, including in-app browsers such as LinkedIn's.
- [ ] **Before pushing:** owner to confirm Silo Fortune is OK with public app screens, the install-to-signup
      "3%" wording, and whether Contact keeps "SYSTEM HALTED".
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

## Prototype sizing & typography (how the real apps size things)

Measured from the apps' own source on 2026-10-22; follow this for any new prototype screen.

- **Kissan** (`code/helpers/scaled.js`, react-native-size-matters): designs are drawn on a **393 × 852**
  iPhone 15/16 Pro and nearly every size is `'N@ms'` (moderate scale 0.5). On a phone W pt wide a value
  renders at `N × (0.5 + W/786)`, exact at 393. Write the **design number N** in CSS.
- **Gau** (`code/helpers/responsive.js`): a **375 × 812** base, `responsive.*` scales linearly with width.
  Design-system tokens (`theme.typography.*`, `FontSize.*`, `TopBarNew`, `Button`, `TextInput`,
  `OtpInput`, language / contact / about / login / OTP / register screens) go through `RFValue`, which
  already renders them ~8% larger on the base phone: **write `round(N × 734/680)`** (12→13, 14→15,
  16→17, 20→22, 24→26). Raw `fontSize: N` / `responsive.fontSize(N)` stay N. Half-point sizes (10.5,
  12.5, 13.5) are real in some Gau components (home, quick actions, herd value), so check the source.
- The model lives in each prototype's `device` (`src/data/prototypes/*.ts`) and `deviceFit.ts`
  (`fitToPhone`); the phone viewer and the desktop frame both use it.
- **Fonts:** Lato everywhere (Regular / Bold / Black; weights map 500→Regular, 600→Bold, 800–900→Black
  as in the apps). **Poppins** only on Gau Account + Edit Profile (`.poppins` class). Fonts are
  Latin-subset WOFF2 in `src/components/prototype/fonts/` (OFL); Indian-script text falls back to the
  system font, as on device. Subset new fonts with `pyftsubset` (needs `brotli`).



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

- **Now:** ~~analytics~~ (Amplitude added 2026-10-21); resume PDF + "Hire me" CTA; 2–3 case studies (Sampurna freemium funnel 2.4→7.2%,
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

- 2026-11-03: **Resume updated to the owner's new LaTeX source** (XCharter version): new wording throughout ("consumer
  mobile apps", shorter bullets, product lines in parentheses, Domains "Consumer Mobile Apps (B2C)"), Summary as its own
  section, Education moved after Beyond Work, a second gold rule under the contact line, black product lines and blue
  entry titles, ragged right with no hyphenation. Spacing translated from the LaTeX rules (no TeX on this machine to
  compile it, so not pixel-checked against a real PDF). Page 1 now holds three Silo groups, page 2 starts at Rider App.
  PDF regenerated (2 Letter pages, 95 KB, Charis + symbol subsets, 4 live links; text extracts "250K+", "Rs. 1 Cr+").
  Libertinus fonts removed. Site content (`resume.ts`) not changed. Uncommitted.
- 2026-11-02: Resume on phones (owner asked): the phone About already linked it; added a "Resume" result to
  phone Search (`ios/Spotlight.tsx`, red document tile) and a "resume · View or download PDF" row on the
  Contact card (`ios/ContactCard.tsx`, `Opened Resume` placement `contact_card`). The viewer's toolbar and
  canvas now pad for the iPhone notch and home indicator (`env(safe-area-inset-*)`). Checked at 393 × 852:
  both entry points link to `/resume`, pages fit the width, no sideways scroll. Uncommitted.
- 2026-11-02: **Resume restyled to the owner's LaTeX template** (owner sent its PDF: take the font, sizes,
  colours and spacing, not the content). Libertinus Serif (open continuation of Linux Libertine) via
  next/font; the → comes from a 5 KB Libertinus Math subset (`components/resume/fonts/`), since Google's
  Latin subset lacks it (Next's metric fallback is off so the arrow font is reached). Sizes calibrated by
  matching the template's string widths: 32pt regular navy name, 14.4pt bold navy headings, 11pt body on
  13.75pt lines, 11pt bold entries and navy product lines; one gold rule under the name and each heading;
  entries indented 11pt, "-" dashes at 21pt; US Letter with the template's margins and its page break (after
  the CRM group). Landmarks within 2–4px of the template. PDF regenerated: 2 Letter pages, 79 KB, only
  Libertinus fonts, live links. Committed with the resume viewer and pushed to `dev` and `prod`.
- 2026-11-02: **Resume viewer** (owner sent the LaTeX resume as HTML: "view resume" CTA, PDF look, phone and
  desktop). New `/resume` route (`src/app/resume/`, `components/resume/ResumeViewer.tsx`, data
  `src/data/resumeDocument.ts`), typeset like the LaTeX source: centred name between 0.6pt rules, small-caps
  section rules, bold title / right-aligned dates, italic group lines, justified bullets; page 1 holds the
  header, Education and all of Silo Fortune, page 2 AltQube, Beyond Work and Skills. Viewer: Chrome-style
  toolbar, page counter from scroll, CSS `zoom` (fit width, never above 100%), Download (the PDF) and Print;
  phones hide zoom and print. Print CSS gives one A4 sheet per page and a white body (the wallpaper on
  `<body>` had made the PDF 3.2 MB). `public/Mandar_Desurkar_Resume.pdf` printed from the page (2 pages, live
  links). `profile.resumeUrl` is now `/resume`; the PDF HEAD checks in AboutCard and Hero are gone, so the
  CTAs always show: About Me gets a "View resume" pill beside Get in touch (Copy email became an icon by
  Email so the row stays one line), the phone hero shows View Resume + LinkedIn. Events `Viewed Resume`,
  `Downloaded Resume` {download | print}; `/resume` added to the sitemap; the overview's About Me preview
  re-captured. Uncommitted.
- 2026-11-02: Tour shortened to **6.67s** (owner asked for 6.4–7s; it was 21s, then 12.6s): 7 stops × 0.95s
  (`STOP_MS`), a 50ms tour clock (`TICK_MS`; the old 100ms tick rounded each stop up to 1s), first stop 0.8s
  after the overview opens; page load to About Me ~10.7s. In the tour each peek runs at 0.33× its hover
  length (CSS var `--k`, `TOUR_PEEK_SPEED`) and reaches its end state by ~0.8s (checked); hover peeks keep
  their full length. Pushed to `dev` and `prod`.
- 2026-11-02: Fixed two previews looking selected at once in the first-visit tour (owner): focus started on
  Case Studies and kept its blue ring while the tour moved on. Focus now follows the tour stop (and starts on
  About Me), and while a preview peeks no other shows the ring or lift. Crop Doctor full report recompressed
  (371 → 272 KB). Committed everything since c32323c on `dev`, fast-forwarded `prod`, pushed both.
- 2026-11-02: Owner: no tips after the tour, and the tour starts from About Me. `DesktopTour.tsx` (the two
  hints) and its events are deleted; the tour now runs About Me → Experience → Case Studies → Education →
  Contact → Kissan → Gau (3s each, ~21s) and then opens About Me. Verified in order with no hint after.
  Uncommitted.
- 2026-11-02: Tour changed (owner): **first visit only and automatic**, no "Watch a tour" button and no tour
  bar (segments, caption, Pause/End). It starts 1.3s after the overview opens and visits every window in
  grid order, left to right then the bottom row: Experience → Case Studies → Education → Contact → Kissan →
  Gau, 3s each (~18s), then opens About Me; the two tips follow. During it the subtitle says "A quick look
  at each window. Click one to open it, or press Esc."; the peeking preview's note shows its action. The
  menu-bar overview on later visits has hover peeks only. Uncommitted.
- 2026-11-02: **Peeks + optional tour in Mission Control** (owner: show what each window does, then open About
  Me; agreed plan: hover peek by default, tour opt-in, never autoplay). Resting ~0.45s on a preview (or
  keyboard focus) enlarges it, dims the rest and plays a 3s peek; the note line becomes the action:
  Experience scrolls to the swimming story, Education to the toolkit (tall stitched captures), Case Studies
  / Contact / About Me show a cursor gliding to the real control (Read case study, Copy, an app name),
  pressing it and the result crossfading in, Kissan / Gau flip through real screens. "Watch a 16-second
  tour" (top left) runs 5 stops × 3.2s (Experience, Case Studies, Kissan, Education, Contact) with a
  segmented progress bar, caption, Pause (space), ← →, End tour / Esc (stays in the overview); a click on any
  preview stops it and opens that window; the last stop opens About Me. Peeks are CSS animations on
  captures in `public/mission-control/peek/` (re-capture with the window stitch method when a window
  changes; click targets are % of the preview); reduced motion jumps to each end state. Events: `Peeked
  Window`, `Started / Completed / Stopped Overview Tour`. Fixed: the entrance animation's transform had
  pushed the heading off centre (it is now centred by insets). Uncommitted.
- 2026-11-02: **Mission Control animated** (owner: "animate this… so users understand the UX"). Motion
  teaches the mapping: the open window shrinks from its real position into its tile, every other tile
  grows out of its desktop icon (`data-icon` on `DesktopIcon`, prototype id for the apps), labels fade up
  after, the "Start here" badge pops in last and first-visit focus starts on Case Studies. A pick zooms that
  tile toward the centre and crossfades into the real window (full screen for a prototype); Esc / background
  / Go to desktop flies every tile back into its icon and the open one back onto its window. The real window
  hides while its tile stands in (`html[data-mc]` in globals.css). Imperative framer `animate()` measured in
  a layout effect (no flash); hover lift lives on the tile so it never fights the preview's transform;
  reduced motion = fades. Fixed: picking a window re-armed the first-visit timer (overview came back 2.3s
  later), now marked seen on open and timers use a ref. Verified with screencast filmstrips (entry, pick,
  Esc), fit at 1024 / 1280 / 1920, hints and prototype path unchanged. Uncommitted.
- 2026-11-02: **First-visit onboarding = Mission Control overview** (owner's reference: samuello.me; owner:
  "think like an expert and proceed"). Desktop only. After the loader (2.3s) a first-time visitor sees every
  window at once (`MissionControl.tsx`): About Me, Experience, Case Studies ("Start here" badge), Education,
  Contact, Kissan and Gau as labelled previews over the blurred desktop, "Everything on my desktop. Each
  window is a part of my work…". Hover or arrow keys give the blue selection ring; click/Enter opens it,
  Esc / background / "Go to desktop" closes (About Me is already open behind). No timer, so readers aren't
  rushed. Previews are screenshots in `public/mission-control/` (720px, ~200 KB total; **re-capture when a
  window's design changes**); tile height is computed to fit the screen (verified 1024 × 768 to 1920 ×
  1080). Reopen from the new **Show all windows** button in the menu bar (event `mission-control-open`); no
  keyboard shortcut, because macOS takes F3 and Ctrl+↑ before the browser. Skipped on `?section=` /
  `?prototype=` links. Then two hints, once (`DesktopTour.tsx`, replaces the 5-step tour built earlier the
  same day): "Windows work like a Mac" (title bar) and "See everything again" (the menu button); they wait
  for a picked prototype to close. The hiring banner waits for both. Events: `Opened / Picked From / Closed
  Mission Control` (which window first-timers pick first) and `Completed / Skipped Desktop Tour`. Keys:
  `mission-control-seen`, `desktop-tour-seen`. **Fixed along the way:** Esc on a prototype also closed the
  window behind it (the viewer now marks the key handled; the window ignores handled keys). Uncommitted.
- 2026-11-02: **Skills & Toolkit redesigned (desktop Education window)** as a bento: Product & UX as the lead
  card with its 14 skills grouped by stage (Strategy, Discovery & design, Growth, Delivery), Technical and
  Tools & Analytics beside it, Domains full width as cells naming the product behind each (AltQube Wealth
  Platform, Kissan & Gau Sampurna, Sales CRM & Telecalling, Rider App & Outlet ERP, Crop & cattle
  diagnosis). Each card has an icon, an accent tint and a count; chips tint on hover. The grouping and
  domain products live in `skillStages` / `domainProof` in `resume.ts` (keep them identical to `skills`,
  which the phone and Spotlight still read). Phone layout unchanged. Uncommitted.
- 2026-11-02: Education now uses the same frame as Experience and Case Studies (`CENTRED_WIDE` ×
  `FULL_HEIGHT`, was up to 960px × 80vh), and its desktop content column widened 920 → 1100px to match
  Experience. The three long windows are now identical in size and position. Uncommitted.
- 2026-11-02: Windows centred on screen with a 20px gap under the menu bar (owner). Experience and Case
  Studies are `min(84vw, 1180px, centred max)` × `100vh − 70px`, Education `min(65vw, 960px, centred max)`;
  "centred max" = `100vw − 2 × (--icons-w + 48px)`, floored at 760px so small laptops don't get a narrow
  window (they shift left a little instead). Constants in `DraggableWindow.tsx`; top 50px, bottom 20px in
  `globals.css`. Measured: true centre at 1440, 1512 × 827 and 1920 (960px wide on 1512 × 827, 1104 on 1440 ×
  900), 16px shift at 1280, gap to icons ≥ 48px everywhere. Uncommitted.
- 2026-11-02: **Window placement by real width.** The owner made Experience and Case Studies full height
  (`100vh − 52px`, up to `min(84vw, 1180px, 100vw − 320px)` wide) at true centre (top 34px, bottom 18px) and
  removed the About/Experience placement overrides; on 1512 × 827 and smaller that overlapped the icons by
  ~62px. Owner chose to keep it and add clearance: `right: max(0px, var(--win-w) − 100vw + 2 × (--icons-w +
  48px))`, with `--win-w` set inline from the window size and `--icons-w` 120px (one column) or 228px (two,
  below 830px tall). Measured all five windows at 1024 / 1280 / 1440 / 1512 × 827 / 1920: every gap to the
  icons ≥ 48px, true centre wherever it fits. Uncommitted.
- 2026-11-01: Case Studies window enlarged to the Experience size, `min(84vw, 1180px, 100vw − 480px)` × 88vh
  (was `min(75vw, 1040px)` × 80vh), so the three feature cards and their phone fans read better. Checked at
  1280 × 800, 1440 × 900 and 1920 × 1080: on screen and clear of the desktop icons. Uncommitted.
- 2026-11-01: **Third case study: AI Crop Doctor** (`/case-studies/crop-doctor`, owner request). Built from the
  feature itself: the prototype flow, PM notes, and the prod repo's `API_EDGE_CASES_AND_TESTS.md` and
  `diseaseReportMock.js` (read-only): crop picked first, photo quality check that names its reason, healthy
  short-circuit, async report polled every 10 s (40–90 s), a five-stage severity model (Healthy → Early Spot
  → Spot Expansion → Infection Spread → Total Loss) with loss per acre and a stage-specific day-by-day plan
  ending in a day-7 rescan, diagnosis on the subscription (scan quota). Problem sources checked on the web:
  FAO 2021 (up to 40% of crop production lost to pests, diseases >$220bn), Sachan et al. 2022 (387 farmers,
  rural Lucknow: 32.6% got pesticide advice from retailers, 55% didn't read the label), NSO 42% (reused).
  Plantix was the framing reference (name the disease from a photo); the case study positions the gap as
  urgency, stage, cost and a plan. Usage: 4.8K+ MAU at peak (resume). Screens in
  `public/case-studies/crop-doctor/` (2×, no hint rings) plus a 786 × 7810 full report with 12 measured
  callouts. Personas (Shivanna, Kavya) are labelled composites. Uncommitted. **Owner to confirm:** "a vision
  pipeline I integrated with the engineering and data science teams", and that a rejected photo doesn't
  use a scan.
- 2026-11-01: **Case study component review** (owner: make the components proper and rich). Reviewed
  every section of both pages at 1440 / 393; most were already purpose-built. The three that were still
  plain numbered text rows are now cards: **Principles** (grey insight half → arrow → white design rule,
  two a row, subgrid so the seams align, an odd last card spans the row), **Decisions** (D-badge and title,
  then Why in blue and Trade-off in a warm tint side by side), **Reflection** (one card per lesson, title
  split from the `**bold**` lead-in, lime tab). Verified 320 / 393 / 1440, no overflow. Uncommitted.
- 2026-11-01: Removed "Products I've shipped" from the Case Studies window (owner's call), on desktop and
  phone; the window now lists only the case studies, and those products stay in Experience. Spotlight no
  longer mentions it. Its styles were pruned from `Projects.module.css`; the `projects` data in
  `resume.ts` is kept but nothing renders it now. Uncommitted.
- 2026-11-01: **Case study content review** (owner: replace the N:P:K line, frame the problem the way
  satellite farm products do, show product sense). MapMyCrop, Sat2Farm and Farmonaut all pitch the same
  pain: stress found late, then blanket treatment. Farm Monitoring now leads with it: challenge "Farmers
  find problems late, then treat the whole field", featured waffle **30%** of applied nitrogen used by the
  crop (Down To Earth, 21 Jan 2021; source `nue` replaces `npk`), ~86% small/marginal moved to the stat
  strip, and the intro names the gap (satellites see stress early; turning a map into an action is what's
  missing). Persona renamed Lakshmi → Savitha so the two studies don't share a name. Crop Guide's impact now
  leads with 7.7K+ MAU (usage) rather than 655K+ farm profiles (reach). Uncommitted.
- 2026-11-01: **Case study sidebar is now a reading companion** (owner: the space under "On this page" was
  blank). Sticky stack: contents with read sections tinted on the rail and "N min left"; a "Next case study"
  card (its report screen on a brand tile, wraps round); "Open to PM roles" with Get in touch
  (`/?section=contact`) and Copy link. Short screens drop the thumbnail, then the text, then the cards.
  `Clicked Case Study CTA` gained `next_case_study`, `contact`, `copy_link`. **Fixed:** the sticky contents
  never stuck, because `overflow-x: hidden` on both `html` and `body` made body a non-scrolling scroll
  container; now `overflow-x: clip` (globals.css). Uncommitted.
- 2026-11-01: **Engine pipeline redesigned** (both case studies): a numbered stepper instead of the funnel
  shape and cramped cards. "Starts with" input on top, stages as columns on one horizontal rail with an
  arrowhead (vertical rail on phones), captions and plain dot lists instead of chips, and the output as a
  solid "Delivers" bar. Subgrid aligns each stage's title, caption and list rows across columns. Uncommitted.
- 2026-10-31: **Journey redesigned as a vertical timeline** (owner chose it over curve + cards; both case
  studies): one rail with a numbered node and a mood face per stage (lucide faces by `feel`), what the
  farmer does on the left (right-aligned toward the rail), what goes wrong on the right as a tinted note
  with its source. Phones put the rail (58px, so labels like "Confused" fit) on the left with the story
  stacked beside it. The face icons are imported in `page.tsx` (`MOOD_FACES`). Uncommitted.
- 2026-10-31: **Persona section redesigned** (both case studies, shared template): profile cards with a
  tinted band and the avatar on its edge, name and age, a role chip ("· internal" for internal users), facts
  as icon tiles (`ATTR_ICONS` by label), the quote in a tinted callout, then Wants (✓) and Frustrations (✕).
  Cards sit side by side with `auto-fit`, so two or three personas both fill the row; a container query turns
  the facts into single rows in narrow cards. The avatar letter skips a leading "The". Uncommitted.
- 2026-10-31: **Second case study: Farm Monitoring** (`/case-studies/farm-monitoring`, data in
  `caseStudies.ts`, screens in `public/case-studies/farm-monitoring/` captured from the prototype at 2×
  without hint rings). Problem backed by sources checked on the web: N:P:K 10.9:4.1:1 vs 4:2:1 (Economic
  Survey via Down To Earth), 1 extension worker per 1,156 farmers (Down To Earth), Soil Health Card every
  2 years (PIB), within-field NDVI variance from fertilisation (Blaes et al. 2016), Sentinel-2 specs (ESA).
  Includes the owner's real pipeline output (three maps of a 2.45 ha farm, farm name cropped out) via a new
  optional `solution.evidence`. Outcomes: 9.8K+ MAU and 1.6K+ DAU at peak, 13 languages (resume). The page
  template no longer hard-codes "Crop Guide"; the pipeline fits any number of stages (`--stages`) and four
  engine rules sit as two pairs (`--rules`). The Crop Guide full report was re-stitched without hint rings.
  Uncommitted.
- 2026-11-01: **Expanded Amplitude & Firebase analytics tracking for user interactions:**
  Added tracking for untracked user actions: `Opened Photo Lightbox` and `Closed Photo Lightbox` in Beyond Work (records photo URL, caption, and method click vs escape), `Clicked Case Study TOC` (section wayfinding navigation in sticky contents), `Scrolled Case Study` (reading depth milestones at 25%, 50%, 75%, 100%), `Clicked Case Study Footnote` (citation links to sources), `Shared Prototype` (copying prototype link in the viewer), `Switched Prototype` (switching between Kissan and Gau prototypes on desktop and mobile), `Dismissed Prototype Hint` (closing the mobile prototype coachmark), and `Downloaded vCard` (saving contact to phone). Sanitized Firebase event parameter processing to filter out undefined values.
- 2026-10-31: **Sharing and search basics:** `metadataBase` and canonical URLs (`src/data/site.ts`), Open
  Graph and Twitter cards with a generated 1200 × 630 preview (`opengraph-image.tsx`, `twitter-image.tsx`:
  photo, name, role, "Open to PM roles", the three KPIs), Person JSON-LD, `sitemap.ts` and `robots.ts`;
  case study pages use their cover as the preview. Also: "Copy" beside the email in Contact, and an opened
  window takes keyboard focus. Check the card after the next push with LinkedIn's Post Inspector (locally
  the og:image points at localhost). Uncommitted.
- 2026-10-31: **Desktop UX pass.** Esc closes the front window (prototype, photo viewer and other dialogs
  close first); double-clicking the title bar zooms, as on macOS; grabbing cursor while dragging;
  the browser tab names the open window ("Experience · Mandar Desurkar | …"); "Copy email" with a
  "Copied" confirmation in About Me (event method `copy_email`); traffic lights have tooltips and the
  green one says Maximize or Restore; OS-styled `src/app/not-found.tsx`. Window events record `method`.
  Uncommitted.
- 2026-10-31: Swimming photo gallery made compact (owner: "isn't this section big?"): all five photos in one
  justified row on desktop (~160px tall instead of two rows ~600px), and a sideways-scrolling 150px strip
  on phones. Photo widths come from a `--ratio` custom property (an `!important` flex shorthand on phones
  would otherwise override an inline `flex-grow` and collapse them to 0). Uncommitted.
- 2026-10-31: Swimming video made smaller (owner: "looks very big"): video and a 2 × 2 numbers grid side by
  side again, video 60% wide (`align-items: start` prevents the old overflow). "11-member Team India"
  replaced with facts from the press: **12 km trained every day** (two sessions; All About Belgaum,
  28 Aug 2018) and **Gold, national junior champion, Malpe 2017, qualified for World Juniors** (owner's pick; STEPP, "Age 5", "1 of 5 boys" and "50+ nations" were tried and dropped); "5 km" stays in the video headline.
  Uncommitted.
- 2026-10-31: Swimming video and numbers redesigned for hierarchy: the video leads at full width with the
  sharp `maxresdefault` thumbnail, a "Race video" badge, and a short headline + meta (`video.headline`,
  `video.meta`) instead of the long YouTube title; the four numbers sit in one strip joined to the video's
  bottom edge (number → label → context). The poster text sits top-left because the thumbnail has FINA's
  logo baked into its bottom-left. Fixed the old side column, where `aspect-ratio` plus grid
  stretch made the video overflow under the stat cards. Uncommitted.
- 2026-10-31: Removed the "Chief Product Officer / Founder (TBD)" entry from Experience (owner's call), so the
  timeline starts at the current role. The tall Experience window is centred vertically under the menu
  bar (`bottom: 0`), with even space above and below, per the owner's screenshot. Uncommitted.
- 2026-10-31: **Beyond Work redesigned as the swimming feature.** Desktop: full window width with a warm
  glow, big headline, the race video beside a column of four numbers (`beyondWork.stats`: 7+ years,
  3 national golds, 11-member Team India, 5 km), then story and press side by side, then the photos.
  Phone: the same pieces stack (numbers as a 2 × 2 grid). Experience window enlarged to
  `min(84vw, 1180px, 100vw − 480px)` × 88vh (480 = twice the icon area, so it stays clear even centred).
  Story at reading width, press as a two-column list; on phones a 16px gap separates the numbers from the
  story.
  Uncommitted.
- 2026-10-31: Beyond Work embeds the owner's race video (YouTube `sGlckZy6Bdk`, "5 km race at the FINA World
  Junior Open Water Swimming Championship 2018, Israel, Part 2", his own upload). Click to play: only the
  thumbnail loads until then, and the player is youtube-nocookie. New event `Played Video`. The title
  confirms the 5 km event. Uncommitted.
- 2026-10-31: Beyond Work has an "In the press" list above the photos (`beyondWork.press`, 5 links): two
  All About Belgaum articles (FINA World Junior selection, 28 Aug 2018; STEPP Karnataka-2018 talent,
  4 Jan 2019), read and matched, plus three of its Facebook posts (national junior gold, Swimathon 5 km
  third place, "International swimmer…"). Facebook couldn't be opened, so those lines come from the post
  links and carry no date. Clicks: `Clicked External Link`, `link_type: press`. Uncommitted.
- 2026-10-31: Beyond Work shows five of the owner's swimming photos (race start, Team India portrait, medal
  and trophy, India jersey, FINA certificate) in two justified rows with no cropping
  (`public/beyond-work/*.webp`, rows in `beyondWork.photos`); a tap opens any full size (Esc or click
  closes), captions show on hover. The viewer renders into `document.body`, since the window's backdrop-filter would trap a fixed
  overlay inside it. On desktop and phone. Uncommitted.
- 2026-10-31: Owner's Ramaiah and KLE International School logos added (`public/logos/ramaiah.png`, the
  shield mark only since the wordmark is unreadable at icon size; `public/logos/kle.png`, the full crest)
  and shown in the Education timeline rail via a `logo` field on each entry. Uncommitted.
- 2026-10-31: **Education window redesigned (desktop)**, matching the Experience timeline: a rail with an
  icon, dates and length; each school as a glass card with a map link icon, a CGPA badge and skill chips;
  Skills & Toolkit as a 2 × 2 grid of chip groups; "+N skills" shown as muted text. Education window is
  now 80vh tall, like Experience. Phone layout unchanged. Uncommitted.
- 2026-10-31: Owner's Silo Fortune and AltQube logos added (`public/logos/*.png`, 160px squares on white,
  from the images he sent) and shown in the Experience timeline rail via the new `logo` field in
  `resume.ts`; initials remain the fallback. Uncommitted.
- 2026-10-31: **Experience window redesigned (desktop):** a timeline with a sticky left rail (company
  initials, dates, length computed from the period), a node per role (green for current), each product
  group as its own card, custom bullets and a warm Beyond Work card. Company initials take capitals for
  one-word names ("AltQube" → AQ). Phone layout unchanged (rail, badge and intro are hidden outside the
  desktop window). Uncommitted.
- 2026-10-31: Case study "Anatomy of a recommendation" now shows the full Crop Guide report as one long
  screenshot (`05-report-full.webp`, 786 × 6630, stitched from the prototype), with five new callouts for
  compare, weather, risks, tips and soil/income. Uncommitted.
- 2026-10-31: **Farm Monitoring report synced with the repo's latest `dev` (eb2acde).** Reference clone
  `_external/kissansampurna-app` fast-forwarded (read-only). Report now: white body, header with date
  and a collapsible Farm Details, map tabs Growth / Moisture / Nutrition with per-tab red-yellow-green
  legends, Do This cards with a tone accent, zone and map chips, Mark as done and no speaker, four
  vitals in one neutral tone, stage sheet with Growth Stage → Sub-Stage → Day dropdowns, and the
  menu's new labels (Rename Farm, Irrigation Method, Update Location). Sample values. Uncommitted.
- 2026-10-31: About subtitle is just "Product builder", with no city (owner is open to roles anywhere).
  Contact still lists Bangalore as his location. Uncommitted.
- 2026-10-31: New lead sentence in the desktop About window (`profile.about[0]`), which sells an outcome
  rather than listing PM duties. The owner asked to change that sentence only, so the "Currently…" line
  and the phone `profile.intro` keep their earlier wording. Uncommitted.
- 2026-10-31: Added a tone layer over the wallpaper (`.desktop-scene::before`), which calms its colour on
  desktop and phone. Adjust with `--wallpaper-saturation` and `--wallpaper-dim` in `globals.css`. It needs
  `isolation: isolate` on `.desktop-scene`, or the wallpaper on `<body>` paints over it. Uncommitted.
- 2026-10-31: Menu bar: removed the status and LinkedIn link, added Wi-Fi and a battery icon. The battery
  shows the visitor's real level where the browser shares it (`navigator.getBattery`, Chromium only),
  otherwise full. Section links now hide below 800px. Uncommitted.
- 2026-10-31: Desktop menu bar improved: name, section menu with the open window highlighted (source
  `menu_bar`), "Open to PM roles" status, a LinkedIn link and the clock, on refined translucent glass.
  The status hides below 1100px and the menu below 900px. `Clicked Contact Method` gained placement
  `menu_bar`. Uncommitted.
- 2026-10-31: **Phone loading.** Same sunrise loader on phones, on the wallpaper's horizon; it counts
  from the start of the page load and ends as soon as the app is ready. Sections, Search and old About
  concepts load on demand. Amplitude and Firebase load after the page settles (`lib/analyticsClient.ts`);
  events wait and arrive in order, so session replay starts slightly later. Removed the second copy of
  gtag from `layout.tsx`: Firebase Analytics already loads it, and both sent page views. On throttled 4G
  the wait for the home screen went from ~6.3s to ~3.0s and JS from 1,111 KB to ~630 KB.
- 2026-10-31: Committed all work above as 4c905ba on `dev`, fast-forwarded `prod`, pushed both. Preflight: build, secrets and
  links pass; lint errors and asset warnings are existing backlog items.
- 2026-10-31: All desktop windows now open centred and slightly above the middle (`bottom: 9vh`), not
  only About. True centre applies from 1280px wide on tall screens and 1500px on short ones; smaller
  laptops centre left of the icons so nothing is covered. Uncommitted.
- 2026-10-31: **Phone Back button** (`PhoneBack.tsx`): Back closes the open prototype, section or Search
  and lands on home; on home the first press shows "Press back again to exit" and the second leaves the
  site. Uses a history guard added on the visitor's first tap (Chrome skips entries added without a
  gesture, so before any tap one Back leaves, as on any site). `searchOpen` moved to `WindowContext`.
  History writes now keep `history.state`. Phone wallpaper is a portrait crop of the desktop photo,
  `public/wallpaper-phone.webp`, cropped so the moon sits between the two small widgets (replaces the
  mountain, which stays on disk for pages loaded before this deploy). Uncommitted.
- 2026-10-31: **One window theme on desktop:** the translucent dark glass from Case Studies now lives in
  `globals.css` (`.os-window:not(.ios-app)`) and applies to every window. Experience, Education and
  Contact got dark-theme text and cards in their own `.os-window:not(.ios-app)` blocks; Contact lost the
  tilted dashed box and red underline and is now a 560px fit-to-content note with one row of actions.
  Phones unchanged. Uncommitted.
- 2026-10-31: **Case Studies window redesigned (desktop):** dark glass matching About Me; Crop Guide is
  a brand-blue feature with a fan of three real screens and a three-number proof row (`card.stats`);
  "Products I've shipped" is a hairline list instead of boxed cards. All in a
  `.os-window:not(.ios-app)` block in `Projects.module.css`, so the phone layout is untouched. In windows
  under 900px wide one phone replaces the fan; on screens under 830px tall large windows centre left of
  both icon columns. Uncommitted.
- 2026-10-31: Desktop icon and window title say "About Me" again. Uncommitted.
- 2026-10-31: Added Kissan Sampurna and Gau Sampurna to the desktop with their app icons; one click opens
  the prototype. `.desktop-grid` fills downward; below 830px tall the five sections stay in one column
  and the two apps sit in a second column on their left. Uncommitted.
- 2026-10-31: New desktop wallpaper `public/wallpaper-desktop.webp` from the owner's Unsplash photo
  (replaces black and the Earth photo, whose webp was deleted). The About window's prototype buttons are
  now a plain row: "View prototype", then the two app names as text links, no icons or boxes. Wallpaper
  is 2880px at WebP quality 92 (321 KB) because the sky gradient bands when compressed harder; the
  window glass is deeper so small text stays readable over the bright horizon. Uncommitted.
- 2026-10-31: Removed the desktop work items (Kissan, Gau, Crop Guide, Freemium Growth); the desktop is
  one column of sections. With nothing to point at, the light beams and dots went too. The coloured
  words in the About text are now plain links: products opens Kissan, PRD the Crop Guide case study,
  growth the Case Studies window. Uncommitted.
- 2026-10-31: Menu bar is translucent grey; the travelling light on the About window's edge is gone (a
  plain thin border replaces it). Uncommitted.
- 2026-10-31: Desktop wallpaper set to solid black at the owner's request (`body` background in
  `globals.css`), and the loader no longer waits for an image (1.75s). `public/wallpaper-earth.webp` is
  kept in case the Earth photo returns. Phones keep the mountain wallpaper. Uncommitted.
- 2026-10-31: **New desktop loader:** a sunrise over a dark Earth limb with the owner's name, opening onto
  the wallpaper (replaces the light grey retro screen and its fake progress bar). It waits for the
  wallpaper to decode (1.75s minimum, 3s maximum). Both layouts are in the markup and CSS picks one, so a
  phone never flashes the desktop version; the phone keeps its approved iOS boot. Uncommitted.
- 2026-10-31: About window hierarchy pass: reading order is who → what → proof → next step. Name is
  the largest text and the stats step down; the subtitle no longer repeats the job title; spacing groups
  stats with the app buttons; "Get in touch" is the single solid action, with LinkedIn and Email as
  quiet links. Window raised slightly (`bottom: 9vh`). Uncommitted.
- 2026-10-31: About window moved to true screen centre from 1100px wide (owner's call; below that it
  would overlap the desktop items, so it centres in the free space); larger section windows stay
  centred in the free space beside the desktop items so they don't cover them. All windows are now
  vertically centred. Added two "View prototype" buttons (Kissan, Gau) under the stats. Uncommitted.
- 2026-10-31: About window: photo enlarged to 112px with no ring; the words products, PRD and growth
  are plain coloured text with no box (they glow on hover and still send their beams). Uncommitted.
- 2026-10-31: About text restyled for reading (same words): first sentence leads at 17px, the current
  role follows smaller and muted; the coloured words are soft tinted highlights on the text baseline,
  not filled pills, with 1.75 line height so they never touch across lines. Uncommitted.
- 2026-10-31: About text now uses the owner's approved description word for word (`profile.about`
  mirrors `profile.intro`; `{tag:word}` marks the pills: products, PRD, growth). The Team India line is
  gone from the window. Wallpaper is static again (owner's call): `Wallpaper.tsx` removed, the image is
  back on `<body>` only. Uncommitted.
- 2026-10-31: **About window, wow pass** (owner: the quiet version "looks plain", also asked which
  position is better). Dark frosted-glass window with a travelling rim of light and a pointer glow
  (`AboutCard.module.css`, styled through `.os-window:has(.card)`); turning status ring on the portrait;
  stats with count-up (`CountUp.tsx`, shared with the phone hero). Hovering a pill draws beams of light
  to the matching desktop items, behind the glass so they never cross the text. **Position decision:** windows are
  centred in the free space left of the desktop items, slightly above the middle (optical centre),
  rather than in the corner. Fixed section padding that used `calc(var(--line-height) * 1.5)` (unitless,
  so the browser dropped it). Uncommitted.
- 2026-10-31: **Desktop redesigned in a quiet "note on a desktop" style** (owner's reference: Samuel Lo's
  portfolio; style only, content is the owner's). About is now a 468px light window in the top-left
  (`AboutCard.tsx`, text in `profile.about`) with margin labels, plain prose and coloured pills. Pills
  match the dots on desktop work items (`--tag-build/grow/write`, `DesktopTag`): hovering lights them up
  via `html[data-tag]`. `.desktop-grid` is two columns: work as screenshot thumbnails on the left,
  sections on the right; items open on one click. Menu bar is only the name and a clock with seconds
  (section links and dropdown removed). All windows anchor top-left, traffic lights are grey until
  hovered, dotted background removed. Phones unchanged. Earlier concepts remain at
  `/?about=live | showcase | store | native | classic` until the owner confirms, then remove them and
  the `?about` checks in `Hero.tsx` and `DraggableWindow.tsx`. Also fixed section padding that used
  `calc(var(--line-height) * 1.5)`: `--line-height` is unitless, so the browser dropped the rule.
  Uncommitted.
- 2026-10-31: Removed the desktop music widget at the owner's request (no longer rendered in `page.tsx`;
  `MusicPlayer.tsx`, `src/data/music.ts` and `public/music/` are kept, so it can return). New desktop
  wallpaper `public/wallpaper-earth.webp` (NASA, Earth at night, Unsplash photo from the owner, 2880px,
  195 KB). `wallpaper.jpg` stays for pages loaded before this deploy. Phones keep the approved mountain wallpaper. The new wallpaper has bright streaks,
  so desktop folder labels sit on dark glass, the selected tile is dark glass with a bright rim, and
  tiles are 112px wide so no label clips. The menu bar is now dark with light text, as macOS draws it
  over a dark wallpaper, and the dark window has a light rim to separate it from the night sky.
  Uncommitted.
- 2026-10-31: **About window is now a live app** (owner: "still not impressed"; static layouts were not
  enough). `AboutLive`, the desktop default: a dark window with the real prototype running in a phone
  (`about/LiveApp.tsx`, code loaded on demand, poster until then). The rail switches Kissan/Gau and
  jumps to features, opening on each feature's best screen (reports, not hubs); tapping inside the
  phone updates the rail. Screen maps moved to `prototype/{kissan,gau}/screenMap.ts`, shared with the
  viewer. Dark title bar via `.os-window:has(.dark)`. Older concepts stay reachable at
  `/?about=showcase | store | native | classic` until the owner confirms. Uncommitted.
- 2026-10-31: **About window, three concepts** (owner rejected the cleaned-up classic hero: "explore
  more"). Built in `components/about/AboutConcepts.tsx`: **Showcase** (default: real app screens on a
  brand panel), **App Store** (Mandar as a product page: info row + 4 screenshots), **About This Mac**
  (spec sheet). Compare on desktop at `/?about=showcase | store | native | classic`; the switch lives in
  `Hero.tsx`. Remove the unused concepts and the switch once the owner picks. Phones keep `ClassicHero`
  (the iOS layout). Screens captured from the prototypes at 2× into `public/about/`. Showcase layout
  then rebalanced (owner: "improve the layout"): two whole staggered phones sized from the panel, each
  label on the side its phone leaves open, a smaller headline, and KPIs on their own hairline row.
  Uncommitted.
- 2026-10-31: **About window redesign + selected folder** (owner: "think like an expert UI/UX
  designer"). Desktop icons stay highlighted while their window is on screen (`aria-current`; cleared
  on minimize/close). Hero: one blue accent instead of red, whole-line entrance (per-letter spans broke
  kerning), no sparkle or dotted background, clean rounded photo with an "Open to PM roles" badge
  (`profile.availability`), KPIs as a hairline strip with no fake hover lift, matching CTA pair, larger
  app links. New tokens in `globals.css`. About window height is now `max(64vh, 580px)`. Menu bar text
  no longer wraps at 1024 and the tray spacing tightens below 1100px. Phone tab bar gives "Case Studies"
  a wider column below 400px (it truncated at 320 and 360). Phone About keeps its layout; only the
  accent, entrance motion and KPI label changed. Uncommitted.
- 2026-10-31: **Content synced with the owner's updated LaTeX resume.** `resume.ts`: 25K+ MAU; peak
  usage added (satellite 9.8K+ MAU / 1.6K+ DAU, crop guide 7.7K+ MAU, crop diagnosis 4.8K+ MAU);
  funnel figures replaced (onboarding-to-trial 2.4% → 7.2%, trial-to-paid 27% → 30%, install-to-signup
  +3%; previously 2.4% → 8%, 55%, 26% → 32%); tools now list Mixpanel + Amplitude instead of Power BI +
  Exotel; fuller summary. Crop Guide case study uses 7.7K+ MAU in the card, glance and outcomes; the
  "national scale" headline was dropped. Kissan paywall PM note corrected. Uncommitted.
- 2026-10-31: **Solution section explains the product feature by feature** (owner: take inspiration
  from esh.works/teachup). The sideways strip of 7 screens became cards with the phone beside a named
  feature, "What it does" and "Why it works this way" (`FeatureList`, data `solution.beforeReport` /
  `afterReport`, either side of the annotated report; hero phones moved to `heroScreens`). Only
  existing verified facts; TeachUp's primary-research evidence was not copied because the owner has
  not supplied any. Verified at 320 / 393 / 768 / 1024 / 1440: no overflow, no broken images.
  Uncommitted.
- 2026-10-30: At-a-glance simplified, consulting-style (owner: "minimal, simple, intuitive"):
  **The challenge → Our approach → The impact**, one thin progress line with a dot per beat (last
  dot filled), small blue label, one plain takeaway with numbers bold in place, one supporting
  sentence. No icons, colour-coding or big numbers; single accent. Vertical line on phones. Gotcha:
  `.page ol { padding: 0 }` outranks a single class, so the panel uses `.glance .glancePanel`.
  Uncommitted.
- 2026-10-30: **At-a-glance panel + Apple font fix.** The Problem / Solution / Outcome strip is now
  one white panel lifted over the hero's bottom edge: tinted icon, one defining number (42% /
  3 questions / 655K+), caption, sentence; arrow chips on the dividers; stacks on phones. Data moved
  from `tldr` to `glance` in `caseStudies.ts`. **Font fix:** the Apple-detection script used
  `next/script beforeInteractive`, which Next queues in its JS runtime, so Chrome on a Mac painted
  Inter first. It is now a plain inline `<script>` in `<head>` (`layout.tsx`). Verified: with all
  Next JS blocked Chrome/macOS renders `.SF NS` (SF Pro); Safari engine (WebKit, iPhone + Mac)
  measures as the system font, not Inter; Android/Windows render Inter. Uncommitted.
- 2026-10-30: **Case study page redesign** (owner: "rich design components, shouldn't look vibe
  designed"). New design language, an editorial "field report": full-bleed brand hero (Kissan blue
  canvas, field-row texture, three phones in bezels), At-a-glance strip, sticky "On this page"
  contents with scroll-spy + reading-progress bar (`components/case-study/ReadingNav.tsx`), section
  headlines that state the takeaway (`headlines` in the data), hairline rules instead of cards.
  Purpose-built figures: 10×10 **waffle chart** (42.2% advice access), stat strip, pull-quote problem
  statement, lime-highlighted HMW, persona fact sheets, **journey map** with stages as columns and an
  SVG emotion curve (marked "illustrative"; vertical timeline on phones), numbered principle rows,
  numbered flow of device-framed screens, **annotated report** (markers in the margin with leader
  lines; `anatomy.callouts` x/y are % of the screenshot), engine **funnel** (100+ crops → filter →
  score → rank → top 5), decision log (D1–D4), navy outcomes panel, measurement-plan table, CTA with
  a phone bleeding off the edge. (The old column layout needed explicit grid columns; the 2026-10-31 card layout doesn't.) Verified desktop 1440 and phone 393 section by section; no overflow, no errors.
  Uncommitted.
- 2026-10-30: **Apple typography site-wide.** `--font-system` is now platform-aware: Apple devices
  render SF Pro (verified `.SF NS` in Chrome on macOS), Android/Windows render **Inter** (verified,
  previously Roboto/Segoe UI). `layout.tsx` adds Inter (`next/font/google`, one 48 KB variable
  woff2, preloaded) and a pre-paint script that sets `html.apple`; `@supports (font:
  -apple-system-body)` covers Safari/iOS without JS. Six duplicated stacks in `globals.css` now use
  the variable. Prototypes keep Lato. Case study top bar no longer wraps on phones (name hidden
  below 520px). `ui-design-system` skill updated. `tsc` and `next build` pass; lint unchanged.
  Uncommitted.
- 2026-10-30: **Case Studies + first case study (Crop Guide)**. Renamed Projects → Case Studies
  (window title, desktop folder, menu bar, phone app with an `IoReader` glyph, Spotlight). New page
  `/case-studies/crop-guide`: problem with 7 checked sources (PIB/Agriculture Census, NSO 77th round,
  IDinsight 2019 + 2020 RCT, Hortidaily 2025 glut, Prem Chand et al. 2021), 3 composite personas, the
  current crop-choice journey with pain points, insight→principle mapping, the solution (7 real
  prototype screenshots, the engine's filter→score→rank logic from the owner's scoring reference v4,
  a decisions/trade-offs table), outcomes, what to measure next, learnings, and a CTA into the
  prototype. Fixed along the way: the new `?flow=` deep link initially froze prototype navigation
  because `goTo`'s position ref was hard-coded to `0/0`; it is now seeded from the starting flow.
  Desktop folder labels wrap to two lines like macOS instead of truncating ("Case St…",
  "Experien…"). Verified desktop 1440 and phone 393/320 (no overflow, no errors), Spotlight,
  `?section=` on both layouts, 404 for unknown slugs; `tsc` and `next build` (SSG) pass; lint
  unchanged. Uncommitted. **Owner to confirm:** the reason for dropping risk/fodder/labour in v3
  (written as "kept the questionnaire short").
- 2026-10-22: **Prototype design size, font size and family pass** (owner: "make sure the font size and
  family is correct"). (1) Kissan was scaled as a 375pt linear design; it is a 393pt `@ms` design, so
  text was 4.8% too big on the reference iPhone, 9.5% on a 430pt Pro Max and 6% too small at 320pt.
  Now matches the app's formula exactly at every width (measured). Gau already used the right linear
  model. Desktop frame is the app's own device (Kissan 393 × 852, Gau 375 × 812). (2) Lato Black added
  (141 heavy texts on 40 screens rendered as Bold), Poppins added for Gau Account/Edit Profile, fonts
  moved to subset WOFF2 (113 KB for 7 faces vs 148 KB for 2 TTFs). (3) ~110 text styles corrected
  against source, incl. Gau Account/Profile, scan top bar (22/600), language/contact/about/welcome
  (RFValue tokens), shop/checkout/trading/report/notification rows and Kissan crop-guide and
  farm-report rows. Verified: 0 overflow / clipped text on all 128 screens at 320/393/430pt; `tsc`,
  lint, `next build` pass. Committed as 304f979, pushed to `dev` and `prod`; verified on the live site.
- 2026-10-21: **Prototype asset audit** (live site, all 128 screens): every `<img>`, CSS background
  (weather, satellite, paywall, camera) and SVG `<image>` (farm map) loads and looks right (contact
  sheets reviewed). Found and fixed: on **phones the prototypes rendered in the system font, not
  Lato**. The compiler silently dropped `.screen :global(*)` in `PrototypeMobile.module.css`, so only
  the outer box got Lato and the global `* { font-family: system !important }` won on every element
  inside. Now `.screen *`. Desktop viewer was unaffected (it already used `.screenContent *`).
  **Gotcha:** don't use `:global(*)` in CSS modules here; use a plain `*` after a local class.
- 2026-10-21: "Images not showing" investigation. Live site is **https://mandar-desurkar.vercel.app**
  (the repo's homepage link `mandar-website.vercel.app` is stale: DEPLOYMENT_NOT_FOUND; per-deploy
  URLs are behind Vercel login). Every image is committed with exact case; every section and all
  128 prototype screens load with 0 failed images on the live site in Chrome, and WebKit (Safari
  engine, Playwright) renders the phone home correctly. Only defect: the deleted `profile-new.jpg`
  404'd for pages loaded before the deploy → restored as a copy of the new photo.
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
