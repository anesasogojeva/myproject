import React from "react";
import { Search } from "lucide-react";

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
    <div className="card p-4 sm:p-5 mb-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search healthy foods..."
          className="field-input pl-10"
        />
      </div>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="field-input sm:w-52"
      >
        <option value="all">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="field-input sm:w-52"
      >
        <option value="default">Sort by</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
      </select>
    </div>
  );
}
