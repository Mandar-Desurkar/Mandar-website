"use client";

// Cart / checkout (app/cart/CartPageClient.jsx) and order confirmation (app/(orders)/order-confirmation)
// of gausampurna.com, as redesigned in the site's code in November 2026. The cart is one page, shown
// two ways: in-app it opens as a right-side drawer over the page (components/cart/CartDrawer.jsx,
// hosted by GsShared's Page); opened directly it is the full Checkout page. Items with saving and
// stepper, "Highly recommended for you", payment options (Pay Online pre-selected, "Best price",
// Save ₹X), bill summary, the return note, and on phones a bottom bar with the COD → online nudge,
// the delivery address in one line and Proceed to Pay. Choosing COD asks "You'll miss an online
// discount". The address sheet lists saved addresses and leads to the add-address flow
// (GsAddress.tsx). Orders and addresses are samples; nothing is sent.
import { useEffect, useState, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  Banknote,
  Check,
  ChevronRight,
  Home,
  Lock,
  MapPin,
  Minus,
  Pencil,
  Phone,
  Plus,
  ShoppingCart,
  Smartphone,
  Trash2,
  Truck,
  User,
  X,
} from "lucide-react";
import type { ScreenProps } from "../kissan/KissanScreens";
import c from "./gsCheckout.module.css";
import k from "./gsCart.module.css";
import { ONLINE_DISCOUNT, PRODUCTS, SAMPLE_ADDRESS, cartActions, deliveryDate, img, inr, packLabel, productById, totals, useCart, useDesktop, type Address, type Pay } from "./gsData";
import { DeliveryDate, DesktopHeader, Footer, Page, cx, registerCartView, useNav, type CartViewProps } from "./GsShared";
import { YouMightLike } from "./GsPdp";

// The order just placed, read by the confirmation screen
let lastOrder: { id: string; total: number; pay: Pay; buyNow: boolean } | null = null;

const PERCENT = Math.round(ONLINE_DISCOUNT * 100);

const withAmount = (template: string, amount: string) => {
  const [before, after = ""] = template.split("{amount}");
  return (
    <>
      {before}
      <b>{amount}</b>
      {after}
    </>
  );
};

function StarRow({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <span className={k.rating}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={12} height={12} viewBox="0 0 24 24" aria-hidden="true">
          <path fill={rating - i >= 0.75 ? "#f5b301" : "#e5e7eb"} d="M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.54L12 17.5l-5.87 3.08 1.12-6.54L2.5 9.41l6.56-.95z" />
        </svg>
      ))}
      <b>{rating.toFixed(1)}</b>({reviews.toLocaleString("en-IN")})
    </span>
  );
}

// ---------- Payment options ----------

function PaymentOption({
  selected,
  onSelect,
  Icon,
  title,
  subtitle,
  footer,
  price,
  strike,
  ribbon,
  aside,
}: {
  selected: boolean;
  onSelect: () => void;
  Icon: typeof Smartphone;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
  price: number;
  strike?: number;
  ribbon?: string | null;
  aside?: string | null;
}) {
  return (
    <button type="button" role="radio" aria-checked={selected} onClick={onSelect} className={cx(k.payOpt, selected && k.payOptOn, !!ribbon && k.payOptRibbon)}>
      <span className={k.paySurface} aria-hidden="true">
        {selected && <span key="shine" className={k.payShine} />}
      </span>
      {ribbon && <span className={k.ribbon}>{ribbon}</span>}
      <span className={k.payRow}>
        <span className={k.payIcon}>
          <Icon size={20} strokeWidth={2} />
        </span>
        <span className={k.payText}>
          <span className={k.payTitle}>{title}</span>
          {aside ? (
            <span key={selected ? "on" : "off"} className={cx(k.payAside, selected && k.popIn)}>
              {aside}
            </span>
          ) : subtitle ? (
            <span className={k.paySub}>{subtitle}</span>
          ) : null}
        </span>
        <span className={k.payPrice}>
          {strike !== undefined && strike > price && <s>₹{inr(strike)}</s>}
          <b>₹{inr(price)}</b>
        </span>
        <span className={k.radio} aria-hidden="true">
          {selected && <Check size={14} strokeWidth={3.2} className={k.popIn} />}
        </span>
      </span>
      {footer && (
        <span className={k.payFoot}>
          <span>{footer}</span>
        </span>
      )}
    </button>
  );
}

