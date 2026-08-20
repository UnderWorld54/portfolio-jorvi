"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[8rem] md:text-[12rem] font-bold leading-none text-red-500"
          style={{ fontFamily: '"Great White Serif", serif' }}
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-white/60 text-lg md:text-xl mt-4 mb-8"
        >
          Cette page n&apos;existe pas ou a été déplacée.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-bold uppercase tracking-wider hover:bg-red-500 hover:border-red-500 transition-all duration-300 hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
            Retour à l&apos;accueil
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
