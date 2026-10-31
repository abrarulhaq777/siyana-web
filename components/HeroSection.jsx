"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import ArchFrame from "@/components/ArchFrame";
import { Rosette, Star, Corner, Scallop } from "@/components/Ornament";
import { DEFAULTS } from "@/lib/content-defaults";

export default function HeroSection({ c, totalProducts }) {
  const [activeLook, setActiveLook] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const sectionRef = useRef(null);

  // The CMS merges its defaults in already; these cover a slide or field saved empty.
  const d = DEFAULTS.hero;
  const stats = c?.stats?.length ? c.stats : d.stats;
  const slides = Array.isArray(c?.slides) && c.slides.length > 0 ? c.slides : d.slides;

  const LOOKS = slides.map((item, idx) => ({
    id: item.id || `slide-${idx}`,
    image: item.image || c?.image || d.image,
    badge: item.badge || d.eyebrow,
    title: item.title || c?.captionTitle || d.captionTitle,
    sub: item.sub || c?.captionSub || d.captionSub,
    previewThumb: item.previewThumb || null,
    previewName: item.previewName || null,
    previewPrice: item.previewPrice || null,
    previewTag: item.previewTag || "Featured",
    focus: item.focus || "object-[50%_30%]",
    link: item.link || "/collections",
  }));

  /* ── Off screen the slides stay put, so phones don't download photos nobody can see ── */
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  /* ── Auto-rotate images every 4.2 seconds (pauses on hover) ── */
  useEffect(() => {
    if (isPaused || !onScreen || LOOKS.length <= 1) return;
    const interval = setInterval(() => {
      setActiveLook((prev) => (prev + 1) % LOOKS.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [isPaused, onScreen, LOOKS.length]);

  const currentLook = LOOKS[activeLook % LOOKS.length] || LOOKS[0];

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-bone/40 pb-16 pt-3 sm:pb-20 sm:pt-4 lg:pb-24 lg:pt-6">
      {/* Ambient background decoration */}
      <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.028]" />
      <div className="pointer-events-none absolute -left-48 top-4 h-96 w-96 rounded-full bg-gold/8 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 top-8 h-[32rem] w-[32rem] rounded-full bg-gold/10 blur-[140px]" />

      {/* Hero container */}
      <div className="relative mx-auto w-full max-w-[1400px] px-6 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 xl:gap-20">
          
          {/* ══════════════════════════════════════ LEFT COLUMN ══════════════════════════════════════ */}
          <div className="relative z-10 flex flex-col justify-center">
            
            {/* Top eyebrow badge */}
            <div>
              <span className="inline-flex items-center gap-2.5 border border-gold/40 bg-paper/70 px-4 py-2 backdrop-blur-xs">
                <Star className="h-3.5 w-3.5 text-gold-dark" />
                <span className="text-[11px] uppercase tracking-brand text-muted">
                  {c?.eyebrow || d.eyebrow}
                </span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-7 font-display text-[3.2rem] font-light leading-[1] text-ink sm:text-[4.4rem] lg:text-[5rem] xl:text-[5.5rem]">
              {c?.titleTop || d.titleTop}
              <br />
              <span className="italic font-normal text-gold-dark">
                {c?.titleAccent || d.titleAccent}
              </span>
            </h1>

            {/* Editorial Body */}
            <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-muted sm:text-[17px]">
              {c?.body || d.body}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={c?.primaryCta?.href || d.primaryCta.href}
                className="group relative inline-flex items-center gap-3 bg-ink px-9 py-4 text-[12px] font-medium uppercase tracking-brand text-bone shadow-md transition hover:bg-gold-dark"
              >
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5">
                  <span className="animate-pulse-ring absolute inset-0 rounded-full bg-gold" />
                  <span className="absolute inset-0 rounded-full bg-gold" />
                </span>
                <span>{c?.primaryCta?.label || d.primaryCta.label}</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>

              <Link
                href={c?.secondaryCta?.href || d.secondaryCta.href}
                className="border border-line bg-paper px-7 py-4 text-[12px] font-medium uppercase tracking-brand text-ink transition hover:border-gold hover:bg-white"
              >
                {c?.secondaryCta?.label || d.secondaryCta.label}
              </Link>

              <Link
                href={c?.tertiaryCta?.href || d.tertiaryCta.href}
                className="underline-grow py-2 text-[12px] font-medium uppercase tracking-brand text-muted hover:text-ink"
              >
                {c?.tertiaryCta?.label || d.tertiaryCta.label}
              </Link>
            </div>

            {/* Clean Authentic Editorial Spec / Stat Strip */}
            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-5 border-t border-line/80 pt-6">
              {stats.map((stat, i) => (
                <div key={stat.k + i} className={i ? "border-l border-line/80 pl-4" : ""}>
                  <dt className="text-[11px] font-semibold uppercase leading-snug tracking-[0.08em] text-ink sm:whitespace-nowrap sm:text-[12.5px] sm:tracking-[0.1em]">
                    {stat.k}
                  </dt>
                  <dd className="mt-1.5 text-[11px] uppercase leading-relaxed tracking-[0.08em] text-muted">
                    {stat.v}
                  </dd>
                </div>
              ))}
            </dl>

          </div>

          {/* ══════════════════════════════════════ RIGHT COLUMN (TALL MAJESTIC MUSLIM DOME) ══════════════════════════════════════ */}
          <div
            className="relative mx-auto flex w-full max-w-[460px] flex-col items-center sm:max-w-[500px] lg:max-w-[540px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            
            {/* Classical Islamic Onion Dome Architectural Frame */}
            <div className="group relative w-full">
              
              {/* Gold hairline that traces the dome outline, sitting outside the mask */}
              <svg
                viewBox="0 0 100 140"
                preserveAspectRatio="none"
                className="pointer-events-none absolute -inset-x-2 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)] text-gold/60"
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

              {/* Main Dome Arch Frame — Generous tall editorial height */}
              <div key={currentLook.id} className="transition-all duration-700 ease-in-out">
                <ArchFrame
                  src={currentLook.image}
                  alt={currentLook.title}
                  ratio="aspect-[4/4.7]"
                  shape="dome"
                  sizes="(min-width: 1024px) 540px, (min-width: 640px) 500px, 100vw"
                  focus={currentLook.focus}
                  kenburns
                  frame={false}
                >
                  <span className="inline-block max-w-[80%] rounded-full bg-black/40 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-gold-light backdrop-blur-md">
                    {currentLook.badge}
                  </span>
                  <p className="mt-2.5 max-w-[82%] font-display text-[2.1rem] font-light italic leading-tight text-white sm:text-[2.4rem]">
                    {currentLook.title}
                  </p>
                  <p className="mt-1.5 max-w-[75%] text-[11.5px] font-medium uppercase tracking-brand text-bone/85">
                    {currentLook.sub}
                  </p>
                </ArchFrame>
              </div>

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

              {/* Islamic corner brackets */}
              <Corner className="absolute -bottom-4 -left-4 z-10 h-14 w-14 -scale-y-100 text-gold/65" />
              <Corner className="absolute -bottom-4 -right-4 z-10 h-14 w-14 -scale-100 text-gold/65" />

              {/* ── Floating Mini Product Feature Card ── */}
              {currentLook.previewThumb && currentLook.previewName && (
                <Link
                  href={currentLook.link || "/collections"}
                  className="absolute -left-6 top-16 z-30 hidden w-52 rounded-md border border-line bg-paper/95 p-3 shadow-xl backdrop-blur-md transition-all duration-500 hover:scale-105 sm:block lg:-left-10"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={currentLook.previewThumb}
                      alt=""
                      width={42}
                      height={56}
                      unoptimized={!currentLook.previewThumb.startsWith("/")}
                      className="h-14 w-10.5 rounded-xs object-cover shadow-xs"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="inline-block rounded-xs bg-gold/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold-dark">
                        {currentLook.previewTag}
                      </span>
                      <p className="mt-1 truncate text-xs font-semibold text-ink">{currentLook.previewName}</p>
                      <p className="mt-0.5 text-[11.5px] font-medium text-gold-dark">{currentLook.previewPrice}</p>
                    </div>
                  </div>
                </Link>
              )}

              {/* ── Spinning 16-point Gold Rosette Medallion (Bottom-Right) ── */}
              <div className="absolute -bottom-7 right-4 z-30 hidden h-28 w-28 place-items-center rounded-full border border-gold/45 bg-paper/95 shadow-xl backdrop-blur-md sm:grid">
                <Rosette className="absolute h-24 w-24 text-gold/35" spin />
                <span className="relative text-center">
                  <span className="block font-display text-[1.9rem] font-light leading-none text-gold-dark">
                    {totalProducts ?? 17}
                  </span>
                  <span className="mt-0.5 block text-[8.5px] font-semibold uppercase tracking-brand text-muted">
                    Pieces
                  </span>
                </span>
              </div>

            </div>

            {/* Subtle auto-slide progress indicators (Minimal luxury dots) */}
            <div className="mt-6 flex items-center gap-2.5">
              {LOOKS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveLook(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1.5 transition-all duration-500 rounded-full ${
                    activeLook === i ? "w-7 bg-gold" : "w-2 bg-line hover:bg-gold/40"
                  }`}
                />
              ))}
            </div>

          </div>

        </div>
      </div>

      <Scallop className="mt-12 text-gold" />
    </section>
  );
}
