"use client";

import ImageCard from "./ImageCard";
import type { ImageCardData } from "./ImageCard";

interface MasonryGridProps {
  items: ImageCardData[];
  imageClassName?: string;
  showInfo?: boolean;
  columns?: "2" | "3" | "4";
}

export default function MasonryGrid({ 
  items, 
  imageClassName,
  showInfo = true,
  columns = "4"
}: MasonryGridProps) {
  const columnClasses = {
    "2": "columns-2 sm:columns-2 md:columns-2 lg:columns-2",
    "3": "columns-2 sm:columns-2 md:columns-3 lg:columns-3",
    "4": "columns-2 sm:columns-2 md:columns-3 lg:columns-4",
  }[columns];

  return (
    <div className={`${columnClasses} gap-3 sm:gap-4 md:gap-6`}>
      {items.map((item, index) => (
        <ImageCard
          key={item.id}
          item={item}
          index={index}
          imageClassName={imageClassName}
          showInfo={showInfo}
        />
      ))}
    </div>
  );
}

