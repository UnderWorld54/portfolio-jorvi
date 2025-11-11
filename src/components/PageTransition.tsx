"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import LoadingScreen from "./LoadingScreen";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const checkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Nettoyer les timeouts précédents
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }

    // Vérifier rapidement si le contenu est déjà prêt
    const quickCheck = () => {
      const images = document.querySelectorAll("img");
      let needsLoading = false;
      let allLoaded = true;

      // Vérifier si des images sont en cours de chargement
      images.forEach((img) => {
        const imageElement = img as HTMLImageElement;
        // Si l'image n'est pas complètement chargée et qu'elle a une source
        if (imageElement.src && !imageElement.complete) {
          needsLoading = true;
          allLoaded = false;
        } else if (imageElement.src && imageElement.complete && imageElement.naturalHeight === 0) {
          // Image avec erreur de chargement
          allLoaded = false;
        }
      });

      // Si toutes les images sont déjà chargées, ne pas afficher le loading
      if (images.length > 0 && allLoaded && !needsLoading) {
        setIsLoading(false);
        return false; // Pas besoin de vérifier plus
      }

      // Si des images sont en cours de chargement, afficher le loading
      if (needsLoading) {
        setIsLoading(true);
        return true; // Continuer à vérifier
      }

      // Si pas d'images ou images déjà chargées, ne pas afficher le loading
      setIsLoading(false);
      return false;
    };

    // Vérification initiale rapide (après un court délai pour laisser le DOM se mettre à jour)
    checkTimeoutRef.current = setTimeout(() => {
      const needsMonitoring = quickCheck();
      
      if (!needsMonitoring) {
        return; // Tout est déjà prêt, pas besoin de monitoring
      }

      // Si on a besoin de monitoring, continuer avec la vérification complète
      const checkImagesLoaded = () => {
        const images = document.querySelectorAll("img");
        let loadedCount = 0;
        let totalImages = images.length;
        const loadedImages = new Set<HTMLImageElement>();
        let pendingImages = 0;

        // Compter les images qui sont vraiment en cours de chargement
        images.forEach((img) => {
          const imageElement = img as HTMLImageElement;
          if (imageElement.src) {
            if (imageElement.complete && imageElement.naturalHeight !== 0) {
              loadedCount++;
              loadedImages.add(imageElement);
            } else if (!imageElement.complete) {
              pendingImages++;
            }
          }
        });

        // Si pas d'images ou toutes déjà chargées, masquer le loading immédiatement
        if (totalImages === 0 || (loadedCount === totalImages && pendingImages === 0)) {
          setIsLoading(false);
          return;
        }

        const handleImageLoad = (img: HTMLImageElement) => {
          if (!loadedImages.has(img)) {
            loadedImages.add(img);
            loadedCount++;
            
            if (loadedCount >= totalImages) {
              timeoutRef.current = setTimeout(() => {
                setIsLoading(false);
              }, 200);
            }
          }
        };

        // Écouter les images en cours de chargement
        images.forEach((img) => {
          const imageElement = img as HTMLImageElement;
          if (imageElement.src && !imageElement.complete) {
            imageElement.addEventListener("load", () => handleImageLoad(imageElement), { once: true });
            imageElement.addEventListener("error", () => handleImageLoad(imageElement), { once: true });
          }
        });

        // Observer les nouvelles images ajoutées au DOM
        observerRef.current = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as HTMLElement;
                const newImages = element.querySelectorAll("img");
                newImages.forEach((img) => {
                  const imageElement = img as HTMLImageElement;
                  if (imageElement.src) {
                    totalImages++;
                    if (imageElement.complete && imageElement.naturalHeight !== 0) {
                      handleImageLoad(imageElement);
                    } else if (!imageElement.complete) {
                      setIsLoading(true);
                      imageElement.addEventListener("load", () => handleImageLoad(imageElement), { once: true });
                      imageElement.addEventListener("error", () => handleImageLoad(imageElement), { once: true });
                    }
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

        // Timeout de sécurité réduit (max 1.5 secondes)
        timeoutRef.current = setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      };

      checkImagesLoaded();
    }, 100);

    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
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

