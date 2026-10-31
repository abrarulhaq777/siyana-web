import Image from "next/image";

/*
 * Product imagery. Every shot is 3:4 portrait and anchored to the top of the
 * frame so faces and necklines land in the same place across a whole row.
 * Uploads are large PNGs, so they go through the image optimizer: `sizes` says how
 * wide the photo is on screen and the browser downloads a copy to match.
 */
const isLocal = (src) => src.startsWith("/") && !src.endsWith(".svg");

export default function ProductMedia({
  product,
  className = "",
  ratio = "aspect-[3/4]",
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  eager = false,
  children,
}) {
  const primaryImg = product?.image || product?.images?.[0];
  const secondaryImg =
    product?.images && product.images.length > 1 && product.images[1] !== primaryImg
      ? product.images[1]
      : null;

  if (primaryImg) {
    return (
      <div className={`${ratio} arch relative overflow-hidden bg-sand/60 ${className}`}>
        {/* Primary cover image */}
        <Image
          src={primaryImg}
          alt={product.name}
          fill
          sizes={sizes}
          unoptimized={!isLocal(primaryImg)}
          loading={eager ? "eager" : "lazy"}
          className={`object-cover object-top transition-all duration-[1100ms] ease-out group-hover:scale-[1.06] ${
            secondaryImg ? "group-hover:opacity-0" : ""
          }`}
        />

        {/* Secondary image crossfade on hover. display:none on touch screens, so phones never download it. */}
        {secondaryImg && (
          <Image
            src={secondaryImg}
            alt={`${product.name} angle`}
            fill
            sizes={sizes}
            unoptimized={!isLocal(secondaryImg)}
            className="pointer-events-none hidden object-cover object-top opacity-0 transition-all duration-[1100ms] ease-out group-hover:scale-[1.06] group-hover:opacity-100 [@media(hover:hover)]:block"
          />
        )}

        <div className="arch pointer-events-none absolute inset-2.5 border border-white/25 transition-colors duration-500 group-hover:border-gold/60" />

        {children && (
          <div className="arch-safe absolute inset-x-0 bottom-0 flex flex-col justify-end px-6 pb-7 sm:px-7 sm:pb-8">
            {children}
          </div>
        )}
      </div>
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
