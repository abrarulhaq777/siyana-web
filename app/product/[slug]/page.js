import { notFound } from "next/navigation";
import { products, bySlug } from "@/lib/products";
import ProductView from "./ProductView";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const p = bySlug((await params).slug);
  return p ? { title: p.name, description: p.story } : {};
}

export default async function ProductPage({ params }) {
  const product = bySlug((await params).slug);
  if (!product) notFound();

  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);
  return <ProductView product={product} related={related} />;
}
