// Interactive prototype content for Gau Sampurna (dairy farming app), opened from the hero's
// "Apps I've built" card. Screens are recreated from the `prod` branch of
// silo-prod/gausampurna-react-app (code/screens/gau-swastha-tenant/* and shared screens; scan flow and
// reports synced to 5b36102 on 2026-11-04): real colours, Lato,
// English copy and artwork. Report values are illustrative sample values; PM notes are editable.
import type { Prototype } from "./kissanSampurna";

export const gauSampurnaPrototype: Prototype = {
  id: "gau-sampurna",
  name: "Gau Sampurna",
  tagline: "AI dairy farming app",
  logo: "/prototypes/gau-sampurna/logo.png",
  // code/helpers/responsive.js: a 375 × 812 base, with padding, margins, widths and font sizes
  // scaled by the window width (fonts by min(width, height) ratio, the same on phones)
  device: { width: 375, height: 812, scaling: "linear" },
  flows: [
    {
      id: "gs-home",
      title: "Home",
      summary: "Herd, scans and shop on one screen",
      screens: [
        {
          id: "gs-home",
          title: "Home",
          note:
            "The home screen is a daily dashboard, not a menu. A health-alert banner opens a two-step symptom check that routes straight into a scan, quick actions cover the three jobs farmers come for (scan a cow, add a cow, call the helpline), then the herd card, recent scans and vet-picked products. The herd card names one cow and one thing to do (\"Critical result — open her report today\"), picked by a priority ladder from a critical result down to healthy, instead of listing every cow with a badge. Scan sits in the middle of the tab bar as the one action that matters most.",
        },
      ],
    },
    {
      id: "disease-check",
      title: "AI Disease Check",
      summary: "Scan tab → one side photo → 31-disease screening",
      screens: [
        {
          id: "gs-hub",
          title: "Scan hub",
          note:
            "Triage first. The urgent \"Cow unwell or Off-feed?\" path sits on top in a dark card, routine scans below, and the 360° report last. The cow is chosen up front (Change Cow opens the My Herd sheet), so every AI report is tied to an animal in the herd. The scan counter was taken out of the header: how many scans are left is said by the gate that admits a scan, not by the page.",
        },
        {
          id: "gs-loading",
          title: "Setting up",
          note:
            "Before the camera opens, the app checks the subscription and the scan quota. Doing it here, not after the photo, means a farmer never takes a photo only to hit a paywall.",
        },
        {
          id: "gs-capture",
          title: "Photo guide",
          note:
            "Coach the photo before the model sees it. One side-profile photo powers disease screening and body analysis, so simple tips (full profile, level angle, daylight, nothing blocking) protect accuracy for everything downstream. Open Camera now opens the app's own camera; the gallery skips straight to review.",
        },
        {
          id: "gs-camera",
          title: "Camera",
          note:
            "The app's own camera instead of the phone's: on Android the OS camera and crop screen differ on every handset. A framing box (4:3 for a side profile, square for dung) with a hint pill shows where the cow goes, and the same box is the crop window later.",
        },
        {
          id: "gs-confirm",
          title: "Review photo",
          note:
            "The photo fills the screen with the question on top and a round ✕ / ✓ pair below, the same shape as Kissan's crop camera, so a farmer who uses both apps meets one interaction. Cropping is opt-in: Crop Photo opens an in-app cropper locked to the framing box's shape.",
        },
        {
          id: "gs-analyzing",
          title: "Analyzing",
          note:
            "Show the pipeline. Named steps make 15–30 seconds of AI inference feel like progress rather than a frozen screen, and the tip asks farmers not to close the app.",
        },
        {
          id: "gs-ready",
          title: "Report ready",
          note:
            "What a farmer needs off the scan, in order: how many of the 31 were found, which one is most likely and how sure the model is, whether a vet has to see the cow, then detected and suspected findings and a tally of what was ruled out and what the photo could not show. Suspected is never shown as clear.",
        },
        {
          id: "gs-diagnosis",
          title: "Diagnosis",
          note:
            "One pass over all 31 diseases, read from the real response: a Most likely verdict with the model's reasoning, a Detected / Suspected / Ruled out / Unchecked tally, \"A vet should see this cow\" with a free call, and finding cards (what the photo shows, why, points against, urgency, how to confirm and treat, questions only the farmer can answer). About a third of a real screening comes back not assessable, so those are grouped by body part into the photos worth retaking. Nothing is blurred: the scan was paid for when it started. Sample values for this demo.",
        },
        {
          id: "gs-error",
          title: "Scan error",
          note:
            "Errors are honest and recoverable: Try Again returns to the camera. The code deliberately stopped sending start-up failures to the paywall, because that misled farmers whose plan was fine.",
        },
      ],
    },
    {
      id: "animal-status",
      title: "Animal Status",
      summary: "Breed, body score, milk capacity, health checks",
      screens: [
        {
          id: "gs-hub-status",
          title: "Scan hub",
          note:
            "Routine scans are framed by outcome (\"Weight & Health Score\", \"Final Price Estimate\") rather than by technology, with Recommended / Instant labels to guide the choice.",
        },
        {
          id: "gs-capture-status",
          title: "Photo guide",
          note: "The same side-profile guide as the disease check: one photo habit serves every body scan.",
        },
        {
          id: "gs-camera-status",
          title: "Camera",
          note: "The same in-app camera and 4:3 framing box as every side-profile scan.",
        },
        {
          id: "gs-confirm-status",
          title: "Review photo",
          note: "Full-screen review with ✕ / ✓ and an optional crop, before the scan is spent.",
        },
        {
          id: "gs-analyzing-status",
          title: "Analyzing",
          note: "The same pipeline UI for every scan type keeps the experience predictable as new AI checks are added.",
        },
        {
          id: "gs-breed",
          title: "Breed select",
          note:
            "The only question that survived simplification. When the model can't name the breed, the farmer picks the closest match and the same scan re-runs with that breed, so grading and price aren't guesses. Earlier calving and symptom questionnaires were removed to cut drop-off.",
        },
        {
          id: "gs-ready-status",
          title: "Report ready",
          note: "Breed and grade, then up to four figures, two to a row (weight, BCS, milk, value). A figure the model could not read is left out rather than shown as N/A.",
        },
        {
          id: "gs-status-report",
          title: "Status report",
          note:
            "The whole report, open to everyone who ran the scan: health check counts, detailed checks, AI summary, the pattern detected, breed purity, economic figures, key findings, recovery plan, ration and daily feed. The frosted premium layer and the Unlock Full Report banner were removed, because the free tier's own report was being shown locked. Sample values for this demo.",
        },
      ],
    },
    {
      id: "market-value",
      title: "Market Value",
      summary: "One photo → a fair price before buying or selling",
      screens: [
        {
          id: "gs-hub-market",
          title: "Scan hub",
          note: "Market Valuation is labelled Instant: the farmer usually checks it while standing next to a seller.",
        },
        {
          id: "gs-capture-market",
          title: "Photo guide",
          note: "Adds an \"Udder clearly visible\" tip, because udder size drives the milk estimate and therefore the price.",
        },
        {
          id: "gs-camera-market",
          title: "Camera",
          note: "The same in-app camera: the framing box keeps the whole udder inside the shot.",
        },
        {
          id: "gs-confirm-market",
          title: "Review photo",
          note: "Same full-screen review as every scan.",
        },
        {
          id: "gs-analyzing-market",
          title: "Analyzing",
          note: "Runs the exact Animal Status pipeline; the only difference is a market flag on the request.",
        },
        {
          id: "gs-udder",
          title: "Udder not detected",
          note:
            "If the model can't see the udder, the farmer chooses: re-upload for an accurate price, or continue with a partial report that clearly says why the price is missing. No made-up numbers.",
        },
        {
          id: "gs-ready-market",
          title: "Report ready",
          note: "The estimated value leads the figures, ahead of milk, because price is the question this scan answers.",
        },
        {
          id: "gs-market-report",
          title: "Valuation report",
          note:
            "A focused layout, not the long status report: big photo, the price range, then the four facts a buyer argues about (breed purity, BCS, lactation, weight) and a yes/no buying recommendation. Sample values for this demo.",
        },
      ],
    },
    {
      id: "dung-scan",
      title: "Dung Scan",
      summary: "Feed and digestion check from a dung photo",
      screens: [
        {
          id: "gs-hub-dung",
          title: "Scan hub",
          note: "The cheap, popular habit scan. Weekly dung checks catch feed problems before milk drops.",
        },
        {
          id: "gs-capture-dung",
          title: "Photo guide",
          note: "Dung-specific tips: fresh (under an hour), top-down, whole pile, good daylight.",
        },
        {
          id: "gs-camera-dung",
          title: "Camera",
          note: "A square framing box, because a top-down dung pile is square, not a side profile.",
        },
        {
          id: "gs-confirm-dung",
          title: "Review photo",
          note: "Same full-screen review, asking whether the whole dung sample is visible.",
        },
        {
          id: "gs-analyzing-dung",
          title: "Analyzing",
          note: "The fastest scan (10–15 seconds), which suits a daily or weekly habit.",
        },
        {
          id: "gs-ready-dung",
          title: "Report ready",
          note: "A 1–5 manure score with its status, what the sample looked like, the possible causes and when to scan again. A score of 1 or 5 also says a vet should see the cow, before the full report.",
        },
        {
          id: "gs-dung-results",
          title: "Dung report",
          note:
            "Plain language in three cards (What we see / What it means / What to do), a 5-point scale where 3 is healthy, one product \"recommended for her\", and a vet line with live availability. A dung scan without a cow prompts \"Add this cow\", turning a one-off scan into herd tracking. Sample values for this demo.",
        },
      ],
    },
    {
      id: "full-health",
      title: "360° Health Report",
      summary: "Pro-only: status + disease prediction + nutrition",
      screens: [
        {
          id: "gs-hub-full",
          title: "Scan hub",
          note: "The premium scan gets the gold treatment and sits last, after the free scans have shown value.",
        },
        {
          id: "gs-gate-full",
          title: "Plan gate",
          note:
            "Free plans have a 0 limit for the full report, so the gate explains \"not included in your current plan\" and offers Upgrade instead of failing silently. Upgrade opens the Pratham plan flow.",
        },
        {
          id: "gs-capture-full",
          title: "Photo guide",
          note: "As a Pro member: the same side-profile photo now powers body, disease and nutrition analysis at once.",
        },
        {
          id: "gs-camera-full",
          title: "Camera",
          note: "The same in-app camera and side-profile framing box.",
        },
        {
          id: "gs-confirm-full",
          title: "Review photo",
          note: "Same full-screen review step.",
        },
        {
          id: "gs-analyzing-full",
          title: "Analyzing",
          note: "Five steps and 1–2 minutes. The longer wait is explained up front because this scan checks every body system.",
        },
        {
          id: "gs-ready-full",
          title: "Report ready",
          note: "Breed and grade with weight, BCS, milk and value, two to a row.",
        },
        {
          id: "gs-full-report",
          title: "Full health report",
          note:
            "One long report with Status / Diseases / Nutrition anchors so farmers jump to what they care about. Disease prediction is grouped by body system with expandable interpretation and recommendation. Sample values for this demo.",
        },
      ],
    },
    {
      id: "gs-history",
      title: "Scan History & Reports",
      summary: "Every past scan, filterable by type and cow",
      screens: [
        {
          id: "gs-history",
          title: "Scan history",
          note:
            "One list for all five report types. Colour-coded date badges make the type scannable, and two chip rows (scan type, cow) answer the farmer's real questions: \"what did the last dung scan say?\" and \"how has Gowri been?\". Scans not linked to a cow are labelled honestly as \"Unlinked scan\".",
        },
        {
          id: "gs-reports",
          title: "Reports tab",
          note:
            "When delivery isn't available at the farmer's pincode, the Shop tab would be a dead end, so the tab bar swaps it for Reports. A Total Scans card shows the habit, and filters live in a bottom sheet with Apply / Clear all so the list doesn't jump while choosing.",
        },
        {
          id: "gs-scan-chat",
          title: "Scan chat (older sessions)",
          note:
            "Older scans ran as a guided chat. Their sessions still open as a read-only replay, with VIEW FULL REPORT linking into today's report screens, so history isn't lost when the flow was redesigned.",
        },
      ],
    },
    {
      id: "gs-herd",
      title: "My Herd",
      summary: "Herd dashboard, cow profiles, add a cow",
      screens: [
        {
          id: "gs-herd",
          title: "Herd summary",
          note:
            "One switcher for the whole herd: Summary plus an avatar per cow, with a status dot on each, so a sick cow is visible before the farmer taps anything. The dashboard puts counts (Critical / Scan Due / Healthy) above money (herd value, total milk) because health is the action and money is the reason. Weekly dung scans are pushed as the cheap early-warning habit.",
        },
        {
          id: "gs-cow-details",
          title: "Cow profile",
          note:
            "Each cow page answers \"what is she worth and what is she costing me\": current vs potential milk, the estimated monthly profit loss, and the supplement that closes the gap, with Add to Cart right there. Market value, last scan and a \"New Scan for Gowri\" CTA keep the next step one tap away. Cards only render when the backend has real numbers, so nothing is invented. Sample values for this demo.",
        },
        {
          id: "gs-add-cow",
          title: "Add cow",
          note:
            "Registration asks only what the AI and the yield maths need: a side photo, name, breed, calvings, pregnancy, milking and last calving. Follow-up questions appear only when relevant (months pregnant, litres per day, last calved), and Save stays disabled until the required answers are in.",
        },
      ],
    },
    {
      id: "gs-shop",
      title: "Shop & orders",
      summary: "Browse → product → checkout → order tracking",
      screens: [
        {
          id: "gs-shop",
          title: "Shop tab",
          note:
            "Commerce follows the scans. The shop leads with products recommended from the farmer's own scan results, a marquee of the four purchase blockers we heard most (delivery fee, COD, quality, price), then categories by problem (\"Increase Milk\", \"Mastitis Free\") instead of by product type. The crop-field promo cross-sells our sister app Kissan Sampurna.",
        },
        {
          id: "gs-search",
          title: "Search",
          note: "Search covers product names and the problem words farmers actually type (\"milk\", \"mastitis\"). Empty and no-result states always suggest a next step.",
        },
        {
          id: "gs-product",
          title: "Product page",
          note:
            "Built for first-time online buyers: verified badge, price per feed (₹/100 g) so a ₹2,340 bag doesn't feel expensive, a 10%-off-online square to nudge prepaid, free delivery with the date, and trust cards (1 lakh farmers, KMF certified, vet recommended). Reviews come from named farmers with their district.",
        },
        {
          id: "gs-cart",
          title: "Checkout",
          note:
            "One screen from cart to payment. Pay Online carries a 10% discount to shift orders away from COD (fewer returns), the bill shows total savings in green, and the address card sits right above the CTA so the farmer always sees where it's going. Change opens saved addresses in a sheet.",
        },
        {
          id: "gs-address-map",
          title: "Pin on map",
          note: "Rural addresses are hard to type, so the address starts with a pin on the map. Delivery partners find farms by the pin, not the text.",
        },
        {
          id: "gs-address-add",
          title: "Add address",
          note: "Fields match how rural India addresses work (village, taluk, district), with landmark optional and Home / Farm tags because many farmers want delivery at the farm.",
        },
        {
          id: "gs-confirmation",
          title: "Order placed",
          note: "Confirmation restates delivery date, address, items and bill, and offers View Order Details or Return Home.",
        },
        {
          id: "gs-orders",
          title: "My Orders",
          note: "Orders are searchable by product or order number, with a coloured status pill per order.",
        },
        {
          id: "gs-order-details",
          title: "Order details",
          note: "A five-step progress bar (Placed → Confirmed → Packed → Shipped → Delivered) answers \"where is my order?\" before the farmer calls support. Sample orders for this demo.",
        },
      ],
    },
    {
      id: "gs-trading",
      title: "Cattle Trading",
      summary: "Buy and sell cattle with AI-verified listings",
      screens: [
        {
          id: "gs-trading",
          title: "Trading tab",
          note:
            "A marketplace built around trust. Every card leads with photos, breed, location and the three numbers buyers ask first (milk per day, lactation, age), then price and seller, and ends in Call or WhatsApp, because cattle deals in rural India close on a phone call, not a cart. Verified listings carry a green badge.",
        },
        {
          id: "gs-cattle-details",
          title: "Cattle details",
          note:
            "The Gau Swastha AI report (breed grade, BCS, milk yield, market value) is the differentiator: an independent check of the seller's claims. Unverified sellers see it blurred with a Get Verified prompt. Contact buttons stay pinned to the bottom.",
        },
        {
          id: "gs-sell-upload",
          title: "Sell: photos",
          note: "Listing starts with front, side and rear photos (plus an optional walking video), the same angles the AI needs for verification, so one upload serves both buyers and the model.",
        },
        {
          id: "gs-sell",
          title: "Sell: details",
          note: "The form mirrors what buyers filter on. Breed options switch with Cow / Buffalo, and every field is required so listings are comparable.",
        },
        {
          id: "gs-sell-verify",
          title: "Get verified (₹49)",
          note:
            "Monetisation at the moment of highest intent: right after listing, sellers can pay ₹49 to get an AI-verified badge (\"Verified reports attract better buyers & fair prices\"). Coupons support field-team promotions, and Skip keeps it optional.",
        },
      ],
    },
    {
      id: "gs-pratham",
      title: "Pratham plan (paywall)",
      summary: "3-step paywall → ₹1 trial → success",
      screens: [
        {
          id: "gs-pratham",
          title: "1 · Trust",
          note:
            "Trust before price. Step 1 is a farmer testimonial video (in the farmer's language) and a rotating trust card: 1 lakh+ farmers, built with vets, a real farmer quote, our own supplements, local language. No price yet; the CTA is just \"See What's Included\".",
        },
        {
          id: "gs-pw-features",
          title: "2 · What's included",
          note:
            "Value in the farmer's words, one line per tool (\"Spot LSD, mastitis and lameness early\"), plus the allowance (36 reports a year) so the plan feels concrete.",
        },
        {
          id: "gs-pw-checkout",
          title: "3 · Plan (₹1 trial)",
          note:
            "The price arrives last, over a hero photo: ₹1 trial, then ₹399/yr, and a Today / Day 6 / Day 8 timeline that says exactly when billing starts and that we'll remind them first. Removing billing anxiety is what makes a ₹1 trial convert.",
        },
        {
          id: "gs-pw-success",
          title: "Trial active",
          note: "Confirms what was charged today, when it renews and when the reminder comes. No surprises later means fewer refunds and chargebacks.",
        },
        {
          id: "gs-pw-failed",
          title: "Payment failed",
          note:
            "A failed mandate keeps the farmer on the plan screen with a clear banner and a Retry Payment CTA, instead of dumping them back to the app.",
        },
        {
          id: "gs-pw-expired",
          title: "Plan expired",
          note: "Returning users whose plan lapsed see the same hero, but no trial: \"Your annual plan has expired\" and a straight Subscribe for ₹399.",
        },
        {
          id: "gs-pw-success-annual",
          title: "Annual plan active",
          note: "The annual variant of the success screen shows the real renewal date from the backend, and nothing if it's missing.",
        },
      ],
    },
    {
      id: "gs-account",
      title: "Account",
      summary: "Profile, plan, orders, language and support",
      screens: [
        {
          id: "gs-account",
          title: "Account",
          note:
            "The profile header shows the farmer's state at a glance (farm added? how many cows? which plan?), and the plan tag doubles as the upgrade entry point. Quick actions cover the three settings farmers actually change: profile, language and address.",
        },
        {
          id: "gs-profile",
          title: "Edit profile",
          note: "The phone number is the login, so it's locked with a Contact Support path rather than editable inline.",
        },
        {
          id: "gs-notifications",
          title: "Notifications",
          note: "Every notification deep-links to the exact screen it's about (a report, an order, a due scan, a listing). Unread items are tinted, with Mark all read.",
        },
        {
          id: "gs-language",
          title: "Language",
          note: "11 Indian languages, each shown in its own script first and English second, so a farmer recognises their language without reading English.",
        },
        {
          id: "gs-addresses",
          title: "Saved addresses",
          note: "Home and Farm addresses with a default, edit and delete (with confirmation). Add Address reuses the map-pin flow from checkout.",
        },
        {
          id: "gs-about",
          title: "About us",
          note: "Brand story and vision from Silo Fortune, kept short and visual.",
        },
        {
          id: "gs-contact",
          title: "Help & support",
          note: "Three channels ranked by urgency (toll-free call, email, WhatsApp) with support hours stated up front.",
        },
      ],
    },
    {
      id: "gs-welcome",
      title: "Welcome & sign-up",
      summary: "Splash → language → phone login → onboarding",
      screens: [
        {
          id: "gs-splash",
          title: "Splash",
          note: "Brand moment while auth state loads. First launch goes to language selection; returning users go straight to Home or login.",
        },
        {
          id: "gs-language-first",
          title: "Choose language",
          note: "Language comes before login, because a farmer who can't read the login screen never logs in. 11 languages, each in its own script.",
        },
        {
          id: "gs-login",
          title: "Phone login",
          note:
            "Phone number only, no password: +91 is pre-filled and the CTA wakes up at 10 digits. The footer promise (\"Used only to send scan results, vet calls, and delivery updates. Never shared\") answers the trust question before it is asked. Truecaller one-tap login is used when available.",
        },
        {
          id: "gs-otp",
          title: "Verify code",
          note: "A 4-digit code (not 6) with auto-advance between boxes, a visible resend timer and a one-tap Change for typos.",
        },
        {
          id: "gs-register",
          title: "Create account",
          note: "Registration asks for a name and nothing else; email is optional. Every extra field costs sign-ups.",
        },
        {
          id: "gs-onboarding",
          title: "Onboarding",
          note: "Four slides, one promise each (health, milk, price, records) with three feature chips, and Skip always available. It ends on Home rather than a scan, so the farmer sees the whole app first.",
        },
      ],
    },
  ],
};
