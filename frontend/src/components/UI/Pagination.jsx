import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  setPage,
  size = "md",
  className = "",
}) {
  function getVisiblePages(currentPage, totalPages) {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4];
    }

    const start = currentPage - 3;
    return Array.from({ length: 4 }, (_, i) => start + i);
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);

  if (totalPages <= 1) return null;

  const compact = size === "sm";
  const btnSize = compact ? "w-7 h-7" : "w-9 h-9";
  const navBtn = `${btnSize} flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:border-emerald-400 hover:text-emerald-700 transition disabled:opacity-30 disabled:hover:border-stone-200 disabled:hover:text-stone-500`;
  const iconSize = compact ? "w-3.5 h-3.5" : "w-4 h-4";
  const defaultMargin = compact ? "mt-4" : "mt-10";

  return (
    <div className={`flex justify-center items-center gap-1.5 ${className || defaultMargin} select-none flex-wrap`}>
      <button onClick={() => setPage(1)} disabled={currentPage === 1} className={navBtn} aria-label="First page">
        <ChevronsLeft className={iconSize} />
      </button>

      <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className={navBtn} aria-label="Previous page">
        <ChevronLeft className={iconSize} />
      </button>

      {visiblePages.map((num) => (
        <button
          key={num}
          onClick={() => setPage(num)}
          className={`${btnSize} rounded-lg text-sm font-medium transition
            ${currentPage === num
              ? "bg-emerald-700 text-white shadow-soft"
              : "border border-stone-200 text-stone-600 hover:border-emerald-400 hover:text-emerald-700"}`}
        >
          {num}
        </button>
      ))}

      <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={navBtn} aria-label="Next page">
        <ChevronRight className={iconSize} />
      </button>

      <button onClick={() => setPage(totalPages)} disabled={currentPage === totalPages} className={navBtn} aria-label="Last page">
        <ChevronsRight className={iconSize} />
      </button>
    </div>
  );
}
