"use client";

// Checkout (app/cart/page.jsx) and order confirmation (app/(orders)/order-confirmation) of
// gausampurna.com. One page: address, items, add-ons, payment, bill. Pay Online is pre-selected;
// choosing Cash on Delivery shows the lime "Pay only ₹X with Online Payment" strip in the bottom bar
// and, on Place Order, the "You'll miss an online discount" check, as on the site. The address and
// order are samples; nothing is sent.
import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, BadgePercent, Banknote, Check, ChevronRight, Home, Lock, MapPin, Phone, ShoppingCart, Smartphone, Truck, User, X } from "lucide-react";
import type { ScreenProps } from "../kissan/KissanScreens";
import c from "./gsCheckout.module.css";
import { PRODUCTS, cartActions, inr, offPct, productById, totals, useCart, useDesktop, type Pay } from "./gsData";
import { DeliveryDate, DesktopHeader, Footer, Page, ProductTile, Stars, cx, useNav } from "./GsShared";

const ADDRESS = {
  name: "Ramesh Patil",
  line: "Near Hanuman Temple, Kesthur",
  place: "Maddur, Mandya, Karnataka",
  pincode: "571428",
  phone: "+91 98765 43210",
};

// The order just placed, read by the confirmation screen
let lastOrder: { id: string; total: number; pay: Pay } | null = null;

