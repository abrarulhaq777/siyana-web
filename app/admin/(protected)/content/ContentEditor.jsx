"use client";

import { useActionState, useState, useRef } from "react";
import { saveContent } from "@/app/admin/actions";
import { Field, Input, Textarea, Submit, Notice, Button, inputClass } from "@/app/admin/_components/ui";

/*
 * One panel per CMS key. Each form serialises its slice to JSON in a hidden
 * field, so the server action never has to guess at nested form-key syntax.
 */
const TABS = [
  ["settings", "Store settings"],
  ["sections", "Section order"],
  ["announcement", "Ticker"],
  ["hero", "Hero"],
  ["assurances", "Why Siyana · promises"],
  ["categories", "Category arcade"],
  ["newArrivals", "New arrivals"],
  ["capsule", "Celebration capsule"],
  ["prayer", "Prayer sanctuary"],
  ["ethos", "Why Siyana · ethos"],
  ["staples", "Considered few"],
  ["gifting", "Gifting"],
  ["voices", "Testimonials"],
  ["letter", "Newsletter"],
];

export default function ContentEditor({ content, products, labels, codeOnly, writable }) {
  const [tab, setTab] = useState("hero");

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[200px_1fr] lg:items-start">
      <nav className="flex flex-wrap gap-1.5 border border-line bg-paper p-2 lg:flex-col lg:sticky lg:top-6">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-3 py-2 text-left text-[12px] uppercase tracking-[0.14em] transition ${
              tab === key ? "bg-ink text-bone" : "text-muted hover:bg-sand/60 hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <Panel
        key={tab}
        tab={tab}
        data={content[tab]}
        products={products}
        labels={labels}
        codeOnly={codeOnly}
        writable={writable}
      />
    </div>
  );
}

