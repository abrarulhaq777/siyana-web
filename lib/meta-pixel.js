export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "1699538934936201";

/**
 * Fires the standard PageView event.
 */
export const pageview = () => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
};

/**
 * Fires custom or standard Meta Pixel events.
 * @param {string} name - Event name (e.g. 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase')
 * @param {object} options - Event parameters
 */
export const trackEvent = (name, options = {}) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", name, options);
  }
};
