import React, { useState } from "react";
import { motion } from "framer-motion";
export default function AboutPage() {
  const floatingIcons = [
    { emoji: "🍓", top: "5%", left: "5%", size: 35 },
    { emoji: "💪", top: "20%", left: "80%", size: 40 },
    { emoji: "🥦", top: "60%", left: "10%", size: 30 },
    { emoji: "🥑", top: "50%", left: "70%", size: 35 },
  ];

  const testimonials = [
    { name: "Sarah M.", text: "FitLife products have completely changed my daily nutrition. I feel more energetic and healthier!" },
    { name: "James K.", text: "The AI recommendations are amazing. I got the right products and a meal plan tailored for me." },
    { name: "Emily R.", text: "Great customer support and high-quality supplements. I love shopping here!" },
  ];

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("Message sent successfully! ✅");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus(data.error || "Failed to send message ❌");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error sending message ❌");
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-yellow-50 overflow-x-hidden py-20 px-6 md:px-20">
      
      {/* Floating Icons */}
      {floatingIcons.map((icon, index) => (
        <motion.div
          key={index}
          className="absolute text-2xl md:text-3xl"
          style={{ top: icon.top, left: icon.left, fontSize: icon.size }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
        >
          {icon.emoji}
        </motion.div>
      ))}

      {/* ABOUT SECTION */}
      <section className="max-w-5xl mx-auto text-center mb-20 relative z-10">
        <motion.h1
          className="text-5xl font-extrabold text-gray-800 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          About FitLife
        </motion.h1>
        <motion.p
          className="text-xl text-gray-700 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          FitLife is your go-to e-commerce platform for nutrition and healthy lifestyle products. 
          Discover supplements, protein blends, wellness boosters, and lifestyle accessories that help 
          you achieve your fitness goals and maintain a balanced, healthy lifestyle.
        </motion.p>

        <motion.p
          className="text-xl text-gray-700 mt-6 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
        >
          Our platform also includes expert guidance and AI-powered suggestions to help you pick 
          the best products, meal plans, and fitness routines tailored to your needs.
        </motion.p>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-6xl mx-auto mb-20 relative z-10">
        <motion.h2
          className="text-4xl font-bold text-gray-800 mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Why Choose FitLife?
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute top-2 left-2 text-xl animate-bounce opacity-50">💊</div>
            <h3 className="font-bold text-xl mb-2">High-Quality Products</h3>
            <p className="text-gray-700">All our supplements and products are carefully selected for quality and effectiveness.</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <div className="absolute top-2 right-2 text-xl animate-bounce opacity-50">💪</div>
            <h3 className="font-bold text-xl mb-2">Personalized Recommendations</h3>
            <p className="text-gray-700">Our AI helps you find products and routines that match your goals, lifestyle, and budget.</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4 }}
          >
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xl animate-bounce opacity-50">🌿</div>
            <h3 className="font-bold text-xl mb-2">Trusted by Customers</h3>
            <p className="text-gray-700">Thousands of satisfied customers rely on FitLife for their nutrition and wellness journey.</p>
          </motion.div>
        </div>
      </section>

      {/* CUSTOMER TESTIMONIALS */}
      <section className="max-w-6xl mx-auto mb-20 relative z-10">
        <motion.h2
          className="text-4xl font-bold text-gray-800 mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          What Our Customers Say
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition text-center relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 + i * 0.2 }}
            >
              <div className="absolute top-2 right-2 text-xl animate-bounce opacity-40">🌟</div>
              <p className="text-gray-700 italic">"{t.text}"</p>
              <h4 className="font-bold text-gray-800 mt-4">- {t.name}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-10 relative z-10">
        <motion.h2
          className="text-4xl font-bold text-gray-800 mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Contact Us
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <motion.div
            className="flex flex-col justify-center space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="bg-yellow-100 rounded-2xl p-6 shadow-md hover:shadow-lg transition">
              <h3 className="font-bold text-xl text-gray-800 mb-2">Email</h3>
              <p className="text-gray-700">support@fitlife.com</p>
            </div>
            <div className="bg-pink-100 rounded-2xl p-6 shadow-md hover:shadow-lg transition">
              <h3 className="font-bold text-xl text-gray-800 mb-2">Phone</h3>
              <p className="text-gray-700">+1 (555) 123-4567</p>
            </div>
            <div className="bg-green-100 rounded-2xl p-6 shadow-md hover:shadow-lg transition">
              <h3 className="font-bold text-xl text-gray-800 mb-2">Address</h3>
              <p className="text-gray-700">123 Fitness Street, Healthy City, USA</p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
              <textarea
                placeholder="Your Message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
              <button
                type="submit"
                className="mt-2 w-full bg-pink-500 text-white py-3 rounded-2xl shadow-lg hover:bg-pink-400 transition"
              >
                Send Message
              </button>
              {status && (
                <p
                  className={`mt-2 text-center font-medium ${
                    status.includes("success") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {status}
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
