"use server";

import db from "@/lib/db";
import { Order } from "@/lib/models";
import { currentUser } from "@/lib/auth";
import { createOrder, restock } from "@/lib/orders";
import { razorpay, razorpayEnabled, paise, verifyPaymentSignature } from "@/lib/razorpay";

const fail = (error) => ({ ok: false, error });

/**
 * Step one of checkout. Creates the order from server-side prices and, when
 * Razorpay is configured for a prepaid method, an accompanying gateway order.
 */
export async function placeOrder(payload) {
  const user = await currentUser();

  const customer = {
    name: String(payload.name ?? "").trim(),
    email: String(payload.email ?? "").trim().toLowerCase(),
    phone: String(payload.phone ?? "").trim(),
  };
  const address = {
    line1: String(payload.address ?? "").trim(),
    city: String(payload.city ?? "").trim(),
    state: String(payload.state ?? "").trim(),
    pincode: String(payload.pincode ?? "").trim(),
  };
  const method = ["upi", "card", "netbanking", "cod"].includes(payload.method) ? payload.method : "cod";

  if (!customer.name || !/^\S+@\S+\.\S+$/.test(customer.email)) return fail("Enter a valid name and email.");
  if (!/^\d{10}$/.test(customer.phone)) return fail("Enter a 10-digit phone number.");
  if (!/^\d{6}$/.test(address.pincode)) return fail("Enter a 6-digit pincode.");
  if (!address.line1 || !address.city || !address.state) return fail("Complete the delivery address.");

  let order;
  try {
    order = await createOrder({ items: payload.items, customer, address, method, userId: user?._id });
  } catch (e) {
    return fail(e.message);
  }

  // Cash on delivery, or no gateway configured: nothing more to collect now.
  if (method === "cod" || !razorpayEnabled()) {
    return { ok: true, mode: "placed", orderNo: order.orderNo, orderId: String(order._id) };
  }

  try {
    const rp = await razorpay.orders.create({
      amount: paise(order.amounts.total),
      currency: "INR",
      receipt: order.orderNo,
      notes: { orderId: String(order._id) },
    });
    order.payment.razorpayOrderId = rp.id;
    await order.save();

    return {
      ok: true,
      mode: "pay",
      orderNo: order.orderNo,
      orderId: String(order._id),
      razorpayOrderId: rp.id,
      amount: rp.amount,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      prefill: { name: customer.name, email: customer.email, contact: customer.phone },
    };
  } catch (e) {
    await restock(order);
    await Order.deleteOne({ _id: order._id });
    return fail(`Could not reach the payment gateway: ${e?.error?.description ?? e.message}`);
  }
}

/**
 * Step two. The browser hands back what Razorpay gave it; the signature proves
 * it really came from Razorpay and was not forged by the page.
 */
export async function confirmPayment({ orderId, razorpayOrderId, razorpayPaymentId, signature }) {
  if (!verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, signature }))
    return fail("Payment could not be verified. If you were charged, contact support with your order number.");

  await db();
  const order = await Order.findOne({ _id: orderId, "payment.razorpayOrderId": razorpayOrderId });
  if (!order) return fail("Order not found.");

  if (order.payment.status !== "paid") {
    order.payment.status = "paid";
    order.payment.razorpayPaymentId = razorpayPaymentId;
    order.payment.paidAt = new Date();
    order.status = "confirmed";
    order.timeline.push({ label: "Payment received" });
    await order.save();
  }
  return { ok: true, orderNo: order.orderNo };
}

/** Shopper closed the Razorpay modal — release the stock we had claimed. */
export async function abandonOrder(orderId) {
  await db();
  const order = await Order.findById(orderId);
  if (!order || order.payment.status === "paid") return { ok: true };

  await restock(order);
  order.status = "cancelled";
  order.payment.status = "failed";
  order.timeline.push({ label: "Payment abandoned" });
  await order.save();
  return { ok: true };
}
