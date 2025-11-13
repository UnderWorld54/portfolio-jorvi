"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function AboutSection() {
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                    {/* Colonne gauche - Photo */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative w-full aspect-3/4 border-2 border-red-500 rounded-lg overflow-hidden"
                            style={{
                                boxShadow: "0 0 30px rgba(239, 68, 68, 0.4), inset 0 0 30px rgba(239, 68, 68, 0.1)",
                            }}
                        >
                            {/* Placeholder pour la photo */}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white/30 text-sm">Photo</span>
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
                            className="text-white text-lg md:text-xl"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            Bonjour moi c&apos;est
                        </motion.p>

                        <motion.h2
                            className="text-5xl md:text-7xl font-bold text-red-500 mb-4"
                            style={{ fontFamily: '"Great White Serif", serif' }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            JORVI
                        </motion.h2>

                        <motion.p
                            className="text-white/80 text-base md:text-lg leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                            className="pt-4"
                        >
                            <Button
                                href="#"
                                variant="primary"
                                size="md"
                            >
                                EN SAVOIR PLUS
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

