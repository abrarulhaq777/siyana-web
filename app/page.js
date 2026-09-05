import Link from "next/link";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import SectionHead from "@/components/SectionHead";
import { categories, bySlug } from "@/lib/products";

const arrivals = ["sakina-crepe-abaya", "areej-coord", "salah-prayer-set", "misk-chiffon-set"].map(bySlug);
const jummahCapsule = ["zahra-kaftan", "rida-georgette-shawl", "noor-open-abaya", "amal-flared-abaya"].map(bySlug);
const dailyEssentials = ["hana-modal-hijab", "sidra-jersey-hijab", "iman-shirt-dress", "layl-linen-abaya"].map(bySlug);

export default function Home() {
  return (
    <>
      <Hero />
      <ModestyPillars />
      <Categories />
      <Edit
        eyebrow="Autumn / 1447 Capsule"
        heading="Quietly New"
        arabic="الجديد بوقار"
        copy="Pieces cut for this season in Japanese Nida, washed linens, and Korean crepes — designed around fluid drape and zero sheer."
        items={arrivals}
        href="/collections"
      />
      <JummahOccasionEdit />
      <HijabFabricGuide />
      <AbayaSilhouetteGuide />
      <SacredPrayerSection />
      <Ethos />
      <Edit
        eyebrow="Everyday Staples"
        heading="The Considered Few"
        arabic="المختارات اليومية"
        copy="Effortless pin-free wraps and everyday abayas reach-for pieces that hold up to real daily wear."
        items={dailyEssentials}
        href="/collections"
      />
      <BarakahGifting />
      <Craft />
      <Voices />
      <Journal />
    </>
  );
}

/* ---------------------------------------------------------------- hero */

