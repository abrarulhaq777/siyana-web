"use client";

import Link from "next/link";
import Image from "next/image";
import { useActionState, useState } from "react";
import Reveal from "@/components/Reveal";
import { Corner } from "@/components/Ornament";
import { signIn, signUp } from "./actions";

export default function AuthPanel({ next }) {
  const [mode, setMode] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const signup = mode === "signup";
  const [state, action, isPending] = useActionState(signup ? signUp : signIn, null);

  return (
    <div className="bg-bone/40 pb-24 pt-6 sm:pt-10">
      <div className="mx-auto max-w-[1300px] px-6 lg:px-10">
        
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between border-b border-line/70 pb-4 text-xs">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-muted hover:text-ink">
              Home
            </Link>
            <span className="text-line">/</span>
            <span className="font-medium text-ink">
              {signup ? "Create Account" : "Sign In"}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16 items-center">
          
          {/* ══════════════════════════════════════ LEFT COLUMN · EDITORIAL LOOKBOOK CARD (5 cols) ══════════════════════════════════════ */}
          <div className="lg:col-span-5">
            <Reveal from="left">
              <div className="relative overflow-hidden rounded-[2px] border border-line bg-paper shadow-2xl">
                {/* High Fashion Lookbook Background Image */}
                <div className="relative aspect-[4/5.4] w-full overflow-hidden">
                  <Image
                    src="/images/hero/hero-siyana.jpg"
                    alt="Siyana Modest Collection"
                    fill
                    sizes="(max-width: 1024px) 100vw, 450px"
                    className="object-cover object-[50%_25%]"
                    priority
                  />
                  
                  {/* Subtle Dark Luxury Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
                  
                  {/* Inner Hairline Frame */}
                  <div className="pointer-events-none absolute inset-4 border border-white/15" />

                  {/* Card Content Overlay */}
                  <div className="relative z-10 flex h-full flex-col justify-between p-7 sm:p-9 text-bone">
                    
                    {/* Top Arabic Wordmark */}
                    <div className="flex items-center justify-between">
                      <span className="font-arabic text-[18px] text-gold-light" dir="rtl">
                        دار الصيانة
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.22em] text-white/80">
                        The Daily Modesty
                      </span>
                    </div>

                    {/* Bottom Poetic Narrative & Feature Pills */}
                    <div>
                      <span className="text-[10px] uppercase tracking-brand text-gold-light">
                        Atelier Vision
                      </span>
                      <h2 className="mt-2 font-display text-[2.2rem] font-light italic leading-tight text-white sm:text-[2.6rem]">
                        &ldquo;Grace in every thread,
                        <br />
                        dignity in every stride.&rdquo;
                      </h2>
                      <p className="mt-3 text-xs leading-relaxed text-bone/80">
                        Preserve your tailored 52&quot;–60&quot; abaya drop measurements, manage order dispatches, and access seasonal creations.
                      </p>

                      {/* Clean Understated Features */}
                      <div className="mt-6 flex flex-wrap gap-2 border-t border-white/20 pt-4 text-[11px] text-white/90">
                        <span className="rounded-xs border border-white/20 bg-black/40 px-2.5 py-1 backdrop-blur-xs">
                          ✓ Zero-Sheer Standard
                        </span>
                        <span className="rounded-xs border border-white/20 bg-black/40 px-2.5 py-1 backdrop-blur-xs">
                          ✓ Saved Sizing
                        </span>
                        <span className="rounded-xs border border-white/20 bg-black/40 px-2.5 py-1 backdrop-blur-xs">
                          ✓ Discreet Courier
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

                <Corner className="absolute -bottom-1 -left-1 z-20 h-8 w-8 -scale-y-100 text-gold/60" />
                <Corner className="absolute -bottom-1 -right-1 z-20 h-8 w-8 -scale-100 text-gold/60" />
              </div>
            </Reveal>
          </div>

          {/* ══════════════════════════════════════ RIGHT COLUMN · PROFESSIONAL AUTH FORM (7 cols) ══════════════════════════════════════ */}
          <div className="lg:col-span-7">
            <Reveal from="right" delay={120}>
              <div className="relative mx-auto max-w-lg rounded-xs border border-line bg-paper p-8 shadow-xl sm:p-11">
                <Corner className="absolute -top-2 -right-2 h-8 w-8 text-gold/40" />

                {/* Luxury Segmented Mode Switcher */}
                <div className="grid grid-cols-2 border border-line bg-bone/70 p-1">
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className={`py-2.5 text-[11.5px] font-medium uppercase tracking-brand transition ${
                      !signup
                        ? "bg-paper text-ink shadow-xs border border-line/60"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className={`py-2.5 text-[11.5px] font-medium uppercase tracking-brand transition ${
                      signup
                        ? "bg-paper text-ink shadow-xs border border-line/60"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* Headline */}
                <div className="mt-8">
                  <p className="text-[11px] uppercase tracking-brand text-gold-dark font-medium">
                    {signup ? "New to Siyana" : "Welcome Back"}
                  </p>
                  <h1 className="mt-2 font-display text-[2.4rem] font-light leading-none text-ink sm:text-[2.8rem]">
                    {signup ? "Create Your Account" : "Access Your Wardrobe"}
                  </h1>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    {signup
                      ? "Join our circle to save your measurements, manage orders, and unlock member courtesies."
                      : "Sign in with your registered email and credentials below."}
                  </p>
                </div>

                {/* Action Form */}
                <form key={mode} action={action} className="mt-8 space-y-5">
                  <input type="hidden" name="next" value={next} />

                  {state?.error && (
                    <div
                      role="alert"
                      className="flex items-start gap-2.5 rounded-xs border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-700 animate-fade-in"
                    >
                      <span className="font-bold">⚠</span>
                      <span>{state.error}</span>
                    </div>
                  )}

                  {signup && (
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-[11px] uppercase tracking-wider text-muted font-medium"
                      >
                        Full Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="e.g. Fatima Al-Zahra"
                        className="mt-2 w-full border border-line bg-bone px-4 py-3 text-sm text-ink outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/30"
                      />
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[11px] uppercase tracking-wider text-muted font-medium"
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="fatima@example.com"
                      className="mt-2 w-full border border-line bg-bone px-4 py-3 text-sm text-ink outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/30"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-[11px] uppercase tracking-wider text-muted font-medium"
                      >
                        Password *
                      </label>
                      {!signup && (
                        <Link
                          href="/contact?subject=reset"
                          className="text-[10.5px] uppercase tracking-wider text-gold-dark hover:underline"
                        >
                          Need Help?
                        </Link>
                      )}
                    </div>
                    <div className="relative mt-2">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        autoComplete={signup ? "new-password" : "current-password"}
                        placeholder={signup ? "At least 8 characters" : "Enter your password"}
                        className="w-full border border-line bg-bone px-4 py-3 pr-12 text-sm text-ink outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/30"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink font-medium"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {signup && (
                      <p className="mt-1.5 text-[10.5px] text-muted">
                        Must contain at least 8 characters for account security.
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="mt-2 w-full bg-ink py-4 text-[12px] font-medium uppercase tracking-brand text-bone shadow-sm transition hover:bg-gold-dark disabled:opacity-50"
                  >
                    {isPending ? (
                      <span>Verifying...</span>
                    ) : (
                      <span>{signup ? "Complete Registration" : "Sign In to Account"}</span>
                    )}
                  </button>
                </form>

                {/* Alternate Action Toggle */}
                <div className="mt-7 border-t border-line/70 pt-5 text-center">
                  <button
                    type="button"
                    onClick={() => setMode(signup ? "signin" : "signup")}
                    className="text-[12px] uppercase tracking-[0.16em] text-gold-dark hover:text-ink hover:underline font-medium transition"
                  >
                    {signup
                      ? "Already have an account? Sign in here →"
                      : "New to Siyana? Create your account →"}
                  </button>
                </div>

                {/* Terms & Privacy */}
                <p className="mt-6 text-center text-[11px] leading-relaxed text-muted">
                  By proceeding, you agree to Siyana&apos;s{" "}
                  <Link href="/help/terms" className="underline hover:text-ink">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/help/privacy" className="underline hover:text-ink">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </div>
  );
}
