"use client";

import { useActionState } from "react";
import { setUserStatus } from "@/app/admin/actions";
import { Button, Notice } from "@/app/admin/_components/ui";

export default function StatusToggle({ id, status, scope }) {
  const [state, action] = useActionState(setUserStatus, null);
  const disabling = status === "active";

  return (
    <form action={action} className="flex items-center gap-3">
      {state && <Notice state={state} />}
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="scope" value={scope} />
      <input type="hidden" name="status" value={disabling ? "disabled" : "active"} />
      <Button type="submit" variant={disabling ? "danger" : "ghost"}>
        {disabling ? "Disable account" : "Re-enable account"}
      </Button>
    </form>
  );
}
