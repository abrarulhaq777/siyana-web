"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ArchFrame from "@/components/ArchFrame";
import { Crescent, Corner, Star } from "@/components/Ornament";

const WEAVES = [
  {
    id: "nida",
    name: "Japanese Nida Silk-Crepe",
    tag: "Signature Abayas",
    image: "/images/products/noor-open-abaya.jpg",
    subtitle: "The gold standard of modest luxury drape",
    description:
      "Spun from ultra-fine filament yarns in Osaka, our Japanese Nida provides an exquisite fluid drop that never clings. Naturally cooling, anti-static, and tested to ensure 100% zero-sheer opacity even under harsh direct midday sun.",
    attributes: [
      { label: "Opacity", value: "100% Certified Opaque", score: 5 },
      { label: "Drape Flow", value: "Heavy Fluid Glide", score: 5 },
      { label: "Breathability", value: "High Airflow Weave", score: 4.5 },
      { label: "Slip Resistance", value: "Micro-Crepe Texture", score: 4.5 },
    ],
    bestFor: "Friday Jummah, sacred celebrations, and daily executive wear.",
    link: "/collections?c=abayas",
    linkText: "Explore Nida Abayas →",
  },
  {
    id: "modal",
    name: "Beechwood Cloud Modal",
    tag: "Hijabs & Shawls",
    image: "/images/products/hana-modal-hijab.jpg",
    subtitle: "Weightless breathability with natural non-slip grip",
    description:
      "Crafted from sustainably harvested Austrian beechwood fibers, this textile feels like second-skin air. Its micro-ribbed weave moulds effortlessly around the face and crown, holding securely throughout the day with zero need for pins.",
    attributes: [
      { label: "Opacity", value: "Full Modest Coverage", score: 5 },
      { label: "Drape Flow", value: "Weightless Cascade", score: 5 },
      { label: "Breathability", value: "Maximum Aeration", score: 5 },
      { label: "Slip Resistance", value: "Pin-Free Security", score: 5 },
    ],
    bestFor: "All-day errands, school runs, commute, and warm humid weather.",
    link: "/collections?c=hijabs",
    linkText: "Explore Bamboo Scarves →",
  },
  {
    id: "linen",
    name: "Desert-Washed Pure Linen",
    tag: "Staples & Overcoats",
    image: "/images/products/layl-linen-abaya.jpg",
    subtitle: "Artisan flax with organic temperature-regulating drape",
    description:
      "Pre-washed with desert river stones for a buttery-soft hand feel. This pure organic flax weave allows natural air circulation while maintaining a crisp, architectural silhouette that floats away from the body gracefully.",
    attributes: [
      { label: "Opacity", value: "Zero-Transparency Weave", score: 5 },
      { label: "Drape Flow", value: "Structured & Architectural", score: 4 },
      { label: "Breathability", value: "Natural Thermoregulation", score: 5 },
      { label: "Slip Resistance", value: "Tactile Organic Grip", score: 4.5 },
    ],
    bestFor: "Summer gatherings, travel abroad, and layered morning wear.",
    link: "/collections?c=abayas",
    linkText: "Explore Linen Pieces →",
  },
  {
    id: "organza",
    name: "Tonal Embroidered Crepe",
    tag: "Occasion Kaftans",
    image: "/images/products/zahra-kaftan.jpg",
    subtitle: "Ceremonial elegance with metallic thread embroidery",
    description:
      "A rich, double-woven matte crepe enriched with tonal metallic gold threadwork along the neckline and sweeping cuffs. Fully lined with anti-static featherlight silk to ensure modesty in motion during sacred celebrations.",
    attributes: [
      { label: "Opacity", value: "100% Fully Lined", score: 5 },
      { label: "Drape Flow", value: "Royal Sweeping Volume", score: 5 },
      { label: "Breathability", value: "Comfortably Lined", score: 4 },
      { label: "Slip Resistance", value: "Tailored Fixed Fit", score: 5 },
    ],
    bestFor: "Eid festivities, family banquets, nikah ceremonies, and formal evenings.",
    link: "/collections?c=kaftans",
    linkText: "Explore Kaftans →",
  },
];

