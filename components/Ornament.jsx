/*
 * Islamic structural line-art, drawn as gold hairlines rather than clip-art.
 * Every piece strokes `currentColor`, so colour comes from the parent.
 */

const s = { fill: "none", stroke: "currentColor", strokeWidth: 1, vectorEffect: "non-scaling-stroke" };

/* 16-point girih rosette — the mandala medallion */
export function Rosette({ className = "", petals = 16, spin = false }) {
  return (
    <svg viewBox="0 0 100 100" className={`${className} ${spin ? "animate-turn" : ""}`} aria-hidden="true">
      <g {...s}>
        <circle cx="50" cy="50" r="49" />
        <circle cx="50" cy="50" r="41" strokeWidth="0.6" />
        {Array.from({ length: petals }, (_, i) => (
          <ellipse key={i} cx="50" cy="27" rx="6" ry="13.5" strokeWidth="0.6"
            transform={`rotate(${(i * 360) / petals} 50 50)`} />
        ))}
        <circle cx="50" cy="50" r="15" strokeWidth="0.8" />
        <rect x="39.4" y="39.4" width="21.2" height="21.2" strokeWidth="0.6" />
        <rect x="39.4" y="39.4" width="21.2" height="21.2" strokeWidth="0.6" transform="rotate(45 50 50)" />
      </g>
    </svg>
  );
}

/* 8-point khatim star — the unit tile of a girih grid */
export function Star({ className = "" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <g {...s} strokeWidth="1.1">
        <rect x="6" y="6" width="20" height="20" />
        <rect x="6" y="6" width="20" height="20" transform="rotate(45 16 16)" />
      </g>
    </svg>
  );
}

/* Crescent — hilal, in outline */
export function Crescent({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path {...s} strokeWidth="1.2" d="M44 9a24 24 0 1 0 0 46A29 29 0 0 1 44 9Z" />
    </svg>
  );
}

/* Hanging lantern — fanoos, on its chain */
export function Lantern({ className = "", drop = 40, style }) {
  return (
    <svg viewBox="0 0 40 120" className={className} style={style} preserveAspectRatio="xMidYMin meet" aria-hidden="true">
      <g {...s} strokeWidth="0.9">
        <path d={`M20 0 v${drop}`} strokeWidth="0.6" />
        <circle cx="20" cy={drop + 3} r="2.5" />
        <path d={`M9 ${drop + 16} q11 -13 22 0`} />
        <path d={`M11 ${drop + 16} h18 v26 h-18 Z`} />
        <path d={`M11 ${drop + 24} h18 M11 ${drop + 34} h18`} strokeWidth="0.5" />
        <path d={`M17 ${drop + 16} v26 M23 ${drop + 16} v26`} strokeWidth="0.5" />
        <path d={`M14 ${drop + 42} h12 l-3 5 h-6 Z`} />
        <path d={`M20 ${drop + 47} v5`} strokeWidth="0.6" />
        <circle cx="20" cy={drop + 54} r="2" />
      </g>
    </svg>
  );
}

/* Onion-dome outline — the ogee crown, for framing and mastheads */
export function Dome({ className = "", inner = true }) {
  return (
    <svg viewBox="0 0 100 140" className={className} preserveAspectRatio="none" aria-hidden="true">
      <g {...s}>
        <path d="M0 140 V62 C0 30 18 34 36 14 C42 7 46 3 50 0 c4 3 8 7 14 14 18 20 36 16 36 48 v78" />
        {inner && (
          <path strokeWidth="0.6" opacity="0.55"
            d="M7 140 V64 C7 36 23 39 39 21 c4-5 8-9 11-12 3 3 7 7 11 12 16 18 32 15 32 43 v76" />
        )}
      </g>
    </svg>
  );
}

/* Ornamental corner bracket — mirror it with CSS scale on the other corners */
export function Corner({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <g {...s} strokeWidth="0.8">
        <path d="M0 22 C0 10 10 0 22 0" />
        <path d="M0 34 C0 16 16 0 34 0" opacity="0.6" />
        <path d="M8 22 a6 6 0 0 1 6-6" opacity="0.8" />
        <circle cx="22" cy="22" r="2.2" />
        <path d="M30 4 l4 4 -4 4 -4-4 Z" opacity="0.7" />
        <path d="M4 30 l4 4 -4 4 -4-4 Z" opacity="0.7" />
      </g>
    </svg>
  );
}

/* Section divider — hairline, star, hairline */
export function Divider({ className = "", label }) {
  return (
    <div className={`flex items-center justify-center gap-5 text-gold ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50 sm:w-28" />
      <Star className="h-4 w-4 shrink-0 opacity-75" />
      {label && (
        <span className="shrink-0 text-[11px] uppercase tracking-brand text-muted">{label}</span>
      )}
      <Star className="h-4 w-4 shrink-0 opacity-75" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50 sm:w-28" />
    </div>
  );
}

/* Scalloped mashrabiya rule — the arcaded edge of a screen */
export function Scallop({ className = "", flip = false }) {
  return (
    <div
      className={`pattern-scallop h-[18px] w-full ${flip ? "rotate-180" : ""} ${className}`}
      aria-hidden="true"
    />
  );
}
