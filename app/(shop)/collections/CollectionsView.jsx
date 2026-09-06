"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

const sorts = [
  ["curated", "Curated Selection"],
  ["low", "Price · Low to High"],
  ["high", "Price · High to Low"],
];

export default function CollectionsView({ categories = [], products = [] }) {
  const active = useSearchParams().get("c") ?? "all";
  const [sort, setSort] = useState("curated");
  const category = categories.find((c) => c.slug === active);

  const list = useMemo(() => {
    const base = active === "all" ? products : products.filter((p) => p.category === active);
    if (sort === "low") return [...base].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...base].sort((a, b) => b.price - a.price);
    return base;
  }, [active, sort, products]);

  return (
    <>
      <header className="mx-auto max-w-[1400px] px-6 pb-12 pt-14 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-brand text-muted">Curated Wardrobe</p>
            <h1 className="mt-4 font-display text-[3.2rem] font-light leading-none sm:text-[4rem]">
              {category?.name ?? "All Creations"}
            </h1>
            <p className="mt-4 max-w-xl text-sm text-muted/90 leading-relaxed">
              {category?.blurb ?? "The complete modesty repertoire — cut with intention, guaranteed zero-sheer, and crafted for real daily life."}
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-4 border border-line bg-paper/60 px-5 py-3 rounded-xs text-[10px] uppercase tracking-[0.16em] text-muted">
            <span className="text-gold font-medium">✓ 100% Opaque Guarantee</span>
            <span className="text-line">|</span>
            <span>Wudu-Friendly Sleeves</span>
            <span className="text-line">|</span>
            <span>52″–60″ Lengths</span>
          </div>
        </div>
      </header>

      <div className="sticky top-[104px] z-30 border-y border-line bg-bone/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center gap-6 overflow-x-auto px-6 py-4 lg:px-10">
          <nav className="flex flex-1 items-center gap-6 whitespace-nowrap text-[10px] uppercase tracking-[0.2em]">
            <Chip href="/collections" label="All Pieces" on={active === "all"} />
            {categories.map((c) => (
              <Chip key={c.slug} href={`/collections?c=${c.slug}`} label={c.name} on={active === c.slug} />
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <label className="text-[9.5px] uppercase tracking-brand text-muted hidden sm:inline" htmlFor="sort">
              Sort:
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none border-b border-ink/20 bg-transparent py-1 pr-5 text-[10px] uppercase tracking-[0.18em] outline-none text-ink font-medium [background-image:url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2010%206%22%3E%3Cpath%20d=%22M1%201l4%204%204-4%22%20fill=%22none%22%20stroke=%22%23837b6e%22%20stroke-width=%221%22/%3E%3C/svg%3E')] [background-position:right_center] [background-repeat:no-repeat] [background-size:9px]"
            >
              {sorts.map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
        <div className="flex items-center justify-between mb-10 text-[10px] uppercase tracking-brand text-muted">
          <span>{list.length} creations available</span>
          <span className="text-gold font-medium">Small-Batch Certified</span>
        </div>
        <div className="grid gap-x-7 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 4) * 60}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

const Chip = ({ href, label, on }) => (
  <Link
    href={href}
    className={`transition-colors py-1 ${
      on
        ? "text-ink font-medium border-b-2 border-gold"
        : "text-muted hover:text-ink"
    }`}
  >
    {label}
  </Link>
);

