import React from "react";
import { Inbox } from "lucide-react";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description,
  action,
  className = "",
}) {
  return (
    <div className={`flex flex-col items-center text-center py-14 px-6 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
      {description && (
        <p className="text-sm text-stone-500 mt-2 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
