// src/pages/User/PaymentSuccessPage.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function PaymentSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart only when user reaches success page
    clearCart();
  }, []);

  return (
    <div className="max-w-2xl mx-auto text-center mt-20 p-10 bg-white shadow rounded-xl">
      <h1 className="text-3xl font-bold mb-4">Payment Successful 🎉</h1>
      <p className="text-gray-700 text-lg mb-6">
        Thank you for your purchase! Your order has been completed successfully.
      </p>

      <Link
        to="/"
        className="inline-block px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
