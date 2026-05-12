"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const logoSrc =
    language === "ENG" ? "/images/VISU_EN.svg" : "/images/VISU.svg";
  const logoAlt = language === "ENG" ? "VISUAL" : "VISUEL";

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* --------------------------- */}
      {/*        HALO ROUGE          */}
      {/* --------------------------- */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="relative w-[85vw] h-[85vw] max-w-[900px] max-h-[900px]">
          <Image
            src="/images/hero/Cercle rouge.svg"
            alt="Cercle rouge"
            fill
            className="object-contain opacity-90"
            priority
          />
        </div>
      </div>

      {/* ----------------------------------- */}
      {/*       CERCLE NOIR (ANIMATION)       */}
      {/* ----------------------------------- */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        transition={{
          duration: 2.5,
          ease: [0.4, 0, 0.2, 1],
          delay: 0.3,
        }}
      >
        <div className="relative w-[75vw] h-[75vw] max-w-[750px] max-h-[750px]">
          <Image
            src="/images/hero/cercle noir.svg"
            alt="Cercle noir"
            fill
            className="object-contain"
            priority
          />
        </div>
      </motion.div>

      {/* --------------------------- */}
      {/*         VISU CENTRÉ        */}
      {/* --------------------------- */}
      <div className="absolute z-30 flex items-center justify-center">
        <div className="relative w-[65vw] sm:w-[55vw] md:w-[45vw] max-w-[550px] min-w-[200px]">
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={2000}
            height={200}
            className="w-full h-auto object-contain"
            sizes="(max-width: 768px) 70vw, 45vw"
            priority
          />
        </div>
      </div>
    </section>
  );
}
