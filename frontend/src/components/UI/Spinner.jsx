import React from "react";
import { Loader2 } from "lucide-react";

export default function Spinner({ size = 24, className = "", label }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-emerald-700 ${className}`}>
      <Loader2 style={{ width: size, height: size }} className="animate-spin" />
      {label && <p className="text-sm text-stone-500">{label}</p>}
    </div>
  );
}

export function PageSpinner({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-24">
      <Spinner size={32} label={label} />
    </div>
  );
}