function Hero() {
  return (
    <section className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-6 pb-20 pt-10 lg:grid-cols-[1fr_0.95fr] lg:gap-16 lg:px-10 lg:pt-16">
      <Reveal>
        <div className="inline-flex items-center gap-3 border border-gold/40 bg-sand/60 px-4 py-1.5 backdrop-blur-xs">
          <span className="font-arabic text-sm text-gold-dark select-none">صِيَانَة — دار الحشمة الراقية</span>
          <span className="h-1 w-1 rounded-full bg-gold" />
          <span className="text-[9px] uppercase tracking-brand text-muted">Autumn 1447 Capsule</span>
        </div>

        <h1 className="mt-8 font-display text-[3.2rem] font-light leading-[0.98] sm:text-[4.4rem] lg:text-[5.2rem] text-ink">
          Dressed with
          <br />
          <span className="italic text-gold-dark font-normal">grace & dignity.</span>
        </h1>

        <p className="mt-3 font-arabic text-2xl text-muted/80 font-normal tracking-wide select-none">
          حَيَاءٌ وَوَقَارٌ وَأَنَاقَةٌ تَلِيقُ بِكِ
        </p>

        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted">
          Abayas, hijabs, and timeless modest garments crafted with uncompromised coverage.
          Tailored in Japanese Nida, breathable linens, and opaque crepes — made for sacred moments,
          workdays, and ordinary Tuesdays alike.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-5">
          <Link
            href="/collections"
            className="bg-ink px-9 py-4 text-[10px] uppercase tracking-brand text-bone transition hover:bg-gold-dark shadow-sm"
          >
            Shop The Collection
          </Link>
          <Link
            href="/collections?c=abayas"
            className="border border-line bg-paper px-7 py-4 text-[10px] uppercase tracking-brand text-ink hover:border-gold transition"
          >
            Abayas & Kimonos
          </Link>
          <Link
            href="/collections?c=hijabs"
            className="underline-grow py-2 text-[10px] uppercase tracking-brand text-muted hover:text-ink"
          >
            Hijabs & Shawls →
          </Link>
        </div>

        <div className="mt-12 flex items-center gap-8 border-t border-line pt-6 text-[10.5px] uppercase tracking-[0.16em] text-muted">
          <div>
            <p className="font-medium text-ink">100% Opaque</p>
            <p className="text-[9px] text-muted">Zero-sheer guarantee</p>
          </div>
          <span className="h-6 w-px bg-line" />
          <div>
            <p className="font-medium text-ink">Wudu Friendly</p>
            <p className="text-[9px] text-muted">Comfortable sleeve access</p>
          </div>
          <span className="h-6 w-px bg-line" />
          <div>
            <p className="font-medium text-ink">52″ to 60″</p>
            <p className="text-[9px] text-muted">Tailored drop lengths</p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="relative">
          {/* Outer Mihrab Arch Frame */}
          <div className="arch relative aspect-[3/4.1] overflow-hidden bg-sand shadow-xl border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero/hero-siyana.jpg"
              alt="Siyana Luxury Modest Fashion"
              className="h-full w-full object-cover object-center"
              priority="true"
            />
            {/* Vignette and Delicate Gold Architectural Rim */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-black/15" />
            <div className="arch pointer-events-none absolute inset-3 border border-white/35" />

            {/* Hero Overlays */}
            <div className="absolute top-6 right-6">
              <span className="backdrop-blur-md bg-paper/90 border border-gold/30 px-3 py-1.5 text-[8.5px] uppercase tracking-[0.24em] text-ink font-medium shadow-sm">
                Rabi' al-Awwal 1447
              </span>
            </div>

            <div className="absolute bottom-8 left-8 right-8 text-center sm:text-left">
              <p className="font-arabic text-lg text-gold-light select-none">
                صِيَانَة — الحشمة في أبهى صورها
              </p>
              <p className="font-display text-[1.9rem] font-light italic text-white/95 leading-tight mt-0.5">
                The Noble Art of Modesty
              </p>
              <p className="text-[10px] uppercase tracking-brand text-bone/70 mt-1">
                Japanese Nida & Hand-Rolled Silks
              </p>
            </div>
          </div>

          {/* Decorative Islamic Geometric Medallion */}
          <div className="absolute -bottom-6 -right-6 hidden sm:grid h-24 w-24 place-items-center rounded-full bg-paper border border-gold/40 shadow-lg">
            <div className="text-center">
              <span className="font-arabic text-base text-gold block leading-none select-none">حَيَاء</span>
              <span className="text-[7.5px] uppercase tracking-brand text-muted block mt-1">Modesty</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* --------------------------------------------------------------- modesty pillars */

const pillars = [
  {
    en: "100% Zero-Sheer Verified",
    ar: "ستر كامل مضمون",
    desc: "Every cloth is tested against high daylight. If it goes transparent, it never enters production.",
    badge: "100% Opaque",
  },
  {
    en: "Wudu-Friendly Tailoring",
    ar: "سهولة في الوضوء",
    desc: "Engineered with elasticated smocking or concealed button cuffs for seamless ablution.",
    badge: "Ablution Ease",
  },
  {
    en: "52″–60″ Modest Drop Lengths",
    ar: "أطوال شرعية ساترة",
    desc: "Cut to gracefully meet the top of the footwear without dragging or cling.",
    badge: "Custom Drops",
  },
  {
    en: "Artisan Modest Heritage",
    ar: "حرفة وأقمشة أصيلة",
    desc: "Japanese Nida, washed desert linens, and breathable non-slip beechwood modal.",
    badge: "Pure Cloth",
  },
];

function ModestyPillars() {
  return (
    <div className="border-y border-line bg-paper/80 backdrop-blur-xs">
      <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.en} className="flex flex-col justify-between border-l border-line pl-6 first:border-l-0">
              <div>
                <span className="font-arabic text-xs text-gold-dark block select-none">{p.ar}</span>
                <h4 className="mt-1 font-display text-[1.25rem] text-ink leading-snug">{p.en}</h4>
                <p className="mt-2 text-xs leading-relaxed text-muted">{p.desc}</p>
              </div>
              <span className="mt-4 text-[8.5px] uppercase tracking-brand text-sage font-medium">
                ✓ {p.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- categories */

function Categories() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <p className="text-[10px] uppercase tracking-brand text-muted">Core Collections</p>
              <span className="font-arabic text-sm text-gold select-none">تشكيلاتنا الفاخرة</span>
            </div>
            <h2 className="mt-3 font-display text-[2.6rem] sm:text-[3.2rem] font-light leading-none">
              Curated by Silhouette
            </h2>
          </div>
          <Link href="/collections" className="underline-grow text-[10px] uppercase tracking-brand text-muted hover:text-ink">
            View All Creations ({categories.length} Categories) →
          </Link>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => (
          <Reveal key={c.slug} delay={i * 60}>
            <Link href={`/collections?c=${c.slug}`} className="group block">
              <div className="arch relative aspect-[4/3.5] overflow-hidden bg-sand shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
                <div className="arch pointer-events-none absolute inset-2.5 border border-white/20 transition-colors group-hover:border-gold/60" />

                <div className="absolute top-4 right-4">
                  <span className="font-arabic text-sm text-white/90 drop-shadow-sm select-none">
                    {c.arabicName}
                  </span>
                </div>

                <div className="absolute bottom-5 left-5 right-5">
                  <span className="text-[9px] uppercase tracking-brand text-gold-light block font-medium">
                    {c.count}
                  </span>
                  <h3 className="font-display text-2xl text-bone leading-tight mt-1">{c.name}</h3>
                  <p className="text-[11px] text-bone/80 line-clamp-1 mt-0.5">{c.blurb}</p>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------- product blocks */

function Edit({ eyebrow, heading, arabic, copy, items, href }) {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
          <div>
            <div className="flex items-center gap-3">
              <p className="text-[10px] uppercase tracking-brand text-muted">{eyebrow}</p>
              {arabic && <span className="font-arabic text-sm text-gold select-none">{arabic}</span>}
            </div>
            <h2 className="mt-3 font-display text-[2.6rem] font-light leading-none">{heading}</h2>
            <p className="mt-3 max-w-lg text-sm text-muted">{copy}</p>
          </div>
          <Link href={href} className="underline-grow text-[10px] uppercase tracking-brand">
            View All Pieces →
          </Link>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p, i) => (
          <Reveal key={p.slug} delay={i * 70}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------- jummah & occasion edit */

function JummahOccasionEdit() {
  return (
    <section className="border-y border-line bg-sand/30 py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="font-arabic text-base text-gold-dark block select-none">
              مختارات صلاة الجمعة والمناسبات المباركة
            </span>
            <p className="mt-2 text-[10px] uppercase tracking-brand text-muted">Special Edit</p>
            <h2 className="mt-3 font-display text-[2.8rem] sm:text-[3.6rem] font-light leading-tight">
              The Jummah & Celebration Capsule
            </h2>
            <p className="mt-4 text-sm text-muted/90 leading-relaxed max-w-xl mx-auto">
              Friday prayers, Eid celebrations, and dignified family gatherings call for garments that reflect
              solemnity and quiet grandeur. Featuring royal plum silk brocades, champagne georgettes, and pressed Japanese Nida.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {jummahCapsule.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------- hijab fabric guide */

const fabricGuide = [
  {
    name: "Sustainable Beechwood Modal",
    ar: "مودال ناعم مستدام",
    opacity: "5 / 5 (Opaque)",
    grip: "5 / 5 (Pin-Free)",
    breathable: "5 / 5 (High Airflow)",
    bestFor: "Full daily wear, long working shifts, campus, and warm climates.",
    tip: "No pins required. Simply drape and toss over the opposite shoulder.",
  },
  {
    name: "Korean Double Chiffon",
    ar: "شيفون كوري فاخر",
    opacity: "4 / 5 (Medium)",
    grip: "3.5 / 5 (Pair with Undercap)",
    breathable: "4 / 5 (Weightless)",
    bestFor: "Formal dinners, nikah ceremonies, and fluid graceful drapes.",
    tip: "Pair with an organic cotton undercap and magnetic hijab pins.",
  },
  {
    name: "Silk-Touch Georgette",
    ar: "جورجيت بملمس الحرير",
    opacity: "4 / 5 (Rich Shimmer)",
    grip: "4 / 5 (Holds Fold)",
    breathable: "4.5 / 5 (Evening Drape)",
    bestFor: "Jummah gatherings, Eid festivals, and elevated occasions.",
    tip: "Crisply press the front fold for an architectural facial frame.",
  },
  {
    name: "Four-Way Cotton Jersey",
    ar: "جيرسيه قطني مرن",
    opacity: "5 / 5 (100% Solid)",
    grip: "5 / 5 (Zero-Slip)",
    breathable: "5 / 5 (Absorbent)",
    bestFor: "Everyday active life, errands, school runs, and travel.",
    tip: "Wrap once without pins. Soft stretch molds naturally to the crown.",
  },
];

function HijabFabricGuide() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-8">
          <div>
            <div className="flex items-center gap-3">
              <p className="text-[10px] uppercase tracking-brand text-muted">Knowledge Base</p>
              <span className="font-arabic text-sm text-gold select-none">دليل أقمشة الحجاب</span>
            </div>
            <h2 className="mt-3 font-display text-[2.6rem] sm:text-[3.2rem] font-light leading-none">
              The Hijab Drape & Fabric Guide
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted">
              Every weave behaves differently. Choose your hijab based on slip-resistance, opacity level, and occasion.
            </p>
          </div>
          <Link href="/collections?c=hijabs" className="underline-grow text-[10px] uppercase tracking-brand">
            Shop All Scarves →
          </Link>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {fabricGuide.map((f, i) => (
          <Reveal key={f.name} delay={i * 60}>
            <div className="h-full border border-line bg-paper p-7 flex flex-col justify-between hover:border-gold transition">
              <div>
                <span className="font-arabic text-xs text-gold-dark block select-none">{f.ar}</span>
                <h3 className="mt-1 font-display text-[1.4rem] text-ink leading-tight">{f.name}</h3>

                <dl className="mt-6 space-y-3 text-[11px] uppercase tracking-[0.14em] text-muted border-t border-line pt-4">
                  <div className="flex justify-between">
                    <dt>Opacity</dt>
                    <dd className="text-ink font-medium">{f.opacity}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Grip / Hold</dt>
                    <dd className="text-ink font-medium">{f.grip}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Breathability</dt>
                    <dd className="text-ink font-medium">{f.breathable}</dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <p className="text-[10px] uppercase tracking-brand text-muted">Recommended for</p>
                  <p className="mt-1 text-xs text-ink/80 leading-relaxed">{f.bestFor}</p>
                </div>
              </div>

              <div className="mt-6 border-t border-line pt-4 text-[11px] text-sage">
                <span className="font-medium text-gold-dark">Drape Note: </span>
                {f.tip}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------ abaya silhouette guide */

const silhouettes = [
  {
    name: "Open Front Abaya",
    ar: "العباية المفتوحة",
    desc: "Versatile tailoring with a detachable sash belt. Wear buttoned closed, knotted, or flowing open over an inner slip dress.",
  },
  {
    name: "Minimalist Column Cut",
    ar: "القصة المستقيمة العمودية",
    desc: "A disciplined vertical drop with back pleating. Never clings, creates a regal silhouette that gracefully accommodates movement.",
  },
  {
    name: "Regal Farasha / Butterfly",
    ar: "عباية الفراشة الواسعة",
    desc: "Continuous wing cut extending from wrist to hem. The pinnacle of relaxed modest elegance with voluminous uninhibited coverage.",
  },
  {
    name: "Flared Umbrella Sweep",
    ar: "الكلوش الواسع المنسدل",
    desc: "Tapered gently at the bodice and widening to a 110-inch circumference sweep. Floats majestically around the feet.",
  },
];

function AbayaSilhouetteGuide() {
  return (
    <section className="border-t border-line bg-paper/50 py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-6">
            <div>
              <div className="flex items-center gap-3">
                <p className="text-[10px] uppercase tracking-brand text-muted">Architectural Cuts</p>
                <span className="font-arabic text-sm text-gold select-none">معيار قصات العباية</span>
              </div>
              <h2 className="mt-3 font-display text-[2.6rem] sm:text-[3.2rem] font-light leading-none">
                The Modesty Silhouette Standard
              </h2>
            </div>
            <p className="text-xs text-muted max-w-md">
              Each Siyana piece is developed according to classic modest drape geometry — balancing complete modesty with effortless grace.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {silhouettes.map((s, i) => (
            <Reveal key={s.name} delay={i * 70}>
              <div className="border border-line bg-paper p-6 relative overflow-hidden group hover:border-gold transition">
                <span className="font-display text-4xl text-gold/30 group-hover:text-gold transition-colors">
                  0{i + 1}
                </span>
                <span className="font-arabic text-sm text-gold-dark block mt-2 select-none">{s.ar}</span>
                <h3 className="mt-1 font-display text-[1.35rem] leading-tight text-ink">{s.name}</h3>
                <p className="mt-3 text-xs leading-relaxed text-muted">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------ prayer sanctuary */

function SacredPrayerSection() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="arch relative aspect-[4/3.8] overflow-hidden bg-sand shadow-lg border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/products/salah-prayer-set.jpg"
              alt="Salah Two-Piece Prayer Set"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            <div className="arch pointer-events-none absolute inset-3 border border-white/30" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="font-arabic text-sm text-gold-light block select-none">
                طقم صلاة الصلاح قطن عضوي
              </span>
              <p className="font-display text-2xl text-white">The Sacred Hour Sanctuary</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <span className="font-arabic text-base text-gold-dark block select-none">
            أطقم الصلاة والسكينة والسفر
          </span>
          <p className="mt-2 text-[10px] uppercase tracking-brand text-muted">Sacred Moments</p>
          <h2 className="mt-3 font-display text-[2.8rem] sm:text-[3.6rem] font-light leading-tight">
            Silent Cottons for Sacred Prostrations
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-muted">
            Standing in prayer requires complete tranquility. Our two-piece prayer dresses are made from
            ultra-soft brushed organic combed cotton that is silent, weightless, and guaranteed opaque.
            Paired with an overhead tie-back khimar and a matching storage pouch that packs effortlessly into your handbag.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-muted border-t border-line pt-6">
            <li className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              <span>Includes matching zippered travel pouch</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              <span>Full overhead khimar with built-in tie back</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              <span>Tested 100% zero-transparency under direct light</span>
            </li>
          </ul>

          <div className="mt-10 flex items-center gap-4">
            <Link
              href="/collections?c=prayerwear"
              className="bg-ink px-8 py-4 text-[10px] uppercase tracking-brand text-bone hover:bg-gold-dark transition"
            >
              Explore Prayer Wear
            </Link>
            <Link href="/product/salah-prayer-set" className="underline-grow py-3 text-[10px] uppercase tracking-brand text-muted hover:text-ink">
              View Two-Piece Set →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- ethos */

function Ethos() {
  return (
    <section id="ethos" className="relative overflow-hidden bg-ink py-28 text-bone">
      <div className="pattern-girih-gold absolute inset-0 opacity-15" />
      <Reveal className="relative mx-auto max-w-3xl px-6 text-center">
        <span className="font-arabic text-xl sm:text-2xl text-gold block leading-relaxed select-none">
          «إِنَّ لِكُلِّ دِينٍ خُلُقًا، وَخُلُقُ الإِسْلاَمِ الْحَيَاءُ»
        </span>
        <p className="mt-4 text-[10px] uppercase tracking-brand text-bone/50">The Sacred Character</p>

        <p className="mt-10 font-display text-[2.2rem] font-light leading-[1.35] sm:text-[2.8rem] text-bone/95">
          Modesty is not a costume donned for rare occasions. It is the noble silhouette of an ordinary
          Tuesday — and it deserves fabrics that dignify it.
        </p>

        <div className="mx-auto mt-10 h-px w-20 bg-gold" />

        <p className="mt-8 text-xs leading-relaxed text-bone/70 max-w-xl mx-auto">
          Every Siyana piece is measured for full coverage first, drape second, and tested against light before it ever leaves our studio.
          If it clings or goes sheer, it will never ship.
        </p>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------ barakah gifting */

function BarakahGifting() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
      <div className="arch-sm relative overflow-hidden bg-sand/60 border border-gold/30 p-8 sm:p-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-arabic text-base text-gold-dark select-none">صناديق الهدايا والبركة</span>
              <span className="text-[10px] uppercase tracking-brand text-muted">Islamic Gifting</span>
            </div>
            <h2 className="mt-3 font-display text-[2.6rem] sm:text-[3.2rem] font-light leading-tight">
              The Barakah Presentation Box
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted max-w-lg">
              Whether celebrating a wedding, Eid, Ramadan, or gifting a mother or sister, each Siyana gift is
              hand-packed in a gold-embossed textured rigid box with silk ribbon, custom tissue, and a complimentary musk scent card.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-[10.5px] uppercase tracking-[0.16em] text-muted">
              <span className="border border-line bg-paper px-3 py-1.5">✓ Gold-Embossed Rigid Box</span>
              <span className="border border-line bg-paper px-3 py-1.5">✓ Scented Musk Insert</span>
              <span className="border border-line bg-paper px-3 py-1.5">✓ Personalized Calligraphy Note</span>
            </div>
          </div>

          <div className="arch relative aspect-[4/3] overflow-hidden bg-sand border border-line shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/products/misk-chiffon-set.jpg"
              alt="Misk Chiffon Trio Presentation Box"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- craft */

const craft = [
  ["01", "Fabric Before Form", "We source genuine Japanese Nida, washed desert linens, and Korean crepes specifically for their opacity and weight before designing the cut."],
  ["02", "Full Coverage Architecture", "Sleeve drops, neckline curvature, and hemlines are determined by modest coverage as the baseline, never as an afterthought."],
  ["03", "Small-Batch Integrity", "All garments are produced in limited batches of twenty to fifty pieces, ensuring zero overproduction and exceptional hand-finished seams."],
];

function Craft() {
  return (
    <section className="border-y border-line bg-paper">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-24 lg:grid-cols-3 lg:px-10">
        {craft.map(([n, title, body], i) => (
          <Reveal key={n} delay={i * 90}>
            <p className="font-display text-3xl text-gold">{n}</p>
            <h3 className="mt-5 font-display text-[1.7rem] leading-tight">{title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">{body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- voices */

const voices = [
  ["The Noor open abaya is the only piece I own that survives a 10-hour hospital shift without creasing or clinging. Truly uncompromised modesty.", "Dr. Aisha R.", "London, UK"],
  ["Finally a modal hijab that holds its drape through dhuhr prayer and university lectures without five pins. The warm bone color is perfection.", "Fatima K.", "Dubai, UAE"],
  ["Ordered the two-piece prayer set for Umrah. It folded into its tiny pouch, stayed completely crease-free, and was totally opaque in bright Mecca sun.", "Maryam S.", "Hyderabad, IN"],
];

function Voices() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
      <Reveal>
        <SectionHead eyebrow="Ummah Reflections" title="Worn, Treasured, Repeated" />
      </Reveal>
      <div className="mt-14 grid gap-10 lg:grid-cols-3">
        {voices.map(([quote, name, city], i) => (
          <Reveal key={name} delay={i * 80}>
            <figure className="border-t border-line pt-8">
              <blockquote className="font-display text-[1.35rem] leading-snug text-ink/90">“{quote}”</blockquote>
              <figcaption className="mt-6 flex items-center justify-between text-[10px] uppercase tracking-brand text-muted">
                <span>{name}</span>
                <span className="text-gold font-medium">{city}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- journal */

function Journal() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 lg:px-10 pb-16">
      <Reveal>
        <div className="relative overflow-hidden bg-sand/70 px-6 py-20 text-center sm:px-16 border border-line arch-sm">
          <div className="pattern-girih absolute inset-0 opacity-[0.05]" />
          <div className="relative mx-auto max-w-lg">
            <span className="font-arabic text-sm text-gold-dark select-none">رسالة صيانة الشهرية</span>
            <h2 className="mt-2 font-display text-[2.4rem] font-light leading-none">The Siyana Letter</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Restock announcements, seasonal capsules, and fabric care notes. Delivered with dignity, never more than twice a month.
            </p>
            <form className="mt-9 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="news" className="sr-only">Email address</label>
              <input
                id="news"
                type="email"
                required
                placeholder="sister@example.com"
                className="flex-1 border-b border-ink/25 bg-transparent px-2 py-3 text-sm outline-none placeholder:text-muted focus:border-gold"
              />
              <button className="bg-ink px-8 py-4 text-[10px] uppercase tracking-brand text-bone transition hover:bg-gold-dark shadow-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}


