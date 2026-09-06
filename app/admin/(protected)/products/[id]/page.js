import Link from "next/link";
import { notFound } from "next/navigation";
import db, { plain } from "@/lib/db";
import { Product, Category } from "@/lib/models";
import { requirePageAccess, currentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { sizes } from "@/lib/products";
import ProductForm from "./ProductForm";

export default async function ProductEditor({ params }) {
  await requirePageAccess("products:read");
  const user = await currentUser();
  const { id } = await params;
  const isNew = id === "new";

  await db();
  const [product, categories] = await Promise.all([
    isNew ? null : Product.findById(id).lean().catch(() => null),
    Category.find().sort({ order: 1 }).lean(),
  ]);
  if (!isNew && !product) notFound();

  return (
    <>
      <Link href="/admin/products" className="text-[12px] uppercase tracking-[0.16em] text-muted hover:text-ink">
        ← Catalogue
      </Link>
      <h1 className="mt-4 font-display text-[2.4rem] font-light leading-none">
        {isNew ? "New product" : product.name}
      </h1>

      <ProductForm
        product={plain(product)}
        categories={plain(categories)}
        sizes={sizes}
        writable={can(user, "products:write")}
      />
    </>
  );
}
