import Reveal from "./Reveal";
import { Divider, Rosette, Star } from "./Ornament";
import { BRAND } from "@/lib/brand";
import { amiri } from "@/lib/fonts";

function Pillar({ item, n, align }) {
  return (
    <div className={`flex flex-col ${align === "right" ? "lg:items-end lg:text-right" : ""}`}>
      <div className="flex items-center gap-3">
        <Star className="h-5 w-5 text-gold" />
        <span className="font-display text-[1.1rem] text-gold/70">0{n}</span>
      </div>
      <h3 className="mt-3 font-display text-[1.6rem] leading-snug text-bone">{item.title}</h3>
      <p className="mt-2 max-w-xs text-xs leading-relaxed text-bone/60">{item.body}</p>
    </div>
  );
}

/* The philosophy statement, then the reasons to choose Siyana set around the name it comes from */
export default function WhySiyana({ ethos, assurances }) {
  const items = assurances.items ?? [];
  const half = Math.ceil(items.length / 2);
  const sides = [items.slice(0, half), items.slice(half)];

  return (
    <section id="ethos" className="relative overflow-hidden bg-ink py-24 text-bone lg:py-28">
      <div className="pattern-girih-gold pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal from="fade" className="mx-auto max-w-3xl text-center">
          <Divider label={ethos.label} />
          <p className="mt-9 font-display text-[1.9rem] font-light leading-[1.35] text-bone/95 sm:text-[2.5rem]">
            {ethos.statement}
          </p>
        </Reveal>

        <Reveal from="fade">
          <p className="mt-20 text-center text-[11px] uppercase tracking-brand text-gold-light/80">
            Why choose {BRAND.name}?
          </p>
        </Reveal>

        <div className="mt-12 grid items-center gap-14 lg:grid-cols-[1fr_auto_1fr] lg:gap-16">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-1">
            {sides[0].map((item, i) => (
              <Reveal key={item.title + i} from="left" delay={i * 120}>
                <Pillar item={item} n={i + 1} align="right" />
              </Reveal>
            ))}
          </div>

          <Reveal from="scale" className="order-first mx-auto lg:order-none">
            <div className="relative grid h-72 w-72 place-items-center sm:h-80 sm:w-80">
              <Rosette className="absolute inset-0 h-full w-full text-gold/40" spin />
              <div className="relative grid h-48 w-48 place-items-center rounded-full border border-gold/50 bg-ink text-center shadow-[0_0_60px_rgba(197,160,89,0.18)] sm:h-52 sm:w-52">
                <div>
                  <p lang="ar" dir="rtl" className={`${amiri.className} text-[3.2rem] leading-none text-gold-light`}>
                    صيانة
                  </p>
                  <p className="mt-3 font-display text-[1.15rem] italic text-bone/90">Siyāna</p>
                  <p className="mt-1.5 text-[9.5px] uppercase tracking-[0.16em] text-bone/50">to preserve · to protect</p>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-1">
            {sides[1].map((item, i) => (
              <Reveal key={item.title + i} from="right" delay={i * 120}>
                <Pillar item={item} n={half + i + 1} />
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal from="fade">
          <div className="mx-auto mt-20 h-px w-20 bg-gold" />
          <p className="mx-auto mt-8 max-w-xl text-center text-xs leading-relaxed text-bone/60">{ethos.footnote}</p>
        </Reveal>
      </div>
    </section>
  );
}
