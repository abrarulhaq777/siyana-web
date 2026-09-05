"use client";

import { useEffect, useRef, useState } from "react";

// ponytail: one IntersectionObserver instead of an animation library.
const hidden = {
  up: "translate-y-8 opacity-0",
  left: "-translate-x-10 opacity-0",
  right: "translate-x-10 opacity-0",
  scale: "scale-[0.96] opacity-0",
  fade: "opacity-0",
};

export default function Reveal({ children, delay = 0, from = "up", className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "-8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        shown ? "translate-x-0 translate-y-0 scale-100 opacity-100" : hidden[from]
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
