// src/pages/User/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import useAuth from "../../hooks/useAuth";
import { createCheckoutSession } from "../../api/paymentApi";
import { createCODOrder } from "../../api/codApi";

export default function CheckoutPage() {
  const { token } = useAuth();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [codLoading, setCodLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [address, setAddress] = useState("");


  useEffect(() => {
    if (cart) setLoading(false);
  }, [cart]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!cart?.length && !showSuccess) {
  return <p className="text-center mt-10">Your cart is empty.</p>;
}

  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.Product.price, 0);
  const shippingCost = 5;
  const total = subtotal + shippingCost;

  // ------------------ STRIPE CHECKOUT ------------------
const handleStripeCheckout = async () => {
  if (!token) return alert("You must be logged in to checkout.");
  if (!address.trim()) return alert("Please enter your shipping address.");

  try {
    setCheckoutLoading(true);
    const { url } = await createCheckoutSession(token, address);

    if (url) {
      // DO NOT clearCart() here
      window.location.href = url;
    } else {
      alert("Failed to create Stripe checkout session.");
    }
  } catch (err) {
    console.error("Stripe error:", err);
    alert(err.response?.data?.message || err.message);
  } finally {
    setCheckoutLoading(false);
  }
};



  // ------------------ CASH ON DELIVERY ------------------
 const handleCOD = async () => {
  if (!token) return alert("You must be logged in to checkout.");
  if (!address.trim()) return alert("Please enter your shipping address.");

  try {
    setCodLoading(true);
    const res = await createCODOrder(token, address);
    clearCart();  // <-- clear frontend cart
    setShowSuccess(true);
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
  } finally {
    setCodLoading(false);
  }
};


const SuccessModal = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-sm animate-fadeIn">
      <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-green-100 rounded-full">
        <span className="text-green-600 text-5xl">✓</span>
      </div>

      <h2 className="text-2xl font-bold">Order Confirmed!</h2>
      <p className="text-gray-600 mt-2">
        Your order has been placed successfully.  
        Please prepare payment when the product arrives.
      </p>

      <button
        className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl text-lg"
        onClick={() => {
          setShowSuccess(false);
          window.location.href = "/payment-success";
        }}
      >
        Continue
      </button>
    </div>
  </div>
);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-5 flex flex-col md:flex-row gap-10">
      {/* Left: Cart Items */}
      <div className="flex-1 bg-white shadow rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Cart Items</h2>
        <div className="space-y-4">
          {cart.map((item) => (
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

              <p className="font-bold">
                ${(item.quantity * item.Product.price).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Order Summary */}
      <div className="w-full md:w-1/3 bg-white shadow rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

        <div className="space-y-2">
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
        </div>


            <div className="mt-5">
  <label className="font-semibold">Shipping Address</label>
  <textarea
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    placeholder="Street, City, Country"
    className="w-full mt-2 border rounded-xl p-3 h-24"
  ></textarea>
</div>

        {/* Stripe Button */}
        <button
          onClick={handleStripeCheckout}
          disabled={checkoutLoading}
          className="mt-4 w-full bg-black text-white py-3 rounded-xl text-lg disabled:opacity-50"
        >
          {checkoutLoading ? "Redirecting..." : "Pay with Stripe"}
        </button>

        {/* Pay in Hand Button */}
        <button
          onClick={handleCOD}
          disabled={codLoading}
          className="mt-3 w-full bg-green-600 text-white py-3 rounded-xl text-lg disabled:opacity-50"
        >
          {codLoading ? "Placing order..." : "Pay in Hand (Cash)"}
        </button>
        {showSuccess && <SuccessModal />}
      </div>
    </div>
  );
}
