"use client";

import Link from "next/link";
import ProductMedia from "@/components/ProductMedia";
import Empty from "@/components/Empty";
import { inr } from "@/lib/products";
import { useStore } from "@/lib/store";

export default function CartView({ settings }) {
  const { hydrated, lines, subtotal, setQty } = useStore();
  if (!hydrated) return null;

  if (lines.length === 0)
    return <Empty title="Your bag is empty" copy="Nothing set aside yet." href="/collections" cta="Browse the collection" />;

  const freeAbove = settings.freeShippingAbove;
  const shipping = subtotal >= freeAbove ? 0 : settings.shippingFee;

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
      <h1 className="font-display text-[3rem] font-light leading-none">Your bag</h1>

      <div className="mt-14 grid gap-16 lg:grid-cols-[1.5fr_0.7fr]">
        <ul className="divide-y divide-line border-y border-line">
          {lines.map((l) => (
            <li key={l.slug + l.size} className="flex gap-6 py-8">
              <Link href={`/product/${l.slug}`} className="w-28 shrink-0">
                <ProductMedia product={l.product} />
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex justify-between gap-6">
                    <Link href={`/product/${l.slug}`} className="font-display text-[1.5rem] leading-tight">
                      {l.product.name}
                    </Link>
                    <span className="text-sm">{inr(l.product.price * l.qty)}</span>
                  </div>
                  <p className="mt-2 text-[12px] uppercase tracking-[0.18em] text-muted">
                    Size {l.size} · {l.product.colorName}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center border border-line">
                    <Step onClick={() => setQty(l.slug, l.size, l.qty - 1)} label="Decrease quantity">−</Step>
                    <span className="w-9 text-center text-xs">{l.qty}</span>
                    <Step onClick={() => setQty(l.slug, l.size, l.qty + 1)} label="Increase quantity">+</Step>
                  </div>
                  <button
                    onClick={() => setQty(l.slug, l.size, 0)}
                    className="underline-grow text-[12px] uppercase tracking-[0.18em] text-muted hover:text-ink"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="lg:sticky lg:top-40 lg:self-start">
          <h2 className="text-[12px] uppercase tracking-brand">Summary</h2>
          <dl className="mt-8 space-y-4 border-t border-line pt-8 text-sm">
            <Line k="Subtotal" v={inr(subtotal)} />
            <Line k="Shipping" v={shipping === 0 ? "Complimentary" : inr(shipping)} />
            <div className="flex justify-between border-t border-line pt-5 font-display text-2xl">
              <dt>Total</dt>
              <dd>{inr(subtotal + shipping)}</dd>
            </div>
          </dl>

          {shipping > 0 && (
            <p className="mt-5 text-[13px] leading-relaxed text-muted">
              Add {inr(freeAbove - subtotal)} more for complimentary shipping.
            </p>
          )}

          <Link
            href="/checkout"
            className="mt-8 block bg-ink py-4 text-center text-[12px] uppercase tracking-brand text-bone transition hover:bg-sage"
          >
            Proceed to checkout
          </Link>
          <Link href="/collections" className="mt-4 block text-center text-[12px] uppercase tracking-[0.18em] text-muted hover:text-ink">
            Continue shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}

const Line = ({ k, v }) => (
  <div className="flex justify-between text-muted">
    <dt>{k}</dt>
    <dd className="text-ink">{v}</dd>
  </div>
);

const Step = ({ onClick, label, children }) => (
  <button onClick={onClick} aria-label={label} className="h-9 w-9 text-sm transition hover:bg-blush">
    {children}
  </button>
);
