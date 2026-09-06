"use client";

import { useActionState } from "react";
import { changeOwnPassword } from "@/app/admin/actions";
import { Field, Input, Submit, Notice } from "@/app/admin/_components/ui";

export default function PasswordForm() {
  const [state, action] = useActionState(changeOwnPassword, null);

  return (
    <form action={action} className="space-y-5 border border-line bg-paper p-6">
      <h2 className="text-[12px] uppercase tracking-[0.16em] text-muted">Change password</h2>
      <Notice state={state} />
      <Field label="New password" hint="At least 8 characters.">
        <Input name="password" type="password" minLength={8} required autoComplete="new-password" />
      </Field>
      <Submit>Update password</Submit>
    </form>
  );
}
