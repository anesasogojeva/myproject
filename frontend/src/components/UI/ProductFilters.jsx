import React from "react";

export default function ProductFilters({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  sort,
  setSort
}) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border mb-8 flex flex-wrap items-center gap-4">

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="flex-1 min-w-[200px] border px-4 py-2 rounded-xl focus:ring-2 focus:ring-black"
      />

      {/* Category */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border px-4 py-2 rounded-xl bg-white focus:ring-2 focus:ring-black"
      >
        <option value="all">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* Sorting */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="border px-4 py-2 rounded-xl bg-white focus:ring-2 focus:ring-black"
      >
        <option value="default">Sort</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
      </select>
    </div>
  );
}

