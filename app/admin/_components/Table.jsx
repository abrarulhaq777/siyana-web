export function Table({ head, children, empty = "Nothing here yet." }) {
  const rows = Array.isArray(children) ? children.filter(Boolean) : children;
  const isEmpty = Array.isArray(rows) ? rows.length === 0 : !rows;

  return (
    <div className="overflow-x-auto border border-line bg-paper">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-sand/40 text-[9.5px] uppercase tracking-[0.16em] text-muted">
            {head.map((h) => (
              <th key={h} className="px-4 py-3.5 font-normal">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td colSpan={head.length} className="px-4 py-16 text-center text-xs text-muted">
                {empty}
              </td>
            </tr>
          ) : (
            rows
          )}
        </tbody>
      </table>
    </div>
  );
}

export const Row = ({ children }) => (
  <tr className="border-b border-line/70 last:border-0 hover:bg-sand/25">{children}</tr>
);

export const Cell = ({ children, className = "" }) => (
  <td className={`px-4 py-3.5 align-middle ${className}`}>{children}</td>
);
