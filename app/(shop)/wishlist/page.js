"use client";

import ProductCard from "@/components/ProductCard";
import Empty from "@/components/Empty";
import { useStore } from "@/lib/store";

export default function WishlistPage() {
  const { hydrated, saved } = useStore();
  if (!hydrated) return null;

  if (saved.length === 0)
    return <Empty title="Nothing saved" copy="Tap the heart on a piece to keep it here." href="/collections" cta="Find something" />;

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
      <h1 className="font-display text-[3rem] font-light leading-none">Saved</h1>
      <p className="mt-4 text-[12px] uppercase tracking-brand text-muted">{saved.length} pieces</p>
      <div className="mt-14 grid items-stretch gap-x-7 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {saved.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
