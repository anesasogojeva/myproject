const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const { generatePlan } = require("../services/aiPlanService");

const client = new OpenAI({
  baseURL: "http://localhost:11434/v1",
  apiKey: "ollama",
});

router.post("/plan", async (req, res) => {
  try {
    const plan = await generatePlan(req.body, client);
    res.json(plan);
  } catch (err) {
    console.error("AI Error:", err);
    res.status(err.message.includes("Missing") ? 400 : 500).json({
      error: "Plan generation failed",
      details: err.message,
    });
  }
});

module.exports = router;
