"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import PageContainer from "@/components/ui/PageContainer";
import PageTitle from "@/components/ui/PageTitle";
import MasonryGrid from "@/components/ui/MasonryGrid";
import type { ImageCardData } from "@/components/ui/ImageCard";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import BackButton from "@/components/ui/BackButton";
import { useImageLoader } from "@/hooks/useImageLoader";

interface CategoryItem extends ImageCardData {
  youtubeUrl?: string;
}

const categoryTitles: Record<string, string> = {
  logos: "LOGOS",
  prints: "PRINTS",
  videos: "VIDÉOS",
};

const categoryApiRoutes: Record<string, string> = {
  logos: "/api/logos",
  prints: "/api/prints",
  videos: "/api/videos",
};

export default function CategoryPage() {
  const params = useParams();
  const category = params?.category as string;
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { isLoading: isLoadingImages } = useImageLoader({ 
    imageSelector: `.${category}-image`,
    timeout: 5000 
  });

  // Ne pas attendre le chargement des images s'il n'y a pas d'items
  const isLoading = isLoadingData || (items.length > 0 && isLoadingImages);

  useEffect(() => {
    async function fetchCategoryData() {
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
    }

    fetchCategoryData();
  }, [category]);

  if (!category || !categoryTitles[category]) {
    return (
      <PageContainer isLoading={false}>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-500 mb-4" style={{ fontFamily: '"Great White Serif", serif' }}>
              Catégorie non trouvée
            </h1>
            <BackButton href="/designs" label="Retour aux designs" />
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
          <div className="text-red-500 text-center py-8">
            <p>Erreur lors du chargement des {category}: {error}</p>
            <p className="text-sm text-white/60 mt-2">
              Vérifiez votre configuration Strapi dans les variables d&apos;environnement.
            </p>
          </div>
        )}
        {!error && hasLoaded && items.length === 0 && (
          <div className="text-center py-16 md:py-24">
            <div className="max-w-md mx-auto">
              <p className="text-white/80 text-lg md:text-xl mb-2" style={{ fontFamily: '"Great White Serif", serif' }}>
                Aucun {category === 'logos' ? 'logo' : category === 'prints' ? 'print' : 'vidéo'} disponible
              </p>
              <p className="text-white/50 text-sm md:text-base">
                Le contenu sera bientôt disponible.
              </p>
            </div>
          </div>
        )}
        {!error && items.length > 0 && (
          <MasonryGrid 
            items={items} 
            imageClassName={`${category}-image`}
            showInfo={true}
          />
        )}
      </PageContainer>
      <ScrollToTopButton />
    </>
  );
}

