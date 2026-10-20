import Link from "next/link";
import Reveal from "./Reveal";
import ArchFrame from "./ArchFrame";
import { Crescent, Star } from "./Ornament";

/*
 * Editorial collage, not a grid: three columns of unequal width and height,
 * each frame cut to a different arch so the page reads like a walk through a courtyard.
 */
const LOOKS = {
  courtyard: { n: "01", src: "/images/hero/hero-siyana.jpg", title: "The courtyard abaya", note: "Black Nida · open front · tonal belt" },
  jersey: { n: "02", src: "/images/products/sidra-jersey-hijab.jpg", title: "Matte jersey hijab", note: "Pin-free wrap" },
  shawl: { n: "03", src: "/images/products/rida-georgette-shawl.jpg", title: "Champagne georgette", note: "Worn loose over black" },
  pleat: { n: "04", src: "/images/products/rahma-pleat-dress.jpg", title: "Pleated sage", note: "Column dress" },
  linen: { n: "05", src: "/images/products/layl-linen-abaya.jpg", title: "Washed olive linen", note: "Button-through abaya" },
};

function Caption({ look }) {
  return (
    <>
      <span className="text-[10.5px] uppercase tracking-brand text-gold-light">Look {look.n}</span>
      <p className="mt-1 font-display text-[1.6rem] font-light leading-tight text-white">{look.title}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-bone/70">{look.note}</p>
    </>
  );
}

function SmallLook({ look }) {
  return (
    <Link href="/collections" className="group block">
      <ArchFrame src={look.src} alt={look.title} ratio="aspect-[3/4]" focus="object-top" scrim={false} zoomOnHover />
      <p className="mt-3 text-[10.5px] uppercase tracking-brand text-gold-dark">Look {look.n}</p>
      <p className="mt-0.5 font-display text-[1.2rem] leading-tight text-ink">{look.title}</p>
    </Link>
  );
}

export default function StyleLookbook() {
  return (
    <section className="relative mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-28">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <Reveal from="left" className="lg:col-span-5">
          <Link href="/collections" className="group block">
            <ArchFrame
              src={LOOKS.courtyard.src}
              alt={LOOKS.courtyard.title}
              ratio="aspect-[3/4.8]"
              shape="dome"
              focus="object-[50%_30%]"
              zoomOnHover
            >
              <Caption look={LOOKS.courtyard} />
            </ArchFrame>
          </Link>
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-1 lg:pt-16">
          <Reveal delay={120}>
            <div className="arch-sm relative overflow-hidden border border-gold/30 bg-sand/60 px-7 pb-8 pt-14 text-center">
              <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.05]" />
              <div className="relative">
                <Crescent className="mx-auto h-6 w-6 text-gold" />
                <p className="mt-5 text-[11px] uppercase tracking-brand text-muted">The Courtyard Lookbook</p>
                <h2 className="mt-3 font-display text-[2.2rem] font-light leading-[1.05]">
                  Light, stone &amp; <span className="italic text-gold-dark">a quiet hem</span>
                </h2>
                <p className="mt-4 text-[13px] leading-relaxed text-muted">
                  Five looks shot between the arches — how our pieces move in daylight, layered the way you actually wear them.
                </p>
                <Link
                  href="/collections"
                  className="mt-6 inline-block bg-ink px-6 py-3.5 text-[11.5px] uppercase tracking-brand text-bone transition hover:bg-gold-dark"
                >
                  Shop the looks
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <Link href="/collections" className="group block">
              <ArchFrame src={LOOKS.jersey.src} alt={LOOKS.jersey.title} ratio="aspect-[3/3.6]" shape="sm" focus="object-top" zoomOnHover>
                <Caption look={LOOKS.jersey} />
              </ArchFrame>
            </Link>
          </Reveal>
        </div>

        <div className="lg:col-span-4">
          <Reveal from="right" delay={160}>
            <Link href="/collections" className="group block">
              <ArchFrame src={LOOKS.shawl.src} alt={LOOKS.shawl.title} ratio="aspect-[4/4.6]" focus="object-top" zoomOnHover>
                <Caption look={LOOKS.shawl} />
              </ArchFrame>
            </Link>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-5">
            <Reveal delay={240}>
              <SmallLook look={LOOKS.pleat} />
            </Reveal>
            <Reveal delay={320}>
              <SmallLook look={LOOKS.linen} />
            </Reveal>
          </div>
        </div>
      </div>

      <Reveal from="fade">
        <p className="mt-16 flex items-center justify-center gap-4 text-center text-[11px] uppercase tracking-brand text-muted">
          <Star className="h-3.5 w-3.5 text-gold" />
          Every look is fully opaque, wudu-friendly and cut to the ankle
          <Star className="h-3.5 w-3.5 text-gold" />
        </p>
      </Reveal>
    </section>
  );
}
