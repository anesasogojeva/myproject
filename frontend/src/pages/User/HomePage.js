import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Salad,
  MessageCircle,
  ClipboardList,
  ShieldCheck,
  Star,
  ArrowRight,
  Leaf,
  Users,
  Award,
} from "lucide-react";
import SectionHeading from "../../components/UI/SectionHeading";
import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import { ProductCardSkeleton } from "../../components/UI/Skeleton";
import ProductCard from "../../components/UI/ProductCard";
import { API_URL } from "../../config";

const services = [
  {
    icon: Sparkles,
    title: "AI Nutrition Planner",
    text: "Get a personalized meal and fitness plan generated from your goals, weight, and lifestyle in minutes.",
    to: "/ai-planner",
  },
  {
    icon: MessageCircle,
    title: "Dietitian Guidance",
    text: "Chat directly with a certified dietitian for ongoing, professional support tailored to you.",
    to: "/chat",
  },
  {
    icon: Salad,
    title: "Healthy Food Marketplace",
    text: "Shop carefully curated healthy snacks, supplements and wellness products delivered to your door.",
    to: "/products",
  },
  {
    icon: ClipboardList,
    title: "Progress & Nutrition Notes",
    text: "Your dietitian keeps track of your journey with notes and recommendations, all in one place.",
    to: "/register",
  },
];

const stats = [
  { icon: Users, value: "2,500+", label: "People guided" },
  { icon: Award, value: "98%", label: "Client satisfaction" },
  { icon: ShieldCheck, value: "100%", label: "Certified dietitians" },
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "Member since 2023",
    text: "My dietitian created a plan that actually fits my life. I feel more energetic and in control of my health.",
  },
  {
    name: "James K.",
    role: "Member since 2022",
    text: "The AI planner gave me a realistic starting point, and the follow-up guidance made all the difference.",
  },
  {
    name: "Emily R.",
    role: "Member since 2024",
    text: "Ordering healthy groceries and getting expert advice in the same place saves me so much time.",
  },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  return (
    <div className="w-full bg-cream-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 to-cream-50">
        <div className="container-app py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-white text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-100 shadow-soft mb-6">
              <Leaf className="w-3.5 h-3.5" /> Personalized Nutrition Care
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-stone-900 leading-[1.1]">
              Eat well. Feel better. <span className="text-emerald-700">Live healthier.</span>
            </h1>
            <p className="mt-6 text-lg text-stone-600 max-w-xl leading-relaxed">
              FitLife connects you with certified dietitians, an intelligent nutrition
              planner, and a curated healthy-food marketplace — everything you need to
              build lasting, sustainable habits.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button to="/ai-planner" size="lg" icon={Sparkles}>
                Build My Nutrition Plan
              </Button>
              <Button to="/products" size="lg" variant="outline" iconRight={ArrowRight}>
                Explore Healthy Foods
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-display font-bold text-stone-900">{s.value}</p>
                  <p className="text-xs text-stone-500 mt-1 leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-6 bg-emerald-100/60 rounded-[2.5rem] -z-10 hidden sm:block" />
            <img
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80"
              alt="Fresh, healthy nutrition"
              className="w-full h-[320px] sm:h-[420px] object-cover rounded-3xl shadow-elevated"
            />
            <div className="absolute -bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-64 bg-white rounded-2xl shadow-elevated p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-800">Certified Guidance</p>
                <p className="text-xs text-stone-500">Backed by real dietitians</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-app py-20 sm:py-24">
        <SectionHeading
          eyebrow="What we offer"
          title="Nutrition support, built around you"
          subtitle="Whether you want expert guidance, a data-driven plan, or simply healthier groceries — FitLife brings it together."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <Card key={s.title} hoverable className="flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5">
                <s.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-lg text-stone-900 mb-2">{s.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed flex-1">{s.text}</p>
              <Link
                to={s.to}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 mt-5 hover:gap-2.5 transition-all"
              >
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* HEALTHY LIFESTYLE */}
      <section className="bg-emerald-50/60 py-20 sm:py-24">
        <div className="container-app grid lg:grid-cols-2 gap-12 items-center">
          <img
            src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=1200"
            alt="Healthy lifestyle"
            className="w-full h-[280px] sm:h-[380px] object-cover rounded-3xl shadow-card order-2 lg:order-1"
          />
          <div className="order-1 lg:order-2">
            <SectionHeading
              align="left"
              eyebrow="Our approach"
              title="Healthy living, made sustainable"
              subtitle="We believe lasting results come from realistic habits, not restrictive rules."
              className="mb-8"
            />
            <ul className="space-y-4">
              {[
                "Plans built around your routine, budget and preferences",
                "Ongoing check-ins with a real, certified dietitian",
                "Whole, nutritious foods sourced from our trusted marketplace",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Leaf className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-stone-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container-app py-20 sm:py-24">
        <SectionHeading
          eyebrow="Nutrition shop"
          title="Featured healthy foods"
          subtitle="A hand-picked selection from our marketplace to help you get started."
        />

        {loadingProducts ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-stone-400">No products available right now.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button to="/products" variant="outline" iconRight={ArrowRight}>
            View All Products
          </Button>
        </div>
      </section>

      {/* DIETITIAN TRUST SECTION */}
      <section className="bg-stone-900 py-20 sm:py-24">
        <div className="container-app grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-semibold tracking-wider uppercase text-emerald-400 bg-emerald-900/40 px-3 py-1 rounded-full mb-4">
              Meet your care team
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight">
              Real dietitians. Real guidance. Real results.
            </h2>
            <p className="mt-4 text-stone-300 leading-relaxed max-w-lg">
              Every plan on FitLife is backed by certified nutrition professionals who
              review your progress, answer your questions, and adjust your plan as you go —
              not a chatbot pretending to care.
            </p>
            <Button to="/chat" variant="secondary" className="mt-8 bg-emerald-700 hover:bg-emerald-600">
              Message a Dietitian
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-stone-800 rounded-2xl p-5 text-center">
                <s.icon className="w-6 h-6 text-emerald-400 mx-auto mb-3" />
                <p className="text-xl font-display font-bold text-white">{s.value}</p>
                <p className="text-xs text-stone-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-app py-20 sm:py-24">
        <SectionHeading
          eyebrow="Testimonials"
          title="Trusted by people like you"
          subtitle="Real stories from members who changed their habits with FitLife."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name} className="flex flex-col">
              <div className="flex gap-1 text-amber-400 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-stone-600 leading-relaxed flex-1">"{t.text}"</p>
              <div className="mt-5 pt-4 border-t border-stone-100">
                <p className="font-semibold text-stone-900 text-sm">{t.name}</p>
                <p className="text-xs text-stone-400">{t.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-app pb-20 sm:pb-24">
        <div className="bg-emerald-700 rounded-3xl px-8 py-14 sm:px-16 sm:py-16 text-center relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white max-w-2xl mx-auto leading-tight">
            Start your nutrition journey today
          </h2>
          <p className="mt-4 text-emerald-50 max-w-xl mx-auto">
            Create a free account to get a personalized plan and connect with a dietitian.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button to="/register" size="lg" variant="secondary" className="bg-white text-emerald-800 hover:bg-emerald-50">
              Create Free Account
            </Button>
            <Button to="/ai-planner" size="lg" variant="outline" className="border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white">
              Try the AI Planner
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
