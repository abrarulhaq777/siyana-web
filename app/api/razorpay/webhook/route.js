import { NextResponse } from "next/server";
import db from "@/lib/db";
import { Order } from "@/lib/models";
import { verifyWebhookSignature } from "@/lib/razorpay";

/*
 * Razorpay's own confirmation. This is the source of truth — a shopper whose
 * browser dies after paying still gets their order marked paid here.
 * The raw body must be read as text: the signature covers the exact bytes.
 */
export async function POST(request) {
  const raw = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "bad signature" }, { status: 401 });
  }

  const event = JSON.parse(raw);
  const entity = event.payload?.payment?.entity;
  if (!entity?.order_id) return NextResponse.json({ ok: true });

  await db();
  const order = await Order.findOne({ "payment.razorpayOrderId": entity.order_id });
  if (!order) return NextResponse.json({ ok: true });

  if (event.event === "payment.captured" && order.payment.status !== "paid") {
    const wasCancelled = order.status === "cancelled";
    order.payment.status = "paid";
    order.payment.razorpayPaymentId = entity.id;
    order.payment.paidAt = new Date();
    if (order.status === "pending") order.status = "confirmed";
    order.timeline.push({ label: "Payment captured (webhook)" });
    // Its stock was already released when the shopper closed the payment window.
    if (wasCancelled) order.timeline.push({ label: "Paid after cancellation — check stock and confirm or refund" });
    await order.save();
  }

  // A failed attempt is not the end: Razorpay lets the shopper retry in the same window.
  // The order is only cancelled (and its stock released) when they close the window.
  if (event.event === "payment.failed" && order.payment.status === "pending") {
    order.timeline.push({ label: `Payment attempt failed: ${entity.error_description ?? "declined"}` });
    await order.save();
  }

  return NextResponse.json({ ok: true });
}
