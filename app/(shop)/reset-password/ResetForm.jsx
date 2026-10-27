"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { completePasswordReset } from "../account/actions";
import { AuthCard, fieldCls, labelCls, buttonCls } from "../forgot-password/ForgotForm";

export default function ResetForm({ token, valid }) {
  const [state, action, isPending] = useActionState(completePasswordReset, null);
  const [show, setShow] = useState(false);

  if (state?.ok) {
    return (
      <AuthCard title="Password changed" intro="Your new password is ready. For your security, you have been signed out on every device.">
        <Link href={state.staff ? "/admin/login" : "/signin"} className={`${buttonCls} block text-center`}>
          Sign in
        </Link>
      </AuthCard>
    );
  }

  if (!valid) {
    return (
      <AuthCard title="This link has expired" intro="Reset links work once and only for one hour. Request a new one and use it straight away.">
        <Link href="/forgot-password" className={`${buttonCls} block text-center`}>
          Send a new link
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Choose a new password" intro="Use at least 8 characters.">
      <form action={action} className="space-y-5">
        <input type="hidden" name="token" value={token} />
        <label className={labelCls}>
          New password
          <input name="password" type={show ? "text" : "password"} required minLength={8} autoComplete="new-password" autoFocus className={fieldCls} />
        </label>
        <label className={labelCls}>
          Confirm new password
          <input name="confirm" type={show ? "text" : "password"} required minLength={8} autoComplete="new-password" className={fieldCls} />
        </label>
        <label className="flex items-center gap-2.5 text-[13px] text-muted">
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} className="accent-ink" />
          Show passwords
        </label>
        {state?.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
        <button type="submit" disabled={isPending} className={buttonCls}>
          {isPending ? "Saving…" : "Save new password"}
        </button>
      </form>
    </AuthCard>
  );
}
