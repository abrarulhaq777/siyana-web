"use server";

import { revalidatePath } from "next/cache";
import db from "@/lib/db";
import { Review, Product, Order } from "@/lib/models";
import { currentUser } from "@/lib/auth";

const fail = (error) => ({ ok: false, error });

/*
 * Reviews arrive as "pending" and only appear on the storefront once a staff
 * member publishes them. A review from someone who actually bought the piece is
 * flagged verified automatically.
 */
export async function submitReview(_prev, formData) {
  const user = await currentUser();
  if (!user) return fail("Sign in to leave a review.");

  const slug = String(formData.get("slug") ?? "");
  const rating = Number(formData.get("rating"));
  const body = String(formData.get("body") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();

  if (!(rating >= 1 && rating <= 5)) return fail("Choose a rating from one to five stars.");
  if (body.length < 10) return fail("Tell us a little more — at least ten characters.");
  if (body.length > 2000) return fail("Please keep it under 2000 characters.");

  await db();
  const product = await Product.findOne({ slug }).select("_id").lean();
  if (!product) return fail("Product not found.");

  if (await Review.findOne({ productSlug: slug, user: user._id }).lean())
    return fail("You've already reviewed this piece.");

  const bought = await Order.countDocuments({
    user: user._id,
    "items.slug": slug,
    "payment.status": { $in: ["paid", "partially_refunded"] },
  });

  await Review.create({
    product: product._id,
    productSlug: slug,
    user: user._id,
    name: user.name,
    rating,
    title,
    body,
    size: formData.get("size") || undefined,
    verified: bought > 0,
  });

  revalidatePath(`/product/${slug}`);
  return { ok: true, message: "Thank you — your review is with our team and appears once approved." };
}
