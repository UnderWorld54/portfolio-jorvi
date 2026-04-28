"use client";

import LoadingScreen from "@/components/LoadingScreen";
import PageContainer from "@/components/ui/PageContainer";
import PageTitle from "@/components/ui/PageTitle";
import MasonryGrid from "@/components/ui/MasonryGrid";
import ClassicGrid from "@/components/ui/ClassicGrid";
import ErrorMessage from "@/components/ui/ErrorMessage";
import BackButton from "@/components/ui/BackButton";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import type { ImageCardData } from "@/components/ui/ImageCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslatedContent } from "@/hooks/useTranslatedContent";
import { useRouter } from "next/navigation";

interface GalleryContentProps {
  items: ImageCardData[];
  titleKey: string;
  contentTypeKey: string;
  grid?: "masonry" | "classic";
  columns?: "2" | "3" | "4";
  imageClassName?: string;
  backHref?: string;
  error?: string | null;
}

export default function GalleryContent({
  items,
  titleKey,
  contentTypeKey,
  grid = "masonry",
  columns,
  imageClassName = "gallery-image",
  backHref,
  error,
}: GalleryContentProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const { translatedItems, isTranslating } = useTranslatedContent(items);

  const displayItems = translatedItems.length > 0 ? translatedItems : items;
  const Grid = grid === "masonry" ? MasonryGrid : ClassicGrid;
  const gridColumns = columns ?? (grid === "masonry" ? "4" : "3");

  return (
    <>
      <LoadingScreen isLoading={isTranslating} />
      <PageContainer isLoading={isTranslating}>
        {backHref && <BackButton href={backHref} />}
        <PageTitle title={t(titleKey)} />

        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => router.refresh()}
            type={t(contentTypeKey)}
          />
        )}

        {!error && items.length === 0 && (
          <div className="text-center py-16 md:py-24">
            <div className="max-w-md mx-auto">
              <p
                className="text-white/80 text-lg md:text-xl mb-2"
                style={{ fontFamily: '"Great White Serif", serif' }}
              >
                {t("message.noContent", { type: t(contentTypeKey) })}
              </p>
              <p className="text-white/50 text-sm md:text-base">
                {t("message.noContent.soon")}
              </p>
            </div>
          </div>
        )}

        {!error && displayItems.length > 0 && (
          <Grid
            items={displayItems}
            imageClassName={imageClassName}
            showInfo={true}
            columns={gridColumns}
          />
        )}
      </PageContainer>
      <ScrollToTopButton />
    </>
  );
}
