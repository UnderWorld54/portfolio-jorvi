export interface StrapiImage {
  id: number;
  documentId?: string;
  url: string;
  alternativeText?: string;
  width: number;
  height: number;
  formats?: Record<string, unknown>;
}

export interface StrapiBaseItem {
  id: number;
  documentId?: string;
  artist?: string;
  projectName?: string;
  date?: string;
  description?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiSingleImageItem extends StrapiBaseItem {
  image?: StrapiImage | null;
}

export interface StrapiVideo extends StrapiSingleImageItem {
  link?: string;
  youtubeUrl?: string;
}

export interface StrapiMultiImageItem extends StrapiBaseItem {
  images?: StrapiImage[] | null;
  image?: StrapiImage | null;
}

export type StrapiCover = StrapiMultiImageItem;
export type StrapiPhoto = StrapiSingleImageItem;
export type StrapiLogo = StrapiMultiImageItem;
export type StrapiPrint = StrapiMultiImageItem;

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || "";

if (!STRAPI_API_URL) {
  console.warn("NEXT_PUBLIC_STRAPI_API_URL is not defined");
}

// --- Generic fetch ---

async function fetchCollection<T>(
  collection: string,
  populate = "*",
): Promise<T[]> {
  if (!STRAPI_API_URL) {
    throw new Error("STRAPI_API_URL is not configured");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (STRAPI_API_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const url = `${STRAPI_API_URL}/api/${collection}?populate=${populate}&sort=publishedAt:desc`;

  const response = await fetch(url, {
    headers,
    cache: process.env.NODE_ENV === "production" ? "force-cache" : "no-store",
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(
      `Strapi API error: ${response.status} ${response.statusText}`,
    );
  }

  const data: StrapiResponse<T[]> = await response.json();
  return data.data || [];
}

// --- Typed collection fetchers ---

export const getPhotos = () => fetchCollection<StrapiSingleImageItem>("photos");
export const getLogos = () => fetchCollection<StrapiMultiImageItem>("logos");
export const getPrints = () => fetchCollection<StrapiMultiImageItem>("prints");
export const getVideos = () => fetchCollection<StrapiVideo>("videos");
export const getCovers = () =>
  fetchCollection<StrapiMultiImageItem>("covers", "images");

// --- Transform helpers ---

function buildFullUrl(url: string): string {
  if (url.startsWith("http") || url.startsWith("/")) return url;
  return `${STRAPI_API_URL}${url}`;
}

export interface TransformedItem {
  id: string;
  image: string;
  artist?: string;
  projectName?: string;
  date?: string;
  description?: string;
}

export interface TransformedVideo extends TransformedItem {
  youtubeUrl?: string;
}

export interface TransformedCover extends TransformedItem {
  images: string[];
}

function transformBaseFields(item: StrapiBaseItem) {
  return {
    id: item.id.toString(),
    artist: item.artist || undefined,
    projectName: item.projectName || undefined,
    date: item.date || undefined,
    description: item.description || undefined,
  };
}

export function transformStrapiItem(
  item: StrapiSingleImageItem,
): TransformedItem | null {
  if (!item.image?.url) return null;
  return {
    ...transformBaseFields(item),
    image: buildFullUrl(item.image.url),
  };
}

export const transformStrapiPhoto = transformStrapiItem;

function transformMultiImageItem(
  item: StrapiMultiImageItem,
): TransformedCover | null {
  if (item.images && item.images.length > 0) {
    const images = item.images.map((img) => buildFullUrl(img.url));
    return { ...transformBaseFields(item), image: images[0], images };
  }
  if (item.image?.url) {
    const url = buildFullUrl(item.image.url);
    return { ...transformBaseFields(item), image: url, images: [url] };
  }
  return null;
}

export const transformStrapiLogo = transformMultiImageItem;
export const transformStrapiPrint = transformMultiImageItem;

export function transformStrapiVideo(
  video: StrapiVideo,
): TransformedVideo | null {
  let imageUrl: string;

  if (video.image?.url) {
    imageUrl = video.image.url;
  } else {
    const youtubeLink = video.link || video.youtubeUrl;
    if (youtubeLink) {
      const match = youtubeLink.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      );
      imageUrl = match?.[1]
        ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`
        : "/images/videos.jpg";
    } else {
      imageUrl = "/images/videos.jpg";
    }
  }

  return {
    ...transformBaseFields(video),
    image: buildFullUrl(imageUrl),
    youtubeUrl: video.link || video.youtubeUrl || undefined,
  };
}

export const transformStrapiCover = transformMultiImageItem;

// --- Convenience: fetch + transform ---

function filterNull<T>(items: (T | null)[]): T[] {
  return items.filter((x): x is T => x !== null);
}

export async function getTransformedPhotos(): Promise<TransformedItem[]> {
  const items = await getPhotos();
  return filterNull(items.map(transformStrapiItem));
}

export async function getTransformedLogos(): Promise<TransformedCover[]> {
  const items = await getLogos();
  return filterNull(items.map(transformMultiImageItem));
}

export async function getTransformedPrints(): Promise<TransformedCover[]> {
  const items = await getPrints();
  return filterNull(items.map(transformMultiImageItem));
}

export async function getTransformedVideos(): Promise<TransformedVideo[]> {
  const items = await getVideos();
  return filterNull(items.map(transformStrapiVideo));
}

export async function getTransformedCovers(): Promise<TransformedCover[]> {
  const items = await getCovers();
  return filterNull(items.map(transformMultiImageItem));
}
