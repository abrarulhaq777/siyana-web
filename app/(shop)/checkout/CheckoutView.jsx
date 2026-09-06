"use client";

import Link from "next/link";
import Script from "next/script";
import { useState } from "react";
import Empty from "@/components/Empty";
import { inr } from "@/lib/products";
import { useStore } from "@/lib/store";
import { placeOrder, confirmPayment, abandonOrder } from "./actions";

export default function CheckoutView({ settings, gateway, me }) {
  const { hydrated, lines, subtotal, clear } = useStore();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(null);

  if (!hydrated) return null;

  if (done)
    return (
      <Empty
        title="Order placed"
        copy={`Your order number is ${done}. A confirmation is on its way — we pack within one working day.`}
        href="/collections"
        cta="Keep browsing"
      />
    );

  if (lines.length === 0)
    return <Empty title="Nothing to check out" copy="Your bag is empty." href="/collections" cta="Browse the collection" />;

  const shipping = subtotal >= settings.freeShippingAbove ? 0 : settings.shippingFee;
  const total = subtotal + shipping;
  const address = me?.addresses?.find((a) => a.isDefault) ?? me?.addresses?.[0];

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const form = Object.fromEntries(new FormData(e.currentTarget));
    const result = await placeOrder({
      ...form,
      items: lines.map((l) => ({ slug: l.slug, size: l.size, qty: l.qty })),
    });

    if (!result.ok) {
      setBusy(false);
      return setError(result.error);
    }

    if (result.mode === "placed") {
      clear();
      setBusy(false);
      return setDone(result.orderNo);
    }

    // Hand off to Razorpay, then verify server-side before celebrating.
    const rzp = new window.Razorpay({
      key: result.keyId,
      order_id: result.razorpayOrderId,
      amount: result.amount,
      currency: "INR",
      name: settings.storeName,
      description: `Order ${result.orderNo}`,
      prefill: result.prefill,
      theme: { color: "#141311" },
      handler: async (response) => {
        const confirmed = await confirmPayment({
          orderId: result.orderId,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        });
        setBusy(false);
        if (!confirmed.ok) return setError(confirmed.error);
        clear();
        setDone(confirmed.orderNo);
      },
      modal: {
        ondismiss: async () => {
          await abandonOrder(result.orderId);
          setBusy(false);
          setError("Payment was cancelled. Your bag is untouched — try again when you're ready.");
        },
      },
    });
    rzp.open();
  }

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
      {gateway && <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />}

      <h1 className="font-display text-[3rem] font-light leading-none">Checkout</h1>
      {me && <p className="mt-3 text-xs text-muted">Signed in as {me.email}</p>}

      <form onSubmit={submit} className="mt-14 grid gap-16 lg:grid-cols-[1.3fr_0.8fr]">
        <div className="space-y-12">
          {error && (
            <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
              {error}
            </p>
          )}

          <Fieldset legend="Contact">
            <Field label="Full name" name="name" autoComplete="name" defaultValue={me?.name} />
            <Field label="Email" name="email" type="email" autoComplete="email" defaultValue={me?.email} />
            <Field label="Phone" name="phone" type="tel" inputMode="numeric" pattern="[0-9]{10}" autoComplete="tel" defaultValue={me?.phone} />
          </Fieldset>

          <Fieldset legend="Delivery address">
            <Field label="Address" name="address" autoComplete="street-address" className="sm:col-span-2" defaultValue={address?.line1} />
            <Field label="City" name="city" autoComplete="address-level2" defaultValue={address?.city} />
            <Field label="State" name="state" autoComplete="address-level1" defaultValue={address?.state} />
            <Field label="Pincode" name="pincode" inputMode="numeric" pattern="[0-9]{6}" autoComplete="postal-code" defaultValue={address?.pincode} />
          </Fieldset>

          <Fieldset legend="Payment">
            <div className="space-y-3 sm:col-span-2">
              {gateway && (
                <>
                  <Method value="upi" label="UPI" hint="GPay, PhonePe, Paytm and any UPI app" defaultChecked />
                  <Method value="card" label="Card" hint="Credit or debit, secured by Razorpay" />
                  <Method value="netbanking" label="Net banking" hint="All major Indian banks" />
                </>
              )}
              {settings.codEnabled && (
                <Method value="cod" label="Cash on delivery" hint="Pay the courier when it arrives" defaultChecked={!gateway} />
              )}
              {!gateway && (
                <p className="text-[11px] text-muted">
                  Online payment is being set up. Cash on delivery is available in the meantime.
                </p>
              )}
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
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-ink">{shipping === 0 ? "Complimentary" : inr(shipping)}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-line pt-5 font-display text-2xl">
            <span>Total</span>
            <span>{inr(total)}</span>
          </div>

          <button
            disabled={busy}
            className="mt-8 w-full bg-ink py-4 text-[10px] uppercase tracking-brand text-bone transition hover:bg-gold-dark disabled:opacity-50"
          >
            {busy ? "Working…" : `Place order · ${inr(total)}`}
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

function Method({ value, label, hint, defaultChecked }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 border border-line px-5 py-4 text-sm has-checked:border-ink">
      <input type="radio" name="method" value={value} defaultChecked={defaultChecked} className="mt-0.5 accent-ink" required />
      <span>
        <span className="block text-ink">{label}</span>
        <span className="block text-[11px] text-muted">{hint}</span>
      </span>
    </label>
  );
}
