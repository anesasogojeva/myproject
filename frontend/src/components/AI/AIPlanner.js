import React, { useState } from "react";
import axios from "axios";
import { Sparkles, Utensils, Dumbbell, ShoppingBag, AlertCircle } from "lucide-react";
import Card from "../UI/Card";
import Button from "../UI/Button";
import { Input, Select } from "../UI/FormField";
import { CardSkeleton } from "../UI/Skeleton";
import ProductCard from "../UI/ProductCard";

export default function AIPlanner() {
  const [form, setForm] = useState({
    currentWeight: "",
    targetWeight: "",
    goal: "lose",
    age: "",
    height: "",
    weeklyBudget: 50,
    gymDays: 3,
    vegetarian: false,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    });
  };

  const generatePlan = async () => {
    if (!form.currentWeight || !form.targetWeight || !form.age || !form.height) {
      setError("Please fill in weight, target weight, age, and height.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await axios.post("http://localhost:5000/api/ai/plan", form, {
        timeout: 5 * 60 * 1000,
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.details || "Plan generation failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-app max-w-3xl py-10 sm:py-14">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full mb-4">
          <Sparkles className="w-3.5 h-3.5" /> AI Nutrition Planner
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-stone-900">
          Your personalized nutrition assistant
        </h1>
        <p className="text-stone-500 mt-3 max-w-xl mx-auto">
          Enter your stats and goals to get a tailored meal plan, fitness routine, and product
          picks from our store.
        </p>
      </div>

      <Card padding="p-6 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Current weight (kg)"
            name="currentWeight"
            type="number"
            placeholder="e.g. 75"
            value={form.currentWeight}
            onChange={handleChange}
            required
          />
          <Input
            label="Target weight (kg)"
            name="targetWeight"
            type="number"
            placeholder="e.g. 68"
            value={form.targetWeight}
            onChange={handleChange}
            required
          />
          <Input
            label="Age"
            name="age"
            type="number"
            placeholder="e.g. 25"
            value={form.age}
            onChange={handleChange}
            required
          />
          <Input
            label="Height (cm)"
            name="height"
            type="number"
            placeholder="e.g. 175"
            value={form.height}
            onChange={handleChange}
            required
          />

          <Select label="Goal" name="goal" value={form.goal} onChange={handleChange}>
            <option value="lose">Lose weight</option>
            <option value="gain">Gain weight / muscle</option>
            <option value="maintain">Maintain weight</option>
          </Select>

          <Input
            label="Gym days per week"
            name="gymDays"
            type="number"
            min="0"
            max="7"
            value={form.gymDays}
            onChange={handleChange}
          />

          <Input
            label="Weekly budget (€)"
            name="weeklyBudget"
            type="number"
            min="10"
            value={form.weeklyBudget}
            onChange={handleChange}
          />

          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="vegetarian"
                checked={form.vegetarian}
                onChange={handleChange}
                className="w-4 h-4 rounded border-stone-300 text-emerald-700 focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-stone-700">Vegetarian diet</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <Button
          size="lg"
          fullWidth
          className="mt-6"
          icon={Sparkles}
          onClick={generatePlan}
          loading={loading}
        >
          {loading ? "Generating your plan..." : "Generate My Plan"}
        </Button>
      </Card>

      {loading && (
        <div className="mt-8 space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {!loading && result && (
        <div className="mt-8 space-y-6 animate-fadeIn">
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
      )}
    </div>
  );
}
