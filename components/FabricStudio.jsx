"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import MihrabFrame from "@/components/MihrabFrame";
import { Crescent, Star } from "@/components/Ornament";
import { inr } from "@/lib/products";
import { WEAVES } from "@/lib/showcase";

export default function FabricStudio({ products = {} }) {
  const weaves = WEAVES.filter((w) => products[w.slug]);
  const [selected, setSelected] = useState(0);
  if (!weaves.length) return null;
  const current = weaves[Math.min(selected, weaves.length - 1)];
  const product = products[current.slug];

  return (
    <section className="relative overflow-hidden border-t border-line bg-paper py-24 lg:py-32">
      <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.025]" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 border border-gold/40 bg-bone px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
                <Crescent className="h-3 w-3 text-gold" />
                <span>Premium Fabrics</span>
              </div>
              <h2 className="mt-4 font-display text-[2.6rem] font-light leading-tight sm:text-[3.4rem]">
                Premium Fabrics &amp; Beautiful Details
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
                From striped maxi dresses to crush silk cotton co-ord sets and embroidered designs, our range celebrates distinctive textures, thoughtful detailing, and styles that stand out without being overwhelming.
              </p>
            </div>

            <Link
              href="/collections"
              className="underline-grow shrink-0 pb-1 text-[12px] font-medium uppercase tracking-brand text-muted hover:text-ink"
            >
              Shop all collections →
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 flex flex-wrap gap-2 border-b border-line pb-4 sm:gap-3">
          {weaves.map((w, i) => (
            <button
              key={w.id}
              onClick={() => setSelected(i)}
              className={`rounded-xs px-4 py-2.5 text-[11.5px] font-medium uppercase tracking-brand transition ${
                current.id === w.id
                  ? "border border-gold bg-ink text-bone shadow-xs"
                  : "border border-line bg-bone/70 text-muted hover:border-gold/50 hover:text-ink"
              }`}
            >
              <span className="mr-2 text-gold-light">0{i + 1}</span>
              {w.tab}
            </button>
          ))}
        </div>

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="space-y-6">
            <div>
              <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-gold-dark">
                {current.tag}
              </span>
              <h3 className="mt-2 font-display text-[2.2rem] font-light leading-none text-ink sm:text-[2.6rem]">
                {current.name}
              </h3>
              <p className="mt-2 text-[14px] italic text-gold-dark">&ldquo;{current.subtitle}&rdquo;</p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">{current.description}</p>
            </div>

            <ul className="grid gap-3 border-y border-line py-6 sm:grid-cols-2">
              {current.notes.map((note) => (
                <li key={note} className="flex items-center gap-3 text-[13px] text-ink">
                  <Star className="h-3.5 w-3.5 shrink-0 text-gold" />
                  {note}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="max-w-md">
                <span className="text-[10.5px] uppercase tracking-wider text-muted">Perfect for:</span>
                <p className="text-[13px] text-ink">{current.bestFor}</p>
              </div>

              <Link
                href={current.link}
                className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-[11.5px] font-medium uppercase tracking-brand text-bone shadow-xs transition hover:bg-gold-dark"
              >
                <span>{current.linkText}</span>
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[400px]">
            <Link key={current.id} href={`/product/${product.slug}`} className="animate-fade block">
              <MihrabFrame src={product.image} alt={product.name} label={current.name} />
              <div className="mt-5 text-center">
                <p className="font-display text-[1.6rem] leading-tight text-ink">{product.name}</p>
                <p className="mt-1 text-[12px] uppercase tracking-[0.16em] text-muted">
                  {product.colorName} · {inr(product.price)}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
