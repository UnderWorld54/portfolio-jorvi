"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Curseur principal - très fluide
  const springConfig = { damping: 25, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  // Traînée - plus lente pour l'effet de traînée
  const trailXSpring = useSpring(cursorX, { damping: 30, stiffness: 100 });
  const trailYSpring = useSpring(cursorY, { damping: 30, stiffness: 100 });

  useEffect(() => {
    // Détecter si c'est un appareil tactile
    const checkTouchDevice = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
      );
    };

    setIsTouchDevice(checkTouchDevice());

    // Si c'est un appareil tactile, ne pas initialiser le curseur
    if (checkTouchDevice()) {
      return;
    }

    const updateCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, [role="button"], input, textarea, select, [tabindex]:not([tabindex="-1"])');
      setIsHovering(!!isInteractive);
    };

    // Utiliser la délégation d'événements pour gérer tous les éléments interactifs
    document.addEventListener("mousemove", handleMouseMove);

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", updateCursor);
    window.addEventListener("mouseenter", () => setIsVisible(true));
    window.addEventListener("mouseleave", () => setIsVisible(false));
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", updateCursor);
      window.removeEventListener("mouseenter", () => setIsVisible(true));
      window.removeEventListener("mouseleave", () => setIsVisible(false));
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [cursorX, cursorY, isVisible]);

  // Ne pas afficher le curseur sur les appareils tactiles
  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Curseur principal - étoile avec transparence et animation */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            scale: isClicking ? 0.8 : isHovering ? 1.1 : [1, 1.05, 1],
            opacity: isClicking ? 0.7 : isHovering ? 0.8 : 0.6,
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            scale: {
              duration: isHovering ? 0.2 : 2,
              repeat: isHovering ? 0 : Infinity,
              ease: "easeInOut",
            },
            opacity: {
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
            },
            rotate: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          style={{
            filter: "brightness(0) invert(1) drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))",
          }}
        >
          <Image
            src="/logo/star-cursor.svg"
            alt=""
            width={32}
            height={32}
            className="w-8 h-8"
            unoptimized
          />
        </motion.div>
      </motion.div>

      {/* Cercle externe au hover avec animation pulsante */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9998]"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              translateX: "-50%",
              translateY: "-50%",
            }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.2, 1],
            }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{
              opacity: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <div 
              className="w-12 h-12 rounded-full border border-white/30"
              style={{
                backdropFilter: "blur(2px)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Effet de clic - onde */}
      <AnimatePresence>
        {isClicking && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9996]"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              translateX: "-50%",
              translateY: "-50%",
            }}
            initial={{ opacity: 0.4, scale: 0.8 }}
            animate={{ opacity: 0, scale: 2 }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="w-16 h-16 rounded-full border-2 border-white/40" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

