"use client";

import { useActionState, useState } from "react";
import { saveCoupon, toggleCoupon } from "@/app/admin/actions";
import { Field, Input, Textarea, Select, Submit, Notice, Button } from "@/app/admin/_components/ui";

const iso = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

export default function CouponForm({ coupons, categories, products }) {
  const [state, action] = useActionState(saveCoupon, null);
  const [toggleState, toggleAction] = useActionState(toggleCoupon, null);

  const [editingId, setEditingId] = useState(null);
  const editing = coupons.find((c) => c._id === editingId);

  const [type, setType] = useState("percent");
  const [scope, setScope] = useState("all");
  const [repeat, setRepeat] = useState(false);

  const start = (c) => {
    setEditingId(c?._id ?? null);
    setType(c?.type ?? "percent");
    setScope(c?.scope ?? "all");
    setRepeat(c?.repeatUse ?? false);
  };

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-[1.9rem] leading-none">
          {editing ? `Edit ${editing.code}` : "New coupon"}
        </h2>
        <div className="flex flex-wrap gap-2">
          {coupons.map((c) => (
            <button
              key={c._id}
              onClick={() => start(c)}
              className={`border px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.1em] transition ${
                editingId === c._id ? "border-ink bg-ink text-bone" : "border-line bg-paper text-muted hover:border-gold"
              }`}
            >
              {c.code}
            </button>
          ))}
          {editing && <Button variant="ghost" onClick={() => start(null)} className="!py-1.5">New</Button>}
        </div>
      </div>

      <form key={editingId ?? "new"} action={action} className="mt-5 space-y-8 border border-line bg-paper p-6">
        <Notice state={state} />
        {editing && <input type="hidden" name="id" value={editing._id} />}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Code" hint="What the shopper types. Letters, numbers, - and _.">
            <Input name="code" defaultValue={editing?.code} required pattern="[A-Za-z0-9_-]{3,24}"
              className="font-mono uppercase" placeholder="SIYANA10" />
          </Field>
          <Field label="Internal note" hint="Shown to the shopper when the code applies.">
            <Input name="description" defaultValue={editing?.description} placeholder="10% off the signature edit" />
          </Field>
        </div>

        <fieldset className="space-y-4 border-t border-line pt-6">
          <legend className="text-[12px] uppercase tracking-[0.16em] text-muted">Discount</legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Type">
              <Select name="type" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="percent">Percentage off</option>
                <option value="fixed">Fixed amount off</option>
              </Select>
            </Field>
            <Field label={type === "percent" ? "Percent (%)" : "Amount (₹)"}>
              <Input name="value" type="number" min="1" max={type === "percent" ? 100 : undefined}
                step={type === "percent" ? "0.5" : "1"} defaultValue={editing?.value} required />
            </Field>
            <Field label="Max discount (₹)" hint={type === "percent" ? "Caps the percentage." : "Not used for fixed amounts."}>
              <Input name="maxDiscount" type="number" min="1" defaultValue={editing?.maxDiscount ?? ""}
                disabled={type === "fixed"} />
            </Field>
          </div>
          <Field label="Minimum order value (₹)" hint="Bag subtotal before shipping. 0 for no minimum." className="sm:max-w-xs">
            <Input name="minOrder" type="number" min="0" defaultValue={editing?.minOrder ?? 0} />
          </Field>
        </fieldset>

        <fieldset className="space-y-4 border-t border-line pt-6">
          <legend className="text-[12px] uppercase tracking-[0.16em] text-muted">Applies to</legend>
          <Field label="Scope" className="sm:max-w-xs">
            <Select name="scope" value={scope} onChange={(e) => setScope(e.target.value)}>
              <option value="all">Everything in the bag</option>
              <option value="collections">Selected collections</option>
              <option value="products">Selected products</option>
            </Select>
          </Field>

          {scope === "collections" && (
            <div className="grid gap-2.5 sm:grid-cols-3">
              {categories.map((c) => (
                <Check key={c.slug} name="collections" value={c.slug} label={c.name}
                  defaultChecked={editing?.collections?.includes(c.slug)} />
              ))}
            </div>
          )}

          {scope === "products" && (
            <div className="grid max-h-64 gap-2.5 overflow-y-auto border border-line bg-bone p-4 sm:grid-cols-2">
              {products.map((p) => (
                <Check key={p.slug} name="products" value={p.slug} label={p.name}
                  defaultChecked={editing?.products?.includes(p.slug)} />
              ))}
            </div>
          )}

          <p className="text-[12px] text-muted">
            A percentage applies only to the lines it covers — 10% on “Abayas” discounts the abayas
            in the bag, not the hijabs beside them.
          </p>
        </fieldset>

        <fieldset className="space-y-4 border-t border-line pt-6">
          <legend className="text-[12px] uppercase tracking-[0.16em] text-muted">Validity</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Valid from">
              <Input name="validFrom" type="date" defaultValue={iso(editing?.validFrom) || iso(new Date())} />
            </Field>
            <Field label="Valid to" hint="Leave blank for no end date.">
              <Input name="validTo" type="date" defaultValue={iso(editing?.validTo)} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="space-y-4 border-t border-line pt-6">
          <legend className="text-[12px] uppercase tracking-[0.16em] text-muted">Usage limits</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Total redemptions" hint="Across all customers. Blank for unlimited.">
              <Input name="maxUses" type="number" min="1" defaultValue={editing?.maxUses ?? ""} />
            </Field>
            <Field label="Per customer" hint="Ignored when repeat use is allowed.">
              <Input name="maxUsesPerCustomer" type="number" min="1"
                defaultValue={editing?.maxUsesPerCustomer ?? 1} disabled={repeat} />
            </Field>
          </div>

          <label className="flex items-center gap-3 text-[15px] text-ink">
            <input type="checkbox" name="repeatUse" defaultChecked={editing?.repeatUse}
              onChange={(e) => setRepeat(e.target.checked)} className="accent-ink" />
            Customers may reuse this code without limit
          </label>
          <label className="flex items-center gap-3 text-[15px] text-ink">
            <input type="checkbox" name="firstOrderOnly" defaultChecked={editing?.firstOrderOnly} className="accent-ink" />
            First order only
          </label>
          <label className="flex items-center gap-3 text-[15px] text-ink">
            <input type="checkbox" name="active" defaultChecked={editing ? editing.active : true} className="accent-ink" />
            Active
          </label>
        </fieldset>

        <div className="flex flex-wrap items-center gap-4">
          <Submit>{editing ? "Save coupon" : "Create coupon"}</Submit>
          {editing && <span className="text-[12px] text-muted">Redeemed {editing.uses} times so far.</span>}
        </div>
      </form>

      {editing && (
        <form action={toggleAction} className="mt-4 flex items-center gap-4 border border-line bg-paper p-5">
          <input type="hidden" name="id" value={editing._id} />
          <div className="flex-1">
            <p className="text-[13px] text-ink">{editing.active ? "Currently live" : "Currently paused"}</p>
            {toggleState && <div className="mt-2"><Notice state={toggleState} /></div>}
          </div>
          <Button type="submit" variant="ghost">{editing.active ? "Pause" : "Resume"}</Button>
        </form>
      )}
    </section>
  );
}

const Check = ({ name, value, label, defaultChecked }) => (
  <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-ink">
    <input type="checkbox" name={name} value={value} defaultChecked={defaultChecked} className="accent-ink" />
    <span className="truncate">{label}</span>
  </label>
);
