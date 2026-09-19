require("dotenv").config();
const sequelize = require("./src/config/mysql");
const Product = require("./src/models/mysql/Product");

const IMG = (file) => `http://localhost:3000/images/products/${file}`;

const fitnessProducts = [
  {
    name: "High Protein Bar – Chocolate",
    category: "Protein & Boosters",
    price: 3.99,
    description: "20g protein, low sugar, perfect post-workout snack.",
    image: IMG("protein-bar.png"),
  },
  {
    name: "Protein Peanut Butter",
    category: "Protein & Boosters",
    price: 8.49,
    description: "High-protein spread with 25g protein per 100g. Great on toast or oats.",
    image: IMG("peanut-butter.png"),
  },
  {
    name: "Whey Protein Isolate 1kg",
    category: "Protein & Boosters",
    price: 34.99,
    description: "Fast-absorbing whey isolate, 27g protein per scoop, ideal for muscle recovery.",
    image: IMG("whey-protein.png"),
  },
  {
    name: "Greek Yogurt Protein Cup",
    category: "Healthy Snacks",
    price: 2.49,
    description: "15g protein, probiotic-rich, low fat. Ready-to-eat snack.",
    image: IMG("greek-yogurt.png"),
  },
  {
    name: "Overnight Oats Energy Mix",
    category: "Healthy Snacks",
    price: 6.99,
    description: "Whole-grain oats with chia seeds and dried berries. High fiber, sustained energy.",
    image: IMG("overnight-oats.png"),
  },
  {
    name: "Creatine Monohydrate 300g",
    category: "Protein & Boosters",
    price: 12.99,
    description: "Pure creatine for strength and power output during resistance training.",
    image: IMG("creatine.png"),
  },
  {
    name: "BCAA Recovery Drink Powder",
    category: "Protein & Boosters",
    price: 18.99,
    description: "Branched-chain amino acids to reduce muscle soreness and support recovery.",
    image: IMG("bcaa.png"),
  },
  {
    name: "Multigrain Rice Cakes",
    category: "Healthy Snacks",
    price: 2.99,
    description: "Light, crunchy, low-calorie base for nut butter or lean toppings.",
    image: IMG("rice-cakes.png"),
  },
  {
    name: "Almond Butter Protein Spread",
    category: "Healthy Snacks",
    price: 7.49,
    description: "Healthy fats and 12g protein per serving. No added sugar.",
    image: IMG("almond-butter.png"),
  },
  {
    name: "Grilled Chicken Meal Prep Box",
    category: "Healthy Snacks",
    price: 9.99,
    description: "Lean protein meal with vegetables. 35g protein, ready in 3 minutes.",
    image: IMG("chicken-meal.png"),
  },
  {
    name: "Vegan Plant Protein Shake",
    category: "Protein & Boosters",
    price: 24.99,
    description: "Pea and rice protein blend, 22g protein, dairy-free and lactose-free.",
    image: IMG("vegan-shake.png"),
  },
  {
    name: "Energy Bites Variety Box",
    category: "Healthy Snacks",
    price: 5.49,
    description: "Dates, nuts, and cacao bites. Natural energy for pre-workout fuel.",
    image: IMG("energy-bites.png"),
  },
  {
    name: "Electrolyte Hydration Tablets",
    category: "Vitamins",
    price: 7.99,
    description: "Replenish sodium, potassium, and magnesium during intense training.",
    image: IMG("electrolytes.png"),
  },
  {
    name: "Tuna Pouches in Water",
    category: "Healthy Snacks",
    price: 3.49,
    description: "25g lean protein per pouch. Convenient, low-calorie protein source.",
    image: IMG("tuna.png"),
  },
  {
    name: "Quinoa & Veggie Salad Kit",
    category: "Healthy Snacks",
    price: 6.49,
    description: "Complete plant-based meal with quinoa, chickpeas, and fresh greens.",
    image: IMG("quinoa-salad.png"),
  },
  {
    name: "Vitamin D3 + K2 Capsules",
    category: "Vitamins",
    price: 11.99,
    description: "Supports bone health and immune function for active lifestyles.",
    image: IMG("vitamins.png"),
  },
  {
    name: "Resistance Bands Set",
    category: "Fitness Gear",
    price: 19.99,
    description: "5-band set for home workouts, stretching, and mobility training.",
    image: IMG("resistance-bands.png"),
  },
  {
    name: "Shaker Bottle 700ml",
    category: "Fitness Gear",
    price: 8.99,
    description: "BPA-free shaker for protein shakes and pre-workout drinks.",
    image: IMG("shaker-bottle.png"),
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const fresh = process.argv.includes("--fresh");
    if (fresh) {
      await Product.destroy({ where: {}, truncate: true });
      console.log("Cleared existing products.");
    }

    let created = 0;
    let updated = 0;

    for (const item of fitnessProducts) {
      const existing = await Product.findOne({ where: { name: item.name } });
      if (existing) {
        await existing.update(item);
        updated++;
      } else {
        await Product.create(item);
        created++;
      }
    }

    console.log(`Seed complete: ${created} created, ${updated} updated (${fitnessProducts.length} total in catalog).`);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
