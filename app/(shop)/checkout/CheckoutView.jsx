"use client";

import Link from "next/link";
import Script from "next/script";
import { useState } from "react";
import ProductMedia from "@/components/ProductMedia";
import Empty from "@/components/Empty";
import { inr } from "@/lib/products";
import { useStore } from "@/lib/store";
import { placeOrder, confirmPayment, abandonOrder, checkCoupon } from "./actions";

export default function CheckoutView({ settings, gateway, me }) {
  const { hydrated, lines, subtotal, clear } = useStore();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(null);
  const [coupon, setCoupon] = useState(null); // { code, discount, description }
  const [couponError, setCouponError] = useState(null);
  const [checking, setChecking] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(gateway ? "upi" : "cod");

  if (!hydrated) return null;

  if (done)
    return (
      <Empty
        title="Order Placed"
        copy={`Your order number is ${done}. A confirmation email has been dispatched. Our atelier prepares each garment with utmost care within one working day.`}
        href="/collections"
        cta="Continue Browsing"
      />
    );

  if (lines.length === 0)
    return (
      <Empty
        title="Your Bag is Empty"
        copy="There are no items awaiting checkout."
        href="/collections"
        cta="Browse Collections"
      />
    );

  const bag = lines.map((l) => ({ slug: l.slug, size: l.size, qty: l.qty }));
  const discount = coupon?.discount ?? 0;
  const shipping = subtotal >= settings.freeShippingAbove ? 0 : settings.shippingFee;
  const total = Math.max(0, subtotal - discount) + shipping;
  const address = me?.addresses?.find((a) => a.isDefault) ?? me?.addresses?.[0];

  async function redeem(e) {
    e.preventDefault();
    const code = new FormData(e.currentTarget).get("code");
    if (!code) return;

    setChecking(true);
    setCouponError(null);
    const result = await checkCoupon(code, bag);
    setChecking(false);

    if (!result.ok) {
      setCoupon(null);
      return setCouponError(result.error);
    }
    setCoupon(result);
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const form = Object.fromEntries(new FormData(e.currentTarget));
    const result = await placeOrder({
      ...form,
      method: selectedMethod,
      items: bag,
      couponCode: coupon?.code ?? null,
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

    // Hand off to Razorpay, then verify server-side
    if (typeof window === "undefined" || !window.Razorpay) {
      setBusy(false);
      return setError("Payment gateway is loading. Please try again in a few moments.");
    }

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
          setError("Payment was cancelled. Your bag remains saved — try again when ready.");
        },
      },
    });

    rzp.on("payment.failed", function (response) {
      setBusy(false);
      setError(
        response.error?.description ||
          response.error?.reason ||
          "Payment failed. Please try again or use another payment method."
      );
    });

    rzp.open();
  }

  return (
    <div className="bg-bone/40 pb-24 pt-8">
      {gateway && <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />}

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        
        {/* Navigation Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-muted">
          <Link href="/cart" className="transition hover:text-ink">Bag</Link>
          <span className="text-muted/40">/</span>
          <span className="font-medium text-ink">Checkout</span>
          <span className="text-muted/40">/</span>
          <span className="text-muted/50">Confirmation</span>
        </nav>

        {/* Page Header */}
        <header className="mb-12 border-b border-line pb-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-gold font-medium">Siyana Atelier</p>
              <h1 className="mt-1 font-display text-[2.75rem] font-light leading-none text-ink sm:text-[3.25rem]">
                Order Checkout
              </h1>
            </div>
            {me ? (
              <div className="flex items-center gap-2 rounded-xs border border-line bg-paper px-4 py-2 text-xs text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                <span>Signed in as <strong className="font-medium text-ink">{me.email}</strong></span>
              </div>
            ) : (
              <div className="text-xs text-muted">
                Already have an account?{" "}
                <Link href="/account" className="font-medium text-ink underline underline-offset-4 hover:text-gold transition">
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Coupon form reference for external button */}
        <form id="coupon-form" onSubmit={redeem} />

        {/* Main Grid */}
        <form onSubmit={submit} className="grid gap-12 lg:grid-cols-[1.35fr_0.85fr] lg:gap-16">
          
          {/* Left Column: Form Steps */}
          <div className="space-y-10">
            {error && (
              <div role="alert" className="flex items-start gap-3 border border-red-200 bg-red-50/80 p-4 text-xs text-red-800 rounded-xs">
                <svg className="h-4 w-4 shrink-0 text-red-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">{error}</div>
              </div>
            )}

            {/* Step 1: Contact Details */}
            <section className="rounded-xs border border-line bg-paper p-6 sm:p-8 shadow-sm transition">
              <div className="flex items-center gap-3 border-b border-line pb-5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-semibold text-bone">
                  01
                </span>
                <div>
                  <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-ink">Contact Details</h2>
                  <p className="text-xs text-muted">Order confirmation and courier status updates will be sent here.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <InputGroup
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  placeholder="e.g. Fatima Al-Sayed"
                  defaultValue={me?.name}
                  required
                  className="sm:col-span-2"
                />
                <InputGroup
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="fatima@example.com"
                  defaultValue={me?.email}
                  required
                />
                <InputGroup
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  autoComplete="tel"
                  placeholder="10-digit mobile number"
                  defaultValue={me?.phone}
                  required
                  prefix="+91"
                />
              </div>
            </section>

            {/* Step 2: Shipping Destination */}
            <section className="rounded-xs border border-line bg-paper p-6 sm:p-8 shadow-sm transition">
              <div className="flex items-center gap-3 border-b border-line pb-5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-semibold text-bone">
                  02
                </span>
                <div>
                  <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-ink">Delivery Address</h2>
                  <p className="text-xs text-muted">Shipped securely in unmarked, discreet luxury packaging.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <InputGroup
                  label="Street Address / Residence"
                  name="address"
                  autoComplete="street-address"
                  placeholder="Flat / Villa / House number, Apartment or Building name"
                  defaultValue={address?.line1}
                  required
                  className="sm:col-span-2"
                />
                <InputGroup
                  label="City"
                  name="city"
                  autoComplete="address-level2"
                  placeholder="e.g. Mumbai"
                  defaultValue={address?.city}
                  required
                />
                <InputGroup
                  label="State"
                  name="state"
                  autoComplete="address-level1"
                  placeholder="e.g. Maharashtra"
                  defaultValue={address?.state}
                  required
                />
                <InputGroup
                  label="PIN Code"
                  name="pincode"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  autoComplete="postal-code"
                  placeholder="e.g. 400001"
                  defaultValue={address?.pincode}
                  required
                  className="sm:col-span-2"
                />
              </div>
            </section>

            {/* Step 3: Payment Options */}
            <section className="rounded-xs border border-line bg-paper p-6 sm:p-8 shadow-sm transition">
              <div className="flex items-center gap-3 border-b border-line pb-5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-semibold text-bone">
                  03
                </span>
                <div>
                  <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-ink">Payment Method</h2>
                  <p className="text-xs text-muted">Select your payment method below.</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {gateway && (
                  <>
                    <PaymentOption
                      id="method-upi"
                      name="method"
                      value="upi"
                      selected={selectedMethod === "upi"}
                      onSelect={() => setSelectedMethod("upi")}
                      title="UPI Instant Transfer"
                      description="Google Pay, PhonePe, Paytm, BHIM & all standard UPI apps"
                      badge="Instant"
                      icon={
                        <svg className="h-5 w-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                          <rect x="2" y="5" width="20" height="14" rx="2" />
                          <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                      }
                    />

                    <PaymentOption
                      id="method-card"
                      name="method"
                      value="card"
                      selected={selectedMethod === "card"}
                      onSelect={() => setSelectedMethod("card")}
                      title="Credit or Debit Card"
                      description="Visa, Mastercard, RuPay, Maestro & American Express"
                      icon={
                        <svg className="h-5 w-5 text-ink/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                          <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                      }
                    />

                    <PaymentOption
                      id="method-netbanking"
                      name="method"
                      value="netbanking"
                      selected={selectedMethod === "netbanking"}
                      onSelect={() => setSelectedMethod("netbanking")}
                      title="Net Banking"
                      description="Access all recognized Indian banking portals"
                      icon={
                        <svg className="h-5 w-5 text-ink/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                          <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 2L2 7h20L12 2z" />
                        </svg>
                      }
                    />
                  </>
                )}

                {settings.codEnabled && (
                  <PaymentOption
                    id="method-cod"
                    name="method"
                    value="cod"
                    selected={selectedMethod === "cod"}
                    onSelect={() => setSelectedMethod("cod")}
                    title="Cash on Delivery (COD)"
                    description="Pay in cash or standard courier QR when parcel is delivered"
                    icon={
                      <svg className="h-5 w-5 text-ink/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                        <rect x="2" y="6" width="20" height="12" rx="1" />
                        <circle cx="12" cy="12" r="3" />
                        <path d="M6 12h.01M18 12h.01" />
                      </svg>
                    }
                  />
                )}

                {!gateway && !settings.codEnabled && (
                  <p className="text-[13px] text-muted">
                    No payment gateways are currently active. Please contact atelier concierge.
                  </p>
                )}
              </div>
            </section>

          </div>

          {/* Right Column: Sticky Order Summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-xs border border-line bg-paper p-6 sm:p-8 shadow-sm">
              
              <div className="flex items-center justify-between border-b border-line pb-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink">Order Summary</h2>
                <span className="text-xs text-muted">{lines.length} {lines.length === 1 ? "item" : "items"}</span>
              </div>

              {/* Items List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-line/60 pr-1 my-4">
                {lines.map((l) => (
                  <div key={l.slug + l.size} className="flex items-center gap-4 py-3.5">
                    <div className="h-16 w-12 shrink-0 overflow-hidden rounded-xs border border-line bg-bone">
                      <ProductMedia product={l.product} ratio="aspect-[3/4]" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-xs font-medium text-ink">{l.product.name}</h3>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted">
                        <span>Size {l.size}</span>
                        <span>·</span>
                        <span>Qty {l.qty}</span>
                      </div>
                    </div>
                    <div className="text-right text-xs font-medium text-ink">
                      {inr(l.product.price * l.qty)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Redemption Box */}
              <div className="border-t border-line pt-4">
                {coupon ? (
                  <div className="flex items-center justify-between rounded-xs border border-emerald-300 bg-emerald-50/60 px-3.5 py-2.5">
                    <div>
                      <p className="text-xs font-semibold text-emerald-800">
                        {coupon.code} <span className="font-normal text-emerald-700">applied</span>
                      </p>
                      <p className="text-[11px] text-emerald-600">
                        {coupon.description || `Discount: ${inr(coupon.discount)}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCoupon(null);
                        setCouponError(null);
                      }}
                      className="text-[11px] font-medium uppercase tracking-[0.14em] text-red-700 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="code" className="block text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
                      Promotional Code
                    </label>
                    <div className="mt-1.5 flex gap-2">
                      <input
                        id="code"
                        name="code"
                        form="coupon-form"
                        placeholder="Enter coupon code"
                        autoComplete="off"
                        className="min-w-0 flex-1 rounded-xs border border-line bg-bone/40 px-3 py-2 text-xs uppercase tracking-[0.1em] text-ink outline-none transition focus:border-gold focus:bg-white"
                      />
                      <button
                        type="submit"
                        form="coupon-form"
                        disabled={checking}
                        className="rounded-xs border border-ink bg-ink px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-bone transition hover:bg-gold-dark hover:border-gold-dark disabled:opacity-50"
                      >
                        {checking ? "Checking…" : "Apply"}
                      </button>
                    </div>
                    {couponError && <p className="mt-1.5 text-xs text-red-600">{couponError}</p>}
                  </div>
                )}
              </div>

              {/* Financial Calculation */}
              <div className="mt-5 space-y-2.5 border-t border-line pt-4 text-xs text-muted">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-ink">{inr(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon Discount</span>
                    <span className="font-medium">− {inr(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-ink">
                    {shipping === 0 ? "Complimentary" : inr(shipping)}
                  </span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink">Total Payable</span>
                  <p className="text-[10px] text-muted">Inclusive of all taxes</p>
                </div>
                <span className="font-display text-2xl font-normal text-ink">{inr(total)}</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={busy}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xs bg-ink py-4 text-xs font-semibold uppercase tracking-[0.2em] text-bone transition hover:bg-gold-dark disabled:opacity-60"
              >
                {busy ? (
                  <>
                    <svg className="h-4 w-4 animate-spin text-bone" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Processing Order…</span>
                  </>
                ) : (
                  <span>Place Order · {inr(total)}</span>
                )}
              </button>

              <div className="mt-4 text-center">
                <Link
                  href="/cart"
                  className="text-[11px] uppercase tracking-[0.18em] text-muted transition hover:text-ink"
                >
                  ← Return to Bag
                </Link>
              </div>

              {/* Atelier Trust Badges */}
              <div className="mt-6 space-y-2 border-t border-line/70 pt-5 text-[11px] text-muted">
                <div className="flex items-center gap-2.5">
                  <svg className="h-3.5 w-3.5 shrink-0 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>Verified Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <svg className="h-3.5 w-3.5 shrink-0 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>Complimentary Size Exchanges within 7 Days</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <svg className="h-3.5 w-3.5 shrink-0 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>100% Zero-Sheer & Modesty Standard Tested</span>
                </div>
              </div>

            </div>
          </aside>
        </form>

      </div>
    </div>
  );
}

function InputGroup({ label, name, prefix, className = "", ...rest }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
        {label}
      </label>
      <div className="relative mt-2">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-xs text-muted">
            {prefix}
          </span>
        )}
        <input
          id={name}
          name={name}
          {...rest}
          className={`w-full rounded-xs border border-line bg-paper px-3.5 py-2.5 text-xs text-ink outline-none transition placeholder:text-muted/50 focus:border-gold focus:bg-white ${
            prefix ? "pl-11" : ""
          }`}
        />
      </div>
    </div>
  );
}

function PaymentOption({ id, name, value, selected, onSelect, title, description, badge, icon }) {
  return (
    <label
      htmlFor={id}
      onClick={onSelect}
      className={`group relative flex cursor-pointer items-start gap-4 rounded-xs border p-4 transition ${
        selected
          ? "border-gold bg-gold/[0.04] shadow-xs"
          : "border-line bg-paper hover:border-ink/40"
      }`}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
        required
      />

      {/* Custom Radio Circle */}
      <div
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition ${
          selected ? "border-gold bg-gold" : "border-line group-hover:border-ink/50"
        }`}
      >
        {selected && <div className="h-1.5 w-1.5 rounded-full bg-paper" />}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-ink">{title}</span>
          {badge && (
            <span className="rounded-xs bg-gold/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-gold-dark">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted">{description}</p>
      </div>

      <div className="shrink-0">{icon}</div>
    </label>
  );
}
