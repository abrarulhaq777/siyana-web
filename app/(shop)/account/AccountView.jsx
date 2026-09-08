"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import Reveal from "@/components/Reveal";
import { Star, Rosette, Crescent, Corner } from "@/components/Ornament";
import { inr } from "@/lib/products";
import { signOut, saveAddress } from "./actions";

const statusTone = {
  delivered: "text-emerald-800 bg-emerald-500/10 border-emerald-600/30",
  cancelled: "text-red-700 bg-red-50 border-red-200",
  shipped: "text-gold-dark bg-gold/10 border-gold/40",
  processing: "text-ink bg-sand/60 border-line",
};

export default function AccountView({ user, orders }) {
  const [state, action, isPending] = useActionState(saveAddress, null);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const address = user.addresses?.find((a) => a.isDefault) ?? user.addresses?.[0];
  const spend = orders.reduce((s, o) => s + o.amounts.total, 0);

  return (
    <div className="bg-bone/40 pb-24 pt-8">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        
        {/* ── 01 · Member Dashboard Header ── */}
        <header className="relative overflow-hidden rounded-xs border border-line bg-paper p-8 shadow-sm sm:p-10">
          <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.03]" />
          <Corner className="absolute -top-2 -right-2 h-10 w-10 text-gold/40" />

          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
            
            {/* User Profile Info */}
            <div className="flex items-start gap-5">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-gold/40 bg-gradient-to-tr from-sand to-paper text-gold-dark font-display text-[1.8rem] shadow-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : "S"}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-arabic text-[17px] text-gold-dark" dir="rtl">
                    دار الصيانة · حساب العضوية
                  </span>
                  <span className="h-3 w-px bg-gold/40" />
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-700/30 bg-emerald-500/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    Verified Member
                  </span>
                </div>

                <h1 className="mt-2 font-display text-[2.4rem] font-light leading-none text-ink sm:text-[2.8rem]">
                  {user.name}
                </h1>
                <p className="mt-1 font-mono text-[12.5px] text-muted">{user.email}</p>
              </div>
            </div>

            {/* Sign Out Action & Dialog */}
            <div className="flex items-center gap-4">
              {!confirmSignOut ? (
                <button
                  type="button"
                  onClick={() => setConfirmSignOut(true)}
                  className="inline-flex items-center gap-2 rounded-xs border border-line bg-bone px-5 py-2.5 text-[11.5px] font-medium uppercase tracking-brand text-muted transition hover:border-gold hover:text-ink hover:bg-gold/5"
                >
                  <span>Sign Out</span>
                  <span className="text-xs">↪</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 rounded-xs border border-gold/40 bg-sand/40 p-2 text-xs">
                  <span className="text-ink font-medium px-2">Sign out of Siyana?</span>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="bg-ink px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-bone transition hover:bg-red-700"
                    >
                      Confirm
                    </button>
                  </form>
                  <button
                    type="button"
                    onClick={() => setConfirmSignOut(false)}
                    className="border border-line bg-paper px-2.5 py-1.5 text-[11px] uppercase tracking-wider text-muted hover:text-ink"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Account Summary Metrics Strip */}
          <div className="relative mt-8 grid grid-cols-2 gap-4 border-t border-line/80 pt-6 sm:grid-cols-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted">Order History</span>
              <p className="mt-1 font-display text-[1.8rem] font-light text-ink">
                {orders.length}
              </p>
              <p className="text-[11px] text-muted">All-time garments</p>
            </div>

            <div className="border-l border-line/70 pl-4">
              <span className="text-[10px] uppercase tracking-wider text-muted">Lifetime Spend</span>
              <p className="mt-1 font-display text-[1.8rem] font-light text-ink">
                {inr(spend)}
              </p>
              <p className="text-[11px] text-muted">Total atelier spend</p>
            </div>

            <div className="border-l border-line/70 pl-4">
              <span className="text-[10px] uppercase tracking-wider text-muted">Courier Privilege</span>
              <p className="mt-1 font-display text-[1.5rem] text-gold-dark">
                Complimentary
              </p>
              <p className="text-[11px] text-muted">On orders &gt; ₹2,999</p>
            </div>

            <div className="border-l border-line/70 pl-4">
              <span className="text-[10px] uppercase tracking-wider text-muted">Concierge Desk</span>
              <p className="mt-1 font-display text-[1.5rem] text-ink">
                Active 24/7
              </p>
              <p className="text-[11px] text-muted">Sizing & drop advisory</p>
            </div>
          </div>
        </header>

        {/* ── 02 · Main Dashboard Grid ── */}
        <div className="mt-12 grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-14">
          
          {/* Orders History Column */}
          <Reveal from="left">
            <section className="rounded-xs border border-line bg-paper p-8 shadow-xs">
              <div className="flex items-center justify-between border-b border-line/80 pb-5">
                <div>
                  <h2 className="font-display text-[1.9rem] font-light leading-none text-ink">
                    Order History
                  </h2>
                  <p className="mt-1 text-xs text-muted">
                    Track dispatches, review tailored lengths, and view invoices.
                  </p>
                </div>
                <span className="font-mono text-xs text-muted">
                  {orders.length} {orders.length === 1 ? "Record" : "Records"}
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="py-16 text-center">
                  <Rosette className="mx-auto h-12 w-12 text-gold/50" />
                  <p className="mt-4 font-display text-[1.6rem] text-ink">Your Wardrobe Awaits</p>
                  <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-muted">
                    You have not placed any orders yet. Explore our signature Japanese Nida abayas and tailored everyday modest essentials.
                  </p>
                  <Link
                    href="/collections"
                    className="mt-6 inline-block bg-ink px-8 py-3.5 text-[12px] font-medium uppercase tracking-brand text-bone shadow-xs transition hover:bg-gold-dark"
                  >
                    Explore Atelier Drops
                  </Link>
                </div>
              ) : (
                <ul className="mt-4 divide-y divide-line/70">
                  {orders.map((o) => (
                    <li key={o._id} className="py-6 first:pt-4 last:pb-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="font-display text-[1.5rem] font-medium text-ink">
                            {o.orderNo}
                          </span>
                          <span
                            className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                              statusTone[o.status] ?? "text-ink border-line"
                            }`}
                          >
                            {o.status}
                          </span>
                        </div>
                        <span className="font-mono text-sm font-semibold text-ink">
                          {inr(o.amounts.total)}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-muted font-mono">
                        <time>
                          {new Date(o.createdAt).toLocaleDateString("en-IN", {
                            dateStyle: "medium",
                          })}
                        </time>
                        <span className="h-2.5 w-px bg-line" />
                        <span>
                          {o.payment.status === "paid"
                            ? "✓ Paid Online"
                            : o.payment.method === "cod"
                            ? "Cash On Delivery"
                            : "Payment Pending"}
                        </span>
                      </div>

                      <div className="mt-4 rounded-xs border border-line/60 bg-bone/40 p-3.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-dark">
                          Tailored Garments
                        </span>
                        <ul className="mt-2 space-y-1.5 text-xs text-ink/90">
                          {o.items.map((i, n) => (
                            <li key={n} className="flex justify-between">
                              <span>
                                {i.name} · <strong className="font-mono">{i.size}</strong>
                              </span>
                              <span className="font-mono text-muted">× {i.qty}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </Reveal>

          {/* Delivery & Sizing Profile Column */}
          <Reveal from="right" delay={120} className="space-y-8">
            <section className="rounded-xs border border-line bg-paper p-8 shadow-xs">
              <div className="flex items-center justify-between border-b border-line/80 pb-4">
                <div>
                  <h2 className="font-display text-[1.8rem] font-light leading-none text-ink">
                    Primary Address
                  </h2>
                  <p className="mt-1 text-xs text-muted">
                    Discreet shipping address for expedited delivery.
                  </p>
                </div>
                <Crescent className="h-4 w-4 text-gold-dark" />
              </div>

              <form action={action} className="mt-6 space-y-4">
                {state?.error && (
                  <p className="border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    {state.error}
                  </p>
                )}
                {state?.ok && (
                  <p className="border border-emerald-700/30 bg-emerald-500/10 p-3 text-xs text-emerald-800">
                    {state.message}
                  </p>
                )}

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted font-medium">
                    Phone (for Delivery SMS)
                  </label>
                  <input
                    name="phone"
                    defaultValue={user.phone}
                    pattern="[0-9]{10}"
                    inputMode="numeric"
                    placeholder="10-digit mobile number"
                    className="mt-1.5 w-full border border-line bg-bone px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted font-medium">
                    Address Line
                  </label>
                  <input
                    name="line1"
                    defaultValue={address?.line1}
                    required
                    placeholder="Apartment, building, street"
                    className="mt-1.5 w-full border border-line bg-bone px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-gold"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-muted font-medium">
                      City
                    </label>
                    <input
                      name="city"
                      defaultValue={address?.city}
                      required
                      placeholder="City"
                      className="mt-1.5 w-full border border-line bg-bone px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-muted font-medium">
                      State
                    </label>
                    <input
                      name="state"
                      defaultValue={address?.state}
                      required
                      placeholder="State"
                      className="mt-1.5 w-full border border-line bg-bone px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted font-medium">
                    Pincode
                  </label>
                  <input
                    name="pincode"
                    defaultValue={address?.pincode}
                    required
                    pattern="[0-9]{6}"
                    inputMode="numeric"
                    placeholder="6-digit pincode"
                    className="mt-1.5 w-full border border-line bg-bone px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-gold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="mt-2 w-full bg-ink py-3 text-[11.5px] font-medium uppercase tracking-brand text-bone shadow-xs transition hover:bg-gold-dark disabled:opacity-50"
                >
                  {isPending ? "Updating Atelier..." : "Save Delivery Address"}
                </button>
              </form>
            </section>

            {/* Concierge Assistance Card */}
            <section className="rounded-xs border border-line bg-sand/30 p-6 text-xs text-muted">
              <div className="flex items-center gap-2 text-ink font-semibold uppercase tracking-wider text-[11px]">
                <Star className="h-3.5 w-3.5 text-gold-dark" />
                <span>Need Sizing or Order Help?</span>
              </div>
              <p className="mt-2 leading-relaxed">
                Our atelier concierge team is available to assist with length adjustments, exchanges, or custom bridal requests.
              </p>
              <Link
                href="/contact"
                className="mt-3 inline-block font-medium uppercase tracking-brand text-gold-dark hover:underline"
              >
                Contact Concierge Desk →
              </Link>
            </section>
          </Reveal>

        </div>
      </div>
    </div>
  );
}
