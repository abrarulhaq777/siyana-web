/*
 * A product photo set in a mihrab niche: an ogee arch crown filled with girih lattice
 * sits above the photo, and its outer and inner outlines run on down the sides as a
 * double gold border. Product photos are posters (text and flat-lay on the left, model
 * on the right), so the photo is never cropped — the architecture lives in the crown.
 *
 * The crown's box and viewBox share one 300:110 ratio, so the curve is never stretched,
 * and the inner outline sits at 4% of the width — the same 4% padding that insets the
 * photo — so the two lines meet where the arch turns into the frame.
 */
const OUTER = "M0 110 V74 C0 44 62 42 112 22 C132 14 144 8 150 2 C156 8 168 14 188 22 C238 42 300 44 300 74 V110";
const INNER = "M12 110 V77 C12 53 68 51 116 32 C134 25 145 19 150 14 C155 19 166 25 184 32 C232 51 288 53 288 77 V110";

const tones = {
  light: { bg: "bg-paper", fill: "fill-paper", line: "text-gold", border: "border-gold/70", inner: "border-gold/40" },
  dark: { bg: "bg-midnight-deep", fill: "fill-midnight-deep", line: "text-gold", border: "border-gold/60", inner: "border-gold/35" },
};

export default function MihrabFrame({ src, alt, label, tone = "light", className = "" }) {
  const t = tones[tone];
  const lattice = `mihrab-lattice-${tone}`;

  return (
    <div className={`group relative ${className}`}>
      <div className={`relative aspect-[300/110] ${t.line}`}>
        <svg viewBox="0 0 300 110" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <defs>
            <pattern id={lattice} width="18" height="18" patternUnits="userSpaceOnUse">
              <g fill="none" stroke="currentColor" strokeWidth="0.45" opacity="0.55">
                <path d="M9 1 L17 9 L9 17 L1 9 Z" />
                <rect x="3.4" y="3.4" width="11.2" height="11.2" />
                <circle cx="9" cy="9" r="1.6" />
              </g>
            </pattern>
          </defs>

          <path d={`${OUTER} Z`} className={t.fill} />
          <path d={`${INNER} Z`} fill={`url(#${lattice})`} />
          <path d={OUTER} fill="none" stroke="currentColor" strokeWidth="1.1" vectorEffect="non-scaling-stroke" />
          <path d={INNER} fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.7" vectorEffect="non-scaling-stroke" />

          {/* Khatim star at the heart of the crown */}
          <g transform="translate(150 62)" className={t.fill}>
            <circle r="15" />
            <g fill="none" stroke="currentColor" strokeWidth="0.9" vectorEffect="non-scaling-stroke">
              <rect x="-8" y="-8" width="16" height="16" />
              <rect x="-8" y="-8" width="16" height="16" transform="rotate(45)" />
              <circle r="15" opacity="0.6" />
            </g>
          </g>
          {/* Finial at the apex */}
          <path d="M150 2 V-10" stroke="currentColor" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
          <circle cx="150" cy="-12" r="2.2" fill="currentColor" />
        </svg>

        {label && (
          <span className="absolute inset-x-0 bottom-[6%] text-center text-[9.5px] uppercase tracking-[0.24em] text-gold-dark sm:text-[10px]">
            <span className={`${t.bg} px-2 ${tone === "dark" ? "text-gold-light" : ""}`}>{label}</span>
          </span>
        )}
      </div>

      <div className={`border-x border-b ${t.border} ${t.bg} px-[4%] pb-[4%]`}>
        <div className={`relative overflow-hidden border ${t.inner}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="aspect-[3/4] w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
          />
        </div>
      </div>
    </div>
  );
}
