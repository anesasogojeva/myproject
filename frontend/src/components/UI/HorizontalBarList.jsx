import React from "react";

const TONE_BAR = {
  emerald: "bg-emerald-600",
  sky: "bg-sky-600",
  amber: "bg-amber-500",
};

export default function HorizontalBarList({ data, tone = "emerald", valueFormatter }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const barColor = TONE_BAR[tone] || TONE_BAR.emerald;

  if (data.length === 0) {
    return <p className="text-sm text-stone-400 py-6 text-center">No data yet.</p>;
  }

  return (
    <div className="space-y-3">
      {data.map((row) => {
        const pct = Math.max(2, Math.round((row.value / max) * 100));
        return (
          <div key={row.label} className="flex items-center gap-3">
            <span className="w-28 sm:w-32 shrink-0 text-sm text-stone-600 truncate">{row.label}</span>
            <div className="flex-1 h-2.5 rounded-full bg-stone-100 overflow-hidden">
              <div
                className={`h-full rounded-r-full ${barColor}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-sm font-semibold text-stone-800 tabular-nums">
              {valueFormatter ? valueFormatter(row.value) : row.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
