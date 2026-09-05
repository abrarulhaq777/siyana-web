// node lib/cart.check.mjs
import assert from "node:assert/strict";
import { addLine, setLineQty, toggle } from "./cart.js";

let c = addLine([], "noor-open-abaya", "M");
assert.deepEqual(c, [{ slug: "noor-open-abaya", size: "M", qty: 1 }]);

c = addLine(c, "noor-open-abaya", "M");          // same size merges
assert.equal(c.length, 1);
assert.equal(c[0].qty, 2);

c = addLine(c, "noor-open-abaya", "L");          // different size is its own line
assert.equal(c.length, 2);

c = setLineQty(c, "noor-open-abaya", "M", 5);
assert.equal(c.find((l) => l.size === "M").qty, 5);

c = setLineQty(c, "noor-open-abaya", "M", 0);    // zero removes only that line
assert.deepEqual(c.map((l) => l.size), ["L"]);

assert.deepEqual(toggle(["a"], "a"), []);
assert.deepEqual(toggle(["a"], "b"), ["a", "b"]);

console.log("cart ok");
