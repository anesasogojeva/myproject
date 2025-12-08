import React, { useEffect, useState } from "react";
import ProductCard from "../../components/UI/ProductCard";
import Pagination from "../../components/UI/Pagination";
import ProductFilters from "../../components/UI/ProductFilters";
import MiniCart from "../../components/UI/MiniCart";
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage =20; // 5 rows × 4 columns

  // Fetch products
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const colored = data.map((p, index) => ({
          ...p,
          bgColor: ["#F4D0B4", "#AECBFA", "#FFE8A3"][index % 3],
        }));

        setProducts(colored);
        setFiltered(colored);

        const uniqueCategories = [...new Set(colored.map((p) => p.category))];
        setCategories(uniqueCategories);
      });
  }, []);

  // Filtering + Searching + Sorting
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
  }, [products, category, search, sort]);

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const addToCart = async (productId, quantity) => {
    const token = localStorage.getItem("token");

    await fetch("http://localhost:5000/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });

    alert("Added to cart!");
  };

 return (
  <div className="px-6 py-10">
  
    <ProductFilters
      search={search}
      setSearch={setSearch}
      category={category}
      setCategory={setCategory}
      categories={categories}
      sort={sort}
      setSort={setSort}
    />

    {/* If NO products */}
    {filtered.length === 0 ? (
  <div className="flex flex-col items-center text-center py-20 opacity-90 animate-fadeIn">

    {/* Floating stars */}
    <div className="relative w-full flex justify-center mb-[-40px]">
      <div className="absolute text-yellow-400 animate-starFloat text-xl">✦</div>
      <div className="absolute left-28 text-yellow-400 animate-starFloat2 text-lg">✧</div>
      <div className="absolute right-28 text-yellow-400 animate-starFloat text-xl">★</div>
    </div>

    {/* Cute Empty Cart Illustration */}
    <svg
      width="160"
      height="160"
      viewBox="0 0 200 200"
      className="mb-6 animate-bounceSlow"
    >
      <circle cx="100" cy="100" r="95" fill="#FFF7E8" />
      <path
        d="M60 70h90l-10 50H70L60 70z"
        fill="#FFD6A5"
        stroke="#F4A261"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="80" cy="135" r="10" fill="#F4A261" />
      <circle cx="130" cy="135" r="10" fill="#F4A261" />

      {/* Sad Face */}
      <circle cx="95" cy="95" r="5" fill="#5A4E4D" />
      <circle cx="115" cy="95" r="5" fill="#5A4E4D" />
      <path
        d="M92 112 Q105 120 118 112"
        stroke="#5A4E4D"
        strokeWidth="3"
        fill="transparent"
        strokeLinecap="round"
      />
    </svg>

    <h2 className="text-xl font-semibold mb-2">Oops! Nothing to see here</h2>
    <p className="text-gray-600 max-w-md">
     It seems nothing matches your filters right now.  
          Try adjusting your search or category — we're sure you'll find something you like!! 🌸💛
    </p>
  </div>
) : (
  <>
    {/* Product Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {currentProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={addToCart}
        />
      ))}
    </div>

    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      setPage={setCurrentPage}
  onAddToCart={() => setMiniCartOpen(true)}
    />
  </>
)}

<MiniCart open={miniCartOpen} setOpen={setMiniCartOpen} />
  </div>
);

}
