// ============================================================
// userRecommendationFlow.js  (REFERENCE — jo në projekt)
// Përditëson profilin e përdoruesit në DB dhe rigjeneron
// rekomandimet kur ndryshon pesha, lartësia ose objektivi.
// ============================================================

const { DataTypes } = require("sequelize");
const sequelize = require("./config/mysql"); // rregullo path sipas projektit
const Product = require("./models/mysql/Product");
const { generatePlan } = require("./services/aiService"); // shërbimi ekzistues

// ------------------------------------------------------------
// MODEL — profili shëndetësor i përdoruesit (tabelë e re)
// ------------------------------------------------------------
const UserHealthProfile = sequelize.define(
  "UserHealthProfile",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, 
    },
    weight: { type: DataTypes.FLOAT, allowNull: false },      // kg
    height: { type: DataTypes.FLOAT, allowNull: false },      // cm
    gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: false,
      defaultValue: "female",
    },
    goal: {
      type: DataTypes.ENUM("lose_weight", "gain_weight", "gain_muscle"),
      allowNull: false,
      defaultValue: "lose_weight",
    },
    weeklyBudget: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 50 },
    lastBmi: { type: DataTypes.FLOAT, allowNull: true },
    lastDailyCalories: { type: DataTypes.INTEGER, allowNull: true },
    lastPlanGeneratedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { timestamps: true, tableName: "user_health_profiles" }
);

// ------------------------------------------------------------
// VALIDIM
// ------------------------------------------------------------
const VALID_GOALS = ["lose_weight", "gain_weight", "gain_muscle"];
const VALID_GENDERS = ["male", "female"];

function validateProfileInput({ weight, height, budget, goal, gender }) {
  const weightNum = parseFloat(weight);
  const heightNum = parseFloat(height);
  const budgetNum = parseFloat(budget);

  if (isNaN(weightNum) || weightNum < 30 || weightNum > 300) {
    throw new Error("Pesha duhet të jetë midis 30–300 kg.");
  }
  if (isNaN(heightNum) || heightNum < 120 || heightNum > 250) {
    throw new Error("Lartësia duhet të jetë midis 120–250 cm.");
  }
  if (isNaN(budgetNum) || budgetNum < 5) {
    throw new Error("Buxheti javor duhet të jetë të paktën €5.");
  }
  if (!VALID_GOALS.includes(goal)) {
    throw new Error("Objektivi dietik nuk është i vlefshëm.");
  }
  if (!VALID_GENDERS.includes(gender)) {
    throw new Error("Gjinia duhet të jetë male ose female.");
  }

  return {
    weight: weightNum,
    height: heightNum,
    budget: budgetNum,
    goal,
    gender,
  };
}

// ------------------------------------------------------------
// NËNTË LOGJIKA — update DB + rigjenero rekomandime
// ------------------------------------------------------------
async function updateProfileAndRegeneratePlan(userId, input) {
  const data = validateProfileInput(input);

  // 1) Lexo profilin ekzistues (nëse ka)
  let profile = await UserHealthProfile.findOne({ where: { userId } });

  const previous = profile
    ? {
        weight: profile.weight,
        height: profile.height,
        goal: profile.goal,
        gender: profile.gender,
        weeklyBudget: profile.weeklyBudget,
      }
    : null;

  // 2) Ruaj / përditëso në databazë
  if (profile) {
    await profile.update({
      weight: data.weight,
      height: data.height,
      gender: data.gender,
      goal: data.goal,
      weeklyBudget: data.budget,
    });
  } else {
    profile = await UserHealthProfile.create({
      userId,
      weight: data.weight,
      height: data.height,
      gender: data.gender,
      goal: data.goal,
      weeklyBudget: data.budget,
    });
  }

  // 3) Kontrollo nëse ndryshoi diçka e rëndësishme
  const hasMeaningfulChange =
    !previous ||
    previous.weight !== data.weight ||
    previous.height !== data.height ||
    previous.goal !== data.goal ||
    previous.gender !== data.gender ||
    previous.weeklyBudget !== data.budget;

  if (!hasMeaningfulChange) {
    // Asgjë nuk ndryshoi — kthe planin ekzistues pa rifilluar analizën
    const cachedPlan = await getLatestPlanFromDb(userId);
    return {
      updated: false,
      message: "Profili nuk ndryshoi — rekomandimet mbeten të njëjta.",
      profile,
      plan: cachedPlan,
    };
  }

  // 4) Rifillo procesin e analizës me të dhënat e reja nga DB
  const products = await Product.findAll({
    attributes: ["id", "name", "category", "price", "description", "image"],
    order: [["price", "ASC"]],
  });

  const plan = await generatePlan(
    {
      weight: profile.weight,
      height: profile.height,
      budget: profile.weeklyBudget,
      goal: profile.goal,
      gender: profile.gender,
    },
    products
  );

  // 5) Ruaj snapshot të analizës së fundit në profil
  await profile.update({
    lastBmi: plan.summary.bmi,
    lastDailyCalories: plan.summary.dailyCalories,
    lastPlanGeneratedAt: new Date(),
  });

  // 6) (Opsional) ruaj historikun e planeve në DB
  await savePlanHistory(userId, plan, previous);

  return {
    updated: true,
    message: buildChangeMessage(previous, data),
    profile,
    plan,
  };
}