export function GsCheckout(props: ScreenProps) {
  const desktop = useDesktop();
  const nav = useNav(props);
  const { lines, pay, count, viewing } = useCart();
  const [codCheck, setCodCheck] = useState(false);
  const [paying, setPaying] = useState(false);

  // Reached with the viewer's arrows and an empty cart: start from the product being viewed
  useEffect(() => {
    if (count === 0) cartActions.setQty(viewing, 1);
    // only on arrival
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = totals(lines, pay);
  const items = Object.entries(lines).map(([id, q]) => ({ p: productById(id), q }));
  const addOns = PRODUCTS.filter((x) => !lines[x.id]).slice(0, 4);

  const place = (method: Pay) => {
    const total = totals(lines, method).grand;
    lastOrder = { id: `GS${String(Date.now()).slice(-8)}`, total, pay: method };
    cartActions.reset();
    nav.confirmed();
  };
  const proceed = () => {
    if (pay === "cod") {
      setCodCheck(true);
      return;
    }
    setPaying(true);
    window.setTimeout(() => place("online"), 1300);
  };
  const cta = pay === "cod" ? "Place Order" : "Proceed to Pay";

  const header = (
    <header className={c.head}>
      <button type="button" onClick={nav.back} aria-label="Back">
        <ArrowLeft size={24} strokeWidth={2.5} />
      </button>
      <h1>Checkout</h1>
    </header>
  );

  if (count === 0 && items.length === 0) {
    return (
      <Page nav={props}>
        {desktop ? <DesktopHeader /> : header}
        <div className={c.empty}>
          <span>
            <ShoppingCart size={40} />
          </span>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started</p>
          <button type="button" onClick={nav.products}>
            Browse Products
          </button>
        </div>
      </Page>
    );
  }

  const addressCard = (
    <div className={c.addrCard}>
      <span className={c.addrIcon}>
        <Home size={20} />
      </span>
      <div>
        <b>
          Delivering to: {ADDRESS.name.slice(0, 3)}...{ADDRESS.pincode}
        </b>
        <small>
          {ADDRESS.line}, {ADDRESS.place}
        </small>
      </div>
      <span className={c.change}>Change</span>
    </div>
  );

  const itemsSection = (
    <section>
      <h2 className={c.h2}>Items ({count})</h2>
      <div className={c.items}>
        {items.map(({ p, q }) => (
          <div key={p.id} className={c.item}>
            <div className={c.itemRow}>
              <img src={p.image} alt="" />
              <div className={c.itemBody}>
                <div className={c.itemName}>
                  <h3>{p.name}</h3>
                  <button type="button" onClick={() => cartActions.setQty(p.id, 0)} aria-label="Remove item">
                    <X size={17} />
                  </button>
                </div>
                <p className={c.itemRate}>
                  <Stars rating={p.rating} /> <b>{p.rating.toFixed(1)}</b> ({inr(p.reviews)})
                </p>
                <span className={c.pack}>{p.pack}</span>
                <p className={c.itemPrice}>
                  ₹{inr(p.price)} <s>₹{inr(p.mrp)}</s> <em>{offPct(p)}% off</em>
                </p>
                <div className={c.itemFoot}>
                  <span className={c.save}>You save ₹{inr((p.mrp - p.price) * q)}</span>
                  <span className={c.qty}>
                    <button type="button" onClick={() => cartActions.setQty(p.id, q - 1)} aria-label={q === 1 ? "Remove item" : "Decrease quantity"}>
                      −
                    </button>
                    <b>{q}</b>
                    <button type="button" onClick={() => cartActions.setQty(p.id, q + 1)} aria-label="Increase quantity">
                      +
                    </button>
                  </span>
                </div>
              </div>
            </div>
            <div className={c.itemDelivery}>
              <span>
                <Truck size={17} /> Delivering by{" "}
                <b>
                  <DeliveryDate />
                </b>
              </span>
              <span className={c.later}>Save for later</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const addOnSection = addOns.length > 0 && (
    <section>
      <h2 className={c.h2}>Highly recommended for you</h2>
      <div className={c.addOns}>
        {addOns.map((x) => (
          <ProductTile key={x.id} p={x} compact />
        ))}
      </div>
    </section>
  );

  const online = totals(lines, "online").grand;
  const paymentSection = (
    <section>
      <h2 className={c.h2}>Select Payment Option</h2>
      <div className={c.payList} role="radiogroup" aria-label="Select Payment Option">
        <PayOption selected={pay === "online"} onSelect={() => cartActions.setPay("online")} Icon={Smartphone} title="Pay Online" price={online} aside={`Save ₹${inr(t.subtotal - online)}`}>
          <span className={c.upi}>
            <i>UPI</i>
            <i>GPay</i>
            <i>PhonePe</i>
            <i>Paytm</i>
          </span>
        </PayOption>
        <PayOption selected={pay === "cod"} onSelect={() => cartActions.setPay("cod")} Icon={Banknote} title="Cash on Delivery" subtitle="Pay when your order arrives" price={t.subtotal} />
      </div>
      <p className={c.secure}>
        <Lock size={13} /> Secure Payment
      </p>
    </section>
  );

  const bill = (
    <section>
      <h2 className={c.h2}>Bill Summary</h2>
      <div className={c.bill}>
        <dl>
          <div>
            <dt>Item Total</dt>
            <dd>
              <s>₹{inr(t.mrpTotal)}</s> ₹{inr(t.subtotal)}
            </dd>
          </div>
          <div>
            <dt>Delivery Fee</dt>
            <dd>
              <s>₹40</s> <b className={c.free}>FREE</b>
            </dd>
          </div>
          {t.promo > 0 && (
            <div>
              <dt>Pay Online (10% off)</dt>
              <dd className={c.green}>−₹{inr(t.promo)}</dd>
            </div>
          )}
        </dl>
        <p className={c.grand}>
          <span>Grand Total</span>
          <b>₹{inr(t.grand)}</b>
        </p>
        <p className={c.saving}>You save ₹{inr(t.savings + t.promo)} on this order</p>
      </div>
    </section>
  );

  const policy = (
    <p className={c.policy}>
      No returns once delivered — wrong, damaged, defective or expired items can be replaced if reported within 48 hours. <u>Return &amp; Replacement Policy</u>
    </p>
  );

  const overlay = (
    <>
      {codCheck && (
        <div className={c.modalWrap}>
          <div className={c.modal} role="dialog" aria-modal="true">
            <h2>You&apos;ll miss an online discount</h2>
            <p>By choosing Cash on Delivery, you will lose ₹{inr(t.potentialPromo)} (10% online payment discount).</p>
            <button
              type="button"
              className={c.modalPrimary}
              onClick={() => {
                setCodCheck(false);
                cartActions.setPay("online");
              }}
            >
              Pay Online
            </button>
            <button type="button" className={c.modalSecondary} onClick={() => place("cod")}>
              COD only
            </button>
          </div>
        </div>
      )}
      {paying && (
        <div className={c.modalWrap}>
          <div className={c.paying}>
            <span className={c.spinner} />
            Opening secure payment…
            <small>Sample checkout: no payment is taken</small>
          </div>
        </div>
      )}
    </>
  );

  if (desktop) {
    return (
      <Page nav={props} overlay={overlay}>
        {header}
        <div className={c.dGrid}>
          <div className={c.dLeft}>
            {addressCard}
            {itemsSection}
            {addOnSection}
            {paymentSection}
          </div>
          <div className={c.dRight}>
            {bill}
            {policy}
            <button type="button" className={c.dCta} onClick={proceed}>
              {pay === "cod" ? "Place Order" : `Proceed to Pay ₹${inr(t.grand)}`} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </Page>
    );
  }

  const bottom = (
    <div className={c.bar}>
      <div className={cx(c.nudgeWrap, pay === "cod" && t.potentialPromo > 0 && c.nudgeOpen)}>
        <div>
          <button type="button" className={c.nudge} onClick={() => cartActions.setPay("online")} tabIndex={pay === "cod" ? 0 : -1}>
            <span className={c.shine} aria-hidden="true" />
            <BadgePercent size={18} strokeWidth={2.4} />
            <span className={c.nudgeText}>Pay only ₹{inr(online)} with Online Payment</span>
            <span className={c.nudgeBtn}>
              Pay Online <ChevronRight size={14} strokeWidth={2.75} />
            </span>
          </button>
        </div>
      </div>
      <button type="button" className={c.addrRow}>
        <MapPin size={16} strokeWidth={2.2} />
        <span>
          Deliver to <b>{ADDRESS.name}</b>, {ADDRESS.place.split(",")[0]} · {ADDRESS.pincode}
        </span>
        <em>Change</em>
      </button>
      <div className={c.ctaRow}>
        <div>
          <p className={c.ctaTotal}>
            ₹{inr(t.grand)} <s>₹{inr(t.mrpTotal)}</s>
          </p>
          <p className={c.ctaSub}>
            {count} {count > 1 ? "Items" : "Item"} · {pay === "cod" ? "Cash on Delivery" : <>Pay Online <b>−10%</b></>}
          </p>
        </div>
        <button type="button" className={c.cta} onClick={proceed}>
          {cta} <ChevronRight size={16} strokeWidth={2.75} />
        </button>
      </div>
    </div>
  );

  return (
    <Page nav={props} bottom={bottom} overlay={overlay}>
      {header}
      <div className={c.mBody}>
        {itemsSection}
        {addOnSection}
        {paymentSection}
        {bill}
        {policy}
      </div>
    </Page>
  );
}

function PayOption({
  selected,
  onSelect,
  Icon,
  title,
  subtitle,
  price,
  aside,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  Icon: typeof Smartphone;
  title: string;
  subtitle?: string;
  price: number;
  aside?: string;
  children?: ReactNode;
}) {
  return (
    <button type="button" role="radio" aria-checked={selected} className={cx(c.pay, selected && c.payOn)} onClick={onSelect}>
      <span className={c.payRow}>
        <Icon size={22} strokeWidth={1.9} className={c.payIcon} />
        <span className={c.payText}>
          <b>{title}</b>
          {subtitle && <small>{subtitle}</small>}
        </span>
        <span className={c.payPrice}>
          <b>₹{inr(price)}</b>
          {aside && <small>{aside}</small>}
        </span>
        <span className={c.radio}>{selected && <i />}</span>
      </span>
      {children && <span className={c.payFoot}>{children}</span>}
    </button>
  );
}

// ---------- Order confirmed ----------

export function GsConfirmed(props: ScreenProps) {
  const desktop = useDesktop();
  const nav = useNav(props);
  const order = lastOrder ?? { id: "GS48219307", total: 1755, pay: "online" as Pay };
  // A placed order empties the cart (also when this screen is reached with the viewer's arrows)
  useEffect(() => cartActions.reset(), []);
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
            <User size={16} /> {ADDRESS.name}
          </p>
          <p>
            <MapPin size={16} /> {ADDRESS.line}, {ADDRESS.place} – {ADDRESS.pincode}
          </p>
          <p>
            <Phone size={16} /> {ADDRESS.phone}
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
