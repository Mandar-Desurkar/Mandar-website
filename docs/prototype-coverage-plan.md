# Prototype coverage plan (Kissan Sampurna + Gau Sampurna)

Owner request (2026-10-21): the app prototypes miss many screens and flows. Gau Sampurna should show
**every flow, screen and design**. Kissan Sampurna should show the **complete** flows for the features
already on display (Crop Doctor, Crop Guide, Farm Monitoring) plus the missing **Weather detail** page.
The owner's flow charts (`FMFM-KS Flow.pdf`, `KS Flow_cr.pdf`) are the reference for Farm Monitoring
and Crop Guide. Tick items off as they ship, so nothing gets skipped across sessions.

**Sources** (read-only clones in `_external/`, never run):
- Kissan: Crop Doctor from `prod` (`kissansampurna-app-prod`); Crop Guide, Farm Monitoring, Home and
  Weather from `dev` (`kissansampurna-app`). Weather differs between branches only in two nav targets.
- Gau: `prod` (`gausampurna-app-prod`). In prod, both tenants render the **Gau Swastha** home and the
  5-tab bar **Home · Herd · Scan (centre) · Shop · Trading**. The repo docs
  (`docs/gau-swastha-screens.md`, `docs/gau-swastha-screen-flow.md`) lag behind the code; **the code wins**.

**Method per screen:** read the screen file (layout, colours, sizes, copy via `en` i18n), recreate it
in the prototype's 375×812 frame with real assets, add a PM note, wire taps (`next`, `go(screenId)` for
branches, `goToFlow` for cross-feature links, `back`), then verify in headless Chrome.

Viewer infra: `ScreenProps` gains `back()` and `go(screenId)` (jump within the current flow) so
branching flows (YES/NO paths) can be shown inside a single flow.

---

## Kissan Sampurna

Tabs: Home · Guide · Scan · Monitor · Account.

### K1 Home & Weather (new, dev)
- [x] Home (`home/home-new.jsx`): weather card, quick actions, season guide, my crops, diagnosis,
      recent scans, mandi prices, crop advice, farm monitor CTA, my farm, tab bar
- [x] Weather report (`weather-forecast-v2-screen.jsx`): location + today, week's major event,
      action banner, forecast & actions (Today / Tomorrow / This Week tabs, show more), more weather
      details, more for your farm. Rendered in the Heavy Rain theme. (The v2 file has no extra
      sub-views; farm context / disease risk / next scan cards are commented out in the source.)

### K2 AI Crop Doctor (prod)
- [x] Crop Doctor home + info alert + tab bar; select crop (7 categories with tints, request link)
- [x] Category crops, request crop (+ submitted alert)
- [x] Camera (frame, gallery, shutter) + photo guide sheet; review (✓/✕) + scanning overlay
- [x] Analysis loading view (laser un-blur, tips, 3 checkpoints) rebuilt from `disease-report-detail`
- [x] Report rebuilt from `disease-report-rv2` + all `components/disease-report/*` sections
- [x] Healthy result; report history (`crop-disease-screen.jsx`)
- Skipped as dead routes (nothing links to them in prod): `high-risk-leaf-report`,
  `crop-disease-payment-screen`, `crop-details-screen`. The live paywall is K6.

### K6 Free trial & plan (prod, `SubscriptionScreen3` + `PaymentStatusScreen2`)
- [x] Story & trust (video + review carousel), what's included, plan + ₹1 trial timeline + confirm
      modal, trial active

### K3 Crop Guide (dev, per `KS Flow_cr.pdf`)
- [x] Start / select farm (+ tab bar), has-farm path: season → budget → farm type → report
- [x] No-farm path: location (GPS / pincode) → season → growing? → YES: crop → sowing date /
      NO → previous crop (skip) → irrigation → budget → farm type → farm name → report
- [x] Report: added comparing banner + alternative pick (tap a crop), weather suitability,
      risks & solutions, practical tips, soil & economic benefits, more for your farm
- [x] No crop fits; Crop Guide history
- Note: the chart's "Add a farm instead" on the location step is not in the dev code (the
  select-farm screen's "+ Add another farm" starts the new-farmer path instead).

### K4 Farm Monitoring: setup (dev, per `FMFM-KS Flow.pdf`)
- [x] My Farms (mapped card + NO IMAGE / location-pending card, info sheet, + Add Farm, tab bar)
- [x] Add-farm questions: growing? → YES: crop → sowing / NO: previous crop → irrigation → name
- [x] Mark your farm (+ save-for-later dialog) → draw boundary (search, tip, undo/redo/clear) or
      walk to mark (Add Pin, pins/acres, Confirm) → setup complete
- Note: the chart's "How it works" video popup and two summary variants are not in the dev code
  (copy keys exist but are unused); the single setup-complete design is shown.

### K5 Farm Monitoring: report & management (dev)
- [x] Satellite report + View Full Details, change-stage sheet, more for your farm
- [x] Kebab menu: History, Update Farm (Crop → confirm → update crop + sowing, Rename dialog,
      Water Irrigation → update + confirm, Map Change → edit mark + update boundary), Delete dialog
