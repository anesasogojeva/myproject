import React from "react";
import Pagination from "./Pagination";

const DEFAULT_OPTIONS = [10, 25, 50, 100];

export default function PaginationBar({
  page,
  totalPages,
  setPage,
  itemsPerPage,
  setItemsPerPage,
  totalItems,
  options = DEFAULT_OPTIONS,
  size,
  layout = "row",
  className = "",
}) {
  if (!totalItems) return null;

  const start = (page - 1) * itemsPerPage + 1;
  const end = Math.min(page * itemsPerPage, totalItems);
  const stacked = layout === "stack";

  return (
    <div
      className={`flex ${stacked ? "flex-col" : "flex-col sm:flex-row"} items-center justify-between gap-3 mt-6 ${className}`}
    >
      <div className={`flex items-center gap-3 text-sm text-stone-500 order-2 ${stacked ? "" : "sm:order-1"}`}>
        <span className="whitespace-nowrap">
          Showing {start}–{end} of {totalItems}
        </span>
        <label className="flex items-center gap-1.5 whitespace-nowrap">
          <span className={stacked ? "hidden" : "hidden sm:inline"}>Rows per page</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border border-stone-200 rounded-lg px-2 py-1.5 text-sm text-stone-600 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          >
            {options.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        setPage={setPage}
        size={size}
        className={`mt-0 order-1 ${stacked ? "" : "sm:order-2"}`}
      />
    </div>
  );
}
