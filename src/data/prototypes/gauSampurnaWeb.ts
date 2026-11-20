// Interactive prototype of the Gau Sampurna website (gausampurna.com), the D2C store for the same
// dairy farmers the Gau Sampurna app serves. Recreated from the site's own code (Next.js storefront,
// read-only reference) and its live pages: layout, copy, catalogue, prices and images are the site's
// own (prices and product content as on the live site on 19 Nov 2026; product photos are the store's
// originals; delivery dates use the site's rule, 5 business days). Synced on 19–20 Nov 2026 with the
// site's redesigned product page, cart drawer, checkout and three-step add-address flow. The cart, the
// addresses and the order are samples: nothing is sent anywhere.
// Each screen renders the phone layout (mSite) or the desktop layout, switched in the viewer.
import type { Prototype } from "./kissanSampurna";

export const gauSampurnaWebPrototype: Prototype = {
  id: "gau-sampurna-web",
  name: "Gau Sampurna Website",
  tagline: "D2C cattle care store, on phone and desktop",
  logo: "/prototypes/gau-website/logo.webp",
  device: { width: 390, height: 844, scaling: "none" },
  web: { domain: "gausampurna.com", desktop: { width: 1280, height: 760 } },
  flows: [
    {
      id: "web-shop",
      title: "Shop & checkout",
      summary: "Home → products → product page → cart / checkout → order confirmed",
      screens: [
        {
          id: "gw-home",
          title: "Home",
          path: "/",
          note: "Most buyers are dairy farmers on a phone, often ordering for the first time online. So the first screen answers the two fears before any product: the lime strip says Free Delivery and Cash on Delivery, and the trust row adds Vet Approved and KMF Certified. Best sellers show the prepaid price under the cash price, and a 4-step How it works ends with \"Pay cash on delivery\". View Cart and Call stay pinned at the bottom: many farmers would rather phone than fill a form.",
        },
        {
          id: "gw-products",
          title: "Products",
          path: "/products",
          note: "Shop by need, not by SKU: categories are the cow's problem (Increase Milk, Udder Care, Calf Nutrition, Summer Problem), drawn as icons for low-literacy readers. Each card leads with the outcome in the farmer's words (\"15% More Milk, Higher Fat and SNF\"), then rating, price against MRP, the prepaid price and the delivery date, so nobody has to open a product to compare. Stuck? \"Cannot decide which one to buy?\" puts a phone number in front of them.",
        },
        {
          id: "gw-product",
          title: "Product page",
          path: "/products/dairy-fortune/10kg",
          note: "Built so a first-time online buyer never has to scroll back up. The price panel leads with the pack (\"10 Kg\") and the price per kg, the farmer's real comparison. One lime strip carries the only highlighted message, \"Pay only ₹1,755 with Online Payment\", with a sheen and a wiggling % badge. Delivery is a date plus the farmer's own pincode check. Reviews come before the FAQ (proof, then the last doubts), show the previous challenge each farmer had, and always keep one critical review near the top, which makes the rating believable. Scroll past Add to Cart and a bottom bar takes over: price, pack and Add, which splits into Add and Checkout once the cart has something. Try it: add, then Checkout opens the cart as a drawer over the page",
        },
        {
          id: "gw-checkout",
          title: "Checkout",
          path: "/cart",
          note: "From the code: \"Say each thing once.\" Pay Online is pre-selected and wears a \"Best price\" ribbon; the saving is stated once (\"Save ₹195\") and its logos are the UPI apps farmers already use (GPay, PhonePe, Paytm). Cash on Delivery stays one tap away, but choosing it surfaces a lime \"Pay only ₹X with Online Payment\" strip in the bottom bar and, on Place Order, a check: \"You'll miss an online discount\". Each item shows what it saves and its delivery date; \"Highly recommended for you\" adds with one tap without leaving checkout. The address is one line in the bottom bar; Change opens the saved addresses and Add Address starts the three-step flow. Opened from a page, this is a drawer; opened directly, it is the page",
        },
        {
          id: "gw-confirmed",
          title: "Order confirmed",
          path: "/order-confirmation",
          note: "Confirmation repeats what a cash buyer needs to trust the order: the order number, a delivery date, where it's going and the total to keep ready. Sample order; nothing was placed.",
        },
      ],
    },
    {
      id: "web-address",
      title: "Add a delivery address",
      summary: "Pincode → pin on the map → details, then back to checkout",
      screens: [
        {
          id: "gw-addr-pincode",
          title: "Pincode",
          path: "/add-new-address",
          note: "Built for first-time, phone-only farmers. The first question is the one they actually have, \"Can you deliver to me?\", answered before anything else is typed: the check runs on its own at 6 digits and names the place back. If the answer is no, the screen offers a phone number and another try instead of a dead end. GPS can fill the pincode for anyone who doesn't know it. Try 571428 (delivers) or 110001 (doesn't).",
        },
        {
          id: "gw-addr-map",
          title: "Pin on the map",
          path: "/add-new-address?step=map",
          note: "The map opens on that pincode and the farmer moves the map under a fixed pin, which is easier on a phone than dragging a small pin. The sheet reads back the place in words, so a farmer who can't read a map can still check it. Many rural users don't read maps at all, so \"Skip map, type address\" is always there. The site uses Google Maps; this map is illustrated.",
        },
        {
          id: "gw-addr-details",
          title: "Address details",
          path: "/add-new-address?step=details",
          note: "Most of the form is already filled: the pincode gives taluk, district and state, and the name and phone come from the account, so usually only \"house no. & street\" is typed. The phone line says why it matters (\"Delivery partner will call this number\"). Each step is its own URL, so the phone's back button walks back through the steps instead of throwing the farmer out. Save address returns to checkout with it selected.",
        },
      ],
    },
    {
      id: "web-swastha",
      title: "Gau Swastha",
      summary: "AI cow health report from one photo, on the web and WhatsApp",
      screens: [
        {
          id: "gw-swastha",
          title: "Gau Swastha",
          path: "/gau-swastha",
          note: "The website's landing page for the AI health report the app also runs. It sells one photo, one report: three steps (upload, AI analysis, report), what the report covers, and three ways in (the app, the website, a WhatsApp number), because many farmers live in WhatsApp rather than in apps. The FAQ says plainly that it is not a substitute for a vet. Copy is the live page's.",
        },
      ],
    },
    {
      id: "web-trading",
      title: "Cattle Trading",
      summary: "Post a cow for sale, AI price check, buyers call directly",
      screens: [
        {
          id: "gw-trading",
          title: "Cattle Trading",
          path: "/cattle-trading",
          note: "Selling a cow usually goes through a broker. The page pitches the opposite: post for free in three steps, check the price with the AI scanner, and buyers call or WhatsApp the seller directly, with payment on pickup. Copy is the live page's.",
        },
      ],
    },
    {
      id: "web-vet",
      title: "Ask a Vet",
      summary: "Book a call or video consultation with a vet",
      screens: [
        {
          id: "gw-vet",
          title: "Ask a Vet",
          path: "/veterinary-consultation",
          note: "Vets are scarce in villages, so the site books one remotely: a short form (cattle type, age, weight, pregnant or not, a photo and the problem) and a vet calls back. Try it: Book Consultation shows the confirmation. Nothing is sent.",
        },
      ],
    },
  ],
};
