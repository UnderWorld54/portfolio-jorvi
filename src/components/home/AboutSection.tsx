"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutSection() {
  const { t } = useLanguage();
  return (
    <section
      id="about"
      className="relative py-20 md:py-32 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden"
    >
      {/* Éléments décoratifs rouges dans les coins supérieurs */}
      <div className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-full h-full rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-full h-full rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Titre horizontal centré */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: '"Great White Serif", serif' }}
          >
            {t("about.title")}
          </motion.h2>
        </motion.div>

        {/* Layout en deux colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-8 md:gap-12 items-start">
          {/* Colonne gauche - Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="relative mt-10 md:mt-0 w-full"
          >
            <div
              className="relative w-full aspect-3/4 group max-w-xs mx-auto md:max-w-sm"
              style={{ perspective: "1400px" }}
            >
              <div className="relative h-full w-full rounded-[32px] overflow-hidden transition-[transform,box-shadow] duration-500 ease-out transform-3d transform-[rotateY(0deg)_rotateX(0deg)] group-hover:transform-[rotateY(-10deg)_rotateX(4deg)] [box-shadow:0_18px_36px_rgba(0,0,0,0.35)] group-hover:[box-shadow:0_35px_60px_rgba(0,0,0,0.45)]">
                <Image
                  src="/images/me.png"
                  alt="Jorvi Kapela"
                  fill
                  className="object-cover transition-transform duration-500 ease-out transform-[translateZ(0px)] group-hover:transform-[translateZ(35px)]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Colonne droite - Texte */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="flex flex-col justify-start space-y-6"
          >
            <motion.p
              className="text-white text-xl md:text-2xl"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                delay: 0.2,
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              {t("about.greeting")}
            </motion.p>

            <motion.h3
              className="text-6xl md:text-8xl font-bold text-red-500 mb-4"
              style={{ fontFamily: '"Great White Serif", serif' }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                delay: 0.28,
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              JORVI
            </motion.h3>

            <motion.p
              className="text-white/80 text-lg md:text-xl leading-relaxed"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                delay: 0.36,
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              {t("about.description")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                delay: 0.44,
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="pt-4 flex flex-wrap gap-4"
            >
              <Button href="/about" variant="primary" size="md">
                {t("cta.more")}
              </Button>
              <Button href="/CV.pdf" variant="outline" size="md" download>
                {t("cta.cv")}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
