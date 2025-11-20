"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutSection() {
    const { t } = useLanguage();
    return (
        <section className="relative min-h-screen flex items-center px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden">
            {/* Éléments décoratifs rouges dans les coins supérieurs */}
            <div className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 pointer-events-none">
                <motion.div
                    className="absolute top-0 left-0 w-full h-full rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)",
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
                        background: "radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)",
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

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Layout en deux colonnes */}
                <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-8 md:gap-12 items-start">
                    {/* Colonne gauche - Photo */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative w-full"
                    >
                        <div
                            className="relative w-full aspect-3/4 group max-w-xs mx-auto md:max-w-sm"
                            style={{ perspective: "1400px" }}
                        >
                            <div
                                className="absolute -inset-6 rounded-[36px] opacity-70 blur-2xl pointer-events-none"
                                style={{
                                    background:
                                        "linear-gradient(135deg, rgba(239,68,68,0.35) 0%, rgba(59,130,246,0.2) 45%, rgba(255,255,255,0.08) 100%)",
                                    filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.35))",
                                }}
                                aria-hidden="true"
                            />
                            <div
                                className="relative h-full w-full rounded-[32px] overflow-hidden transition-[transform,box-shadow] duration-500 ease-out transform-3d transform-[rotateY(0deg)_rotateX(0deg)] group-hover:transform-[rotateY(-10deg)_rotateX(4deg)] [box-shadow:0_18px_36px_rgba(0,0,0,0.35)] group-hover:[box-shadow:0_35px_60px_rgba(0,0,0,0.45),0_0_80px_rgba(239,68,68,0.35)]"
                                style={{
                                    background:
                                        "linear-gradient(180deg, rgba(15,15,20,0.8) 0%, rgba(15,15,20,0.4) 100%)",
                                }}
                            >
                                <Image
                                    src="/images/me.png"
                                    alt="Jorvi Kapela"
                                    fill
                                    className="object-cover transition-transform duration-500 ease-out transform-[translateZ(0px)] group-hover:transform-[translateZ(35px)]"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background:
                                            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25), transparent 55%)",
                                        mixBlendMode: "screen",
                                        opacity: 0.6,
                                    }}
                                    aria-hidden="true"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Colonne droite - Texte */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-col justify-start space-y-6"
                    >
                        <motion.p
                            className="text-white text-xl md:text-2xl"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            {t("about.greeting")}
                        </motion.p>

                        <motion.h2
                            className="text-6xl md:text-8xl font-bold text-red-500 mb-4"
                            style={{ fontFamily: '"Great White Serif", serif' }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            JORVI
                        </motion.h2>

                        <motion.p
                            className="text-white/80 text-lg md:text-xl leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            {t("about.description")}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                            className="pt-4"
                        >
                            <Button
                                href="/CV.pdf"
                                variant="primary"
                                size="md"
                                download
                            >
                                {t("cta.more")}                            
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

