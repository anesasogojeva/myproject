import React from "react";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import EmptyState from "./EmptyState";
import Button from "./Button";
import ImageWithFallback from "./ImageWithFallback";

export default function MiniCart({ open, setOpen }) {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.quantity * item.Product.price,
    0
  );

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const handleCheckout = () => {
    if (!token) {
      setOpen(false);
      navigate("/login");
      return;
    }
    setOpen(false);
    navigate("/checkout");
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-[1px] z-40 animate-fadeIn"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-elevated z-50
        transform transition-transform duration-300 flex flex-col
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-stone-100">
          <h2 className="text-lg font-display font-bold text-stone-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            Your Cart
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scroll-thin px-5">
          {cart.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              description="Browse our nutrition shop to add healthy products to your cart."
            />
          ) : (
            <div className="divide-y divide-stone-100">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-4">
                  <ImageWithFallback
                    src={item.Product.image}
                    alt={item.Product.name}
                    className="w-16 h-16 object-cover rounded-xl border border-stone-100 shrink-0"
                    iconClassName="w-5 h-5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-800 text-sm truncate">{item.Product.name}</p>
                    <p className="text-emerald-700 font-semibold text-sm">
                      ${item.Product.price.toFixed(2)}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(item.quantity - 1, 1))}
                        className="w-7 h-7 flex items-center justify-center border border-stone-200 rounded-lg hover:border-emerald-400 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center border border-stone-200 rounded-lg hover:border-emerald-400 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-stone-300 hover:text-rose-500 transition shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-stone-100 p-5 shrink-0">
            <div className="flex justify-between text-base font-semibold text-stone-900 mb-4">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Button fullWidth onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
