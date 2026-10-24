import Link from "next/link";
import ArchFrame from "@/components/ArchFrame";
import MihrabFrame from "@/components/MihrabFrame";
import Reveal from "@/components/Reveal";
import { Crescent, Star, Corner, Scallop, Rosette, Divider } from "@/components/Ornament";
import { BRAND, COLLECTION, WHY } from "@/lib/brand";
import { getKey } from "@/lib/content";
import { getProductsBySlugs } from "@/lib/catalog";

export const metadata = {
  title: "About Us",
  description:
    "Siyana Daily Modesty — premium modest wear for the modern woman. Co-ord sets, elegant maxi dresses, imported denim and beautifully detailed outfits. Where modesty meets timeless elegance.",
};

export default async function AboutPage() {
  const [hero, products] = await Promise.all([getKey("hero"), getProductsBySlugs(COLLECTION.map((c) => c.slug))]);
  const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));
  const heroImage = hero.slides?.[0]?.image || hero.image;

  return (
    <div className="bg-bone/40 pb-24">
      {/* ── 01 · Where modesty meets timeless elegance ── */}
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-paper/90 via-paper/50 to-bone/30 py-16 lg:py-24">
        <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.035]" />
        <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-gold/10 blur-[120px]" />

        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal from="left" className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-bone/80 px-3.5 py-1 shadow-2xs backdrop-blur-xs">
                <Star className="h-3 w-3 text-gold-dark" />
                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-ink">{BRAND.name}</span>
              </div>

              <h1 className="mt-6 font-display text-[3.2rem] font-light leading-[1.02] text-ink sm:text-[4.4rem] lg:text-[4.8rem]">
                Where modesty meets
                <br />
                <span className="italic font-normal text-gold-dark">timeless elegance.</span>
              </h1>

              <p className="mt-5 text-[12px] uppercase tracking-brand text-muted">{BRAND.promise}</p>

              {BRAND.intro.map((p) => (
                <p key={p.slice(0, 24)} className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted sm:text-[17px]">
                  {p}
                </p>
              ))}

              <div className="mt-8 flex items-center gap-4 rounded-xs border border-gold/25 bg-gold/[0.04] p-4">
                <Crescent className="h-6 w-6 shrink-0 text-gold-dark" />
                <p className="font-display text-[1.25rem] italic leading-snug text-ink/90">{BRAND.motto}</p>
              </div>
            </Reveal>

            <Reveal from="right" delay={150} className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
              <div className="relative p-2 sm:p-3">
                <div className="relative overflow-hidden rounded-t-[140px] rounded-b-[4px] border border-gold/40 bg-sand/30 p-2 shadow-2xl">
                  <ArchFrame src={heroImage} alt={BRAND.name} ratio="aspect-[4/5.2]" shape="arch" focus="object-[50%_25%]">
                    <p className="font-display text-[1.6rem] font-light italic text-white">{BRAND.elegance.heading}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-brand text-bone/80">{BRAND.promise}</p>
                  </ArchFrame>
                </div>
                <Corner className="absolute -top-1 -left-1 z-10 h-10 w-10 text-gold/60" />
                <Corner className="absolute -top-1 -right-1 z-10 h-10 w-10 -scale-x-100 text-gold/60" />
                <Corner className="absolute -bottom-1 -left-1 z-10 h-10 w-10 -scale-y-100 text-gold/60" />
                <Corner className="absolute -bottom-1 -right-1 z-10 h-10 w-10 -scale-100 text-gold/60" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 02 · Fashion that reflects your elegance ── */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-10">
        <Reveal from="fade">
          <Divider label="Our Promise" />
          <h2 className="mt-7 font-display text-[2.4rem] font-light leading-tight sm:text-[3rem]">{BRAND.elegance.heading}</h2>
          <p className="mt-6 text-[16px] leading-relaxed text-muted">{BRAND.elegance.body}</p>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Whether you are dressing for a casual outing, a day with friends, a family gathering, or a special occasion, our collection offers stylish choices for different moments in your life.
          </p>
        </Reveal>
      </section>

      <Scallop className="text-gold" />

      {/* ── 03 · Our collection ── */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
        <Reveal from="fade" className="text-center">
          <p className="text-[11px] uppercase tracking-brand text-muted">Our Collection</p>
          <h2 className="mt-3 font-display text-[2.4rem] font-light leading-none sm:text-[3rem]">Curated for the modern woman</h2>
        </Reveal>

        <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-5">
          {COLLECTION.map((c, i) => {
            const p = bySlug[c.slug];
            return (
              <Reveal key={c.title} delay={i * 90}>
                <Link href={c.href} className="group block">
                  {p && (
                    <MihrabFrame src={p.image} alt={c.title} />
                  )}
                  <h3 className="mt-6 font-display text-[1.5rem] leading-tight text-ink transition-colors group-hover:text-gold-dark">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{c.body}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-brand text-muted transition-colors group-hover:text-ink">
                    Explore <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── 04 · Our philosophy ── */}
      <section className="relative overflow-hidden bg-ink py-24 text-bone">
        <div className="pattern-girih-gold pointer-events-none absolute inset-0 opacity-20" />
        <Rosette className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 text-gold/10" spin />
        <Reveal from="fade" className="relative mx-auto max-w-3xl px-6 text-center">
          <Divider label="Our Philosophy" />
          <p className="mt-9 font-display text-[1.9rem] font-light leading-[1.35] text-bone/95 sm:text-[2.4rem]">{BRAND.philosophy[0]}</p>
          <div className="mx-auto mt-10 h-px w-20 bg-gold" />
          {BRAND.philosophy.slice(1).map((p) => (
            <p key={p.slice(0, 24)} className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-bone/70">
              {p}
            </p>
          ))}
        </Reveal>
      </section>

      {/* ── 05 · Why choose Siyana ── */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
        <Reveal from="fade" className="text-center">
          <p className="text-[11px] uppercase tracking-brand text-muted">Why Choose</p>
          <h2 className="mt-3 font-display text-[2.4rem] font-light leading-none sm:text-[3rem]">{BRAND.name}?</h2>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={(i % 3) * 110}>
              <div className="arch-sm h-full border border-line bg-paper px-8 pb-9 pt-14 text-center transition hover:border-gold/50">
                <Star className="mx-auto h-6 w-6 text-gold" />
                <h3 className="mt-5 font-display text-[1.6rem] leading-snug text-ink">{w.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-muted">{w.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 06 · Discover your everyday elegance ── */}
      <section className="border-t border-line bg-paper py-24">
        <Reveal from="scale" className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <Rosette className="mx-auto h-12 w-12 text-gold/60" />
          <h2 className="mt-6 font-display text-[2.4rem] font-light leading-snug text-ink sm:text-[2.8rem]">{BRAND.closing.heading}</h2>
          <p className="mt-5 text-[15.5px] leading-relaxed text-muted">{BRAND.closing.body}</p>
          <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{BRAND.closing.cta}</p>
          <p className="mt-8 font-display text-[1.3rem] italic text-gold-dark">
            {BRAND.name} — {BRAND.motto}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/collections"
              className="bg-ink px-8 py-3.5 text-[12px] font-medium uppercase tracking-brand text-bone transition hover:bg-gold-dark"
            >
              Explore the Collections
            </Link>
            <a
              href={BRAND.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-line bg-bone px-7 py-3.5 text-[12px] font-medium uppercase tracking-brand text-ink transition hover:border-gold"
            >
              Follow {BRAND.instagram.handle}
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
