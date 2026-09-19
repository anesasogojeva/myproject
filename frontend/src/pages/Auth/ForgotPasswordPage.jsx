import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Send } from "lucide-react";
import AuthLayout from "../../components/Layout/AuthLayout";
import { Input } from "../../components/UI/FormField";
import Button from "../../components/UI/Button";
import { API_URL } from "../../config";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const sendReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMsg(data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset your password" subtitle="We'll email you a link to reset it">
      <form onSubmit={sendReset} className="space-y-4">
        {msg && (
          <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
            {msg}
          </div>
        )}

        <Input
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          type="email"
          required
        />

        <Button type="submit" fullWidth size="lg" icon={Send} loading={loading}>
          Send Reset Link
        </Button>

        <p className="text-center text-sm text-stone-500">
          Remembered your password?{" "}
          <Link to="/login" className="text-emerald-700 font-semibold hover:text-emerald-800">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
