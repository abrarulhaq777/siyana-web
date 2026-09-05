export default function Wordmark({ tagline = true, className = "" }) {
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span className="font-display text-[1.65rem] font-light uppercase tracking-[0.26em] text-ink">
        Siyana
      </span>
      {tagline && (
        <span className="mt-1.5 text-[7px] uppercase tracking-brand text-muted/80">
          The Daily Modesty
        </span>
      )}
    </span>
  );
}
