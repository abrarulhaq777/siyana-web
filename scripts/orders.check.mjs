/*
 * node --env-file=.env.local scripts/orders.check.mjs
 *
 * Exercises the money path against a real database on a throwaway product:
 * server-side pricing, stock claiming, oversell refusal and rollback.
 */
import assert from "node:assert/strict";
import mongoose from "mongoose";

process.env.MONGODB_URI ??= "mongodb://127.0.0.1:27017/siyana";
await mongoose.connect(process.env.MONGODB_URI);

const { Product, Order } = await import("../lib/models.js");
const { createOrder, restock } = await import("../lib/orders.js");

const SLUG = "zz-check-product";
const buyer = { name: "Check Runner", email: "check@siyana.local", phone: "9999999999" };
const where = { line1: "1 Test Lane", city: "Kochi", state: "Kerala", pincode: "682001" };

const cleanup = async () => {
  await Product.deleteOne({ slug: SLUG });
  await Order.deleteMany({ "customer.email": buyer.email });
};

await cleanup();
const product = await Product.create({
  slug: SLUG, name: "Check Product", category: "abayas", price: 1000, active: true,
  stock: [{ size: "M", qty: 3 }, { size: "L", qty: 0 }],
});

try {
  // 1. Price comes from the database, never from the browser.
  const order = await createOrder({
    items: [{ slug: SLUG, size: "M", qty: 2, price: 1 }], // client claims ₹1
    customer: buyer, address: where, method: "cod",
  });
  assert.equal(order.items[0].price, 1000, "server must re-price the line");
  assert.equal(order.amounts.subtotal, 2000);
  assert.equal(order.amounts.total, 2000 + order.amounts.shipping);
  assert.match(order.orderNo, /^SY-\d{4}-\d{4}$/);

  // 2. Stock was claimed.
  let fresh = await Product.findOne({ slug: SLUG });
  assert.equal(fresh.stock.find((s) => s.size === "M").qty, 1, "stock must decrement");

  // 3. Overselling is refused and leaves stock untouched.
  await assert.rejects(
    () => createOrder({ items: [{ slug: SLUG, size: "M", qty: 5 }], customer: buyer, address: where, method: "cod" }),
    /Only 1 left/
  );
  fresh = await Product.findOne({ slug: SLUG });
  assert.equal(fresh.stock.find((s) => s.size === "M").qty, 1, "a refused order must not consume stock");

  // 4. A size with no stock cannot be ordered at all.
  await assert.rejects(
    () => createOrder({ items: [{ slug: SLUG, size: "L", qty: 1 }], customer: buyer, address: where, method: "cod" }),
    /Only 0 left/
  );

  // 5. A multi-line order that fails partway rolls the earlier claim back.
  await assert.rejects(
    () => createOrder({
      items: [{ slug: SLUG, size: "M", qty: 1 }, { slug: SLUG, size: "L", qty: 1 }],
      customer: buyer, address: where, method: "cod",
    })
  );
  fresh = await Product.findOne({ slug: SLUG });
  assert.equal(fresh.stock.find((s) => s.size === "M").qty, 1, "partial failure must roll back");

  // 6. Cancelling puts the units back.
  await restock(order);
  fresh = await Product.findOne({ slug: SLUG });
  assert.equal(fresh.stock.find((s) => s.size === "M").qty, 3, "restock must return the units");

  // 7. An archived product cannot be bought.
  await Product.updateOne({ slug: SLUG }, { active: false });
  await assert.rejects(
    () => createOrder({ items: [{ slug: SLUG, size: "M", qty: 1 }], customer: buyer, address: where, method: "cod" }),
    /no longer available/
  );

  console.log("orders ok");
} finally {
  await cleanup();
  await mongoose.disconnect();
}
