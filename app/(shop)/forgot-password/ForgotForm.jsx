"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Crescent } from "@/components/Ornament";
import { requestPasswordReset } from "../account/actions";

export function AuthCard({ title, intro, children }) {
  return (
    <div className="bg-bone/40 px-6 py-16 sm:py-24">
      <div className="arch-sm relative mx-auto max-w-md overflow-hidden border border-gold/40 bg-paper px-8 pb-10 pt-16 shadow-sm sm:px-10">
        <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.035]" />
        <div className="relative">
          <Crescent className="mx-auto h-7 w-7 text-gold" />
          <h1 className="mt-5 text-center font-display text-[2.2rem] font-light leading-tight text-ink">{title}</h1>
          {intro && <p className="mx-auto mt-3 max-w-xs text-center text-sm leading-relaxed text-muted">{intro}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

export const fieldCls =
  "mt-2 w-full border border-line bg-bone px-4 py-3 text-sm text-ink outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/30";
export const labelCls = "block text-[11px] font-medium uppercase tracking-wider text-muted";
export const buttonCls =
  "w-full bg-ink py-4 text-[12px] font-medium uppercase tracking-brand text-bone transition hover:bg-gold-dark disabled:opacity-50";

export default function ForgotForm() {
  const [state, action, isPending] = useActionState(requestPasswordReset, null);

  if (state?.ok) {
    return (
      <AuthCard title="Check your email" intro={`If an account exists for ${state.email}, we have sent a link to reset your password.`}>
        <p className="text-center text-xs leading-relaxed text-muted">
          The link works for one hour. Nothing arrived? Check your spam folder, or try again in a couple of minutes.
        </p>
        <Link href="/signin" className={`${buttonCls} mt-6 block text-center`}>
          Back to sign in
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Forgot your password?" intro="Enter the email you use for your account and we will send you a link to choose a new one.">
      <form action={action} className="space-y-5">
        <label className={labelCls}>
          Email address
          <input name="email" type="email" required autoComplete="email" autoFocus className={fieldCls} placeholder="you@example.com" />
        </label>
        {state?.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
        <button type="submit" disabled={isPending} className={buttonCls}>
          {isPending ? "Sending…" : "Send reset link"}
        </button>
        <p className="text-center text-[12px] uppercase tracking-[0.16em] text-muted">
          <Link href="/signin" className="underline-grow hover:text-ink">← Back to sign in</Link>
        </p>
      </form>
    </AuthCard>
  );
}
