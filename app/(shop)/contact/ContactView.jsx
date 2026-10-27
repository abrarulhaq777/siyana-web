"use client";

import { useActionState, useState } from "react";
import Reveal from "@/components/Reveal";
import { Crescent, Star, Corner, Scallop } from "@/components/Ornament";
import { FaqList } from "@/components/FaqSection";
import { BRAND } from "@/lib/brand";
import { sendInquiry } from "./actions";

export default function ContactView({ email, phone, faq = [] }) {
  // Bumping the key remounts the form, which clears it and its send state.
  const [round, setRound] = useState(0);

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

              <InquiryForm key={round} onReset={() => setRound((r) => r + 1)} />
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
              <FaqList items={faq} className="mt-4" />
            </div>
          </Reveal>

        </div>
      </section>

      <Scallop className="mt-12 text-gold" />
    </div>
  );
}

const field = "mt-2 w-full border border-line bg-bone px-4 py-3 text-sm outline-none transition focus:border-gold";
const labelCls = "block text-[11px] uppercase tracking-wider text-muted font-medium";

/* Sends through a server action, which emails the store inbox (see ./actions.js). */
function InquiryForm({ onReset }) {
  const [state, action, isPending] = useActionState(sendInquiry, null);
  const v = state?.values ?? {};

  if (state?.ok) {
    return (
      <div className="mt-8 rounded-xs border border-gold/50 bg-sand/30 p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold/15 text-gold-dark">✓</div>
        <h3 className="mt-4 font-display text-[1.6rem] text-ink">Message Received with Gratitude</h3>
        <p className="mt-2 text-sm text-muted">Thank you for reaching out. We will review your message and reply to your email.</p>
        <button onClick={onReset} className="mt-6 inline-block text-[11px] uppercase tracking-brand text-gold-dark hover:underline">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form action={action} className="mt-8 space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className={labelCls}>
          Full Name *
          <input name="name" type="text" required maxLength={120} defaultValue={v.name} placeholder="e.g. Fatima Al-Zahra" className={field} />
        </label>
        <label className={labelCls}>
          Email Address *
          <input name="email" type="email" required maxLength={200} defaultValue={v.email} placeholder="your.email@domain.com" className={field} />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className={labelCls}>
          Topic *
          <select name="topic" required defaultValue={v.topic ?? "sizing"} className={field}>
            <option value="sizing">Sizing help</option>
            <option value="product">Product &amp; fabric questions</option>
            <option value="order">Order &amp; delivery</option>
            <option value="issue">Damaged or incorrect item</option>
            <option value="other">Something else</option>
          </select>
        </label>
        <label className={labelCls}>
          Order Number (Optional)
          <input name="order" type="text" maxLength={60} defaultValue={v.order} placeholder="e.g. SY-1024" className={field} />
        </label>
      </div>

      <label className={labelCls}>
        Message *
        <textarea name="message" required rows={4} maxLength={5000} defaultValue={v.message} placeholder="How can we help you today?" className={`${field} p-4`} />
      </label>

      {/* Spam trap: hidden from people, filled in by bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      {state?.error && (
        <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-3 bg-ink px-9 py-4 text-[12px] font-medium uppercase tracking-brand text-bone shadow-sm transition hover:bg-gold-dark disabled:opacity-50"
      >
        {isPending ? <span>Sending...</span> : <><span>Send Message</span><span>→</span></>}
      </button>
    </form>
  );
}
