"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export interface ImageCardData {
  id: string;
  image: string;
  artist?: string;
  projectName?: string;
  date?: string;
  description?: string;
  youtubeUrl?: string;
}

interface ImageCardProps {
  item: ImageCardData;
  index: number;
  imageClassName?: string;
  showInfo?: boolean;
}

export default function ImageCard({ 
  item, 
  index, 
  imageClassName = "cover-image",
  showInfo = true 
}: ImageCardProps) {
  const imageContent = (
    <div className="relative w-full overflow-hidden">
      <Image
        src={item.image}
        alt={item.projectName || item.id}
        width={800}
        height={1200}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className={`${imageClassName} w-full h-auto block transition-transform duration-500 group-hover:scale-105`}
        loading="lazy"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      {item.youtubeUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
          <div className="text-white/90 text-4xl font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            ▶
          </div>
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="break-inside-avoid mb-3 sm:mb-4 md:mb-6 group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-900 border border-red-500/20 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
        {/* Image - conserve les dimensions d'origine pour effet mur de brique */}
        {item.youtubeUrl ? (
          <a
            href={item.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            {imageContent}
          </a>
        ) : (
          imageContent
        )}

        {/* Informations */}
        {showInfo && (item.description || item.artist || item.projectName || item.date) && (
          <div className="p-4 bg-black/90 backdrop-blur-sm">
            {item.description && (
              <p className="text-white/80 text-xs sm:text-sm mb-3 line-clamp-3">
                {item.description}
              </p>
            )}
            {(item.artist || item.projectName || item.date) && (
              <div className="flex flex-col gap-2 text-xs sm:text-sm">
                {item.artist && (
                  <div className="text-white font-semibold">
                    <span className="text-red-500/90">{item.artist}</span>
                  </div>
                )}
                {item.projectName && (
                  <div className="text-white/70 font-medium">
                    {item.projectName}
                  </div>
                )}
                {item.date && (
                  <div className="text-white/50 text-xs">
                    {item.date}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

