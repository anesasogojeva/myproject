// src/hooks/useProducts.js
import { useState, useEffect } from "react";
import { fetchProducts } from "../api/productApi";

export default function useProducts({ page, limit, search, category, sort }) {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data once
  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then((res) => setAllProducts(res))
      .finally(() => setLoading(false));
  }, []);

  // Filter + sort + paginate
  let filtered = [...allProducts];

  // Search
  if (search) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Category filter
  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }

  // Sorting
  if (sort === "price_asc") {
    filtered.sort((a, b) => a.price - b.price);
  }
  if (sort === "price_desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  // Pagination
  const total = filtered.length;
  const start = (page - 1) * limit;
  const products = filtered.slice(start, start + limit);

  return { products, total, loading };
}
