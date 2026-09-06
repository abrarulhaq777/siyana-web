import { currentUser } from "@/lib/auth";
import { PERMISSIONS } from "@/lib/permissions";
import PasswordForm from "./PasswordForm";

export default async function MyAccount() {
  const user = await currentUser();

  return (
    <>
      <header>
        <p className="text-[12px] uppercase tracking-brand text-muted">Account</p>
        <h1 className="mt-2 font-display text-[2.4rem] font-light leading-none">{user.name}</h1>
        <p className="mt-2 text-xs text-muted">{user.email}</p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start">
        <section className="border border-line bg-paper p-6">
          <h2 className="text-[12px] uppercase tracking-[0.16em] text-muted">Your access</h2>
          <p className="mt-3 text-sm text-ink">
            {user.role === "admin" ? "Administrator — every permission" : "Staff"}
          </p>
          {user.role === "staff" && (
            <ul className="mt-4 space-y-2 border-t border-line pt-4 text-xs">
              {user.permissions.length === 0 && <li className="text-muted">No permissions granted yet.</li>}
              {user.permissions.map((p) => (
                <li key={p} className="flex justify-between gap-4">
                  <span className="text-ink">{PERMISSIONS[p] ?? p}</span>
                  <span className="font-mono text-[12px] text-muted">{p}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <PasswordForm />
      </div>
    </>
  );
}