// OnlinePaymentLogos, small: the UPI apps a farmer already uses, at optical heights
function PayLogos() {
  const logos = [
    { src: "gpay.svg", alt: "Google Pay", h: 12 },
    { src: "phonepe.svg", alt: "PhonePe", h: 12.5 },
    { src: "paytm.svg", alt: "Paytm", h: 10 },
    { src: "upi.svg", alt: "UPI", h: 11.5 },
  ];
  return (
    <span className={k.logos} role="img" aria-label="Google Pay, PhonePe, Paytm, UPI">
      {logos.map((l) => (
        <img key={l.alt} src={img(`pay/${l.src}`)} alt="" style={{ height: l.h }} />
      ))}
    </span>
  );
}

function PaymentOptions({ pay, grand, potential }: { pay: Pay; grand: number; potential: number }) {
  const online = Math.max(0, grand - potential);
  const saving = grand - online;
  return (
    <section>
      <h2 className={k.h2}>Select Payment Option</h2>
      <div role="radiogroup" aria-label="Select Payment Option" className={k.payList}>
        <PaymentOption
          selected={pay === "online"}
          onSelect={() => cartActions.setPay("online")}
          Icon={Smartphone}
          title="Pay Online"
          footer={<PayLogos />}
          price={online}
          strike={grand}
          ribbon={saving > 0 ? "Best price" : null}
          aside={saving > 0 ? `Save ₹${inr(saving)}` : null}
        />
        <PaymentOption selected={pay === "cod"} onSelect={() => cartActions.setPay("cod")} Icon={Banknote} title="Cash on Delivery" subtitle="Pay when your order arrives" price={grand} />
      </div>
      <p className={k.secure}>
        <Lock size={14} strokeWidth={2.2} />
        Secure Payment
      </p>
    </section>
  );
}

// ---------- Bill summary ----------

function BillSummary({ t }: { t: ReturnType<typeof totals> }) {
  const finalTotal = Math.max(0, t.grand);
  const saved = t.savings + t.promo;
  return (
    <section>
      <h2 className={k.h2}>Bill Summary</h2>
      <div className={k.bill}>
        <dl>
          <div>
            <dt>Item Total</dt>
            <dd>
              {t.savings > 0 && <s>₹{inr(t.mrpTotal)}</s>}
              <b>₹{inr(t.subtotal)}</b>
            </dd>
          </div>
          <div>
            <dt>Delivery Fee</dt>
            <dd>
              <s>₹40</s>
              <em>FREE</em>
            </dd>
          </div>
          {t.promo > 0 && (
            <div>
              <dt>
                Pay Online ({PERCENT}% off)
              </dt>
              <dd className={k.minus}>−₹{inr(t.promo)}</dd>
            </div>
          )}
        </dl>
        <div className={k.grand}>
          <span>Grand Total</span>
          <b>₹{inr(finalTotal)}</b>
        </div>
        {saved > 0 && <p className={k.savedBand}>You save ₹{inr(saved)} on this order</p>}
      </div>
    </section>
  );
}

function RefundNote() {
  return (
    <p className={k.refund}>
      No returns once delivered — wrong, damaged, defective or expired items can be replaced if reported within 48 hours. <u>Return &amp; Replacement Policy</u>
    </p>
  );
}

// ---------- Addresses ----------

const place = (a: Address) => [a.locality, a.district, a.state].filter(Boolean).join(", ");

function DeliveryAddressCard({ address, onChange }: { address: Address | null; onChange: () => void }) {
  return (
    <div className={k.addrCard}>
      <span className={k.addrTile}>
        <Home size={20} />
      </span>
      <div>
        {address ? (
          <>
            <p className={k.addrTitle}>
              Delivering to: {address.name.slice(0, 3)}...{address.pincode}
            </p>
            <p className={k.addrLine}>{[address.street, address.locality, address.district, address.state].filter(Boolean).join(", ")}</p>
          </>
        ) : (
          <>
            <p className={k.addrTitle}>Select delivery address</p>
            <p className={k.addrLine}>Tap to pick an address</p>
          </>
        )}
      </div>
      <button type="button" onClick={onChange}>
        {address ? "Change" : "Select"}
      </button>
    </div>
  );
}

