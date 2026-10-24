"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import { Crescent, Star, Corner, Scallop } from "@/components/Ornament";
import { FaqList } from "@/components/FaqSection";
import { BRAND } from "@/lib/brand";

export default function ContactView({ email, phone }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <div className="bg-bone/40 pb-24">
      
      {/* ── 01 · Hero ── */}
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-paper/95 via-sand/20 to-bone/40 py-16 lg:py-20">
        <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.035]" />
        
        {/* Soft Ambient Radiance */}
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-gold/10 blur-[120px]" />

        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            
            {/* Left column · greeting (7 cols) */}
            <Reveal from="left" className="lg:col-span-7">
              {/* Arabic Greeting */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-arabic text-[24px] font-medium text-gold-dark" dir="rtl">
                  أَهْلاً وَسَهْلاً
                </span>
                <span className="h-3 w-px bg-gold/40" />
                <span className="text-[10.5px] font-medium uppercase tracking-[0.24em] text-muted">
                  {BRAND.name} · Customer Care
                </span>
              </div>

              {/* Title */}
              <h1 className="mt-6 font-display text-[3.2rem] font-light leading-[1.02] text-ink sm:text-[4.2rem] lg:text-[4.6rem]">
                We&rsquo;re here
                <br />
                <span className="italic font-normal text-gold-dark">to help.</span>
              </h1>

              {/* Description */}
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted sm:text-[17px]">
                Questions about sizing, fabrics, an order or a delivery? Message us on Instagram or send us a note below — we are happy to help you find the styles that speak to you.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4 text-xs">
                <a
                  href={BRAND.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-ink px-5 py-3 font-medium uppercase tracking-wider text-bone shadow-xs transition hover:bg-gold-dark"
                >
                  Message {BRAND.instagram.handle}
                </a>
                <a
                  href="#inquiry-form"
                  className="inline-flex items-center gap-2 rounded-xs border border-gold/40 bg-bone px-4 py-2.5 font-medium uppercase tracking-wider text-ink shadow-xs transition hover:border-gold hover:bg-gold/10"
                >
                  Send a message ↓
                </a>
              </div>
            </Reveal>

            <Reveal from="right" delay={150} className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
              <div className="arch-sm relative overflow-hidden border border-gold/40 bg-paper px-8 pb-10 pt-16 text-center shadow-xl">
                <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.04]" />
                <div className="relative">
                  <Crescent className="mx-auto h-7 w-7 text-gold" />
                  <p className="mt-5 text-[10.5px] uppercase tracking-[0.22em] text-muted">Find us on Instagram</p>
                  <p className="mt-2 font-display text-[2rem] text-ink">{BRAND.instagram.handle}</p>
                  <p className="mx-auto mt-3 max-w-xs text-[13px] leading-relaxed text-muted">
                    New arrivals, collection updates and the quickest way to reach us.
                  </p>
                  <a
                    href={BRAND.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block border border-gold/60 px-7 py-3 text-[11.5px] uppercase tracking-brand text-gold-dark transition hover:bg-ink hover:text-gold-light"
                  >
                    Follow &amp; message us
                  </a>
                  <p className="mt-8 font-display text-[1.15rem] italic text-gold-dark">{BRAND.motto}</p>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ── Direct Channels ── */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
          <Reveal delay={0} from="up">
            <div className="h-full border border-line bg-paper p-7 shadow-xs transition hover:border-gold/40">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-gold/10 text-gold-dark">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold-dark" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" />
                  <circle cx="12" cy="2.5" r="0.8" fill="currentColor" />
                </svg>
              </div>
              <h3 className="mt-5 font-display text-[1.45rem] text-ink">Instagram</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Message our official account for sizing help, product questions and order updates.
              </p>
              <a href={BRAND.instagram.url} target="_blank" rel="noopener noreferrer" className="mt-4 block font-mono text-[13px] font-medium text-ink hover:text-gold-dark">
                {BRAND.instagram.handle}
              </a>
            </div>
          </Reveal>

          <Reveal delay={120} from="up">
            <div className="h-full border border-line bg-paper p-7 shadow-xs transition hover:border-gold/40">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-gold/10 text-gold-dark">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold-dark" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <rect x="5" y="2" width="14" height="20" rx="1" />
                  <path d="M5 6h4M5 10h6M5 14h4M5 18h6M13 2v20" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="mt-5 font-display text-[1.45rem] text-ink">Email</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                For order questions, or a damaged or incorrect item — include your order number and photos.
              </p>
              <a href={`mailto:${email}`} className="mt-4 block font-mono text-[13px] font-medium text-ink hover:text-gold-dark">
                {email}
              </a>
            </div>
          </Reveal>

          <Reveal delay={240} from="up" className="sm:col-span-2 lg:col-span-1">
            <div className="h-full border border-line bg-paper p-7 shadow-xs transition hover:border-gold/40">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-gold/10 text-gold-dark">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold-dark" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <rect x="3" y="8" width="18" height="13" rx="1" />
                  <path d="M12 8v13M3 13h18" strokeLinecap="round" />
                  <path d="M12 8c-2-3-5.5-3-5.5 0 0 2.5 5.5 5 5.5 5s5.5-2.5 5.5-5c0-3-3.5-3-5.5 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="mt-5 font-display text-[1.45rem] text-ink">Phone</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Prefer to talk? Call us for help choosing a size or with an order.
              </p>
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="mt-4 block font-mono text-[13px] font-medium text-ink hover:text-gold-dark">
                {phone}
              </a>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ── Contact form & FAQ ── */}
      <section id="inquiry-form" className="mx-auto max-w-[1400px] px-6 py-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          
          {/* Form */}
          <Reveal from="left">
            <div className="relative border border-line bg-paper p-8 shadow-xs sm:p-10">
              <Corner className="absolute -top-3 -left-3 h-10 w-10 text-gold/40" />

              <h2 className="font-display text-[2rem] font-light text-ink sm:text-[2.4rem]">
                Send us a message
              </h2>
              <p className="mt-2 text-sm text-muted">
                Fill in your details below and we will get back to you.
              </p>

              {submitted ? (
                <div className="mt-8 rounded-xs border border-gold/50 bg-sand/30 p-8 text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold/15 text-gold-dark">
                    ✓
                  </div>
                  <h3 className="mt-4 font-display text-[1.6rem] text-ink">Message Received with Gratitude</h3>
                  <p className="mt-2 text-sm text-muted">
                    Thank you for reaching out. We will review your message and reply to your email.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 inline-block text-[11px] uppercase tracking-brand text-gold-dark hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted font-medium">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Fatima Al-Zahra"
                        className="mt-2 w-full border border-line bg-bone px-4 py-3 text-sm outline-none transition focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted font-medium">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="your.email@domain.com"
                        className="mt-2 w-full border border-line bg-bone px-4 py-3 text-sm outline-none transition focus:border-gold"
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted font-medium">
                        Topic *
                      </label>
                      <select
                        required
                        className="mt-2 w-full border border-line bg-bone px-4 py-3 text-sm outline-none transition focus:border-gold"
                      >
                        <option value="sizing">Sizing help</option>
                        <option value="product">Product &amp; fabric questions</option>
                        <option value="order">Order &amp; delivery</option>
                        <option value="issue">Damaged or incorrect item</option>
                        <option value="other">Something else</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted font-medium">
                        Order Number (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. SY-1024"
                        className="mt-2 w-full border border-line bg-bone px-4 py-3 text-sm outline-none transition focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-muted font-medium">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="How can we help you today?"
                      className="mt-2 w-full border border-line bg-bone p-4 text-sm outline-none transition focus:border-gold"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-3 bg-ink px-9 py-4 text-[12px] font-medium uppercase tracking-brand text-bone shadow-sm transition hover:bg-gold-dark disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </Reveal>

          <Reveal from="right" delay={120} className="space-y-6">
            <div className="border border-line bg-paper p-8">
              <h3 className="font-display text-[1.5rem] text-ink">Our promise</h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{BRAND.philosophy[2]}</p>
              <p className="mt-4 font-display text-[1.1rem] italic text-gold-dark">{BRAND.motto}</p>
            </div>

            <div id="faq" className="border border-line bg-sand/30 p-8">
              <h3 className="font-display text-[1.5rem] text-ink">Frequently Asked Questions</h3>
              <FaqList className="mt-4" />
            </div>
          </Reveal>

        </div>
      </section>

      <Scallop className="mt-12 text-gold" />
    </div>
  );
}
