"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Crescent, Star, Rosette, Scallop, Corner } from "@/components/Ornament";

const OFFERS = [
  {
    code: "WELCOME10",
    title: "Welcome to Siyana Privilege",
    discount: "10% OFF",
    scope: "First Order Entire Collection",
    minOrder: "₹1,500 minimum order",
    validity: "Valid for new members",
    description:
      "A token of our appreciation for joining the House of Siyana. Valid across all signature Japanese Nida abayas, breathable bamboo hijabs, and tailored co-ords.",
    tag: "New Customer Exclusive",
  },
  {
    code: "SIYANA500",
    title: "The Capsule Wardrobe Courtesy",
    discount: "₹500 OFF",
    scope: "Orders Above ₹3,000",
    minOrder: "₹3,000 minimum order",
    validity: "Ongoing Season Offer",
    description:
      "Curate your modest essentials for the season ahead. Applies automatically to cart subtotals over ₹3,000, combining seamlessly with complimentary shipping.",
    tag: "Most Popular",
  },
  {
    code: "AUTO-APPLIED",
    title: "Complimentary Express Courier",
    discount: "FREE SHIPPING",
    scope: "Nationwide & Discreet Delivery",
    minOrder: "Orders over ₹2,999",
    validity: "Always active",
    description:
      "Enjoy premium express shipping packed in our discreet Siyana matte black protective mailers. No discount code needed — discount applies automatically at checkout.",
    tag: "Standard Privilege",
    isAuto: true,
  },
  {
    code: "SANCTUARY",
    title: "The Gifting Sanctuary Gift",
    discount: "GIFT POUCH",
    scope: "Any 2-Piece Prayer Set or Kaftan",
    minOrder: "With qualifying pieces",
    validity: "While supplies last",
    description:
      "Receive our signature gold-embossed velvet travel pouch and a handwritten Arabic du'a card with every festive kaftan or two-piece prayerwear set.",
    tag: "Seasonal Gift",
    isAuto: true,
  },
];

