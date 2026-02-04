"use client";

import { useEffect, useState, useCallback } from "react";
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
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { isLoading: isLoadingImages } = useImageLoader({
    imageSelector: `.${category}-image`,
    timeout: 3000
  });

  // Traduire automatiquement le contenu
  const { translatedItems, isTranslating } = useTranslatedContent(items);

  const categoryTitles: Record<string, string> = {
    logos: t("page.logos"),
    prints: t("page.prints"),
    videos: t("page.videos"),
  };

  // Ne pas attendre le chargement des images s'il n'y a pas d'items
  const isLoading = isLoadingData || isTranslating || (items.length > 0 && isLoadingImages);

  const fetchCategoryData = useCallback(async () => {
    if (!category || !categoryApiRoutes[category]) {
      return;
    }

    try {
      setIsLoadingData(true);
      setError(null);
      setHasLoaded(false);

      const apiRoute = categoryApiRoutes[category];
      const response = await fetch(apiRoute);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${category}: ${response.statusText}`);
      }

      const data = await response.json();

      // Vérifier que la réponse est bien un tableau
      if (Array.isArray(data)) {
        console.log(`[${category}] Données reçues:`, data.length, 'éléments');
        if (data.length > 0) {
          console.log(`[${category}] Premier élément:`, data[0]);
        }
        setItems(data);
        setHasLoaded(true);
      } else {
        // Si la réponse n'est pas un tableau, considérer comme erreur
        console.error(`[${category}] Format de réponse invalide:`, data);
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error(`Error fetching ${category}:`, err);
      setError(err instanceof Error ? err.message : `Failed to load ${category}`);
      setItems([]);
      setHasLoaded(true);
    } finally {
      setIsLoadingData(false);
    }
  }, [category]);

  useEffect(() => {
    fetchCategoryData();
  }, [fetchCategoryData]);

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
            onRetry={fetchCategoryData}
            showDetails={process.env.NODE_ENV === 'development'}
            type={`les ${category}`}
          />
        )}
        {!error && hasLoaded && items.length === 0 && (
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

