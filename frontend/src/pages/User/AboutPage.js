import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Users, Star, Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import SectionHeading from "../../components/UI/SectionHeading";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import { Input, Textarea } from "../../components/UI/FormField";
import { API_URL } from "../../config";

const values = [
  {
    icon: ShieldCheck,
    title: "High-Quality Products",
    text: "Every product on our shelves is carefully vetted for quality, safety and nutritional value.",
  },
  {
    icon: Sparkles,
    title: "Personalized Guidance",
    text: "Our AI planner and dietitians work together to match products and plans to your goals.",
  },
  {
    icon: Users,
    title: "Trusted by Our Community",
    text: "Thousands of members rely on FitLife for their day-to-day nutrition and wellness needs.",
  },
];

const testimonials = [
  { name: "Sarah M.", text: "FitLife products have completely changed my daily nutrition. I feel more energetic and healthier!" },
  { name: "James K.", text: "The AI recommendations are amazing. I got the right products and a meal plan tailored for me." },
  { name: "Emily R.", text: "Great customer support and high-quality supplements. I love shopping here!" },
];

export default function AboutPage() {
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setForm({ name: "", email: "", message: "" });
      } else {
        toast.error(data.error || "Failed to send message.");
      }
    } catch (err) {
      toast.error("Something went wrong while sending your message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full bg-cream-50">
      {/* INTRO */}
      <section className="bg-emerald-50/60 py-20 sm:py-24">
        <motion.div
          className="container-app max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-semibold tracking-wider uppercase text-emerald-700 bg-white px-3 py-1 rounded-full mb-5 shadow-soft">
            About FitLife
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-stone-900 leading-tight">
            Nutrition guidance you can trust
          </h1>
          <p className="mt-6 text-lg text-stone-600 leading-relaxed">
            FitLife is a nutrition and wellness platform combining certified dietitian
            support, an intelligent planning assistant, and a curated healthy-food
            marketplace — helping you build habits that actually last.
          </p>
        </motion.div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="container-app py-20 sm:py-24">
        <SectionHeading
          eyebrow="Why FitLife"
          title="What sets us apart"
          subtitle="We combine human expertise with smart technology to support your health goals."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((v) => (
            <Card key={v.title} hoverable className="text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-5">
                <v.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-lg text-stone-900 mb-2">{v.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{v.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-emerald-50/60 py-20 sm:py-24">
        <div className="container-app">
          <SectionHeading
            eyebrow="Testimonials"
            title="What our customers say"
            subtitle="Real feedback from members of the FitLife community."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-stone-600 italic leading-relaxed">"{t.text}"</p>
                <h4 className="font-semibold text-stone-900 mt-4">{t.name}</h4>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="container-app py-20 sm:py-24">
        <SectionHeading eyebrow="Contact" title="Get in touch" subtitle="Have a question? We'd love to hear from you." />

        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <div className="flex flex-col justify-center gap-5">
            <Card className="flex items-center gap-4" padding="p-5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-stone-400">Email</p>
                <p className="font-semibold text-stone-800">support@fitlife.com</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4" padding="p-5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-stone-400">Phone</p>
                <p className="font-semibold text-stone-800">+1 (555) 123-4567</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4" padding="p-5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-stone-400">Address</p>
                <p className="font-semibold text-stone-800">123 Fitness Street, Healthy City</p>
              </div>
            </Card>
          </div>

          <Card>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <Input
                name="name"
                label="Your Name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
              />
              <Input
                name="email"
                type="email"
                label="Your Email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
              <Textarea
                name="message"
                label="Message"
                value={form.message}
                onChange={handleChange}
                placeholder="How can we help?"
                rows={4}
                required
              />
              <Button type="submit" fullWidth size="lg" loading={sending}>
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
}
