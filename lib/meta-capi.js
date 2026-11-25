import "server-only";
import { createHash } from "node:crypto";
import { cookies, headers } from "next/headers";
import db from "@/lib/db";
import { Order } from "@/lib/models";
import { FB_PIXEL_ID, purchaseEventId } from "@/lib/meta-config";

/*
 * Meta Conversions API: the server reports the same events as the browser Pixel,
 * so conversions still count when an ad blocker or iOS stops the Pixel. Each event
 * carries the Pixel's event id, and Meta keeps one copy of each pair.
 * Nothing here ever throws — tracking must not break checkout.
 */

const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v27.0";

export const capiEnabled = () => Boolean(process.env.META_CAPI_ACCESS_TOKEN);

const sha256 = (v) => createHash("sha256").update(v).digest("hex");
const lettersOnly = (v) => String(v ?? "").toLowerCase().normalize("NFC").replace(/[^\p{L}\p{N}]/gu, "");

/**
 * What the browser tells us about itself: IP, user agent, the page URL and the
 * Pixel's _fbp/_fbc cookies. Call it while handling the request.
 */
export async function requestContext() {
  const h = await headers();
  const c = await cookies();
  const ip =
    h.get("x-nf-client-connection-ip") || // Netlify
    h.get("x-forwarded-for")?.split(",")[0].trim() ||
    h.get("x-real-ip") ||
    undefined;
  const url = h.get("referer") || undefined;

  // The Pixel writes _fbc when a visitor lands from an ad; rebuild it from ?fbclid= if it hasn't yet.
  let fbc = c.get("_fbc")?.value;
  if (!fbc && url) {
    try {
      const fbclid = new URL(url).searchParams.get("fbclid");
      if (fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
    } catch {}
  }

  return { ip, ua: h.get("user-agent") || undefined, url, fbp: c.get("_fbp")?.value, fbc };
}

/** Customer details, normalised and SHA-256 hashed the way Meta asks. */
function userData({ email, phone, name, city, state, pincode, externalId } = {}, ctx = {}) {
  const ud = {};
  const put = (key, value) => {
    if (value) ud[key] = sha256(value);
  };

  put("em", String(email ?? "").trim().toLowerCase());
  const digits = String(phone ?? "").replace(/\D/g, "");
  put("ph", digits.length === 10 ? `91${digits}` : digits);
  const names = String(name ?? "").trim().split(/\s+/).map(lettersOnly).filter(Boolean);
  put("fn", names[0]);
  if (names.length > 1) put("ln", names.at(-1));
  put("ct", lettersOnly(city));
  put("st", lettersOnly(state));
  put("zp", String(pincode ?? "").replace(/\s/g, ""));
  if (email || phone || city) put("country", "in");
  put("external_id", externalId ? String(externalId) : "");

  if (ctx.ip) ud.client_ip_address = ctx.ip;
  if (ctx.ua) ud.client_user_agent = ctx.ua;
  if (ctx.fbp) ud.fbp = ctx.fbp;
  if (ctx.fbc) ud.fbc = ctx.fbc;
  return ud;
}

/** A signed-in shopper's details, for matching their browsing events to their Meta account. */
export function userFromAccount(user) {
  if (!user) return {};
  const address = user.addresses?.find((a) => a.isDefault) ?? user.addresses?.[0];
  return {
    email: user.email,
    phone: user.phone,
    name: user.name,
    city: address?.city,
    state: address?.state,
    pincode: address?.pincode,
    externalId: user._id,
  };
}

export async function sendEvent({ name, eventId, ctx = {}, user, customData }) {
  if (!capiEnabled()) return;

  const body = {
    data: [
      {
        event_name: name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: ctx.url,
        user_data: userData(user, ctx),
        custom_data: customData,
      },
    ],
    access_token: process.env.META_CAPI_ACCESS_TOKEN,
  };
  if (process.env.META_CAPI_TEST_EVENT_CODE) body.test_event_code = process.env.META_CAPI_TEST_EVENT_CODE;

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${FB_PIXEL_ID}/events`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error(`[meta-capi] ${name} rejected (${res.status}):`, await res.text());
  } catch (e) {
    console.error(`[meta-capi] ${name} not sent:`, e.message);
  }
}

/**
 * Reports an order as a Purchase, at most once, when its online payment is confirmed
 * (browser or webhook, whichever is first). Cash-on-delivery orders are never reported.
 */
export async function sendPurchase(orderId) {
  if (!capiEnabled()) return;
  try {
    await db();
    // Claim the send atomically, and drop the IP and user agent: they're only kept for this.
    const order = await Order.findOneAndUpdate(
      { _id: orderId, "tracking.purchaseSentAt": null },
      { $set: { "tracking.purchaseSentAt": new Date() }, $unset: { "tracking.ip": 1, "tracking.ua": 1 } },
      { returnDocument: "before" } // still holds the IP and user agent
    ).lean();
    if (!order) return;

    await sendEvent({
      name: "Purchase",
      eventId: purchaseEventId(order.orderNo),
      ctx: order.tracking ?? {},
      user: {
        email: order.customer.email,
        phone: order.customer.phone,
        name: order.customer.name,
        city: order.address?.city,
        state: order.address?.state,
        pincode: order.address?.pincode,
        externalId: order.user,
      },
      customData: {
        currency: "INR",
        value: order.amounts.total,
        order_id: order.orderNo,
        content_type: "product",
        content_ids: [...new Set(order.items.map((i) => i.slug))],
        contents: order.items.map((i) => ({ id: i.slug, quantity: i.qty, item_price: i.price })),
        num_items: order.items.reduce((s, i) => s + i.qty, 0),
      },
    });
  } catch (e) {
    console.error("[meta-capi] Purchase not sent:", e.message);
  }
}
