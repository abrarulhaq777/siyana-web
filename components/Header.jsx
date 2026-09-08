"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import Wordmark from "./Wordmark";
import { Star } from "./Ornament";
import { useStore } from "@/lib/store";

export default function Header({ categories = [], ticker = [] }) {
  const pathname = usePathname();
  const links = [
    { href: "/collections", label: "All Creations" },
    ...categories.map((c) => ({ href: `/collections?c=${c.slug}`, label: c.name })),
  ];

  const { count, wishlist } = useStore();
  const [open, setOpen] = useState(false);
  const solid = useSyncExternalStore(subscribeToScroll, () => window.scrollY > 24, () => false);

  return (
    <header className="sticky top-0 z-50">
      <div className={`border-b transition-colors duration-500 ${solid ? "border-line bg-paper/95 backdrop-blur-md shadow-xs" : "border-transparent bg-bone/90 backdrop-blur-sm"}`}>
        <div className="mx-auto grid h-20 max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 lg:px-10">
          <nav className="hidden items-center gap-6 text-[11px] uppercase tracking-[0.16em] lg:flex">
            {links.slice(0, 3).map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className={`underline-grow py-1 transition-colors ${
                    active ? "text-ink font-semibold" : "text-ink/80 hover:text-ink"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/offers"
              className={`underline-grow py-1 transition-colors ${
                pathname === "/offers" ? "text-gold-dark font-medium" : "text-ink/80 hover:text-ink"
              }`}
            >
              Offers
            </Link>
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

          <Link href="/" aria-label="Siyana — home" className="justify-self-center">
            <Wordmark />
          </Link>

          <div className="flex items-center justify-end gap-5">
            <nav className="hidden items-center gap-5 text-[11px] uppercase tracking-[0.16em] xl:flex mr-2">
              <Link
                href="/about"
                className={`underline-grow py-1 transition-colors ${
                  pathname === "/about" ? "text-ink font-semibold" : "text-muted hover:text-ink"
                }`}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`underline-grow py-1 transition-colors ${
                  pathname === "/contact" ? "text-ink font-semibold" : "text-muted hover:text-ink"
                }`}
              >
                Contact
              </Link>
            </nav>

            <Link href="/account" aria-label="Account" className="text-ink/80 hover:text-ink">
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" stroke="currentColor" strokeWidth="1.2" fill="none">
                <circle cx="12" cy="8" r="3.2" />
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
            <li>
              <Link
                href="/offers"
                className={`font-display text-2xl flex items-center justify-between transition-colors ${
                  pathname === "/offers" ? "text-gold-dark font-medium" : "text-ink"
                }`}
              >
                <span>Seasonal Offers</span>
                <span className="text-xs text-gold font-sans uppercase tracking-widest">
                  {pathname === "/offers" ? "Active" : "Privilege"}
                </span>
              </Link>
            </li>
            <li className="pt-3 border-t border-line grid grid-cols-2 gap-3 text-[12px] uppercase tracking-brand text-muted">
              <Link href="/about" className={`hover:text-ink ${pathname === "/about" ? "text-ink font-semibold" : ""}`}>
                About Us
              </Link>
              <Link href="/contact" className={`hover:text-ink ${pathname === "/contact" ? "text-ink font-semibold" : ""}`}>
                Contact Concierge
              </Link>
              <Link href="/account" className={`hover:text-ink ${pathname === "/account" ? "text-ink font-semibold" : ""}`}>
                My Account
              </Link>
              <Link href="/wishlist" className={`hover:text-ink ${pathname === "/wishlist" ? "text-ink font-semibold" : ""}`}>
                Saved Pieces ({wishlist.length})
              </Link>
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
  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold text-ink font-medium px-1 text-[11px] shadow-xs">
    {n}
  </span>
);

