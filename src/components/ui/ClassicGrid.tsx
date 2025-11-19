"use client";

import { memo } from "react";
import ImageCard from "./ImageCard";
import type { ImageCardData } from "./ImageCard";

interface ClassicGridProps {
  items: ImageCardData[];
  imageClassName?: string;
  showInfo?: boolean;
  columns?: "2" | "3" | "4";
}

function ClassicGrid({ 
  items, 
  imageClassName,
  showInfo = true,
  columns = "3"
}: ClassicGridProps) {
  const gridClasses = {
    "2": "grid-cols-1 sm:grid-cols-2",
    "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }[columns];

  return (
    <div className={`grid ${gridClasses} gap-4 sm:gap-6 md:gap-8`}>
      {items.map((item, index) => (
        <div key={item.id} className="flex flex-col">
          <ImageCard
            item={item}
            index={index}
            items={items}
            imageClassName={imageClassName}
            showInfo={showInfo}
            imageAspectRatio="aspect-[4/3]"
          />
        </div>
      ))}
    </div>
  );
}

export default memo(ClassicGrid);

