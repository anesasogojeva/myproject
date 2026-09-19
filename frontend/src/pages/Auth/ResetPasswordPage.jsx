import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { KeyRound } from "lucide-react";
import AuthLayout from "../../components/Layout/AuthLayout";
import { Input } from "../../components/UI/FormField";
import Button from "../../components/UI/Button";
import { API_URL } from "../../config";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPass = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      setMsg(data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Set a new password" subtitle="Choose a strong password for your account">
      <form onSubmit={resetPass} className="space-y-4">
        {msg && (
          <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
            {msg}
          </div>
        )}

        <Input
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <Button type="submit" fullWidth size="lg" icon={KeyRound} loading={loading}>
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
}
