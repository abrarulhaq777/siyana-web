import Link from "next/link";
import Wordmark from "./Wordmark";

const help = [
  ["Shipping & Discreet Delivery", "/help/shipping"],
  ["Returns & Modesty Exchange", "/help/returns"],
  ["Abaya Length & Size Guide", "/help/sizing"],
  ["Fabric Care (Nida & Crepe)", "/help/care"],
];

const house = [
  ["Our Story & Modesty Vision", "/about"],
  ["The Modesty Standard", "/#ethos"],
  ["Jummah & Eid Capsules", "/collections"],
  ["Contact Concierge", "/about#contact"],
];

export default function Footer({ categories = [], settings = {} }) {
  return (
    <footer className="mt-28 border-t border-line bg-paper">
      <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Wordmark className="!items-start" />
            <p className="mt-6 max-w-sm font-display text-[1.45rem] leading-snug text-ink/90">
              Modest wear crafted for dignity, grace, and the whole of an ordinary day.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-muted max-w-xs">
              Japanese Nida, washed linens, and Korean crepes. Certified 100% opaque, wudu-friendly,
              and tailored in small batches with artisanal care.
            </p>
          </div>

          <FooterCol title="Collections" items={categories.map((c) => [c.name, `/collections?c=${c.slug}`])} />
          <FooterCol title="Help & Sizing" items={help} />
          <FooterCol title="House of Siyana" items={house} />
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 text-[10px] uppercase tracking-[0.18em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {settings.storeName ?? "Siyana"} — All Rights Reserved</p>
          <div className="flex items-center gap-4 text-ink font-medium">
            <span>Discreet Packaging</span>
            <span className="text-muted/40">·</span>
            <span>UPI · Cards · COD</span>
            <span className="text-muted/40">·</span>
            <span>Worldwide Shipping</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <h4 className="text-[10px] uppercase tracking-brand text-ink font-medium">{title}</h4>
      <ul className="mt-6 space-y-3 text-sm text-muted">
        {items.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="underline-grow hover:text-ink">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

