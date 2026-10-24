import Link from "next/link";
import Reveal from "./Reveal";
import { Divider, Rosette } from "./Ornament";
import { BRAND, FAQ } from "@/lib/brand";

/* Native <details>, so every answer opens without JavaScript and is in the page for search */
export function FaqList({ className = "" }) {
  return (
    <div className={`divide-y divide-line border-y border-line ${className}`}>
      {FAQ.map(({ q, a }, i) => (
        <details key={q} className="group py-1" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-baseline gap-5 py-5 [&::-webkit-details-marker]:hidden">
            <span className="font-display text-[1.1rem] text-gold">0{i + 1}</span>
            <span className="flex-1 font-display text-[1.45rem] leading-snug text-ink transition-colors group-hover:text-gold-dark">
              {q}
            </span>
            <span className="text-gold transition-transform duration-300 group-open:rotate-45">+</span>
          </summary>
          <p className="pb-6 pl-10 pr-8 text-sm leading-relaxed text-muted">{a}</p>
        </details>
      ))}
    </div>
  );
}

export default function FaqSection() {
  return (
    <section id="faq" className="relative mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal from="left">
          <div className="arch-sm relative overflow-hidden border border-gold/30 bg-sand/60 px-8 pb-10 pt-16 text-center lg:sticky lg:top-28">
            <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.05]" />
            <Rosette className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 text-gold/15" spin />
            <div className="relative">
              <Divider label="FAQ" />
              <h2 className="mt-6 font-display text-[2.4rem] font-light leading-tight sm:text-[2.8rem]">
                Questions, <span className="italic text-gold-dark">answered</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-muted">
                Everything you need to know before you shop. Still curious? We are happy to help.
              </p>
              <div className="mt-7 flex flex-col items-center gap-3">
                <a
                  href={BRAND.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-ink px-7 py-3.5 text-[11.5px] uppercase tracking-brand text-bone transition hover:bg-gold-dark"
                >
                  Message us on Instagram
                </a>
                <Link href="/contact" className="underline-grow py-1 text-[11px] uppercase tracking-brand text-muted hover:text-ink">
                  Contact details →
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal from="right" delay={120}>
          <FaqList />
        </Reveal>
      </div>
    </section>
  );
}
