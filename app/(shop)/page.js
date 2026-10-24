import Link from "next/link";
import Reveal from "@/components/Reveal";
import ArchFrame from "@/components/ArchFrame";
import ProductCard from "@/components/ProductCard";
import ProductMedia from "@/components/ProductMedia";
import HeroSection from "@/components/HeroSection";
import CategoryArcade from "@/components/CategoryArcade";
import OccasionEdit from "@/components/OccasionEdit";
import FabricStudio from "@/components/FabricStudio";
import StyleLookbook from "@/components/StyleLookbook";
import WhySiyana from "@/components/WhySiyana";
import FaqSection from "@/components/FaqSection";
import { Rosette, Star, Crescent, Lantern, Corner, Divider, Scallop } from "@/components/Ornament";
import { inr } from "@/lib/products";
import { getContent } from "@/lib/content";
import { LOOKBOOK_SLUGS, OCCASIONS, WEAVES, SHOWCASE_SLUGS } from "@/lib/showcase";
import { getCategories, getProductsBySlugs, getRecentProducts } from "@/lib/catalog";
import db from "@/lib/db";
import { Product } from "@/lib/models";

export default async function Home() {
  const cms = await getContent();

  const showRecentArrivals = cms.newArrivals?.autoRecent !== false;
  const arrivalsPromise = showRecentArrivals
    ? getRecentProducts({
        limit: cms.newArrivals?.limit || 8,
        fallbackSlugs: cms.newArrivals?.products || [],
      })
    : getProductsBySlugs(cms.newArrivals?.products || []);

  await db();
  const [categoryRows, arrivals, capsule, staples, totalProducts, counts, showcase] = await Promise.all([
    getCategories(),
    arrivalsPromise,
    getProductsBySlugs(cms.capsule.products),
    getProductsBySlugs(cms.staples.products),
    Product.countDocuments({ active: true }),
    Product.aggregate([{ $match: { active: true } }, { $group: { _id: "$category", n: { $sum: 1 } } }]),
    getProductsBySlugs(SHOWCASE_SLUGS),
  ]);

  // Editorial sections are illustrated with real products; a deleted or hidden one simply drops out.
  const bySlug = Object.fromEntries(showcase.map((p) => [p.slug, p]));
  const pick = (slugs) => Object.fromEntries(slugs.filter((s) => bySlug[s]).map((s) => [s, bySlug[s]]));

  const perCategory = Object.fromEntries(counts.map((r) => [r._id, r.n]));
  const categories = categoryRows.map((cat) => ({ ...cat, count: perCategory[cat.slug] ?? 0 }));

  // Order and visibility both come from the CMS, so an editor can reorder the
  // page without a deploy. Unknown ids are ignored rather than crashing.
  const sections = {
    hero: <HeroSection c={cms.hero} totalProducts={totalProducts} />,
    categories: <CategoryArcade c={cms.categories} categories={categories} />,
    newArrivals: <NewArrivals c={cms.newArrivals} items={arrivals} />,
    occasionEdit: <OccasionEdit products={pick(OCCASIONS.map((o) => o.slug))} />,
    fabricCraft: <FabricStudio products={pick(WEAVES.map((w) => w.slug))} />,
    styleLookbook: <StyleLookbook looks={LOOKBOOK_SLUGS.map((s) => bySlug[s]).filter(Boolean)} />,
    whySiyana: <WhySiyana ethos={cms.ethos} assurances={cms.assurances} />,
    faq: <FaqSection />,
    letter: <Letter c={cms.letter} />,
    // Off the default page — an editor can switch these on from Section order.
    reviews: <Voices c={cms.voices} />,
    assurances: <Assurances c={cms.assurances} />,
    capsule: <CelebrationCapsule c={cms.capsule} items={capsule} />,
    prayer: <PrayerSanctuary c={cms.prayer} />,
    staples: <Staples c={cms.staples} items={staples} />,
    gifting: <Gifting c={cms.gifting} />,
  };

  const { order, hidden } = cms.sections;
  return <>{order.filter((id) => sections[id] && !hidden.includes(id)).map((id) => (
    <div key={id}>{sections[id]}</div>
  ))}</>;
}

