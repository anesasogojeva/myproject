import React from "react";

const VARIANTS = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-rose-100 text-rose-700",
  info: "bg-sky-100 text-sky-700",
  neutral: "bg-stone-100 text-stone-600",
  brand: "bg-emerald-700 text-white",
};

export default function Badge({ variant = "neutral", className = "", children }) {
  return (
    <span className={`badge ${VARIANTS[variant] || VARIANTS.neutral} ${className}`}>
      {children}
    </span>
  );
}
