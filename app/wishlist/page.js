"use client";

import ProductCard from "@/components/ProductCard";
import Empty from "@/components/Empty";
import { bySlug } from "@/lib/products";
import { useStore } from "@/lib/store";

export default function WishlistPage() {
  const { ready, wishlist } = useStore();
  if (!ready) return null;

  const items = wishlist.map(bySlug).filter(Boolean);
  if (items.length === 0)
    return <Empty title="Nothing saved" copy="Tap the heart on a piece to keep it here." href="/collections" cta="Find something" />;

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
      <h1 className="font-display text-[3rem] font-light leading-none">Saved</h1>
      <p className="mt-4 text-[10px] uppercase tracking-brand text-muted">{items.length} pieces</p>
      <div className="mt-14 grid gap-x-7 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
