import { notFound } from "next/navigation";
import db, { plain } from "@/lib/db";
import { Review } from "@/lib/models";
import { getProduct, getProducts, getCategories } from "@/lib/catalog";
import { currentUser } from "@/lib/auth";
import { sizes } from "@/lib/products";
import ProductView from "./ProductView";
import Reviews from "./Reviews";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const p = await getProduct((await params).slug);
  return p ? { title: p.name, description: p.story } : {};
}

export default async function ProductPage({ params }) {
  const product = await getProduct((await params).slug);
  if (!product || !product.active) notFound();

  await db();
  const [siblings, categories, reviews, user] = await Promise.all([
    getProducts({ category: product.category }),
    getCategories(),
    Review.find({ productSlug: product.slug, status: "published" }).sort({ createdAt: -1 }).lean().then(plain),
    currentUser(),
  ]);

  return (
    <>
      <ProductView
        product={product}
        related={siblings.filter((p) => p.slug !== product.slug).slice(0, 4)}
        categories={categories}
      />
      <Reviews
        slug={product.slug}
        reviews={reviews}
        rating={product.rating ?? 0}
        count={product.reviewCount ?? 0}
        signedIn={!!user}
        sizes={sizes}
      />
    </>
  );
}
