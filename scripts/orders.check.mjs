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

const { Product, Order, Coupon } = await import("../lib/models.js");
const { createOrder, restock } = await import("../lib/orders.js");

const SLUG = "zz-check-product";
const buyer = { name: "Check Runner", email: "check@siyana.local", phone: "9999999999" };
const where = { line1: "1 Test Lane", city: "Kochi", state: "Kerala", pincode: "682001" };

const CODE = "ZZCHECK20";

const cleanup = async () => {
  await Product.deleteOne({ slug: SLUG });
  await Order.deleteMany({ "customer.email": buyer.email });
  await Coupon.deleteOne({ code: CODE });
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

  // 7. A coupon is re-priced server-side and its redemption is counted.
  await Coupon.create({
    code: CODE, type: "percent", value: 20, minOrder: 500,
    maxUsesPerCustomer: 1, repeatUse: false, active: true,
  });

  const discounted = await createOrder({
    items: [{ slug: SLUG, size: "M", qty: 1 }],
    customer: buyer, address: where, method: "cod", couponCode: CODE,
  });
  assert.equal(discounted.amounts.subtotal, 1000);
  assert.equal(discounted.amounts.discount, 200, "20% of 1000");
  assert.equal(discounted.amounts.total, 800 + discounted.amounts.shipping);
  assert.equal(discounted.coupon.code, CODE);
  assert.equal((await Coupon.findOne({ code: CODE })).uses, 1, "redemption must be counted");

  // The same customer cannot use a single-use code twice.
  await assert.rejects(
    () => createOrder({
      items: [{ slug: SLUG, size: "M", qty: 1 }],
      customer: buyer, address: where, method: "cod", couponCode: CODE,
    }),
    /already used this code/
  );

  // A code below its minimum order is refused.
  await Coupon.updateOne({ code: CODE }, { minOrder: 99999, repeatUse: true });
  await assert.rejects(
    () => createOrder({
      items: [{ slug: SLUG, size: "M", qty: 1 }],
      customer: buyer, address: where, method: "cod", couponCode: CODE,
    }),
    /Spend ₹99999/
  );

  // An unknown code is refused rather than silently ignored.
  await assert.rejects(
    () => createOrder({
      items: [{ slug: SLUG, size: "M", qty: 1 }],
      customer: buyer, address: where, method: "cod", couponCode: "NOPE",
    }),
    /isn't recognised/
  );

  await restock(discounted);

  // 8. An archived product cannot be bought.
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
