import ArchFrame from "./ArchFrame";

/*
 * Product imagery. Every shot is 3:4 portrait and anchored to the top of the
 * frame so faces and necklines land in the same place across a whole row.
 */
export default function ProductMedia({ product, className = "", ratio = "aspect-[3/4]", children }) {
  if (product?.image) {
    return (
      <ArchFrame
        src={product.image}
        alt={product.name}
        ratio={ratio}
        focus="object-top"
        zoomOnHover
        scrim={false}
        className={className}
      >
        {children}
      </ArchFrame>
    );
  }

  // ponytail: tonal fallback for any product still without photography
  return (
    <div
      className={`${ratio} arch relative overflow-hidden ${className}`}
      style={{ backgroundColor: product?.color ?? "#2f3033" }}
      aria-hidden="true"
    >
      <div className="pattern-girih absolute inset-0 opacity-[0.16] invert" />
      <div className="arch absolute inset-2.5 border border-white/20" />
      <span className="absolute bottom-5 left-0 right-0 text-center text-[11px] uppercase tracking-brand text-white/55">
        {product?.fabric}
      </span>
    </div>
  );
}
