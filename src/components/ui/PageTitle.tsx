"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface PageTitleProps {
  title: string;
  className?: string;
}

export default function PageTitle({ title, className = "" }: PageTitleProps) {
  return (
    <motion.div
      className={`mb-8 md:mb-12 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-4">
        <Image
          src="/logo/star.svg"
          alt="Star"
          width={24}
          height={24}
          className="w-5 h-5 sm:w-6 sm:h-6 hidden sm:block"
          style={{ 
            filter: "brightness(0) invert(1) drop-shadow(0 0 4px rgba(255, 255, 255, 0.6))",
          }}
        />
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-red-500 text-center tracking-tight uppercase"
          style={{ 
            fontFamily: '"Great White Serif", serif',
            textShadow: "0 0 10px rgba(239, 68, 68, 0.5), 0 0 20px rgba(239, 68, 68, 0.3)"
          }}
        >
          {title}
        </h1>
        <Image
          src="/logo/star.svg"
          alt="Star"
          width={24}
          height={24}
          className="w-5 h-5 sm:w-6 sm:h-6 hidden sm:block"
          style={{ 
            filter: "brightness(0) invert(1) drop-shadow(0 0 4px rgba(255, 255, 255, 0.6))",
          }}
        />
      </div>
    </motion.div>
  );
}

