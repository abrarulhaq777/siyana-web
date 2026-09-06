"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { addLine, setLineQty, toggle } from "./cart.js";

const Store = createContext(null);

/*
 * The browser keeps only slugs, sizes and quantities. Names, prices and
 * availability are re-read from the database on every mount, so a bag left in
 * localStorage for a month can never show a stale price — and the server
 * re-prices everything again when the order is actually placed.
 */
const load = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? [];
  } catch {
    return [];
  }
};

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [catalog, setCatalog] = useState({});
  const [ready, setReady] = useState(false);

  // localStorage only exists after mount, so this read has to be an effect.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setCart(load("siyana:cart"));
    setWishlist(load("siyana:wishlist"));
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("siyana:cart", JSON.stringify(cart));
  }, [cart, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem("siyana:wishlist", JSON.stringify(wishlist));
  }, [wishlist, ready]);

  // Hydrate product details for whatever slugs the browser is holding.
  const wanted = useMemo(
    () => [...new Set([...cart.map((l) => l.slug), ...wishlist])].sort().join(","),
    [cart, wishlist]
  );

  useEffect(() => {
    if (!ready || !wanted) return;
    const ac = new AbortController();
    fetch(`/api/products?slugs=${wanted}`, { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : { products: [] }))
      .then(({ products }) => setCatalog(Object.fromEntries(products.map((p) => [p.slug, p]))))
      .catch(() => {});
    return () => ac.abort();
  }, [wanted, ready]);

  const addToCart = (slug, size, qty = 1) => setCart((c) => addLine(c, slug, size, qty));
  const setQty = (slug, size, qty) => setCart((c) => setLineQty(c, slug, size, qty));
  const toggleWish = (slug) => setWishlist((w) => toggle(w, slug));

  // A line whose product has since been archived simply drops out of the bag.
  const lines = cart.map((l) => ({ ...l, product: catalog[l.slug] })).filter((l) => l.product);
  const saved = wishlist.map((slug) => catalog[slug]).filter(Boolean);
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const count = cart.reduce((s, l) => s + l.qty, 0);

  // `hydrated` is what pages should wait on before deciding a bag is empty.
  const hydrated = ready && (!wanted || Object.keys(catalog).length > 0);

  return (
    <Store.Provider
      value={{
        ready, hydrated, cart, lines, saved, subtotal, count,
        addToCart, setQty, wishlist, toggleWish, clear: () => setCart([]),
      }}
    >
      {children}
    </Store.Provider>
  );
}

export const useStore = () => useContext(Store);
