import assert from "node:assert/strict";
import crypto from "node:crypto";
import Razorpay from "razorpay";

const KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_TfmZSvqS1bHPic";
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "sx9bMaQLi3UIucktrzgJDZyV";

console.log("=== Testing Razorpay Integration Backend Logic ===");

// 1. Test Razorpay instance creation
const rzp = new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET });
assert(rzp, "Razorpay instance should be initialized");

// 2. Test create order API call to Razorpay
console.log("1. Creating order with Razorpay API...");
try {
  const order = await rzp.orders.create({
    amount: 50000, // 500 INR in paise
    currency: "INR",
    receipt: `test_rcpt_${Date.now()}`,
    notes: { test: "true" },
  });

  console.log("Order created successfully:", {
    order_id: order.id,
    amount: order.amount,
    currency: order.currency,
  });

  assert(order.id && order.id.startsWith("order_"), "Valid order_id returned");
  assert.equal(order.amount, 50000, "Amount matches");
  assert.equal(order.currency, "INR", "Currency matches");

  // 3. Test Signature Verification Logic
  console.log("2. Testing signature verification...");
  const fakePaymentId = `pay_${Date.now()}`;

  // Valid signature
  const validSignature = crypto
    .createHmac("sha256", KEY_SECRET)
    .update(`${order.id}|${fakePaymentId}`)
    .digest("hex");

  function verify(orderId, paymentId, sig) {
    const expected = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");
    return (
      expected.length === sig.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
    );
  }

  assert.equal(
    verify(order.id, fakePaymentId, validSignature),
    true,
    "Valid signature must match"
  );

  const fakeSignature = "invalid_signature_hex_1234567890abcdef";
  assert.equal(
    verify(order.id, fakePaymentId, fakeSignature),
    false,
    "Invalid signature must fail"
  );

  console.log("Signature verification logic passed!");
  console.log("=== All Razorpay Integration Tests Passed! ===");
} catch (error) {
  console.error("Razorpay test failed:", error);
  process.exit(1);
}
