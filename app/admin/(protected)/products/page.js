import Link from "next/link";
import db, { plain } from "@/lib/db";
import { Product, Category } from "@/lib/models";
import { requirePageAccess, currentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { inr } from "@/lib/products";
import { Table, Row, Cell } from "../../_components/Table";
import { Badge } from "../../_components/ui";
import CategoryPanel from "./CategoryPanel";

export default async function Products({ searchParams }) {
  await requirePageAccess("products:read");
  const user = await currentUser();
  const writable = can(user, "products:write");
  const sp = await searchParams;
  const category = sp?.c ?? "";
  const low = sp?.filter === "low";
  const q = (sp?.q ?? "").trim();

  await db();
  const where = {};
  if (category) where.category = category;
  if (low) where["stock.qty"] = { $lte: 2 };
  if (q) where.$or = [{ name: new RegExp(q, "i") }, { slug: new RegExp(q, "i") }];

  const [products, categories] = await Promise.all([
    Product.find(where).sort({ order: 1, createdAt: -1 }).lean().then(plain),
    Category.find().sort({ order: 1 }).lean().then(plain),
  ]);

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] uppercase tracking-brand text-muted">Catalogue</p>
          <h1 className="mt-2 font-display text-[2.4rem] font-light leading-none">Products</h1>
        </div>
        {writable && (
          <Link href="/admin/products/new" className="bg-ink px-5 py-2.5 text-[12px] uppercase tracking-[0.16em] text-bone transition hover:bg-gold-dark">
            New product
          </Link>
        )}
      </header>

      <form className="mt-8 flex flex-wrap items-end gap-3 border border-line bg-paper p-4">
        <input name="q" defaultValue={q} placeholder="Name or slug"
          className="min-w-52 flex-1 border border-line bg-bone px-3 py-2.5 text-sm outline-none focus:border-gold" />
        <select name="c" defaultValue={category} className="border border-line bg-bone px-3 py-2.5 text-sm outline-none focus:border-gold">
          <option value="">All collections</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <label className="flex items-center gap-2 px-2 text-[12px] uppercase tracking-[0.16em] text-muted">
          <input type="checkbox" name="filter" value="low" defaultChecked={low} className="accent-ink" />
          Low stock
        </label>
        <button className="bg-ink px-5 py-2.5 text-[12px] uppercase tracking-[0.16em] text-bone">Filter</button>
      </form>

      <div className="mt-6">
        <Table head={["Product", "Collection", "Price", "Stock", "State", ""]} empty="No products match.">
          {products.map((p) => {
            const units = p.stock.reduce((n, s) => n + s.qty, 0);
            return (
              <Row key={p._id}>
                <Cell>
                  <div className="flex items-center gap-3">
                    {p.image && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={p.image} alt="" className="h-12 w-9 shrink-0 object-cover" />
                    )}
                    <div className="min-w-0">
                      <span className="block truncate text-ink">{p.name}</span>
                      <span className="block truncate text-[13px] text-muted">{p.slug}</span>
                    </div>
                  </div>
                </Cell>
                <Cell className="text-muted">{categories.find((c) => c.slug === p.category)?.name ?? p.category}</Cell>
                <Cell>
                  {inr(p.price)}
                  {p.mrp && <span className="ml-1.5 text-[13px] text-muted line-through">{inr(p.mrp)}</span>}
                </Cell>
                <Cell>
                  <span className={units <= 2 ? "text-amber-700" : "text-ink"}>{units}</span>
                  <span className="ml-1 text-[12px] text-muted">units</span>
                </Cell>
                <Cell><Badge tone={p.active ? "active" : "disabled"}>{p.active ? "live" : "hidden"}</Badge></Cell>
                <Cell className="text-right">
                  <Link href={`/admin/products/${p._id}`} className="text-[12px] uppercase tracking-[0.16em] text-muted hover:text-ink">
                    {writable ? "Edit →" : "View →"}
                  </Link>
                </Cell>
              </Row>
            );
          })}
        </Table>
      </div>

      <CategoryPanel categories={categories} writable={writable} />
    </>
  );
}
