import { getKey } from "@/lib/content";
import { currentUser } from "@/lib/auth";
import { razorpayEnabled } from "@/lib/razorpay";
import CheckoutView from "./CheckoutView";

export const dynamic = "force-dynamic";
export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const [settings, user] = await Promise.all([getKey("settings"), currentUser()]);

  return (
    <CheckoutView
      settings={settings}
      gateway={razorpayEnabled()}
      me={user ? { name: user.name, email: user.email, phone: user.phone ?? "", addresses: user.addresses ?? [] } : null}
    />
  );
}
