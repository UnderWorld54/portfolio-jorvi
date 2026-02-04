"use client";

import { useEffect, useState, useCallback } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import PageContainer from "@/components/ui/PageContainer";
import PageTitle from "@/components/ui/PageTitle";
import MasonryGrid from "@/components/ui/MasonryGrid";
import ErrorMessage from "@/components/ui/ErrorMessage";
import type { ImageCardData } from "@/components/ui/ImageCard";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import { useImageLoader } from "@/hooks/useImageLoader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslatedContent } from "@/hooks/useTranslatedContent";

interface Photo extends ImageCardData {
  artist: string;
  projectName: string;
  date: string;
  description: string;
}

export default function PhotosPage() {
  const { t } = useLanguage();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoading: isLoadingImages } = useImageLoader({
    imageSelector: '.photo-image',
    timeout: 3000
  });

  // Traduire automatiquement le contenu des photos
  const { translatedItems: translatedPhotos, isTranslating } = useTranslatedContent(photos);

  // Ne pas attendre le chargement des images s'il n'y a pas de photos
  const isLoading = isLoadingData || isTranslating || (photos.length > 0 && isLoadingImages);

  const fetchPhotos = useCallback(async () => {
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
      setPhotos([]);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <PageContainer isLoading={isLoading}>
        <PageTitle title={t("page.photos")} />
        {error && (
          <ErrorMessage
            message={error}
            onRetry={fetchPhotos}
            showDetails={process.env.NODE_ENV === 'development'}
            type="les photos"
          />
        )}
        {!error && photos.length === 0 && !isLoadingData && (
          <div className="text-center py-16 md:py-24">
            <div className="max-w-md mx-auto">
              <p className="text-white/80 text-lg md:text-xl mb-2" style={{ fontFamily: '"Great White Serif", serif' }}>
                {t("message.noContent", { type: t("content.type.photo") })}
              </p>
              <p className="text-white/50 text-sm md:text-base">
                {t("message.noContent.soon")}
              </p>
            </div>
          </div>
        )}
        {translatedPhotos.length > 0 && (
          <MasonryGrid
            items={translatedPhotos}
            imageClassName="photo-image"
            showInfo={true}
          />
        )}
      </PageContainer>
      <ScrollToTopButton />
    </>
  );
}
