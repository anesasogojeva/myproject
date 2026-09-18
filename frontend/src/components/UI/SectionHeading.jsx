import React from "react";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}) {
  return (
    <div
      className={`${align === "center" ? "text-center mx-auto" : "text-left"} max-w-2xl mb-12 ${className}`}
    >
      {eyebrow && (
        <span className="inline-block text-xs font-semibold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-display font-bold text-stone-900 leading-tight">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-stone-500 text-base sm:text-lg">{subtitle}</p>}
    </div>
  );
}
