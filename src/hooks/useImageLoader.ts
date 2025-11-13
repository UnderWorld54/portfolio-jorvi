"use client";

import { useState, useEffect, useRef } from "react";

interface UseImageLoaderOptions {
  imageSelector: string;
  timeout?: number;
}

export function useImageLoader({ imageSelector, timeout = 3000 }: UseImageLoaderOptions) {
  const [isLoading, setIsLoading] = useState(true);
  const imagesLoadedRef = useRef<Set<string>>(new Set());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Réinitialiser le compteur
    imagesLoadedRef.current.clear();
    setIsLoading(true);

    // Nettoyer le timeout précédent
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const checkAllImagesLoaded = () => {
      // Vérifier toutes les images
      const images = document.querySelectorAll(imageSelector);
      
      if (images.length === 0) {
        // Si pas encore d'images dans le DOM, attendre un peu
        timeoutRef.current = setTimeout(checkAllImagesLoaded, 100);
        return;
      }

      let loadedCount = 0;
      const totalCount = images.length;

      images.forEach((img) => {
        const imageElement = img as HTMLImageElement;
        if (imageElement.complete && imageElement.naturalHeight !== 0) {
          loadedCount++;
        } else if (imageElement.complete && imageElement.naturalHeight === 0) {
          // Image en erreur, compter comme chargée
          loadedCount++;
        }
      });

      // Si toutes les images sont chargées
      if (loadedCount >= totalCount && totalCount > 0) {
        timeoutRef.current = setTimeout(() => {
          setIsLoading(false);
        }, 300);
        return;
      }

      // Écouter les événements de chargement
      images.forEach((img) => {
        const imageElement = img as HTMLImageElement;
        if (!imageElement.complete) {
          const handleLoad = () => {
            imagesLoadedRef.current.add(imageElement.src);
            checkAllImagesLoaded();
          };
          
          imageElement.addEventListener("load", handleLoad, { once: true });
          imageElement.addEventListener("error", handleLoad, { once: true });
        }
      });

      // Timeout de sécurité
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, timeout);
    };

    // Démarrer la vérification après un court délai
    timeoutRef.current = setTimeout(checkAllImagesLoaded, 200);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [imageSelector, timeout]);

  return { isLoading };
}

