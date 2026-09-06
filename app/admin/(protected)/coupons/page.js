import db, { plain } from "@/lib/db";
import { Coupon, Category, Product } from "@/lib/models";
import { requirePageAccess, currentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { inr } from "@/lib/products";
import { Table, Row, Cell } from "../../_components/Table";
import { Badge } from "../../_components/ui";
import CouponForm from "./CouponForm";

const when = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "—");

export default async function Coupons() {
  await requirePageAccess("products:read");
  const user = await currentUser();
  const writable = can(user, "products:write");

  await db();
  const [coupons, categories, products] = await Promise.all([
    Coupon.find().sort({ createdAt: -1 }).lean().then(plain),
    Category.find().sort({ order: 1 }).lean().then(plain),
    Product.find({}, "slug name").sort({ name: 1 }).lean().then(plain),
  ]);

  const now = new Date();
  const state = (c) => {
    if (!c.active) return "disabled";
    if (c.validTo && new Date(c.validTo) < now) return "cancelled";
    if (new Date(c.validFrom) > now) return "pending";
    if (c.maxUses != null && c.uses >= c.maxUses) return "refunded";
    return "active";
  };
  const label = { disabled: "paused", cancelled: "expired", pending: "scheduled", refunded: "used up", active: "live" };

  return (
    <>
      <header>
        <p className="text-[12px] uppercase tracking-brand text-muted">Promotions</p>
        <h1 className="mt-2 font-display text-[2.6rem] font-light leading-none">Coupons</h1>
        <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-muted">
          Every rule below is re-checked on the server when an order is placed, so a code
          edited in the browser cannot change what a shopper is charged.
        </p>
      </header>

      <div className="mt-8">
        <Table
          head={["Code", "Discount", "Applies to", "Minimum", "Window", "Used", "State"]}
          empty="No coupons yet. Create one below."
        >
          {coupons.map((c) => (
            <Row key={c._id}>
              <Cell>
                <span className="block font-mono text-[14px] font-medium text-ink">{c.code}</span>
                {c.description && <span className="block text-[12px] text-muted">{c.description}</span>}
              </Cell>
              <Cell>
                {c.type === "percent" ? `${c.value}%` : inr(c.value)}
                {c.maxDiscount && <span className="block text-[11px] text-muted">max {inr(c.maxDiscount)}</span>}
              </Cell>
              <Cell className="text-[13px] text-muted">
                {c.scope === "all" && "Everything"}
                {c.scope === "collections" && `${c.collections.length} collection(s)`}
                {c.scope === "products" && `${c.products.length} product(s)`}
                {c.firstOrderOnly && <span className="block text-[11px] text-gold-dark">first order only</span>}
              </Cell>
              <Cell className="text-[13px]">{c.minOrder ? inr(c.minOrder) : "—"}</Cell>
              <Cell className="whitespace-nowrap text-[12px] text-muted">
                {when(c.validFrom)} → {when(c.validTo)}
              </Cell>
              <Cell className="text-[13px]">
                {c.uses}
                {c.maxUses != null && <span className="text-muted"> / {c.maxUses}</span>}
                <span className="block text-[11px] text-muted">
                  {c.repeatUse ? "unlimited per customer" : `${c.maxUsesPerCustomer}× per customer`}
                </span>
              </Cell>
              <Cell><Badge tone={state(c)}>{label[state(c)]}</Badge></Cell>
            </Row>
          ))}
        </Table>
      </div>

      {writable && <CouponForm coupons={coupons} categories={categories} products={products} />}
    </>
  );
}
