import Link from "next/link";
import Reveal from "@/components/Reveal";
import ArchFrame from "@/components/ArchFrame";
import ProductCard from "@/components/ProductCard";
import ProductMedia from "@/components/ProductMedia";
import { Rosette, Star, Crescent, Lantern, Corner, Divider, Scallop } from "@/components/Ornament";
import { inr } from "@/lib/products";
import { getContent } from "@/lib/content";
import { getCategories, getProductsBySlugs } from "@/lib/catalog";

export default async function Home() {
  const cms = await getContent();

  const [categories, arrivals, capsule, staples] = await Promise.all([
    getCategories(),
    getProductsBySlugs(cms.newArrivals.products),
    getProductsBySlugs(cms.capsule.products),
    getProductsBySlugs(cms.staples.products),
  ]);

  // Order and visibility both come from the CMS, so an editor can reorder the
  // page without a deploy. Unknown ids are ignored rather than crashing.
  const sections = {
    hero: <Hero c={cms.hero} />,
    assurances: <Assurances c={cms.assurances} />,
    categories: <Silhouettes c={cms.categories} categories={categories} />,
    newArrivals: <NewArrivals c={cms.newArrivals} items={arrivals} />,
    capsule: <CelebrationCapsule c={cms.capsule} items={capsule} />,
    fabrics: <FabricTable />,
    cuts: <CutStandard />,
    prayer: <PrayerSanctuary c={cms.prayer} />,
    ethos: <Ethos c={cms.ethos} />,
    staples: <Staples c={cms.staples} items={staples} />,
    gifting: <Gifting c={cms.gifting} />,
    craft: <Craft />,
    voices: <Voices c={cms.voices} />,
    letter: <Letter c={cms.letter} />,
  };

  const { order, hidden } = cms.sections;
  return <>{order.filter((id) => sections[id] && !hidden.includes(id)).map((id) => (
    <div key={id}>{sections[id]}</div>
  ))}</>;
}

/* ══════════════════════════════════════════════════════════ 01 · hero
   Asymmetric split under an onion dome, flanked by hanging lanterns. */

