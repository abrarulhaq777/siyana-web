import Link from "next/link";
import Wordmark from "./Wordmark";
import { BRAND } from "@/lib/brand";

const help = [
  ["Frequently Asked Questions", "/contact#faq"],
  ["Contact Us", "/contact"],
  ["My Account & Orders", "/account"],
  [`Instagram ${BRAND.instagram.handle}`, BRAND.instagram.url],
];

const house = [
  ["About Siyana Daily Modesty", "/about"],
  ["Our Philosophy", "/#ethos"],
  ["All Collections", "/collections"],
];

export default function Footer({ categories = [] }) {
  return (
    <footer className="mt-28 border-t border-line bg-paper">
      <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Wordmark className="!items-start" />
            <p className="mt-6 max-w-sm font-display text-[1.45rem] leading-snug text-ink/90">
              {BRAND.tagline}.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-muted max-w-xs">
              {BRAND.promise} — co-ord sets, elegant maxi dresses, imported denim and beautifully detailed
              outfits for every moment.
            </p>
          </div>

          <FooterCol title="Collections" items={categories.map((c) => [c.name, `/collections?c=${c.slug}`])} />
          <FooterCol title="Customer Care" items={help} />
          <FooterCol title="Siyana" items={house} />
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 text-[12px] uppercase tracking-[0.18em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {BRAND.name} — All Rights Reserved</p>
          <p className="text-ink font-medium">{BRAND.motto}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <h4 className="text-[12px] uppercase tracking-brand text-ink font-medium">{title}</h4>
      <ul className="mt-6 space-y-3 text-sm text-muted">
        {items.map(([label, href]) => (
          <li key={label}>
            {href.startsWith("http") ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className="underline-grow hover:text-ink">{label}</a>
            ) : (
              <Link href={href} className="underline-grow hover:text-ink">{label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