function buildChangeMessage(previous, current) {
  if (!previous) return "Profili u krijua dhe rekomandimet u gjeneruan.";

  const changes = [];
  if (previous.weight !== current.weight) {
    changes.push(`pesha: ${previous.weight} kg → ${current.weight} kg`);
  }
  if (previous.height !== current.height) {
    changes.push(`lartësia: ${previous.height} cm → ${current.height} cm`);
  }
  if (previous.goal !== current.goal) {
    changes.push(`objektivi: ${previous.goal} → ${current.goal}`);
  }
  if (previous.gender !== current.gender) {
    changes.push(`gjinia: ${previous.gender} → ${current.gender}`);
  }
  if (previous.weeklyBudget !== current.budget) {
    changes.push(`buxheti: €${previous.weeklyBudget} → €${current.budget}`);
  }

  return `Profili u përditësua (${changes.join(", ")}). Rekomandimet u rigjeneruan.`;
}

// ------------------------------------------------------------
// HISTORIK i planeve (opsional)
// ------------------------------------------------------------
const UserPlanHistory = sequelize.define(
  "UserPlanHistory",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    planJson: { type: DataTypes.JSON, allowNull: false },
    triggerReason: { type: DataTypes.STRING, allowNull: true },
  },
  { timestamps: true, tableName: "user_plan_history" }
);

async function savePlanHistory(userId, plan, previous) {
  const triggerReason = previous
    ? `update: weight=${previous.weight}→${plan.summary.weight}, goal=${previous.goal}→${plan.summary.goal}`
    : "initial_create";

  await UserPlanHistory.create({
    userId,
    planJson: plan,
    triggerReason,
  });
}

async function getLatestPlanFromDb(userId) {
  const latest = await UserPlanHistory.findOne({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });
  return latest ? latest.planJson : null;
}

// ------------------------------------------------------------
// CONTROLLER + ROUTE (në të njëjtin skedar, për thjeshtësi)
// ------------------------------------------------------------
const express = require("express");
const auth = require("./middleware/authMiddleware"); // middleware ekzistues

const router = express.Router();

// GET — profili aktual + rekomandimet e fundit
router.get("/profile/recommendations", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await UserHealthProfile.findOne({ where: { userId } });
    const plan = await getLatestPlanFromDb(userId);

    if (!profile) {
      return res.status(404).json({ message: "Profili shëndetësor nuk ekziston ende." });
    }

    res.json({ profile, plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT — përditëso profilin dhe rigjenero rekomandimet
router.put("/profile/recommendations", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { weight, height, budget, goal, gender } = req.body;

    const result = await updateProfileAndRegeneratePlan(userId, {
      weight,
      height,
      budget,
      goal,
      gender,
    });

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST — rifillo manualisht analizën (pa ndryshuar profilin)
router.post("/profile/recommendations/regenerate", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await UserHealthProfile.findOne({ where: { userId } });
    if (!profile) {
      return res.status(404).json({ message: "Krijo profilin fillimisht." });
    }

    const result = await updateProfileAndRegeneratePlan(userId, {
      weight: profile.weight,
      height: profile.height,
      budget: profile.weeklyBudget,
      goal: profile.goal,
      gender: profile.gender,
    });

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = {
  UserHealthProfile,
  UserPlanHistory,
  updateProfileAndRegeneratePlan,
  router, // app.use("/api/user-health", router)
};