function Panel({ tab, data, products, labels, codeOnly, writable }) {
  const [state, action] = useActionState(saveContent, null);
  const [draft, setDraft] = useState(data);

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const setList = (field, i, patch) =>
    set({ [field]: draft[field].map((row, n) => (n === i ? { ...row, ...patch } : row)) });
  const addRow = (field, blank) => set({ [field]: [...(draft[field] ?? []), blank] });
  const dropRow = (field, i) => set({ [field]: draft[field].filter((_, n) => n !== i) });

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="__key" value={tab} />
      <input type="hidden" name="__json" value={JSON.stringify(draft)} />
      <Notice state={state} />

      <div className="space-y-6 border border-line bg-paper p-6">
        {tab === "settings" && (
          <>
            <SectionTitle>Store settings</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Text label="Store name" v={draft.storeName} on={(v) => set({ storeName: v })} />
              <Text label="Tagline" v={draft.tagline} on={(v) => set({ tagline: v })} />
              <Text label="Support email" v={draft.supportEmail} on={(v) => set({ supportEmail: v })} />
              <Text label="Support phone" v={draft.supportPhone} on={(v) => set({ supportPhone: v })} />
              <Num label="Free shipping above (₹)" v={draft.freeShippingAbove} on={(v) => set({ freeShippingAbove: v })} />
              <Num label="Shipping fee (₹)" v={draft.shippingFee} on={(v) => set({ shippingFee: v })} />
            </div>
            <Check label="Offer cash on delivery" v={draft.codEnabled} on={(v) => set({ codEnabled: v })} />
          </>
        )}

        {tab === "sections" && (
          <>
            <SectionTitle>Section order and visibility</SectionTitle>
            <p className="text-xs text-muted">
              Drag-free ordering: move a section with the arrows. Hidden sections stay in the
              database but never render.
            </p>
            <ul className="divide-y divide-line border border-line">
              {draft.order.map((id, i) => {
                const hidden = draft.hidden.includes(id);
                return (
                  <li key={id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="w-6 text-[13px] text-muted">{i + 1}</span>
                    <span className={`flex-1 text-sm ${hidden ? "text-muted line-through" : "text-ink"}`}>
                      {labels[id] ?? id}
                      {codeOnly.includes(id) && (
                        <span className="ml-2 text-[11.5px] uppercase tracking-[0.14em] text-muted">fixed copy</span>
                      )}
                    </span>
                    <button type="button" disabled={i === 0} onClick={() => set({ order: move(draft.order, i, -1) })}
                      className="px-2 text-xs text-muted disabled:opacity-25 hover:text-ink">↑</button>
                    <button type="button" disabled={i === draft.order.length - 1} onClick={() => set({ order: move(draft.order, i, 1) })}
                      className="px-2 text-xs text-muted disabled:opacity-25 hover:text-ink">↓</button>
                    <button
                      type="button"
                      onClick={() => set({ hidden: hidden ? draft.hidden.filter((h) => h !== id) : [...draft.hidden, id] })}
                      className="w-16 text-right text-[12px] uppercase tracking-[0.14em] text-muted hover:text-ink"
                    >
                      {hidden ? "Show" : "Hide"}
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {tab === "announcement" && (
          <>
            <SectionTitle>Announcement ticker</SectionTitle>
            <Rows
              rows={draft.items}
              onAdd={() => addRow("items", "")}
              onDrop={(i) => dropRow("items", i)}
              render={(item, i) => (
                <input
                  value={item}
                  onChange={(e) => set({ items: draft.items.map((x, n) => (n === i ? e.target.value : x)) })}
                  className={inputClass}
                />
              )}
            />
          </>
        )}

        {tab === "hero" && (
          <>
            <SectionTitle>Hero Copy & CTAs</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Text label="Eyebrow" v={draft.eyebrow} on={(v) => set({ eyebrow: v })} />
              <Text label="Image path (Fallback)" v={draft.image} on={(v) => set({ image: v })} />
              <Text label="Headline — first line" v={draft.titleTop} on={(v) => set({ titleTop: v })} />
              <Text label="Headline — accent line" v={draft.titleAccent} on={(v) => set({ titleAccent: v })} />
            </div>
            <Area label="Body" v={draft.body} on={(v) => set({ body: v })} rows={3} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Text label="Image caption" v={draft.captionTitle} on={(v) => set({ captionTitle: v })} />
              <Text label="Caption sub-line" v={draft.captionSub} on={(v) => set({ captionSub: v })} />
            </div>
            <Cta label="Primary button" v={draft.primaryCta} on={(v) => set({ primaryCta: v })} />
            <Cta label="Secondary button" v={draft.secondaryCta} on={(v) => set({ secondaryCta: v })} />
            <Cta label="Text link" v={draft.tertiaryCta} on={(v) => set({ tertiaryCta: v })} />

            <SectionTitle>Banner Slides & Imagery (Dynamic)</SectionTitle>
            <p className="text-xs text-muted -mt-2">
              Add multiple banner slides to auto-rotate in the tall architectural dome. You can upload banner images, customize copy, and link products.
            </p>
            <BannerSlidesEditor
              slides={draft.slides ?? []}
              products={products}
              fallbackImage={draft.image}
              fallbackTitle={draft.captionTitle}
              fallbackSub={draft.captionSub}
              onChange={(slides) => {
                set({
                  slides,
                  image: slides[0]?.image || draft.image,
                  captionTitle: slides[0]?.title || draft.captionTitle,
                  captionSub: slides[0]?.sub || draft.captionSub,
                });
              }}
            />

            <SectionTitle>Spec strip</SectionTitle>
            <Rows
              rows={draft.stats}
              onAdd={() => addRow("stats", { k: "", v: "" })}
              onDrop={(i) => dropRow("stats", i)}
              render={(row, i) => (
                <div className="grid flex-1 gap-2 sm:grid-cols-2">
                  <input value={row.k} onChange={(e) => setList("stats", i, { k: e.target.value })} placeholder="Label" className={inputClass} />
                  <input value={row.v} onChange={(e) => setList("stats", i, { v: e.target.value })} placeholder="Sub-label" className={inputClass} />
                </div>
              )}
            />
          </>
        )}

        {tab === "assurances" && (
          <>
            <SectionTitle>Assurance strip</SectionTitle>
            <Rows
              rows={draft.items}
              onAdd={() => addRow("items", { title: "", body: "" })}
              onDrop={(i) => dropRow("items", i)}
              render={(row, i) => (
                <div className="flex-1 space-y-2">
                  <input value={row.title} onChange={(e) => setList("items", i, { title: e.target.value })} placeholder="Title" className={inputClass} />
                  <textarea value={row.body} onChange={(e) => setList("items", i, { body: e.target.value })} rows={2} placeholder="Body" className={inputClass} />
                </div>
              )}
            />
          </>
        )}

        {tab === "categories" && (
          <>
            <SectionTitle>Category mosaic</SectionTitle>
            <p className="text-xs text-muted">
              The tiles themselves come from Catalogue → Collections. This sets the heading above them.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Text label="Eyebrow" v={draft.eyebrow} on={(v) => set({ eyebrow: v })} />
              <Text label="Heading" v={draft.heading} on={(v) => set({ heading: v })} />
            </div>
          </>
        )}

        {tab === "newArrivals" && (
          <>
            <SectionTitle>New arrivals &middot; Quietly New</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Text label="Eyebrow" v={draft.eyebrow} on={(v) => set({ eyebrow: v })} />
              <Text label="Heading" v={draft.heading} on={(v) => set({ heading: v })} />
            </div>
            {"body" in draft && <Area label="Body" v={draft.body} on={(v) => set({ body: v })} rows={2} />}

            <div className="border border-line bg-bone p-4 space-y-3">
              <label className="flex items-center gap-3 text-sm font-medium text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.autoRecent !== false}
                  onChange={(e) => set({ autoRecent: e.target.checked })}
                  className="accent-ink h-4 w-4"
                />
                <span>Automatically display recently added products (Newest first)</span>
              </label>
              <p className="text-xs text-muted">
                When enabled, products newly added to the catalogue will automatically appear in the Quietly New section with all their imagery and details without needing to manually add them here.
              </p>
              {draft.autoRecent !== false && (
                <div className="pt-1 max-w-xs">
                  <Num
                    label="Number of products to show (e.g. 4, 8, 12)"
                    v={draft.limit ?? 8}
                    on={(v) => set({ limit: Math.max(1, v || 4) })}
                  />
                </div>
              )}
            </div>

            {draft.autoRecent === false && (
              <Picker
                label="Manual Product Selection (Custom order)"
                products={products}
                value={draft.products}
                on={(v) => set({ products: v })}
              />
            )}
          </>
        )}

        {tab === "staples" && (
          <>
            <SectionTitle>The Considered Few</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Text label="Eyebrow" v={draft.eyebrow} on={(v) => set({ eyebrow: v })} />
              <Text label="Heading" v={draft.heading} on={(v) => set({ heading: v })} />
            </div>
            <Picker
              label="Products — first is the large feature"
              products={products}
              value={draft.products}
              on={(v) => set({ products: v })}
            />
          </>
        )}

        {tab === "capsule" && (
          <>
            <SectionTitle>Celebration capsule</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Text label="Divider label" v={draft.label} on={(v) => set({ label: v })} />
              <Text label="Heading" v={draft.heading} on={(v) => set({ heading: v })} />
            </div>
            <Area label="Body" v={draft.body} on={(v) => set({ body: v })} rows={3} />
            <Picker label="Products (4 shown)" products={products} value={draft.products} on={(v) => set({ products: v })} />
            <Cta label="Button" v={draft.cta} on={(v) => set({ cta: v })} />
          </>
        )}

        {tab === "prayer" && (
          <>
            <SectionTitle>Prayer sanctuary</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Text label="Eyebrow" v={draft.eyebrow} on={(v) => set({ eyebrow: v })} />
              <Text label="Image path" v={draft.image} on={(v) => set({ image: v })} />
              <Text label="Headline — first line" v={draft.titleTop} on={(v) => set({ titleTop: v })} />
              <Text label="Headline — accent line" v={draft.titleAccent} on={(v) => set({ titleAccent: v })} />
              <Text label="Image caption" v={draft.captionTitle} on={(v) => set({ captionTitle: v })} />
              <Text label="Caption sub-line" v={draft.captionSub} on={(v) => set({ captionSub: v })} />
            </div>
            <Area label="Body" v={draft.body} on={(v) => set({ body: v })} rows={4} />
            <Rows
              rows={draft.bullets}
              onAdd={() => addRow("bullets", "")}
              onDrop={(i) => dropRow("bullets", i)}
              render={(item, i) => (
                <input value={item} onChange={(e) => set({ bullets: draft.bullets.map((x, n) => (n === i ? e.target.value : x)) })} className={inputClass} />
              )}
            />
            <Cta label="Primary button" v={draft.primaryCta} on={(v) => set({ primaryCta: v })} />
            <Cta label="Text link" v={draft.secondaryCta} on={(v) => set({ secondaryCta: v })} />
          </>
        )}

        {tab === "ethos" && (
          <>
            <SectionTitle>Ethos band</SectionTitle>
            <Text label="Divider label" v={draft.label} on={(v) => set({ label: v })} />
            <Area label="Statement" v={draft.statement} on={(v) => set({ statement: v })} rows={4} />
            <Area label="Footnote" v={draft.footnote} on={(v) => set({ footnote: v })} rows={3} />
          </>
        )}

        {tab === "gifting" && (
          <>
            <SectionTitle>Gifting panel</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Text label="Eyebrow" v={draft.eyebrow} on={(v) => set({ eyebrow: v })} />
              <Text label="Heading" v={draft.heading} on={(v) => set({ heading: v })} />
              <Text label="Image path" v={draft.image} on={(v) => set({ image: v })} />
            </div>
            <Area label="Body" v={draft.body} on={(v) => set({ body: v })} rows={3} />
            <Rows
              rows={draft.chips}
              onAdd={() => addRow("chips", "")}
              onDrop={(i) => dropRow("chips", i)}
              render={(item, i) => (
                <input value={item} onChange={(e) => set({ chips: draft.chips.map((x, n) => (n === i ? e.target.value : x)) })} className={inputClass} />
              )}
            />
            <Cta label="Button" v={draft.cta} on={(v) => set({ cta: v })} />
          </>
        )}

        {tab === "voices" && (
          <>
            <SectionTitle>Testimonials</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Text label="Divider label" v={draft.label} on={(v) => set({ label: v })} />
              <Text label="Heading" v={draft.heading} on={(v) => set({ heading: v })} />
            </div>
            <Rows
              rows={draft.items}
              onAdd={() => addRow("items", { quote: "", name: "", city: "" })}
              onDrop={(i) => dropRow("items", i)}
              render={(row, i) => (
                <div className="flex-1 space-y-2">
                  <textarea value={row.quote} onChange={(e) => setList("items", i, { quote: e.target.value })} rows={2} placeholder="Quote" className={inputClass} />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input value={row.name} onChange={(e) => setList("items", i, { name: e.target.value })} placeholder="Name" className={inputClass} />
                    <input value={row.city} onChange={(e) => setList("items", i, { city: e.target.value })} placeholder="City" className={inputClass} />
                  </div>
                </div>
              )}
            />
          </>
        )}

        {tab === "letter" && (
          <>
            <SectionTitle>Newsletter</SectionTitle>
            <Text label="Heading" v={draft.heading} on={(v) => set({ heading: v })} />
            <Area label="Body" v={draft.body} on={(v) => set({ body: v })} rows={2} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Text label="Input placeholder" v={draft.placeholder} on={(v) => set({ placeholder: v })} />
              <Text label="Button label" v={draft.button} on={(v) => set({ button: v })} />
            </div>
          </>
        )}
      </div>

      {writable ? (
        <div className="flex items-center gap-4">
          <Submit>Publish changes</Submit>
          <span className="text-[13px] text-muted">Live on the storefront as soon as you save.</span>
        </div>
      ) : (
        <p className="border border-line bg-paper p-4 text-xs text-muted">
          You have read-only access to storefront content.
        </p>
      )}
    </form>
  );
}

/* ─────────────────────────────────────────────────────────────── inputs */

const move = (arr, i, d) => {
  const copy = [...arr];
  [copy[i], copy[i + d]] = [copy[i + d], copy[i]];
  return copy;
};

const SectionTitle = ({ children }) => (
  <h2 className="border-b border-line pb-3 text-[12px] uppercase tracking-[0.16em] text-muted">{children}</h2>
);

const Text = ({ label, v, on }) => (
  <Field label={label}><Input value={v ?? ""} onChange={(e) => on(e.target.value)} /></Field>
);

const Num = ({ label, v, on }) => (
  <Field label={label}><Input type="number" value={v ?? 0} onChange={(e) => on(Number(e.target.value))} /></Field>
);

const Area = ({ label, v, on, rows = 3 }) => (
  <Field label={label}><Textarea rows={rows} value={v ?? ""} onChange={(e) => on(e.target.value)} /></Field>
);

const Check = ({ label, v, on }) => (
  <label className="flex items-center gap-3 text-sm text-ink">
    <input type="checkbox" checked={!!v} onChange={(e) => on(e.target.checked)} className="accent-ink" />
    {label}
  </label>
);

const Cta = ({ label, v = {}, on }) => (
  <div>
    <span className="text-[12px] uppercase tracking-[0.18em] text-muted">{label}</span>
    <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
      <input value={v.label ?? ""} onChange={(e) => on({ ...v, label: e.target.value })} placeholder="Label" className={inputClass} />
      <input value={v.href ?? ""} onChange={(e) => on({ ...v, href: e.target.value })} placeholder="/collections" className={inputClass} />
    </div>
  </div>
);

function Rows({ rows = [], render, onAdd, onDrop }) {
  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div key={i} className="flex items-start gap-3">
          {render(row, i)}
          <button
            type="button"
            onClick={() => onDrop(i)}
            aria-label="Remove"
            className="mt-2 shrink-0 px-2 text-sm text-muted transition hover:text-red-600"
          >
            ×
          </button>
        </div>
      ))}
      <Button type="button" variant="ghost" onClick={onAdd}>Add row</Button>
    </div>
  );
}

/** Ordered product picker — the order chosen here is the order rendered. */
function Picker({ label, products, value = [], on }) {
  const add = (slug) => !value.includes(slug) && on([...value, slug]);

  return (
    <div>
      <span className="text-[12px] uppercase tracking-[0.18em] text-muted">{label}</span>
      <ol className="mt-2 space-y-2">
        {value.map((slug, i) => {
          const p = products.find((x) => x.slug === slug);
          return (
            <li key={slug} className="flex items-center gap-3 border border-line bg-bone px-3 py-2 text-sm">
              <span className="w-5 text-[13px] text-muted">{i + 1}</span>
              <span className="flex-1 truncate">
                {p?.name ?? slug}
                {p && !p.active && <span className="ml-2 text-[12px] uppercase tracking-[0.14em] text-amber-700">hidden</span>}
                {!p && <span className="ml-2 text-[12px] uppercase tracking-[0.14em] text-red-600">missing</span>}
              </span>
              <button type="button" disabled={i === 0} onClick={() => on(move(value, i, -1))} className="px-1.5 text-xs text-muted disabled:opacity-25 hover:text-ink">↑</button>
              <button type="button" disabled={i === value.length - 1} onClick={() => on(move(value, i, 1))} className="px-1.5 text-xs text-muted disabled:opacity-25 hover:text-ink">↓</button>
              <button type="button" onClick={() => on(value.filter((s) => s !== slug))} className="px-1.5 text-sm text-muted hover:text-red-600">×</button>
            </li>
          );
        })}
      </ol>
      <select onChange={(e) => { add(e.target.value); e.target.value = ""; }} defaultValue="" className={inputClass}>
        <option value="" disabled>Add a product…</option>
        {products.filter((p) => !value.includes(p.slug)).map((p) => (
          <option key={p.slug} value={p.slug}>{p.name}{p.active ? "" : " (hidden)"}</option>
        ))}
      </select>
    </div>
  );
}

function SlideImageUploader({ value, onChange, label = "Slide image" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const body = new FormData();
    body.append("files", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      if (data.urls?.[0]) onChange(data.urls[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] uppercase tracking-[0.18em] text-muted">{label}</span>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
      <div className="flex items-center gap-2">
        <input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/hero/... or upload image"
          className={inputClass}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={handleFile}
        />
        <Button
          type="button"
          variant="ghost"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="shrink-0 text-xs"
        >
          {uploading ? "Uploading…" : "Upload"}
        </Button>
      </div>
    </div>
  );
}

function BannerSlidesEditor({
  slides = [],
  products = [],
  fallbackImage,
  fallbackTitle,
  fallbackSub,
  onChange,
}) {
  const list = slides.length
    ? slides
    : [
        {
          id: "slide-1",
          image: fallbackImage || "/images/hero/hero-siyana.jpg",
          badge: "Signature Collection",
          title: fallbackTitle || "The Noble Art of Modesty",
          sub: fallbackSub || "Japanese Nida & hand-rolled silks",
          previewThumb: "/images/products/noor-open-abaya.jpg",
          previewName: "Noor Open Abaya",
          previewPrice: "₹4,890",
          previewTag: "Bestseller",
          link: "/collections?c=abayas",
        },
      ];

  const updateSlide = (idx, patch) => {
    const next = list.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    onChange(next);
  };

  const addSlide = () => {
    onChange([
      ...list,
      {
        id: `slide-${Date.now()}`,
        image: "/images/hero/hero-siyana.jpg",
        badge: "New Season",
        title: "Dressed with Grace",
        sub: "Curated Modesty Edit",
        previewThumb: "",
        previewName: "",
        previewPrice: "",
        previewTag: "New",
        link: "/collections",
      },
    ]);
  };

  const removeSlide = (idx) => {
    if (list.length <= 1) return;
    onChange(list.filter((_, i) => i !== idx));
  };

  const moveSlide = (idx, dir) => {
    const next = [...list];
    [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-line pb-2">
        <h3 className="text-[12px] uppercase tracking-[0.16em] text-muted">
          Dynamic Banner Slides ({list.length})
        </h3>
        <span className="text-xs text-muted">Auto-rotates in the hero dome</span>
      </div>

      <div className="space-y-4">
        {list.map((slide, i) => (
          <div key={slide.id || i} className="border border-line bg-bone p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-line/70 pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink">
                Slide {i + 1} {i === 0 ? "· Primary" : ""}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => moveSlide(i, -1)}
                  className="px-2 py-0.5 text-xs text-muted disabled:opacity-25 hover:text-ink"
                  title="Move Up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={i === list.length - 1}
                  onClick={() => moveSlide(i, 1)}
                  className="px-2 py-0.5 text-xs text-muted disabled:opacity-25 hover:text-ink"
                  title="Move Down"
                >
                  ↓
                </button>
                {list.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSlide(i)}
                    className="px-2 py-0.5 text-xs text-red-600 hover:text-red-800"
                    title="Remove Slide"
                  >
                    × Remove
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[100px_1fr] items-start">
              <div className="aspect-[4/5] w-full overflow-hidden rounded border border-line bg-sand/40">
                {slide.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={slide.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-[10px] text-muted">No Image</div>
                )}
              </div>

              <div className="space-y-3">
                <SlideImageUploader
                  value={slide.image}
                  onChange={(v) => updateSlide(i, { image: v })}
                  label="Banner image URL or file"
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <span className="text-[12px] uppercase tracking-[0.18em] text-muted">Badge pill</span>
                    <input
                      value={slide.badge ?? ""}
                      onChange={(e) => updateSlide(i, { badge: e.target.value })}
                      placeholder="e.g. Signature Collection"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <span className="text-[12px] uppercase tracking-[0.18em] text-muted">Slide Headline</span>
                    <input
                      value={slide.title ?? ""}
                      onChange={(e) => updateSlide(i, { title: e.target.value })}
                      placeholder="e.g. The Noble Art of Modesty"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[12px] uppercase tracking-[0.18em] text-muted">Slide Subtitle</span>
                  <input
                    value={slide.sub ?? ""}
                    onChange={(e) => updateSlide(i, { sub: e.target.value })}
                    placeholder="e.g. Japanese Nida & hand-rolled silks"
                    className={inputClass}
                  />
                </div>

                <div className="border-t border-line/70 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-[0.16em] text-muted font-medium">
                      Floating Feature Card (Optional)
                    </span>
                    <select
                      onChange={(e) => {
                        const p = products.find((x) => x.slug === e.target.value);
                        if (p) {
                          updateSlide(i, {
                            previewThumb: p.image || p.images?.[0] || "",
                            previewName: p.name,
                            previewPrice: `₹${p.price}`,
                            previewTag: p.tag || "Featured",
                            link: `/product/${p.slug}`,
                          });
                        }
                        e.target.value = "";
                      }}
                      defaultValue=""
                      className="text-xs border border-line bg-paper px-2 py-1 text-ink"
                    >
                      <option value="" disabled>Auto-fill from catalogue product…</option>
                      {products.map((p) => (
                        <option key={p.slug} value={p.slug}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-4">
                    <input
                      value={slide.previewName ?? ""}
                      onChange={(e) => updateSlide(i, { previewName: e.target.value })}
                      placeholder="Product name"
                      className={inputClass}
                    />
                    <input
                      value={slide.previewPrice ?? ""}
                      onChange={(e) => updateSlide(i, { previewPrice: e.target.value })}
                      placeholder="Price (₹4,890)"
                      className={inputClass}
                    />
                    <input
                      value={slide.previewTag ?? ""}
                      onChange={(e) => updateSlide(i, { previewTag: e.target.value })}
                      placeholder="Tag (Bestseller)"
                      className={inputClass}
                    />
                    <input
                      value={slide.link ?? ""}
                      onChange={(e) => updateSlide(i, { link: e.target.value })}
                      placeholder="Link (/collections)"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button type="button" variant="ghost" onClick={addSlide}>
        + Add New Banner Slide
      </Button>
    </div>
  );
}