export default function FabricStudio() {
  const [selected, setSelected] = useState(0);
  const current = WEAVES[selected];

  return (
    <section className="relative overflow-hidden border-t border-line bg-paper py-24 lg:py-32">
      <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.025]" />
      
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 border border-gold/40 bg-bone px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
                <Crescent className="h-3 w-3 text-gold" />
                <span>Textile Atelier</span>
              </div>
              <h2 className="mt-4 font-display text-[2.6rem] font-light leading-tight sm:text-[3.4rem]">
                The Craft & Soul of Our Weaves
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
                Every fabric is tested against harsh direct sunlight for zero transparency, then vetted for breathability, anti-static flow, and uncompromised modest drape.
              </p>
            </div>
            
            <Link
              href="/collections?c=hijabs"
              className="underline-grow shrink-0 pb-1 text-[12px] font-medium uppercase tracking-brand text-muted hover:text-ink"
            >
              Shop All Scarves & Silks →
            </Link>
          </div>
        </Reveal>

        {/* Interactive Weave Tabs */}
        <div className="mt-12 flex flex-wrap gap-2 border-b border-line pb-4 sm:gap-3">
          {WEAVES.map((w, i) => (
            <button
              key={w.id}
              onClick={() => setSelected(i)}
              className={`rounded-xs px-4 py-2.5 text-[11.5px] font-medium uppercase tracking-brand transition ${
                selected === i
                  ? "border border-gold bg-ink text-bone shadow-xs"
                  : "border border-line bg-bone/70 text-muted hover:border-gold/50 hover:text-ink"
              }`}
            >
              <span className="mr-2 text-gold-light">0{i + 1}</span>
              {w.name.split(" ")[0]} {w.name.split(" ")[1]}
            </button>
          ))}
        </div>

        {/* Selected Weave Showcase */}
        <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          
          {/* Left details panel */}
          <div className="space-y-6">
            <div>
              <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-gold-dark">
                {current.tag}
              </span>
              <h3 className="mt-2 font-display text-[2.2rem] font-light leading-none text-ink sm:text-[2.6rem]">
                {current.name}
              </h3>
              <p className="mt-2 text-[14px] italic text-gold-dark">
                &ldquo;{current.subtitle}&rdquo;
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                {current.description}
              </p>
            </div>

            {/* Tactile metrics grid */}
            <div className="grid grid-cols-2 gap-4 border-y border-line py-6">
              {current.attributes.map((attr) => (
                <div key={attr.label} className="space-y-1.5">
                  <div className="flex items-center justify-between pr-4 text-[11px] uppercase tracking-wider text-muted">
                    <span>{attr.label}</span>
                    <span className="text-gold-dark">{attr.score}/5</span>
                  </div>
                  <div className="h-1.5 w-full max-w-[200px] overflow-hidden rounded-full bg-sand/60">
                    <div
                      className="h-full bg-gold transition-all duration-700"
                      style={{ width: `${(attr.score / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-[12px] font-medium text-ink">{attr.value}</p>
                </div>
              ))}
            </div>

            {/* Best for & CTA */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="max-w-md">
                <span className="text-[10.5px] uppercase tracking-wider text-muted">Recommended for:</span>
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

          {/* Right image frame */}
          <div className="relative mx-auto w-full max-w-[460px]">
            <div className="group relative">
              <Corner className="absolute -bottom-4 -left-4 z-10 h-12 w-12 -scale-y-100 text-gold/70" />
              <Corner className="absolute -bottom-4 -right-4 z-10 h-12 w-12 -scale-100 text-gold/70" />

              <div className="overflow-hidden border border-line bg-sand/40 shadow-xl">
                <ArchFrame
                  src={current.image}
                  alt={current.name}
                  ratio="aspect-[4/4.8]"
                  shape="dome"
                  focus="object-top"
                  zoomOnHover
                >
                  <span className="text-[10.5px] uppercase tracking-brand text-gold-light">
                    {current.tag}
                  </span>
                  <p className="mt-1 font-display text-[1.8rem] font-light text-white">
                    {current.name}
                  </p>
                  <p className="mt-1 text-[12px] text-bone/80">
                    Daylight Opacity Verified
                  </p>
                </ArchFrame>
              </div>

              <div className="absolute -bottom-6 -left-4 hidden items-center gap-2 rounded-full border border-gold/40 bg-paper px-4 py-2 shadow-md sm:flex">
                <Star className="h-4 w-4 text-gold" />
                <span className="text-[11px] font-medium uppercase tracking-wider text-ink">
                  100% Zero-Sheer Tested
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
