// Content of the Gau Sampurna website prototype, taken from the live site (gausampurna.com) and its
// code: catalogue (names, claims, packs, ratings, prices as listed in November 2026), categories,
// testimonials, FAQs and contact details. Images are the site's own, resized, in
// public/prototypes/gau-website/.
import { useSyncExternalStore } from "react";

export const img = (file: string) => `/prototypes/gau-website/${file}`;

export const PHONE = "6361957466";
export const EMAIL = "customercare@gausampurna.com";
// Pay Online takes 10% off the order (DISCOUNT_PERCENTAGE in the site's cart)
export const ONLINE_DISCOUNT = 0.1;

export type Product = {
  id: string;
  name: string;
  claim: string;
  pack: string;
  rating: number;
  reviews: number;
  price: number;
  mrp: number;
  image: string;
};

export const PRODUCTS: Product[] = [
  { id: "dairy-fortune", name: "Dairy Fortune", claim: "15% More Milk, Higher Fat and SNF, Better Income", pack: "10 Kg", rating: 4.9, reviews: 3850, price: 1950, mrp: 2600, image: img("p-dairy-fortune.webp") },
  { id: "immune-fortune", name: "Immune Fortune", claim: "2X Faster Recovery, Zero Stress, Steady Yield", pack: "3 x 1L", rating: 4.8, reviews: 1180, price: 1500, mrp: 1650, image: img("p-immune-fortune.webp") },
  { id: "gau-dip", name: "Gau Dip", claim: "99% Bacteria Kill, Protected Teats, Pure Milk", pack: "3 x 1L", rating: 4.6, reviews: 960, price: 1350, mrp: 1500, image: img("p-gau-dip.webp") },
  { id: "bovi-vita", name: "Bovi Vita", claim: "Save 100% Cow Milk, Fast Growth, Extra Income", pack: "1 L", rating: 4.6, reviews: 3700, price: 1300, mrp: 1450, image: img("p-bovi-vita.webp") },
  { id: "udder-fortune", name: "Udder Fortune", claim: "Instant Calcium, Zero Milk Fever, Maximum Yield", pack: "1 L", rating: 4.5, reviews: 1050, price: 1350, mrp: 1500, image: img("p-udder-fortune.webp") },
  { id: "bovi-hep", name: "Bovi Hep", claim: "Save 100% Cow Milk, Fast Growth, Extra Income", pack: "5 L", rating: 4.7, reviews: 830, price: 1550, mrp: 1700, image: img("p-bovi-hep.webp") },
  { id: "achala", name: "Achala Milk Replacer", claim: "Save 100% Cow Milk, Fast Growth, Extra Income", pack: "3 x 1Kg", rating: 4.8, reviews: 3710, price: 1050, mrp: 1200, image: img("p-achala.webp") },
];

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];
export const offPct = (p: Product) => Math.round(((p.mrp - p.price) / p.mrp) * 100);
export const prepaid = (price: number) => Math.round(price * (1 - ONLINE_DISCOUNT));
export const inr = (n: number) => Math.round(n).toLocaleString("en-IN");

export const CATEGORIES = [
  { name: "Increase Milk", image: img("c-increase-milk.webp") },
  { name: "Pre-Delivery Care", image: img("c-pre-delivery.webp") },
  { name: "Cattle Health", image: img("c-cattle-health.webp") },
  { name: "Udder Care", image: img("c-udder-care.webp") },
  { name: "Calf Nutrition", image: img("c-calf.webp") },
  { name: "Weakness Care", image: img("c-weakness.webp") },
  { name: "Summer Problem", image: img("c-summer.webp") },
  { name: "Mastitis Free", image: img("c-mastitis.webp") },
];

export const TESTIMONIALS = [
  { name: "Ramesh Gowda", place: "Mandya, Karnataka", product: "Dairy Fortune", text: "I was worried about my cow's low milk yield during the summer. After using Dairy Fortune for 3 weeks, her health improved significantly and the daily yield increased by 15%." },
  { name: "Praveen Kumar", place: "Tumakuru, Karnataka", product: "Trans Fortune", text: "Used during calving and recovery was smooth. No milk fever this time and milk production resumed quickly." },
  { name: "Kavitha Nair", place: "Chikkamagaluru, Karnataka", product: "Immune Fortune", text: "Using for both cows and goats. Health issues have reduced and productivity has improved." },
  { name: "Dinesh Gowda", place: "Hassan, Karnataka", product: "Gau Dip", text: "Mastitis cases have reduced significantly after using Gau Dip. Very effective for udder hygiene." },
  { name: "Mahesh B", place: "Mandya, Karnataka", product: "Udder Fortune", text: "Very effective in reducing swelling and keeping udder healthy. Quick visible results." },
];

export const HOME_FAQ = [
  { q: "Will the product really reach my village?", a: "Yes. We deliver to every district in Karnataka. If your pincode works at checkout, we will deliver." },
  { q: "Can I pay cash when the product arrives?", a: "Yes. Cash on Delivery is available on every order, with no extra charge. Free delivery on every order, no minimum amount." },
  { q: "How do I know the product is genuine?", a: "Every pack is dispatched directly from our Bengaluru warehouse, with a holographic seal and batch code printed on the pack. No third-party sellers." },
  { q: "What if I have a problem after delivery?", a: `Call us on ${PHONE} between 7 AM and 7 PM, any day of the week. A real person from our team will help you.` },
  { q: "Are these products safe for my cow?", a: "Every product is veterinary-approved, formulated in India by dairy nutrition experts, and trusted by 40,000+ Karnataka farmers since 2019." },
];

// The site computes delivery as 5 business days from today (lib/deliveryDate.js)
export function deliveryDate(from = new Date()) {
  const d = new Date(from);
  let added = 0;
  while (added < 5) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) added++;
  }
  return new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "short" }).format(d);
}

export { useDesktop } from "./webMode";

// ---------- Cart (survives moving between screens; resets when the prototype closes) ----------

export type Pay = "online" | "cod";
type CartState = { lines: Record<string, number>; pay: Pay; viewing: string };
let cart: CartState = { lines: {}, pay: "online", viewing: "dairy-fortune" };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const EMPTY: CartState = { lines: {}, pay: "online", viewing: "dairy-fortune" };

export function useCart() {
  const state = useSyncExternalStore(subscribe, () => cart, () => EMPTY);
  const count = Object.values(state.lines).reduce((a, b) => a + b, 0);
  return { ...state, count };
}

export const cartActions = {
  setQty(id: string, qty: number) {
    const lines = { ...cart.lines };
    if (qty <= 0) delete lines[id];
    else lines[id] = qty;
    cart = { ...cart, lines };
    emit();
  },
  add(id: string) {
    cartActions.setQty(id, (cart.lines[id] ?? 0) + 1);
  },
  setPay(pay: Pay) {
    cart = { ...cart, pay };
    emit();
  },
  view(id: string) {
    cart = { ...cart, viewing: id };
    emit();
  },
  reset() {
    cart = { ...EMPTY };
    emit();
  },
};

export function totals(lines: Record<string, number>, pay: Pay) {
  let subtotal = 0;
  let mrpTotal = 0;
  for (const [id, q] of Object.entries(lines)) {
    const p = productById(id);
    subtotal += p.price * q;
    mrpTotal += p.mrp * q;
  }
  const promo = pay === "online" ? Math.round(subtotal * ONLINE_DISCOUNT) : 0;
  const potentialPromo = Math.round(subtotal * ONLINE_DISCOUNT);
  return { subtotal, mrpTotal, savings: mrpTotal - subtotal, promo, potentialPromo, grand: subtotal - promo };
}
