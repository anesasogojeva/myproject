import React from "react";

export default function Footer() {
  return (
    <footer className="relative bg-white/60 border-t border-pink-100 backdrop-blur-xl mt-20 py-14 px-10">

      {/* Soft pastel blobs */}
      <div className="absolute w-[400px] h-[400px] bg-pink-200/40 blur-[160px] -top-20 left-0"></div>
      <div className="absolute w-[350px] h-[350px] bg-yellow-200/40 blur-[160px] bottom-0 right-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h1 className="text-3xl font-extrabold text-pink-500 mb-4">FitLife</h1>
          <p className="text-gray-600">
            Healthy snacks, cute wellness essentials, and everything for your glow-up journey ✨
          </p>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Shop</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="hover:text-pink-500 transition cursor-pointer">All Products</li>
            <li className="hover:text-pink-500 transition cursor-pointer">Healthy Snacks</li>
            <li className="hover:text-pink-500 transition cursor-pointer">Supplements</li>
            <li className="hover:text-pink-500 transition cursor-pointer">Fitness Gear</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="hover:text-pink-500 transition cursor-pointer">Contact Us</li>
            <li className="hover:text-pink-500 transition cursor-pointer">Shipping Info</li>
            <li className="hover:text-pink-500 transition cursor-pointer">Returns</li>
            <li className="hover:text-pink-500 transition cursor-pointer">FAQ</li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Connect</h3>
          <div className="flex gap-5 text-2xl text-pink-500">
            <a className="hover:scale-110 transition cursor-pointer">🌸</a>
            <a className="hover:scale-110 transition cursor-pointer">💖</a>
            <a className="hover:scale-110 transition cursor-pointer">🍓</a>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <p className="text-center text-gray-500 mt-12 text-sm">
        © 2025 FitLife — Eat Cute. Live Fit. 💛
      </p>
    </footer>
  );
}
