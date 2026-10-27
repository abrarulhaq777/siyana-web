import "server-only";
import db from "./db.js";
import { Order } from "./models.js";
import { getKey } from "./content.js";
import { sendToCustomer, sendToStore } from "./mail.js";
import { emailLayout, heading, para, button, label, esc, rupees, C } from "./email-layout.js";
import { publicAsset } from "./site.js";

const SANS = "Arial,Helvetica,sans-serif";
const METHOD = { online: "Online payment", upi: "UPI", card: "Card", netbanking: "Netbanking", wallet: "Wallet", emi: "EMI", paylater: "Pay later", cod: "Cash on delivery" };
const date = (d) => new Date(d ?? Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
const accountLink = (order) => (order.user ? publicAsset("/account") : publicAsset("/contact"));

/* ───────────────────────────────────────────────────────────── pieces */

function itemsTable(order) {
  const row = (cells, style = "") =>
    `<tr>${cells.map((c, i) => `<td style="padding:10px 0;border-bottom:1px solid ${C.line};font-family:${SANS};font-size:13px;color:${C.ink};${i ? "text-align:right;white-space:nowrap;padding-left:12px;" : ""}${style}">${c}</td>`).join("")}</tr>`;
  const head = `<tr>${["Item", "Qty", "Price", "Amount"].map((h, i) => `<td style="padding:0 0 8px;border-bottom:1px solid ${C.line};font-family:${SANS};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${C.muted};${i ? "text-align:right;padding-left:12px;" : ""}">${h}</td>`).join("")}</tr>`;
  const lines = order.items
    .map((it) =>
      row([
        `${esc(it.name)}<br><span style="font-size:12px;color:${C.muted}">Size ${esc(it.size)}</span>`,
        it.qty,
        rupees(it.price),
        rupees(it.price * it.qty),
      ])
    )
    .join("");
  const total = (k, v, strong) =>
    `<tr><td colspan="3" style="padding:6px 0;font-family:${SANS};font-size:13px;color:${strong ? C.ink : C.muted};text-align:right;${strong ? "font-weight:bold;" : ""}">${k}</td><td style="padding:6px 0 6px 12px;font-family:${SANS};font-size:${strong ? 15 : 13}px;color:${C.ink};text-align:right;white-space:nowrap;${strong ? "font-weight:bold;" : ""}">${v}</td></tr>`;
  const a = order.amounts;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px">
    ${head}${lines}
    ${total("Subtotal", rupees(a.subtotal))}
    ${a.discount ? total("Discount", "− " + rupees(a.discount)) : ""}
    ${total("Shipping", a.shipping ? rupees(a.shipping) : "Complimentary")}
    ${total(order.payment.status === "paid" ? "Total paid" : "Total", rupees(a.total), true)}
  </table>`;
}

function addressBlock(order) {
  const ad = order.address;
  return `${label("Delivering to")}
    <p style="margin:0 0 24px;font-family:${SANS};font-size:13px;line-height:1.7;color:${C.ink}">
      ${esc(order.customer.name)}<br>${esc(ad.line1)}<br>${esc(ad.city)}, ${esc(ad.state)} ${esc(ad.pincode)}<br>${esc(order.customer.phone)}
    </p>`;
}

function invoiceMeta(order) {
  const cell = (k, v) => `<td valign="top" style="padding:0 16px 16px 0">${label(k)}<p style="margin:0;font-family:${SANS};font-size:13px;color:${C.ink}">${v}</p></td>`;
  const pay = order.payment;
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 8px"><tr>
    ${cell("Invoice no.", esc(order.orderNo))}
    ${cell("Date", date(pay.paidAt ?? order.createdAt))}
    ${cell("Payment", `${METHOD[pay.method] ?? esc(pay.method)}${pay.status === "paid" ? " · Paid" : " · Due on delivery"}${pay.razorpayPaymentId ? `<br><span style="font-size:11px;color:${C.muted}">Ref ${esc(pay.razorpayPaymentId)}</span>` : ""}`)}
  </tr></table>`;
}

/* ──────────────────────────────────────────────────────────── invoice */

/**
 * Emails the invoice once per order — to the customer, with a copy to the store as the
 * new-order alert. Payment can be confirmed by the browser and by the webhook, so the
 * order is claimed first and only the call that claims it sends. Never throws.
 */
export async function sendInvoice(orderId) {
  await db();
  const order = await Order.findOneAndUpdate(
    { _id: orderId, "emails.invoiceAt": null },
    { $set: { "emails.invoiceAt": new Date() } },
    { returnDocument: "after" }
  ).lean();
  if (!order) return { sent: false, reason: "already sent" };

  try {
    const settings = await getKey("settings");
    const paid = order.payment.status === "paid";
    const first = order.customer.name.split(" ")[0];
    const body = `
      ${heading(`Thank you, ${first}.`)}
      ${para(paid ? `Your payment of <strong style="color:${C.ink}">${rupees(order.amounts.total)}</strong> has been received and your order is confirmed. Here is your invoice.` : `Your order is confirmed. Please keep <strong style="color:${C.ink}">${rupees(order.amounts.total)}</strong> ready for cash on delivery. Here is your invoice.`)}
      ${invoiceMeta(order)}
      ${itemsTable(order)}
      ${addressBlock(order)}
      ${para("We will email you again when your order is packed and when it ships.")}
      ${order.user ? button(accountLink(order), "View your order") : ""}`;
    const text = `Thank you for your order ${order.orderNo}. Total ${rupees(order.amounts.total)}${paid ? " paid" : " due on delivery"}.\n\n${order.items.map((i) => `${i.name} (Size ${i.size}) × ${i.qty} — ${rupees(i.price * i.qty)}`).join("\n")}\n\nShipping: ${order.amounts.shipping ? rupees(order.amounts.shipping) : "Complimentary"}\nDelivering to: ${order.customer.name}, ${order.address.line1}, ${order.address.city}, ${order.address.state} ${order.address.pincode}`;

    await sendToCustomer({
      to: order.customer.email,
      subject: `Your Siyana order ${order.orderNo} — invoice`,
      html: emailLayout({ preheader: `Invoice for order ${order.orderNo}`, body, settings }),
      text,
    });
    await sendToStore({
      subject: `New order ${order.orderNo} · ${rupees(order.amounts.total)} · ${order.customer.name}`,
      replyTo: order.customer.email,
      html: emailLayout({
        preheader: `New order from ${order.customer.name}`,
        body: `${heading(`New order ${order.orderNo}`)}${para(`${esc(order.customer.name)} · ${esc(order.customer.email)} · ${esc(order.customer.phone)}`)}${invoiceMeta(order)}${itemsTable(order)}${addressBlock(order)}`,
        settings,
      }),
      text,
    });
    await Order.updateOne({ _id: order._id }, { $push: { timeline: { label: "Invoice emailed to customer" } } });
    return { sent: true };
  } catch (e) {
    console.error(`Invoice email for ${order.orderNo} failed:`, e);
    // Release the claim so a later confirmation (webhook, manual) can try again.
    await Order.updateOne(
      { _id: order._id },
      { $unset: { "emails.invoiceAt": 1 }, $push: { timeline: { label: "Invoice email failed", note: e.message } } }
    );
    return { sent: false, reason: e.message };
  }
}

/* ────────────────────────────────────────────────────── status updates */

const STATUS = {
  confirmed: { subject: "is confirmed", title: "Your order is confirmed", body: "We have received your order and are getting it ready." },
  packed: { subject: "is packed", title: "Your order is packed", body: "Your pieces are carefully packed and will be handed to our courier shortly." },
  shipped: { subject: "is on its way", title: "Your order is on its way", body: "Your order has left us and is on its way to you." },
  delivered: { subject: "has been delivered", title: "Your order has been delivered", body: "We hope you love your new pieces. Thank you for choosing Siyana Daily Modesty." },
  cancelled: { subject: "has been cancelled", title: "Your order has been cancelled", body: "Your order has been cancelled. If you have already paid, we will be in touch about your refund." },
};

export const NOTIFY_STATUSES = Object.keys(STATUS);

/** Tells the customer their order moved to `status`; `message` is optional text from the store (e.g. tracking). Throws on failure. */
export async function sendStatusEmail(order, status, message) {
  const copy = STATUS[status];
  if (!copy) return false;
  const settings = await getKey("settings");
  const summary = order.items.map((i) => `${esc(i.name)} · Size ${esc(i.size)} × ${i.qty}`).join("<br>");
  const body = `
    ${label(`Order ${order.orderNo}`)}
    ${heading(copy.title)}
    ${para(copy.body)}
    ${message ? `<div style="margin:0 0 20px;padding:14px 16px;background:${C.bone};border-left:2px solid ${C.gold};font-family:${SANS};font-size:13px;line-height:1.7;color:${C.ink};white-space:pre-wrap">${esc(message)}</div>` : ""}
    ${label("Your order")}
    <p style="margin:0 0 24px;font-family:${SANS};font-size:13px;line-height:1.7;color:${C.ink}">${summary}<br><strong>${rupees(order.amounts.total)}</strong></p>
    ${order.user ? button(accountLink(order), "View your order") : ""}`;
  await sendToCustomer({
    to: order.customer.email,
    subject: `Your Siyana order ${order.orderNo} ${copy.subject}`,
    html: emailLayout({ preheader: copy.title, body, settings }),
    text: `${copy.title} — order ${order.orderNo}.\n\n${copy.body}${message ? `\n\n${message}` : ""}`,
  });
  return true;
}

/** Tells the customer a refund was issued. Throws on failure. */
export async function sendRefundEmail(order, amount) {
  const settings = await getKey("settings");
  const online = order.payment.razorpayPaymentId;
  const body = `
    ${label(`Order ${order.orderNo}`)}
    ${heading(`We have refunded ${rupees(amount)}`)}
    ${para(online ? "The refund has been sent to your original payment method. Banks usually take 5–7 working days to show it in your account." : "Your refund has been processed. We will be in touch if we need any details from you.")}
    ${para("If you have any questions about this refund, just reply to this email.")}`;
  await sendToCustomer({
    to: order.customer.email,
    subject: `Refund of ${rupees(amount)} for your Siyana order ${order.orderNo}`,
    html: emailLayout({ preheader: `Refund of ${rupees(amount)} issued`, body, settings }),
    text: `We have refunded ${rupees(amount)} for order ${order.orderNo}.`,
  });
}
