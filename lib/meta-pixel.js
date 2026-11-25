import { FB_PIXEL_ID, purchaseEventId } from "@/lib/meta-config";

export { FB_PIXEL_ID, purchaseEventId };

/**
 * Fires the standard PageView event.
 */
export const pageview = () => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
};

const newEventId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

/** Hands the event to our server, which sends it to the Conversions API. Survives page navigation. */
function mirror(name, eventId, params) {
  const body = JSON.stringify({ name, eventId, params });
  try {
    if (navigator.sendBeacon?.("/api/signal", new Blob([body], { type: "application/json" }))) return;
  } catch {}
  fetch("/api/signal", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true }).catch(() => {});
}

/**
 * Fires a Meta Pixel event and, unless `server` is false, mirrors it to the
 * Conversions API under the same event id so Meta counts it once.
 * @param {string} name - Event name (e.g. 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase')
 * @param {object} options - Event parameters
 * @param {{ eventId?: string, server?: boolean }} [opts]
 */
export const trackEvent = (name, options = {}, { eventId = newEventId(), server = true } = {}) => {
  if (typeof window === "undefined") return;
  if (typeof window.fbq === "function") {
    window.fbq("track", name, options, { eventID: eventId });
  }
  if (server) mirror(name, eventId, options);
};
