import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../../sanity/env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

export interface GalleryItem {
  id: string;
  image: string;
  images?: string[];
  artist?: string;
  projectName?: string;
  date?: string;
  description?: string;
  youtubeUrl?: string;
}

const BASE_FIELDS = `
  "id": _id,
  artist,
  projectName,
  date,
  description
`;

const MULTI_IMAGE_QUERY = (type: string) => `
  *[_type == "${type}" && count(images[defined(asset)]) > 0]
    | order(publishedAt desc) {
      ${BASE_FIELDS},
      "images": images[defined(asset)].asset->url
    }
`;

const SINGLE_IMAGE_QUERY = `
  *[_type == "photo" && defined(image.asset)]
    | order(publishedAt desc) {
      ${BASE_FIELDS},
      "image": image.asset->url
    }
`;

const VIDEO_QUERY = `
  *[_type == "video"] | order(publishedAt desc) {
    ${BASE_FIELDS},
    "youtubeUrl": link,
    "image": image.asset->url
  }
`;

const NEXT_OPTIONS = { revalidate: 3600 };

async function fetchMultiImage(type: string): Promise<GalleryItem[]> {
  const items = await client.fetch<(GalleryItem & { images: string[] })[]>(
    MULTI_IMAGE_QUERY(type),
    {},
    { next: NEXT_OPTIONS },
  );
  return items.map((item) => ({ ...item, image: item.images[0] }));
}

export const getCovers = () => fetchMultiImage("cover");
export const getLogos = () => fetchMultiImage("logo");
export const getPrints = () => fetchMultiImage("print");

export async function getPhotos(): Promise<GalleryItem[]> {
  return client.fetch<GalleryItem[]>(SINGLE_IMAGE_QUERY, {}, { next: NEXT_OPTIONS });
}

const YOUTUBE_ID = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;

export async function getVideos(): Promise<GalleryItem[]> {
  const items = await client.fetch<(GalleryItem & { image: string | null })[]>(
    VIDEO_QUERY,
    {},
    { next: NEXT_OPTIONS },
  );

  return items.map((video) => ({
    ...video,
    image: video.image ?? youtubeThumbnail(video.youtubeUrl),
    youtubeUrl: video.youtubeUrl || undefined,
  }));
}

function youtubeThumbnail(link?: string): string {
  const id = link?.match(YOUTUBE_ID)?.[1];
  return id
    ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
    : "/images/videos.jpg";
}
