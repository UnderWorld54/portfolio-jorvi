"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const categoryData: Record<string, { title: string; items: Array<{ id: string; title: string; image: string }> }> = {
  logos: {
    title: "LOGOS",
    items: [
      { id: "1", title: "Logo 1", image: "/images/logo1.jpg" },
      { id: "2", title: "Logo 2", image: "/images/logo2.jpg" },
      { id: "3", title: "Logo 3", image: "/images/logo3.jpg" },
      // Ajoutez plus d'éléments ici
    ],
  },
  prints: {
    title: "PRINTS",
    items: [
      { id: "1", title: "Print 1", image: "/images/print1.jpg" },
      { id: "2", title: "Print 2", image: "/images/print2.jpg" },
      // Ajoutez plus d'éléments ici
    ],
  },
  photos: {
    title: "PHOTOS",
    items: [
      { id: "1", title: "Photo 1", image: "/images/photo1.jpg" },
      { id: "2", title: "Photo 2", image: "/images/photo2.jpg" },
      // Ajoutez plus d'éléments ici
    ],
  },
  videos: {
    title: "VIDÉOS",
    items: [
      { id: "1", title: "Vidéo 1", image: "/images/video1.jpg" },
      { id: "2", title: "Vidéo 2", image: "/images/video2.jpg" },
      // Ajoutez plus d'éléments ici
    ],
  },
};

export default function CategoryPage() {
  const params = useParams();
  const category = params?.category as string;
  const data = categoryData[category];

  if (!data) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4" style={{ fontFamily: '"Great White Serif", serif' }}>
            Catégorie non trouvée
          </h1>
          <Link href="/designs" className="text-red-500/60 hover:text-red-500 transition-colors">
            Retour aux designs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        {/* Header avec titre et retour */}
        <div className="mb-12">
          <Link
            href="/designs"
            className="inline-flex items-center gap-2 text-red-500/60 hover:text-red-500 transition-colors mb-6"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 12L6 8L10 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Retour
          </Link>
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ fontFamily: '"Great White Serif", serif' }}
          >
            {data.title}
          </motion.h1>
        </div>

        {/* Grid des éléments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-900 border border-gray-800 hover:border-red-500/50 transition-colors"
            >
              <div className="relative w-full h-[300px] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

