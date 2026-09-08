"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import { Crescent, Star, Corner, Scallop } from "@/components/Ornament";

const DROP_PRESETS = [
  { drop: '52"', height: "5'0\" – 5'2\"", cm: "152 – 157 cm", desc: "Flawless ankle graze for flats and everyday wear." },
  { drop: '54"', height: "5'3\" – 5'4\"", cm: "160 – 163 cm", desc: "Our most requested standard drop length." },
  { drop: '56"', height: "5'5\" – 5'6\"", cm: "165 – 168 cm", desc: "Graceful floor sweep, ideal with modest 1–2\" heels." },
  { drop: '58"', height: "5'7\" – 5'8\"", cm: "170 – 173 cm", desc: "Extended length for taller modest silhouettes." },
  { drop: '60"', height: "5'9\" +", cm: "175+ cm", desc: "Statuesque floor sweep with complete ankle coverage." },
];

export default function ContactView() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDrop, setSelectedDrop] = useState(DROP_PRESETS[1]); // default 54"

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
      
      {/* ── 01 · Hero Section · Concierge Majlis & Sizing Salon ── */}
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-paper/95 via-sand/20 to-bone/40 py-16 lg:py-20">
        <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.035]" />
        
        {/* Soft Ambient Radiance */}
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-gold/10 blur-[120px]" />

        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            
            {/* Left Column · Concierge Majlis Greeting (7 cols) */}
            <Reveal from="left" className="lg:col-span-7">
              {/* Arabic Greeting */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-arabic text-[24px] font-medium text-gold-dark" dir="rtl">
                  أَهْلاً وَسَهْلاً
                </span>
                <span className="h-3 w-px bg-gold/40" />
                <span className="text-[10.5px] font-medium uppercase tracking-[0.24em] text-muted">
                  House of Siyana · Client Concierge
                </span>
              </div>

              {/* Title */}
              <h1 className="mt-6 font-display text-[3.2rem] font-light leading-[1.02] text-ink sm:text-[4.2rem] lg:text-[4.6rem]">
                We are honored to
                <br />
                <span className="italic font-normal text-gold-dark">assist your journey.</span>
              </h1>

              {/* Description */}
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted sm:text-[17px]">
                Whether you need assistance choosing the perfect drop length for an upcoming celebration, fabric opacity guidance, or custom trousseau consultation, our atelier team is at your service.
              </p>

              {/* Quick Communication Access Strip */}
              <div className="mt-8 flex flex-wrap items-center gap-4 text-xs">
                <a
                  href="#inquiry-form"
                  className="inline-flex items-center gap-2 rounded-xs border border-gold/40 bg-bone px-4 py-2.5 font-medium uppercase tracking-wider text-ink shadow-xs transition hover:border-gold hover:bg-gold/10"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-gold-dark" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21.5 2L10 13.5M21.5 2l-7 19.5-4-8.5-8.5-4 19.5-7z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Send Atelier Inquiry
                </a>
                <span className="text-muted font-mono text-[11px]">
                  Direct: <strong className="text-ink font-semibold">care@siyana.example</strong>
                </span>
              </div>
            </Reveal>

            {/* Right Column · Interactive Abaya Drop Length Finder (5 cols) */}
            <Reveal from="right" delay={150} className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
              <div className="relative overflow-hidden rounded-xs border border-gold/40 bg-paper p-6 shadow-xl sm:p-7">
                <Corner className="absolute -top-2 -right-2 h-8 w-8 text-gold/50" />
                
                <div className="flex items-center justify-between border-b border-line/80 pb-3.5">
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold-dark" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <path d="M12 2v20M8 5l4-3 4 3M8 19l4 3 4-3M5 9h14M7 15h10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-ink">
                      Quick Drop Guide (52&quot;–60&quot;)
                    </span>
                  </div>
                  <span className="font-arabic text-sm text-gold-dark">دليل المقاسات</span>
                </div>

                <p className="mt-3 text-xs text-muted">
                  Tap your height to see the recommended abaya drop length:
                </p>

                {/* Drop Length Pills Selector */}
                <div className="mt-4 grid grid-cols-5 gap-1.5">
                  {DROP_PRESETS.map((preset) => (
                    <button
                      key={preset.drop}
                      type="button"
                      onClick={() => setSelectedDrop(preset)}
                      className={`flex flex-col items-center justify-center rounded-xs border py-2.5 transition ${
                        selectedDrop.drop === preset.drop
                          ? "border-gold bg-gold/15 text-gold-dark font-bold shadow-xs"
                          : "border-line bg-bone/60 text-ink/70 hover:border-gold/40 hover:bg-gold/5"
                      }`}
                    >
                      <span className="font-display text-[15px] leading-tight">{preset.drop}</span>
                      <span className="text-[9px] uppercase tracking-wider text-muted">Drop</span>
                    </button>
                  ))}
                </div>

                {/* Active Drop Card */}
                <div className="mt-4 rounded-xs border border-gold/20 bg-sand/30 p-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted">Height Fit</span>
                      <p className="font-display text-[17px] font-medium text-ink">
                        {selectedDrop.height}
                      </p>
                    </div>
                    <span className="font-mono text-[11px] text-gold-dark font-medium">
                      {selectedDrop.cm}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    {selectedDrop.desc}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between text-[11px] text-muted">
                  <span>Shoulder-to-hem standard</span>
                  <a href="#inquiry-form" className="text-gold-dark hover:underline font-medium">
                    Need Custom Hem? ↓
                  </a>
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
              <h3 className="mt-5 font-display text-[1.45rem] text-ink">Concierge Care</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                For general inquiries, order status, and worldwide delivery support.
              </p>
              <p className="mt-4 font-mono text-[13px] font-medium text-ink">
                care@siyana.example
              </p>
              <p className="mt-1 text-[11px] text-muted">Response within 24 business hours</p>
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
              <h3 className="mt-5 font-display text-[1.45rem] text-ink">Size & Drop Consultation</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Unsure which drop length to choose for your height and footwear? We provide tailored advice.
              </p>
              <p className="mt-4 font-mono text-[13px] font-medium text-ink">
                sizing@siyana.example
              </p>
              <p className="mt-1 text-[11px] text-muted">Mon–Sat, 10:00 AM – 7:00 PM IST</p>
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
              <h3 className="mt-5 font-display text-[1.45rem] text-ink">Bespoke & Gifting</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Nikah bridal trousseaus, ceremonial kaftans, and curated modest corporate gifts.
              </p>
              <p className="mt-4 font-mono text-[13px] font-medium text-ink">
                bespoke@siyana.example
              </p>
              <p className="mt-1 text-[11px] text-muted">Includes complimentary calligraphic gift boxes</p>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ── Contact Form & Atelier Details ── */}
      <section id="inquiry-form" className="mx-auto max-w-[1400px] px-6 py-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          
          {/* Form */}
          <Reveal from="left">
            <div className="relative border border-line bg-paper p-8 shadow-xs sm:p-10">
              <Corner className="absolute -top-3 -left-3 h-10 w-10 text-gold/40" />

              <h2 className="font-display text-[2rem] font-light text-ink sm:text-[2.4rem]">
                Send an Inquiry to the Atelier
              </h2>
              <p className="mt-2 text-sm text-muted">
                Fill out your details below and a client advisor will be in touch shortly.
              </p>

              {submitted ? (
                <div className="mt-8 rounded-xs border border-gold/50 bg-sand/30 p-8 text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold/15 text-gold-dark">
                    ✓
                  </div>
                  <h3 className="mt-4 font-display text-[1.6rem] text-ink">Message Received with Gratitude</h3>
                  <p className="mt-2 text-sm text-muted">
                    Thank you for reaching out. An advisor will review your notes and reply to your email within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 inline-block text-[11px] uppercase tracking-brand text-gold-dark hover:underline"
                  >
                    Send another inquiry
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
                        Inquiry Category *
                      </label>
                      <select
                        required
                        className="mt-2 w-full border border-line bg-bone px-4 py-3 text-sm outline-none transition focus:border-gold"
                      >
                        <option value="sizing">Abaya Length &amp; Size Consultation (52&quot;–60&quot;)</option>
                        <option value="fabric">Fabric Opacity & Weave Questions</option>
                        <option value="order">Order Tracking & Shipping Assistance</option>
                        <option value="bespoke">Bespoke Nikah & Festive Trousseau</option>
                        <option value="other">General Inquiries</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted font-medium">
                        Your Height & Footwear (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5'5&quot; with 1.5&quot; heels"
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
                      placeholder="How may our concierge assist you today?"
                      className="mt-2 w-full border border-line bg-bone p-4 text-sm outline-none transition focus:border-gold"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-3 bg-ink px-9 py-4 text-[12px] font-medium uppercase tracking-brand text-bone shadow-sm transition hover:bg-gold-dark disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Sending to Atelier...</span>
                    ) : (
                      <>
                        <span>Transmit Message</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </Reveal>

          {/* Siyana Assurances & FAQs */}
          <Reveal from="right" delay={120} className="space-y-6">
            <div className="border border-line bg-paper p-8">
              <h3 className="font-display text-[1.5rem] text-ink">The Siyana Care Standard</h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
                Every client inquiry is reviewed by someone who personally understands modest cutting, fabric behavior, and the sacred balance between uncompromised coverage and ease in movement.
              </p>
              
              <ul className="mt-6 space-y-3 border-t border-line pt-6 text-xs text-muted">
                <li className="flex items-center gap-2.5">
                  <span className="text-gold-dark text-[11px] font-semibold">✓</span>
                  <span>Free exchanges on sizing within 7 days</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-gold-dark text-[11px] font-semibold">✓</span>
                  <span>Complimentary length adjustment guidance</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-gold-dark text-[11px] font-semibold">✓</span>
                  <span>Discreet, unbranded premium protective mailers</span>
                </li>
              </ul>
            </div>

            <div className="border border-line bg-sand/30 p-8">
              <h3 className="font-display text-[1.5rem] text-ink">Frequently Asked Questions</h3>
              <div className="mt-4 space-y-4 text-xs leading-relaxed text-muted">
                <div>
                  <p className="font-semibold text-ink">How do I choose between 52&quot; and 56&quot; abayas?</p>
                  <p className="mt-1">
                    Measure from the highest point of your shoulder down to the top of your shoes. If you stand 5&apos;2&quot;–5&apos;4&quot;, 52&quot; to 54&quot; usually provides the ideal ankle-sweeping clearance without dragging.
                  </p>
                </div>
                <div className="border-t border-line/60 pt-3">
                  <p className="font-semibold text-ink">Are lighter shades like Ivory and Pale Sage zero-sheer?</p>
                  <p className="mt-1">
                    Yes. All Siyana light tones use specialized dense-spun Japanese Nida or double-lined weaves to guarantee zero transparency under direct sun.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

        </div>
      </section>

      <Scallop className="mt-12 text-gold" />
    </div>
  );
}
