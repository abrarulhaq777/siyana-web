/* Client-safe catalogue helpers only. Product data now comes from the
 * database via lib/catalog.js (server) or /api/products (client). */

export const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
/** A product's own sizes from its stock, in the usual size order; others (e.g. Free Size) follow. */
export const sizesOf = (product) => {
  const rank = (s) => (sizes.includes(s) ? sizes.indexOf(s) : sizes.length);
  return [...new Set((product?.stock ?? []).map((s) => s.size))].sort((a, b) => rank(a) - rank(b));
};

export const abayaLengths = ["52″ (132 cm)", "54″ (137 cm)", "56″ (142 cm)", "58″ (147 cm)", "60″ (152 cm)"];

export const inr = (n) => "₹" + n.toLocaleString("en-IN");
