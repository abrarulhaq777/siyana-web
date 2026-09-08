import Link from "next/link";
import Reveal from "@/components/Reveal";
import ArchFrame from "@/components/ArchFrame";
import { Crescent, Corner, Star } from "@/components/Ornament";

const MOMENTS = [
  {
    number: "01",
    label: "Sacred Hours",
    title: "Quiet Reverence & Jummah",
    subtitle: "Fluid coverage for prayer, contemplation & family mornings",
    description:
      "Floor-sweeping silhouettes in washed organic cotton and weightless Japanese Nida. Tailored with generous room for effortless sujud, tahajjud, and peaceful Friday prayers without clinging.",
    image: "/images/categories/prayerwear.jpg",
    silhouette: "Overhead Khimar & Flowing Open Abaya",
    href: "/collections?c=prayerwear",
    cta: "Explore Sacred Wear →",
  },
  {
    number: "02",
    label: "Executive Poise",
    title: "The Modern Studio & Boardroom",
    subtitle: "Disciplined cuts designed for 12-hour professional days",
    description:
      "Clean column lines featuring our wudu-friendly stretch cuffs that slide up the forearm effortlessly for ablution without undressing or unbuttoning. High-coverage necklines that stay immaculate.",
    image: "/images/products/iman-shirt-dress.jpg",
    silhouette: "Tailored Column Cut & Longline Tunic",
    href: "/collections?c=dresses",
    cta: "Explore Modest Workwear →",
  },
  {
    number: "03",
    label: "Celebration",
    title: "The Evening Majlis & Eid",
    subtitle: "Celebratory gold needlework and sweeping ceremonial volume",
    description:
      "Expansive farasha wings and royal kaftans hand-finished with tonal metallic embroidery along the collar and cuffs. Rich, celebratory silhouettes designed to honor modesty while radiating festive majesty.",
    image: "/images/products/zahra-kaftan.jpg",
    silhouette: "Full Farasha Wing & Royal Kaftan Sweep",
    href: "/collections?c=kaftans",
    cta: "Explore Festive Kaftans →",
  },
];

export default function OccasionsLookbook() {
  return (
    <section className="relative overflow-hidden border-y border-line bg-bone/50 py-24 lg:py-32">
      <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.022]" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        
        {/* Header */}
        <Reveal>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-gold/40 bg-paper px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
              <Crescent className="h-3 w-3 text-gold" />
              <span>The Modesty Lookbook</span>
            </div>
            <h2 className="mt-4 font-display text-[2.6rem] font-light leading-tight sm:text-[3.4rem]">
              Moments of Grace & Dignity
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Every Siyana piece is developed around how modest women actually live — from quiet Friday morning prayers to high-stakes boardrooms and joyous family Eid banquets.
            </p>
          </div>
        </Reveal>

        {/* 3 Occasion Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {MOMENTS.map((m, i) => (
            <Reveal key={m.number} delay={i * 120} from="fade">
              <div className="group relative flex h-full flex-col border border-line bg-paper transition-all duration-500 hover:border-gold/60 hover:shadow-xl">
                
                {/* Arch image top */}
                <div className="relative overflow-hidden bg-sand/30 p-4 pb-0">
                  <div className="relative overflow-hidden">
                    <ArchFrame
                      src={m.image}
                      alt={m.title}
                      ratio="aspect-[4/4.5]"
                      shape="dome"
                      focus="object-top"
                      zoomOnHover
                    >
                      <div className="flex items-center justify-between text-bone">
                        <span className="rounded-full bg-black/40 px-2.5 py-0.5 text-[10px] uppercase tracking-brand backdrop-blur-sm">
                          {m.label}
                        </span>
                        <span className="font-display text-[1.4rem] text-gold-light">{m.number}</span>
                      </div>
                    </ArchFrame>
                  </div>
                </div>

                {/* Content body */}
                <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-dark">
                      {m.label}
                    </span>
                    <h3 className="mt-1.5 font-display text-[1.8rem] leading-tight text-ink">
                      {m.title}
                    </h3>
                    <p className="mt-1 text-[12.5px] italic text-muted">
                      {m.subtitle}
                    </p>
                    <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
                      {m.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-line/70 pt-5">
                    <div className="mb-4">
                      <span className="block text-[10px] uppercase tracking-wider text-muted">Signature Cut:</span>
                      <span className="text-[12.5px] font-medium text-ink">{m.silhouette}</span>
                    </div>

                    <Link
                      href={m.href}
                      className="inline-flex items-center gap-2 text-[11.5px] font-medium uppercase tracking-brand text-ink transition group-hover:text-gold-dark"
                    >
                      <span>{m.cta}</span>
                    </Link>
                  </div>
                </div>

              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
