"use client";

import Link from "next/link";
import ProductMedia from "./ProductMedia";
import { inr } from "@/lib/products";
import { useStore } from "@/lib/store";

/*
 * Alignment rule: every zone below the image has a reserved height, so a
 * two-line name never pushes its neighbour's price out of line. Names are
 * clamped to two lines rather than truncated to one.
 */
export default function ProductCard({ product, tone = "light" }) {
  const dark = tone === "dark";
  const { wishlist, toggleWish } = useStore();
  const wished = wishlist.includes(product.slug);
  const off = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : null;

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative">
        <ProductMedia product={product}>
          {/* Sits in the arch's straight-sided zone, so the crown never clips it */}
          <span className="translate-y-2 self-start bg-ink/75 px-2.5 py-1 text-[8px] uppercase tracking-[0.2em] text-bone opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            {product.fabric}
          </span>
        </ProductMedia>

        <button
          onClick={() => toggleWish(product.slug)}
          aria-label={wished ? `Remove ${product.name} from saved` : `Save ${product.name}`}
          aria-pressed={wished}
          className="absolute bottom-4 right-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-paper/90 text-ink shadow-sm backdrop-blur-md transition hover:scale-110 hover:bg-paper"
        >
          <svg
            viewBox="0 0 24 24"
            className={`h-4 w-4 ${wished ? "fill-gold text-gold" : "fill-none stroke-current"}`}
            strokeWidth="1.3"
          >
            <path d="M12 20.5S3.8 15 3.8 9.4A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8.2 2.4C20.2 15 12 20.5 12 20.5Z" />
          </svg>
        </button>
      </div>

      <Link
        href={`/product/${product.slug}`}
        className="flex flex-1 flex-col after:absolute after:inset-0 after:z-10 after:content-['']"
      >

        {/* Reserved eyebrow row — keeps titles level whether or not a piece is tagged */}
        <div className="mt-4 flex min-h-4 items-center gap-2 text-[8.5px] uppercase tracking-[0.22em]">
          {product.tag && <span className={dark ? "text-gold-light" : "text-gold-dark"}>{product.tag}</span>}
          {off && (
            <>
              {product.tag && <span className={`h-2.5 w-px ${dark ? "bg-bone/25" : "bg-line"}`} />}
              <span className={dark ? "text-gold-light/80" : "text-sage"}>Save {off}%</span>
            </>
          )}
        </div>

        <h3 className={`mt-1.5 line-clamp-2 min-h-[2.6rem] font-display text-[1.3rem] leading-[1.3] transition-colors ${dark ? "text-bone group-hover:text-gold-light" : "text-ink group-hover:text-gold-dark"}`}>
          {product.name}
        </h3>

        <div className={`mt-1 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] ${dark ? "text-bone/60" : "text-muted"}`}>
          <span className="truncate">{product.colorName}</span>
          {product.opacity && <span className={`shrink-0 ${dark ? "text-gold-light/70" : "text-sage"}`}>{product.opacity.split(" ")[0]}</span>}
        </div>

        <p className="mt-auto flex items-baseline gap-2 pt-3 text-sm">
          <span className={`font-medium ${dark ? "text-bone" : "text-ink"}`}>{inr(product.price)}</span>
          {product.mrp && <span className={`text-xs line-through ${dark ? "text-bone/45" : "text-muted"}`}>{inr(product.mrp)}</span>}
        </p>
      </Link>
    </article>
  );
}
