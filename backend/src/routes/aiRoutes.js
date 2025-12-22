const express = require("express");
const router = express.Router();
const Product = require("../models/mysql/Product");
const OpenAI = require("openai");

// Connect to local Ollama server
const client = new OpenAI({
  baseURL: "http://localhost:11434/v1",
  apiKey: "ollama"
});

router.post("/plan", async (req, res) => {
  try {
    const { weight, goal, gymDays, vegetarian, budget } = req.body;

    // Only get essential info
    let products = await Product.findAll({
      attributes: ["id", "name", "price"],
      order: [["price", "ASC"]],
      limit: 15 // reduce to 15 items max
    });

    // Filter by budget
    const affordableProducts = products.filter(p => p.price <= budget);

    // Build shorter AI prompt
    const prompt = `
You are a nutrition and fitness assistant.

User info:
- Weight: ${weight} kg
- Goal: ${goal}
- Gym days/week: ${gymDays}
- Vegetarian: ${vegetarian ? "yes" : "no"}
- Budget: €${budget}

Available products (name + price):
${affordableProducts.map(p => `${p.name}: €${p.price}`).join("\n")}

Return ONLY JSON:
{
  "mealPlan": [{"meal": "Breakfast/Lunch/Dinner","recipes":["recipe1"],"calories":500}],
  "fitnessPlan": [{"day":"Monday","exercise":"Push-ups 3x10"}],
  "recommendedProducts":[{"id":1,"name":"Protein Bar","price":5}]
}
`;

    const response = await client.chat.completions.create({
      model: "mistral",
      messages: [{ role: "user", content: prompt }]
    });

    const json = JSON.parse(response.choices[0].message.content);
    res.json(json);

  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ error: "AI generation failed", details: err.message });
  }
});

module.exports = router;
