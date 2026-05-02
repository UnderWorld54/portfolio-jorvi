import { notFound } from "next/navigation";
import {
  getTransformedLogos,
  getTransformedPrints,
  getTransformedVideos,
} from "@/lib/strapi";
import GalleryContent from "@/components/gallery/GalleryContent";

export const revalidate = 3600;

const categories = {
  logos: {
    fetcher: getTransformedLogos,
    titleKey: "page.logos",
    contentTypeKey: "content.type.logo",
  },
  prints: {
    fetcher: getTransformedPrints,
    titleKey: "page.prints",
    contentTypeKey: "content.type.print",
  },
  videos: {
    fetcher: getTransformedVideos,
    titleKey: "page.videos",
    contentTypeKey: "content.type.video",
  },
} as const;

type Category = keyof typeof categories;

export function generateStaticParams() {
  return Object.keys(categories).map((category) => ({ category }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!(category in categories)) {
    notFound();
  }

  const config = categories[category as Category];
  let items: Awaited<ReturnType<typeof config.fetcher>> = [];
  let error: string | null = null;

  try {
    items = await config.fetcher();
  } catch (e) {
    error = e instanceof Error ? e.message : `Failed to fetch ${category}`;
  }

  const grid = category === "prints" ? "masonry" : "classic";

  return (
    <GalleryContent
      items={items}
      titleKey={config.titleKey}
      contentTypeKey={config.contentTypeKey}
      grid={grid}
      columns="3"
      imageClassName={`${category}-image`}
      backHref="/designs"
      error={error}
    />
  );
}
