"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/*
 * Siyana Atelier Islamic Preloader
 * - Sacred Mihrab Arch Frame with animated gold hairline
 * - Geometric 8-point Khatim Star finial (no moon)
 * - Sacred Bismillah opening calligraphy
 * - Authentic transparent Siyana brand logo (no background)
 * - Arabic atelier seal & quiet-luxury silk curtain lift
 */
export default function Intro() {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Lock body scroll during intro
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Start curtain lift transition
    const exitTimer = setTimeout(() => {
      setClosing(true);
    }, 2100);

    // Completely unmount after transition finishes
    const unmountTimer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = originalOverflow || "";
    }, 2850);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
      document.body.style.overflow = originalOverflow || "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FAF8F5] text-ink transition-all duration-[750ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
        closing ? "-translate-y-full opacity-90 pointer-events-none" : "translate-y-0 opacity-100"
      }`}
      role="status"
      aria-label="Siyana Atelier — The Daily Modesty"
    >
      {/* Background Girih Islamic Star Pattern */}
      <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.04]" />

      {/* Warm Ambient Golden Center Glow */}
      <div className="pointer-events-none absolute h-[480px] w-[480px] rounded-full bg-gold/10 blur-[140px]" />

      {/* Main Sacred Enclosure */}
      <div className="relative flex flex-col items-center px-4">
        
        {/* Sacred Islamic Mihrab Arch Frame */}
        <div className="relative flex h-[340px] w-[290px] items-center justify-center sm:h-[380px] sm:w-[330px]">
          
          {/* Detailed Mihrab Arch SVG */}
          <svg
            viewBox="0 0 220 280"
            className="absolute inset-0 h-full w-full text-gold"
            aria-hidden="true"
          >
            {/* Outer Sacred Ogee / Cusped Arch */}
            <path
              className="animate-draw"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              d="M16 276 V118 C16 54 66 60 102 24 c4-4 8-8 10-14 2 6 6 10 10 14 36 36 86 30 86 94 v158"
            />
            {/* Inner Sacred Arch Hairline */}
            <path
              className="animate-draw"
              style={{ animationDelay: "0.2s" }}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
              opacity="0.6"
              d="M30 276 V124 C30 68 74 72 106 38 c2-2 3-4 4-6 1 2 2 4 4 6 32 34 76 30 76 86 v152"
            />
            {/* Base Line */}
            <line
              x1="12"
              y1="276"
              x2="208"
              y2="276"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.4"
            />
          </svg>

          {/* Center Content: Fitted inside the Islamic Mihrab Design */}
          <div className="relative z-10 flex flex-col items-center px-4 text-center">
            
            {/* Sacred Opening Inscription */}
            <p
              className="font-serif text-[12px] tracking-[0.24em] text-gold-dark font-medium opacity-90 select-none"
              style={{ animation: "fade 0.8s ease 0.3s both" }}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>

            {/* Official Siyana Brand Logo - 100% Transparent, No Background */}
            <div
              className="relative mt-5 flex items-center justify-center"
              style={{ animation: "rise 0.9s cubic-bezier(0.22,1,0.36,1) 0.4s both" }}
            >
              <Image
                src="/siyana-logo-transparent.png"
                alt="Siyana — The Daily Modesty"
                width={468}
                height={184}
                priority
                className="h-auto w-48 sm:w-52 drop-shadow-xs"
              />
            </div>

            {/* Golden Geometric Hairline Divider */}
            <div
              className="mt-4 flex items-center gap-2.5 text-gold"
              style={{ animation: "fade 0.7s ease 0.7s both" }}
            >
              <span className="h-px w-10 bg-gold/50" />
              <span className="h-1.5 w-1.5 rotate-45 border border-gold bg-gold/25" />
              <span className="h-px w-10 bg-gold/50" />
            </div>

            {/* Subtle Progress Bar */}
            <div
              className="mt-5 h-[1.5px] w-28 overflow-hidden rounded-full bg-sand/60"
              style={{ animation: "fade 0.7s ease 0.95s both" }}
            >
              <div
                className="h-full bg-gold transition-all duration-1000"
                style={{
                  width: "100%",
                  animation: "sheen 1.3s ease-in-out infinite",
                }}
              />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
