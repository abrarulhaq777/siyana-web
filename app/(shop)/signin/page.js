import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import AuthPanel from "../account/AuthPanel";

export const metadata = {
  title: "Sign In",
  description: "Sign in to your Siyana Daily Modesty account to track orders and manage your wishlist.",
};

export default async function SignInPage({ searchParams }) {
  const user = await currentUser();
  const next = (await searchParams)?.next ?? "/account";

  if (user) {
    redirect(next);
  }

  return <AuthPanel next={next} />;
}
