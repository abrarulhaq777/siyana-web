"use client";

import { useActionState } from "react";
import { deleteProduct } from "@/app/admin/actions";

export default function DeleteProductButton({ id, name }) {
  const [state, action, isPending] = useActionState(deleteProduct, null);

  const handleSubmit = (e) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${name}"? This action cannot be undone.`
    );
    if (!confirmed) {
      e.preventDefault();
    }
  };

  return (
    <form action={action} onSubmit={handleSubmit} className="inline-block">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={isPending}
        title="Delete product"
        className="text-[12px] uppercase tracking-[0.16em] text-red-600 transition hover:text-red-800 disabled:opacity-50"
      >
        {isPending ? "Deleting…" : "Delete"}
      </button>
      {state?.error && (
        <span className="ml-2 text-[11px] text-red-600" role="alert">
          {state.error}
        </span>
      )}
    </form>
  );
}
