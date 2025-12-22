import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Users, ListOrdered, MessageSquare, FileText, LayoutDashboard } from "lucide-react";

export default function DietitianDashboard() {
  const location = useLocation();

  const menu = [
    { name: "NotesPanel", icon: <Users size={18} />, path: "notes" },
    { name: "Diet Plans", icon: <FileText size={18} />, path: "plans" },
    { name: "Messages", icon: <MessageSquare size={18} />, path: "messages" },
    {name: "Appointments", icon: <ListOrdered size={18} />, path: "appointments" },
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "" },   
    {}
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl border-r border-gray-200 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="text-green-600" size={28} />
          <h1 className="text-2xl font-bold text-gray-800">Dietitian Panel</h1>
        </div>

        <nav className="flex flex-col gap-2">
          {menu.map((m) => {
            const active = location.pathname.includes(m.path);
            return (
              <Link
                key={m.path}
                to={m.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${active ? "bg-green-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
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
