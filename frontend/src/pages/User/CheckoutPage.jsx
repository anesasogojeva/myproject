import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import useAuth from "../../hooks/useAuth";

export default function CheckoutPage() {
  const { token } = useAuth();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [shipping, setShipping] = useState({ name: "", address: "", city: "", postalCode: "" });
  const [billing, setBilling] = useState({ cardNumber: "", expiry: "", cvv: "" });

  useEffect(() => {
    if (!cart) return;
    setLoading(false);
  }, [cart]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!cart?.length) return <p className="text-center mt-10">Your cart is empty.</p>;

  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.Product.price, 0);
  const shippingCost = 5; // flat shipping fee for example
  const total = subtotal + shippingCost;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-5 flex flex-col md:flex-row gap-10">
      {/* Left: Shipping & Payment */}
      <div className="flex-1 bg-white shadow rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-bold">Shipping Information</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={shipping.name}
          onChange={e => setShipping({ ...shipping, name: e.target.value })}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          placeholder="Address"
          value={shipping.address}
          onChange={e => setShipping({ ...shipping, address: e.target.value })}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          placeholder="City"
          value={shipping.city}
          onChange={e => setShipping({ ...shipping, city: e.target.value })}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={shipping.postalCode}
          onChange={e => setShipping({ ...shipping, postalCode: e.target.value })}
          className="w-full border rounded p-2"
        />

        <h2 className="text-2xl font-bold mt-6">Payment Details</h2>
        <input
          type="text"
          placeholder="Card Number"
          value={billing.cardNumber}
          onChange={e => setBilling({ ...billing, cardNumber: e.target.value })}
          className="w-full border rounded p-2"
        />
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Expiry"
            value={billing.expiry}
            onChange={e => setBilling({ ...billing, expiry: e.target.value })}
            className="w-1/2 border rounded p-2"
          />
          <input
            type="text"
            placeholder="CVV"
            value={billing.cvv}
            onChange={e => setBilling({ ...billing, cvv: e.target.value })}
            className="w-1/2 border rounded p-2"
          />
        </div>
      </div>

      {/* Right: Order Summary */}
      <div className="w-full md:w-1/3 bg-white shadow rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.Product.name}</p>
                <p className="text-sm text-gray-500">
                  ${item.Product.price.toFixed(2)} × {item.quantity}
                </p>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 border rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 border rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-2 text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="font-bold">${(item.quantity * item.Product.price).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            className="mt-4 w-full bg-black text-white py-3 rounded-xl text-lg"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
