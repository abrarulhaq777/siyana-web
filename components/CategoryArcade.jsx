"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import ArchFrame from "./ArchFrame";
import { Crescent, Divider, Lantern, Rosette } from "./Ornament";
import { amiri } from "@/lib/fonts";

/* Same curve as the .dome mask, so the gold outlines sit exactly around the photo */
const DOME_PATH = "M0 140 V70 C0 44 14 40 34 20 C40 13 46 6 50 0 c4 6 10 13 16 20 20 20 34 24 34 50 V140";

/* Pointed-end plaque the category name is set in */
const CARTOUCHE = "polygon(7% 0, 93% 0, 100% 50%, 93% 100%, 7% 100%, 0 50%)";

/*
 * The categories as a colonnade: each collection stands in its own mihrab, crowned by a
 * hilal finial, and all of them rest on one gold plinth. A single row that scrolls, so
 * it reads as an arcade at any category count.
 */
export default function CategoryArcade({ c, categories }) {
  const track = useRef(null);
  const [view, setView] = useState({ start: true, end: false, progress: 0, scrollable: true });

  const measure = () => {
    const el = track.current;
    if (!el) return;
    const room = el.scrollWidth - el.clientWidth;
    setView({
      start: el.scrollLeft < 8,
      end: el.scrollLeft >= room - 8,
      progress: room > 0 ? el.scrollLeft / room : 1,
      scrollable: room > 8,
    });
  };

  useEffect(() => {
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    return () => ro.disconnect();
  }, []);

  const step = (dir) => {
    const el = track.current;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * (card.offsetWidth + 32), behavior: "smooth" });
  };

  // The last two words of the heading are set in gold italic: "Curated for *Every Moment*".
  const words = (c.heading ?? "").split(" ");
  const accent = words.length > 2 ? words.splice(-2).join(" ") : "";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-paper via-sand/50 to-paper pb-20 pt-6">
      <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.04]" />
      <Rosette className="pointer-events-none absolute -bottom-40 -left-40 h-[30rem] w-[30rem] text-gold/10" spin />
      <Rosette className="pointer-events-none absolute -right-48 -top-24 h-[26rem] w-[26rem] text-gold/10" spin />
      <Lantern className="animate-sway pointer-events-none absolute left-[7%] top-0 hidden h-40 w-9 text-gold/50 lg:block" drop={26} />
      <Lantern className="animate-sway pointer-events-none absolute right-[7%] top-0 hidden h-48 w-9 text-gold/40 lg:block" drop={36} />

      <div className="relative mx-auto max-w-[1400px] px-6 pt-16 lg:px-10">
        <Reveal from="fade">
          <div className="mx-auto max-w-2xl text-center">
            {c.arabic && (
              <p lang="ar" dir="rtl" className={`${amiri.className} text-[2.1rem] leading-none text-gold-dark`}>
                {c.arabic}
              </p>
            )}
            <Divider label={c.eyebrow} className="mt-5" />
            <h2 className="mt-6 font-display text-[2.8rem] font-light leading-[1.05] sm:text-[3.8rem]">
              {words.join(" ")} {accent && <span className="italic text-gold-dark">{accent}</span>}
            </h2>
            {c.body && <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-muted">{c.body}</p>}
          </div>
        </Reveal>

        <ul
          ref={track}
          onScroll={measure}
          className="-mx-6 mt-16 flex snap-x snap-mandatory scroll-px-6 gap-8 overflow-x-auto px-6 pb-6 pt-3 [scrollbar-width:none] lg:-mx-10 lg:scroll-px-10 lg:px-10 [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((cat, i) => (
            <li key={cat.slug} className="w-[74%] shrink-0 snap-start sm:w-[42%] lg:w-[calc((100%-6rem)/4)]">
              <Reveal delay={Math.min(i, 3) * 110}>
                <Link href={`/collections?c=${cat.slug}`} className="group block">
                  {/* Hilal finial on its rod, over the crown of the dome */}
                  <div className="flex flex-col items-center">
                    <Crescent className="h-6 w-6 text-gold transition-transform duration-700 group-hover:-translate-y-1 group-hover:-rotate-12" />
                    <span className="h-3 w-px bg-gold/70" />
                    <span className="h-1.5 w-1.5 rotate-45 border border-gold/80" />
                    <span className="h-3 w-px bg-gradient-to-b from-gold/70 to-gold/20" />
                  </div>

                  <div className="relative">
                    {/* Double outline: a quiet outer line, and an inner one that traces itself in gold on hover */}
                    <svg
                      viewBox="0 0 100 140"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute -inset-2.5 z-10 h-[calc(100%+1.25rem)] w-[calc(100%+1.25rem)] text-gold/40"
                      aria-hidden="true"
                    >
                      <path d={DOME_PATH} fill="none" stroke="currentColor" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
                    </svg>
                    <svg
                      viewBox="0 0 100 140"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute -inset-1 z-10 h-[calc(100%+0.5rem)] w-[calc(100%+0.5rem)] text-gold"
                      aria-hidden="true"
                    >
                      <path
                        d={DOME_PATH}
                        pathLength="1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        vectorEffect="non-scaling-stroke"
                        className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-[stroke-dashoffset] duration-[1400ms] ease-out group-hover:[stroke-dashoffset:0]"
                      />
                    </svg>

                    <ArchFrame
                      src={cat.image}
                      alt={cat.name}
                      ratio="aspect-[3/4.3]"
                      shape="dome"
                      focus="object-top"
                      scrim={false}
                      zoomOnHover
                    />

                    {/* A band of light crosses the niche on hover */}
                    <div className="dome pointer-events-none absolute inset-0 overflow-hidden">
                      <div className="absolute -top-1/4 left-0 h-[150%] w-1/3 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-all duration-[1200ms] ease-out group-hover:translate-x-[320%] group-hover:opacity-100" />
                    </div>

                    {/* The plinth: segments meet across the gaps, so every arch stands on one base */}
                    <span className="pointer-events-none absolute -inset-x-4 bottom-0 h-px bg-gold/60" />
                    <span className="pointer-events-none absolute -inset-x-4 -bottom-1.5 h-px bg-gold/30" />

                    {/* Name plaque, mounted on the plinth */}
                    <div
                      className="absolute -bottom-7 left-1/2 z-20 w-[92%] -translate-x-1/2 bg-gold/70 p-px shadow-md transition-colors duration-500 group-hover:bg-gold"
                      style={{ clipPath: CARTOUCHE }}
                    >
                      <div
                        className="bg-paper px-7 py-3 text-center transition-colors duration-500 group-hover:bg-ink"
                        style={{ clipPath: CARTOUCHE }}
                      >
                        <span className="block text-[9.5px] uppercase tracking-[0.28em] text-gold-dark transition-colors group-hover:text-gold-light">
                          {String(i + 1).padStart(2, "0")} · {cat.count ? `${cat.count} ${cat.count === 1 ? "piece" : "pieces"}` : "New season"}
                        </span>
                        <h3 className="mt-0.5 whitespace-nowrap font-display text-[1.25rem] leading-tight text-ink transition-colors group-hover:text-bone xl:text-[1.4rem]">
                          {cat.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="mt-14 text-center">
                    {cat.blurb && cat.blurb !== cat.name && (
                      <p className="mx-auto line-clamp-2 max-w-[17rem] text-[13px] leading-relaxed text-muted">{cat.blurb}</p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-brand text-gold-dark transition-colors group-hover:text-ink">
                      Explore <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col items-center gap-8">
          {view.scrollable && (
            <div className="flex items-center gap-5">
              {[-1, 1].map((dir) => (
                <button
                  key={dir}
                  onClick={() => step(dir)}
                  disabled={dir < 0 ? view.start : view.end}
                  aria-label={dir < 0 ? "Previous collections" : "Next collections"}
                  className={`arch-sm grid h-12 w-11 place-items-center border border-gold/50 bg-paper text-gold-dark transition hover:bg-ink hover:text-gold-light disabled:pointer-events-none disabled:opacity-30 ${dir < 0 ? "order-first" : "order-last"}`}
                >
                  {dir < 0 ? "←" : "→"}
                </button>
              ))}
              <span className="relative h-px w-40 bg-gold/25 sm:w-56" aria-hidden="true">
                <span
                  className="absolute inset-y-0 left-0 bg-gold transition-[width] duration-300"
                  style={{ width: `${Math.max(12, view.progress * 100)}%` }}
                />
                <span
                  className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-gold bg-paper transition-[left] duration-300"
                  style={{ left: `${Math.max(12, view.progress * 100)}%` }}
                />
              </span>
            </div>
          )}

          <Link
            href="/collections"
            className="inline-flex items-center gap-3 border border-gold/60 bg-paper/70 px-8 py-3.5 text-[11.5px] uppercase tracking-brand text-ink transition hover:bg-ink hover:text-gold-light"
          >
            <Crescent className="h-3.5 w-3.5 text-gold" />
            View all {categories.length} collections
          </Link>
        </div>
      </div>
    </section>
  );
}
