"use client";

import { useActionState, useState } from "react";
import { saveCategory } from "@/app/admin/actions";
import { Field, Input, Submit, Notice } from "@/app/admin/_components/ui";

/* Collections drive both the storefront nav and the home-page mosaic. */
export default function CategoryPanel({ categories, writable }) {
  const [state, action] = useActionState(saveCategory, null);
  const [editing, setEditing] = useState(null);
  const current = categories.find((c) => c._id === editing);

  return (
    <section className="mt-12">
      <h2 className="font-display text-[1.6rem] leading-none">Collections</h2>
      <p className="mt-2 text-xs text-muted">
        These set the storefront navigation and the tiles in “Curated by Silhouette”.
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <ul className="divide-y divide-line border border-line bg-paper">
          {categories.map((c) => (
            <li key={c._id} className="flex items-center gap-3 px-4 py-3">
              {c.image && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={c.image} alt="" className="h-10 w-8 shrink-0 object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-ink">{c.name}</p>
                <p className="truncate text-[13px] text-muted">/{c.slug}</p>
              </div>
              {!c.active && <span className="text-[11.5px] uppercase tracking-[0.14em] text-muted">hidden</span>}
              {writable && (
                <button
                  onClick={() => setEditing(editing === c._id ? null : c._id)}
                  className="shrink-0 text-[12px] uppercase tracking-[0.16em] text-muted hover:text-ink"
                >
                  {editing === c._id ? "Close" : "Edit"}
                </button>
              )}
            </li>
          ))}
        </ul>

        {writable && (
          <form key={editing ?? "new"} action={action} className="space-y-4 border border-line bg-paper p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[12px] uppercase tracking-[0.16em] text-muted">
                {current ? `Edit ${current.name}` : "New collection"}
              </h3>
              {current && (
                <button type="button" onClick={() => setEditing(null)} className="text-[12px] uppercase tracking-[0.16em] text-muted hover:text-ink">
                  New instead
                </button>
              )}
            </div>
            <Notice state={state} />
            {current && <input type="hidden" name="id" value={current._id} />}

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name"><Input name="name" defaultValue={current?.name} required /></Field>
              <Field label="Slug"><Input name="slug" defaultValue={current?.slug} required pattern="[a-z0-9-]+" /></Field>
            </div>
            <Field label="Blurb"><Input name="blurb" defaultValue={current?.blurb} /></Field>
            <Field label="Image path" hint="Public path, e.g. /images/categories/abayas.jpg">
              <Input name="image" defaultValue={current?.image} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Sort order"><Input name="order" type="number" defaultValue={current?.order ?? 0} /></Field>
              <label className="flex items-end gap-2 pb-2.5 text-[12px] uppercase tracking-[0.16em] text-muted">
                <input type="checkbox" name="active" defaultChecked={current ? current.active : true} className="accent-ink" />
                Visible on the storefront
              </label>
            </div>
            <input type="hidden" name="tone" value={current?.tone ?? "#2f3033"} />
            <Submit className="w-full">{current ? "Save collection" : "Create collection"}</Submit>
          </form>
        )}
      </div>
    </section>
  );
}
