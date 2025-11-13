"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
}

export default function PageContainer({ 
  children, 
  isLoading = false,
  className = "" 
}: PageContainerProps) {
  return (
    <motion.div 
      className={`min-h-screen bg-black pt-20 sm:pt-24 md:pt-28 relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoading ? 0 : 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12">
        {children}
      </div>
    </motion.div>
  );
}

