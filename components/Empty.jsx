import Link from "next/link";

export default function Empty({ title, copy, href, cta }) {
  return (
    <section className="mx-auto max-w-md px-6 py-40 text-center">
      <div className="arch mx-auto h-20 w-16 border border-line" />
      <h1 className="mt-10 font-display text-[2.4rem] font-light leading-none">{title}</h1>
      <p className="mt-4 text-sm text-muted">{copy}</p>
      <Link
        href={href}
        className="mt-9 inline-block bg-ink px-9 py-4 text-[10px] uppercase tracking-brand text-bone transition hover:bg-sage"
      >
        {cta}
      </Link>
    </section>
  );
}
