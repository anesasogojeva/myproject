import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  LayoutDashboard,
  Leaf,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", path: "/home" },
  { label: "Nutrition Shop", path: "/products" },
  { label: "About", path: "/about" },
  { label: "AI Nutrition Planner", path: "/ai-planner" },
];

export default function Header({ setMiniCartOpen }) {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [, setAuthVersion] = useState(0);
  const isLoggedIn = !!localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [bounce, setBounce] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prevCount = React.useRef(cart.length);

  useEffect(() => {
    if (cart.length > prevCount.current) {
      setBounce(true);
      setTimeout(() => setBounce(false), 300);
    }
    prevCount.current = cart.length;
  }, [cart]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authchange"));
    setAuthVersion((v) => v + 1);
    setOpen(false);
    setAccountOpen(false);
    navigate("/home");
  };

  const dashboardPath =
    user?.role === "admin" ? "/admin" : user?.role === "dietitian" ? "/dietitian" : "/dashboard";
  const dashboardLabel =
    user?.role === "admin" ? "Admin Dashboard" : user?.role === "dietitian" ? "Dietitian Dashboard" : "My Dashboard";

  const mobilePanelVariants = {
    hidden: { y: "-100%", opacity: 0 },
    visible: { y: "0%", opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { y: "-100%", opacity: 0, transition: { duration: 0.25, ease: "easeIn" } },
  };

  return (
    <header
      className={`w-full bg-white/95 backdrop-blur-md fixed top-0 left-0 z-50 border-b transition-shadow duration-300 ${
        scrolled ? "shadow-soft border-stone-200" : "border-transparent"
      }`}
    >
      <div className="container-app h-20 flex items-center justify-between gap-4">
        <Link to="/home" className="flex items-center gap-2 shrink-0">
          <span className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
            <Leaf className="w-5 h-5" />
          </span>
          <span className="text-xl font-display font-bold text-stone-900 tracking-tight">
            FitLife
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full transition ${
                  isActive
                    ? "bg-emerald-50 text-emerald-800 font-semibold"
                    : "text-stone-600 hover:text-emerald-700 hover:bg-stone-50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setAccountOpen((v) => !v)}
                onBlur={() => setTimeout(() => setAccountOpen(false), 150)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-stone-200 hover:border-emerald-300 transition text-sm font-medium text-stone-700"
              >
                <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </span>
                <span className="max-w-[120px] truncate">{user?.name || user?.email || "Account"}</span>
                <ChevronDown className="w-4 h-4 text-stone-400" />
              </button>

              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-stone-100 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-stone-100 mb-1">
                      <p className="text-sm font-semibold text-stone-800 truncate">
                        {user?.name || "Account"}
                      </p>
                      <p className="text-xs text-stone-400 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to={dashboardPath}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      {dashboardLabel}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-stone-700 hover:text-emerald-700 transition"
              >
                Log in
              </Link>
              <Link to="/register" className="btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}

          <button
            className="relative w-11 h-11 flex items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 transition"
            onClick={() => setMiniCartOpen(true)}
            aria-label="Open cart"
          >
            <motion.span animate={bounce ? { scale: [1, 1.25, 1] } : { scale: 1 }} transition={{ duration: 0.3 }}>
              <ShoppingCart className="w-5 h-5" />
            </motion.span>
            {cart.length > 0 && (
              <span className="absolute top-1 right-1 bg-emerald-700 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex lg:hidden items-center gap-2">
          <button
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 transition"
            onClick={() => setMiniCartOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-emerald-700 text-white text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>

          <button
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-stone-100 transition"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="lg:hidden fixed top-20 left-0 w-full bg-white border-t border-stone-100 shadow-elevated px-6 pt-6 pb-8 flex flex-col gap-1 z-40 max-h-[calc(100vh-5rem)] overflow-y-auto"
            variants={mobilePanelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-base font-medium transition ${
                    isActive ? "bg-emerald-50 text-emerald-800" : "text-stone-600 hover:bg-stone-50"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="h-px bg-stone-100 my-3" />

            {isLoggedIn ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 px-4 py-2 text-stone-500 text-sm">
                  <User className="w-4 h-4" />
                  {user?.name || user?.email || "Account"}
                </div>
                <Link
                  to={dashboardPath}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {dashboardLabel}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 font-medium text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-1">
                <Link to="/login" onClick={() => setOpen(false)} className="btn-outline btn-md w-full">
                  Log in
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary btn-md w-full">
                  Get Started
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
