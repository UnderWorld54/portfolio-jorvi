"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsVisible(latest > 300);
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-red-500/90 hover:bg-red-500 text-white shadow-lg hover:shadow-red-500/50 transition-all duration-300 backdrop-blur-sm border border-red-500/30"
      style={{
        boxShadow: "0 4px 20px rgba(239, 68, 68, 0.4), 0 0 30px rgba(239, 68, 68, 0.2)",
      }}
      aria-label="Retour en haut"
    >
      <ArrowUp size={24} />
    </motion.button>
  );
}

