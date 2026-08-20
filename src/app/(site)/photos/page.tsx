import { getPhotos } from "@/lib/sanity";
import GalleryContent from "@/components/gallery/GalleryContent";

export const revalidate = 3600;

export default async function PhotosPage() {
  let items: Awaited<ReturnType<typeof getPhotos>> = [];
  let error: string | null = null;

  try {
    items = await getPhotos();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to fetch photos";
  }

  return (
    <GalleryContent
      items={items}
      titleKey="page.photos"
      contentTypeKey="content.type.photo"
      grid="masonry"
      imageClassName="photo-image"
      error={error}
    />
  );
}
