/** Star rating, filled to the nearest half. */
export default function Stars({ value = 0, size = "h-3.5 w-3.5", className = "" }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-gold ${className}`} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = value >= n ? 1 : value >= n - 0.5 ? 0.5 : 0;
        return (
          <svg key={n} viewBox="0 0 24 24" className={size} aria-hidden="true">
            <defs>
              <linearGradient id={`s${n}-${String(value).replace(".", "_")}`}>
                <stop offset={`${fill * 100}%`} stopColor="currentColor" />
                <stop offset={`${fill * 100}%`} stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d="M12 2.6l2.7 5.9 6.3.7-4.7 4.3 1.3 6.3L12 16.7 6.4 19.8l1.3-6.3L3 9.2l6.3-.7z"
              fill={`url(#s${n}-${String(value).replace(".", "_")})`}
              stroke="currentColor"
              strokeWidth="1.1"
            />
          </svg>
        );
      })}
    </span>
  );
}
