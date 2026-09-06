import Link from "next/link";
import db, { plain } from "@/lib/db";
import { Order, PAYMENT_STATUSES } from "@/lib/models";
import { requirePageAccess } from "@/lib/auth";
import { inr } from "@/lib/products";
import { razorpayEnabled } from "@/lib/razorpay";
import { Table, Row, Cell } from "../../_components/Table";
import { Badge } from "../../_components/ui";

/*
 * Payments are a view over orders rather than their own collection — one
 * document, one truth. Refunds are issued from the order detail screen.
 */
export default async function Payments({ searchParams }) {
  await requirePageAccess("payments:read");
  const sp = await searchParams;
  const status = sp?.status ?? "";
  const method = sp?.method ?? "";

  await db();
  const where = {};
  if (PAYMENT_STATUSES.includes(status)) where["payment.status"] = status;
  if (method) where["payment.method"] = method;

  const [rows, totals] = await Promise.all([
    Order.find(where).sort({ createdAt: -1 }).limit(100).lean().then(plain),
    Order.aggregate([
      { $group: { _id: "$payment.status", count: { $sum: 1 }, value: { $sum: "$amounts.total" } } },
    ]),
  ]);

  const byStatus = Object.fromEntries(totals.map((t) => [t._id, t]));
  const collected = byStatus.paid?.value ?? 0;
  const outstanding = byStatus.pending?.value ?? 0;
  const refunded = rows.reduce((s, o) => s + (o.payment.refunds ?? []).reduce((n, r) => n + r.amount, 0), 0);

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-brand text-muted">Money</p>
          <h1 className="mt-2 font-display text-[2.4rem] font-light leading-none">Payments</h1>
        </div>
        {!razorpayEnabled() && (
          <p className="border border-amber-200 bg-amber-50 px-4 py-2 text-[11px] text-amber-900">
            Razorpay keys not set — orders fall back to cash on delivery.
          </p>
        )}
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ["Collected", inr(collected), `${byStatus.paid?.count ?? 0} settled`],
          ["Awaiting payment", inr(outstanding), `${byStatus.pending?.count ?? 0} orders`],
          ["Refunded", inr(refunded), "in the last 100 orders"],
        ].map(([k, v, hint]) => (
          <div key={k} className="border border-line bg-paper p-5">
            <p className="text-[9.5px] uppercase tracking-[0.16em] text-muted">{k}</p>
            <p className="mt-3 font-display text-[1.9rem] leading-none">{v}</p>
            <p className="mt-2 text-[10px] text-muted">{hint}</p>
          </div>
        ))}
      </div>

      <form className="mt-8 flex flex-wrap items-end gap-3 border border-line bg-paper p-4">
        <select name="status" defaultValue={status} className="border border-line bg-bone px-3 py-2.5 text-sm outline-none focus:border-gold">
          <option value="">All payment statuses</option>
          {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
        <select name="method" defaultValue={method} className="border border-line bg-bone px-3 py-2.5 text-sm outline-none focus:border-gold">
          <option value="">All methods</option>
          {["upi", "card", "netbanking", "wallet", "cod"].map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <button className="bg-ink px-5 py-2.5 text-[10px] uppercase tracking-[0.16em] text-bone">Filter</button>
        {(status || method) && (
          <Link href="/admin/payments" className="px-3 py-2.5 text-[10px] uppercase tracking-[0.16em] text-muted hover:text-ink">
            Clear
          </Link>
        )}
      </form>

      <div className="mt-6">
        <Table head={["Order", "Date", "Customer", "Method", "Reference", "Amount", "Status", ""]} empty="No payments match.">
          {rows.map((o) => {
            const back = (o.payment.refunds ?? []).reduce((s, r) => s + r.amount, 0);
            return (
              <Row key={o._id}>
                <Cell className="font-medium">{o.orderNo}</Cell>
                <Cell className="whitespace-nowrap text-xs text-muted">
                  {new Date(o.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                </Cell>
                <Cell className="text-muted">{o.customer.name}</Cell>
                <Cell className="text-[10px] uppercase tracking-[0.14em] text-muted">{o.payment.method}</Cell>
                <Cell className="font-mono text-[11px] text-muted">{o.payment.razorpayPaymentId ?? "—"}</Cell>
                <Cell>
                  {inr(o.amounts.total)}
                  {back > 0 && <span className="block text-[10px] text-muted">− {inr(back)} refunded</span>}
                </Cell>
                <Cell><Badge tone={o.payment.status}>{o.payment.status}</Badge></Cell>
                <Cell className="text-right">
                  <Link href={`/admin/orders/${o._id}`} className="text-[10px] uppercase tracking-[0.16em] text-muted hover:text-ink">
                    Open →
                  </Link>
                </Cell>
              </Row>
            );
          })}
        </Table>
      </div>
    </>
  );
}
