// Shared by the browser Pixel and the server-side Conversions API.
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "1699538934936201";

// Same id on both sides lets Meta drop the duplicate when Pixel and CAPI report one purchase.
export const purchaseEventId = (orderNo) => `purchase-${orderNo}`;
