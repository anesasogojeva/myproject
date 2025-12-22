import React from "react";
import { Link } from "react-router-dom";

export default function PaymentCancelPage() {
  return (
    <div className="max-w-2xl mx-auto text-center mt-20 p-10 bg-white shadow rounded-xl">
      <h1 className="text-3xl font-bold mb-4 text-red-500">Payment Canceled ❌</h1>
      <p className="text-gray-700 text-lg mb-6">
        Your payment was canceled. You can try again or continue shopping.
      </p>

      <Link
        to="/checkout"
        className="inline-block px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition"
      >
        Return to Checkout
      </Link>
    </div>
  );
}