import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Leaf, Menu, X, LogOut, Home } from "lucide-react";

export default function DashboardShell({ title, menu, basePath = "" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/home");
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2.5 px-6 pt-6 pb-8">
        <span className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
          <Leaf className="w-5 h-5" />
        </span>
        <div className="min-w-0">
          <p className="font-display font-bold text-stone-900 leading-tight truncate">{title}</p>
          <p className="text-xs text-stone-400 truncate">{user?.name || user?.email}</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto scroll-thin">
        {menu.map((m) => (
          <NavLink
            key={m.path || m.name}
            to={m.path === "" ? basePath || "." : m.path}
            end={m.path === ""}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-emerald-700 text-white shadow-soft"
                  : "text-stone-600 hover:bg-stone-100"
              }`
            }
          >
            {m.icon}
            {m.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-stone-100 mt-4 space-y-1">
        <Link
          to="/home"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-100 transition"
        >
          <Home className="w-4 h-4" /> Back to site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition text-left"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-cream-100">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-stone-200 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-20 left-0 right-0 z-30 bg-white border-b border-stone-200 flex items-center justify-between px-4 h-14">
        <p className="font-display font-bold text-stone-900">{title}</p>
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-stone-100"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-stone-900/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 bg-white h-full flex flex-col animate-fadeIn">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      <main className="flex-1 min-w-0 p-5 sm:p-8 lg:pt-8 pt-20">
        <Outlet />
      </main>
    </div>
  );
}
