/*
 * One arch-framed image, used everywhere a photo sits in a mihrab silhouette.
 *
 * The crown of an arch clips whatever sits in the top corners — that is what was
 * cutting the hero badge and the category labels in half. So overlay content is
 * only ever rendered inside `.arch-safe`, the straight-sided zone below the curve.
 */
const shapes = { arch: "arch", sm: "arch-sm", dome: "dome", square: "" };

export default function ArchFrame({
  src,
  alt,
  ratio = "aspect-[3/4]",
  shape = "arch",
  focus = "object-center",
  kenburns = false,
  scrim = true,
  frame = true,
  zoomOnHover = false,
  className = "",
  children,
}) {
  return (
    <div className={`${ratio} ${shapes[shape]} relative overflow-hidden bg-sand/60 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={kenburns ? "eager" : "lazy"}
        className={`h-full w-full object-cover ${focus} ${kenburns ? "animate-kenburns" : ""} ${
          zoomOnHover ? "transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]" : ""
        }`}
      />

      {scrim && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
      )}

      {frame && (
        <div
          className={`${shapes[shape]} pointer-events-none absolute inset-2.5 border border-white/25 transition-colors duration-500 group-hover:border-gold/60`}
        />
      )}

      {children && (
        <div className="arch-safe absolute inset-x-0 bottom-0 flex flex-col justify-end px-6 pb-7 sm:px-7 sm:pb-8">
          {children}
        </div>
      )}
    </div>
  );
}
