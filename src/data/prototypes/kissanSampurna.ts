// Interactive prototype content for Kissan Sampurna (opened from Experience / Projects).
// Screens are recreated from the app's real code, assets and English copy (kissansampurna-app):
//   - AI Crop Doctor: `prod` branch (the live design; identical to dev for these screens)
//   - Crop Guide and Farm Monitoring: `dev` branch
// Screen ids must be unique across flows. PM notes explain the product reasoning; edit freely.

export type PrototypeScreen = { id: string; title: string; note: string };
export type PrototypeFlow = { id: string; title: string; summary: string; screens: PrototypeScreen[] };
export type Prototype = {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  flows: PrototypeFlow[];
};

export const kissanSampurnaPrototype: Prototype = {
  id: "kissan-sampurna",
  name: "Kissan Sampurna",
  tagline: "AI farming app for Indian farmers",
  logo: "/prototypes/kissan-sampurna/logo.webp",
  flows: [
    {
      id: "home-weather",
      title: "Home & Weather",
      summary: "Daily dashboard → weather report with actions",
      screens: [
        {
          id: "k-home",
          title: "Home",
          note:
            "Weather leads because it decides today's work. The card turns a forecast into one headline, one piece of advice and one warning. Below it, four big quick actions cover the jobs farmers open the app for, and the rest of the feed (scans, mandi prices, crop advice, farm monitoring) is re-ordered by the concerns the farmer picked during onboarding. Every empty state is a coloured call to action instead of a blank list.",
        },
        {
          id: "k-weather",
          title: "Weather report",
          note:
            "A forecast farmers can act on. Every hour or day pairs the condition with an action (\"Skip spraying; leaves are wet\"), the week's biggest event is pinned on top with an alert badge, and the speaker button reads the report aloud. The backend picks the theme per condition (Heavy Rain is shown here) and the call-to-action banner, so the screen can push the right next step (scan the crop, add a farm) without an app release. Tabs and Show more are live. Sample values for this demo.",
        },
      ],
    },
    {
      id: "crop-doctor",
      title: "AI Crop Doctor",
      summary: "Pick crop → photo → AI diagnosis → treatment plan",
      screens: [
        {
          id: "crop-doctor",
          title: "Crop Doctor",
          note:
            "Set expectations before the camera opens. Three pictorial steps (photo → report → action) explain the feature without much reading, which matters for first-time smartphone users. The ⓘ button repeats the promise in one line. Free users who have used up their scans are routed to the paywall (see Free trial & plan) from this CTA.",
        },
        {
          id: "select-crop",
          title: "Select crop",
          note:
            "Crop first, photo second, so the diagnosis has context. A curated row of popular crops covers most farmers in one tap, seven category tiles handle the long tail, and \"Can't find your crop?\" turns missing coverage into a demand signal. Try Cereals or Request Crop.",
        },
        {
          id: "cd-category",
          title: "Category crops",
          note:
            "One list per category, each row a picture plus name, so farmers recognise their crop instead of reading for it. Search sits on top for those who prefer typing.",
        },
        {
          id: "cd-request",
          title: "Request a crop",
          note:
            "Only the crop name is required; description and region are optional. A low-effort form gets more requests, and region tells the team where to collect training images first.",
        },
        {
          id: "scan-method",
          title: "Scan method",
          note:
            "Coach the photo, not just the model. \"Clear photo, better diagnosis\" plus a do/don't guide tackles blurry and far-away shots before they reach the AI.",
        },
        {
          id: "cd-camera",
          title: "Camera",
          note:
            "A custom camera instead of the system one: a framing box (\"Hold the plant inside the box\"), gallery on the left, one big shutter. The ⓘ button opens a close-vs-far photo guide that can be read aloud in the farmer's language.",
        },
        {
          id: "cd-review",
          title: "Review photo",
          note:
            "Confirm before spending a scan. ✓ uploads and runs a quality check, ✕ retakes, so a blurry photo never burns a report. Bad photos come back with the model's reason instead of a wrong diagnosis.",
        },
        {
          id: "analyzing",
          title: "AI analysis",
          note:
            "The backend takes 40–90 seconds, so the wait is designed: a green laser sweeps the photo and un-blurs it, three named checkpoints (colour spectrum, disease pattern, damage) tick off, and farming tips rotate in the meantime. Compressed to a few seconds here.",
        },
        {
          id: "report",
          title: "Diagnosis report",
          note:
            "Lead with urgency and money, not Latin names. Severity colours the whole report (healthy / moderate / high), zoomed crops of the photo show the exact early signs found, and revenue loss is shown per acre of the farmer's own farm (tap the timeline or a farm). Then a dated, checkable day-by-day plan, preventive actions, and links into Weather, Farm Monitor and Crop Guide. Content is the app's own sample report.",
        },
        {
          id: "cd-healthy",
          title: "Healthy result",
          note:
            "Good news is a result too. A healthy crop gets a clear green confirmation on the photo itself, with a quick way to scan another plant.",
        },
        {
          id: "cd-history",
          title: "Report history",
          note:
            "Every scan is kept, newest first, with crop, disease, date and severity, so farmers can compare a re-scan with the first report. A new scan is always one tap away at the top.",
        },
      ],
    },
    {
      id: "crop-guide",
      title: "Crop Guide",
      summary: "Farm or location → a few questions → top crops",
      screens: [
        {
          id: "cg-start",
          title: "Select your farm",
          note:
            "Two entry paths. A farmer with mapped farms picks one, and the wizard then skips everything the farm already knows (location, crop, irrigation), so only season, budget and farm type are asked. \"+ Add another farm\" starts the full new-farmer path. Free users out of crop-advice credits see the paywall first.",
        },
        {
          id: "cg-location",
          title: "Where is your farm?",
          note:
            "New-farmer path. Current location is one tap; a 6-digit pincode is the fallback when GPS is denied or the farmer is away from the field. The answer also seeds a farm in Farm Monitoring.",
        },
        {
          id: "cg-season",
          title: "Planting season",
          note:
            "One question per screen, answered with pictures. Big image cards make a recommendation engine usable for low-literacy farmers, and the questions come from the server, so the questionnaire can change without an app release.",
        },
        {
          id: "cg-growing",
          title: "Growing a crop?",
          note:
            "Branch point. YES asks which crop and when it was sown, so the advice can plan around the standing crop; NO skips straight to the previous crop. The green confirmation (\"let's track it!\") hints that Farm Monitoring will follow this crop.",
        },
        {
          id: "cg-crop",
          title: "Which crop is growing?",
          note:
            "A searchable picture grid of the crop catalogue, shared with Farm Monitoring so both features name crops the same way.",
        },
        {
          id: "cg-sowing",
          title: "Sowing date",
          note:
            "Relative presets (this week, last week, a month ago) instead of a calendar, because farmers remember sowing by weeks, not dates. A custom date stays available.",
        },
        {
          id: "cg-previous",
          title: "Previous crop",
          note:
            "Crop rotation matters for soil and pests, but it's optional: Skip keeps the wizard moving for farmers who don't remember.",
        },
        {
          id: "cg-irrigation",
          title: "Water source",
          note:
            "Multi-select, because most farms mix water sources (rain plus borewell or canal). Water access is one of the strongest filters on which crops can actually work.",
        },
        {
          id: "cg-budget",
          title: "Budget per acre",
          note:
            "Ask for money in bands, not exact figures. Farmers answer ranges easily, and each band maps to a level of seed, fertilizer, labour and protection spend.",
        },
        {
          id: "cg-farm-type",
          title: "Farm type",
          note:
            "Livestock changes the advice (fodder crops, manure). On the has-farm path this is the last question, so the button becomes \"See Crop Recommendations\".",
        },
        {
          id: "cg-farm-name",
          title: "Name your farm",
          note:
            "Last step for a new farmer. Naming the farm creates it in Farm Monitoring, turning a one-off recommendation into an ongoing relationship with the field.",
        },
        {
          id: "cg-report",
          title: "Recommendation",
          note:
            "Explain the pick, don't just rank it. A % match, a pass/fail fit check, weather needs, risks with fixes, practical tips and soil/income benefits make a top-5 out of 100+ crops (ranked across 655K+ farm profiles) feel trustworthy. Tap another crop in the comparison to open it as an alternative pick. \"Go to my farm\" hands off into Farm Monitoring. Sample values for this demo.",
        },
        {
          id: "cg-no-fit",
          title: "No crop fits",
          note:
            "An honest dead end: when nothing fits, the farmer's credit isn't used and the screen offers the seasons where crops do fit, one tap to re-run.",
        },
        {
          id: "cg-history",
          title: "Crop guide history",
          note:
            "Every past run with its top pick and score, and each recommended crop as a chip that opens its report directly. Runs where nothing fitted aren't saved.",
        },
      ],
    },
    {
      id: "farm-monitoring",
      title: "Farm Monitoring: setup",
      summary: "My Farms → a few questions → map the field",
      screens: [
        {
          id: "fm-my-farms",
          title: "My Farms",
          note:
            "Every farm as a card with its satellite thumbnail, crop and acreage. A farm saved without a boundary shows \"NO IMAGE · Locate your Farm\" so unfinished setups are easy to resume. The ⓘ sheet explains what monitoring shows (crop health, water, weather impact, early alerts) with social proof. Free users past their farm limit hit the paywall from + Add Farm.",
        },
        {
          id: "fm-q-grow",
          title: "Growing a crop?",
          note:
            "Questions come before the map, and the farm is saved first, so \"Save for later\" on the next step still leaves a real farm. YES tracks the standing crop (crop → sowing date); NO asks for the previous crop to plan the next season.",
        },
        {
          id: "fm-q-crop",
          title: "Which crop?",
          note:
            "Six popular crops as designed picture tiles, then the full catalogue below, with a typo-tolerant search (\"tomto\") and \"Other Crop\" for anything missing.",
        },
        {
          id: "fm-q-sow",
          title: "Sowing date",
          note: "Relative presets (this week, last week, a month ago) plus a custom calendar. The sowing date sets the crop's stage, which drives the advice.",
        },
        {
          id: "fm-q-prev",
          title: "Previous crop",
          note: "NO path: last season's crop helps judge soil nutrients and rotation for the next sowing.",
        },
        {
          id: "fm-q-water",
          title: "Irrigation",
          note: "Multi-select, because many farms combine rain with canal or borewell water. It changes water and fertiliser advice.",
        },
        {
          id: "fm-q-name",
          title: "Name the farm",
          note: "A default name (Farm_3) means zero typing is required; farmers with many plots can name them to tell them apart.",
        },
        {
          id: "fm-mark",
          title: "Mark your farm",
          note:
            "Two ways to map a field: draw it on the map, or walk the boundary dropping pins, for farmers who can't read a satellite view. \"Save for later\" explains what is lost (no report until the farm is located) before exiting.",
        },
        {
          id: "fm-map",
          title: "Draw boundary",
          note:
            "A precise boundary means the satellite readings belong to this farm alone. Village search, a one-time tip, a live acreage estimate and Undo / Redo / Clear all make mistakes cheap.",
        },
        {
          id: "fm-walk",
          title: "Walk to mark",
          note:
            "For farmers who know their land by foot, not from above: stand at each corner and tap Add Pin. Pins too close together are rejected, and the acreage updates as the shape closes. Tap Add Pin to try it.",
        },
        {
          id: "fm-complete",
          title: "Setup complete",
          note:
            "A clear \"your farm is now monitored\" moment, with the next action (See the Insights) front and centre, and adding another farm one tap away.",
        },
      ],
    },
    {
      id: "farm-report",
      title: "Farm Monitoring: report",
      summary: "Satellite report → actions → manage the farm",
      screens: [
        {
          id: "fr-report",
          title: "Satellite report",
          note:
            "From data to action. Satellite indices become red and yellow zones on the farm, then \"Do This\" cards (read aloud in the farmer's language) say exactly what to do, with \"Mark as done\" to close the loop. Confirming or changing the crop stage keeps the advice accurate. The ⋮ menu holds History and every farm edit (crop, rename, irrigation, map, delete). Sample values for this demo.",
        },
        {
          id: "fr-full",
          title: "Full details",
          note:
            "Depth for farmers who want it, kept off the main report: the growth timeline with today's stage, pest and disease risk with a Crop Doctor hand-off, leaf moisture, heat effects and good habits.",
        },
        {
          id: "fr-history",
          title: "History",
          note: "Every past satellite report grouped by day (Today, Yesterday, dates), so a farmer can see whether the field is improving after acting on advice.",
        },
        {
          id: "fr-update-crop",
          title: "Update crop",
          note:
            "Reached from ⋮ → Crop after an \"Are you sure?\" confirmation, because changing the crop resets its stage and advice. Reuses the add-farm crop picker in update mode.",
        },
        {
          id: "fr-update-sow",
          title: "Update sowing date",
          note: "Same sowing step, with Update instead of Continue: the new crop starts over from the chosen date.",
        },
        {
          id: "fr-update-water",
          title: "Update irrigation",
          note: "Starts from the farm's current methods and confirms the change in plain words (\"Change from Drip to Drip, Canal?\") before saving.",
        },
        {
          id: "fr-map-change",
          title: "Map change",
          note: "Redraw or re-walk the boundary when a field is bought, sold or split. The same marking screens in edit mode, without \"Save for later\".",
        },
        {
          id: "fr-map-update",
          title: "Update boundary",
          note: "The boundary editor in update mode; saving regenerates satellite readings for the new shape.",
        },
        {
          id: "fr-nocrop",
          title: "No-crop report",
          note:
            "A field between seasons still gets value: live moisture, soil temperature, weather and UV to plan sowing, plus \"See What to Plant\" into Crop Guide and \"Already Planted?\" to start tracking a crop.",
        },
        {
          id: "fr-generating",
          title: "Generating report",
          note: "Satellite processing takes under a minute; a clear waiting state (and polling in the background) instead of an empty report. Auto-advances here.",
        },
      ],
    },
    {
      id: "subscription",
      title: "Free trial & plan",
      summary: "3-step paywall → ₹1 trial → trial active",
      screens: [
        {
          id: "pw-intro",
          title: "Story & trust",
          note:
            "Sell the outcome before the price. A short farmer video in the user's language, then a rotating strip of trust signals (50,000+ farmers, built with agri scientists, a farmer quote, Amruth Organic, local-language support). Part of the paywall redesign that lifted free-to-paid conversion from 2.4% to 8%.",
        },
        {
          id: "pw-features",
          title: "What's included",
          note:
            "One plan, five tools, each described as a job done (\"Know when to spray, when to wait\") rather than a feature name. The report allowance is shared across tools, so farmers don't have to pick.",
        },
        {
          id: "pw-plan",
          title: "Plan & ₹1 trial",
          note:
            "Remove the fear of being charged. A ₹1 trial with a visible timeline (today, reminder on day 6, plan starts on day 8) and a confirmation that explains why checkout shows ₹399 but only ₹1 is charged. The Proceed button counts down so the message gets read.",
        },
        {
          id: "pw-success",
          title: "Trial active",
          note:
            "Close the loop with exactly what happens next: charged today, renewal day and price, and when the reminder comes. Trust after payment reduces refund requests and churn on day 8.",
        },
      ],
    },
  ],
};
