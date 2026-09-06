// node lib/permissions.check.mjs
import assert from "node:assert/strict";
import { can, isStaff, ALL, PRESETS } from "./permissions.js";

const admin = { role: "admin", status: "active", permissions: [] };
const desk = { role: "staff", status: "active", permissions: ["orders:read", "orders:write"] };
const frozen = { role: "staff", status: "disabled", permissions: ALL };
const shopper = { role: "customer", status: "active", permissions: [] };

// An admin holds everything without listing anything.
assert.ok(ALL.every((p) => can(admin, p)));

// Staff hold exactly what was granted — no more.
assert.ok(can(desk, "orders:write"));
assert.ok(!can(desk, "payments:refund"));
assert.ok(!can(desk, "staff:write"));

// A disabled account holds nothing, however many permissions are on the row.
assert.ok(ALL.every((p) => !can(frozen, p)));
assert.ok(!isStaff(frozen));

// Customers never reach the admin, and a permission array on one is ignored.
assert.ok(!isStaff(shopper));
assert.ok(!can({ ...shopper, permissions: ALL }, "orders:read"));
assert.ok(!can(null, "orders:read"));

// Presets only ever name real permissions.
for (const [name, perms] of Object.entries(PRESETS)) {
  assert.ok(perms.every((p) => ALL.includes(p)), `${name} names an unknown permission`);
}
assert.ok(PRESETS["Read only"].every((p) => p.endsWith(":read")));

console.log("permissions ok");
