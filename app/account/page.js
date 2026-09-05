"use client";

import Link from "next/link";
import { useState } from "react";

export default function AccountPage() {
  const [mode, setMode] = useState("signin");
  const signup = mode === "signup";

  return (
    <section className="mx-auto grid max-w-[1400px] gap-16 px-6 py-20 lg:grid-cols-2 lg:px-10">
      <div className="arch relative hidden overflow-hidden bg-sage lg:block">
        <div className="pattern-girih absolute inset-0 opacity-[0.16] invert" />
        <div className="arch absolute inset-x-14 inset-y-12 border border-white/20" />
        <p className="absolute bottom-16 left-0 right-0 px-12 text-center font-display text-[2rem] italic leading-snug text-white/85">
          Your wardrobe,
          <br />
          remembered.
        </p>
      </div>

      <div className="mx-auto w-full max-w-sm self-center">
        <p className="text-[10px] uppercase tracking-brand text-muted">{signup ? "New here" : "Welcome back"}</p>
        <h1 className="mt-5 font-display text-[2.8rem] font-light leading-none">
          {signup ? "Create account" : "Sign in"}
        </h1>

        {/* ponytail: no auth backend yet — swap onSubmit for the real call. */}
        <form className="mt-10 space-y-6" onSubmit={(e) => e.preventDefault()}>
          {signup && <Field label="Full name" name="name" autoComplete="name" />}
          <Field label="Email" name="email" type="email" autoComplete="email" />
          <Field
            label="Password"
            name="password"
            type="password"
            minLength={8}
            autoComplete={signup ? "new-password" : "current-password"}
          />
          <button className="w-full bg-ink py-4 text-[10px] uppercase tracking-brand text-bone transition hover:bg-sage">
            {signup ? "Create account" : "Sign in"}
          </button>
        </form>

        <button
          onClick={() => setMode(signup ? "signin" : "signup")}
          className="mt-8 text-[10px] uppercase tracking-[0.18em] text-muted hover:text-ink"
        >
          {signup ? "Already have an account? Sign in" : "New to Siyana? Create an account"}
        </button>

        <p className="mt-10 border-t border-line pt-6 text-[11px] leading-relaxed text-muted">
          By continuing you agree to our{" "}
          <Link href="/help/terms" className="underline-grow text-ink">terms</Link> and{" "}
          <Link href="/help/privacy" className="underline-grow text-ink">privacy policy</Link>.
        </p>
      </div>
    </section>
  );
}

function Field({ label, name, ...rest }) {
  return (
    <div>
      <label htmlFor={name} className="text-[10px] uppercase tracking-[0.18em] text-muted">{label}</label>
      <input
        id={name}
        name={name}
        required
        {...rest}
        className="mt-2 w-full border-b border-ink/20 bg-transparent py-3 text-sm outline-none focus:border-ink"
      />
    </div>
  );
}
