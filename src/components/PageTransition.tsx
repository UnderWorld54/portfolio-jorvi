"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import LoadingScreen from "./LoadingScreen";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    // Démarrer le chargement lors du changement de route
    setIsLoading(true);

    // Nettoyer les timeouts précédents
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Attendre que toutes les images soient chargées
    const checkImagesLoaded = () => {
      const images = document.querySelectorAll("img");
      let loadedCount = 0;
      let totalImages = images.length;
      const loadedImages = new Set<HTMLImageElement>();

      // Si pas d'images, masquer le loading après un court délai
      if (totalImages === 0) {
        timeoutRef.current = setTimeout(() => {
          setIsLoading(false);
        }, 400);
        return;
      }

      const handleImageLoad = (img: HTMLImageElement) => {
        if (!loadedImages.has(img)) {
          loadedImages.add(img);
          loadedCount++;
          
          if (loadedCount >= totalImages) {
            timeoutRef.current = setTimeout(() => {
              setIsLoading(false);
            }, 300);
          }
        }
      };

      // Vérifier les images existantes
      images.forEach((img) => {
        const imageElement = img as HTMLImageElement;
        if (imageElement.complete && imageElement.naturalHeight !== 0) {
          handleImageLoad(imageElement);
        } else {
          imageElement.addEventListener("load", () => handleImageLoad(imageElement), { once: true });
          imageElement.addEventListener("error", () => handleImageLoad(imageElement), { once: true });
        }
      });

      // Observer les nouvelles images ajoutées au DOM (pour Next.js Image lazy loading)
      observerRef.current = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              const newImages = element.querySelectorAll("img");
              newImages.forEach((img) => {
                const imageElement = img as HTMLImageElement;
                totalImages++;
                if (imageElement.complete && imageElement.naturalHeight !== 0) {
                  handleImageLoad(imageElement);
                } else {
                  imageElement.addEventListener("load", () => handleImageLoad(imageElement), { once: true });
                  imageElement.addEventListener("error", () => handleImageLoad(imageElement), { once: true });
                }
              });
            }
          });
        });
      });

      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Timeout de sécurité (max 2.5 secondes)
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, 2500);
    };

    // Délai pour laisser le DOM se mettre à jour
    const timer = setTimeout(() => {
      checkImagesLoaded();
    }, 150);

    return () => {
      clearTimeout(timer);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [pathname]);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <div style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.3s ease-in-out" }}>
        {children}
      </div>
    </>
  );
}

