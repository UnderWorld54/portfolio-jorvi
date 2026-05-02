"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useModal } from "@/contexts/ModalContext";

const imageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function ImageModal() {
  const {
    isOpen,
    currentItem,
    items,
    currentIndex,
    closeModal,
    goToNext,
    goToPrevious,
  } = useModal();
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const directionRef = useRef(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleNext = useCallback(() => {
    directionRef.current = 1;
    goToNext();
  }, [goToNext]);

  const handlePrevious = useCallback(() => {
    directionRef.current = -1;
    goToPrevious();
  }, [goToPrevious]);

  useEffect(() => {
    if (!isOpen || items.length === 0) return;

    const preloadImages: HTMLImageElement[] = [];

    if (currentIndex < items.length - 1) {
      const nextImg = new window.Image();
      nextImg.src = items[currentIndex + 1].image;
      preloadImages.push(nextImg);
    }

    if (currentIndex > 0) {
      const prevImg = new window.Image();
      prevImg.src = items[currentIndex - 1].image;
      preloadImages.push(prevImg);
    }

    return () => {
      preloadImages.forEach((img) => {
        img.src = "";
      });
    };
  }, [isOpen, currentIndex, items]);

  // Focus trap + restore focus on close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      requestAnimationFrame(() => {
        const closeBtn = dialogRef.current?.querySelector<HTMLElement>(
          'button[aria-label="Fermer"]',
        );
        closeBtn?.focus();
      });
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const focusable = Array.from(
          dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        ).filter((el) => !el.hasAttribute("disabled"));

        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeModal, handleNext, handlePrevious]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) handlePrevious();
      else handleNext();
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (!currentItem) return null;

  const hasNext = currentIndex < items.length - 1;
  const hasPrevious = currentIndex > 0;
  const hasInfo =
    currentItem.description ||
    currentItem.projectName ||
    currentItem.artist ||
    currentItem.date;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse d'images"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              aria-label="Fermer"
            >
              <X size={24} />
            </button>

            {hasPrevious && (
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label="Image précédente"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {hasNext && (
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label="Image suivante"
              >
                <ChevronRight size={24} />
              </button>
            )}

            <div
              className="relative w-full h-full flex items-center justify-center p-4 bg-black overflow-hidden"
              style={{ touchAction: "pan-x" }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence
                initial={false}
                custom={directionRef.current}
                mode="popLayout"
              >
                <motion.div
                  key={currentItem.id}
                  custom={directionRef.current}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute inset-0 flex items-center justify-center p-4"
                >
                  <Image
                    src={currentItem.image}
                    alt={
                      currentItem.description
                        ? `${currentItem.projectName || currentItem.artist || "Création"} - ${currentItem.description}`
                        : currentItem.projectName ||
                          currentItem.artist ||
                          "Image"
                    }
                    aria-describedby={hasInfo ? "modal-image-info" : undefined}
                    width={1920}
                    height={1080}
                    sizes="100vw"
                    className="max-w-full max-h-[calc(90vh-120px)] object-contain"
                    loading="eager"
                    priority
                    quality={90}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {hasInfo && (
              <motion.div
                id="modal-image-info"
                key={`info-${currentItem.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.1 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-lg p-4 max-w-2xl w-full mx-4"
              >
                {currentItem.description && (
                  <p className="text-white/90 text-sm md:text-base mb-2 text-center">
                    {currentItem.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm">
                  {currentItem.artist && (
                    <span className="text-red-500/90 font-semibold">
                      {currentItem.artist}
                    </span>
                  )}
                  {currentItem.projectName && (
                    <span className="text-white/70 font-medium">
                      {currentItem.projectName}
                    </span>
                  )}
                  {currentItem.date && (
                    <span className="text-white/50">{currentItem.date}</span>
                  )}
                </div>
                {items.length > 1 && (
                  <div className="text-white/50 text-xs text-center mt-2">
                    {currentIndex + 1} / {items.length}
                  </div>
                )}
              </motion.div>
            )}

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
      )}
    </AnimatePresence>
  );
}
