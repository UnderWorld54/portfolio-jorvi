"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";

interface Photo {
  id: string;
  image: string;
  artist: string;
  projectName: string;
  date: string;
  description: string;
}

const photos: Photo[] = [
  {
    id: "1",
    image: "/images/cover6.jpg",
    artist: "Artiste 1",
    projectName: "Projet Alpha",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "2",
    image: "/images/cover2.jpg",
    artist: "Artiste 2",
    projectName: "Projet Beta",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "3",
    image: "/images/cover3.jpg",
    artist: "Artiste 3",
    projectName: "Projet Gamma",
    date: "2023",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "4",
    image: "/images/cover1.jpg",
    artist: "Artiste 4",
    projectName: "Projet Delta",
    date: "2023",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "5",
    image: "/images/cover5.jpg",
    artist: "Artiste 5",
    projectName: "Projet Epsilon",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "6",
    image: "/images/cover6.jpg",
    artist: "Artiste 6",
    projectName: "Projet Zeta",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "7",
    image: "/images/cover1.jpg",
    artist: "Artiste 1",
    projectName: "Projet Alpha",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "8",
    image: "/images/cover3.jpg",
    artist: "Artiste 2",
    projectName: "Projet Beta",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "9",
    image: "/images/cover2.jpg",
    artist: "Artiste 2",
    projectName: "Projet Gamma",
    date: "2023",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "10",
    image: "/images/cover4.jpg",
    artist: "Artiste 4",
    projectName: "Projet Delta",
    date: "2023",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "11",
    image: "/images/cover6.jpg",
    artist: "Artiste 5",
    projectName: "Projet Epsilon",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "12",
    image: "/images/cover4.jpg",
    artist: "Artiste 6",
    projectName: "Projet Zeta",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
];

export default function PhotosPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { scrollY } = useScroll();
  const imagesLoadedRef = useRef<Set<string>>(new Set());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsVisible(latest > 300);
  });

  useEffect(() => {
    // Réinitialiser le compteur
    imagesLoadedRef.current.clear();
    setIsLoading(true);

    // Nettoyer le timeout précédent
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const checkAllImagesLoaded = () => {
      // Vérifier toutes les images de photos
      const coverImages = document.querySelectorAll('.photo-image');
      
      if (coverImages.length === 0) {
        // Si pas encore d'images dans le DOM, attendre un peu
        timeoutRef.current = setTimeout(checkAllImagesLoaded, 100);
        return;
      }

      let loadedCount = 0;
      const totalCount = coverImages.length;

      coverImages.forEach((img) => {
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
      coverImages.forEach((img) => {
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

      // Timeout de sécurité (max 3 secondes)
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    };

    // Démarrer la vérification après un court délai
    timeoutRef.current = setTimeout(checkAllImagesLoaded, 200);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <motion.div 
        className="min-h-screen bg-black pt-20 sm:pt-24 md:pt-28 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12">
        {/* Header */}
        <motion.div
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-4">
            <Image
              src="/logo/star.svg"
              alt="Star"
              width={24}
              height={24}
              className="w-5 h-5 sm:w-6 sm:h-6 hidden sm:block"
              style={{ 
                filter: "brightness(0) invert(1) drop-shadow(0 0 4px rgba(255, 255, 255, 0.6))",
              }}
            />
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-red-500 text-center tracking-tight uppercase"
              style={{ 
                fontFamily: '"Great White Serif", serif',
                textShadow: "0 0 10px rgba(239, 68, 68, 0.5), 0 0 20px rgba(239, 68, 68, 0.3)"
              }}
            >
              PHOTOS
            </h1>
            <Image
              src="/logo/star.svg"
              alt="Star"
              width={24}
              height={24}
              className="w-5 h-5 sm:w-6 sm:h-6 hidden sm:block"
              style={{ 
                filter: "brightness(0) invert(1) drop-shadow(0 0 4px rgba(255, 255, 255, 0.6))",
              }}
            />
          </div>
        </motion.div>

        {/* Grille Masonry de type Pinterest */}
        <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 md:gap-6">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="break-inside-avoid mb-3 sm:mb-4 md:mb-6 group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg bg-gray-900 border border-red-500/20 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
                {/* Image - conserve les dimensions d'origine pour effet mur de brique */}
                <div className="relative w-full overflow-hidden">
                  <Image
                    src={photo.image}
                    alt={photo.projectName}
                    width={800}
                    height={1200}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="photo-image w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>

                {/* Informations */}

              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bouton Scroll to Top flottant */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-red-500/90 hover:bg-red-500 text-white shadow-lg hover:shadow-red-500/50 transition-all duration-300 backdrop-blur-sm border border-red-500/30"
        style={{
          boxShadow: "0 4px 20px rgba(239, 68, 68, 0.4), 0 0 30px rgba(239, 68, 68, 0.2)",
        }}
        aria-label="Retour en haut"
      >
        <ArrowUp size={24} />
      </motion.button>
      </motion.div>
    </>
  );
}

