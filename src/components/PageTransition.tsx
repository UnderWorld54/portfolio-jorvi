"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed inset-0 z-[60] bg-black flex items-center justify-center pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1.1, 1, 0.9],
          }}
          transition={{
            duration: 0.8,
            times: [0, 0.3, 0.7, 1],
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          <Image
            src="/logo/star.svg"
            alt=""
            width={40}
            height={40}
            className="w-10 h-10"
            style={{ filter: "brightness(0) invert(1)" }}
            priority
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
