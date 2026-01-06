"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useModal } from "@/contexts/ModalContext";

export default function ImageModal() {
  const { isOpen, currentItem, items, currentIndex, closeModal, goToNext, goToPrevious } = useModal();
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Préchargement des images adjacentes pour une navigation fluide
  useEffect(() => {
    if (!isOpen || items.length === 0) return;

    const preloadImages: HTMLImageElement[] = [];

    // Précharger l'image suivante
    if (currentIndex < items.length - 1) {
      const nextImg = new window.Image();
      nextImg.src = items[currentIndex + 1].image;
      preloadImages.push(nextImg);
    }

    // Précharger l'image précédente
    if (currentIndex > 0) {
      const prevImg = new window.Image();
      prevImg.src = items[currentIndex - 1].image;
      preloadImages.push(prevImg);
    }

    return () => {
      preloadImages.forEach(img => {
        img.src = '';
      });
    };
  }, [isOpen, currentIndex, items]);

  // Gérer la fermeture avec la touche ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };

    const handleArrowKeys = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      window.addEventListener("keydown", handleArrowKeys);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("keydown", handleArrowKeys);
    };
  }, [isOpen, closeModal, goToNext, goToPrevious]);

  // Gérer le swipe sur mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = Math.abs(touchEndY - touchStartY.current);
    const minSwipeDistance = 50; // Distance minimale pour déclencher un swipe

    // Vérifier que le mouvement est principalement horizontal
    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        // Swipe vers la droite -> image précédente
        goToPrevious();
      } else {
        // Swipe vers la gauche -> image suivante
        goToNext();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (!currentItem) return null;

  const hasNext = currentIndex < items.length - 1;
  const hasPrevious = currentIndex > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            {/* Modal Content */}
            <div
              className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label="Fermer"
              >
                <X size={24} />
              </button>

              {/* Previous Button */}
              {hasPrevious && (
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  aria-label="Image précédente"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* Next Button */}
              {hasNext && (
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  aria-label="Image suivante"
                >
                  <ChevronRight size={24} />
                </button>
              )}

              {/* Image */}
              <div
                className="relative w-full h-full flex items-center justify-center p-4 bg-black"
                style={{ touchAction: 'pan-x', willChange: 'transform' }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <Image
                  key={currentItem.id}
                  src={currentItem.image}
                  alt={
                    currentItem.description
                      ? `${currentItem.projectName || currentItem.artist || "Création"} - ${currentItem.description}`
                      : currentItem.projectName || currentItem.artist || "Image"
                  }
                  width={1920}
                  height={1080}
                  sizes="100vw"
                  className="max-w-full max-h-[calc(90vh-120px)] object-contain"
                  loading="eager"
                  priority
                  quality={90}
                  unoptimized={false}
                />
              </div>

              {/* Image Info */}
              {(currentItem.description || currentItem.projectName || currentItem.artist || currentItem.date) && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-lg p-4 max-w-2xl w-full mx-4">
                  {currentItem.description && (
                    <p className="text-white/90 text-sm md:text-base mb-2 text-center">
                      {currentItem.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm">
                    {currentItem.artist && (
                      <div className="text-white/70">
                        <span className="text-red-500/90 font-semibold">{currentItem.artist}</span>
                      </div>
                    )}
                    {currentItem.projectName && (
                      <div className="text-white/70 font-medium">
                        {currentItem.projectName}
                      </div>
                    )}
                    {currentItem.date && (
                      <div className="text-white/50">
                        {currentItem.date}
                      </div>
                    )}
                  </div>
                  {items.length > 1 && (
                    <div className="text-white/50 text-xs text-center mt-2">
                      {currentIndex + 1} / {items.length}
                    </div>
                  )}
                </div>
              )}

              {/* Video Link Overlay */}
              {currentItem.youtubeUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <a
                    href={currentItem.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    Voir la vidéo sur YouTube
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

