"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import ArchFrame from "./ArchFrame";
import { Crescent } from "./Ornament";

/* Same curve as the .dome mask, so the gold outline sits exactly around the photo */
const DOME_PATH = "M0 140 V70 C0 44 14 40 34 20 C40 13 46 6 50 0 c4 6 10 13 16 20 20 20 34 24 34 50 V140";

/*
 * The categories as a colonnade: each collection stands in its own mihrab, crowned by a
 * hilal finial. One row that scrolls, so it reads as an arcade at any category count.
 */
export default function CategoryArcade({ c, categories }) {
  const track = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const measure = () => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
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

  return (
    <section className="relative overflow-hidden border-y border-line bg-paper py-24">
      <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.03]" />
      <div className="pointer-events-none absolute -right-40 top-0 h-[28rem] w-[28rem] rounded-full bg-gold/10 blur-[140px]" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <p className="flex items-center gap-3 text-[12px] uppercase tracking-brand text-muted">
                <Crescent className="h-4 w-4 text-gold" />
                {c.eyebrow}
              </p>
              <h2 className="mt-4 font-display text-[2.6rem] font-light leading-none sm:text-[3.4rem]">
                {c.heading}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
                Thoughtfully curated for women who appreciate modesty, sophistication, and effortless style.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-6">
              <Link
                href="/collections"
                className="underline-grow pb-1 text-[12px] uppercase tracking-brand text-muted hover:text-ink"
              >
                All {categories.length} collections →
              </Link>
              <div className="flex gap-2">
                {[-1, 1].map((dir) => (
                  <button
                    key={dir}
                    onClick={() => step(dir)}
                    disabled={dir < 0 ? edge.start : edge.end}
                    aria-label={dir < 0 ? "Previous collections" : "Next collections"}
                    className="arch-sm grid h-12 w-11 place-items-center border border-gold/50 text-gold-dark transition hover:bg-ink hover:text-gold-light disabled:pointer-events-none disabled:opacity-30"
                  >
                    {dir < 0 ? "←" : "→"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <ul
          ref={track}
          onScroll={measure}
          className="-mx-6 mt-14 flex snap-x snap-mandatory scroll-px-6 gap-8 overflow-x-auto px-6 pb-4 pt-2 [scrollbar-width:none] lg:-mx-10 lg:scroll-px-10 lg:px-10 [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((cat, i) => (
            <li key={cat.slug} className="w-[74%] shrink-0 snap-start sm:w-[42%] lg:w-[calc((100%-6rem)/4)]">
              <Reveal delay={Math.min(i, 3) * 110}>
                <Link href={`/collections?c=${cat.slug}`} className="group block">
                  {/* Hilal finial on its rod, over the crown of the dome */}
                  <div className="flex flex-col items-center">
                    <Crescent className="h-5 w-5 text-gold transition-transform duration-700 group-hover:-translate-y-1 group-hover:-rotate-12" />
                    <span className="h-4 w-px bg-gradient-to-b from-gold to-gold/20" />
                  </div>

                  <div className="relative">
                    <svg
                      viewBox="0 0 100 140"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute -inset-2 z-10 h-[calc(100%+1rem)] w-[calc(100%+1rem)] text-gold/45 transition-colors duration-500 group-hover:text-gold"
                      aria-hidden="true"
                    >
                      <path d={DOME_PATH} fill="none" stroke="currentColor" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
                    </svg>

                    <ArchFrame
                      src={cat.image}
                      alt={cat.name}
                      ratio="aspect-[3/4.3]"
                      shape="dome"
                      focus="object-top"
                      scrim={false}
                      zoomOnHover
                    >
                      <span className="self-center bg-ink/55 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gold-light backdrop-blur-md">
                        {cat.count ? `${cat.count} ${cat.count === 1 ? "piece" : "pieces"}` : "New season"}
                      </span>
                    </ArchFrame>

                    {/* Numbered keystone where the arch meets the plinth */}
                    <span className="absolute -bottom-5 left-1/2 z-20 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full border border-gold/60 bg-paper font-display text-[1.05rem] text-gold-dark shadow-sm transition-colors duration-500 group-hover:bg-ink group-hover:text-gold-light">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="mt-10 text-center">
                    <h3 className="font-display text-[1.75rem] leading-none text-ink transition-colors group-hover:text-gold-dark">
                      {cat.name}
                    </h3>
                    {cat.blurb && cat.blurb !== cat.name && (
                      <p className="mx-auto mt-3 line-clamp-2 max-w-[17rem] text-[13px] leading-relaxed text-muted">
                        {cat.blurb}
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-brand text-muted transition-colors group-hover:text-ink">
                      Enter <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-10 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      </div>
    </section>
  );
}
