import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import ImageWithFallback from "./ImageWithFallback";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="group w-full max-w-xs cursor-pointer bg-white rounded-2xl border border-stone-200/80 shadow-soft
                 hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
    >
      <div className="aspect-square w-full bg-cream-100 overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          iconClassName="w-10 h-10"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        {product.category && (
          <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 mb-1">
            {product.category}
          </span>
        )}
        <h3 className="text-sm font-semibold text-stone-900 leading-snug line-clamp-2">
          {product.name}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-lg font-display font-bold text-stone-900">
            ${Number(product.price).toFixed(2)}
          </p>
          <button
            onClick={handleAdd}
            aria-label="Add to cart"
            className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center
                       hover:bg-emerald-800 transition shrink-0"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
