import React, { useEffect, useState } from "react";
import { SearchX } from "lucide-react";
import ProductCard from "../../components/UI/ProductCard";
import PaginationBar from "../../components/UI/PaginationBar";
import ProductFilters from "../../components/UI/ProductFilters";
import MiniCart from "../../components/UI/MiniCart";
import EmptyState from "../../components/UI/EmptyState";
import { ProductCardSkeleton } from "../../components/UI/Skeleton";
import usePagination from "../../hooks/usePagination";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [miniCartOpen, setMiniCartOpen] = useState(false);

  const {
    page: currentPage,
    setPage: setCurrentPage,
    totalPages,
    pageItems: currentProducts,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
  } = usePagination(filtered, 25);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFiltered(data);
        setCategories([...new Set(data.map((p) => p.category))]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let temp = [...products];

    if (category !== "all") temp = temp.filter((p) => p.category === category);

    if (search)
      temp = temp.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );

    if (sort === "price-asc") temp.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") temp.sort((a, b) => b.price - a.price);

    setFiltered(temp);
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, category, search, sort]);

  return (
    <div className="container-app py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-stone-900">
          Nutrition Shop
        </h1>
        <p className="text-stone-500 mt-2">
          Healthy snacks, supplements and wellness essentials, hand-picked for your goals.
        </p>
      </div>

      <ProductFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        categories={categories}
        sort={sort}
        setSort={setSort}
      />

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No products match your filters"
          description="Try adjusting your search term or category to find what you're looking for."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <PaginationBar
            page={currentPage}
            totalPages={totalPages}
            setPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            totalItems={totalItems}
          />
        </>
      )}

      <MiniCart open={miniCartOpen} setOpen={setMiniCartOpen} />
    </div>
  );
}
