"use client";

import { useState } from "react";
import Link from "next/link";
import MihrabFrame from "./MihrabFrame";
import Reveal from "./Reveal";
import { Divider, Lantern, Rosette } from "./Ornament";
import { inr } from "@/lib/products";

/* Copy and moments come from the CMS (Admin → Content → For every moment); each moment is
 * shown in the product its `slug` names, and drops out if that product is gone. */
export default function OccasionEdit({ c, products = {} }) {
  const moments = (c.items ?? []).filter((o) => products[o.slug]);
  const [active, setActive] = useState(0);
  if (!moments.length) return null;
  const at = Math.min(active, moments.length - 1);
  const current = moments[at];
  const product = products[current.slug];

  return (
    <section className="relative overflow-hidden bg-midnight text-bone">
      <div className="pattern-girih-gold pointer-events-none absolute inset-0 opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-midnight-deep via-transparent to-midnight-deep" />
      <Rosette className="pointer-events-none absolute -left-32 bottom-0 h-[26rem] w-[26rem] text-gold/10" spin />

      <Lantern className="animate-sway pointer-events-none absolute left-[6%] top-0 hidden h-44 w-9 text-gold/45 lg:block" drop={22} />
      <Lantern className="animate-sway pointer-events-none absolute right-[7%] top-0 hidden h-36 w-8 text-gold/35 lg:block" drop={12} />
      <Lantern className="animate-sway pointer-events-none absolute right-[13%] top-0 hidden h-48 w-9 text-gold/25 lg:block" drop={34} />

      <div className="relative mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-28">
        <Reveal from="fade">
          <div className="mx-auto max-w-2xl text-center">
            <Divider label={c.label} />
            <h2 className="mt-7 font-display text-[2.6rem] font-light leading-tight text-bone sm:text-[3.4rem]">
              {c.heading} {c.accent && <span className="italic text-gold-light">{c.accent}</span>}
            </h2>
            {c.body && <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-bone/65">{c.body}</p>}
          </div>
        </Reveal>

        <div className="mt-16 grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <ol className="border-t border-bone/15">
            {moments.map((o, i) => {
              const open = i === at;
              const p = products[o.slug];
              return (
                <li key={o.slug + i} className="border-b border-bone/15">
                  <button
                    onClick={() => setActive(i)}
                    aria-expanded={open}
                    className="group flex w-full items-baseline gap-5 py-6 text-left"
                  >
                    <span className={`font-display text-[1.3rem] transition-colors ${open ? "text-gold" : "text-bone/35"}`}>
                      0{i + 1}
                    </span>
                    <span className="flex-1">
                      <span className={`block font-display text-[1.9rem] leading-none transition-colors sm:text-[2.2rem] ${open ? "text-gold-light" : "text-bone/80 group-hover:text-bone"}`}>
                        {o.label}
                      </span>
                      <span className="mt-2 block text-[11px] uppercase tracking-brand text-bone/45">{o.time}</span>
                    </span>
                    <span className={`text-gold transition-transform duration-500 ${open ? "rotate-45" : ""}`}>+</span>
                  </button>

                  <div className={`grid transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <div className="pb-8 pl-11">
                        <p className="max-w-md text-sm leading-relaxed text-bone/70">{o.body}</p>
                        <p className="mt-4 text-[11px] uppercase tracking-brand text-gold-light/80">
                          {p.name} · {inr(p.price)}
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-5">
                          <Link
                            href={o.href}
                            className="inline-block border border-gold/60 px-7 py-3.5 text-[11.5px] uppercase tracking-brand text-gold-light transition hover:bg-gold hover:text-midnight-deep"
                          >
                            Shop {o.label} →
                          </Link>
                          <Link href={`/product/${p.slug}`} className="underline-grow py-1 text-[11px] uppercase tracking-brand text-bone/60 hover:text-bone">
                            View this piece
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="relative order-first mx-auto w-full max-w-[400px] lg:order-none">
            <Link key={at} href={`/product/${product.slug}`} className="animate-fade block">
              <MihrabFrame src={product.image} alt={product.name} label={current.label} tone="dark" />
              <p className="mt-6 text-center font-display text-[1.9rem] font-light italic leading-tight text-gold-light">
                {current.title}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
