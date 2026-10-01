import assert from "node:assert/strict";
import crypto from "node:crypto";

const { POST: createOrderPOST } = await import("../app/api/create-order/route.js");
const { POST: verifyPaymentPOST } = await import("../app/api/verify-payment/route.js");

console.log("=== Testing Next.js Route Handlers ===");

// Test 1: create-order with amount < 100 paise
console.log("1. Testing create-order with invalid amount (<100)...");
const reqInvalidAmount = new Request("http://localhost:3000/api/create-order", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ amount: 50 }),
});
const resInvalidAmount = await createOrderPOST(reqInvalidAmount);
assert.equal(resInvalidAmount.status, 400, "Should return 400 for amount < 100");
const dataInvalidAmount = await resInvalidAmount.json();
console.log("Invalid amount response:", dataInvalidAmount);
assert(dataInvalidAmount.error.includes("100"), "Error message mentions 100 paise");

// Test 2: create-order with valid amount
console.log("2. Testing create-order with valid amount (50000 paise)...");
const reqValidOrder = new Request("http://localhost:3000/api/create-order", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ amount: 50000, currency: "INR", receipt: "rcpt_test_123" }),
});
const resValidOrder = await createOrderPOST(reqValidOrder);
assert.equal(resValidOrder.status, 200, "Should return 200 for valid order");
const dataValidOrder = await resValidOrder.json();
console.log("Valid order response:", dataValidOrder);
assert(dataValidOrder.order_id && dataValidOrder.order_id.startsWith("order_"), "Valid order_id returned");
assert.equal(dataValidOrder.amount, 50000);
assert.equal(dataValidOrder.currency, "INR");

// Test 3: verify-payment with missing fields
console.log("3. Testing verify-payment with missing fields...");
const reqMissing = new Request("http://localhost:3000/api/verify-payment", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ razorpay_order_id: dataValidOrder.order_id }),
});
const resMissing = await verifyPaymentPOST(reqMissing);
assert.equal(resMissing.status, 400, "Should return 400 for missing fields");
const dataMissing = await resMissing.json();
console.log("Missing fields response:", dataMissing);

// Test 4: verify-payment with signature mismatch
console.log("4. Testing verify-payment with signature mismatch...");
const reqMismatch = new Request("http://localhost:3000/api/verify-payment", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    razorpay_order_id: dataValidOrder.order_id,
    razorpay_payment_id: "pay_test_9999",
    razorpay_signature: "bad_signature_hex_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  }),
});
const resMismatch = await verifyPaymentPOST(reqMismatch);
assert.equal(resMismatch.status, 400, "Should return 400 for signature mismatch");
const dataMismatch = await resMismatch.json();
console.log("Signature mismatch response:", dataMismatch);
assert.equal(dataMismatch.success, false);

// Test 5: verify-payment with authentic signature
console.log("5. Testing verify-payment with valid signature...");
const paymentId = "pay_test_9999";
const validSig = crypto
  .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
  .update(`${dataValidOrder.order_id}|${paymentId}`)
  .digest("hex");

const reqValidSig = new Request("http://localhost:3000/api/verify-payment", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    razorpay_order_id: dataValidOrder.order_id,
    razorpay_payment_id: paymentId,
    razorpay_signature: validSig,
  }),
});
const resValidSig = await verifyPaymentPOST(reqValidSig);
assert.equal(resValidSig.status, 200, "Should return 200 for valid signature");
const dataValidSig = await resValidSig.json();
console.log("Valid signature response:", dataValidSig);
assert.equal(dataValidSig.success, true);

console.log("=== All Next.js Route Handler Tests Passed! ===");
