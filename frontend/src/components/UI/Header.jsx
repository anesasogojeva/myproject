import React, { useState, useEffect } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({ setMiniCartOpen }) {
  const { cart } = useCart();
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(cart.length);
  const [bounce, setBounce] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Cart bounce on item added
  useEffect(() => {
    if (cart.length > cartCount) {
      setBounce(true);
      setTimeout(() => setBounce(false), 300);
    }
    setCartCount(cart.length);
  }, [cart, cartCount]);

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Home", "Products", "About", "Ai Assistant"];

  // Mobile menu link animation variants
  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3, ease: "easeOut" },
    }),
  };

  // Mobile panel animation
  const mobilePanelVariants = {
    hidden: { y: "-100%", opacity: 0 },
    visible: { y: "0%", opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { y: "-100%", opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <header
      className={`w-full bg-white/90 backdrop-blur-md fixed top-0 left-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-xl" : "shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.h1
          className="text-3xl md:text-4xl font-extrabold tracking-tight cursor-pointer select-none flex items-center gap-1"
          whileHover={{ scale: 1.1, letterSpacing: "2px" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <span className="text-[#22c55e]">Fit</span>
          <span className="text-[#ec4899]">Life</span>
        </motion.h1>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`/${link.toLowerCase()}`}
              className="relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#ec4899] after:transition-all after:duration-300 hover:after:w-full hover:text-[#ec4899]"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Cart */}
        <motion.button
          animate={bounce ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative text-black hover:text-[#ec4899] transition"
          onClick={() => setMiniCartOpen(true)}
        >
          <ShoppingCart className="w-7 h-7" />
          {cart.length > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-2 py-[2px] rounded-full animate-pulse">
              {cart.length}
            </div>
          )}
        </motion.button>

        {/* Mobile toggle */}
        <button
          className="md:hidden ml-4 flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden fixed top-0 left-0 w-full bg-white shadow-lg px-6 pt-24 pb-8 flex flex-col gap-6 text-gray-700 font-medium z-40"
            variants={mobilePanelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link}
                href={`/${link.toLowerCase()}`}
                className="relative text-xl after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#ec4899] after:transition-all after:duration-300 hover:after:w-full hover:text-[#ec4899]"
                custom={i}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={mobileMenuVariants}
              >
                {link}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
