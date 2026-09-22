import { classNames } from "../../../utils/formatters";

export function Table({ columns, data, keyField = "id", onRowClick, emptyState }) {
  if (!data || data.length === 0) {
    return emptyState || null;
  }

  return (
    <div className="overflow-x-auto scrollbar-thin -mx-1">
      <table className="w-full text-sm border-collapse min-w-[640px]">
        <thead>
          <tr className="border-b border-ink-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left font-medium text-ink-500 pb-3 px-3 whitespace-nowrap first:pl-1"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row[keyField]}
              onClick={() => onRowClick?.(row)}
              className={classNames(
                "border-b border-ink-100/60 last:border-0 transition-colors",
                onRowClick && "cursor-pointer hover:bg-clinic-50"
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className="py-3.5 px-3 text-ink-700 first:pl-1 align-middle">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
