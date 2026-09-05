// Pure cart maths — kept out of the React file so it can be checked with plain node.
export const addLine = (cart, slug, size, qty = 1) => {
  const i = cart.findIndex((l) => l.slug === slug && l.size === size);
  return i === -1
    ? [...cart, { slug, size, qty }]
    : cart.map((l, n) => (n === i ? { ...l, qty: l.qty + qty } : l));
};

export const setLineQty = (cart, slug, size, qty) =>
  qty <= 0
    ? cart.filter((l) => !(l.slug === slug && l.size === size))
    : cart.map((l) => (l.slug === slug && l.size === size ? { ...l, qty } : l));

export const toggle = (list, value) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
