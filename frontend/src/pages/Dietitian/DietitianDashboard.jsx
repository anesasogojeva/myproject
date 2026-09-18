import React from "react";
import { LayoutDashboard, Users, MessageSquare } from "lucide-react";
import DashboardShell from "../../components/Layout/DashboardShell";

const menu = [
  { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "" },
  { name: "Clients & Notes", icon: <Users size={18} />, path: "notes" },
  { name: "Messages", icon: <MessageSquare size={18} />, path: "messages" },
];

export default function DietitianDashboard() {
  return <DashboardShell title="Dietitian Panel" menu={menu} basePath="/dietitian" />;
}
