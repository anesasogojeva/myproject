import React from "react";
import { X, Plus, Minus } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

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
      navigate("/login");
      return;
    }
    setOpen(false);
    navigate("/checkout");
  };

  return (
    <>
      {/* Background Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 
        transform transition-transform duration-300 
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <button onClick={() => setOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="p-4 overflow-y-auto h-[70%]">
          {cart.length === 0 ? (
            <p className="text-gray-500 mt-6 text-center">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between mb-4 pb-4 border-b"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.Product.image}
                    alt={item.Product.name}
                    className="w-16 h-16 object-contain rounded-lg"
                  />
                  <div>
                    <p className="font-semibold">{item.Product.name}</p>
                    <p className="text-gray-600 text-sm">
                      ${item.Product.price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(item.quantity - 1, 1))
                        }
                        className="p-1 border rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1 border rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer (Total + Checkout Button) */}
        <div className="absolute bottom-0 w-full p-4 border-t bg-white">
          <div className="flex justify-between font-semibold mb-3">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition"
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
}
