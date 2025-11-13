"use client";

import { motion } from "framer-motion";
import PortfolioCard from "./PortfolioCard";

const portfolioItems = [
  {
    title: "DESIGNS",
    description: "Logos, prints et vidéos",
    image: "/images/logos.jpg",
    href: "/designs",
  },
  {
    title: "COVERS",
    description: "Pochette d'albums et visuels musicaux",
    image: "/images/cover1.jpg",
    href: "/covers",
  },
  {
    title: "PHOTOS",
    description: "Photographie artistique",
    image: "/images/photos.jpg",
    href: "/photos",
  },
];

export default function PortfolioSection() {
  return (
    <section
      id="portfolio"
      className="relative py-20 md:py-32 px-4 sm:px-6 md:px-8 lg:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: '"Great White Serif", serif' }}
          >
            PORTFOLIO
          </motion.h2>
          <motion.p
            className="text-white/70 text-lg md:text-xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Explorez mes créations
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {portfolioItems.map((item, index) => (
            <PortfolioCard
              key={item.href}
              title={item.title}
              description={item.description}
              image={item.image}
              href={item.href}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

