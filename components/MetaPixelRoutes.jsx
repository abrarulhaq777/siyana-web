"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";
import { pageview } from "@/lib/meta-pixel";

function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // The base code in <head> already tracked PageView for the first page;
    // this covers later client-side navigations. Admin pages are never tracked.
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    if (!pathname.startsWith("/admin")) pageview();
  }, [pathname, searchParams]);

  return null;
}

export default function MetaPixelRoutes() {
  return (
    <Suspense fallback={null}>
      <RouteTracker />
    </Suspense>
  );
}
