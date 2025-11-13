"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface PortfolioCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
  delay: number;
}

export default function PortfolioCard({
  title,
  description,
  image,
  href,
  delay,
}: PortfolioCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className="group relative h-[400px] md:h-[500px] overflow-hidden rounded-xl md:rounded-2xl border border-red-500/20 cursor-pointer"
      whileHover={{ borderColor: "rgba(239, 68, 68, 0.5)" }}
    >
      <Link href={href} className="block h-full w-full">
        <motion.div
          className="relative h-full w-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
            animate={{
              opacity: [0.7, 0.5, 0.7],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-10">
            <motion.h3
              className="text-3xl md:text-4xl font-bold text-white mb-2"
              style={{ fontFamily: '"Great White Serif", serif' }}
              whileHover={{ x: 5 }}
            >
              {title}
            </motion.h3>
            <motion.p
              className="text-white/80 text-sm md:text-base mb-4"
              whileHover={{ x: 5 }}
            >
              {description}
            </motion.p>
            <motion.div
              className="flex items-center gap-2 text-red-500"
              initial={{ opacity: 0, x: -10 }}
              whileHover={{ opacity: 1, x: 0 }}
            >
              <span className="text-sm font-medium uppercase tracking-wider">
                Explorer
              </span>
              <ArrowRight size={18} />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

