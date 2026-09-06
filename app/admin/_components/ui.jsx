"use client";

import { useFormStatus } from "react-dom";

/* Small, boring admin primitives. Density over drama — this is a work tool. */

export function Button({ children, variant = "primary", className = "", ...rest }) {
  const styles = {
    primary: "bg-ink text-bone hover:bg-gold-dark",
    ghost: "border border-line bg-paper text-ink hover:border-gold",
    danger: "border border-red-300 bg-white text-red-700 hover:bg-red-50",
  };
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[11px] uppercase tracking-[0.16em] transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

/** Disables itself while the surrounding server action is in flight. */
export function Submit({ children = "Save", variant = "primary", className = "" }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={variant} disabled={pending} className={className}>
      {pending ? "Working…" : children}
    </Button>
  );
}

export function Notice({ state }) {
  if (!state?.ok && !state?.error) return null;
  return (
    <p
      role="status"
      className={`px-4 py-3 text-xs ${
        state.ok ? "border border-sage/30 bg-sage/10 text-sage" : "border border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {state.ok ? state.message : state.error}
    </p>
  );
}

export function Field({ label, hint, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[10px] uppercase tracking-[0.18em] text-muted">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[10px] text-muted/80">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "mt-1.5 w-full border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none transition focus:border-gold";

export function Input(props) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function Textarea(props) {
  return <textarea {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function Select({ children, ...props }) {
  return (
    <select {...props} className={`${inputClass} ${props.className ?? ""}`}>
      {children}
    </select>
  );
}

const badgeTones = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  confirmed: "bg-blue-50 text-blue-800 border-blue-200",
  packed: "bg-indigo-50 text-indigo-800 border-indigo-200",
  shipped: "bg-violet-50 text-violet-800 border-violet-200",
  delivered: "bg-emerald-50 text-emerald-800 border-emerald-200",
  cancelled: "bg-rose-50 text-rose-800 border-rose-200",
  paid: "bg-emerald-50 text-emerald-800 border-emerald-200",
  failed: "bg-rose-50 text-rose-800 border-rose-200",
  refunded: "bg-stone-100 text-stone-700 border-stone-300",
  partially_refunded: "bg-stone-100 text-stone-700 border-stone-300",
  active: "bg-emerald-50 text-emerald-800 border-emerald-200",
  disabled: "bg-stone-100 text-stone-600 border-stone-300",
};

export function Badge({ children, tone }) {
  return (
    <span
      className={`inline-block whitespace-nowrap border px-2 py-0.5 text-[9.5px] uppercase tracking-[0.14em] ${
        badgeTones[tone] ?? "border-line bg-sand/60 text-muted"
      }`}
    >
      {String(children).replace(/_/g, " ")}
    </span>
  );
}
