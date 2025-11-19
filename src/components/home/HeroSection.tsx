"use client";

import { motion, useScroll, useTransform, useMotionValue, animate } from "framer-motion";
import { useRef, useEffect } from "react";
import Image from "next/image";

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const scrollOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const initialOpacity = useMotionValue(0);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  const opacity = useTransform(
    [initialOpacity, scrollOpacity],
    ([initial, scroll]: number[]) => (initial as number) * (scroll as number)
  );

  useEffect(() => {
    const controls = animate(initialOpacity, 1, {
      duration: 0.8,
      delay: 2.8,
    });
    return controls.stop;
  }, [initialOpacity]);

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
      {/*   TEXTE CENTRÉ (TOUJOURS)      */}
      {/* ------------------------------ */}
      <motion.div
        style={{ opacity, y }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
      >
        <motion.div
          className="relative w-[75vw] max-w-[620px]"
          initial={{ clipPath: "circle(0% at 0 50%)" }}
          animate={{ clipPath: "circle(100% at 50% 50%)" }}
          transition={{
            duration: 2.5,
            ease: [0.4, 0, 0.2, 1],
            delay: 0.3,
          }}
        >
          {/* VOTRE */}
          <div className="mb-1 ml-2">
            <Image
              src="/images/hero/votre.svg"
              alt="VOTRE"
              width={200}
              height={60}
              className="h-[7vw] sm:h-10 w-auto"
              priority
            />
          </div>

          {/* VISION */}
          <div className="mb-1 ml-6">
            <Image
              src="/images/hero/VISION.svg"
              alt="VISION"
              width={600}
              height={260}
              className="h-[14vw] sm:h-24 w-auto"
              priority
            />
          </div>

          {/* EN + VISUEL */}
          <div className="flex items-center gap-4 ml-10 mb-2">
            <Image
              src="/images/hero/EN.svg"
              alt="EN"
              width={160}
              height={100}
              className="h-[7vw] sm:h-10 w-auto"
              priority
            />
            <Image
              src="/images/hero/VISUEL.svg"
              alt="VISUEL"
              width={600}
              height={260}
              className="h-[14vw] sm:h-24 w-auto"
              priority
            />
          </div>

          {/* TAGLINE */}
          <div className="absolute right-0 mt-2">
            <Image
              src="/images/hero/TEXTE.svg"
              alt="Graphisme. Identité. Message."
              width={300}
              height={30}
              className="h-[5vw] sm:h-6 w-auto"
              priority
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
