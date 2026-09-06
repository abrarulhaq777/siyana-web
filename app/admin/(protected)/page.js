import Link from "next/link";
import db from "@/lib/db";
import { Order, Product, User, Audit } from "@/lib/models";
import { plain } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { inr } from "@/lib/products";
import { Table, Row, Cell } from "../_components/Table";
import { Badge } from "../_components/ui";

const thirtyDaysAgo = () => new Date(Date.now() - 30 * 864e5);

export default async function Dashboard() {
  const user = await requireStaff();
  await db();

  const since = thirtyDaysAgo();
  const [revenue, orders30, pending, lowStock, customers, recent, activity] = await Promise.all([
    Order.aggregate([
      { $match: { "payment.status": { $in: ["paid", "partially_refunded"] } } },
      { $group: { _id: null, total: { $sum: "$amounts.total" } } },
    ]),
    Order.countDocuments({ createdAt: { $gte: since } }),
    Order.countDocuments({ status: "pending" }),
    Product.countDocuments({ active: true, "stock.qty": { $lte: 2 } }),
    User.countDocuments({ role: "customer" }),
    can(user, "orders:read")
      ? Order.find().sort({ createdAt: -1 }).limit(8).lean().then(plain)
      : [],
    Audit.find().sort({ at: -1 }).limit(8).lean().then(plain),
  ]);

  const stats = [
    ["Lifetime revenue", inr(revenue[0]?.total ?? 0), "settled payments"],
    ["Orders · 30 days", orders30, "all statuses"],
    ["Awaiting action", pending, "orders still pending"],
    ["Customers", customers, "registered accounts"],
  ];

  return (
    <>
      <header>
        <p className="text-[12px] uppercase tracking-brand text-muted">Overview</p>
        <h1 className="mt-2 font-display text-[2.4rem] font-light leading-none">
          Good to see you, {user.name.split(" ")[0]}.
        </h1>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value, hint]) => (
          <div key={label} className="border border-line bg-paper p-5">
            <p className="text-[11.5px] uppercase tracking-[0.16em] text-muted">{label}</p>
            <p className="mt-3 font-display text-[2rem] leading-none text-ink">{value}</p>
            <p className="mt-2 text-[12px] text-muted">{hint}</p>
          </div>
        ))}
      </div>

      {lowStock > 0 && can(user, "products:read") && (
        <Link
          href="/admin/products?filter=low"
          className="mt-6 flex items-center justify-between border border-amber-200 bg-amber-50 px-5 py-4 text-xs text-amber-900 transition hover:border-amber-400"
        >
          <span>
            <strong className="font-medium">{lowStock}</strong> live{" "}
            {lowStock === 1 ? "product has" : "products have"} a size down to 2 or fewer units.
          </span>
          <span className="text-[12px] uppercase tracking-[0.16em]">Review stock →</span>
        </Link>
      )}

      {can(user, "orders:read") && (
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-[1.6rem] leading-none">Latest orders</h2>
            <Link href="/admin/orders" className="text-[12px] uppercase tracking-[0.16em] text-muted hover:text-ink">
              All orders →
            </Link>
          </div>

          <Table head={["Order", "Customer", "Total", "Payment", "Status", ""]} empty="No orders yet.">
            {recent.map((o) => (
              <Row key={o._id}>
                <Cell className="font-medium">{o.orderNo}</Cell>
                <Cell className="text-muted">{o.customer.name}</Cell>
                <Cell>{inr(o.amounts.total)}</Cell>
                <Cell><Badge tone={o.payment.status}>{o.payment.status}</Badge></Cell>
                <Cell><Badge tone={o.status}>{o.status}</Badge></Cell>
                <Cell className="text-right">
                  <Link href={`/admin/orders/${o._id}`} className="text-[12px] uppercase tracking-[0.16em] text-muted hover:text-ink">
                    Open →
                  </Link>
                </Cell>
              </Row>
            ))}
          </Table>
        </section>
      )}

      <section className="mt-10">
        <h2 className="mb-4 font-display text-[1.6rem] leading-none">Recent activity</h2>
        <ul className="divide-y divide-line border border-line bg-paper">
          {activity.length === 0 && <li className="px-5 py-10 text-center text-xs text-muted">No activity recorded yet.</li>}
          {activity.map((a) => (
            <li key={a._id} className="flex items-center justify-between gap-4 px-5 py-3.5 text-xs">
              <span className="text-ink">
                <span className="text-muted">{a.userName ?? "System"}</span> · {a.action}
                {a.entityId && <span className="text-muted"> · {a.entityId}</span>}
              </span>
              <time className="shrink-0 text-[12px] text-muted">
                {new Date(a.at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </time>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
