"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { memo } from "react";

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen = memo(function LoadingScreen({ isLoading }: LoadingScreenProps) {
  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          style={{
            willChange: "opacity",
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
          }}
        >
          {/* Étoile animée au centre - scintillement */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1,
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            style={{
              willChange: "transform, opacity",
              transform: "translateZ(0)",
            }}
          >
            <motion.div
              animate={{ 
                opacity: [0.4, 1, 0.4],
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "loop",
              }}
              style={{
                willChange: "opacity, transform",
                transform: "translateZ(0)",
              }}
            >
              <Image
                src="/logo/star.svg"
                alt="Loading"
                width={64}
                height={64}
                className="w-16 h-16"
                priority
                unoptimized
                style={{ 
                  filter: "brightness(0) invert(1)",
                  display: "block",
                }}
              />
            </motion.div>
            
            {/* Effet de glow qui scintille aussi */}
            <motion.div
              className="absolute inset-0 -z-10"
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background: "radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, transparent 70%)",
                willChange: "opacity, transform",
                transform: "translateZ(0)",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default LoadingScreen;