- [x] Full details (growth timeline, pest & disease risk, leaf moisture, heat, good habits)
- [x] History (grouped by day) → report; no-crop (pre-planting) report; generating state

---

## Gau Sampurna (prod)

13 flows / 76 screens (2026-10-21). Code: `src/components/prototype/gau/Gau*.tsx` (one file per area,
shared UI in `GauShared.tsx`), flows and PM notes in `src/data/prototypes/gauSampurna.ts`. The old
`GauScreens.tsx` / `gau.module.css` (built on Kissan's base styles) were replaced.

### G1 Welcome & sign-up (`GauWelcome.tsx`)
- [x] Splash (auto-advances), first-launch language (11 languages), phone login (+91, 4-digit code),
      OTP (auto-advance boxes, resend timer, change number), create account (name, optional email),
      onboarding (4 slides + feature chips, art from the app's public S3 bucket)

### G2 Home (`GauHome.tsx`)
- [x] Home: header (location, bell, avatar), health-alert carousel + 2-step symptom sheet, quick
      actions, My Herd, Recommended, Recent Scans, Explore Dairy Supplies, stats banner, products, tab bar
- Dead in prod (not built): farm onboarding (add-your-farm / about-your-farm / farm-acknowledge,
  `useFarmGate` unused), the old Gau Sampurna home (`code/screens/home/*`) with Nandini rate and
  herd score card, its chatbot / plan / premium screens, semen analysis, `(details)/category`.

### G3 Herd (`GauHerd.tsx`)
- [x] My Herd pager: Summary (dashboard KPIs, herd value, total milk, registered cattle, important
      update, recommended) and cow profile (hero, lactation + profit loss + supplement, market value,
      last scan, new scan CTA, profile details, scan history), Edit Cow modal
- [x] Add Cow (side photo + source sheet, breed picker, calvings stepper, pregnant → months,
      milking → litres, last calved ranges)
- Note: Herd tab, `/(farm)/herd-health` and `/(farm)/cow-details/[id]` all render `my-herd-screen`;
  `cow-details-screen.jsx` and `all-cows-screen.jsx` are unrouted.

### G4–G7 AI scans (`GauScan.tsx` + `GauReports.tsx`)
- [x] New Scan hub (1/1 counter, Upgrade to Pro gradient pill, cow card + My Herd sheet with
      Select/Selected + Add New Cow, all five scan cards launch their flows)
- [x] Orchestrator steps: LOADING, IMAGE_CAPTURE (per-type tips), IMAGE_CONFIRM, ANALYZING (per-type
      steps), BREED_SELECT, REPORT_READY / DX / DUNG variants, ERROR, Udder Not Detected modal,
      Feature Not Available gate (360° on the free plan)
- [x] Diagnosis report (5 sections, premium sections frosted, vet card, Unlock Full Report banner)
- [x] Animal Status report (all sections incl. detailed checks, AI summary, pattern, purity,
      economics, key findings, health params, recovery plan, diet tabs, daily ration, vet, disclaimer)
- [x] Market Value focused report; 360° Full Health report (Status / Diseases / Nutrition anchors,
      disease prediction by body system, unlocked for Pro); Cow Dung report (scale, what we see /
      means / do, recommended for her, vet availability, score guide, add this cow)
- Dead / removed in code (docs are stale): disease symptom questionnaire (Dx L1/L2), calving
  select, uploading step, cow picker screen (replaced by the hub's herd sheet), identity check.

### G8 History & reports (`GauHistory.tsx`)
- [x] Scan history (type + cow chips), Reports tab (shown instead of Shop when not serviceable;
      total scans, filter sheet), scan chat replay

### G9 Pratham subscription (`GauPratham.tsx`)
- [x] Paywall: trust (video + carousel) → features → checkout (₹1 trial timeline), payment failed,
      plan expired, trial active, annual active
- Dead: `plan-details`, `pratham-plan-benefits`, `free-plan-details` (linked only from the old home
  and chatbot).

### G10 Shop (`GauShop.tsx`)
- [x] Shop tab, search, product detail, checkout (payment options, bill, address sheet), pin on map,
      add address, order placed, My Orders, order details
- Dead: `order-summary` (only from the unused choose-address screen), `myorders/my-orders-screen`
  and its track-order / review screens (the account links to `order-list-screen`).

### G11 Cattle trading (`GauTrading.tsx`)
- [x] Trading tab (All / My Cattle, type chips, filter sheet), cattle details (AI report), sell:
      photos → details → listed alert → verify (₹49 + coupon)

### G12 Account (`GauAccount.tsx`)
- [x] Account, edit profile, notifications, language, saved addresses (edit/delete), about, help &
      support. Log Out returns to the login screen.

---

## Verification
- [x] `tsc`, `eslint` on the prototype files, `next build` (2026-10-21)
- [x] Headless Chrome: all 13 Gau flows / 76 screens and all Kissan flows render with no console
      errors or collapsed images; every `goToFlow` / `go` target resolves (script check)
- [x] Assets resized/compressed: Gau 1.8 MB (99 files), Kissan 3.4 MB, loaded only when opened
- [x] `docs/PROJECT_CONTEXT.md` updated
