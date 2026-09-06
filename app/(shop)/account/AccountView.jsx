"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Divider } from "@/components/Ornament";
import { inr } from "@/lib/products";
import { signOut, saveAddress } from "./actions";

const statusTone = {
  delivered: "text-sage",
  cancelled: "text-red-600",
  shipped: "text-gold-dark",
};

export default function AccountView({ user, orders }) {
  const [state, action] = useActionState(saveAddress, null);
  const address = user.addresses?.find((a) => a.isDefault) ?? user.addresses?.[0];
  const spend = orders.reduce((s, o) => s + o.amounts.total, 0);

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[12px] uppercase tracking-brand text-muted">Your account</p>
          <h1 className="mt-4 font-display text-[3rem] font-light leading-none">{user.name}</h1>
          <p className="mt-3 text-sm text-muted">{user.email}</p>
        </div>
        <form action={signOut}>
          <button className="border border-line px-6 py-3 text-[12px] uppercase tracking-brand text-muted transition hover:border-gold hover:text-ink">
            Sign out
          </button>
        </form>
      </header>

      <div className="mt-12 grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <section>
          <h2 className="font-display text-[1.9rem] font-light leading-none">Orders</h2>

          {orders.length === 0 ? (
            <div className="mt-8 border border-line bg-paper px-6 py-16 text-center">
              <p className="text-sm text-muted">No orders yet.</p>
              <Link
                href="/collections"
                className="mt-6 inline-block bg-ink px-8 py-3.5 text-[12px] uppercase tracking-brand text-bone transition hover:bg-gold-dark"
              >
                Start browsing
              </Link>
            </div>
          ) : (
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {orders.map((o) => (
                <li key={o._id} className="py-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <span className="font-display text-[1.4rem] text-ink">{o.orderNo}</span>
                    <span className="text-sm">{inr(o.amounts.total)}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] uppercase tracking-[0.16em] text-muted">
                    <time>{new Date(o.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</time>
                    <span className="h-2.5 w-px bg-line" />
                    <span className={statusTone[o.status] ?? "text-ink"}>{o.status}</span>
                    <span className="h-2.5 w-px bg-line" />
                    <span>{o.payment.status === "paid" ? "Paid" : o.payment.method === "cod" ? "Pay on delivery" : "Payment pending"}</span>
                  </div>
                  <ul className="mt-3 space-y-1 text-xs text-muted">
                    {o.items.map((i, n) => (
                      <li key={n}>{i.name} · {i.size} × {i.qty}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside>
          <Divider label="Delivery" className="!justify-start" />
          <h2 className="mt-6 font-display text-[1.9rem] font-light leading-none">Default address</h2>

          <form action={action} className="mt-6 space-y-5 border border-line bg-paper p-6">
            {state?.error && <p className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{state.error}</p>}
            {state?.ok && <p className="border border-sage/30 bg-sage/10 px-3 py-2 text-xs text-sage">{state.message}</p>}

            <Field label="Phone" name="phone" defaultValue={user.phone} pattern="[0-9]{10}" inputMode="numeric" />
            <Field label="Address" name="line1" defaultValue={address?.line1} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City" name="city" defaultValue={address?.city} />
              <Field label="State" name="state" defaultValue={address?.state} />
            </div>
            <Field label="Pincode" name="pincode" defaultValue={address?.pincode} pattern="[0-9]{6}" inputMode="numeric" />

            <button className="w-full bg-ink py-3.5 text-[12px] uppercase tracking-brand text-bone transition hover:bg-gold-dark">
              Save address
            </button>
          </form>

          <div className="mt-8 border border-line bg-sand/40 p-6">
            <p className="text-[12px] uppercase tracking-brand text-muted">Lifetime</p>
            <p className="mt-3 font-display text-[2rem] leading-none">{inr(spend)}</p>
            <p className="mt-2 text-xs text-muted">across {orders.length} {orders.length === 1 ? "order" : "orders"}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Field({ label, name, ...rest }) {
  return (
    <div>
      <label htmlFor={name} className="text-[12px] uppercase tracking-[0.18em] text-muted">{label}</label>
      <input
        id={name}
        name={name}
        required
        {...rest}
        className="mt-1.5 w-full border-b border-ink/20 bg-transparent py-2.5 text-sm outline-none focus:border-gold"
      />
    </div>
  );
}
