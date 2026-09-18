import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import AuthLayout from "../../components/Layout/AuthLayout";
import { Input } from "../../components/UI/FormField";
import Button from "../../components/UI/Button";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || data.error || "Registration failed");
        return;
      }

      setMessage("Registered successfully! You can now login.");
    } catch (err) {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = message.includes("successfully");

  return (
    <AuthLayout title="Create your account" subtitle="Start your personalized nutrition journey today">
      <form onSubmit={registerUser} className="space-y-4">
        {message && (
          <div
            className={`text-sm rounded-xl px-4 py-2.5 border ${
              isSuccess
                ? "text-emerald-700 bg-emerald-50 border-emerald-100"
                : "text-rose-600 bg-rose-50 border-rose-100"
            }`}
          >
            {message}
          </div>
        )}

        <Input
          id="name"
          name="name"
          label="Full Name"
          value={form.name}
          onChange={handleChange}
          placeholder="Jane Doe"
          required
        />

        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />

        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />

        <Button type="submit" fullWidth size="lg" icon={UserPlus} loading={loading}>
          Create Account
        </Button>

        <p className="text-center text-sm text-stone-500">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-700 font-semibold hover:text-emerald-800">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
