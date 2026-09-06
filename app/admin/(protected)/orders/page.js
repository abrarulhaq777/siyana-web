import Link from "next/link";
import db, { plain } from "@/lib/db";
import { Order, ORDER_STATUSES } from "@/lib/models";
import { requirePageAccess } from "@/lib/auth";
import { inr } from "@/lib/products";
import { Table, Row, Cell } from "../../_components/Table";
import { Badge } from "../../_components/ui";

const PER_PAGE = 25;

export default async function Orders({ searchParams }) {
  await requirePageAccess("orders:read");
  const sp = await searchParams;
  const status = sp?.status ?? "";
  const q = (sp?.q ?? "").trim();
  const page = Math.max(1, Number(sp?.page ?? 1));

  await db();
  const where = {};
  if (ORDER_STATUSES.includes(status)) where.status = status;
  if (q) {
    where.$or = [
      { orderNo: new RegExp(q, "i") },
      { "customer.name": new RegExp(q, "i") },
      { "customer.email": new RegExp(q, "i") },
      { "customer.phone": new RegExp(q, "i") },
    ];
  }

  const [orders, total] = await Promise.all([
    Order.find(where).sort({ createdAt: -1 }).skip((page - 1) * PER_PAGE).limit(PER_PAGE).lean().then(plain),
    Order.countDocuments(where),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-brand text-muted">Fulfilment</p>
          <h1 className="mt-2 font-display text-[2.4rem] font-light leading-none">Orders</h1>
        </div>
        <p className="text-[10px] uppercase tracking-[0.16em] text-muted">{total} total</p>
      </header>

      <form className="mt-8 flex flex-wrap items-end gap-3 border border-line bg-paper p-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Order no, name, email or phone"
          className="min-w-56 flex-1 border border-line bg-bone px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
        <select name="status" defaultValue={status} className="border border-line bg-bone px-3 py-2.5 text-sm outline-none focus:border-gold">
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="bg-ink px-5 py-2.5 text-[10px] uppercase tracking-[0.16em] text-bone">Filter</button>
        {(q || status) && (
          <Link href="/admin/orders" className="px-3 py-2.5 text-[10px] uppercase tracking-[0.16em] text-muted hover:text-ink">
            Clear
          </Link>
        )}
      </form>

      <div className="mt-6">
        <Table head={["Order", "Placed", "Customer", "Items", "Total", "Payment", "Status", ""]} empty="No orders match.">
          {orders.map((o) => (
            <Row key={o._id}>
              <Cell className="font-medium">{o.orderNo}</Cell>
              <Cell className="whitespace-nowrap text-xs text-muted">
                {new Date(o.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
              </Cell>
              <Cell>
                <span className="block text-ink">{o.customer.name}</span>
                <span className="block text-[11px] text-muted">{o.customer.phone}</span>
              </Cell>
              <Cell className="text-muted">{o.items.reduce((n, i) => n + i.qty, 0)}</Cell>
              <Cell>{inr(o.amounts.total)}</Cell>
              <Cell>
                <Badge tone={o.payment.status}>{o.payment.status}</Badge>
                <span className="mt-1 block text-[9.5px] uppercase tracking-[0.14em] text-muted">{o.payment.method}</span>
              </Cell>
              <Cell><Badge tone={o.status}>{o.status}</Badge></Cell>
              <Cell className="text-right">
                <Link href={`/admin/orders/${o._id}`} className="text-[10px] uppercase tracking-[0.16em] text-muted hover:text-ink">
                  Open →
                </Link>
              </Cell>
            </Row>
          ))}
        </Table>
      </div>

      {pages > 1 && (
        <nav className="mt-6 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-muted">
          <PageLink sp={sp} page={page - 1} disabled={page === 1}>← Previous</PageLink>
          <span>Page {page} of {pages}</span>
          <PageLink sp={sp} page={page + 1} disabled={page === pages}>Next →</PageLink>
        </nav>
      )}
    </>
  );
}

function PageLink({ sp, page, disabled, children }) {
  if (disabled) return <span className="opacity-30">{children}</span>;
  const params = new URLSearchParams({ ...sp, page: String(page) });
  return <Link href={`/admin/orders?${params}`} className="hover:text-ink">{children}</Link>;
}
