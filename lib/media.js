import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";

/*
 * Admin uploads land in public/uploads on whichever machine ran the upload, and that
 * folder is git-ignored — so a fresh clone or a deploy has database rows pointing at
 * files that are not there. Everything else under /public ships with the repo.
 */
export function hasImage(src) {
  if (!src) return false;
  if (!src.startsWith("/uploads/")) return true;
  return existsSync(path.join(process.cwd(), "public", src));
}

/** Studio photography that ships in /public/images, in the order it is handed out. */
export const STUDIO = {
  coords: "/images/categories/coords.jpg",
  dresses: "/images/categories/dresses.jpg",
  linen: "/images/products/layl-linen-abaya.jpg",
  pleat: "/images/products/rahma-pleat-dress.jpg",
  abayas: "/images/categories/abayas.jpg",
  kaftans: "/images/categories/kaftans.jpg",
  courtyard: "/images/hero/hero-siyana.jpg",
  prayerwear: "/images/categories/prayerwear.jpg",
  hijabs: "/images/categories/hijabs.jpg",
};

const HINTS = [
  [/abaya/, "abayas"],
  [/hijab|shawl|scarf|stole/, "hijabs"],
  [/kaftan|occasion/, "kaftans"],
  [/prayer|salah|namaz/, "prayerwear"],
  [/co-?ord|romper|set/, "coords"],
  [/dress|maxi|skirt/, "dresses"],
];

/**
 * Gives every category an image that exists. A missing upload is replaced by the
 * closest studio photo by slug, and no two categories share one while any is unused.
 */
export function withCategoryImages(categories) {
  const used = new Set();
  const pool = Object.keys(STUDIO);

  return categories.map((cat) => {
    if (hasImage(cat.image)) return cat;
    const hint = HINTS.find(([re]) => re.test(`${cat.slug} ${cat.name}`))?.[1];
    const key = hint && !used.has(hint) ? hint : pool.find((k) => !used.has(k)) ?? pool[0];
    used.add(key);
    return { ...cat, image: STUDIO[key] };
  });
}

/** Drops product images that are not on disk, so the card shows its tonal fallback. */
export function withProductImages(product) {
  if (hasImage(product.image)) return product;
  const images = (product.images ?? []).filter(hasImage);
  return { ...product, image: images[0] ?? null, images };
}
