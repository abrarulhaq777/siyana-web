import db, { plain } from "./db.js";
import { Product, Category } from "./models.js";

/* Server-side catalogue reads. Everything returns plain objects, ready for RSC. */

const LIST_FIELDS =
  "slug name category price mrp color colorName fabric tag image opacity wuduFriendly stock active";

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
export const stockFor = (product, size) =>
  (product?.stock ?? []).reduce((n, s) => n + (!size || s.size === size ? s.qty : 0), 0);
