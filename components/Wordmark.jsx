export default function Wordmark({ tagline = true, className = "" }) {
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span className="flex items-center gap-2">
        <span className="font-display text-[1.65rem] font-light tracking-[0.24em] uppercase text-ink">
          Siyana
        </span>
        <span className="font-arabic text-[15px] font-normal text-gold tracking-normal">
          صِيَانَة
        </span>
      </span>
      {tagline && (
        <span className="mt-1 text-[7px] tracking-brand uppercase text-muted/80">
          The Daily Modesty · الحشمة والوقار
        </span>
      )}
    </span>
  );
}

