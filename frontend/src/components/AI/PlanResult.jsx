import React from "react";
import { Utensils, Dumbbell, ShoppingBag } from "lucide-react";
import Card from "../UI/Card";
import ProductCard from "../UI/ProductCard";

export default function PlanResult({ result }) {
  if (!result) return null;

  return (
    <div className="space-y-6">
      {result.summary && (
        <Card className="bg-emerald-50 border-emerald-100">
          <h2 className="text-lg font-display font-bold text-stone-900 mb-4">Your Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "BMI", value: result.summary.bmi },
              { label: "Daily calories", value: result.summary.dailyCalories },
              { label: "Protein target", value: `${result.summary.proteinTargetG}g` },
              { label: "Expected pace", value: result.summary.weeklyChange },
            ].map((s) => (
              <div key={s.label}>
                <span className="text-xs text-stone-500">{s.label}</span>
                <p className="font-display font-bold text-xl text-stone-900">{s.value}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h2 className="text-lg font-display font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Utensils className="w-5 h-5 text-emerald-700" /> Meal Plan
        </h2>
        {result.mealPlan?.map((meal, i) => (
          <div key={i} className="mb-4 pb-4 border-b border-stone-100 last:border-0 last:mb-0 last:pb-0">
            <div className="flex justify-between items-center">
              <strong className="text-emerald-700">{meal.meal}</strong>
              <span className="text-sm text-stone-400">{meal.calories} kcal</span>
            </div>
            <ul className="list-disc ml-5 mt-1.5 text-stone-600 text-sm space-y-0.5">
              {meal.recipes?.map((r, j) => <li key={j}>{r}</li>)}
            </ul>
          </div>
        ))}
      </Card>

      <Card>
        <h2 className="text-lg font-display font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-emerald-700" /> Fitness Plan
        </h2>
        {result.fitnessPlan?.map((f, i) => (
          <div key={i} className="mb-3 flex gap-3 text-sm">
            <span className="font-semibold text-stone-900 min-w-[90px]">{f.day}</span>
            <span className="text-stone-600">{f.exercise}</span>
          </div>
        ))}
      </Card>

      {result.recommendedProducts?.length > 0 && (
        <Card>
          <h2 className="text-lg font-display font-bold text-stone-900 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" /> Recommended from Our Store
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-items-center">
            {result.recommendedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
