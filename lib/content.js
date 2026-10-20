import db, { plain } from "./db.js";
import { Content } from "./models.js";
import { DEFAULTS, SECTION_LABELS, SECTION_ALIASES } from "./content-defaults.js";

export * from "./content-defaults.js";

/*
 * A saved order lags the code: sections added in a deploy are missing from it and
 * retired ids would never render. Retired ids follow SECTION_ALIASES, missing default
 * sections slot in after their default neighbour, and any other known section is
 * appended hidden so the editor can still switch it on.
 */
function normaliseSections({ order = [], hidden = [] }) {
  const rename = (id) => SECTION_ALIASES[id] ?? id;
  const out = [...new Set(order.map(rename))].filter((id) => id in SECTION_LABELS);
  const hide = new Set(hidden.map(rename));

  const defaults = DEFAULTS.sections.order;
  defaults.forEach((id, i) => {
    if (out.includes(id)) return;
    const prev = defaults.slice(0, i).findLast((p) => out.includes(p));
    out.splice(prev ? out.indexOf(prev) + 1 : 0, 0, id);
  });

  for (const id of Object.keys(SECTION_LABELS)) {
    if (!out.includes(id)) {
      out.push(id);
      hide.add(id);
    }
  }
  return { order: out, hidden: [...hide] };
}

/** Every CMS key, merged over defaults. One round trip for the whole page. */
export async function getContent() {
  await db();
  const rows = await Content.find().lean();
  const saved = Object.fromEntries(rows.map((r) => [r.key, r.data]));

  const content = Object.fromEntries(
    Object.keys(DEFAULTS).map((key) => [key, { ...DEFAULTS[key], ...plain(saved[key] ?? {}) }])
  );
  content.sections = normaliseSections(content.sections);
  return content;
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
