"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { adminSignOut } from "../actions";

/* Nav only shows what this account may open — the server still enforces it. */
const ITEMS = [
  ["/admin", "Dashboard", null],
  ["/admin/orders", "Orders", "orders:read"],
  ["/admin/payments", "Payments", "payments:read"],
  ["/admin/products", "Catalogue", "products:read"],
  ["/admin/customers", "Customers", "customers:read"],
  ["/admin/content", "Storefront", "content:read"],
  ["/admin/staff", "Team", "staff:read"],
  ["/admin/account", "My account", null],
];

export default function Nav({ user, allowed }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = ITEMS.filter(([, , perm]) => !perm || allowed.includes(perm));

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Menu"
        aria-expanded={open}
        className="fixed left-4 top-4 z-50 grid h-10 w-10 place-items-center border border-line bg-paper lg:hidden"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" stroke="currentColor" strokeWidth="1.4" fill="none">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
        </svg>
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-paper transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-line px-6 py-6 pt-16 lg:pt-6">
          <p className="font-display text-[1.4rem] uppercase tracking-[0.24em] text-ink">Siyana</p>
          <p className="mt-1 text-[8px] uppercase tracking-brand text-muted">Control room</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {items.map(([href, label]) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2.5 text-[11px] uppercase tracking-[0.16em] transition ${
                  active ? "bg-ink text-bone" : "text-muted hover:bg-sand/60 hover:text-ink"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-line p-4">
          <p className="truncate text-xs text-ink">{user.name}</p>
          <p className="mt-0.5 text-[9.5px] uppercase tracking-[0.16em] text-gold-dark">
            {user.role === "admin" ? "Administrator" : `Staff · ${user.permissions.length} permissions`}
          </p>
          <form action={adminSignOut} className="mt-3">
            <button className="w-full border border-line px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-muted transition hover:border-gold hover:text-ink">
              Sign out
            </button>
          </form>
          <Link href="/" className="mt-2 block text-center text-[9.5px] uppercase tracking-[0.16em] text-muted hover:text-ink">
            View storefront →
          </Link>
        </div>
      </aside>

      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-ink/30 lg:hidden" />}
    </>
  );
}
