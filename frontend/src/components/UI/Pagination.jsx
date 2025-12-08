import React from "react";

export default function Pagination({
  currentPage,
  totalPages,
  setPage,
}) {
  function getVisiblePages(currentPage, totalPages) {
  if (totalPages <= 4) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4];
  }

  // If user is past page 4, shift the window
  const start = currentPage - 3;
  const end = currentPage;

  return Array.from({ length: 4 }, (_, i) => start + i);
}


  const visiblePages = getVisiblePages(currentPage, totalPages);

  if (totalPages === 0) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-10 select-none">

      {/* First Page */}
      <button
        onClick={() => setPage(1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-lg border text-sm disabled:opacity-30"
      >
        «
      </button>

      {/* Previous */}
      <button
        onClick={() => setPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-lg border text-sm disabled:opacity-30"
      >
        ‹
      </button>

      {/* Page Numbers */}
      {visiblePages.map(num => (
        <button
          key={num}
          onClick={() => setPage(num)}
          className={`px-4 py-2 rounded-xl border text-sm transition 
            ${currentPage === num 
              ? "bg-black text-white shadow-md" 
              : "hover:bg-gray-100"}`}
        >
          {num}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-lg border text-sm disabled:opacity-30"
      >
        ›
      </button>

      {/* Last Page */}
      <button
        onClick={() => setPage(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-lg border text-sm disabled:opacity-30"
      >
        »
      </button>
    </div>
  );
}

