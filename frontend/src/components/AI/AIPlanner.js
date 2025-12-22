import React, { useState } from "react";
import axios from "axios";

export default function AIPlanner() {
  const [form, setForm] = useState({
    weight: "",
    goal: "lose",
    gymDays: 3,
    vegetarian: false,
    budget: 30
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const generatePlan = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
  "http://localhost:5000/api/ai/plan",
  form,
  { timeout: 5 * 60 * 1000 } // 5 minutes
);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("AI generation failed. Make sure backend & Ollama server are running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-50 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">AI Nutrition Planner</h1>

      <input
        name="weight"
        placeholder="Weight (kg)"
        className="border p-2 w-full mb-3 rounded"
        onChange={handleChange}
      />

      <select
        name="goal"
        className="border p-2 w-full mb-3 rounded"
        onChange={handleChange}
      >
        <option value="lose">Lose Weight</option>
        <option value="gain">Gain Muscle</option>
        <option value="maintain">Maintain</option>
      </select>

      <input
        name="gymDays"
        type="number"
        placeholder="Gym days per week"
        className="border p-2 w-full mb-3 rounded"
        onChange={handleChange}
      />

      <label className="flex items-center mb-3 gap-2">
        <input type="checkbox" name="vegetarian" onChange={handleChange} />
        Vegetarian?
      </label>

      <input
        name="budget"
        type="number"
        placeholder="Budget (€)"
        className="border p-2 w-full mb-3 rounded"
        onChange={handleChange}
      />

      <button
        className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 transition"
        onClick={generatePlan}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate AI Plan"}
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded bg-white shadow">
          <h2 className="text-xl font-bold mb-2">Meal Plan</h2>
          {result.mealPlan.map((meal, i) => (
            <div key={i} className="mb-2">
              <strong>{meal.meal}</strong> ({meal.calories} cal)
              <ul className="list-disc ml-5">
                {meal.recipes.map((r, j) => <li key={j}>{r}</li>)}
              </ul>
            </div>
          ))}

          <h2 className="text-xl font-bold mt-4 mb-2">Fitness Plan</h2>
          {result.fitnessPlan.map((f, i) => (
            <div key={i}>
              <strong>{f.day}:</strong> {f.exercise}
            </div>
          ))}

          <h2 className="text-xl font-bold mt-4 mb-2">Recommended Products</h2>
          <div className="grid grid-cols-2 gap-4">
            {result.recommendedProducts.map((p) => (
              <div key={p.id} className="border p-2 rounded">
                {p.image && <img src={p.image} alt={p.name} className="w-full h-24 object-cover mb-2" />}
                <div className="font-bold">{p.name}</div>
                <div>€{p.price}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
