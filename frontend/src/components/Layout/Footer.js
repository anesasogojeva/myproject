import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-24">
      <div className="container-app py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Link to="/home" className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </span>
            <span className="text-lg font-display font-bold text-white">FitLife</span>
          </Link>
          <p className="text-sm text-stone-400 leading-relaxed">
            Personalized nutrition guidance, healthy food essentials, and a professional
            dietitian team — all in one place.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Shop</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/products" className="hover:text-emerald-400 transition">All Products</Link></li>
            <li><Link to="/ai-planner" className="hover:text-emerald-400 transition">AI Nutrition Planner</Link></li>
            <li><Link to="/about" className="hover:text-emerald-400 transition">About Us</Link></li>
            <li><Link to="/cart" className="hover:text-emerald-400 transition">Your Cart</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Support</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-emerald-400 transition">Contact Us</Link></li>
            <li><Link to="/login" className="hover:text-emerald-400 transition">Sign In</Link></li>
            <li><Link to="/register" className="hover:text-emerald-400 transition">Create Account</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Get in touch</h3>
          <ul className="space-y-3 text-sm text-stone-400">
            <li className="flex items-center gap-2.5"><Mail className="w-4 h-4 text-emerald-500 shrink-0" /> support@fitlife.com</li>
            <li className="flex items-center gap-2.5"><Phone className="w-4 h-4 text-emerald-500 shrink-0" /> +1 (555) 123-4567</li>
            <li className="flex items-center gap-2.5"><MapPin className="w-4 h-4 text-emerald-500 shrink-0" /> 123 Wellness St, Healthy City</li>
          </ul>
          <div className="flex gap-3 mt-5">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <button
                key={i}
                type="button"
                className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center hover:bg-emerald-700 transition"
              >
                <Icon className="w-4 h-4 text-white" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <p className="container-app py-6 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} FitLife. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
