"use client";

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
import { useCachedFetch } from "@/hooks/useCachedFetch";

interface Photo extends ImageCardData {
  artist: string;
  projectName: string;
  date: string;
  description: string;
}

export default function PhotosPage() {
  const { t } = useLanguage();

  // Utiliser le cache client pour réduire l'impact du cold start
  const {
    data: photos,
    isLoading: isLoadingData,
    isStale,
    error,
    refetch
  } = useCachedFetch<Photo[]>('/api/photos', {
    cacheTime: 60 * 60 * 1000, // 1 heure de cache "frais"
    staleTime: 24 * 60 * 60 * 1000, // 24h de cache "stale" acceptable
  });

  const { isLoading: isLoadingImages } = useImageLoader({
    imageSelector: '.photo-image',
    timeout: 3000
  });

  // Traduire automatiquement le contenu des photos
  const { translatedItems: translatedPhotos, isTranslating } = useTranslatedContent(photos || []);

  // Ne pas attendre le chargement des images s'il n'y a pas de photos
  // Si on a des données stale, ne pas montrer le loading
  const isLoading = (isLoadingData && !isStale) || isTranslating || ((photos?.length ?? 0) > 0 && isLoadingImages);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <PageContainer isLoading={isLoading}>
        <PageTitle title={t("page.photos")} />
        {error && (
          <ErrorMessage
            message={error}
            onRetry={refetch}
            showDetails={process.env.NODE_ENV === 'development'}
            type="les photos"
          />
        )}
        {!error && (photos?.length ?? 0) === 0 && !isLoadingData && (
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
