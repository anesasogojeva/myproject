import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import AuthLayout from "../../components/Layout/AuthLayout";
import { Input } from "../../components/UI/FormField";
import Button from "../../components/UI/Button";
import { API_URL } from "../../config";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authchange"));

      navigate("/");
    } catch (err) {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue your nutrition journey">
      <form onSubmit={loginUser} className="space-y-4">
        {message && (
          <div className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5">
            {message}
          </div>
        )}

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
          type="password"
          name="password"
          label="Password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />

        <div className="text-right -mt-2">
          <Link to="/forgot-password" className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth size="lg" icon={LogIn} loading={loading}>
          Log In
        </Button>

        <p className="text-center text-sm text-stone-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-emerald-700 font-semibold hover:text-emerald-800">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
