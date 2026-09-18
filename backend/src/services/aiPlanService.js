const Product = require("../models/mysql/Product");

function parseAiJson(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object in AI response");
  return JSON.parse(cleaned.slice(start, end + 1));
}

function calcBmi(weightKg, heightCm) {
  const heightM = heightCm / 100;
  return +(weightKg / (heightM * heightM)).toFixed(1);
}

function calcDailyCalories({ currentWeight, targetWeight, goal, age, height, gymDays }) {
  const heightM = height / 100;
  const bmr = 10 * currentWeight + 6.25 * height - 5 * age + 5;
  const activityFactor = gymDays >= 5 ? 1.55 : gymDays >= 3 ? 1.375 : 1.2;
  let calories = Math.round(bmr * activityFactor);

  if (goal === "lose") calories -= 400;
  else if (goal === "gain") calories += 350;

  const diff = Math.abs(targetWeight - currentWeight);
  const weeklyChange =
    goal === "lose" ? `~${Math.min(0.75, diff * 0.05).toFixed(1)} kg/week` :
    goal === "gain" ? `~${Math.min(0.5, diff * 0.04).toFixed(1)} kg/week` :
    "maintain current weight";

  return { calories, bmr: Math.round(bmr), weeklyChange };
}

function pickProducts(products, goal, weeklyBudget) {
  const sorted = [...products].sort((a, b) => a.price - b.price);
  const perItemBudget = weeklyBudget / 4;

  const keywords =
    goal === "gain"
      ? ["protein", "whey", "creatine", "bcaa", "chicken", "peanut"]
      : goal === "lose"
      ? ["yogurt", "tuna", "quinoa", "rice", "salad", "electrolyte"]
      : ["protein", "oats", "energy", "vitamin"];

  const scored = sorted.map((p) => {
    const name = p.name.toLowerCase();
    const score = keywords.reduce((s, kw) => (name.includes(kw) ? s + 2 : s), 0);
    return { ...p.toJSON(), score };
  });

  scored.sort((a, b) => b.score - a.score || a.price - b.price);

  const picks = [];
  let spent = 0;
  for (const p of scored) {
    if (p.price <= perItemBudget && spent + p.price <= weeklyBudget && picks.length < 5) {
      picks.push(p);
      spent += p.price;
    }
  }

  if (picks.length === 0) {
    return sorted.slice(0, 3).map((p) => p.toJSON());
  }
  return picks;
}

function buildFallbackPlan(body, products) {
  const {
    currentWeight,
    targetWeight,
    goal,
    age,
    height,
    weeklyBudget,
    gymDays = 3,
    vegetarian = false,
  } = body;

  const bmi = calcBmi(currentWeight, height);
  const { calories, weeklyChange } = calcDailyCalories({
    currentWeight,
    targetWeight,
    goal,
    age,
    height,
    gymDays,
  });

  const proteinTarget = goal === "gain" ? Math.round(currentWeight * 2) : Math.round(currentWeight * 1.6);

  const mealPlan = [
    {
      meal: "Breakfast",
      calories: Math.round(calories * 0.25),
      recipes: vegetarian
        ? ["Overnight oats with almond butter and berries", "Greek yogurt with chia seeds"]
        : ["Scrambled eggs with whole-grain toast", "Protein shake with banana"],
    },
    {
      meal: "Lunch",
      calories: Math.round(calories * 0.35),
      recipes: vegetarian
        ? ["Quinoa salad with chickpeas and avocado", "Lentil soup with mixed vegetables"]
        : ["Grilled chicken with brown rice and greens", "Tuna wrap with salad"],
    },
    {
      meal: "Dinner",
      calories: Math.round(calories * 0.3),
      recipes: vegetarian
        ? ["Stir-fried tofu with vegetables and rice", "Bean chili with sweet potato"]
        : ["Baked salmon with roasted vegetables", "Lean beef stir-fry with quinoa"],
    },
    {
      meal: "Snacks",
      calories: Math.round(calories * 0.1),
      recipes: ["High protein bar", "Rice cakes with protein peanut butter", "Energy bites"],
    },
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const fitnessPlan = [];

  if (gymDays <= 2) {
    fitnessPlan.push(
      { day: "Monday", exercise: "Full-body: squats 3×12, push-ups 3×10, plank 3×45s" },
      { day: "Wednesday", exercise: "30 min brisk walk or cycling + stretching 10 min" },
      { day: "Friday", exercise: "Full-body: lunges 3×10/leg, rows 3×12, dead bug 3×12" }
    );
  } else if (gymDays <= 4) {
    fitnessPlan.push(
      { day: "Monday", exercise: "Upper body: bench press 4×8, rows 4×10, shoulder press 3×10" },
      { day: "Tuesday", exercise: "30 min cardio (zone 2) + core circuit 15 min" },
      { day: "Thursday", exercise: "Lower body: squats 4×8, RDL 3×10, calf raises 3×15" },
      { day: "Saturday", exercise: "Active recovery: yoga or light walk 40 min" }
    );
  } else {
    fitnessPlan.push(
      { day: "Monday", exercise: "Push: chest, shoulders, triceps – 4 exercises × 4 sets" },
      { day: "Tuesday", exercise: "Pull: back, biceps – 4 exercises × 4 sets" },
      { day: "Wednesday", exercise: "Legs: squats, lunges, hamstrings – 5 exercises × 4 sets" },
      { day: "Friday", exercise: "Upper hypertrophy + 20 min HIIT finisher" },
      { day: "Saturday", exercise: "Full-body circuit or sports activity 45 min" }
    );
  }

  const recommendedProducts = pickProducts(products, goal, weeklyBudget).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    category: p.category,
  }));

  return {
    summary: {
      bmi,
      dailyCalories: calories,
      proteinTargetG: proteinTarget,
      weeklyBudget,
      goal,
      currentWeight,
      targetWeight,
      weeklyChange,
    },
    mealPlan,
    fitnessPlan,
    recommendedProducts,
  };
}

