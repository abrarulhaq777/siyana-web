import db from "./db.js";
import { Order, Product, mongoose } from "./models.js";
import { getKey } from "./content.js";
import { applyCoupon, recordUse } from "./coupons.js";

/** SY-2026-0001, restarting each calendar year. */
async function nextOrderNo() {
  const year = new Date().getFullYear();
  const last = await Order.findOne({ orderNo: new RegExp(`^SY-${year}-`) }).sort({ orderNo: -1 }).lean();
  const n = last ? Number(last.orderNo.split("-")[2]) + 1 : 1;
  return `SY-${year}-${String(n).padStart(4, "0")}`;
}

/**
 * Builds an order from a browser-supplied bag.
 *
 * Prices, names and stock are all re-read from the database — the client sends
 * slugs, sizes and quantities and nothing else is trusted. Stock is decremented
 * conditionally, so two shoppers racing for the last unit cannot both win.
 */
export async function createOrder({ items, customer, address, method, userId, couponCode }) {
  await db();
  const settings = await getKey("settings");

  if (!Array.isArray(items) || items.length === 0) throw new Error("Your bag is empty.");
  if (items.length > 40) throw new Error("Too many items in one order.");
  if (method === "cod" && !settings.codEnabled) throw new Error("Cash on delivery is unavailable right now.");

  const slugs = [...new Set(items.map((i) => String(i.slug)))];
  const products = await Product.find({ slug: { $in: slugs }, active: true });
  const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));

  const lines = [];
  for (const raw of items) {
    const product = bySlug[raw.slug];
    const size = String(raw.size ?? "");
    const qty = Math.max(1, Math.min(10, Math.floor(Number(raw.qty) || 0)));

    if (!product) throw new Error(`“${raw.slug}” is no longer available.`);
    const baseSize = size.split(" · ")[0].trim();
    const bucket =
      product.stock.find((s) => s.size === size) ||
      product.stock.find((s) => s.size === baseSize);

    if (!bucket) throw new Error(`${product.name} is not offered in size ${size}.`);
    if (bucket.qty < qty) throw new Error(`Only ${bucket.qty} left of ${product.name} in ${size}.`);

    lines.push({
      product: product._id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      category: product.category, // used for collection-scoped coupons
      size,
      stockSize: bucket.size,
      qty,
      price: product.price, // authoritative price, never the client's
    });
  }

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);

  // The coupon is re-validated here against server-side prices. Whatever the
  // browser displayed is irrelevant — this is the discount that gets charged.
  let coupon = null;
  let discount = 0;
  if (couponCode) {
    const result = await applyCoupon(couponCode, lines, { userId, email: customer.email });
    if (!result.ok) throw new Error(result.error);
    coupon = result.coupon;
    discount = result.discount;
  }

  const shipping = subtotal >= settings.freeShippingAbove ? 0 : settings.shippingFee;

  // Claim the stock before writing the order; roll back anything already taken.
  const claimed = [];
  try {
    for (const l of lines) {
      const res = await Product.updateOne(
        { _id: l.product, stock: { $elemMatch: { size: l.stockSize, qty: { $gte: l.qty } } } },
        { $inc: { "stock.$.qty": -l.qty } }
      );
      if (res.modifiedCount !== 1) throw new Error(`${l.name} in size ${l.size} just sold out.`);
      claimed.push(l);
    }

    const order = await Order.create({
      orderNo: await nextOrderNo(),
      user: userId ? new mongoose.Types.ObjectId(userId) : undefined,
      customer,
      items: lines.map(({ category, stockSize, ...l }) => l),
      amounts: {
        subtotal,
        shipping,
        discount,
        total: Math.max(0, subtotal - discount) + shipping,
      },
      address,
      coupon: coupon ? { code: coupon.code, discount } : undefined,
      status: "pending",
      payment: { method, status: "pending" },
      timeline: [{ label: "Order placed", note: coupon ? `Coupon ${coupon.code} · −₹${discount}` : undefined }],
    });

    if (coupon) await recordUse(coupon.code);
    return order;
  } catch (e) {
    for (const l of claimed) {
      await Product.updateOne(
        { _id: l.product, "stock.size": l.stockSize },
        { $inc: { "stock.$.qty": l.qty } }
      );
    }
    throw e;
  }
}

/** Puts stock back when an order is cancelled or fails payment. */
export async function restock(order) {
  for (const l of order.items) {
    const baseSize = String(l.size ?? "").split(" · ")[0].trim();
    const res = await Product.updateOne(
      { _id: l.product, "stock.size": l.size },
      { $inc: { "stock.$.qty": l.qty } }
    );
    if (res.matchedCount === 0 && baseSize !== l.size) {
      await Product.updateOne(
        { _id: l.product, "stock.size": baseSize },
        { $inc: { "stock.$.qty": l.qty } }
      );
    }
  }
}
