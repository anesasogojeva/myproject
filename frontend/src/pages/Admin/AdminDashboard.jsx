import React from "react";
import { LayoutDashboard, Users, ShoppingBag, ListOrdered, MessageSquare } from "lucide-react";
import DashboardShell from "../../components/Layout/DashboardShell";

const menu = [
  { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "" },
  { name: "Users", icon: <Users size={18} />, path: "users" },
  { name: "Products", icon: <ShoppingBag size={18} />, path: "products" },
  { name: "Orders", icon: <ListOrdered size={18} />, path: "orders" },
  { name: "Contacts", icon: <MessageSquare size={18} />, path: "contacts" },
];

export default function AdminDashboard() {
  return <DashboardShell title="Admin Panel" menu={menu} basePath="/admin" />;
}