function CompactAddressRow({ address, onChange }: { address: Address | null; onChange: () => void }) {
  return (
    <button type="button" className={k.compactAddr} onClick={onChange}>
      <MapPin size={16} strokeWidth={2.2} />
      <span>
        {address ? (
          <>
            Delivering to <b>{address.pincode}</b>
            <i> · {place(address)}</i>
          </>
        ) : (
          <b>Select delivery address</b>
        )}
      </span>
      <em>{address ? "Change" : "Select"}</em>
    </button>
  );
}

function AddressSheet({ onClose }: { onClose: () => void }) {
  const nav = useNav();
  const { addresses, addressId } = useCart();
  const [confirmDelete, setConfirmDelete] = useState<Address | null>(null);
  const has = addresses.length > 0;
  return (
    <div className={k.sheetWrap}>
      <div className={k.sheetDim} onClick={onClose} />
      <div className={k.addrSheet} role="dialog" aria-modal="true" aria-labelledby="address-sheet-title">
        <div className={k.handleRow}>
          <div className={k.handle} />
        </div>
        <div className={k.sheetHead}>
          <div>
            <h2 id="address-sheet-title">Choose a delivery address</h2>
            {has && <p>Tap an address to deliver there</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={22} strokeWidth={2} />
          </button>
        </div>
        <div className={k.addrList} role="radiogroup" aria-labelledby="address-sheet-title">
          {!has ? (
            <div className={k.noAddr}>
              <span>
                <MapPin size={24} strokeWidth={2} />
              </span>
              <p>No saved addresses found.</p>
            </div>
          ) : (
            addresses.map((a) => {
              const on = a.id === addressId;
              return (
                <div key={a.id} className={cx(k.addrItem, on && k.addrItemOn)}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={on}
                    className={k.addrPick}
                    onClick={() => {
                      cartActions.chooseAddress(a.id);
                      onClose();
                    }}
                    aria-label={[a.name, a.street, place(a), a.pincode].join(", ")}
                  />
                  <div className={k.addrItemTop}>
                    <div>
                      <div className={k.addrName}>
                        <span>{a.name}</span>
                        {a.isDefault && <small>Default</small>}
                      </div>
                      <p className={k.addrText}>
                        <span>{a.street}</span>
                        <span>
                          {place(a)} – <b>{a.pincode}</b>
                        </span>
                      </p>
                    </div>
                    <span className={k.addrRadio} aria-hidden="true">
                      {on && <i />}
                    </span>
                  </div>
                  <div className={k.addrActions}>
                    <span>
                      <Phone size={14} strokeWidth={2} />
                      {a.phone}
                    </span>
                    <button type="button" className={k.edit}>
                      <Pencil size={14} strokeWidth={2.2} />
                      Edit
                    </button>
                    <button type="button" className={k.del} onClick={() => setConfirmDelete(a)} aria-label={`Delete – ${a.name}`}>
                      <Trash2 size={16} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className={k.sheetFoot}>
          <button type="button" className={cx(k.addNew, !has && k.addNewSolid)} onClick={nav.addAddress}>
            <Plus size={20} strokeWidth={2.2} />
            Add Address
          </button>
        </div>
        {confirmDelete && (
          <div className={k.delWrap}>
            <div className={k.sheetDim} onClick={() => setConfirmDelete(null)} />
            <div className={k.delSheet} role="alertdialog" aria-modal="true" aria-labelledby="delete-address-title">
              <div className={k.handleSmall} />
              <h3 id="delete-address-title">Delete Address</h3>
              <div className={k.delBox}>
                <p>{confirmDelete.name}</p>
                <small>{[confirmDelete.street, place(confirmDelete), confirmDelete.pincode].join(", ")}</small>
              </div>
              <p className={k.delNote}>This address will be permanently removed.</p>
              <div className={k.delBtns}>
                <button type="button" onClick={() => setConfirmDelete(null)}>
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    cartActions.deleteAddress(confirmDelete.id);
                    setConfirmDelete(null);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- The cart ----------

function useCartPieces({ inDrawer, onClose }: CartViewProps) {
  const desktop = useDesktop();
  const nav = useNav();
  const cart = useCart();
  const { pay, address, buyNow } = cart;
  // Buy Now checks out a separate one-item cart; the rest of the cart is kept for later
  const [bnQty, setBnQty] = useState(1);
  const lines: Record<string, number> = buyNow ? { [buyNow]: bnQty } : cart.lines;
  const otherCount = buyNow ? cart.count : 0;
  const ids = Object.keys(lines);
  const t = totals(lines, pay);
  const items = ids.reduce((n, id) => n + lines[id], 0);
  const [sheet, setSheet] = useState(false);
  const [codCheck, setCodCheck] = useState(false);
  const suggestions = PRODUCTS.filter((p) => !lines[p.id]).slice(0, 4);

  const setQty = (id: string, q: number) => {
    if (buyNow) {
      if (q <= 0) cartActions.buyNow(null);
      else setBnQty(Math.min(10, q));
    } else cartActions.setQty(id, Math.min(10, q));
  };
  const place = (method: Pay) => {
    const total = method === "online" ? t.subtotal - t.potentialPromo : t.subtotal;
    lastOrder = { id: `GS${String(Date.now()).slice(-8)}`, total, pay: method, buyNow: !!buyNow };
    onClose?.();
    nav.confirmed();
  };
  const proceed = () => {
    if (!address) return setSheet(true);
    if (pay === "cod") return setCodCheck(true);
    place("online");
  };
  const ctaLabel = pay === "cod" ? "Place Order" : "Proceed to Pay";

  const header = (
    <div className={k.header}>
      {!inDrawer && (
        <button type="button" onClick={nav.back} aria-label="Back" className={k.back}>
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
      )}
      <h1>Checkout</h1>
      {inDrawer && (
        <button type="button" onClick={onClose} aria-label="Close cart" className={k.close}>
          <X size={20} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );

  if (!ids.length) {
    return {
      header,
      content: (
        <div className={k.empty}>
          <span>
            <ShoppingCart size={40} />
          </span>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started</p>
          <button
            type="button"
            onClick={() => {
              onClose?.();
              nav.products();
            }}
          >
            Browse Products
          </button>
        </div>
      ),
      bottom: null,
      overlay: null,
    };
  }

  const itemsCard = (
    <section className={k.itemsSec}>
      <h2 className={k.h2}>Items ({items})</h2>
      {buyNow && otherCount > 0 && (
        <p className={k.bnNote}>
          <AlertCircle size={16} strokeWidth={2.2} />
          <span>Buying only this item. The {otherCount} item(s) in your cart are kept for later.</span>
        </p>
      )}
      <div className={k.items}>
        {ids.map((id) => {
          const p = productById(id);
          const q = lines[id];
          const pct = Math.round(((p.mrp - p.price) / p.mrp) * 100);
          const saving = (p.mrp - p.price) * q;
          return (
            <div key={id} className={k.line}>
              <div className={k.lineRow}>
                <div className={k.lineImg}>
                  <img src={p.image} alt="" />
                </div>
                <div className={k.lineBody}>
                  <div className={k.lineName}>
                    <h3>{p.name}</h3>
                    <button type="button" onClick={() => setQty(id, 0)} aria-label="Remove item">
                      <Trash2 size={18} strokeWidth={1.5} />
                    </button>
                  </div>
                  <StarRow rating={p.rating} reviews={p.reviews} />
                  <div>
                    <span className={k.pack}>{packLabel(p.pack)}</span>
                  </div>
                  <div className={k.linePrice}>
                    <b>₹{inr(p.price)}</b>
                    <s>₹{inr(p.mrp)}</s>
                    <em>{pct}% off</em>
                  </div>
                  <div className={k.lineFoot}>
                    {saving > 0 ? <span className={k.youSave}>{withAmount("You save {amount}", `₹${inr(saving)}`)}</span> : <span />}
                    <div className={k.stepper}>
                      <button type="button" onClick={() => setQty(id, q - 1)} aria-label={q === 1 ? "Remove item" : "Decrease quantity"}>
                        <Minus size={16} strokeWidth={2.5} />
                      </button>
                      <span>{q}</span>
                      <button type="button" onClick={() => setQty(id, q + 1)} aria-label="Increase quantity">
                        <Plus size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className={k.lineDelivery}>
                <span>
                  <Truck size={18} strokeWidth={1.5} />
                  <span>
                    Delivering by <b>{deliveryDate()}</b>
                  </span>
                </span>
                <button type="button" onClick={() => setQty(id, 0)}>
                  Save for later
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );

  const content = (
    <div className={cx(k.content, desktop && k.contentDesk)}>
      <div className={k.left}>
        {desktop && <DeliveryAddressCard address={address} onChange={() => setSheet(true)} />}
        {itemsCard}
        {!buyNow && suggestions.length > 0 && <YouMightLike products={suggestions} compact title="Highly recommended for you" />}
        <PaymentOptions pay={pay} grand={t.subtotal} potential={t.potentialPromo} />
        {!desktop && (
          <>
            <BillSummary t={t} />
            <RefundNote />
          </>
        )}
      </div>
      {desktop && (
        <div className={k.right}>
          <BillSummary t={t} />
          <RefundNote />
          <button type="button" className={k.deskCta} onClick={proceed}>
            {pay === "cod" ? "Place Order" : `Proceed to Pay ₹${inr(t.grand)}`}
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );

  const bottom = desktop ? null : (
    <div className={k.bottom}>
      <div className={k.nudgeWrap} style={{ gridTemplateRows: pay === "cod" ? "1fr" : "0fr" }} aria-hidden={pay !== "cod"}>
        <div>
          <div className={k.nudgePad}>
            <button type="button" className={k.nudge} onClick={() => cartActions.setPay("online")} tabIndex={pay === "cod" ? 0 : -1}>
              <span className={k.shine} aria-hidden="true" />
              <BadgePercent size={18} strokeWidth={2.4} className={k.badge} />
              <span className={k.nudgeText}>{withAmount("Pay only {amount} with Online Payment", `₹${inr(t.subtotal - t.potentialPromo)}`)}</span>
              <span className={k.nudgePill}>
                Pay Online
                <ChevronRight size={14} strokeWidth={2.75} />
              </span>
            </button>
          </div>
        </div>
      </div>
      <CompactAddressRow address={address} onChange={() => setSheet(true)} />
      <div className={k.ctaRow}>
        <div className={k.ctaTotal}>
          <div>
            <b>₹{inr(t.grand)}</b>
            {t.mrpTotal > t.grand && <s>₹{inr(t.mrpTotal)}</s>}
          </div>
          <span>
            {items} {items > 1 ? "Items" : "Item"} ·{" "}
            {pay === "cod" ? (
              "Cash on Delivery"
            ) : (
              <>
                Pay Online{t.promo > 0 && <b> −{PERCENT}%</b>}
              </>
            )}
          </span>
        </div>
        <button type="button" className={k.cta} onClick={proceed}>
          {ctaLabel}
          <ChevronRight size={16} strokeWidth={2.75} />
        </button>
      </div>
    </div>
  );

  const overlay = (
    <>
      {sheet && <AddressSheet onClose={() => setSheet(false)} />}
      {codCheck && (
        <div className={k.codWrap}>
          <div className={k.sheetDim} onClick={() => setCodCheck(false)} />
          <div className={k.codDialog} role="dialog" aria-modal="true">
            <h2>You&apos;ll miss an online discount</h2>
            <p>
              By choosing Cash on Delivery, you will lose ₹{Math.round(t.potentialPromo)} ({PERCENT}% online payment discount).
            </p>
            <div>
              <button
                type="button"
                onClick={() => {
                  setCodCheck(false);
                  cartActions.setPay("online");
                  place("online");
                }}
              >
                Pay Online
              </button>
              <button
                type="button"
                onClick={() => {
                  setCodCheck(false);
                  place("cod");
                }}
              >
                COD only
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return { header, content, bottom, overlay };
}

// In the drawer: the same page in the sheet's own scroll area, header and bar pinned to the sheet
function CartView(props: CartViewProps) {
  const { header, content, bottom, overlay } = useCartPieces(props);
  return (
    <div className={k.drawerView}>
      <div className={k.drawerScroll} data-gs-scroll>
        {header}
        {content}
      </div>
      {bottom}
      {overlay}
    </div>
  );
}
registerCartView(CartView);

// Opened directly (/cart): the full Checkout page
export function GsCheckout(props: ScreenProps) {
  return (
    <Page nav={props} font="roboto" cartPage>
      <CheckoutPage />
    </Page>
  );
}

function CheckoutPage() {
  const desktop = useDesktop();
  const { count, viewing, buyNow } = useCart();
  // Reached from the viewer's screen pills with an empty cart: start from the product being viewed
  useEffect(() => {
    if (count === 0 && !buyNow) cartActions.setQty(viewing, 1);
    // only on arrival
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { header, content, bottom, overlay } = useCartPieces({});
  return (
    <div className={cx(k.pageView, desktop && k.pageViewDesk)}>
      <div className={k.drawerScroll} data-gs-scroll>
        {desktop && <DesktopHeader />}
        {header}
        {content}
        {desktop && <Footer />}
      </div>
      {bottom}
      {overlay}
    </div>
  );
}

// ---------- Order confirmed ----------

export function GsConfirmed(props: ScreenProps) {
  const desktop = useDesktop();
  const nav = useNav(props);
  const { address } = useCart();
  const order = lastOrder ?? { id: "GS48219307", total: 1755, pay: "online" as Pay };
  const to = address ?? SAMPLE_ADDRESS;
  // A placed order empties the cart (a Buy Now order only clears itself, keeping the cart)
  useEffect(() => {
    if (lastOrder?.buyNow) cartActions.buyNow(null);
    else cartActions.reset();
  }, []);
  const body = (
    <div className={c.confirm}>
      <header className={c.confirmHead}>
        <button type="button" onClick={nav.home} aria-label="Close">
          <X size={20} />
        </button>
        <h1>Order Confirmed</h1>
      </header>
      <div className={c.confirmBody}>
        <span className={c.tick}>
          <i>
            <Check size={24} strokeWidth={3} />
          </i>
        </span>
        <h2>
          Thank you for shopping <br /> with us !
        </h2>
        <p className={c.orderLine}>
          Your order <b>#{order.id}</b> is confirmed and being prepared for shipment.
        </p>
        <div className={c.etaCard}>
          <span>
            <Truck size={24} />
          </span>
          <div>
            <small>Estimated Delivery</small>
            <b>
              <DeliveryDate />
            </b>
          </div>
        </div>
        <h3>Delivery Address</h3>
        <div className={c.box}>
          <p>
            <User size={16} /> {to.name}
          </p>
          <p>
            <MapPin size={16} /> {[to.street, to.locality, to.district, to.state].filter(Boolean).join(", ")} – {to.pincode}
          </p>
          <p>
            <Phone size={16} /> +91 {to.phone}
          </p>
        </div>
        <h3>Order Summary</h3>
        <div className={c.box}>
          <p className={c.sumRow}>
            <span>Item(s) Subtotal:</span>₹{order.total.toFixed(2)}
          </p>
          <p className={c.sumRow}>
            <span>Shipping:</span>₹0.00
          </p>
          {order.pay === "cod" && (
            <p className={c.sumRow}>
              <span>Cash/Pay on Delivery fee:</span>₹0.00
            </p>
          )}
          <p className={cx(c.sumRow, c.sumGrand)}>
            <span>Grand Total:</span>₹{order.total.toFixed(2)}
          </p>
        </div>
      </div>
      <div className={c.confirmFoot}>
        <button type="button" onClick={nav.home}>
          Continue <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
  if (desktop) {
    return (
      <Page nav={props}>
        <DesktopHeader />
        <div className={c.dConfirm}>{body}</div>
        <Footer />
      </Page>
    );
  }
  return <Page nav={props}>{body}</Page>;
}
