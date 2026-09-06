import db from "./db.js";
import { Coupon, Order } from "./models.js";

/*
 * Coupon rules, split into a pure part and a database part so the arithmetic
 * can be checked without a server. `discountFor` decides how much comes off;
 * `applyCoupon` is what checkout and the admin both call.
 */

/** Lines the coupon is allowed to touch, given its scope. */
export function eligibleLines(coupon, lines) {
  if (coupon.scope === "products") return lines.filter((l) => coupon.products.includes(l.slug));
  if (coupon.scope === "collections") return lines.filter((l) => coupon.collections.includes(l.category));
  return lines;
}

/**
 * Discount in rupees, rounded down to the whole rupee.
 * A percentage applies only to eligible lines and honours maxDiscount;
 * a fixed amount can never exceed the eligible subtotal.
 */
export function discountFor(coupon, lines) {
  const eligible = eligibleLines(coupon, lines);
  const base = eligible.reduce((s, l) => s + l.price * l.qty, 0);
  if (base <= 0) return 0;

  let off = coupon.type === "percent" ? (base * coupon.value) / 100 : coupon.value;
  if (coupon.type === "percent" && coupon.maxDiscount) off = Math.min(off, coupon.maxDiscount);
  return Math.max(0, Math.floor(Math.min(off, base)));
}

/** Reasons a coupon cannot be used right now, ignoring per-customer history. */
export function staticProblems(coupon, lines, now = new Date()) {
  if (!coupon.active) return "This code is no longer active.";
  if (coupon.validFrom && now < new Date(coupon.validFrom)) return "This code isn't active yet.";
  if (coupon.validTo && now > new Date(coupon.validTo)) return "This code has expired.";
  if (coupon.maxUses != null && coupon.uses >= coupon.maxUses) return "This code has been fully redeemed.";

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  if (subtotal < coupon.minOrder) return `Spend ₹${coupon.minOrder} to use this code.`;
  if (eligibleLines(coupon, lines).length === 0) return "This code doesn't apply to anything in your bag.";
  if (discountFor(coupon, lines) <= 0) return "This code doesn't reduce your total.";
  return null;
}

/**
 * Full check, including how often this customer has used the code before.
 * Returns { ok, discount, coupon } or { ok: false, error }.
 */
export async function applyCoupon(code, lines, { userId, email } = {}) {
  await db();
  const coupon = await Coupon.findOne({ code: String(code ?? "").trim().toUpperCase() }).lean();
  if (!coupon) return { ok: false, error: "That code isn't recognised." };

  const problem = staticProblems(coupon, lines);
  if (problem) return { ok: false, error: problem };

  // Guests are matched on email, since they have no account to count against.
  const who = userId ? { user: userId } : email ? { "customer.email": email } : null;

  if (who) {
    if (coupon.firstOrderOnly && (await Order.countDocuments(who)) > 0) {
      return { ok: false, error: "This code is for first orders only." };
    }
    if (!coupon.repeatUse && coupon.maxUsesPerCustomer != null) {
      const mine = await Order.countDocuments({ ...who, "coupon.code": coupon.code });
      if (mine >= coupon.maxUsesPerCustomer) {
        return { ok: false, error: "You've already used this code." };
      }
    }
  }

  return { ok: true, coupon, discount: discountFor(coupon, lines) };
}

/** Counts a redemption once the order exists. */
export const recordUse = (code) => Coupon.updateOne({ code }, { $inc: { uses: 1 } });
