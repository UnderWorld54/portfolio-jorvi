"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import PageContainer from "@/components/ui/PageContainer";
import PageTitle from "@/components/ui/PageTitle";
import MasonryGrid from "@/components/ui/MasonryGrid";
import type { ImageCardData } from "@/components/ui/ImageCard";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import { useImageLoader } from "@/hooks/useImageLoader";
import { useLanguage } from "@/contexts/LanguageContext";

interface Cover extends ImageCardData {
  artist?: string;
  projectName?: string;
  date?: string;
  description?: string;
}

export default function CoversPage() {
  const { t } = useLanguage();
  const [covers, setCovers] = useState<Cover[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { isLoading: isLoadingImages } = useImageLoader({ 
    imageSelector: '.cover-image',
    timeout: 5000 
  });

  // Ne pas attendre le chargement des images s'il n'y a pas de covers
  const isLoading = isLoadingData || (covers.length > 0 && isLoadingImages);

  useEffect(() => {
    async function fetchCovers() {
      try {
        setIsLoadingData(true);
        setError(null);
        setHasLoaded(false);
        
        const response = await fetch('/api/covers');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch covers: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Vérifier que la réponse est bien un tableau
        if (Array.isArray(data)) {
          console.log('[covers] Données reçues:', data.length, 'éléments');
          if (data.length > 0) {
            console.log('[covers] Premier élément:', data[0]);
          }
          setCovers(data);
          setHasLoaded(true);
        } else {
          console.error('[covers] Format de réponse invalide:', data);
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching covers:', err);
        setError(err instanceof Error ? err.message : 'Failed to load covers');
        setCovers([]);
        setHasLoaded(true);
      } finally {
        setIsLoadingData(false);
      }
    }

    fetchCovers();
  }, []);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <PageContainer isLoading={isLoading}>
        <PageTitle title={t("page.covers")} />
        {error && hasLoaded && (
          <div className="text-red-500 text-center py-8">
            <p>{t("message.error.loading", { type: t("content.type.cover") })}: {error}</p>
            <p className="text-sm text-white/60 mt-2">
              {t("message.error.config")}
            </p>
          </div>
        )}
        {!error && hasLoaded && covers.length === 0 && (
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
        {!error && covers.length > 0 && (
          <MasonryGrid 
            items={covers} 
            imageClassName="cover-image"
            showInfo={true}
          />
        )}
      </PageContainer>
      <ScrollToTopButton />
    </>
  );
}

