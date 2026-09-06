import { NextResponse } from "next/server";
import { getProductsBySlugs } from "@/lib/catalog";

/*
 * Slug lookup for client components (cart, wishlist). They hold slugs only, so
 * prices and availability are always read fresh instead of trusting a snapshot
 * that localStorage may have been holding for weeks.
 */
export async function GET(request) {
  const raw = request.nextUrl.searchParams.get("slugs") ?? "";
  const slugs = raw.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 60);
  if (!slugs.length) return NextResponse.json({ products: [] });

  const products = await getProductsBySlugs(slugs);
  return NextResponse.json({ products }, { headers: { "Cache-Control": "no-store" } });
}
