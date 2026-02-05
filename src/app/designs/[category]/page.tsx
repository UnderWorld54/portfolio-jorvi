"use client";

import { useParams } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import PageContainer from "@/components/ui/PageContainer";
import PageTitle from "@/components/ui/PageTitle";
import ClassicGrid from "@/components/ui/ClassicGrid";
import ErrorMessage from "@/components/ui/ErrorMessage";
import type { ImageCardData } from "@/components/ui/ImageCard";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import BackButton from "@/components/ui/BackButton";
import { useImageLoader } from "@/hooks/useImageLoader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslatedContent } from "@/hooks/useTranslatedContent";
import { useCachedFetch } from "@/hooks/useCachedFetch";

interface CategoryItem extends ImageCardData {
  youtubeUrl?: string;
  artist?: string;
  projectName?: string;
  description?: string;
}

const categoryApiRoutes: Record<string, string> = {
  logos: "/api/logos",
  prints: "/api/prints",
  videos: "/api/videos",
};

export default function CategoryPage() {
  const params = useParams();
  const category = params?.category as string;
  const { t } = useLanguage();

  const apiRoute = category && categoryApiRoutes[category] ? categoryApiRoutes[category] : "";

  // Utiliser le cache client pour réduire l'impact du cold start
  const {
    data: items,
    isLoading: isLoadingData,
    isStale,
    error,
    refetch
  } = useCachedFetch<CategoryItem[]>(apiRoute, {
    cacheTime: 60 * 60 * 1000,
    staleTime: 24 * 60 * 60 * 1000,
    enableCache: !!apiRoute,
  });

  const hasLoaded = !isLoadingData || isStale;

  const { isLoading: isLoadingImages } = useImageLoader({
    imageSelector: `.${category}-image`,
    timeout: 3000
  });

  // Traduire automatiquement le contenu
  const { translatedItems, isTranslating } = useTranslatedContent(items || []);

  const categoryTitles: Record<string, string> = {
    logos: t("page.logos"),
    prints: t("page.prints"),
    videos: t("page.videos"),
  };

  // Ne pas attendre le chargement des images s'il n'y a pas d'items
  const isLoading = (isLoadingData && !isStale) || isTranslating || ((items?.length ?? 0) > 0 && isLoadingImages);

  if (!category || !categoryTitles[category]) {
    return (
      <PageContainer isLoading={false}>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-500 mb-4" style={{ fontFamily: '"Great White Serif", serif' }}>
              {t("message.category.notFound")}
            </h1>
            <BackButton href="/designs" label={t("message.back.designs")} />
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <PageContainer isLoading={isLoading}>
        <BackButton href="/designs" />
        <PageTitle title={categoryTitles[category]} />
        {error && hasLoaded && (
          <ErrorMessage
            message={error}
            onRetry={refetch}
            showDetails={process.env.NODE_ENV === 'development'}
            type={`les ${category}`}
          />
        )}
        {!error && hasLoaded && (items?.length ?? 0) === 0 && (
          <div className="text-center py-16 md:py-24">
            <div className="max-w-md mx-auto">
              <p className="text-white/80 text-lg md:text-xl mb-2" style={{ fontFamily: '"Great White Serif", serif' }}>
                {t("message.noContent", { 
                  type: category === 'logos' ? t("content.type.logo") : category === 'prints' ? t("content.type.print") : t("content.type.video")
                })}
              </p>
              <p className="text-white/50 text-sm md:text-base">
                {t("message.noContent.soon")}
              </p>
            </div>
          </div>
        )}
        {!error && translatedItems.length > 0 && (
          <ClassicGrid
            items={translatedItems}
            imageClassName={`${category}-image`}
            showInfo={true}
            columns="3"
          />
        )}
      </PageContainer>
      <ScrollToTopButton />
    </>
  );
}