export default function OffersView() {
  const [copied, setCopied] = useState(null);

  const copyCode = (code) => {
    if (code === "AUTO-APPLIED") return;
    navigator.clipboard?.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2500);
  };

  return (
    <div className="bg-bone/40 pb-24">
      {/* ── 01 · Hero Section · The Gilded Treasury Vault ── */}
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-paper via-sand/30 to-bone/60 pt-16 pb-0 lg:pt-20">
        <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.035]" />
        
        {/* Soft Ambient Radiance */}
        <div className="pointer-events-none absolute left-1/2 -top-24 h-80 w-[550px] -translate-x-1/2 rounded-full bg-gold/15 blur-[100px]" />

        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal from="fade" className="mx-auto max-w-3xl text-center">
            
            {/* Arabic Calligraphy Header with Star Ornaments */}
            <div className="flex items-center justify-center gap-3">
              <Star className="h-3.5 w-3.5 text-gold-dark" />
              <span className="font-arabic text-[22px] font-medium tracking-wide text-gold-dark" dir="rtl">
                بَرَكَةٌ وَتَيْسِير
              </span>
              <Star className="h-3.5 w-3.5 text-gold-dark" />
            </div>

            {/* Privilege Vault Badge */}
            <div className="mt-4 inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-bone/90 px-4 py-1.5 shadow-2xs backdrop-blur-xs">
              <Crescent className="h-3.5 w-3.5 text-gold-dark" />
              <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-ink">
                The Siyana Vault · Seasonal Privileges
              </span>
            </div>

            <h1 className="mt-6 font-display text-[3.2rem] font-light leading-[1.04] text-ink sm:text-[4.2rem] lg:text-[4.6rem]">
              Sacred Courtesy &
              <br />
              <span className="italic font-normal text-gold-dark">graceful privileges.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed text-muted">
              Every garment in our atelier is an investment in dignity. Enjoy active courtesy codes and complimentary packaging privileges curated for your modest wardrobe.
            </p>

            {/* Interactive Hero Quick-Privilege Chips */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
              {OFFERS.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => copyCode(item.code)}
                  className="group inline-flex items-center gap-2 rounded-full border border-line bg-paper/90 px-4 py-2 text-left shadow-xs transition hover:border-gold/60 hover:bg-gold/5"
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-gold/15 text-[10px] font-bold text-gold-dark group-hover:bg-gold group-hover:text-paper transition">
                    %
                  </span>
                  <div className="flex flex-col">
                    <span className="font-mono text-[11px] font-semibold text-ink">
                      {item.discount}
                    </span>
                    <span className="text-[9.5px] text-muted uppercase tracking-wider">
                      {item.code === "AUTO-APPLIED" || item.code === "SANCTUARY" ? "Auto-Applied" : `Code: ${item.code}`}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {copied && (
              <p className="mt-3 text-xs font-medium text-emerald-800 animate-fade-in">
                ✓ Privilege code <strong className="font-mono">{copied}</strong> copied to clipboard!
              </p>
            )}
          </Reveal>
        </div>

        {/* Golden Ticker Ribbon Bar */}
        <div className="mt-14 overflow-hidden border-t border-gold/30 bg-gold/10 py-3 backdrop-blur-xs">
          <div className="flex items-center justify-center gap-6 text-[10.5px] font-medium uppercase tracking-[0.24em] text-gold-dark whitespace-nowrap px-4">
            <span className="inline-flex items-center gap-2">
              <Star className="h-3 w-3 text-gold" />
              Complimentary Express Shipping Over ₹2,999
            </span>
            <span className="hidden md:inline-flex items-center gap-2">
              <Rosette className="h-3 w-3 text-gold" />
              Velvet Travel Pouch with 2-Piece Sets
            </span>
            <span className="inline-flex items-center gap-2">
              <Star className="h-3 w-3 text-gold" />
              10% Courtesy on First Atelier Order
            </span>
            <span className="hidden lg:inline-flex items-center gap-2">
              <Crescent className="h-3 w-3 text-gold" />
              100% Zero-Sheer Certified
            </span>
          </div>
        </div>
      </section>

      {/* ── Offers Grid ── */}
      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <div className="grid gap-8 md:grid-cols-2">
          {OFFERS.map((offer, i) => (
            <Reveal key={offer.title} delay={i * 100} from="up">
              <div className="group relative flex h-full flex-col justify-between overflow-hidden border border-line bg-paper p-7 shadow-xs transition-all duration-300 hover:border-gold/60 hover:shadow-xl sm:p-8">
                {/* Corner Accent */}
                <Corner className="absolute -top-3 -right-3 h-10 w-10 text-gold/30" />

                <div>
                  {/* Header tag */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-1.5 rounded-xs bg-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-dark">
                      {offer.code === "WELCOME10" && (
                        <svg viewBox="0 0 24 24" className="h-3 w-3 text-gold-dark" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                        </svg>
                      )}
                      {offer.code === "SIYANA500" && (
                        <svg viewBox="0 0 24 24" className="h-3 w-3 text-gold-dark" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                          <line x1="7" y1="7" x2="7.01" y2="7" />
                        </svg>
                      )}
                      {offer.code === "AUTO-APPLIED" && (
                        <svg viewBox="0 0 24 24" className="h-3 w-3 text-gold-dark" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <rect x="1" y="3" width="15" height="13" />
                          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                          <circle cx="5.5" cy="18.5" r="2.5" />
                          <circle cx="18.5" cy="18.5" r="2.5" />
                        </svg>
                      )}
                      {offer.code === "SANCTUARY" && (
                        <svg viewBox="0 0 24 24" className="h-3 w-3 text-gold-dark" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <rect x="3" y="8" width="18" height="13" rx="1" />
                          <path d="M12 8v13M3 13h18" strokeLinecap="round" />
                        </svg>
                      )}
                      <span>{offer.tag}</span>
                    </span>
                    <span className="text-[11px] uppercase tracking-wider text-muted font-mono">
                      {offer.validity}
                    </span>
                  </div>

                  {/* Discount and Title */}
                  <div className="mt-5 flex items-baseline justify-between gap-4 border-b border-line/70 pb-5">
                    <h3 className="font-display text-[1.7rem] font-light leading-snug text-ink sm:text-[1.9rem]">
                      {offer.title}
                    </h3>
                    <span className="font-display text-[1.8rem] font-medium tracking-tight text-gold-dark whitespace-nowrap">
                      {offer.discount}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-4 text-[14px] leading-relaxed text-muted">
                    {offer.description}
                  </p>

                  {/* Scope & terms */}
                  <div className="mt-5 space-y-1 text-[12px] text-muted">
                    <p>• <strong className="text-ink font-medium">Applies to:</strong> {offer.scope}</p>
                    <p>• <strong className="text-ink font-medium">Requirement:</strong> {offer.minOrder}</p>
                  </div>
                </div>

                {/* Coupon Ticket Strip & Action */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-gold/40 pt-5">
                  {offer.isAuto ? (
                    <div className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-wider text-gold-dark">
                      {offer.code === "AUTO-APPLIED" ? (
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold-dark" fill="none" stroke="currentColor" strokeWidth="1.4">
                          <rect x="1" y="3" width="15" height="13" />
                          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                          <circle cx="5.5" cy="18.5" r="2.5" />
                          <circle cx="18.5" cy="18.5" r="2.5" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold-dark" fill="none" stroke="currentColor" strokeWidth="1.4">
                          <rect x="3" y="8" width="18" height="13" rx="1" />
                          <path d="M12 8v13M3 13h18" strokeLinecap="round" />
                          <path d="M12 8c-2-3-5.5-3-5.5 0 0 2.5 5.5 5 5.5 5s5.5-2.5 5.5-5c0-3-3.5-3-5.5 0z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      <span>Applied automatically at checkout</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="rounded-xs border border-line bg-bone px-3.5 py-2 font-mono text-[14px] font-semibold tracking-wider text-ink">
                        {offer.code}
                      </span>
                      <button
                        onClick={() => copyCode(offer.code)}
                        className="inline-flex items-center gap-1.5 rounded-xs border border-line bg-paper px-3.5 py-2 text-[11px] font-medium uppercase tracking-brand text-ink transition hover:border-gold hover:bg-gold/10"
                      >
                        {copied === offer.code ? (
                          <span className="text-gold-dark font-bold">✓ Copied!</span>
                        ) : (
                          <span>Copy Code</span>
                        )}
                      </button>
                    </div>
                  )}

                  <Link
                    href="/collections"
                    className="inline-flex items-center gap-1.5 text-[11.5px] font-medium uppercase tracking-brand text-ink transition hover:text-gold-dark"
                  >
                    <span>Shop Collection</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* How to Redeem Help Box */}
        <Reveal from="scale" className="mt-16">
          <div className="rounded-[2px] border border-line bg-sand/30 p-8 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-[1.6rem] text-ink">
                  How to Redeem Your Courtesy Code
                </h3>
                <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted">
                  Simply click &ldquo;Copy Code&rdquo; on any offer above, add your desired garments to the bag, and paste the code into the Coupon field during checkout. The discount is calculated and verified server-side instantaneously.
                </p>
              </div>
              <Link
                href="/collections"
                className="shrink-0 bg-ink px-8 py-3.5 text-[12px] font-medium uppercase tracking-brand text-bone transition hover:bg-gold-dark"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <Scallop className="text-gold" />
    </div>
  );
}
