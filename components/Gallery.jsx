"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ArchFrame from "./ArchFrame";

/*
 * Product gallery: an arch-framed hero shot with thumbnails, and a lightbox
 * that zooms on click and pans with the pointer. Arrow keys and Escape work
 * because a keyboard is how half of this gets used.
 */
export default function Gallery({ images = [], alt }) {
  const shots = images.length ? images : [null];
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const go = useCallback(
    (d) => setIndex((i) => (i + d + shots.length) % shots.length),
    [shots.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, go]);

  return (
    <>
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => shots[0] && setOpen(true)}
          aria-label="Open image viewer"
          className="group relative block w-full cursor-zoom-in"
        >
          <ArchFrame
            src={shots[index]}
            alt={alt}
            ratio="aspect-[4/5]"
            focus="object-top"
            scrim={false}
          />
          <span className="absolute bottom-5 right-5 flex items-center gap-2 bg-ink/75 px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-bone opacity-0 backdrop-blur-md transition group-hover:opacity-100">
            <ZoomIcon /> Zoom
          </span>
        </button>

        {shots.length > 1 && (
          <ul className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {shots.map((src, i) => (
              <li key={src + i}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`View image ${i + 1}`}
                  aria-current={i === index}
                  className={`block w-full overflow-hidden border transition ${
                    i === index ? "border-gold" : "border-line hover:border-ink/40"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="aspect-[3/4] w-full object-cover object-top" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {open && (
        <Lightbox
          shots={shots}
          index={index}
          alt={alt}
          onClose={() => setOpen(false)}
          onGo={go}
          onPick={setIndex}
        />
      )}
    </>
  );
}

function Lightbox({ shots, index, alt, onClose, onGo, onPick }) {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const frame = useRef(null);

  // Pan by tracking the pointer as a transform-origin while zoomed in.
  const track = (e) => {
    if (!zoomed || !frame.current) return;
    const r = frame.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setOrigin(`${Math.min(100, Math.max(0, x))}% ${Math.min(100, Math.max(0, y))}%`);
  };

  return (
    <div
      className="animate-fade fixed inset-0 z-[90] flex flex-col bg-ink/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} — image viewer`}
    >
      <div className="flex items-center justify-between px-5 py-4 text-bone">
        <span className="text-[12px] uppercase tracking-brand text-bone/70">
          {index + 1} / {shots.length}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setZoomed((z) => !z)}
            className="flex items-center gap-2 border border-bone/25 px-3 py-2 text-[11px] uppercase tracking-[0.14em] transition hover:border-gold hover:text-gold-light"
          >
            <ZoomIcon /> {zoomed ? "Fit" : "Zoom"}
          </button>
          <button
            onClick={onClose}
            aria-label="Close viewer"
            className="grid h-9 w-9 place-items-center border border-bone/25 text-lg leading-none transition hover:border-gold hover:text-gold-light"
          >
            ×
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-4">
        {shots.length > 1 && (
          <Arrow side="left" onClick={() => onGo(-1)} />
        )}

        <div
          ref={frame}
          onMouseMove={track}
          onClick={() => setZoomed((z) => !z)}
          className={`relative flex h-full max-h-full w-full max-w-4xl items-center justify-center overflow-hidden ${
            zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shots[index]}
            alt={alt}
            className="max-h-full max-w-full object-contain transition-transform duration-300 ease-out"
            style={{ transform: zoomed ? "scale(2.4)" : "scale(1)", transformOrigin: origin }}
          />
        </div>

        {shots.length > 1 && <Arrow side="right" onClick={() => onGo(1)} />}
      </div>

      {shots.length > 1 && (
        <ul className="flex justify-center gap-2 px-4 pb-5">
          {shots.map((src, i) => (
            <li key={src + i}>
              <button
                onClick={() => onPick(i)}
                aria-label={`Image ${i + 1}`}
                className={`block h-16 w-12 overflow-hidden border transition ${
                  i === index ? "border-gold" : "border-bone/25 opacity-60 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover object-top" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const Arrow = ({ side, onClick }) => (
  <button
    onClick={onClick}
    aria-label={side === "left" ? "Previous image" : "Next image"}
    className={`absolute ${side === "left" ? "left-2" : "right-2"} z-10 grid h-12 w-12 place-items-center border border-bone/25 text-bone transition hover:border-gold hover:text-gold-light`}
  >
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d={side === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  </button>
);

const ZoomIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5M11 8v6M8 11h6" />
  </svg>
);
