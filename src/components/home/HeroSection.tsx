"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const scrollOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  const opacity = scrollOpacity;

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* --------------------------- */}
      {/*   HALO ROUGE (DESKTOP ONLY) */}
      {/* --------------------------- */}
      <div className="absolute inset-0 sm:flex hidden items-center justify-center pointer-events-none z-10">
        <div className="relative w-[70vw] h-[70vw] max-w-[900px] max-h-[900px]">
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
      {/*   CERCLE NOIR ANIMÉ (DESKTOP ONLY) */}
      {/* ----------------------------------- */}
      <motion.div
        className="absolute inset-0 sm:flex hidden items-center justify-center pointer-events-none z-20"
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        transition={{
          duration: 2.5,
          ease: [0.4, 0, 0.2, 1],
          delay: 0.3,
        }}
      >
        <div className="relative w-[60vw] h-[60vw] max-w-[750px] max-h-[750px]">
          <Image
            src="/images/hero/cercle noir.svg"
            alt="Cercle noir"
            fill
            className="object-contain"
            priority
          />
        </div>
      </motion.div>

      {/* ------------------------------ */}
      {/*   TEXTE CENTRÉ (DESKTOP ONLY)  */}
      {/* ------------------------------ */}
      <motion.div
        style={{ opacity, y }}
        className="hidden sm:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 px-4 sm:px-0"
      >
        <div className="relative w-[90vw] sm:w-[75vw] max-w-[620px]">
          {/* VOTRE */}
          <div className="mb-0.5 sm:mb-1 ml-0 sm:ml-2">
            <Image
              src="/images/hero/votre.svg"
              alt="VOTRE"
              width={200}
              height={60}
              className="h-[5vw] sm:h-10 w-auto min-h-[24px]"
              priority
            />
          </div>

          {/* VISION */}
          <motion.div
            className="mb-0.5 sm:mb-1 ml-2 sm:ml-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 1.5,
            }}
          >
            <Image
              src="/images/hero/VISION.svg"
              alt="VISION"
              width={600}
              height={260}
              className="h-[10vw] sm:h-24 w-auto min-h-[40px]"
              priority
            />
          </motion.div>

          {/* EN + VISUEL */}
          <div className="flex items-center gap-2 sm:gap-4 ml-4 sm:ml-10 mb-1 sm:mb-2">
            <Image
              src="/images/hero/EN.svg"
              alt="EN"
              width={160}
              height={100}
              className="h-[5vw] sm:h-10 w-auto min-h-[24px]"
              priority
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: 1.5,
              }}
            >
              <Image
                src="/images/hero/VISUEL.svg"
                alt="VISUEL"
                width={600}
                height={260}
                className="h-[10vw] sm:h-24 w-auto min-h-[40px]"
                priority
              />
            </motion.div>
          </div>

          {/* TAGLINE */}
          <div className="absolute right-0 sm:right-0 mt-1 sm:mt-2 max-w-[60%] sm:max-w-none">
            <Image
              src="/images/hero/TEXTE.svg"
              alt="Graphisme. Identité. Message."
              width={300}
              height={30}
              className="h-[3.5vw] sm:h-6 w-auto min-h-[16px]"
              priority
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
