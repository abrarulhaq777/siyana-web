import { Suspense } from "react";
import { getCategories, getProducts } from "@/lib/catalog";
import CollectionsView from "./CollectionsView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Collections",
  description: "Shop Siyana Daily Modesty — co-ord sets, maxi dresses, rompers, imported denim skirt and co-ord sets, and long kurta co-ords.",
};

export default async function CollectionsPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <Suspense fallback={<div className="px-6 py-32 text-center text-xs uppercase tracking-brand text-muted">Loading…</div>}>
      <CollectionsView categories={categories} products={products} />
    </Suspense>
  );
}
