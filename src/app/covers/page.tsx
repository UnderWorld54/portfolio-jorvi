import { getTransformedCovers } from "@/lib/strapi";
import GalleryContent from "@/components/gallery/GalleryContent";

export const revalidate = 3600;

export default async function CoversPage() {
  let items: Awaited<ReturnType<typeof getTransformedCovers>> = [];
  let error: string | null = null;

  try {
    items = await getTransformedCovers();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to fetch covers";
  }

  return (
    <GalleryContent
      items={items}
      titleKey="page.covers"
      contentTypeKey="content.type.cover"
      grid="masonry"
      imageClassName="cover-image"
      error={error}
    />
  );
}
