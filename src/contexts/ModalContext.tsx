"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { ImageCardData } from "@/components/ui/ImageCard";

interface ModalContextType {
  isOpen: boolean;
  currentItem: ImageCardData | null;
  items: ImageCardData[];
  currentIndex: number;
  openModal: (item: ImageCardData, items: ImageCardData[], index: number) => void;
  closeModal: () => void;
  goToNext: () => void;
  goToPrevious: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<ImageCardData | null>(null);
  const [items, setItems] = useState<ImageCardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (item: ImageCardData, allItems: ImageCardData[], index: number) => {
    setCurrentItem(item);
    setItems(allItems);
    setCurrentIndex(index);
    setIsOpen(true);
    // Empêcher le scroll du body quand la modal est ouverte
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentItem(null);
    setItems([]);
    setCurrentIndex(0);
    // Réactiver le scroll du body
    document.body.style.overflow = "unset";
  };

  const goToNext = () => {
    if (currentIndex < items.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentItem(items[nextIndex]);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentItem(items[prevIndex]);
    }
  };

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        currentItem,
        items,
        currentIndex,
        openModal,
        closeModal,
        goToNext,
        goToPrevious,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}

