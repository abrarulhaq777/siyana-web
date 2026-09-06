import Link from "next/link";
import db, { plain } from "@/lib/db";
import { User, Order, mongoose } from "@/lib/models";
import { requirePageAccess } from "@/lib/auth";
import { inr } from "@/lib/products";
import { Table, Row, Cell } from "../../_components/Table";
import { Badge } from "../../_components/ui";

export default async function Customers({ searchParams }) {
  await requirePageAccess("customers:read");
  const sp = await searchParams;
  const q = (sp?.q ?? "").trim();

  await db();
  const where = { role: "customer" };
  if (q) where.$or = [{ name: new RegExp(q, "i") }, { email: new RegExp(q, "i") }, { phone: new RegExp(q, "i") }];

  const customers = plain(await User.find(where).sort({ createdAt: -1 }).limit(100).lean());

  // One aggregate for all of them instead of a query per row.
  const spend = await Order.aggregate([
    { $match: { user: { $in: customers.map((c) => new mongoose.Types.ObjectId(c._id)) } } },
    { $group: { _id: "$user", orders: { $sum: 1 }, total: { $sum: "$amounts.total" } } },
  ]).catch(() => []);
  const byUser = Object.fromEntries(spend.map((s) => [String(s._id), s]));

  return (
    <>
      <header>
        <p className="text-[12px] uppercase tracking-brand text-muted">People</p>
        <h1 className="mt-2 font-display text-[2.4rem] font-light leading-none">Customers</h1>
      </header>

      <form className="mt-8 flex gap-3 border border-line bg-paper p-4">
        <input name="q" defaultValue={q} placeholder="Name, email or phone"
          className="flex-1 border border-line bg-bone px-3 py-2.5 text-sm outline-none focus:border-gold" />
        <button className="bg-ink px-5 py-2.5 text-[12px] uppercase tracking-[0.16em] text-bone">Search</button>
      </form>

      <div className="mt-6">
        <Table head={["Name", "Contact", "Joined", "Orders", "Spend", "State", ""]} empty="No customers yet.">
          {customers.map((c) => {
            const s = byUser[c._id];
            return (
              <Row key={c._id}>
                <Cell className="text-ink">{c.name}</Cell>
                <Cell>
                  <span className="block text-xs text-muted">{c.email}</span>
                  {c.phone && <span className="block text-xs text-muted">{c.phone}</span>}
                </Cell>
                <Cell className="whitespace-nowrap text-xs text-muted">
                  {new Date(c.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                </Cell>
                <Cell>{s?.orders ?? 0}</Cell>
                <Cell>{inr(s?.total ?? 0)}</Cell>
                <Cell><Badge tone={c.status}>{c.status}</Badge></Cell>
                <Cell className="text-right">
                  <Link href={`/admin/customers/${c._id}`} className="text-[12px] uppercase tracking-[0.16em] text-muted hover:text-ink">
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
