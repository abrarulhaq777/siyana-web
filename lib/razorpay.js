import "server-only";
import crypto from "node:crypto";
import Razorpay from "razorpay";

const id = process.env.RAZORPAY_KEY_ID;
const secret = process.env.RAZORPAY_KEY_SECRET;

/** Null when keys aren't set — the app then falls back to COD / manual capture. */
export const razorpay = id && secret ? new Razorpay({ key_id: id, key_secret: secret }) : null;
export const razorpayEnabled = () => !!razorpay;

/** Rupees → paise. Razorpay works entirely in the smallest currency unit. */
export const paise = (rupees) => Math.round(rupees * 100);

/** Confirms the client-side handler payload really came from Razorpay. */
export function verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, signature }) {
  if (!secret) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
  return safeEqual(expected, signature);
}

/** Confirms a webhook body against the webhook secret (a different secret). */
export function verifyWebhookSignature(rawBody, signature) {
  const wh = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!wh || !signature) return false;
  const expected = crypto.createHmac("sha256", wh).update(rawBody).digest("hex");
  return safeEqual(expected, signature);
}

function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
