import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const resetPass = async () => {
    const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    setMsg(data.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Set New Password</h2>

        {msg && <p className="text-center text-sm mb-4">{msg}</p>}

        <input
          type="password"
          placeholder="New Password"
          className="w-full px-4 py-2 border rounded-lg mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={resetPass}
          className="w-full py-2 bg-black text-white rounded-lg"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
