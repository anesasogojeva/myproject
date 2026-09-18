import { useEffect, useState } from "react";

export default function usePagination(items, initialItemsPerPage = 10) {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  // Reset to page 1 whenever the underlying list or page size changes
  useEffect(() => {
    setPage(1);
  }, [items.length, itemsPerPage]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const start = (page - 1) * itemsPerPage;
  const pageItems = items.slice(start, start + itemsPerPage);

  return {
    page,
    setPage,
    totalPages,
    pageItems,
    itemsPerPage,
    setItemsPerPage,
    totalItems: items.length,
  };
}
