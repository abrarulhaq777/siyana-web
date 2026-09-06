import { NextResponse } from "next/server";
import db from "@/lib/db";
import { Order } from "@/lib/models";
import { restock } from "@/lib/orders";
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
    order.payment.status = "paid";
    order.payment.razorpayPaymentId = entity.id;
    order.payment.paidAt = new Date();
    if (order.status === "pending") order.status = "confirmed";
    order.timeline.push({ label: "Payment captured (webhook)" });
    await order.save();
  }

  if (event.event === "payment.failed" && order.payment.status === "pending") {
    await restock(order);
    order.payment.status = "failed";
    order.status = "cancelled";
    order.timeline.push({ label: `Payment failed (webhook): ${entity.error_description ?? "declined"}` });
    await order.save();
  }

  return NextResponse.json({ ok: true });
}