/* ══════════════════════════════════════════ 02 · assurances
   A quiet arcade of four promises, divided by girih stars. */

function Assurances({ c }) {
  return (
    <section className="border-y border-line bg-paper">
      <div className="mx-auto grid max-w-[1400px] gap-y-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        {c.items.map(({ title, body }, i) => (
          <Reveal key={title + i} delay={i * 90} from="fade">
            <div className={`h-full px-0 lg:px-8 ${i ? "lg:border-l lg:border-line" : "lg:pl-0"}`}>
              <Star className="h-5 w-5 text-gold" />
              <h3 className="mt-4 font-display text-[1.3rem] leading-snug text-ink">{title}</h3>
              <p className="mt-2.5 text-xs leading-relaxed text-muted">{body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════ 04 · new arrivals
   The straight shop grid. Uniform on purpose — this is the buying row. */

function NewArrivals({ c, items }) {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
          <div>
            <p className="text-[12px] uppercase tracking-brand text-muted">
              {c.eyebrow && !/autumn/i.test(c.eyebrow) ? c.eyebrow : "Signature Modesty Edit"}
            </p>
            <h2 className="mt-3 font-display text-[2.6rem] font-light leading-none">{c.heading}</h2>
            <p className="mt-3 max-w-lg text-sm text-muted">{c.body}</p>
          </div>
          <Link href="/collections" className="underline-grow pb-1 text-[12px] uppercase tracking-brand">
            View all pieces →
          </Link>
        </div>
      </Reveal>

      <div className="mt-12 grid items-stretch gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p, i) => (
          <Reveal key={p.slug} delay={i * 90}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════ 05 · celebration capsule
   Midnight and gold — the festival palette, lanterns and a rosette
   watermark. The one section that goes dark mid-page. */

function CelebrationCapsule({ c, items }) {
  return (
    <section className="relative overflow-hidden bg-midnight text-bone">
      <div className="pattern-girih-gold pointer-events-none absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-midnight-deep via-transparent to-midnight-deep" />
      <Rosette className="pointer-events-none absolute -right-24 top-10 h-96 w-96 text-gold/15" spin />

      <Lantern className="animate-sway pointer-events-none absolute left-[8%] top-0 hidden h-44 w-9 text-gold/50 lg:block" drop={20} />
      <Lantern className="animate-sway pointer-events-none absolute left-[16%] top-0 hidden h-32 w-8 text-gold/30 lg:block" drop={12} />
      <Lantern className="animate-sway pointer-events-none absolute right-[10%] top-0 hidden h-40 w-9 text-gold/40 lg:block" drop={30} />

      <div className="relative mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
        <Reveal from="fade">
          <div className="mx-auto max-w-2xl text-center">
            <Divider label={c.label} />
            <h2 className="mt-7 font-display text-[2.8rem] font-light leading-tight text-bone sm:text-[3.6rem]">
              {c.heading}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-bone/70">{c.body}</p>
          </div>
        </Reveal>

        <div className="mt-16 grid items-stretch gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p, i) => (
            <Reveal key={p.slug} delay={i * 90} from="scale">
              <ProductCard product={p} tone="dark" />
            </Reveal>
          ))}
        </div>

        <Reveal from="fade" delay={200}>
          <div className="mt-16 text-center">
            <Link
              href={c.cta.href}
              className="inline-block border border-gold/60 px-10 py-4 text-[12px] uppercase tracking-brand text-gold-light transition hover:bg-gold hover:text-midnight-deep"
            >
              {c.cta.label}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════ 08 · prayer sanctuary
   Editorial split, image bracketed by corner ornaments. */

function PrayerSanctuary({ c }) {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal from="left">
          <div className="group relative">
            <Corner className="absolute -bottom-4 -left-4 z-10 h-14 w-14 -scale-y-100 text-gold/70" />
            <Corner className="absolute -bottom-4 -right-4 z-10 h-14 w-14 -scale-100 text-gold/70" />
            <ArchFrame
              src={c.image}
              alt={c.captionTitle}
              ratio="aspect-[4/4.4]"
              focus="object-top"
              zoomOnHover
            >
              <p className="font-display text-[1.7rem] font-light italic text-white">{c.captionTitle}</p>
              <p className="mt-1 text-[11px] uppercase tracking-brand text-bone/70">{c.captionSub}</p>
            </ArchFrame>
          </div>
        </Reveal>

        <Reveal from="right" delay={120}>
          <p className="text-[12px] uppercase tracking-brand text-muted">{c.eyebrow}</p>
          <h2 className="mt-4 font-display text-[2.8rem] font-light leading-tight sm:text-[3.5rem]">
            {c.titleTop}
            <br />
            <span className="italic text-gold-dark">{c.titleAccent}</span>
          </h2>
          <p className="mt-7 text-[17px] leading-relaxed text-muted">{c.body}</p>

          <ul className="mt-9 space-y-4 border-t border-line pt-7 text-sm text-muted">
            {c.bullets.map((t) => (
              <li key={t} className="flex items-start gap-3.5">
                <Star className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              href={c.primaryCta.href}
              className="bg-ink px-8 py-4 text-[12px] uppercase tracking-brand text-bone transition hover:bg-gold-dark"
            >
              {c.primaryCta.label}
            </Link>
            <Link
              href={c.secondaryCta.href}
              className="underline-grow py-2 text-[12px] uppercase tracking-brand text-muted hover:text-ink"
            >
              {c.secondaryCta.label}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════ 10 · staples
   Editorial: one hero piece, three list rows. Not another 4-up grid. */

function Staples({ c, items }) {
  const [lead, ...rest] = items;
  if (!lead) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
          <div>
            <p className="text-[12px] uppercase tracking-brand text-muted">{c.eyebrow}</p>
            <h2 className="mt-3 font-display text-[2.6rem] font-light leading-none">{c.heading}</h2>
          </div>
          <Link href="/collections" className="underline-grow pb-1 text-[12px] uppercase tracking-brand">
            View all pieces →
          </Link>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-x-14 gap-y-12 lg:grid-cols-[0.85fr_1fr] lg:items-start">
        <Reveal from="left">
          <Link href={`/product/${lead.slug}`} className="group block">
            <ArchFrame
              src={lead.image}
              alt={lead.name}
              ratio="aspect-[4/5]"
              focus="object-top"
              zoomOnHover
            >
              <span className="text-[10.5px] uppercase tracking-brand text-gold-light">Most reached for</span>
              <h3 className="mt-1.5 font-display text-[2rem] leading-none text-bone">{lead.name}</h3>
              <p className="mt-2 text-[13px] uppercase tracking-[0.18em] text-bone/70">
                {lead.colorName} · {inr(lead.price)}
              </p>
            </ArchFrame>
          </Link>
        </Reveal>

        <ul className="divide-y divide-line border-y border-line">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 110} from="right">
              <li>
                <Link href={`/product/${p.slug}`} className="group flex items-center gap-6 py-6">
                  <div className="w-24 shrink-0">
                    <ProductMedia product={p} ratio="aspect-[3/4]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex min-h-4 items-center gap-2 text-[10.5px] uppercase tracking-[0.22em] text-gold-dark">
                      {p.tag}
                    </div>
                    <h3 className="mt-1 font-display text-[1.6rem] leading-tight text-ink transition-colors group-hover:text-gold-dark">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-[12px] uppercase tracking-[0.18em] text-muted">
                      {p.colorName} · {p.fabric}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-5">
                    <div className="text-right">
                      <p className="text-sm font-medium text-ink">{inr(p.price)}</p>
                      {p.mrp && <p className="text-xs text-muted line-through">{inr(p.mrp)}</p>}
                    </div>
                    <span className="text-[13px] text-muted transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════ 11 · gifting */

function Gifting({ c }) {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
      <Reveal from="scale">
        <div className="relative overflow-hidden border border-gold/30 bg-sand/60">
          <Scallop className="text-gold/70" />
          <Corner className="absolute left-3 top-6 h-12 w-12 text-gold/50" />
          <Corner className="absolute right-3 top-6 h-12 w-12 -scale-x-100 text-gold/50" />

          <div className="grid items-center gap-12 p-8 sm:p-14 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-[12px] uppercase tracking-brand text-muted">{c.eyebrow}</p>
              <h2 className="mt-4 font-display text-[2.6rem] font-light leading-tight sm:text-[3.2rem]">
                {c.heading}
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted">{c.body}</p>

              <ul className="mt-8 flex flex-wrap gap-3 text-[12px] uppercase tracking-[0.16em] text-muted">
                {c.chips.map((t) => (
                  <li key={t} className="flex items-center gap-2 border border-line bg-paper px-3.5 py-2">
                    <Star className="h-3 w-3 text-gold" />
                    {t}
                  </li>
                ))}
              </ul>

              <Link
                href={c.cta.href}
                className="mt-9 inline-block bg-ink px-8 py-4 text-[12px] uppercase tracking-brand text-bone transition hover:bg-gold-dark"
              >
                {c.cta.label}
              </Link>
            </div>

            <div className="group">
              <ArchFrame
                src={c.image}
                alt={c.heading}
                ratio="aspect-[4/3.6]"
                shape="sm"
                focus="object-center"
                scrim={false}
                zoomOnHover
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ══════════════════════════════════════════ 13 · voices */

function Voices({ c }) {
  return (
    <section className="relative mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
      <Reveal from="fade">
        <Divider label={c.label} />
        <h2 className="mt-7 text-center font-display text-[2.6rem] font-light leading-none sm:text-[3.2rem]">
          {c.heading}
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-10 lg:grid-cols-3">
        {c.items.map(({ quote, name, city }, i) => (
          <Reveal key={name + i} delay={i * 110} from="scale">
            <figure className="arch-sm flex h-full flex-col border border-line bg-paper px-8 pb-8 pt-14 text-center">
              <div className="flex justify-center gap-1 text-gold">
                {Array.from({ length: 5 }, (_, n) => (
                  <Star key={n} className="h-3 w-3" />
                ))}
              </div>
              <blockquote className="mt-6 flex-1 font-display text-[1.35rem] leading-snug text-ink/90">
                “{quote}”
              </blockquote>
              <figcaption className="mt-8 flex items-center justify-between border-t border-line pt-5 text-[12px] uppercase tracking-brand text-muted">
                <span>{name}</span>
                <span className="text-gold-dark">{city}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════ 14 · letter */

function Letter({ c }) {
  return (
    <section className="mx-auto max-w-[1400px] px-6 pb-20 lg:px-10">
      <Reveal from="scale">
        <div className="arch-sm relative overflow-hidden border border-line bg-sand/70 px-6 py-20 text-center sm:px-16">
          <div className="pattern-girih absolute inset-0 opacity-[0.05]" />
          <Rosette className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 text-gold/15" spin />
          <Rosette className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 text-gold/15" spin />

          <div className="relative mx-auto max-w-lg">
            <Crescent className="mx-auto h-6 w-6 text-gold" />
            <h2 className="mt-6 font-display text-[2.4rem] font-light leading-none">{c.heading}</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">{c.body}</p>

            <form className="mt-9 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="news" className="sr-only">Email address</label>
              <input
                id="news"
                type="email"
                required
                placeholder={c.placeholder}
                className="flex-1 border-b border-ink/25 bg-transparent px-2 py-3 text-sm outline-none placeholder:text-muted focus:border-gold"
              />
              <button className="bg-ink px-8 py-4 text-[12px] uppercase tracking-brand text-bone shadow-sm transition hover:bg-gold-dark">
                {c.button}
              </button>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
