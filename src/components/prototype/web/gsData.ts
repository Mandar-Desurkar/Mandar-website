// Content of the Gau Sampurna website prototype, taken from the live site (gausampurna.com) and its
// code: catalogue (names, claims, packs, ratings, prices as listed on 19 Nov 2026), categories,
// testimonials, FAQs and contact details. Images are the site's own, resized, in
// public/prototypes/gau-website/; product photos are the store's originals (gs-products), in
// products/<id>/. Each product page's full content is in gsProducts.ts.
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
  // Live handle, for the page path (/products/<handle>)
  handle: string;
};

const shot = (id: string) => `/prototypes/gau-website/products/${id}/g1.webp`;

export const PRODUCTS: Product[] = [
  { id: "dairy-fortune", handle: "dairy-fortune", name: "Dairy Fortune", claim: "15% More Milk, Higher Fat and SNF, Better Income", pack: "10 Kg", rating: 4.9, reviews: 3850, price: 1950, mrp: 2600, image: shot("dairy-fortune") },
  { id: "immune-fortune", handle: "immune-fortune", name: "Immune Fortune", claim: "2X Faster Recovery, Zero Stress, Steady Yield", pack: "3 x 1L", rating: 4.8, reviews: 1180, price: 1500, mrp: 1650, image: shot("immune-fortune") },
  { id: "gau-dip", handle: "gau-dip", name: "Gau Dip", claim: "99% Bacteria Kill, Protected Teats, Pure Milk", pack: "3 x 1L", rating: 4.6, reviews: 960, price: 1350, mrp: 1500, image: shot("gau-dip") },
  { id: "bovi-vita", handle: "bovi-vita", name: "Bovi Vita", claim: "Save 100% Cow Milk, Fast Growth, Extra Income", pack: "1 L", rating: 4.6, reviews: 3700, price: 1300, mrp: 1450, image: shot("bovi-vita") },
  { id: "udder-fortune", handle: "udder-fortune-h", name: "Udder Fortune", claim: "Instant Calcium, Zero Milk Fever, Maximum Yield", pack: "1 L", rating: 4.5, reviews: 1050, price: 1350, mrp: 1500, image: shot("udder-fortune") },
  { id: "bovi-hep", handle: "bovi-hep", name: "Bovi Hep", claim: "Save 100% Cow Milk, Fast Growth, Extra Income", pack: "5 L", rating: 4.7, reviews: 830, price: 1550, mrp: 1700, image: shot("bovi-hep") },
  // Price changed on the live site in November 2026 (was ₹1,050 / MRP ₹1,200)
  { id: "achala", handle: "achala-milk-replacer", name: "Achala Milk Replacer", claim: "Save 100% Cow Milk, Fast Growth, Extra Income", pack: "3 x 1Kg", rating: 4.8, reviews: 3710, price: 1350, mrp: 1500, image: shot("achala") },
];

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];
export const offPct = (p: Product) => Math.round(((p.mrp - p.price) / p.mrp) * 100);
export const prepaid = (price: number) => Math.round(price * (1 - ONLINE_DISCOUNT));
export const inr = (n: number) => Math.round(n).toLocaleString("en-IN");

// lib/packLabel.js: "10 Kg" → "10 Kg", "1 L" → "1 Litre", "5 L" → "5 Litres", "3 x 1L" → "3 × 1 Litre"
export function packLabel(label: string) {
  const raw = String(label ?? "").trim();
  const m = raw.toLowerCase().match(/^(?:(\d+(?:\.\d+)?)\s*[x×]\s*)?(\d+(?:\.\d+)?)\s*(kgs?|g|gms?|grams?|l|ltrs?|litres?|liters?|ml)\.?$/);
  if (!m) return raw;
  const [, count, amount, u] = m;
  const unit = /^kg/.test(u) ? "Kg" : /^(g|gms?|grams?)$/.test(u) ? "g" : u === "ml" ? "ml" : Number(amount) === 1 ? "Litre" : "Litres";
  return count ? `${count} × ${amount} ${unit}` : `${amount} ${unit}`;
}

// ProductInfo's price per kg / litre: "10 Kg" → ₹195/kg, "3 x 1L" → ₹500/L; none for a single unit
export function perUnit(price: number, label: string) {
  const m = String(label || "").toLowerCase().match(/(?:(\d+(?:\.\d+)?)\s*[x×]\s*)?(\d+(?:\.\d+)?)\s*(kgs?|g|gms?|grams?|l|ltrs?|litres?|liters?|ml)\b/);
  if (!m || !price) return null;
  let amount = Number(m[2]) * (m[1] ? Number(m[1]) : 1);
  let unit = "L";
  if (/^kg/.test(m[3])) unit = "kg";
  else if (/^(g|gms?|grams?)$/.test(m[3])) {
    unit = "kg";
    amount /= 1000;
  } else if (m[3] === "ml") amount /= 1000;
  if (!amount || amount === 1) return null;
  const per = price / amount;
  return { value: per >= 10 ? Math.round(per).toLocaleString("en-IN") : per.toLocaleString("en-IN", { maximumFractionDigits: 1 }), unit };
}

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
export type Address = {
  id: string;
  name: string;
  phone: string;
  street: string;
  locality: string;
  taluk?: string;
  district: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
  pinned?: boolean;
};
// A sample saved address, so checkout works straight away (the add-address flow can add another)
export const SAMPLE_ADDRESS: Address = {
  id: "a1",
  name: "Ramesh Gowda",
  phone: "98450 12345",
  street: "House 12, 3rd Cross, Temple Road",
  locality: "Maddur",
  district: "Mandya",
  state: "Karnataka",
  pincode: "571428",
  isDefault: true,
};
// buyNow: a product being bought on its own (Buy Now checks out a separate one-item cart)
type CartState = { lines: Record<string, number>; pay: Pay; viewing: string; addresses: Address[]; addressId: string; buyNow: string | null };
let cart: CartState = { lines: {}, pay: "online", viewing: "dairy-fortune", addresses: [SAMPLE_ADDRESS], addressId: "a1", buyNow: null };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const EMPTY: CartState = { lines: {}, pay: "online", viewing: "dairy-fortune", addresses: [SAMPLE_ADDRESS], addressId: "a1", buyNow: null };

export function useCart() {
  const state = useSyncExternalStore(subscribe, () => cart, () => EMPTY);
  const count = Object.values(state.lines).reduce((a, b) => a + b, 0);
  const address = state.addresses.find((a) => a.id === state.addressId) ?? null;
  return { ...state, count, address };
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
  buyNow(id: string | null) {
    if (cart.buyNow === id) return;
    cart = { ...cart, buyNow: id };
    emit();
  },
  chooseAddress(id: string) {
    cart = { ...cart, addressId: id };
    emit();
  },
  // A new address goes first and is selected, as the site returns to the cart with it chosen
  addAddress(a: Omit<Address, "id">) {
    const id = `a${cart.addresses.length + 1}`;
    const addresses = (a.isDefault ? cart.addresses.map((x) => ({ ...x, isDefault: false })) : cart.addresses).concat({ ...a, id });
    cart = { ...cart, addresses, addressId: id };
    emit();
  },
  deleteAddress(id: string) {
    const addresses = cart.addresses.filter((a) => a.id !== id);
    cart = { ...cart, addresses, addressId: cart.addressId === id ? (addresses[0]?.id ?? "") : cart.addressId };
    emit();
  },
  // After an order: an empty cart, but saved addresses stay (as on the site's account)
  reset() {
    cart = { ...EMPTY, addresses: cart.addresses, addressId: cart.addressId };
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
