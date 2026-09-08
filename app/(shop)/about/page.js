import Link from "next/link";
import ArchFrame from "@/components/ArchFrame";
import Reveal from "@/components/Reveal";
import { Crescent, Star, Corner, Scallop, Rosette } from "@/components/Ornament";

export const metadata = {
  title: "Our Story & Modesty Vision — Siyana",
  description:
    "Discover the House of Siyana. Handcrafted modest garments in Japanese Nida, washed linen, and Korean crepe. Certified 100% opaque, wudu-friendly tailoring, and ethical small-batch craft.",
};

export default function AboutPage() {
  return (
    <div className="bg-bone/40 pb-24">
      
      {/* ── 01 · Hero Section · Editorial Atelier Split ── */}
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-paper/90 via-paper/50 to-bone/30 py-16 lg:py-24">
        <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.035]" />
        
        {/* Soft Ambient Radiance */}
        <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-gold/10 blur-[120px]" />

        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            
            {/* Left Column · Editorial Heritage & Craft Narrative (7 cols) */}
            <Reveal from="left" className="lg:col-span-7">
              {/* Sacred Arabic Seal & Tag */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-arabic text-[19px] text-gold-dark" dir="rtl">
                  دار الصيانة للأزياء الراقية
                </span>
                <span className="h-3 w-px bg-gold/40" />
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-bone/80 px-3.5 py-1 shadow-2xs backdrop-blur-xs">
                  <Star className="h-3 w-3 text-gold-dark" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-ink">
                    The Modesty Atelier · Est. 2024
                  </span>
                </div>
              </div>

              {/* Editorial Title */}
              <h1 className="mt-6 font-display text-[3.2rem] font-light leading-[1.02] text-ink sm:text-[4.4rem] lg:text-[4.8rem]">
                The Sacred Art of
                <br />
                <span className="italic font-normal text-gold-dark">grace & covering.</span>
              </h1>

              {/* Story Lead */}
              <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-muted sm:text-[17px]">
                Siyana was born out of an uncompromising conviction: that modesty is not a restriction to conceal around, but an elevated art of living with poise, quiet confidence, and serene spiritual peace.
              </p>

              {/* Atelier Pillars Matrix */}
              <div className="mt-8 grid grid-cols-3 gap-3 border-y border-line/80 py-5 sm:gap-4">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-gold-dark">Fabric Standard</span>
                  <p className="font-display text-[15px] font-medium text-ink">Osaka Nida</p>
                  <p className="text-[11px] text-muted leading-tight">100% Zero-Sheer Tested</p>
                </div>
                <div className="space-y-1 border-x border-line/60 px-3 sm:px-4">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-gold-dark">Engineering</span>
                  <p className="font-display text-[15px] font-medium text-ink">Wudu Cuffs</p>
                  <p className="text-[11px] text-muted leading-tight">Effortless Forearm Slide</p>
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-gold-dark">Philosophy</span>
                  <p className="font-display text-[15px] font-medium text-ink">Small Batches</p>
                  <p className="text-[11px] text-muted leading-tight">Mindful Tailored Drops</p>
                </div>
              </div>

              {/* Founder's Motto Quote Card */}
              <div className="mt-7 flex items-center gap-4 rounded-xs border border-gold/25 bg-gold/[0.04] p-4">
                <Crescent className="h-6 w-6 shrink-0 text-gold-dark" />
                <p className="text-[13px] italic leading-snug text-ink/90 sm:text-[14px]">
                  &ldquo;Every seam is cut with the intention that modest wear should elevate your daily worship and your everyday stride equally.&rdquo;
                </p>
              </div>
            </Reveal>

            {/* Right Column · Sacred Mihrab Arch Portal Visual (5 cols) */}
            <Reveal from="right" delay={150} className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
              {/* Outer Decorative Mihrab Frame */}
              <div className="relative p-2 sm:p-3">
                
                {/* Traditional Mihrab Arch Portal */}
                <div className="relative overflow-hidden rounded-t-[140px] rounded-b-[4px] border border-gold/40 bg-sand/30 p-2 shadow-2xl">
                  <ArchFrame
                    src="/images/hero/hero-siyana.jpg"
                    alt="House of Siyana Atelier Craftsmanship"
                    ratio="aspect-[4/5.2]"
                    shape="arch"
                    focus="object-[50%_25%]"
                  >
                    {/* Floating Luxury Caption Overlay */}
                    <div className="flex flex-col justify-end p-5 text-bone sm:p-6">
                      <div className="rounded-xs border border-white/20 bg-ink/75 p-3.5 backdrop-blur-md">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9.5px] uppercase tracking-[0.2em] text-gold-light">
                            Atelier Craft
                          </span>
                          <span className="font-arabic text-[13px] text-gold-light">صناعة يدوية</span>
                        </div>
                        <p className="mt-1 font-display text-[1.2rem] font-light italic text-white">
                          Tailored with reverence & patience.
                        </p>
                        <p className="mt-1 text-[10.5px] tracking-wider text-bone/75">
                          Osaka Japanese Nida • French-seamed finish
                        </p>
                      </div>
                    </div>
                  </ArchFrame>
                </div>

                {/* Floating Corner Star Accents */}
                <Corner className="absolute -top-1 -left-1 z-10 h-10 w-10 text-gold/60" />
                <Corner className="absolute -top-1 -right-1 z-10 h-10 w-10 -scale-x-100 text-gold/60" />
                <Corner className="absolute -bottom-1 -left-1 z-10 h-10 w-10 -scale-y-100 text-gold/60" />
                <Corner className="absolute -bottom-1 -right-1 z-10 h-10 w-10 -scale-100 text-gold/60" />
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ── 02 · The 3 Modesty Vows ── */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
        <Reveal from="fade" className="text-center">
          <p className="text-[11px] uppercase tracking-brand text-muted">The Uncompromising Standard</p>
          <h2 className="mt-3 font-display text-[2.4rem] font-light leading-none sm:text-[3rem]">
            Three Vows in Every Garment
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal delay={0} from="up">
            <div className="h-full border border-line bg-paper p-8 shadow-xs transition hover:border-gold/50">
              <div className="grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold-dark">
                {/* Sun & Light Opacity Shield Icon */}
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-gold-dark" fill="none" stroke="currentColor" strokeWidth="1.35">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="mt-6 font-display text-[1.6rem] leading-snug text-ink">
                100% Zero-Sheer Certified
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">
                Every bolt of Japanese Nida, washed linen, and Korean crepe is placed against direct midday high sunlight. If a single ray shows through, the cloth never enters our cutting room. You never need to worry about slip layers or accidental translucency.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120} from="up">
            <div className="h-full border border-line bg-paper p-8 shadow-xs transition hover:border-gold/50">
              <div className="grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold-dark">
                {/* Sacred Water Droplet / Ablution Flow Icon */}
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-gold-dark" fill="none" stroke="currentColor" strokeWidth="1.35">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 13.5a3 3 0 0 0 3 3" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="mt-6 font-display text-[1.6rem] leading-snug text-ink">
                Wudu-Centric Engineering
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">
                Ablution should never require struggling with tiny buttons or disrobing in public powder rooms. Our cuffs feature concealed stretch smocking or discreet snap fastenings that slide up past the elbow in one smooth motion.
              </p>
            </div>
          </Reveal>

          <Reveal delay={240} from="up">
            <div className="h-full border border-line bg-paper p-8 shadow-xs transition hover:border-gold/50">
              <div className="grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold-dark">
                {/* Master Artisan Tailor Shears Icon */}
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-gold-dark" fill="none" stroke="currentColor" strokeWidth="1.35">
                  <circle cx="6" cy="6" r="3" />
                  <circle cx="6" cy="18" r="3" />
                  <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="mt-6 font-display text-[1.6rem] leading-snug text-ink">
                Mindful Small Batches
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">
                We reject hyper-fast fashion and disposable synthetic textiles. Every Siyana collection is produced in limited numbers with ethical master artisans who take pride in hand-rolled hems, reinforced seams, and enduring heirloom craft.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Scallop className="text-gold" />

      {/* ── 03 · The Materials & Master Tailoring ── */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          
          <Reveal from="left" className="relative mx-auto w-full max-w-lg">
            <div className="overflow-hidden border border-line bg-sand/30 shadow-xl">
              <ArchFrame
                src="/images/categories/kaftans.jpg"
                alt="Artisan embroidery"
                ratio="aspect-[4/4.8]"
                shape="dome"
                focus="object-top"
              >
                <p className="font-display text-[1.8rem] font-light text-white">Heirloom Handcraft</p>
                <p className="text-[11px] uppercase tracking-brand text-bone/80">Tonal metallic gold threads</p>
              </ArchFrame>
            </div>
            <Corner className="absolute -bottom-4 -left-4 z-10 h-12 w-12 -scale-y-100 text-gold/70" />
            <Corner className="absolute -bottom-4 -right-4 z-10 h-12 w-12 -scale-100 text-gold/70" />
          </Reveal>

          <Reveal from="right" delay={100} className="space-y-6">
            <span className="text-[11px] uppercase tracking-brand text-muted">The Artisan Weave</span>
            <h2 className="font-display text-[2.6rem] font-light leading-tight text-ink sm:text-[3.2rem]">
              Cloth Chosen for the Way It Falls
            </h2>
            <p className="text-[15px] leading-relaxed text-muted">
              We travel to specialized spinning mills to source yarns specifically engineered for modest silhouettes. Japanese Nida offers a whisper-quiet drop that cascades cleanly from shoulder to hem, never clinging to the hips or calves.
            </p>
            <p className="text-[15px] leading-relaxed text-muted">
              Our desert-washed organic linens breathe effortlessly in high humidity, and our cloud-soft Austrian beechwood modals drape securely around the face with zero need for metal pins.
            </p>

            <div className="pt-4">
              <Link
                href="/collections"
                className="inline-flex items-center gap-3 bg-ink px-8 py-3.5 text-[12px] font-medium uppercase tracking-brand text-bone shadow-sm transition hover:bg-gold-dark"
              >
                <span>Explore The Collections</span>
                <span>→</span>
              </Link>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ── 04 · Founder Note & Invitation ── */}
      <section className="border-t border-line bg-paper py-24">
        <Reveal from="scale" className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <Rosette className="mx-auto h-12 w-12 text-gold/60" />
          <h2 className="mt-6 font-display text-[2.4rem] font-light leading-snug text-ink sm:text-[2.8rem]">
            A Sanctuary of Quiet Confidence
          </h2>
          <p className="mt-5 text-[15.5px] leading-relaxed text-muted">
            &ldquo;We created Siyana because we grew tired of layering see-through abayas, fixing slipping hijabs during prayers, or compromising our faith for modern style. Siyana is our gift to every woman who walks with dignity.&rdquo;
          </p>
          <p className="mt-6 text-[12px] uppercase tracking-[0.2em] text-ink font-medium">
            The Siyana Collective
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/collections"
              className="bg-ink px-8 py-3.5 text-[12px] font-medium uppercase tracking-brand text-bone transition hover:bg-gold-dark"
            >
              Shop Current Capsule
            </Link>
            <Link
              href="/contact"
              className="border border-line bg-bone px-7 py-3.5 text-[12px] font-medium uppercase tracking-brand text-ink transition hover:border-gold"
            >
              Contact Our Concierge
            </Link>
          </div>
        </Reveal>
      </section>

    </div>
  );
}
