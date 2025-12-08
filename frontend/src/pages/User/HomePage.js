import React from "react";
import { motion } from "framer-motion";

export default function HomePage() {
  const categories = [
    { title: "Healthy Snacks", emoji: "🍓", color: "bg-pink-100" },
    { title: "Protein & Boosters", emoji: "💪", color: "bg-yellow-100" },
    { title: "Vitamins", emoji: "🌿", color: "bg-green-100" },
    { title: "Fitness Gear", emoji: "🎧", color: "bg-purple-100" },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50 overflow-x-hidden relative">
      {/* Glowing blobs */}
      <div className="absolute w-[600px] h-[600px] bg-yellow-200/40 blur-[180px] -top-40 -left-20"></div>
      <div className="absolute w-[500px] h-[500px] bg-pink-200/40 blur-[180px] bottom-0 right-0"></div>
      <div className="absolute w-[450px] h-[450px] bg-green-200/40 blur-[160px] top-40 right-1/3"></div>

      {/* HERO */}
      <section className="pt-40 pb-20 flex items-center justify-between px-14 relative z-20">
        {/* Left */}
        <div className="max-w-[550px]">
          <motion.h1
            className="text-6xl font-extrabold text-gray-800 leading-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Healthy Looks <span className="text-pink-500">Good On You.</span>
          </motion.h1>

          <motion.p
            className="mt-6 text-xl text-gray-600"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            Discover healthy snacks, wellness boosters, protein blends and cute lifestyle
            accessories for your fitness glow.
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            className="mt-10 px-10 py-4 text-lg bg-pink-500 text-white rounded-2xl shadow-xl hover:bg-pink-400 transition"
          >
            Shop Now
          </motion.button>
        </div>

        {/* Right */}
        <motion.img
          src="https://static.vecteezy.com/system/resources/previews/015/693/456/original/woman-leading-a-healthy-lifestyle-free-png.png"
          className="w-[520px] drop-shadow-[0_20px_50px_rgba(255,150,190,0.4)]"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </section>

      {/* CATEGORIES */}
      <section className="mt-10 px-14 relative z-20">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">
          Explore Categories ✨
        </h2>

        <div className="grid grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className={`rounded-3xl p-8 text-center shadow-md hover:shadow-xl cursor-pointer transition ${cat.color}`}
            >
              <div className="text-5xl mb-4">{cat.emoji}</div>
              <h3 className="text-xl font-bold text-gray-700">{cat.title}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mt-24 px-14 pb-24 relative z-20">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">
          Best Sellers 💖
        </h2>

        <div className="grid grid-cols-3 gap-10">
          {[1, 2, 3].map((p) => (
            <motion.div
              key={p}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition border border-pink-100"
            >
              <img
                src="https://cdn.pixabay.com/photo/2017/07/28/14/28/nutrition-2545879_1280.jpg"
                className="rounded-2xl mb-4 h-56 w-full object-cover"
              />

              <h3 className="text-xl font-bold text-gray-700">Protein Snack Bar</h3>
              <p className="text-gray-500 mt-1">Healthy • Vegan • 12g Protein</p>

              <button className="mt-4 w-full bg-pink-500 text-white py-3 rounded-xl hover:bg-pink-400 transition shadow-md">
                Add to Cart
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
