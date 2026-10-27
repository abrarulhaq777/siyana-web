/*
 * Checks the Razorpay keys in .env without printing them or creating anything:
 * it only asks Razorpay for one existing order.
 *
 *   npm run razorpay:check
 */
import Razorpay from "razorpay";

const id = process.env.RAZORPAY_KEY_ID?.trim();
const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
const webhook = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();

if (!id || !secret) {
  console.error("✗ RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must both be set in .env");
  process.exit(1);
}

const mode = id.startsWith("rzp_live_") ? "LIVE (real money)" : id.startsWith("rzp_test_") ? "TEST" : "unknown";
console.log(`Key id: ${id.slice(0, 9)}…${id.slice(-4)}  ·  mode: ${mode}`);

try {
  await new Razorpay({ key_id: id, key_secret: secret }).orders.all({ count: 1 });
  console.log("✓ Razorpay accepted the key id and secret");
} catch (e) {
  console.error("✗ Razorpay rejected the keys:", e?.error?.description ?? e.message);
  process.exit(1);
}

console.log(
  webhook
    ? "✓ RAZORPAY_WEBHOOK_SECRET is set"
    : "! RAZORPAY_WEBHOOK_SECRET is not set — payments still work, but add it so orders are marked paid even if the shopper's browser closes"
);
