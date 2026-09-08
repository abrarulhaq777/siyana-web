/*
 * Idempotent seed: upserts the catalogue, CMS defaults and the owner account.
 * Safe to re-run — it never overwrites content an editor has already changed.
 *
 *   node --env-file=.env.local scripts/seed.mjs
 */
import fs from "node:fs";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { categories, products } from "../lib/seed-data.js";
import { DEFAULTS } from "../lib/content-defaults.js";

if (fs.existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
} else if (fs.existsSync(".env")) {
  process.loadEnvFile(".env");
}

const URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/siyana";
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

await mongoose.connect(URI);
const { Category, Product, Content, User, Coupon } = await import("../lib/models.js");

let made = { categories: 0, products: 0, content: 0, coupons: 0 };

for (const [i, c] of categories.entries()) {
  const r = await Category.updateOne(
    { slug: c.slug },
    { $set: { ...c, order: i }, $setOnInsert: { active: true } },
    { upsert: true }
  );
  made.categories += r.upsertedCount;
}

for (const [i, p] of products.entries()) {
  const { count, ...rest } = p;
  const r = await Product.updateOne(
    { slug: p.slug },
    {
      $set: { ...rest, order: i },
      $setOnInsert: {
        active: true,
        stock: SIZES.map((size) => ({ size, qty: 12 })),
      },
    },
    { upsert: true }
  );
  made.products += r.upsertedCount;
}

// Only insert CMS defaults that don't exist yet — never clobber edited copy.
for (const [key, data] of Object.entries(DEFAULTS)) {
  const r = await Content.updateOne({ key }, { $setOnInsert: { key, data } }, { upsert: true });
  made.content += r.upsertedCount;
}

const defaultCoupons = [
  {
    code: "WELCOME10",
    description: "10% off your entire first order",
    type: "percent",
    value: 10,
    maxDiscount: 1000,
    minOrder: 1500,
    scope: "all",
    firstOrderOnly: true,
    active: true,
  },
  {
    code: "SIYANA500",
    description: "₹500 off on orders above ₹3,000",
    type: "fixed",
    value: 500,
    minOrder: 3000,
    scope: "all",
    active: true,
  },
];

for (const coup of defaultCoupons) {
  const r = await Coupon.updateOne(
    { code: coup.code },
    { $setOnInsert: coup },
    { upsert: true }
  );
  made.coupons += r.upsertedCount;
}

const email = (process.env.SEED_ADMIN_EMAIL || "admin@siyana.local").toLowerCase();
const password = process.env.SEED_ADMIN_PASSWORD || "ChangeMe!2026";
const existing = await User.findOne({ email });

if (!existing) {
  await User.create({
    name: "Store Owner",
    email,
    passwordHash: await bcrypt.hash(password, 12),
    role: "admin",
  });
  console.log(`\n  Admin created → ${email} / ${password}`);
  console.log("  Change this password after the first sign-in.\n");
} else {
  console.log(`\n  Admin already present → ${email}\n`);
}

console.log(
  `  categories: ${await Category.countDocuments()} (+${made.categories} new)\n` +
  `  products:   ${await Product.countDocuments()} (+${made.products} new)\n` +
  `  content:    ${await Content.countDocuments()} (+${made.content} new)\n` +
  `  coupons:    ${await Coupon.countDocuments()} (+${made.coupons} new)\n`
);

await mongoose.disconnect();
