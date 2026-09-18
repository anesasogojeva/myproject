import React from "react";
import Card from "./Card";

export default function StatCard({ icon: Icon, label, value, hint, tone = "emerald" }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    sky: "bg-sky-50 text-sky-700",
  };

  return (
    <Card className="flex items-center gap-4" padding="p-5">
      {Icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tones[tone] || tones.emerald}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm text-stone-500 truncate">{label}</p>
        <p className="text-2xl font-display font-bold text-stone-900 leading-tight">{value}</p>
        {hint && <p className="text-xs text-stone-400 mt-0.5">{hint}</p>}
      </div>
    </Card>
  );
}
