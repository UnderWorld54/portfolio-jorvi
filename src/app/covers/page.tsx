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

interface Cover extends ImageCardData {
  images?: string[];
  artist?: string;
  projectName?: string;
  date?: string;
  description?: string;
}

export default function CoversPage() {
  const { t } = useLanguage();

  // Utiliser le cache client pour réduire l'impact du cold start
  const {
    data: covers,
    isLoading: isLoadingData,
    isStale,
    error,
    refetch
  } = useCachedFetch<Cover[]>('/api/covers', {
    cacheTime: 60 * 60 * 1000,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const hasLoaded = !isLoadingData || isStale;

  const { isLoading: isLoadingImages } = useImageLoader({
    imageSelector: '.cover-image',
    timeout: 3000
  });

  // Traduire automatiquement le contenu des covers
  const { translatedItems: translatedCovers, isTranslating } = useTranslatedContent(covers || []);

  // Ne pas attendre le chargement des images s'il n'y a pas de covers
  const isLoading = (isLoadingData && !isStale) || isTranslating || ((covers?.length ?? 0) > 0 && isLoadingImages);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <PageContainer isLoading={isLoading}>
        <PageTitle title={t("page.covers")} />
        {error && hasLoaded && (
          <ErrorMessage
            message={error}
            onRetry={refetch}
            showDetails={process.env.NODE_ENV === 'development'}
            type="les covers"
          />
        )}
        {!error && hasLoaded && (covers?.length ?? 0) === 0 && (
          <div className="text-center py-16 md:py-24">
            <div className="max-w-md mx-auto">
              <p className="text-white/80 text-lg md:text-xl mb-2" style={{ fontFamily: '"Great White Serif", serif' }}>
                {t("message.noContent", { type: t("content.type.cover") })}
              </p>
              <p className="text-white/50 text-sm md:text-base">
                {t("message.noContent.soon")}
              </p>
            </div>
          </div>
        )}
        {!error && translatedCovers.length > 0 && (
          <MasonryGrid
            items={translatedCovers}
            imageClassName="cover-image"
            showInfo={true}
          />
        )}
      </PageContainer>
      <ScrollToTopButton />
    </>
  );
}

