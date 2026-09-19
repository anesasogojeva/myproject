import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, MessageSquare, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../../components/UI/StatCard";
import Card from "../../components/UI/Card";
import { CardSkeleton } from "../../components/UI/Skeleton";
import { API_URL } from "../../config";

export default function DietitianOverview() {
  const [clientCount, setClientCount] = useState(null);
  const [inboxCount, setInboxCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");
  const dietitian = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    Promise.all([
      axios
        .get(`${API_URL}/api/users`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.data.filter((u) => u.role?.toLowerCase() === "user").length)
        .catch(() => 0),
      axios
        .get(`${API_URL}/api/chat/inbox`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.data.length)
        .catch(() => 0),
    ]).then(([clients, inbox]) => {
      setClientCount(clients);
      setInboxCount(inbox);
      setLoading(false);
    });
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900">
        Welcome back{dietitian?.name ? `, ${dietitian.name}` : ""}
      </h1>
      <p className="text-stone-500 mt-1.5 mb-8">Here's a quick look at your clients and conversations.</p>

      {loading ? (
        <div className="grid sm:grid-cols-3 gap-5">
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-5">
          <StatCard icon={Users} label="Active Clients" value={clientCount} tone="emerald" />
          <StatCard icon={MessageSquare} label="Conversations" value={inboxCount} tone="sky" />
          <StatCard icon={ClipboardList} label="Role" value="Dietitian" tone="amber" />
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5 mt-8">
        <Card hoverable as={Link} to="/dietitian/notes" className="block">
          <h3 className="font-display font-semibold text-stone-900 mb-1.5">Manage Clients &amp; Notes</h3>
          <p className="text-sm text-stone-500">Review client profiles and keep track of nutrition notes.</p>
        </Card>
        <Card hoverable as={Link} to="/dietitian/messages" className="block">
          <h3 className="font-display font-semibold text-stone-900 mb-1.5">Open Messages</h3>
          <p className="text-sm text-stone-500">Respond to client conversations in real time.</p>
        </Card>
      </div>
    </div>
  );
}
