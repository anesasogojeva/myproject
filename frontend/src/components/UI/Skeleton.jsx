import React from "react";

export function Skeleton({ className = "" }) {
  return <div className={`animate-shimmer rounded-lg ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="card p-4">
      <Skeleton className="h-40 w-full mb-4 rounded-xl" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 4 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function CardSkeleton({ className = "" }) {
  return (
    <div className={`card p-6 ${className}`}>
      <Skeleton className="h-4 w-1/3 mb-3" />
      <Skeleton className="h-3 w-2/3 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}
