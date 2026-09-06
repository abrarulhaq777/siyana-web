import Link from "next/link";
import db, { plain } from "@/lib/db";
import { Review } from "@/lib/models";
import { requirePageAccess, currentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import Stars from "@/components/Stars";
import { Badge } from "../../_components/ui";
import ReviewRow from "./ReviewRow";

const TABS = [
  ["pending", "Awaiting review"],
  ["published", "Published"],
  ["rejected", "Rejected"],
];

export default async function Reviews({ searchParams }) {
  await requirePageAccess("products:read");
  const user = await currentUser();
  const writable = can(user, "products:write");
  const status = (await searchParams)?.status ?? "pending";

  await db();
  const [reviews, counts] = await Promise.all([
    Review.find({ status }).sort({ createdAt: -1 }).limit(100).lean().then(plain),
    Review.aggregate([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
  ]);
  const byStatus = Object.fromEntries(counts.map((c) => [c._id, c.n]));

  return (
    <>
      <header>
        <p className="text-[12px] uppercase tracking-brand text-muted">Community</p>
        <h1 className="mt-2 font-display text-[2.6rem] font-light leading-none">Reviews</h1>
        <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-muted">
          Nothing reaches the storefront until it is published here. Publishing or rejecting
          recalculates the product&apos;s star average straight away.
        </p>
      </header>

      <nav className="mt-8 flex flex-wrap gap-2 border-b border-line pb-4">
        {TABS.map(([key, label]) => (
          <Link
            key={key}
            href={`/admin/reviews?status=${key}`}
            className={`px-4 py-2 text-[12px] uppercase tracking-[0.14em] transition ${
              status === key ? "bg-ink text-bone" : "border border-line bg-paper text-muted hover:border-gold"
            }`}
          >
            {label}
            {byStatus[key] ? <span className="ml-2 opacity-70">{byStatus[key]}</span> : null}
          </Link>
        ))}
      </nav>

      <ul className="mt-8 space-y-4">
        {reviews.length === 0 && (
          <li className="border border-line bg-paper px-6 py-16 text-center text-[13px] text-muted">
            Nothing {status} right now.
          </li>
        )}

        {reviews.map((r) => (
          <li key={r._id} className="border border-line bg-paper p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <Stars value={r.rating} />
                  <Badge tone={r.status === "published" ? "delivered" : r.status === "rejected" ? "cancelled" : "pending"}>
                    {r.status}
                  </Badge>
                  {r.verified && (
                    <span className="border border-sage/40 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-sage">
                      Verified buyer
                    </span>
                  )}
                </div>

                {r.title && <h2 className="mt-3 font-display text-[1.5rem] leading-tight">{r.title}</h2>}
                <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-muted">{r.body}</p>

                <p className="mt-3 text-[12px] uppercase tracking-[0.14em] text-muted">
                  {r.name}
                  {r.size && ` · size ${r.size}`} ·{" "}
                  <Link href={`/product/${r.productSlug}`} className="text-gold-dark hover:text-ink">
                    {r.productSlug}
                  </Link>{" "}
                  · {new Date(r.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                </p>

                {r.reply?.body && (
                  <div className="mt-4 border-l-2 border-gold/50 bg-sand/40 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-brand text-gold-dark">Your reply</p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-ink/85">{r.reply.body}</p>
                  </div>
                )}
              </div>

              {writable && <ReviewRow review={r} />}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
