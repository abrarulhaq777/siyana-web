"use client";

import Link from "next/link";
import ProductMedia from "./ProductMedia";
import { inr } from "@/lib/products";
import { useStore } from "@/lib/store";

export default function ProductCard({ product }) {
  const { wishlist, toggleWish } = useStore();
  const wished = wishlist.includes(product.slug);

  const discountPercent = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : null;

  return (
    <div className="group relative">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative">
          <ProductMedia product={product} />

          {/* Top badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 pointer-events-none">
            {product.tag && (
              <span className="backdrop-blur-md bg-paper/95 px-2.5 py-1 text-[8.5px] uppercase tracking-[0.24em] text-ink font-medium shadow-sm border border-line/60">
                {product.tag}
              </span>
            )}
            {discountPercent && (
              <span className="backdrop-blur-md bg-emerald/90 px-2 py-0.5 text-[8px] uppercase tracking-[0.2em] text-white font-medium shadow-sm">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Quick modesty indicator on hover */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
            <span className="backdrop-blur-md bg-ink/80 text-bone px-2.5 py-1 text-[8px] uppercase tracking-[0.2em] rounded-sm">
              {product.fabric}
            </span>
            {product.wuduFriendly && (
              <span className="backdrop-blur-md bg-gold/90 text-ink px-2 py-1 text-[8px] uppercase tracking-[0.16em] font-medium rounded-sm">
                Wudu Friendly
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-display text-[1.35rem] leading-tight text-ink group-hover:text-gold-dark transition-colors">
              {product.name}
            </h3>
            {product.arabicName && (
              <span className="font-arabic text-[13px] text-muted/70 shrink-0 select-none">
                {product.arabicName}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted">
            <span className="uppercase tracking-[0.18em]">{product.colorName}</span>
            <span className="text-[10px] text-sage">{product.opacity?.split(" ")[0]}</span>
          </div>

          <p className="flex items-baseline gap-2 pt-0.5 text-sm">
            <span className="font-medium text-ink">{inr(product.price)}</span>
            {product.mrp && <span className="text-xs text-muted line-through">{inr(product.mrp)}</span>}
          </p>
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWish(product.slug);
        }}
        aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
        aria-pressed={wished}
        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full backdrop-blur-md bg-paper/90 text-ink transition-transform hover:scale-110 shadow-sm hover:bg-paper"
      >
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 transition-colors ${wished ? "text-gold fill-gold" : "fill-none stroke-current"}`}
          strokeWidth="1.3"
        >
          <path d="M12 20.5S3.8 15 3.8 9.4A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8.2 2.4C20.2 15 12 20.5 12 20.5Z" />
        </svg>
      </button>
    </div>
  );
}

