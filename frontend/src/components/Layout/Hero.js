import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="w-full h-[80vh] bg-gradient-to-br from-pink-50 via-white to-yellow-50 flex items-center justify-center relative overflow-hidden">
      <motion.img
        src="https://static.vecteezy.com/system/resources/previews/015/693/456/original/woman-leading-a-healthy-lifestyle-free-png.png"
        className="w-[520px]"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </section>
  );
}
