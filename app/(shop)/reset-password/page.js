import { resetLinkIsValid } from "@/lib/password-reset";
import ResetForm from "./ResetForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reset Password", robots: { index: false } };

export default async function ResetPasswordPage({ searchParams }) {
  const token = (await searchParams)?.token ?? "";
  return <ResetForm token={token} valid={await resetLinkIsValid(token)} />;
}
