"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { bySlug } from "./products";
import { addLine, setLineQty, toggle } from "./cart";

const Store = createContext(null);

// ponytail: localStorage + one context. Swap for a real cart API when checkout is live.
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

  const addToCart = (slug, size, qty = 1) => setCart((c) => addLine(c, slug, size, qty));
  const setQty = (slug, size, qty) => setCart((c) => setLineQty(c, slug, size, qty));
  const toggleWish = (slug) => setWishlist((w) => toggle(w, slug));

  const lines = cart.map((l) => ({ ...l, product: bySlug(l.slug) })).filter((l) => l.product);
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const count = cart.reduce((s, l) => s + l.qty, 0);

  return (
    <Store.Provider
      value={{ ready, cart, lines, subtotal, count, addToCart, setQty, wishlist, toggleWish, clear: () => setCart([]) }}
    >
      {children}
    </Store.Provider>
  );
}

export const useStore = () => useContext(Store);
