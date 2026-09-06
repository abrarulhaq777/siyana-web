"use client";

import Link from "next/link";
import { useState } from "react";
import ProductMedia from "@/components/ProductMedia";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { inr, sizes, abayaLengths } from "@/lib/products";
import { useStore } from "@/lib/store";

export default function ProductView({ product, related, categories = [] }) {
  // Stock is per size — a size with nothing left is shown but not selectable.
  const stockFor = (size) => product.stock?.find((x) => x.size === size)?.qty ?? 0;
  const soldOut = !(product.stock ?? []).some((x) => x.qty > 0);
  const { addToCart, wishlist, toggleWish } = useStore();
  const [size, setSize] = useState(null);
  const [length, setLength] = useState(abayaLengths[2]); // Default 56"
  const [added, setAdded] = useState(false);
  const [err, setErr] = useState(false);
  const category = categories.find((c) => c.slug === product.category);
  const wished = wishlist.includes(product.slug);

  const isLongGarment = product.category === "abayas" || product.category === "prayerwear";

  const add = () => {
    if (!size) return setErr(true);
    addToCart(product.slug, isLongGarment ? `${size} · ${length.split(" ")[0]}` : size);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <>
      <nav className="mx-auto max-w-[1400px] px-6 pt-10 text-[10px] uppercase tracking-[0.18em] text-muted lg:px-10 flex items-center gap-2">
        <Link href="/collections" className="hover:text-ink">Collections</Link>
        <span className="text-muted/60">/</span>
        <Link href={`/collections?c=${product.category}`} className="hover:text-ink">{category?.name}</Link>
        <span className="text-muted/60">/</span>
        <span className="text-ink font-medium">{product.name}</span>
      </nav>

      <section className="mx-auto grid max-w-[1400px] gap-12 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:px-10">
        <div className="space-y-6">
          <ProductMedia product={product} ratio="aspect-[3/4]" className="shadow-md" />
          <div className="grid grid-cols-2 gap-4">
            <div className="arch-sm relative aspect-[4/3] overflow-hidden bg-sand/60 p-6 flex flex-col justify-end border border-line">
              <span className="text-[9px] uppercase tracking-brand text-gold font-medium">Modesty Standard</span>
              <p className="mt-1 font-display text-lg leading-tight text-ink">{product.opacity}</p>
              <p className="text-[11px] text-muted mt-1">Light transmission checked to guarantee zero sheer.</p>
            </div>
            <div className="arch-sm relative aspect-[4/3] overflow-hidden bg-sand/60 p-6 flex flex-col justify-end border border-line">
              <span className="text-[9px] uppercase tracking-brand text-gold font-medium">Silhouette Cut</span>
              <p className="mt-1 font-display text-lg leading-tight text-ink">{product.silhouette}</p>
              <p className="text-[11px] text-muted mt-1">Designed for full coverage and graceful natural drape.</p>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-36 lg:self-start space-y-8">
          <div>
            <div className="flex items-center justify-between">
              {product.tag && (
                <span className="bg-gold/15 text-gold-dark border border-gold/30 px-3 py-1 text-[9px] uppercase tracking-brand font-medium">
                  {product.tag}
                </span>
              )}
            </div>

            <h1 className="mt-4 font-display text-[2.8rem] font-light leading-none sm:text-[3.4rem]">
              {product.name}
            </h1>

            <p className="mt-6 flex items-baseline gap-3">
              <span className="text-2xl font-normal text-ink">{inr(product.price)}</span>
              {product.mrp && (
                <>
                  <span className="text-sm text-muted line-through">{inr(product.mrp)}</span>
                  <span className="bg-emerald/10 text-emerald text-[9.5px] uppercase tracking-brand px-2 py-0.5 font-medium">
                    Save {Math.round((1 - product.price / product.mrp) * 100)}%
                  </span>
                </>
              )}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted">Inclusive of all duties & taxes</p>
          </div>

          <p className="text-[15px] leading-relaxed text-muted/90 border-t border-line pt-6">
            {product.story}
          </p>

          {/* Color and Fabric specifications */}
          <div className="flex flex-wrap items-center gap-6 border-y border-line py-4 text-[10px] uppercase tracking-[0.18em]">
            <div className="flex items-center gap-2.5">
              <span className="h-3.5 w-3.5 rounded-full border border-line shadow-xs" style={{ backgroundColor: product.color }} />
              <span className="text-ink font-medium">{product.colorName}</span>
            </div>
            <span className="text-muted/40">·</span>
            <span className="text-ink font-medium">{product.fabric}</span>
            {product.wuduFriendly && (
              <>
                <span className="text-muted/40">·</span>
                <span className="text-gold-dark font-medium">✓ Wudu Friendly Sleeves</span>
              </>
            )}
          </div>

          {/* Sizing & Length Options */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-brand text-ink">1. Select Size</p>
                <Link href="/help/sizing" className="underline-grow text-[9.5px] uppercase tracking-[0.18em] text-muted">
                  Size guide
                </Link>
              </div>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {sizes.map((s) => {
                  const left = stockFor(s);
                  return (
                    <button
                      key={s}
                      disabled={left === 0}
                      onClick={() => {
                        setSize(s);
                        setErr(false);
                      }}
                      aria-pressed={size === s}
                      title={left === 0 ? "Out of stock" : left <= 2 ? `Only ${left} left` : undefined}
                      className={`h-11 w-14 border text-[11px] tracking-[0.1em] transition ${
                        left === 0
                          ? "cursor-not-allowed border-line/60 bg-sand/40 text-muted/50 line-through"
                          : size === s
                            ? "border-ink bg-ink font-medium text-bone shadow-xs"
                            : "border-line bg-paper hover:border-ink"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              {err && <p className="mt-2 text-[11px] text-sage">Please select a size to proceed.</p>}
              {size && stockFor(size) <= 2 && stockFor(size) > 0 && (
                <p className="mt-2 text-[11px] text-gold-dark">Only {stockFor(size)} left in {size}.</p>
              )}
              {soldOut && <p className="mt-2 text-[11px] text-muted">This piece is sold out. New stock is cut every few weeks.</p>}
            </div>

            {isLongGarment && (
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-brand text-ink">2. Abaya Length (Shoulder to Ankle)</p>
                  <span className="text-[9px] uppercase tracking-[0.18em] text-muted">Standard modest drop</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {abayaLengths.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLength(l)}
                      aria-pressed={length === l}
                      className={`h-10 px-3.5 border text-[10.5px] tracking-[0.08em] transition ${
                        length === l ? "border-gold bg-gold/10 text-ink font-medium" : "border-line hover:border-ink bg-paper"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={add}
              className={`flex-1 py-4 text-[10px] uppercase tracking-brand transition shadow-sm ${
                added ? "bg-emerald text-white" : "bg-ink text-bone hover:bg-gold-dark"
              }`}
            >
              {added ? "✓ Added to Bag" : "Add to Bag"}
            </button>
            <button
              onClick={() => toggleWish(product.slug)}
              aria-pressed={wished}
              aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
              className="grid w-14 place-items-center border border-line bg-paper transition hover:border-ink"
            >
              <svg viewBox="0 0 24 24" className={`h-4 w-4 ${wished ? "text-gold fill-gold" : "stroke-current fill-none"}`} strokeWidth="1.2">
                <path d="M12 20.5S3.8 15 3.8 9.4A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8.2 2.4C20.2 15 12 20.5 12 20.5Z" />
              </svg>
            </button>
          </div>

          {/* Details list */}
          <ul className="space-y-3 border-t border-line pt-6 text-sm text-muted">
            {product.details.map((d) => (
              <li key={d} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>{d}</span>
              </li>
            ))}
          </ul>

          <dl className="space-y-3 border-t border-line pt-6 text-[10.5px] uppercase tracking-[0.16em] text-muted">
            <Row k="Dispatch" v="Ships within 24 hours" />
            <Row k="Modesty Guarantee" v="Free 15-day exchanges" />
            <Row k="Packaging" v="Discreet Luxury Box with Ribbon" />
            <Row k="Payment Methods" v="UPI · Cards · Cash on Delivery" />
          </dl>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 border-t border-line">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="font-display text-[2.2rem] font-light">Complete the Modest Wardrobe</h2>
            <Link href={`/collections?c=${product.category}`} className="underline-grow text-[9.5px] uppercase tracking-brand text-muted hover:text-ink">
              View more in this category
            </Link>
          </div>
          <div className="grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

const Row = ({ k, v }) => (
  <div className="flex justify-between gap-6">
    <dt>{k}</dt>
    <dd className="text-ink font-medium">{v}</dd>
  </div>
);

