"use client";

import { useRef, useState } from "react";
import { Button } from "@/app/admin/_components/ui";

/*
 * Multi-image gallery. The first image is the cover used in listings; the rest
 * appear in the product-page carousel. Order is set by the arrows.
 */
export default function ImagePicker({ name = "images", initial = [] }) {
  const [images, setImages] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const input = useRef(null);

  async function upload(fileList) {
    const files = [...fileList];
    if (!files.length) return;

    setBusy(true);
    setError(null);
    const body = new FormData();
    files.forEach((f) => body.append("files", f));

    try {
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed.");
      setImages((cur) => [...cur, ...data.urls]);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  const move = (i, d) =>
    setImages((cur) => {
      const next = [...cur];
      [next[i], next[i + d]] = [next[i + d], next[i]];
      return next;
    });

  return (
    <div className="space-y-4">
      {/* One hidden field per image keeps ordering intact through formData */}
      {images.map((src) => (
        <input key={src} type="hidden" name={name} value={src} />
      ))}

      {images.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((src, i) => (
            <li key={src} className="group relative border border-line bg-bone">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="aspect-[3/4] w-full object-cover" />

              {i === 0 && (
                <span className="absolute left-2 top-2 bg-ink px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-bone">
                  Cover
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-ink/80 px-1.5 py-1.5 opacity-0 transition group-hover:opacity-100">
                <div className="flex gap-1">
                  <Ctl disabled={i === 0} onClick={() => move(i, -1)} label="Move left">←</Ctl>
                  <Ctl disabled={i === images.length - 1} onClick={() => move(i, 1)} label="Move right">→</Ctl>
                </div>
                <Ctl onClick={() => setImages((c) => c.filter((_, n) => n !== i))} label="Remove">×</Ctl>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          onChange={(e) => upload(e.target.files)}
          className="hidden"
          id="image-upload"
        />
        <Button type="button" variant="ghost" disabled={busy} onClick={() => input.current?.click()}>
          {busy ? "Uploading…" : images.length ? "Add more images" : "Upload images"}
        </Button>
        <span className="text-[12px] text-muted">
          JPEG, PNG, WebP or AVIF · up to 6 MB each · first image is the cover
        </span>
      </div>

      {error && <p className="border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">{error}</p>}
    </div>
  );
}

const Ctl = ({ children, label, ...rest }) => (
  <button
    type="button"
    aria-label={label}
    {...rest}
    className="grid h-6 w-6 place-items-center bg-paper/90 text-[12px] text-ink transition hover:bg-paper disabled:opacity-30"
  >
    {children}
  </button>
);
