"use client";

import { useState } from "react";
import Link from "next/link";
import ArchFrame from "./ArchFrame";
import Reveal from "./Reveal";
import { Corner, Divider, Lantern, Rosette } from "./Ornament";

/* `match` picks the live category each occasion links to; no match falls back to everything */
const OCCASIONS = [
  {
    id: "jummah",
    label: "Jummah & Salah",
    time: "Friday · Fajr to Isha",
    title: "Stillness, fully covered",
    body: "Overhead khimars and silent brushed cottons with room for sujud — opaque in bright sun, quiet in a hushed masjid.",
    cut: "Overhead khimar · two-piece prayer set",
    image: "/images/categories/prayerwear.jpg",
    match: /prayer|khimar|abaya/,
  },
  {
    id: "eid",
    label: "Eid & Nikah",
    time: "Celebration",
    title: "Grandeur that keeps its modesty",
    body: "Hand-finished kaftans with tonal gold needlework, sweeping volume and full lining for long evenings with family.",
    cut: "Royal kaftan · farasha sleeve",
    image: "/images/categories/kaftans.jpg",
    match: /kaftan|occasion|festive/,
  },
  {
    id: "work",
    label: "The Workweek",
    time: "Monday to Thursday",
    title: "Composed from nine to six",
    body: "Column dresses with wudu-friendly cuffs that slide up for ablution, and high necklines that stay neat through a twelve-hour day.",
    cut: "Shirt dress · longline tunic",
    image: "/images/categories/dresses.jpg",
    match: /maxi|dress/,
  },
  {
    id: "travel",
    label: "Weekends & Travel",
    time: "Errands · Umrah · Journeys",
    title: "Ease that travels well",
    body: "Relaxed co-ords and wide-leg sets in crease-shy weaves that pack small and come out of the case ready.",
    cut: "Co-ord set · wide-leg trouser",
    image: "/images/categories/coords.jpg",
    match: /coord|co-ord-set/,
  },
];

export default function OccasionEdit({ categories = [] }) {
  const [active, setActive] = useState(0);
  const current = OCCASIONS[active];
  const hrefFor = (o) => {
    const cat = categories.find((c) => o.match.test(c.slug));
    return cat ? `/collections?c=${cat.slug}` : "/collections";
  };

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
            <Divider label="The Occasion Edit" />
            <h2 className="mt-7 font-display text-[2.6rem] font-light leading-tight text-bone sm:text-[3.4rem]">
              Dressed for every sacred &amp; <span className="italic text-gold-light">everyday moment</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-bone/65">
              From the quiet of Friday prayer to a full Eid table — choose the moment, and we&rsquo;ll show you what to wear to it.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <ol className="border-t border-bone/15">
            {OCCASIONS.map((o, i) => {
              const open = i === active;
              return (
                <li key={o.id} className="border-b border-bone/15">
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
                        <p className="mt-4 text-[11px] uppercase tracking-brand text-gold-light/80">{o.cut}</p>
                        <Link
                          href={hrefFor(o)}
                          className="mt-6 inline-block border border-gold/60 px-7 py-3.5 text-[11.5px] uppercase tracking-brand text-gold-light transition hover:bg-gold hover:text-midnight-deep"
                        >
                          Shop {o.label} →
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="relative order-first mx-auto w-full max-w-[460px] lg:order-none">
            <Corner className="absolute -bottom-4 -left-4 z-10 h-14 w-14 -scale-y-100 text-gold/70" />
            <Corner className="absolute -bottom-4 -right-4 z-10 h-14 w-14 -scale-100 text-gold/70" />
            <div key={current.id} className="animate-fade">
              <ArchFrame src={current.image} alt={current.label} ratio="aspect-[3/4]" shape="dome" focus="object-top">
                <span className="text-[10.5px] uppercase tracking-brand text-gold-light">{current.label}</span>
                <p className="mt-1.5 font-display text-[2rem] font-light italic leading-tight text-white">{current.title}</p>
              </ArchFrame>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
