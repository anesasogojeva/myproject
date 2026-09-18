import React from "react";
import { Link } from "react-router-dom";
import { Leaf, ShieldCheck, Sparkles, Users } from "lucide-react";

const points = [
  { icon: Sparkles, text: "Personalized AI-generated nutrition plans" },
  { icon: Users, text: "Direct access to certified dietitians" },
  { icon: ShieldCheck, text: "A trusted, secure healthy-food marketplace" },
];

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-[calc(100vh-5rem)] grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-emerald-800 text-white p-12 relative overflow-hidden">
        <Link to="/home" className="flex items-center gap-2 relative z-10">
          <span className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
            <Leaf className="w-5 h-5" />
          </span>
          <span className="text-xl font-display font-bold">FitLife</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-display font-bold leading-tight mb-6">
            Your journey to better health starts here.
          </h2>
          <ul className="space-y-4">
            {points.map((p) => (
              <li key={p.text} className="flex items-start gap-3 text-emerald-50">
                <span className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <p.icon className="w-4 h-4" />
                </span>
                <span className="text-sm leading-relaxed">{p.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-emerald-200/70 relative z-10">
          © {new Date().getFullYear()} FitLife. All rights reserved.
        </p>

        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-emerald-700 rounded-full opacity-50" />
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-emerald-700/60 rounded-full" />
      </div>

      <div className="flex items-center justify-center px-4 sm:px-8 py-14 bg-cream-50">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <span className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </span>
            <span className="text-lg font-display font-bold text-stone-900">FitLife</span>
          </div>

          <h1 className="text-2xl font-display font-bold text-stone-900 text-center">{title}</h1>
          {subtitle && <p className="text-stone-500 text-sm text-center mt-2">{subtitle}</p>}

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