function Hero({ c }) {
  return (
    <section className="relative">
      <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.035]" />

      {/* Lanterns hang from the top edge, as in classical Eid mastheads */}
      <Lantern className="animate-sway pointer-events-none absolute left-[3%] top-0 hidden h-52 w-14 text-gold/70 xl:block" drop={26} />
      <Lantern
        className="animate-sway pointer-events-none absolute left-[9%] top-0 hidden h-36 w-11 text-gold/45 xl:block"
        drop={12}
        style={{ animationDelay: "1.4s" }}
      />

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-14 px-6 pb-20 pt-12 lg:grid-cols-[1fr_0.92fr] lg:gap-16 lg:px-10 lg:pt-16">
        <Reveal from="left">
          <span className="inline-flex items-center gap-3 border border-gold/40 bg-paper/70 px-4 py-2 backdrop-blur-xs">
            <Crescent className="h-3.5 w-3.5 text-gold" />
            <span className="text-[11px] uppercase tracking-brand text-muted">{c.eyebrow}</span>
          </span>

          <h1 className="mt-8 font-display text-[3.4rem] font-light leading-[0.98] text-ink sm:text-[4.6rem] lg:text-[5.4rem]">
            {c.titleTop}
            <br />
            <span className="italic font-normal text-gold-dark">{c.titleAccent}</span>
          </h1>

          <p className="mt-7 max-w-lg text-[17px] leading-relaxed text-muted">{c.body}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={c.primaryCta.href}
              className="group relative bg-ink px-9 py-4 text-[12px] font-medium uppercase tracking-brand text-bone shadow-sm transition hover:bg-gold-dark"
            >
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5">
                <span className="animate-pulse-ring absolute inset-0 rounded-full bg-gold" />
                <span className="absolute inset-0 rounded-full bg-gold" />
              </span>
              {c.primaryCta.label}
            </Link>
            <Link
              href={c.secondaryCta.href}
              className="border border-line bg-paper px-7 py-4 text-[12px] font-medium uppercase tracking-brand text-ink transition hover:border-gold"
            >
              {c.secondaryCta.label}
            </Link>
            <Link
              href={c.tertiaryCta.href}
              className="underline-grow py-2 text-[12px] font-medium uppercase tracking-brand text-muted hover:text-ink"
            >
              {c.tertiaryCta.label}
            </Link>
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-5 border-t border-line pt-6">
            {c.stats.map((stat, i) => (
              <div key={stat.k + i} className={i ? "border-l border-line pl-4" : ""}>
                <dt className="whitespace-nowrap text-[12.5px] font-semibold uppercase tracking-[0.1em] text-ink">{stat.k}</dt>
                <dd className="mt-1.5 text-[11px] uppercase leading-relaxed tracking-[0.08em] text-muted">{stat.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal from="scale" delay={140}>
          <div className="group relative">
            {/* Gold hairline that traces the dome, sitting just outside the mask */}
            <svg
              viewBox="0 0 100 140"
              preserveAspectRatio="none"
              className="pointer-events-none absolute -inset-x-2 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)] text-gold/50"
              aria-hidden="true"
            >
              <path
                className="animate-trace"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.4"
                vectorEffect="non-scaling-stroke"
                d="M0 140 V70 C0 44 14 40 34 20 C40 13 46 6 50 0 c4 6 10 13 16 20 20 20 34 24 34 50 V140"
              />
            </svg>

            <ArchFrame
              src={c.image}
              alt={c.captionTitle}
              ratio="aspect-[4/4.6]"
              shape="dome"
              focus="object-[50%_30%]"
              kenburns
              frame={false}
            >
              <p className="max-w-[72%] font-display text-[2.1rem] font-light italic leading-tight text-white">
                {c.captionTitle}
              </p>
              <p className="mt-2 max-w-[68%] text-[11.5px] font-medium uppercase tracking-brand text-bone/80">{c.captionSub}</p>
            </ArchFrame>

            {/* Light falling across the arch, with motes drifting up through it */}
            <div className="dome pointer-events-none absolute inset-0 overflow-hidden">
              <div className="animate-lightfall absolute -top-1/4 left-0 h-[150%] w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              {[
                { l: "22%", b: "18%", d: "0s" },
                { l: "48%", b: "10%", d: "1.8s" },
                { l: "68%", b: "24%", d: "3.4s" },
                { l: "36%", b: "32%", d: "5.1s" },
              ].map((m) => (
                <span
                  key={m.d}
                  className="animate-drift absolute h-1 w-1 rounded-full bg-gold-light/80"
                  style={{ left: m.l, bottom: m.b, animationDelay: m.d }}
                />
              ))}
            </div>

            <Corner className="absolute -bottom-4 -left-4 z-10 h-14 w-14 -scale-y-100 text-gold/60" />
            <Corner className="absolute -bottom-4 -right-4 z-10 h-14 w-14 -scale-100 text-gold/60" />

            {/* Rosette seal, clear of the dome's curved shoulders */}
            <div className="absolute -bottom-8 right-6 hidden h-32 w-32 place-items-center rounded-full border border-gold/40 bg-paper shadow-lg sm:grid">
              <Rosette className="absolute h-28 w-28 text-gold/35" spin />
              <span className="relative text-center">
                <span className="block font-display text-[2.1rem] leading-none text-gold-dark">17</span>
                <span className="mt-1 block text-[9.5px] font-medium uppercase tracking-brand text-muted">Pieces</span>
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      <Scallop className="text-gold" />
    </section>
  );
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

/* ══════════════════════════════════════════ 03 · categories
   Staggered mosaic — the middle column drops, so the row reads as
   an arcade of arches rather than a flat table of boxes. */

function Silhouettes({ c, categories }) {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
      <Reveal>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-[12px] uppercase tracking-brand text-muted">{c.eyebrow}</p>
            <h2 className="mt-4 font-display text-[2.6rem] font-light leading-none sm:text-[3.4rem]">
              {c.heading}
            </h2>
          </div>
          <Link
            href="/collections"
            className="underline-grow shrink-0 pb-1 text-[12px] uppercase tracking-brand text-muted hover:text-ink"
          >
            View all {categories.length} collections →
          </Link>
        </div>
      </Reveal>

      <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => (
          <Reveal key={cat.slug} delay={(i % 3) * 110} className={i % 3 === 1 ? "lg:mt-20" : ""}>
            <Link href={`/collections?c=${cat.slug}`} className="group block">
              <ArchFrame
                src={cat.image}
                alt={cat.name}
                ratio="aspect-[3/4]"
                focus="object-top"
                zoomOnHover
              >
                <span className="text-[10.5px] uppercase tracking-brand text-gold-light">{cat.count}</span>
                <h3 className="mt-1.5 font-display text-[1.8rem] leading-none text-bone">{cat.name}</h3>
                <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-bone/75">{cat.blurb}</p>
                <span className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-brand text-bone/70 transition-colors group-hover:text-gold-light">
                  Explore <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </ArchFrame>
            </Link>
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
            <p className="text-[12px] uppercase tracking-brand text-muted">{c.eyebrow}</p>
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

/* ══════════════════════════════════════════ 06 · fabric guide
   A comparison table, not another card row. Attributes read across,
   so nothing can fall out of alignment. */

const fabrics = [
  { name: "Beechwood Modal", opacity: "5/5", grip: "5/5", air: "5/5", best: "Daily wear, long shifts, warm climates", note: "No pins needed — drape and toss over the shoulder." },
  { name: "Korean Double Chiffon", opacity: "4/5", grip: "3.5/5", air: "4/5", best: "Formal dinners, nikah, fluid drapes", note: "Pair with a cotton undercap and magnetic pins." },
  { name: "Silk-Touch Georgette", opacity: "4/5", grip: "4/5", air: "4.5/5", best: "Jummah, Eid, elevated occasions", note: "Press the front fold for an architectural frame." },
  { name: "Four-Way Cotton Jersey", opacity: "5/5", grip: "5/5", air: "5/5", best: "Errands, school runs, travel", note: "Wrap once, no pins. Stretch moulds to the crown." },
];

function FabricTable() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
      <Reveal>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[12px] uppercase tracking-brand text-muted">Knowledge Base</p>
            <h2 className="mt-4 font-display text-[2.6rem] font-light leading-none sm:text-[3.2rem]">
              The Hijab Fabric Guide
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted">
              Every weave behaves differently. Compare slip-resistance, opacity and airflow before you choose.
            </p>
          </div>
          <Link href="/collections?c=hijabs" className="underline-grow shrink-0 pb-1 text-[12px] uppercase tracking-brand">
            Shop all scarves →
          </Link>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="mt-12 overflow-x-auto border border-line bg-paper">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-sand/50 text-[11px] uppercase tracking-brand text-muted">
                <th className="px-6 py-5 font-normal">Fabric</th>
                <th className="px-4 py-5 text-center font-normal">Opacity</th>
                <th className="px-4 py-5 text-center font-normal">Grip</th>
                <th className="px-4 py-5 text-center font-normal">Airflow</th>
                <th className="px-6 py-5 font-normal">Best for</th>
              </tr>
            </thead>
            <tbody>
              {fabrics.map((f) => (
                <tr key={f.name} className="group border-b border-line last:border-0 transition-colors hover:bg-sand/30">
                  <td className="px-6 py-6 align-top">
                    <span className="font-display text-[1.35rem] leading-tight text-ink">{f.name}</span>
                    <span className="mt-1.5 block max-w-xs text-[13px] leading-relaxed text-muted">{f.note}</span>
                  </td>
                  <Cell v={f.opacity} />
                  <Cell v={f.grip} />
                  <Cell v={f.air} />
                  <td className="px-6 py-6 align-top text-xs leading-relaxed text-muted">{f.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </section>
  );
}

const Cell = ({ v }) => (
  <td className="px-4 py-6 text-center align-top">
    <span className="font-display text-[1.5rem] text-gold-dark">{v}</span>
  </td>
);

/* ══════════════════════════════════════════ 07 · cut standard
   A horizontal timeline of dome diagrams, joined by one hairline. */

const cuts = [
  ["Open Front", "Detachable sash belt. Wear it buttoned, knotted, or flowing open over a slip."],
  ["Column Cut", "A disciplined vertical drop with back pleating. Never clings, always moves."],
  ["Farasha", "A continuous wing from wrist to hem — voluminous, uninhibited coverage."],
  ["Umbrella Sweep", 'Tapered at the bodice, widening to a 110" circumference that floats at the feet.'],
];

function CutStandard() {
  return (
    <section className="border-y border-line bg-paper py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-[12px] uppercase tracking-brand text-muted">Architectural Cuts</p>
            <h2 className="mt-4 font-display text-[2.6rem] font-light leading-none sm:text-[3.2rem]">
              The Modesty Silhouette Standard
            </h2>
            <p className="mt-3 text-sm text-muted">
              Every Siyana piece is developed against classic modest drape geometry —
              full coverage held in balance with effortless grace.
            </p>
          </div>
        </Reveal>

        <div className="relative mt-20">
          {/* The hairline that threads the four cuts together */}
          <div className="absolute inset-x-0 top-[122px] hidden h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent lg:block" />

          <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-4">
            {cuts.map(([name, body], i) => (
              <Reveal key={name} delay={i * 120} from="fade">
                <div className="group relative text-center">
                  <div className="relative mx-auto grid h-[140px] w-[104px] place-items-end">
                    <svg viewBox="0 0 100 140" className="absolute inset-0 h-full w-full text-gold/45 transition-colors duration-500 group-hover:text-gold" aria-hidden="true">
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        d="M4 138 V62 C4 30 22 34 40 14 c4-5 7-8 10-11 3 3 6 6 10 11 18 20 36 16 36 48 v76"
                      />
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.6"
                        opacity="0.5"
                        d="M14 138 V66 C14 38 30 41 44 24 c3-4 5-6 6-8 1 2 3 4 6 8 14 17 30 14 30 42 v72"
                      />
                    </svg>
                    <span className="relative z-10 grid h-9 w-9 place-items-center rounded-full border border-gold/50 bg-paper font-display text-[1.05rem] text-gold-dark">
                      {i + 1}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-[1.5rem] leading-tight text-ink">{name}</h3>
                  <p className="mx-auto mt-3 max-w-[15rem] text-xs leading-relaxed text-muted">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
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

/* ══════════════════════════════════════════ 09 · ethos */

function Ethos({ c }) {
  return (
    <section id="ethos" className="relative overflow-hidden bg-ink py-28 text-bone">
      <div className="pattern-girih-gold absolute inset-0 opacity-20" />
      <Rosette className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 text-gold/10" spin />

      <Reveal className="relative mx-auto max-w-3xl px-6 text-center" from="fade">
        <Divider label={c.label} />
        <p className="mt-10 font-display text-[2.2rem] font-light leading-[1.35] text-bone/95 sm:text-[2.8rem]">
          {c.statement}
        </p>
        <div className="mx-auto mt-10 h-px w-20 bg-gold" />
        <p className="mx-auto mt-8 max-w-xl text-xs leading-relaxed text-bone/65">{c.footnote}</p>
      </Reveal>
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

/* ══════════════════════════════════════════ 12 · craft */

const craft = [
  ["Fabric before form", "We source Japanese Nida, washed desert linen and Korean crepe for opacity and weight — then design to what the cloth wants to do."],
  ["Coverage as architecture", "Sleeve drop, neckline curve and hemline are set by modest coverage as the baseline, never as an afterthought."],
  ["Small-batch integrity", "Garments run in batches of twenty to fifty. No overproduction, no clearing stock at a discount."],
];

function Craft() {
  return (
    <section className="border-y border-line bg-paper">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-6 py-24 lg:grid-cols-3 lg:px-10">
        {craft.map(([title, body], i) => (
          <Reveal key={title} delay={i * 110}>
            <div className={i ? "lg:border-l lg:border-line lg:pl-12" : ""}>
              <span className="font-display text-[2.6rem] font-light leading-none text-gold/60">
                0{i + 1}
              </span>
              <h3 className="mt-5 font-display text-[1.7rem] leading-tight">{title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          </Reveal>
        ))}
      </div>
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
            <figure className="flex h-full flex-col border border-line bg-paper p-8">
              <div className="flex gap-1 text-gold">
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
