// Interactive prototype of the Gau Sampurna website (gausampurna.com), the D2C store for the same
// dairy farmers the Gau Sampurna app serves. Recreated from the site's own code (Next.js storefront,
// read-only reference) and its live pages: layout, copy, catalogue, prices and images are the site's
// own (prices as shown on the live site in November 2026; delivery dates use the site's rule, 5 business days). The cart, the address
// and the order are samples: nothing is sent anywhere.
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
      summary: "Home → products → product page → checkout → order confirmed",
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
          note: "The buy box makes paying online the better deal without hiding cash on delivery: \"Pay ₹1,755 only, 10% off with Online Payment\" sits next to the pack price. The delivery promise is a date (\"FREE delivery, all locations\" and the day it arrives), not \"3 to 5 days\". Trust comes before the description: 1,00,000+ farmers, KMF Certified, Vet Approved. Add to Cart turns the bottom bar into a mini cart with Checkout, so the buyer never loses the price.",
        },
        {
          id: "gw-checkout",
          title: "Checkout",
          path: "/cart",
          note: "One page, no steps: items, payment, bill, and an address that is already filled in. From the code: \"Say each thing once.\" Online is pre-selected and the saving is stated once (\"Save ₹X\"). Cash on Delivery stays one tap away, but choosing it surfaces a lime strip in the bottom bar (\"Pay only ₹X with Online Payment\") and, on Place Order, a check: \"You'll miss an online discount\". The return rule is shown before paying, not after.",
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
