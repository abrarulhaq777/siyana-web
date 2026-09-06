import Link from "next/link";
import { notFound } from "next/navigation";
import db, { plain } from "@/lib/db";
import { User, Order } from "@/lib/models";
import { requirePageAccess, currentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { inr } from "@/lib/products";
import { Table, Row, Cell } from "../../../_components/Table";
import { Badge } from "../../../_components/ui";
import StatusToggle from "../../staff/StatusToggle";

export default async function CustomerDetail({ params }) {
  await requirePageAccess("customers:read");
  const me = await currentUser();
  const { id } = await params;

  await db();
  const found = await User.findById(id).lean().catch(() => null);
  if (!found) notFound();
  const c = plain(found);
  const orders = plain(await Order.find({ user: id }).sort({ createdAt: -1 }).lean());
  const spend = orders.reduce((s, o) => s + o.amounts.total, 0);

  return (
    <>
      <Link href="/admin/customers" className="text-[10px] uppercase tracking-[0.16em] text-muted hover:text-ink">
        ← Customers
      </Link>

      <header className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[2.4rem] font-light leading-none">{c.name}</h1>
          <p className="mt-2 text-xs text-muted">{c.email} · {c.phone || "no phone"}</p>
        </div>
        <Badge tone={c.status}>{c.status}</Badge>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ["Orders", orders.length],
          ["Lifetime spend", inr(spend)],
          ["Joined", new Date(c.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })],
        ].map(([k, v]) => (
          <div key={k} className="border border-line bg-paper p-5">
            <p className="text-[9.5px] uppercase tracking-[0.16em] text-muted">{k}</p>
            <p className="mt-2.5 font-display text-[1.6rem] leading-none">{v}</p>
          </div>
        ))}
      </div>

      {c.addresses?.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-display text-[1.4rem] leading-none">Addresses</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {c.addresses.map((a) => (
              <li key={a._id} className="border border-line bg-paper p-4 text-xs leading-relaxed text-ink">
                {a.line1}<br />{a.city}, {a.state} {a.pincode}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="mb-3 font-display text-[1.4rem] leading-none">Order history</h2>
        <Table head={["Order", "Date", "Total", "Payment", "Status", ""]} empty="No orders from this customer yet.">
          {orders.map((o) => (
            <Row key={o._id}>
              <Cell className="font-medium">{o.orderNo}</Cell>
              <Cell className="whitespace-nowrap text-xs text-muted">
                {new Date(o.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
              </Cell>
              <Cell>{inr(o.amounts.total)}</Cell>
              <Cell><Badge tone={o.payment.status}>{o.payment.status}</Badge></Cell>
              <Cell><Badge tone={o.status}>{o.status}</Badge></Cell>
              <Cell className="text-right">
                <Link href={`/admin/orders/${o._id}`} className="text-[10px] uppercase tracking-[0.16em] text-muted hover:text-ink">
                  Open →
                </Link>
              </Cell>
            </Row>
          ))}
        </Table>
      </section>

      {can(me, "customers:write") && (
        <section className="mt-8 flex items-center gap-4 border border-line bg-paper p-5">
          <p className="flex-1 text-xs text-muted">
            A disabled account cannot sign in or place orders. Existing orders are untouched.
          </p>
          <StatusToggle id={c._id} status={c.status} scope="customer" />
        </section>
      )}
    </>
  );
}
