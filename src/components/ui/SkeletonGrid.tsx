"use client";

import { motion } from "framer-motion";

interface SkeletonGridProps {
  count?: number;
  type?: "masonry" | "classic";
}

export default function SkeletonGrid({ count = 6, type = "masonry" }: SkeletonGridProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (type === "classic") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {skeletons.map((i) => (
          <SkeletonCard key={i} index={i} aspectRatio="aspect-[4/3]" />
        ))}
      </div>
    );
  }

  return (
    <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 md:gap-6">
      {skeletons.map((i) => (
        <div key={i} className="break-inside-avoid mb-3 sm:mb-4 md:mb-6">
          <SkeletonCard index={i} />
        </div>
      ))}
    </div>
  );
}

interface SkeletonCardProps {
  index: number;
  aspectRatio?: string;
}

function SkeletonCard({ index, aspectRatio }: SkeletonCardProps) {
  // Heights variés pour effet masonry naturel
  const heights = ["h-64", "h-80", "h-72", "h-96", "h-60", "h-88"];
  const height = aspectRatio || heights[index % heights.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative overflow-hidden rounded-lg bg-gray-900 border border-red-500/10 h-full flex flex-col"
    >
      {/* Image skeleton */}
      <div className={`relative w-full ${aspectRatio || height} bg-gradient-to-br from-gray-800/50 to-gray-900/50 overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      </div>

      {/* Info skeleton */}
      <div className="p-4 bg-black/90 flex-1">
        {/* Description skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-3 bg-gray-800/70 rounded w-full animate-pulse" />
          <div className="h-3 bg-gray-800/70 rounded w-4/5 animate-pulse" />
        </div>

        {/* Meta info skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-red-500/20 rounded w-1/2 animate-pulse" />
          <div className="h-2 bg-gray-800/50 rounded w-1/3 animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}

// Ajouter l'animation shimmer au globals.css
// @keyframes shimmer {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// }
// .animate-shimmer {
//   animation: shimmer 2s infinite;
// }
