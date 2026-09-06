"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import Wordmark from "./Wordmark";
import { Star } from "./Ornament";
import { useStore } from "@/lib/store";

export default function Header({ categories = [], ticker = [] }) {
  const links = [
    { href: "/collections", label: "All Creations" },
    ...categories.map((c) => ({ href: `/collections?c=${c.slug}`, label: c.name })),
  ];

  const { count, wishlist } = useStore();
  const [open, setOpen] = useState(false);
  const solid = useSyncExternalStore(subscribeToScroll, () => window.scrollY > 24, () => false);

  return (
    <header className="sticky top-0 z-50">
      <div className="overflow-hidden border-b border-gold/20 bg-ink py-2">
        <div className="animate-marquee flex w-max whitespace-nowrap text-[9px] uppercase tracking-brand text-bone/85">
          {[0, 1].map((n) => (
            <span key={n} className="flex shrink-0 items-center" aria-hidden={n === 1}>
              {ticker.map((t) => (
                <span key={t} className="flex items-center">
                  <span className="px-7">{t}</span>
                  <Star className="h-2.5 w-2.5 shrink-0 text-gold/70" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className={`border-b transition-colors duration-500 ${solid ? "border-line bg-paper/95 backdrop-blur-md shadow-xs" : "border-transparent bg-bone/90 backdrop-blur-sm"}`}>
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 lg:px-10">
          <nav className="hidden items-center gap-7 text-[9.5px] uppercase tracking-[0.22em] lg:flex">
            {links.slice(0, 5).map((l) => (
              <Link key={l.label} href={l.href} className="underline-grow py-1 text-ink/80 hover:text-ink">
                {l.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
            className="lg:hidden p-1 text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" strokeWidth="1.2" fill="none">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
            </svg>
          </button>

          <Link href="/" aria-label="Siyana — home" className="absolute left-1/2 -translate-x-1/2">
            <Wordmark />
          </Link>

          <div className="flex items-center gap-5">
            <Link href="/account" aria-label="Account" className="hidden sm:block text-ink/80 hover:text-ink">
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" stroke="currentColor" strokeWidth="1.2" fill="none">
                <circle cx="12" cy="8" r="3.4" />
                <path d="M4.5 20c1.4-3.8 4.2-5.6 7.5-5.6s6.1 1.8 7.5 5.6" />
              </svg>
            </Link>

            <Link href="/wishlist" aria-label="Wishlist" className="relative text-ink/80 hover:text-ink">
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" stroke="currentColor" strokeWidth="1.2" fill="none">
                <path d="M12 20.5S3.8 15 3.8 9.4A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8.2 2.4C20.2 15 12 20.5 12 20.5Z" />
              </svg>
              {wishlist.length > 0 && <Dot n={wishlist.length} />}
            </Link>

            <Link href="/cart" aria-label="Cart" className="relative text-ink/80 hover:text-ink">
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" stroke="currentColor" strokeWidth="1.2" fill="none">
                <path d="M5 7h14l-1.2 13H6.2L5 7Z" />
                <path d="M9 7a3 3 0 0 1 6 0" />
              </svg>
              {count > 0 && <Dot n={count} />}
            </Link>
          </div>
        </div>
      </div>

      {open && (
        <nav onClick={() => setOpen(false)} className="border-b border-line bg-paper px-6 py-6 lg:hidden shadow-lg">
          <ul className="space-y-4">
            {links.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="font-display text-2xl flex items-center justify-between">
                  <span>{l.label}</span>
                  <span className="text-xs text-gold font-sans uppercase tracking-widest">Explore</span>
                </Link>
              </li>
            ))}
            <li className="pt-3 border-t border-line flex items-center justify-between text-[10px] uppercase tracking-brand text-muted">
              <Link href="/account">My Account</Link>
              <Link href="/wishlist">Saved Pieces ({wishlist.length})</Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

const subscribeToScroll = (cb) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};

const Dot = ({ n }) => (
  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold text-ink font-medium px-1 text-[9px] shadow-xs">
    {n}
  </span>
);

