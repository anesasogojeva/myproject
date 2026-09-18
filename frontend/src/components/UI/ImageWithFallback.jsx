import React, { useState, useEffect } from "react";
import { Leaf } from "lucide-react";

export default function ImageWithFallback({ src, alt, className = "", iconClassName = "w-6 h-6" }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div className={`bg-cream-200 flex items-center justify-center text-emerald-700/40 ${className}`}>
        <Leaf className={iconClassName} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
