"use client";

import { useActionState } from "react";
import { saveProduct, toggleProduct } from "@/app/admin/actions";
import { Field, Input, Textarea, Select, Submit, Notice, Button } from "@/app/admin/_components/ui";
import ImagePicker from "./ImagePicker";

export default function ProductForm({ product, categories, sizes, writable }) {
  const [state, action] = useActionState(saveProduct, null);
  const [toggleState, toggleAction] = useActionState(toggleProduct, null);
  const p = product ?? {};

  const qtyFor = (size) => p.stock?.find((s) => s.size === size)?.qty ?? 0;

  if (!writable) {
    return (
      <p className="mt-8 border border-line bg-paper p-5 text-xs text-muted">
        You have read-only access to the catalogue.
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <form action={action} className="space-y-8">
        <Notice state={state} />
        {p._id && <input type="hidden" name="id" value={p._id} />}

        <section className="space-y-5 border border-line bg-paper p-6">
          <h2 className="text-[12px] uppercase tracking-[0.16em] text-muted">Identity</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name"><Input name="name" defaultValue={p.name} required /></Field>
            <Field label="Slug" hint="Used in the storefront URL.">
              <Input name="slug" defaultValue={p.slug} required pattern="[a-z0-9-]{3,}" />
            </Field>
            <Field label="Collection">
              <Select name="category" defaultValue={p.category} required>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </Select>
            </Field>
            <Field label="Badge" hint="Bestseller, New, Limited run… Leave blank for none.">
              <Input name="tag" defaultValue={p.tag ?? ""} />
            </Field>
          </div>
        </section>

        <section className="space-y-5 border border-line bg-paper p-6">
          <h2 className="text-[12px] uppercase tracking-[0.16em] text-muted">Price</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Selling price (₹)"><Input name="price" type="number" min="1" defaultValue={p.price} required /></Field>
            <Field label="MRP (₹)" hint="Shown struck through. Blank for no comparison price.">
              <Input name="mrp" type="number" min="1" defaultValue={p.mrp ?? ""} />
            </Field>
          </div>
        </section>

        <section className="space-y-5 border border-line bg-paper p-6">
          <h2 className="text-[12px] uppercase tracking-[0.16em] text-muted">Cloth &amp; cut</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Fabric"><Input name="fabric" defaultValue={p.fabric} /></Field>
            <Field label="Colour name"><Input name="colorName" defaultValue={p.colorName} /></Field>
            <Field label="Colour swatch" hint="Hex, used as the fallback tile.">
              <Input name="color" defaultValue={p.color ?? "#2f3033"} />
            </Field>
            <Field label="Opacity"><Input name="opacity" defaultValue={p.opacity} /></Field>
            <Field label="Silhouette"><Input name="silhouette" defaultValue={p.silhouette} /></Field>
          </div>
          <Field label="Story"><Textarea name="story" rows={3} defaultValue={p.story} /></Field>
          <Field label="Detail lines" hint="One per line.">
            <Textarea name="details" rows={5} defaultValue={(p.details ?? []).join("\n")} />
          </Field>
        </section>

        <section className="space-y-5 border border-line bg-paper p-6">
          <h2 className="text-[12px] uppercase tracking-[0.16em] text-muted">Images</h2>
          <ImagePicker initial={p.images?.length ? p.images : p.image ? [p.image] : []} />
        </section>

        <section className="space-y-5 border border-line bg-paper p-6">
          <h2 className="text-[12px] uppercase tracking-[0.16em] text-muted">Stock by size</h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {sizes.map((size) => (
              <div key={size}>
                <input type="hidden" name="stockSize" value={size} />
                <Field label={size}>
                  <Input name="stockQty" type="number" min="0" defaultValue={qtyFor(size)} />
                </Field>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 border border-line bg-paper p-6">
          <h2 className="text-[12px] uppercase tracking-[0.16em] text-muted">Visibility</h2>
          <label className="flex items-center gap-3 text-sm text-ink">
            <input type="checkbox" name="active" defaultChecked={p._id ? p.active : true} className="accent-ink" />
            Live on the storefront
          </label>
          <label className="flex items-center gap-3 text-sm text-ink">
            <input type="checkbox" name="wuduFriendly" defaultChecked={p.wuduFriendly} className="accent-ink" />
            Wudu-friendly cuff
          </label>
        </section>

        <div className="flex gap-3">
          <Submit>{p._id ? "Save product" : "Create product"}</Submit>
        </div>
      </form>

      {p._id && (
        <form action={toggleAction} className="flex items-center gap-4 border border-line bg-paper p-5">
          <input type="hidden" name="id" value={p._id} />
          <div className="flex-1">
            <p className="text-xs text-ink">{p.active ? "Live on the storefront" : "Hidden from shoppers"}</p>
            {toggleState && <div className="mt-2"><Notice state={toggleState} /></div>}
          </div>
          <Button type="submit" variant="ghost">{p.active ? "Hide" : "Publish"}</Button>
        </form>
      )}
    </div>
  );
}
