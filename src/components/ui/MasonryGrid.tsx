"use client";

import { memo, useMemo } from "react";
import ImageCard from "./ImageCard";
import type { ImageCardData } from "./ImageCard";

interface MasonryGridProps {
  items: ImageCardData[];
  imageClassName?: string;
  showInfo?: boolean;
  columns?: "2" | "3" | "4";
}

function MasonryGrid({ 
  items, 
  imageClassName,
  showInfo = true,
  columns = "4"
}: MasonryGridProps) {
  const columnClasses = useMemo(() => ({
    "2": "columns-2 sm:columns-2 md:columns-2 lg:columns-2",
    "3": "columns-2 sm:columns-2 md:columns-3 lg:columns-3",
    "4": "columns-2 sm:columns-2 md:columns-3 lg:columns-4",
  }[columns]), [columns]);

  return (
    <div className={`${columnClasses} gap-3 sm:gap-4 md:gap-6`}>
      {items.map((item, index) => (
        <div key={item.id} className="break-inside-avoid mb-3 sm:mb-4 md:mb-6">
          <ImageCard
            item={item}
            index={index}
            items={items}
            imageClassName={imageClassName}
            showInfo={showInfo}
          />
        </div>
      ))}
    </div>
  );
}

export default memo(MasonryGrid);

