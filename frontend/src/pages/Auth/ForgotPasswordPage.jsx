import React, { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const sendReset = async () => {
    const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMsg(data.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

        {msg && <p className="text-center text-sm text-green-600 mb-4">{msg}</p>}

        <input
          className="w-full px-4 py-2 border rounded-lg mb-4"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={sendReset}
          className="w-full py-2 bg-black text-white rounded-lg"
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
}
