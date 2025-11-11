"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Cover {
  id: string;
  image: string;
  artist: string;
  projectName: string;
  date: string;
  description: string;
}

const covers: Cover[] = [
  {
    id: "1",
    image: "/images/cover1.jpg",
    artist: "Artiste 1",
    projectName: "Projet Alpha",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "2",
    image: "/images/cover2.jpg",
    artist: "Artiste 2",
    projectName: "Projet Beta",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "3",
    image: "/images/cover3.jpg",
    artist: "Artiste 3",
    projectName: "Projet Gamma",
    date: "2023",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "4",
    image: "/images/cover4.jpg",
    artist: "Artiste 4",
    projectName: "Projet Delta",
    date: "2023",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "5",
    image: "/images/cover5.jpg",
    artist: "Artiste 5",
    projectName: "Projet Epsilon",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "6",
    image: "/images/cover6.jpg",
    artist: "Artiste 6",
    projectName: "Projet Zeta",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "7",
    image: "/images/cover1.jpg",
    artist: "Artiste 1",
    projectName: "Projet Alpha",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "8",
    image: "/images/cover2.jpg",
    artist: "Artiste 2",
    projectName: "Projet Beta",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "9",
    image: "/images/cover3.jpg",
    artist: "Artiste 3",
    projectName: "Projet Gamma",
    date: "2023",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "10",
    image: "/images/cover4.jpg",
    artist: "Artiste 4",
    projectName: "Projet Delta",
    date: "2023",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "11",
    image: "/images/cover5.jpg",
    artist: "Artiste 5",
    projectName: "Projet Epsilon",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "12",
    image: "/images/cover6.jpg",
    artist: "Artiste 6",
    projectName: "Projet Zeta",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
];

export default function CoversPage() {
  return (
    <div className="min-h-screen bg-black pt-20 sm:pt-24 md:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12">
        {/* Header */}
        <motion.div
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-4">
            <Image
              src="/logo/star.svg"
              alt="Star"
              width={24}
              height={24}
              className="w-5 h-5 sm:w-6 sm:h-6 hidden sm:block"
              style={{ 
                filter: "brightness(0) invert(1) drop-shadow(0 0 4px rgba(255, 255, 255, 0.6))",
              }}
            />
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-red-500 text-center tracking-tight uppercase"
              style={{ 
                fontFamily: "serif",
                textShadow: "0 0 10px rgba(239, 68, 68, 0.5), 0 0 20px rgba(239, 68, 68, 0.3)"
              }}
            >
              COVERS
            </h1>
            <Image
              src="/logo/star.svg"
              alt="Star"
              width={24}
              height={24}
              className="w-5 h-5 sm:w-6 sm:h-6 hidden sm:block"
              style={{ 
                filter: "brightness(0) invert(1) drop-shadow(0 0 4px rgba(255, 255, 255, 0.6))",
              }}
            />
          </div>
        </motion.div>

        {/* Grille Masonry de type Pinterest */}
        <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 md:gap-6">
          {covers.map((cover, index) => (
            <motion.div
              key={cover.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="break-inside-avoid mb-3 sm:mb-4 md:mb-6 group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg bg-gray-900 border border-red-500/20 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
                {/* Image - conserve les dimensions d'origine pour effet mur de brique */}
                <div className="relative w-full overflow-hidden">
                  <img
                    src={cover.image}
                    alt={cover.projectName}
                    className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>

                {/* Informations */}
                <div className="p-4 bg-black/90 backdrop-blur-sm">
                  <p className="text-white/80 text-xs sm:text-sm mb-2 line-clamp-2">
                    {cover.description}
                  </p>
                  <div className="flex flex-col gap-1 text-xs sm:text-sm">
                    <div className="text-white font-medium">
                      <span className="text-red-500/80">{cover.artist}</span>
                    </div>
                    <div className="text-white/60">
                      {cover.projectName} · {cover.date}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

