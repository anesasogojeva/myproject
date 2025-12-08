import React from "react";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-100 pt-28 px-6">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {/* EMPTY STATE */}
      {cart.length === 0 && (
        <div className="text-center py-20 text-gray-500 text-lg">
          Your cart is empty 🛒  
        </div>
      )}

      {/* LIST OF ITEMS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT: ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl shadow-sm flex items-center gap-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-contain rounded-xl"
              />

              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-500">{item.brand}</p>
                <p className="font-bold mt-1">${item.price.toFixed(2)}</p>
              </div>

              {/* REMOVE */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-600 font-semibold"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="bg-white p-6 rounded-2xl shadow-sm h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="flex justify-between text-lg font-medium">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
<Link to="/checkout">
  <button className="w-full mt-6 bg-black text-white py-3 rounded-full font-semibold">
    Proceed to Checkout
  </button>
</Link>
        </div>

      </div>
    </div>
  );
}
