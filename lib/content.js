import db, { plain } from "./db.js";
import { Content } from "./models.js";
import { DEFAULTS } from "./content-defaults.js";

export * from "./content-defaults.js";

/** Every CMS key, merged over defaults. One round trip for the whole page. */
export async function getContent() {
  await db();
  const rows = await Content.find().lean();
  const saved = Object.fromEntries(rows.map((r) => [r.key, r.data]));

  return Object.fromEntries(
    Object.keys(DEFAULTS).map((key) => [key, { ...DEFAULTS[key], ...plain(saved[key] ?? {}) }])
  );
}

export async function getKey(key) {
  await db();
  const row = await Content.findOne({ key }).lean();
  return { ...DEFAULTS[key], ...plain(row?.data ?? {}) };
}

export async function setKey(key, data, userId) {
  await db();
  await Content.findOneAndUpdate(
    { key },
    { key, data, updatedBy: userId },
    { upsert: true, new: true }
  );
}
