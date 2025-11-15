"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import PageContainer from "@/components/ui/PageContainer";
import PageTitle from "@/components/ui/PageTitle";
import MasonryGrid from "@/components/ui/MasonryGrid";
import type { ImageCardData } from "@/components/ui/ImageCard";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import { useImageLoader } from "@/hooks/useImageLoader";

interface Photo extends ImageCardData {
  artist: string;
  projectName: string;
  date: string;
  description: string;
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoading: isLoadingImages } = useImageLoader({ 
    imageSelector: '.photo-image',
    timeout: 5000 
  });

  // Ne pas attendre le chargement des images s'il n'y a pas de photos
  const isLoading = isLoadingData || (photos.length > 0 && isLoadingImages);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        setIsLoadingData(true);
        setError(null);
        
        const response = await fetch('/api/photos');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch photos: ${response.statusText}`);
        }
        
        const data = await response.json();
        setPhotos(data);
      } catch (err) {
        console.error('Error fetching photos:', err);
        setError(err instanceof Error ? err.message : 'Failed to load photos');
        // En cas d'erreur, on peut garder un tableau vide ou afficher un message
        setPhotos([]);
      } finally {
        setIsLoadingData(false);
      }
    }

    fetchPhotos();
  }, []);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <PageContainer isLoading={isLoading}>
        <PageTitle title="PHOTOS" />
        {error && (
          <div className="text-red-500 text-center py-8">
            <p>Erreur lors du chargement des photos: {error}</p>
            <p className="text-sm text-white/60 mt-2">
              Vérifiez votre configuration Strapi dans les variables d&apos;environnement.
            </p>
          </div>
        )}
        {!error && photos.length === 0 && !isLoadingData && (
          <div className="text-center py-16 md:py-24">
            <div className="max-w-md mx-auto">
              <p className="text-white/80 text-lg md:text-xl mb-2" style={{ fontFamily: '"Great White Serif", serif' }}>
                Aucune photo disponible
              </p>
              <p className="text-white/50 text-sm md:text-base">
                Le contenu sera bientôt disponible.
              </p>
            </div>
          </div>
        )}
        {photos.length > 0 && (
          <MasonryGrid 
            items={photos} 
            imageClassName="photo-image"
            showInfo={true}
          />
        )}
      </PageContainer>
      <ScrollToTopButton />
    </>
  );
}
