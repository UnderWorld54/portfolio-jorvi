"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";
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

  const openModal = useCallback((item: ImageCardData, allItems: ImageCardData[], index: number) => {
    setCurrentItem(item);
    setItems(allItems);
    setCurrentIndex(index);
    setIsOpen(true);
    // Empêcher le scroll du body quand la modal est ouverte
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setCurrentItem(null);
    setItems([]);
    setCurrentIndex(0);
    // Réactiver le scroll du body
    document.body.style.overflow = "unset";
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex < items.length - 1) {
        const nextIndex = prevIndex + 1;
        setCurrentItem(items[nextIndex]);
        return nextIndex;
      }
      return prevIndex;
    });
  }, [items]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex > 0) {
        const previousIndex = prevIndex - 1;
        setCurrentItem(items[previousIndex]);
        return previousIndex;
      }
      return prevIndex;
    });
  }, [items]);

  // Memoize la valeur du context pour éviter les re-renders inutiles
  const contextValue = useMemo(
    () => ({
      isOpen,
      currentItem,
      items,
      currentIndex,
      openModal,
      closeModal,
      goToNext,
      goToPrevious,
    }),
    [isOpen, currentItem, items, currentIndex, openModal, closeModal, goToNext, goToPrevious]
  );

  return (
    <ModalContext.Provider value={contextValue}>
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

