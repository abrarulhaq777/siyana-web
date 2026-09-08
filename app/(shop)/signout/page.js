import Link from "next/link";
import { Rosette } from "@/components/Ornament";

export const metadata = {
  title: "Signed Out — Siyana",
  description: "You have been signed out of your Siyana Account.",
};

export default function SignOutPage() {
  return (
    <div className="bg-bone/40 pb-28 pt-16 lg:pt-24">
      <div className="mx-auto max-w-xl px-6 text-center">
        <div className="relative overflow-hidden rounded-xs border border-line bg-paper p-10 shadow-xl sm:p-14">
          <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.03]" />
          
          <div className="relative">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold-dark">
              <Rosette className="h-7 w-7 text-gold" />
            </div>

            <span className="mt-5 block font-arabic text-[22px] font-medium text-gold-dark" dir="rtl">
              مَعَ السَّلَامَة
            </span>

            <p className="mt-2 text-[10.5px] uppercase tracking-[0.24em] text-muted font-medium">
              Siyana Modesty Atelier
            </p>

            <h1 className="mt-4 font-display text-[2.4rem] font-light leading-snug text-ink sm:text-[2.8rem]">
              Signed Out with Peace
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-muted">
              You have been safely signed out of your Siyana Account. Your cart items and tailored drop preferences remain safely preserved for your next visit.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/account"
                className="bg-ink px-7 py-3.5 text-[12px] font-medium uppercase tracking-brand text-bone shadow-xs transition hover:bg-gold-dark"
              >
                Sign In Again
              </Link>
              <Link
                href="/"
                className="border border-line bg-bone px-7 py-3.5 text-[12px] font-medium uppercase tracking-brand text-ink transition hover:border-gold"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
