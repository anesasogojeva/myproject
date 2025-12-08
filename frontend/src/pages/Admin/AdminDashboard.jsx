import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, ShoppingBag, ListOrdered, MessageSquare } from "lucide-react";

export default function AdminDashboard() {
  const location = useLocation();

  const menu = [
    { name: "Users", icon: <Users size={18} />, path: "users" },
    { name: "Products", icon: <ShoppingBag size={18} />, path: "products" },
    { name: "Orders", icon: <ListOrdered size={18} />, path: "orders" },
    { name: "Contacts", icon: <MessageSquare size={18} />, path: "contacts" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl border-r border-gray-200 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="text-pink-500" size={28} />
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>

        <nav className="flex flex-col gap-2">
          {menu.map((m) => {
            const active = location.pathname.includes(m.path);
            return (
              <Link
                key={m.path}
                to={m.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${active ? "bg-pink-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
              >
                {m.icon}
                <span className="font-medium">{m.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}
