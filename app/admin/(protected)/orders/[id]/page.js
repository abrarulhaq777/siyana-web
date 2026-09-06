import Link from "next/link";
import { notFound } from "next/navigation";
import db, { plain } from "@/lib/db";
import { Order, ORDER_STATUSES } from "@/lib/models";
import { requirePageAccess, currentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { inr } from "@/lib/products";
import { Badge } from "../../../_components/ui";
import OrderControls from "./OrderControls";

export default async function OrderDetail({ params }) {
  await requirePageAccess("orders:read");
  const user = await currentUser();
  const { id } = await params;

  await db();
  const order = await Order.findById(id).lean().catch(() => null);
  if (!order) notFound();

  const o = plain(order);
  const refunded = (o.payment.refunds ?? []).reduce((s, r) => s + r.amount, 0);

  return (
    <>
      <Link href="/admin/orders" className="text-[12px] uppercase tracking-[0.16em] text-muted hover:text-ink">
        ← All orders
      </Link>

      <header className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[2.4rem] font-light leading-none">{o.orderNo}</h1>
          <p className="mt-2 text-xs text-muted">
            Placed {new Date(o.createdAt).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge tone={o.status}>{o.status}</Badge>
          <Badge tone={o.payment.status}>{o.payment.status}</Badge>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <section className="border border-line bg-paper">
            <h2 className="border-b border-line px-5 py-3.5 text-[12px] uppercase tracking-[0.16em] text-muted">Items</h2>
            <ul className="divide-y divide-line">
              {o.items.map((it, i) => (
                <li key={i} className="flex items-center gap-4 px-5 py-4">
                  {it.image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={it.image} alt="" className="h-16 w-12 shrink-0 object-cover" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink">{it.name}</p>
                    <p className="mt-0.5 text-[13px] uppercase tracking-[0.14em] text-muted">
                      Size {it.size} · {it.qty} × {inr(it.price)}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm">{inr(it.price * it.qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="space-y-2 border-t border-line px-5 py-4 text-sm">
              <Line k="Subtotal" v={inr(o.amounts.subtotal)} />
              <Line k="Shipping" v={o.amounts.shipping ? inr(o.amounts.shipping) : "Complimentary"} />
              {o.amounts.discount > 0 && <Line k="Discount" v={`− ${inr(o.amounts.discount)}`} />}
              <div className="flex justify-between border-t border-line pt-3 font-display text-xl">
                <dt>Total</dt>
                <dd>{inr(o.amounts.total)}</dd>
              </div>
              {refunded > 0 && (
                <p className="pt-1 text-right text-[13px] text-muted">Refunded {inr(refunded)}</p>
              )}
            </dl>
          </section>

          <section className="border border-line bg-paper">
            <h2 className="border-b border-line px-5 py-3.5 text-[12px] uppercase tracking-[0.16em] text-muted">History</h2>
            <ol className="divide-y divide-line">
              {(o.timeline ?? []).slice().reverse().map((t, i) => (
                <li key={i} className="px-5 py-3.5 text-xs">
                  <div className="flex justify-between gap-4">
                    <span className="text-ink">{t.label}</span>
                    <time className="shrink-0 text-[12px] text-muted">
                      {new Date(t.at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </time>
                  </div>
                  {t.note && <p className="mt-1 text-muted">{t.note}</p>}
                </li>
              ))}
              {!o.timeline?.length && <li className="px-5 py-8 text-center text-xs text-muted">Nothing logged yet.</li>}
            </ol>
          </section>
        </div>

        <div className="space-y-8">
          <OrderControls
            order={o}
            statuses={ORDER_STATUSES}
            canWrite={can(user, "orders:write")}
            canRefund={can(user, "payments:refund")}
            refunded={refunded}
          />

          <section className="border border-line bg-paper p-5">
            <h2 className="text-[12px] uppercase tracking-[0.16em] text-muted">Customer</h2>
            <p className="mt-3 text-sm text-ink">{o.customer.name}</p>
            <p className="text-xs text-muted">{o.customer.email}</p>
            <p className="text-xs text-muted">{o.customer.phone}</p>
            {o.user && (
              <Link href={`/admin/customers/${o.user}`} className="mt-3 inline-block text-[12px] uppercase tracking-[0.16em] text-gold-dark hover:text-ink">
                View account →
              </Link>
            )}

            <h2 className="mt-6 border-t border-line pt-5 text-[12px] uppercase tracking-[0.16em] text-muted">Deliver to</h2>
            <address className="mt-3 text-xs not-italic leading-relaxed text-ink">
              {o.address.line1}
              <br />
              {o.address.city}, {o.address.state} {o.address.pincode}
            </address>
          </section>

          <section className="border border-line bg-paper p-5 text-xs">
            <h2 className="text-[12px] uppercase tracking-[0.16em] text-muted">Payment</h2>
            <dl className="mt-3 space-y-2">
              <Line k="Method" v={o.payment.method.toUpperCase()} />
              <Line k="Status" v={o.payment.status.replace(/_/g, " ")} />
              {o.payment.razorpayPaymentId && <Line k="Razorpay payment" v={o.payment.razorpayPaymentId} />}
              {o.payment.razorpayOrderId && <Line k="Razorpay order" v={o.payment.razorpayOrderId} />}
              {o.payment.paidAt && (
                <Line k="Paid at" v={new Date(o.payment.paidAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} />
              )}
            </dl>
            {(o.payment.refunds ?? []).length > 0 && (
              <ul className="mt-4 space-y-2 border-t border-line pt-3">
                {o.payment.refunds.map((r) => (
                  <li key={r._id} className="flex justify-between gap-3 text-[13px]">
                    <span className="text-muted">{new Date(r.at).toLocaleDateString("en-IN")} · {r.reference}</span>
                    <span>{inr(r.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

const Line = ({ k, v }) => (
  <div className="flex justify-between gap-4">
    <dt className="text-muted">{k}</dt>
    <dd className="text-right text-ink">{v}</dd>
  </div>
);
