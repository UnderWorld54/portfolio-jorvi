"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import LoadingScreen from "./LoadingScreen";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const checkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Détecter si c'est un appareil mobile/tactile une seule fois au montage
  useEffect(() => {
    const checkTouchDevice = () => {
      return (
        typeof window !== 'undefined' && (
          'ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          (navigator as any).msMaxTouchPoints > 0
        )
      );
    };
    setIsTouchDevice(checkTouchDevice());
  }, []);

  useEffect(() => {
    // Sur mobile, désactiver complètement le loading screen pour éviter les problèmes
    if (isTouchDevice) {
      setIsLoading(false);
      return;
    }
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

    // Fonction pour vérifier si une image est dans le viewport ou proche
    const isImageInViewport = (img: HTMLImageElement): boolean => {
      const rect = img.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;
      
      // Vérifier si l'image est dans le viewport ou proche (avec une marge de 200px)
      return (
        rect.top < windowHeight + 200 &&
        rect.bottom > -200 &&
        rect.left < windowWidth + 200 &&
        rect.right > -200
      );
    };

    // Vérifier rapidement si le contenu est déjà prêt
    const quickCheck = () => {
      const images = document.querySelectorAll("img");
      let needsLoading = false;
      let allLoaded = true;

      // Vérifier si des images sont en cours de chargement (seulement celles dans le viewport)
      images.forEach((img) => {
        const imageElement = img as HTMLImageElement;
        const isLazy = imageElement.loading === "lazy";
        
        // Si l'image n'est pas complètement chargée et qu'elle a une source
        if (imageElement.src && !imageElement.complete) {
          // Si l'image est lazy, vérifier si elle est dans le viewport
          if (isLazy && !isImageInViewport(imageElement)) {
            // Ignorer les images lazy hors viewport
            return;
          }
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
        let totalImages = 0;
        const loadedImages = new Set<HTMLImageElement>();
        let pendingImages = 0;

        // Compter uniquement les images qui sont vraiment en cours de chargement et dans le viewport
        images.forEach((img) => {
          const imageElement = img as HTMLImageElement;
          const isLazy = imageElement.loading === "lazy";
          
          if (imageElement.src) {
            // Ignorer les images lazy qui ne sont pas dans le viewport
            if (isLazy && !isImageInViewport(imageElement)) {
              return;
            }
            
            totalImages++;
            if (imageElement.complete && imageElement.naturalHeight !== 0) {
              loadedCount++;
              loadedImages.add(imageElement);
            } else if (!imageElement.complete) {
              pendingImages++;
            }
          }
        });

        // Si pas d'images pertinentes ou toutes déjà chargées, masquer le loading immédiatement
        if (totalImages === 0 || (loadedCount === totalImages && pendingImages === 0)) {
          setIsLoading(false);
          return;
        }

        const handleImageLoad = (img: HTMLImageElement) => {
          if (!loadedImages.has(img)) {
            loadedImages.add(img);
            loadedCount++;
            
            if (loadedCount >= totalImages) {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
              timeoutRef.current = setTimeout(() => {
                setIsLoading(false);
              }, 200);
            }
          }
        };

        // Écouter les images en cours de chargement (seulement celles dans le viewport)
        images.forEach((img) => {
          const imageElement = img as HTMLImageElement;
          const isLazy = imageElement.loading === "lazy";
          
          if (imageElement.src && !imageElement.complete) {
            // Ignorer les images lazy hors viewport
            if (isLazy && !isImageInViewport(imageElement)) {
              return;
            }
            
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
                  const isLazy = imageElement.loading === "lazy";
                  
                  if (imageElement.src) {
                    // Ignorer les images lazy hors viewport
                    if (isLazy && !isImageInViewport(imageElement)) {
                      return;
                    }
                    
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

        // Timeout de sécurité réduit (max 1 seconde) pour éviter que le loading reste bloqué
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setIsLoading(false);
        }, 1000);
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
  }, [pathname, isTouchDevice]);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{
          willChange: "opacity",
        }}
      >
        {children}
      </motion.div>
    </>
  );
}

