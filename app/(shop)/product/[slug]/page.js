import { notFound } from "next/navigation";
import { getProduct, getProducts, getCategories } from "@/lib/catalog";
import ProductView from "./ProductView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const p = await getProduct((await params).slug);
  return p ? { title: p.name, description: p.story } : {};
}

export default async function ProductPage({ params }) {
  const product = await getProduct((await params).slug);
  if (!product || !product.active) notFound();

  const [siblings, categories] = await Promise.all([
    getProducts({ category: product.category }),
    getCategories(),
  ]);

  return (
    <ProductView
      product={product}
      related={siblings.filter((p) => p.slug !== product.slug).slice(0, 4)}
      categories={categories}
    />
  );
}
