"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import Stars from "@/components/Stars";
import { Divider } from "@/components/Ornament";
import { submitReview } from "./reviewActions";

export default function Reviews({ slug, reviews, rating, count, signedIn, sizes }) {
  const [state, action] = useActionState(submitReview, null);
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(5);

  // Distribution bars, so the average has some context behind it.
  const spread = [5, 4, 3, 2, 1].map((n) => ({
    n,
    count: reviews.filter((r) => r.rating === n).length,
  }));

  return (
    <section id="reviews" className="border-t border-line bg-paper py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Divider label="Reviews" />

        <div className="mt-10 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <h2 className="font-display text-[2.4rem] font-light leading-none">
              {count > 0 ? "What she said" : "No reviews yet"}
            </h2>

            {count > 0 ? (
              <>
                <div className="mt-6 flex items-center gap-4">
                  <span className="font-display text-[3rem] leading-none text-ink">{rating.toFixed(1)}</span>
                  <div>
                    <Stars value={rating} size="h-4 w-4" />
                    <p className="mt-1.5 text-[12px] uppercase tracking-[0.14em] text-muted">
                      {count} {count === 1 ? "review" : "reviews"}
                    </p>
                  </div>
                </div>

                <ul className="mt-8 space-y-2">
                  {spread.map(({ n, count: c }) => (
                    <li key={n} className="flex items-center gap-3 text-[12px] text-muted">
                      <span className="w-3">{n}</span>
                      <span className="h-1.5 flex-1 bg-line">
                        <span
                          className="block h-full bg-gold transition-all duration-700"
                          style={{ width: count ? `${(c / count) * 100}%` : 0 }}
                        />
                      </span>
                      <span className="w-6 text-right">{c}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-5 text-[15px] leading-relaxed text-muted">
                Be the first to say how this piece wears.
              </p>
            )}

            {signedIn ? (
              <button
                onClick={() => setOpen((o) => !o)}
                className="mt-8 border border-ink px-7 py-3.5 text-[12px] font-medium uppercase tracking-brand text-ink transition hover:bg-ink hover:text-bone"
              >
                {open ? "Close" : "Write a review"}
              </button>
            ) : (
              <p className="mt-8 text-[13px] text-muted">
                <Link href={`/account?next=/product/${slug}`} className="underline-grow text-ink">Sign in</Link>{" "}
                to leave a review.
              </p>
            )}

            {open && signedIn && (
              <form action={action} className="mt-6 space-y-5 border border-line bg-bone p-6">
                <input type="hidden" name="slug" value={slug} />
                <input type="hidden" name="rating" value={stars} />

                {state?.error && (
                  <p className="border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">{state.error}</p>
                )}
                {state?.ok && (
                  <p className="border border-sage/30 bg-sage/10 px-3 py-2 text-[13px] text-sage">{state.message}</p>
                )}

                <div>
                  <span className="text-[12px] uppercase tracking-brand text-muted">Your rating</span>
                  <div className="mt-2 flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setStars(n)}
                        aria-label={`${n} star${n > 1 ? "s" : ""}`}
                        aria-pressed={stars === n}
                        className={`text-[26px] leading-none transition ${n <= stars ? "text-gold" : "text-line"}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block">
                  <span className="text-[12px] uppercase tracking-brand text-muted">Size you bought</span>
                  <select name="size" className="mt-1.5 w-full border border-line bg-paper px-3 py-2.5 text-[15px] outline-none focus:border-gold">
                    <option value="">Prefer not to say</option>
                    {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>

                <label className="block">
                  <span className="text-[12px] uppercase tracking-brand text-muted">Headline</span>
                  <input name="title" maxLength={120} placeholder="Holds its drape all day"
                    className="mt-1.5 w-full border border-line bg-paper px-3 py-2.5 text-[15px] outline-none focus:border-gold" />
                </label>

                <label className="block">
                  <span className="text-[12px] uppercase tracking-brand text-muted">Your review</span>
                  <textarea name="body" rows={5} required minLength={10} maxLength={2000}
                    placeholder="How does it fit, drape and wash?"
                    className="mt-1.5 w-full border border-line bg-paper px-3 py-2.5 text-[15px] outline-none focus:border-gold" />
                </label>

                <button className="w-full bg-ink py-3.5 text-[12px] font-medium uppercase tracking-brand text-bone transition hover:bg-gold-dark">
                  Submit review
                </button>
                <p className="text-[12px] text-muted">Reviews appear once our team has read them.</p>
              </form>
            )}
          </div>

          <ul className="divide-y divide-line border-t border-line lg:border-t-0 lg:pt-0">
            {reviews.length === 0 && (
              <li className="py-10 text-[15px] text-muted">Nothing published yet.</li>
            )}
            {reviews.map((r) => (
              <li key={r._id} className="py-8 first:pt-0 lg:first:pt-0">
                <div className="flex flex-wrap items-center gap-3">
                  <Stars value={r.rating} />
                  {r.verified && (
                    <span className="border border-sage/40 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-sage">
                      Verified buyer
                    </span>
                  )}
                  <time className="ml-auto text-[12px] text-muted">
                    {new Date(r.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  </time>
                </div>

                {r.title && <h3 className="mt-3 font-display text-[1.5rem] leading-tight text-ink">{r.title}</h3>}
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{r.body}</p>
                <p className="mt-3 text-[12px] uppercase tracking-[0.14em] text-muted">
                  {r.name}{r.size && ` · size ${r.size}`}
                </p>

                {r.reply?.body && (
                  <div className="mt-4 border-l-2 border-gold/50 bg-sand/40 px-5 py-4">
                    <p className="text-[11px] uppercase tracking-brand text-gold-dark">Siyana replied</p>
                    <p className="mt-2 text-[14px] leading-relaxed text-ink/85">{r.reply.body}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
