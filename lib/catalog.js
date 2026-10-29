import db, { plain } from "./db.js";
import { Product, Category } from "./models.js";

/* Server-side catalogue reads. Everything returns plain objects, ready for RSC. */

const LIST_FIELDS =
  "slug name category price mrp color colorName fabric tag image images wuduFriendly stock active rating reviewCount createdAt";

export async function getCategories({ includeInactive = false } = {}) {
  await db();
  const where = includeInactive ? {} : { active: true };
  return plain(await Category.find(where).sort({ order: 1, name: 1 }).lean());
}

export async function getProducts({ category, includeInactive = false, slugs, limit } = {}) {
  await db();
  const where = {};
  if (!includeInactive) where.active = true;
  if (category && category !== "all") where.category = category;
  if (slugs?.length) where.slug = { $in: slugs };

  let q = Product.find(where, includeInactive ? undefined : LIST_FIELDS).sort({ order: 1, createdAt: -1 });
  if (limit) q = q.limit(limit);
  return plain(await q.lean());
}

/**
 * Recently added active products, mixed across categories: the newest piece from each
 * category first (categories ordered by their latest arrival), then each one's second
 * newest, and so on. A batch upload into one category can't fill the whole row, and a
 * new arrival still moves its category to the front.
 */
export async function getRecentProducts({ limit = 8, fallbackSlugs = [] } = {}) {
  await db();
  const recent = await Product.find({ active: true }, LIST_FIELDS)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit * 12)
    .lean();

  if (recent.length > 0) {
    return plain(byCategoryInTurn(recent).slice(0, limit));
  }
  if (fallbackSlugs.length > 0) {
    return getProductsBySlugs(fallbackSlugs);
  }
  return [];
}

/** Interleaves newest-first products so each category takes a turn, newest category first. */
function byCategoryInTurn(products) {
  const groups = new Map(); // insertion order follows each category's newest piece
  for (const p of products) {
    if (!groups.has(p.category)) groups.set(p.category, []);
    groups.get(p.category).push(p);
  }
  const queues = [...groups.values()];
  const longest = Math.max(...queues.map((q) => q.length));
  const out = [];
  for (let turn = 0; turn < longest; turn++) {
    for (const q of queues) if (q[turn]) out.push(q[turn]);
  }
  return out;
}

export async function getProduct(slug) {
  await db();
  return plain(await Product.findOne({ slug }).lean());
}

/** Fetch by slug list and return them in the order the caller asked for. */
export async function getProductsBySlugs(slugs = []) {
  if (!slugs.length) return [];
  const found = await getProducts({ slugs });
  const bySlug = Object.fromEntries(found.map((p) => [p.slug, p]));
  return slugs.map((s) => bySlug[s]).filter(Boolean);
}

/** Total sellable units for a product, or for one size. */
export const stockFor = (product, size) => {
  const baseSize = size ? String(size).split(" · ")[0].trim() : "";
  return (product?.stock ?? []).reduce(
    (n, s) =>
      n + (!size || s.size === size || (baseSize && s.size === baseSize) ? s.qty : 0),
    0
  );
};
