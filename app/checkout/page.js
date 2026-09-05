"use client";

import Link from "next/link";
import { useState } from "react";
import Empty from "@/components/Empty";
import { inr } from "@/lib/products";
import { useStore } from "@/lib/store";

const SHIPPING_FREE_ABOVE = 2999;
const SHIPPING = 149;

export default function CheckoutPage() {
  const { ready, lines, subtotal, clear } = useStore();
  const [done, setDone] = useState(false);

  if (!ready) return null;

  if (done)
    return (
      <Empty
        title="Order placed"
        copy="A confirmation is on its way. We pack within one working day."
        href="/collections"
        cta="Keep browsing"
      />
    );

  if (lines.length === 0)
    return <Empty title="Nothing to check out" copy="Your bag is empty." href="/collections" cta="Browse the collection" />;

  const shipping = subtotal >= SHIPPING_FREE_ABOVE ? 0 : SHIPPING;

  // ponytail: no payment gateway wired yet — this validates and clears the bag.
  const submit = (e) => {
    e.preventDefault();
    clear();
    setDone(true);
  };

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
      <h1 className="font-display text-[3rem] font-light leading-none">Checkout</h1>

      <form onSubmit={submit} className="mt-14 grid gap-16 lg:grid-cols-[1.3fr_0.8fr]">
        <div className="space-y-12">
          <Fieldset legend="Contact">
            <Field label="Full name" name="name" autoComplete="name" />
            <Field label="Email" name="email" type="email" autoComplete="email" />
            <Field label="Phone" name="phone" type="tel" inputMode="numeric" pattern="[0-9]{10}" autoComplete="tel" />
          </Fieldset>

          <Fieldset legend="Delivery address">
            <Field label="Address" name="address" autoComplete="street-address" className="sm:col-span-2" />
            <Field label="City" name="city" autoComplete="address-level2" />
            <Field label="State" name="state" autoComplete="address-level1" />
            <Field label="Pincode" name="pincode" inputMode="numeric" pattern="[0-9]{6}" autoComplete="postal-code" />
          </Fieldset>

          <Fieldset legend="Payment">
            <div className="sm:col-span-2 space-y-3">
              {["UPI", "Card", "Cash on delivery"].map((m, i) => (
                <label key={m} className="flex cursor-pointer items-center gap-3 border border-line px-5 py-4 text-sm has-checked:border-ink">
                  <input type="radio" name="payment" value={m} defaultChecked={i === 0} className="accent-ink" />
                  {m}
                </label>
              ))}
            </div>
          </Fieldset>
        </div>

        <aside className="lg:sticky lg:top-40 lg:self-start">
          <h2 className="text-[10px] uppercase tracking-brand">Your order</h2>
          <ul className="mt-8 space-y-4 border-t border-line pt-8 text-sm">
            {lines.map((l) => (
              <li key={l.slug + l.size} className="flex justify-between gap-6">
                <span className="text-muted">
                  {l.product.name} <span className="text-[11px]">· {l.size} × {l.qty}</span>
                </span>
                <span>{inr(l.product.price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-3 border-t border-line pt-6 text-sm text-muted">
            <div className="flex justify-between"><span>Shipping</span><span className="text-ink">{shipping === 0 ? "Complimentary" : inr(shipping)}</span></div>
          </div>
          <div className="mt-4 flex justify-between border-t border-line pt-5 font-display text-2xl">
            <span>Total</span>
            <span>{inr(subtotal + shipping)}</span>
          </div>

          <button className="mt-8 w-full bg-ink py-4 text-[10px] uppercase tracking-brand text-bone transition hover:bg-sage">
            Place order
          </button>
          <Link href="/cart" className="mt-4 block text-center text-[10px] uppercase tracking-[0.18em] text-muted hover:text-ink">
            Back to bag
          </Link>
        </aside>
      </form>
    </section>
  );
}

function Fieldset({ legend, children }) {
  return (
    <fieldset>
      <legend className="text-[10px] uppercase tracking-brand">{legend}</legend>
      <div className="mt-7 grid gap-6 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Field({ label, name, className = "", ...rest }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="text-[10px] uppercase tracking-[0.18em] text-muted">{label}</label>
      <input
        id={name}
        name={name}
        required
        {...rest}
        className="mt-2 w-full border-b border-ink/20 bg-transparent py-3 text-sm outline-none focus:border-ink"
      />
    </div>
  );
}
