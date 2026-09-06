import Link from "next/link";
import { requireStaff } from "@/lib/auth";
import { PERMISSIONS } from "@/lib/permissions";

export default async function Denied({ searchParams }) {
  const user = await requireStaff();
  const perm = (await searchParams)?.p;

  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <div className="arch mx-auto h-16 w-12 border border-line" />
      <h1 className="mt-8 font-display text-[2.2rem] font-light leading-none">Not your desk</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Your account does not have the{" "}
        <span className="text-ink">{PERMISSIONS[perm] ?? perm ?? "required"}</span> permission.
        Ask an administrator if you need it.
      </p>
      <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-muted">
        Signed in as {user.name}
      </p>
      <Link
        href="/admin"
        className="mt-8 inline-block bg-ink px-8 py-3.5 text-[10px] uppercase tracking-brand text-bone transition hover:bg-gold-dark"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
