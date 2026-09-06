import db, { plain } from "@/lib/db";
import { Order } from "@/lib/models";
import { currentUser } from "@/lib/auth";
import AuthPanel from "./AuthPanel";
import AccountView from "./AccountView";

export const dynamic = "force-dynamic";
export const metadata = { title: "Account" };

export default async function AccountPage({ searchParams }) {
  const user = await currentUser();
  const next = (await searchParams)?.next ?? "/account";

  if (!user) return <AuthPanel next={next} />;

  await db();
  const orders = plain(await Order.find({ user: user._id }).sort({ createdAt: -1 }).limit(20).lean());

  return <AccountView user={plain(user)} orders={orders} />;
}
