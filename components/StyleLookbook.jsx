import Link from "next/link";
import Reveal from "./Reveal";
import MihrabFrame from "./MihrabFrame";
import { Crescent, Star } from "./Ornament";
import { inr } from "@/lib/products";

/*
 * Five looks as a row of mihrab niches, like the arcade of a courtyard. Every look is
 * a real product shown whole and links to it; the inner niches drop a step so the
 * row reads as architecture rather than a grid.
 */
const drop = ["", "lg:mt-14", "lg:mt-24", "lg:mt-14", ""];

export default function StyleLookbook({ c, looks = [] }) {
  if (!looks.length) return null;

  return (
    <section className="relative overflow-hidden py-24 lg:py-28">
      <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.025]" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal from="fade">
          <div className="mx-auto max-w-2xl text-center">
            <Crescent className="mx-auto h-6 w-6 text-gold" />
            <p className="mt-5 text-[11px] uppercase tracking-brand text-muted">{c.eyebrow}</p>
            <h2 className="mt-3 font-display text-[2.6rem] font-light leading-tight sm:text-[3.4rem]">
              {c.heading} {c.accent && <span className="italic text-gold-dark">{c.accent}</span>}
            </h2>
            {c.body && <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">{c.body}</p>}
          </div>
        </Reveal>

        <ul className="mt-16 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-7">
          {looks.map((look, i) => (
            <li key={look.slug} className={drop[i % drop.length]}>
              <Reveal delay={i * 100}>
                <Link href={`/product/${look.slug}`} className="group block">
                  <MihrabFrame src={look.image} alt={look.name} label={`Look ${String(i + 1).padStart(2, "0")}`} />
                  <div className="mt-5 text-center">
                    <p className="font-display text-[1.25rem] leading-tight text-ink transition-colors group-hover:text-gold-dark">
                      {look.name}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted">
                      {look.colorName} · {inr(look.price)}
                    </p>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal from="fade">
          <div className="mt-16 flex flex-col items-center gap-6">
            {c.cta?.label && (
              <Link
                href={c.cta.href || "/collections"}
                className="bg-ink px-8 py-4 text-[12px] uppercase tracking-brand text-bone transition hover:bg-gold-dark"
              >
                {c.cta.label}
              </Link>
            )}
            {c.motto && (
              <p className="flex items-center justify-center gap-4 text-center text-[11px] uppercase tracking-brand text-muted">
                <Star className="h-3.5 w-3.5 text-gold" />
                {c.motto}
                <Star className="h-3.5 w-3.5 text-gold" />
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
