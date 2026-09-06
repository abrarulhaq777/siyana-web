"use client";

import { useActionState } from "react";
import { adminSignIn } from "../actions";
import { Field, Input, Submit, Notice } from "../_components/ui";

export default function AdminLogin() {
  const [state, action] = useActionState(adminSignIn, null);

  return (
    <div className="grid min-h-screen place-items-center bg-bone px-6">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <p className="font-display text-[1.8rem] uppercase tracking-[0.26em] text-ink">Siyana</p>
          <p className="mt-1.5 text-[8px] uppercase tracking-brand text-muted">Control room</p>
        </div>

        <form action={action} className="mt-10 space-y-5 border border-line bg-paper p-8">
          <Notice state={state} />
          <Field label="Email">
            <Input name="email" type="email" required autoComplete="username" autoFocus />
          </Field>
          <Field label="Password">
            <Input name="password" type="password" required autoComplete="current-password" />
          </Field>
          <Submit className="w-full">Sign in</Submit>
        </form>

        <p className="mt-6 text-center text-[10px] uppercase tracking-[0.16em] text-muted">
          Staff and administrators only
        </p>
      </div>
    </div>
  );
}
