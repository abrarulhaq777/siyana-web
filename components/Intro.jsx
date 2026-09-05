"use client";

import { useEffect, useState } from "react";

/*
 * First-visit curtain: a mihrab arch draws itself in gold, the SIYANA wordmark
 * settles inside it, then the panel lifts away.
 *
 * `played` is module scope on purpose. StrictMode invokes effects twice on the
 * same mount, and a sessionStorage-only guard makes the second pass believe the
 * intro has already run — which is exactly how it ended up never showing.
 */
const KEY = "siyana:intro";
const HOLD = 2600;
let played = false;

export default function Intro() {
  const [phase, setPhase] = useState("waiting"); // waiting | playing | gone

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (played) return; // StrictMode's second pass — leave the first run alone
    played = true;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return setPhase("gone");

    let seen = false;
    try {
      seen = !!sessionStorage.getItem(KEY);
      sessionStorage.setItem(KEY, "1");
    } catch {
      // private mode: just play it
    }
    if (seen) return setPhase("gone");

    setPhase("playing");
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      document.body.style.overflow = "";
      setPhase("gone");
    }, HOLD);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (phase !== "playing") return null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-bone"
      style={{ animation: "veil 0.85s cubic-bezier(0.76,0,0.24,1) 1.75s forwards" }}
      role="status"
      aria-label="Siyana"
    >
      <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.045]" />

      <div className="relative flex flex-col items-center">
        {/* The arch draws itself around the mark */}
        <svg viewBox="0 0 200 250" className="h-64 w-60 text-gold sm:h-80 sm:w-72" aria-hidden="true">
          <path
            className="animate-draw"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            d="M14 246 V104 C14 46 56 52 88 20 c5-5 9-10 12-14 3 4 7 9 12 14 32 32 74 26 74 84 v142"
          />
          <path
            className="animate-draw"
            style={{ animationDelay: "0.3s" }}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            opacity="0.55"
            d="M28 246 V110 C28 60 66 64 94 34 c3-3 5-6 6-8 1 2 3 5 6 8 28 30 66 26 66 76 v136"
          />
        </svg>

        <div className="absolute inset-x-0 top-[46%] flex flex-col items-center">
          <span
            className="font-display text-[2.1rem] font-light uppercase tracking-[0.32em] text-ink sm:text-[2.5rem]"
            style={{ animation: "rise 1s cubic-bezier(0.22,1,0.36,1) 0.7s both" }}
          >
            Siyana
          </span>
          <span className="mt-4 h-px w-20 bg-gold" style={{ animation: "fade 0.7s ease 1.15s both" }} />
          <span
            className="mt-4 text-[8px] uppercase tracking-brand text-muted"
            style={{ animation: "fade 0.9s ease 1.3s both" }}
          >
            The Daily Modesty
          </span>
        </div>
      </div>
    </div>
  );
}
