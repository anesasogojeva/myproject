import React, { useState } from "react";
import axios from "axios";
import { Sparkles, AlertCircle, Bookmark, BookmarkCheck } from "lucide-react";
import Card from "../UI/Card";
import Button from "../UI/Button";
import { Input, Select } from "../UI/FormField";
import { CardSkeleton } from "../UI/Skeleton";
import PlanResult from "./PlanResult";
import useAuth from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";
import { API_URL } from "../../config";

export default function AIPlanner() {
  const { token } = useAuth();
  const toast = useToast();
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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
      const res = await axios.post(`${API_URL}/api/ai/plan`, form, {
        timeout: 5 * 60 * 1000,
      });
      setResult(res.data);
      setSaved(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.details || "Plan generation failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const savePlan = async () => {
    if (!token) {
      toast.error("Please log in to save your plan.");
      return;
    }
    try {
      setSaving(true);
      const goalLabel = { lose: "Lose weight", gain: "Gain weight", maintain: "Maintain weight" }[form.goal] || "Plan";
      await axios.post(
        `${API_URL}/api/saved-plans`,
        { title: `${goalLabel} - ${new Date().toLocaleDateString()}`, planData: result },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaved(true);
      toast.success("Plan saved to your dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save plan.");
    } finally {
      setSaving(false);
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
          <div className="flex justify-end">
            <Button
              variant="outline"
              icon={saved ? BookmarkCheck : Bookmark}
              onClick={savePlan}
              loading={saving}
              disabled={saved}
            >
              {saved ? "Saved to dashboard" : "Save this plan"}
            </Button>
          </div>

          <PlanResult result={result} />
        </div>
      )}
    </div>
  );
}
