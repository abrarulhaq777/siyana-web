import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import AuthPanel from "../account/AuthPanel";

export const metadata = {
  title: "Sign In — Siyana",
  description: "Sign in to your Siyana Account to track orders and manage saved drop lengths.",
};

export default async function SignInPage({ searchParams }) {
  const user = await currentUser();
  const next = (await searchParams)?.next ?? "/account";

  if (user) {
    redirect(next);
  }

  return <AuthPanel next={next} />;
}
