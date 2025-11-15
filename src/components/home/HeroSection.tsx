"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef, useState, useLayoutEffect, startTransition } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";

type Particle = {
  x: number;
  y: number;
  opacity: number;
  delay: number;
  duration: number;
};

// Fonction pour générer les particules
function generateParticles(): Particle[] {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  return Array.from({ length: 20 }, () => ({
    x: Math.random() * windowWidth,
    y: Math.random() * windowHeight,
    opacity: Math.random(),
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
  }));
}

export default function HeroSection() {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  
  // Générer les particules uniquement côté client après le montage
  // Nécessaire pour éviter l'erreur d'hydratation (SSR vs client)
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      startTransition(() => {
        setParticles(generateParticles());
      });
    }
  }, []);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient animé */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(239, 68, 68, 0.2) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 20%, rgba(239, 68, 68, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.15) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Particules animées */}
      {particles.length > 0 && (
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-red-500/30 rounded-full"
              initial={{
                x: particle.x,
                y: particle.y,
                opacity: particle.opacity,
              }}
              animate={{
                y: [null, -100],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        style={{ opacity, y }}
        className="relative z-10 text-center px-4 sm:px-6 md:px-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white mb-6 md:mb-8 tracking-tight"
            style={{ fontFamily: '"Great White Serif", serif' }}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, x: -200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              {t("hero.title.line1")}
            </motion.span>
            <motion.span
              className="block text-red-500"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              {t("hero.title.line2")}
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-white/70 text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-8 md:mb-12 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              href="#portfolio"
              variant="primary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
            >
              {t("hero.cta")}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-red-500/50 rounded-full flex items-start justify-center p-2"
          whileHover={{ borderColor: "rgba(239, 68, 68, 1)" }}
        >
          <motion.div
            className="w-1.5 h-1.5 bg-red-500 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

