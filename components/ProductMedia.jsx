// Refined ProductMedia with signature Islamic arch frame and delicate inner gold-tone border
const isDark = (hex) => {
  if (!hex) return false;
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.62;
};

export default function ProductMedia({ product, className = "", ratio = "aspect-[3/4]" }) {
  if (product?.image) {
    return (
      <div className={`${ratio} arch relative overflow-hidden bg-sand/50 shadow-sm ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {/* Subtle luxury vignette & inner architectural border */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-60" />
        <div className="arch pointer-events-none absolute inset-2.5 border border-white/30 transition-opacity duration-300 group-hover:border-gold/60" />
      </div>
    );
  }

  const dark = isDark(product?.color ?? "#2f3033");

  return (
    <div
      className={`${ratio} arch relative overflow-hidden ${className}`}
      style={{ backgroundColor: product?.color ?? "#2f3033" }}
      aria-hidden="true"
    >
      <div className={`pattern-girih absolute inset-0 ${dark ? "opacity-[0.16] invert" : "opacity-[0.09]"}`} />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 80% at 50% 12%, rgba(255,255,255,${dark ? 0.22 : 0.3}), transparent 62%)`,
        }}
      />
      <div className={`arch absolute inset-x-6 inset-y-5 border ${dark ? "border-white/20" : "border-ink/12"}`} />
      <span
        className={`absolute bottom-5 left-0 right-0 text-center text-[9px] tracking-brand uppercase ${
          dark ? "text-white/55" : "text-ink/40"
        }`}
      >
        {product?.fabric}
      </span>
    </div>
  );
}

