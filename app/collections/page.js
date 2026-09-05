import { Suspense } from "react";
import CollectionsView from "./CollectionsView";

export const metadata = {
  title: "Collections",
  description: "Abayas, hijabs, kaftans, modest dresses, co-ords and prayer wear.",
};

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="px-6 py-32 text-center text-xs uppercase tracking-brand text-muted">Loading…</div>}>
      <CollectionsView />
    </Suspense>
  );
}
