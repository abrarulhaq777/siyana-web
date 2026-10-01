"use client";

import { useActionState, useState, useRef } from "react";
import { saveCategory, deleteCategory } from "@/app/admin/actions";
import { Field, Input, Submit, Notice, Button } from "@/app/admin/_components/ui";

/* Collections drive both the storefront nav and the home-page mosaic. */
export default function CategoryPanel({ categories, writable }) {
  const [saveState, saveAction] = useActionState(saveCategory, null);
  const [deleteState, deleteAction] = useActionState(deleteCategory, null);
  const [editing, setEditing] = useState(null);
  const current = categories.find((c) => c._id === editing);

  return (
    <section className="mt-12">
      <h2 className="font-display text-[1.6rem] leading-none">Collections</h2>
      <p className="mt-2 text-xs text-muted">
        These set the storefront navigation and the tiles in “Curated by Silhouette”.
      </p>

      {deleteState && !deleteState.ok && (
        <div className="mt-4">
          <Notice state={deleteState} />
        </div>
      )}

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
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditing(editing === c._id ? null : c._id)}
                    className="shrink-0 text-[12px] uppercase tracking-[0.16em] text-muted hover:text-ink"
                  >
                    {editing === c._id ? "Close" : "Edit"}
                  </button>
                  <form
                    action={deleteAction}
                    onSubmit={(e) => {
                      if (!window.confirm(`Are you sure you want to delete collection "${c.name}"? This cannot be undone.`)) {
                        e.preventDefault();
                        return;
                      }
                      if (editing === c._id) setEditing(null);
                    }}
                  >
                    <input type="hidden" name="id" value={c._id} />
                    <button
                      type="submit"
                      className="shrink-0 text-[12px] uppercase tracking-[0.16em] text-red-600 transition hover:text-red-800"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              )}
            </li>
          ))}
        </ul>

        {writable && (
          <form key={editing ?? "new"} action={saveAction} className="space-y-4 border border-line bg-paper p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[12px] uppercase tracking-[0.16em] text-muted">
                {current ? `Edit ${current.name}` : "New collection"}
              </h3>
              {current && (
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="text-[12px] uppercase tracking-[0.16em] text-muted hover:text-ink"
                >
                  New instead
                </button>
              )}
            </div>
            <Notice state={saveState} />
            {current && <input type="hidden" name="id" value={current._id} />}

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name"><Input name="name" defaultValue={current?.name} required /></Field>
              <Field label="Slug"><Input name="slug" defaultValue={current?.slug} required pattern="[a-z0-9-]+" /></Field>
            </div>
            <Field label="Blurb"><Input name="blurb" defaultValue={current?.blurb} /></Field>

            <Field label="Collection Image">
              <CollectionImageUploader initialImage={current?.image ?? ""} />
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Sort order"><Input name="order" type="number" defaultValue={current?.order ?? 0} /></Field>
              <label className="flex items-end gap-2 pb-2.5 text-[12px] uppercase tracking-[0.16em] text-muted">
                <input type="checkbox" name="active" defaultChecked={current ? current.active : true} className="accent-ink" />
                Visible on the storefront
              </label>
            </div>
            <input type="hidden" name="tone" value={current?.tone ?? "#2f3033"} />

            <div className="flex items-center gap-3 pt-2">
              <Submit className="flex-1">{current ? "Save collection" : "Create collection"}</Submit>
              {current && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete collection "${current.name}"? This cannot be undone.`)) {
                      const data = new FormData();
                      data.append("id", current._id);
                      setEditing(null);
                      deleteAction(data);
                    }
                  }}
                >
                  Delete
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function CollectionImageUploader({ initialImage = "" }) {
  const [image, setImage] = useState(initialImage);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  async function handleFileSelect(file) {
    if (!file) return;
    setBusy(true);
    setError(null);
    const body = new FormData();
    body.append("files", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed.");
      if (data.urls?.[0]) {
        setImage(data.urls[0]);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="mt-1.5 space-y-2">
      <input type="hidden" name="image" value={image} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={(e) => handleFileSelect(e.target.files?.[0])}
        className="hidden"
      />

      {image ? (
        <div className="flex items-start gap-4 border border-line bg-bone p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="h-28 w-20 shrink-0 border border-line object-cover" />
          <div className="min-w-0 flex-1 space-y-2 pt-1">
            <p className="truncate text-xs text-ink">{image}</p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => fileInputRef.current?.click()}
                className="text-[12px] uppercase tracking-[0.16em] text-ink transition hover:text-gold-dark disabled:opacity-50"
              >
                {busy ? "Uploading…" : "Change image"}
              </button>
              <button
                type="button"
                onClick={() => setImage("")}
                className="text-[12px] uppercase tracking-[0.16em] text-red-600 transition hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => fileInputRef.current?.click()}
          className="block w-full border border-dashed border-line bg-bone px-4 py-4 text-center text-[12px] uppercase tracking-[0.16em] text-muted transition hover:border-gold hover:text-ink disabled:opacity-50"
        >
          {busy ? "Uploading…" : "+ Upload collection image"}
        </button>
      )}

      <p className="text-[11px] text-muted">
        Recommended: 1200 × 1500 px (4:5 portrait) · JPEG, PNG, WebP or AVIF up to 6 MB
      </p>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
