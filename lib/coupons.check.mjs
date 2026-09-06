// node lib/coupons.check.mjs
import assert from "node:assert/strict";
import { discountFor, eligibleLines, staticProblems } from "./coupons.js";

const lines = [
  { slug: "noor-open-abaya", category: "abayas", price: 4000, qty: 1 },
  { slug: "hana-modal-hijab", category: "hijabs", price: 1000, qty: 2 },
];
const base = { active: true, minOrder: 0, uses: 0, maxUses: null, scope: "all", products: [], collections: [] };

// Percentage across the whole bag: 10% of 6000.
assert.equal(discountFor({ ...base, type: "percent", value: 10 }, lines), 600);

// maxDiscount caps it.
assert.equal(discountFor({ ...base, type: "percent", value: 50, maxDiscount: 500 }, lines), 500);

// Fixed amount, and it can never exceed the bag.
assert.equal(discountFor({ ...base, type: "fixed", value: 750 }, lines), 750);
assert.equal(discountFor({ ...base, type: "fixed", value: 99999 }, lines), 6000);

// Scoped to one collection: 10% of the 4000 abaya only.
const abayasOnly = { ...base, type: "percent", value: 10, scope: "collections", collections: ["abayas"] };
assert.equal(eligibleLines(abayasOnly, lines).length, 1);
assert.equal(discountFor(abayasOnly, lines), 400);

// Scoped to one product: 10% of the 2 × 1000 hijabs.
const oneProduct = { ...base, type: "percent", value: 10, scope: "products", products: ["hana-modal-hijab"] };
assert.equal(discountFor(oneProduct, lines), 200);

// Nothing eligible earns nothing, and is reported as such.
const noMatch = { ...base, type: "percent", value: 10, scope: "products", products: ["not-in-bag"] };
assert.equal(discountFor(noMatch, lines), 0);
assert.match(staticProblems(noMatch, lines), /doesn't apply/);

// Minimum order.
assert.match(staticProblems({ ...base, type: "fixed", value: 100, minOrder: 9000 }, lines), /Spend ₹9000/);
assert.equal(staticProblems({ ...base, type: "fixed", value: 100, minOrder: 6000 }, lines), null);

// Validity window.
const day = 864e5;
const now = new Date("2026-06-15");
assert.match(staticProblems({ ...base, type: "fixed", value: 100, validFrom: new Date(+now + day) }, lines, now), /isn't active yet/);
assert.match(staticProblems({ ...base, type: "fixed", value: 100, validTo: new Date(+now - day) }, lines, now), /expired/);
assert.equal(staticProblems({ ...base, type: "fixed", value: 100, validTo: new Date(+now + day) }, lines, now), null);

// Redemption ceiling and the active flag.
assert.match(staticProblems({ ...base, type: "fixed", value: 100, maxUses: 5, uses: 5 }, lines), /fully redeemed/);
assert.match(staticProblems({ ...base, active: false, type: "fixed", value: 100 }, lines), /no longer active/);

// Discounts are whole rupees, never fractions of a paisa.
assert.equal(discountFor({ ...base, type: "percent", value: 7.5 }, lines), 450);
assert.equal(Number.isInteger(discountFor({ ...base, type: "percent", value: 33 }, lines)), true);

console.log("coupons ok");
