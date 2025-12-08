import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="relative w-64 flex-shrink-0 cursor-pointer">
      
      {/* TRANSPARENT TOP AREA FOR FLOATING IMAGE */}
      <div
        className="h-16 w-full bg-transparent flex justify-center"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-40 object-contain drop-shadow-xl -mt-0 relative z-30"
        />
      </div>

      {/* SOFT CREAM GRADIENT CARD AREA */}
      <div
        className="rounded-3xl shadow-md pt-20 pb-8 px-5 relative z-10 mt-3.5"
        style={{ background: "linear-gradient(135deg, #FFFDF7 0%, #FFF8E7 100%)" }}
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <h3 className="text-lg font-semibold text-black leading-tight">
          {product.name}
        </h3>

        <p className="text-sm text-gray-700 opacity-70 mt-1">
          By {product.brand || "Brand"}
        </p>

        <div className="mt-4 flex items-end justify-between">
          <p className="text-2xl font-bold text-black">${product.price.toFixed(2)}</p>
        </div>
      </div>

      {/* ADD TO CART BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent navigating when clicking this button
          addToCart(product);
        }}
        className="absolute right-[25px] bottom-0 translate-y-1/3 z-40
                   flex items-center gap-2 px-4 py-2
                   bg-black text-white rounded-full 
                   shadow-[0_8px_20px_rgba(0,0,0,0.25)]
                   outline outline-[10px] outline-white/95
                   hover:scale-105 transition-all duration-200"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <path
            d="M3 3h2l.4 2M7 13h10l4-8H5.4"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="20" r="1.5" fill="white" />
          <circle cx="18" cy="20" r="1.5" fill="white" />
        </svg>
        <span className="text-sm font-medium">Cart</span>
      </button>
    </div>
  );
}
