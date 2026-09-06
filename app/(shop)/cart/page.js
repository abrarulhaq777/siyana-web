import { getKey } from "@/lib/content";
import CartView from "./CartView";

export const dynamic = "force-dynamic";
export const metadata = { title: "Your bag" };

export default async function CartPage() {
  return <CartView settings={await getKey("settings")} />;
}