async function generatePlan(body, aiClient) {
  const {
    currentWeight,
    targetWeight,
    goal,
    age,
    height,
    weeklyBudget,
    gymDays = 3,
    vegetarian = false,
  } = body;

  if (!currentWeight || !targetWeight || !goal || !age || !height || !weeklyBudget) {
    throw new Error("Missing required fields");
  }

  const products = await Product.findAll({
    attributes: ["id", "name", "price", "category", "description", "image"],
    order: [["price", "ASC"]],
  });

  const affordable = products.filter((p) => p.price <= weeklyBudget);
  const bmi = calcBmi(currentWeight, height);
  const { calories, weeklyChange } = calcDailyCalories({
    currentWeight,
    targetWeight,
    goal,
    age,
    height,
    gymDays,
  });

  const productList = (affordable.length ? affordable : products)
    .map((p) => `ID:${p.id} | ${p.name} | €${p.price} | ${p.category}`)
    .join("\n");

  const prompt = `You are a certified nutrition and fitness coach.

User profile:
- Age: ${age} years
- Height: ${height} cm
- Current weight: ${currentWeight} kg
- Target weight: ${targetWeight} kg
- Goal: ${goal === "lose" ? "lose weight" : goal === "gain" ? "gain muscle/weight" : "maintain"}
- BMI: ${bmi}
- Recommended daily calories: ~${calories} kcal
- Gym days per week: ${gymDays}
- Vegetarian: ${vegetarian ? "yes" : "no"}
- Weekly supplement/food budget: €${weeklyBudget}

Store products (pick 3-5 that match the user's goal and budget):
${productList}

Return ONLY valid JSON with this exact structure:
{
  "summary": {
    "bmi": ${bmi},
    "dailyCalories": ${calories},
    "proteinTargetG": number,
    "weeklyBudget": ${weeklyBudget},
    "goal": "${goal}",
    "currentWeight": ${currentWeight},
    "targetWeight": ${targetWeight},
    "weeklyChange": "${weeklyChange}"
  },
  "mealPlan": [{"meal":"Breakfast","calories":500,"recipes":["item1","item2"]}],
  "fitnessPlan": [{"day":"Monday","exercise":"details"}],
  "recommendedProducts": [{"id":1,"name":"Product Name","price":9.99}]
}

Use only product IDs from the store list for recommendedProducts.`;

  try {
    const response = await aiClient.chat.completions.create({
      model: "mistral",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const parsed = parseAiJson(response.choices[0].message.content);

    parsed.recommendedProducts = (parsed.recommendedProducts || []).map((rec) => {
      const dbProduct = products.find((p) => p.id === rec.id);
      return dbProduct
        ? { id: dbProduct.id, name: dbProduct.name, price: dbProduct.price, image: dbProduct.image, category: dbProduct.category }
        : rec;
    });

    return parsed;
  } catch (err) {
    console.warn("AI unavailable, using rule-based plan:", err.message);
    return buildFallbackPlan(body, products);
  }
}

module.exports = { generatePlan, buildFallbackPlan };
