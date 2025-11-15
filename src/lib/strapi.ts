/**
 * Service pour interagir avec l'API Strapi
 */

// Structure pour Strapi v5 (sans attributes)
export interface StrapiPhoto {
  id: number;
  documentId?: string;
  image?: {
    id: number;
    documentId?: string;
    url: string;
    alternativeText?: string;
    width: number;
    height: number;
    formats?: Record<string, unknown>;
  } | null;
  artist?: string;
  projectName?: string;
  date?: string;
  description?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiLogo {
  id: number;
  documentId?: string;
  image?: {
    id: number;
    documentId?: string;
    url: string;
    alternativeText?: string;
    width: number;
    height: number;
    formats?: Record<string, unknown>;
  } | null;
  artist?: string;
  projectName?: string;
  date?: string;
  description?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiPrint {
  id: number;
  documentId?: string;
  image?: {
    id: number;
    documentId?: string;
    url: string;
    alternativeText?: string;
    width: number;
    height: number;
    formats?: Record<string, unknown>;
  } | null;
  artist?: string;
  projectName?: string;
  date?: string;
  description?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiVideo {
  id: number;
  documentId?: string;
  image?: {
    id: number;
    documentId?: string;
    url: string;
    alternativeText?: string;
    width: number;
    height: number;
    formats?: Record<string, unknown>;
  } | null;
  artist?: string;
  projectName?: string;
  date?: string;
  description?: string;
  link?: string; // Le champ dans Strapi s'appelle "link"
  youtubeUrl?: string; // Alias pour compatibilité
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiCover {
  id: number;
  documentId?: string;
  image?: {
    id: number;
    documentId?: string;
    url: string;
    alternativeText?: string;
    width: number;
    height: number;
    formats?: Record<string, unknown>;
  } | null;
  artist?: string;
  projectName?: string;
  date?: string;
  description?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

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

const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || '';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

if (!STRAPI_API_URL) {
  console.warn('NEXT_PUBLIC_STRAPI_API_URL is not defined');
}

/**
 * Récupère les photos depuis Strapi
 */
export async function getPhotos(): Promise<StrapiPhoto[]> {
  if (!STRAPI_API_URL) {
    throw new Error('STRAPI_API_URL is not configured');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Ajouter le token API si disponible (pour les collections protégées)
  if (STRAPI_API_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  // Essayer différentes syntaxes de populate pour Strapi v5
  const populateOptions = [
    'populate=*', // Tout peupler (le plus simple)
    'populate=image', // Peupler uniquement l'image
  ];

  let lastError: Error | null = null;

  for (const populate of populateOptions) {
    try {
      const url = `${STRAPI_API_URL}/api/photos?${populate}&sort=publishedAt:desc`;
      
      const response = await fetch(url, {
        headers,
        // Ne pas mettre en cache en développement, mais en cache en production
        cache: process.env.NODE_ENV === 'production' ? 'force-cache' : 'no-store',
        next: { revalidate: 3600 }, // Revalider toutes les heures en production
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Populate option "${populate}" failed:`, errorText);
        lastError = new Error(`Strapi API error: ${response.status} ${response.statusText}`);
        continue; // Essayer la prochaine option
      }

      const data: StrapiResponse<StrapiPhoto[]> = await response.json();
      
      // Log pour déboguer la structure
      if (process.env.NODE_ENV === 'development' && data.data && data.data.length > 0) {
        console.log(`Success with populate option: "${populate}"`);
        console.log('Sample Strapi photo structure:', JSON.stringify(data.data[0], null, 2));
      }
      
      return data.data || [];
    } catch (error) {
      console.warn(`Error with populate option "${populate}":`, error);
      lastError = error instanceof Error ? error : new Error('Unknown error');
      continue; // Essayer la prochaine option
    }
  }

  // Si toutes les options ont échoué
  console.error('All populate options failed');
  throw lastError || new Error('Failed to fetch photos from Strapi');
}

/**
 * Convertit une photo Strapi v5 en format ImageCardData
 */
export function transformStrapiPhoto(photo: StrapiPhoto): {
  id: string;
  image: string;
  artist?: string;
  projectName?: string;
  date?: string;
  description?: string;
} | null {
  try {
    // Vérifier que l'image existe (Strapi v5: image est directement dans l'objet)
    if (!photo.image || !photo.image.url) {
      console.warn(`Photo ${photo.id} has no image, skipping`);
      return null;
    }

    const imageUrl = photo.image.url;
    
    // Construire l'URL complète de l'image
    // En Strapi v5, l'URL peut être relative ou absolue
    const fullImageUrl = imageUrl.startsWith('http')
      ? imageUrl
      : `${STRAPI_API_URL}${imageUrl}`;

    return {
      id: photo.id.toString(),
      image: fullImageUrl,
      artist: photo.artist || undefined,
      projectName: photo.projectName || undefined,
      date: photo.date || undefined,
      description: photo.description || undefined,
    };
  } catch (error) {
    console.error(`Error transforming photo ${photo.id}:`, error);
    console.error('Photo structure:', JSON.stringify(photo, null, 2));
    return null;
  }
}

/**
 * Récupère les logos depuis Strapi
 */
export async function getLogos(): Promise<StrapiLogo[]> {
  if (!STRAPI_API_URL) {
    throw new Error('STRAPI_API_URL is not configured');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (STRAPI_API_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const populateOptions = [
    'populate=*',
    'populate=image',
  ];

  let lastError: Error | null = null;

  for (const populate of populateOptions) {
    try {
      const url = `${STRAPI_API_URL}/api/logos?${populate}&sort=publishedAt:desc`;
      
      const response = await fetch(url, {
        headers,
        cache: process.env.NODE_ENV === 'production' ? 'force-cache' : 'no-store',
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Populate option "${populate}" failed:`, errorText);
        lastError = new Error(`Strapi API error: ${response.status} ${response.statusText}`);
        continue;
      }

      const data: StrapiResponse<StrapiLogo[]> = await response.json();
      
      if (process.env.NODE_ENV === 'development' && data.data && data.data.length > 0) {
        console.log(`Success with populate option: "${populate}"`);
        console.log('Sample Strapi logo structure:', JSON.stringify(data.data[0], null, 2));
      }
      
      return data.data || [];
    } catch (error) {
      console.warn(`Error with populate option "${populate}":`, error);
      lastError = error instanceof Error ? error : new Error('Unknown error');
      continue;
    }
  }

  console.error('All populate options failed');
  throw lastError || new Error('Failed to fetch logos from Strapi');
}

/**
 * Convertit un logo Strapi v5 en format ImageCardData
 */
export function transformStrapiLogo(logo: StrapiLogo): {
  id: string;
  image: string;
  artist?: string;
  projectName?: string;
  date?: string;
  description?: string;
} | null {
  try {
    if (!logo.image || !logo.image.url) {
      console.warn(`Logo ${logo.id} has no image, skipping`);
      return null;
    }

    const imageUrl = logo.image.url;
    const fullImageUrl = imageUrl.startsWith('http')
      ? imageUrl
      : `${STRAPI_API_URL}${imageUrl}`;

    return {
      id: logo.id.toString(),
      image: fullImageUrl,
      artist: logo.artist || undefined,
      projectName: logo.projectName || undefined,
      date: logo.date || undefined,
      description: logo.description || undefined,
    };
  } catch (error) {
    console.error(`Error transforming logo ${logo.id}:`, error);
    console.error('Logo structure:', JSON.stringify(logo, null, 2));
    return null;
  }
}

/**
 * Récupère les prints depuis Strapi
 */
export async function getPrints(): Promise<StrapiPrint[]> {
  if (!STRAPI_API_URL) {
    throw new Error('STRAPI_API_URL is not configured');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (STRAPI_API_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const populateOptions = [
    'populate=*',
    'populate=image',
  ];

  let lastError: Error | null = null;

  for (const populate of populateOptions) {
    try {
      const url = `${STRAPI_API_URL}/api/prints?${populate}&sort=publishedAt:desc`;
      
      const response = await fetch(url, {
        headers,
        cache: process.env.NODE_ENV === 'production' ? 'force-cache' : 'no-store',
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Populate option "${populate}" failed:`, errorText);
        lastError = new Error(`Strapi API error: ${response.status} ${response.statusText}`);
        continue;
      }

      const data: StrapiResponse<StrapiPrint[]> = await response.json();
      
      if (process.env.NODE_ENV === 'development' && data.data && data.data.length > 0) {
        console.log(`Success with populate option: "${populate}"`);
        console.log('Sample Strapi print structure:', JSON.stringify(data.data[0], null, 2));
      }
      
      return data.data || [];
    } catch (error) {
      console.warn(`Error with populate option "${populate}":`, error);
      lastError = error instanceof Error ? error : new Error('Unknown error');
      continue;
    }
  }

  console.error('All populate options failed');
  throw lastError || new Error('Failed to fetch prints from Strapi');
}

/**
 * Convertit un print Strapi v5 en format ImageCardData
 */
export function transformStrapiPrint(print: StrapiPrint): {
  id: string;
  image: string;
  artist?: string;
  projectName?: string;
  date?: string;
  description?: string;
} | null {
  try {
    if (!print.image || !print.image.url) {
      console.warn(`Print ${print.id} has no image, skipping`);
      return null;
    }

    const imageUrl = print.image.url;
    const fullImageUrl = imageUrl.startsWith('http')
      ? imageUrl
      : `${STRAPI_API_URL}${imageUrl}`;

    return {
      id: print.id.toString(),
      image: fullImageUrl,
      artist: print.artist || undefined,
      projectName: print.projectName || undefined,
      date: print.date || undefined,
      description: print.description || undefined,
    };
  } catch (error) {
    console.error(`Error transforming print ${print.id}:`, error);
    console.error('Print structure:', JSON.stringify(print, null, 2));
    return null;
  }
}

/**
 * Récupère les videos depuis Strapi
 */
export async function getVideos(): Promise<StrapiVideo[]> {
  if (!STRAPI_API_URL) {
    throw new Error('STRAPI_API_URL is not configured');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (STRAPI_API_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const populateOptions = [
    'populate=*',
    'populate=image',
  ];

  let lastError: Error | null = null;

  for (const populate of populateOptions) {
    try {
      const url = `${STRAPI_API_URL}/api/videos?${populate}&sort=publishedAt:desc`;
      
      const response = await fetch(url, {
        headers,
        cache: process.env.NODE_ENV === 'production' ? 'force-cache' : 'no-store',
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Populate option "${populate}" failed:`, errorText);
        lastError = new Error(`Strapi API error: ${response.status} ${response.statusText}`);
        continue;
      }

      const data: StrapiResponse<StrapiVideo[]> = await response.json();
      
      if (process.env.NODE_ENV === 'development' && data.data && data.data.length > 0) {
        console.log(`Success with populate option: "${populate}"`);
        console.log('Sample Strapi video structure:', JSON.stringify(data.data[0], null, 2));
      }
      
      return data.data || [];
    } catch (error) {
      console.warn(`Error with populate option "${populate}":`, error);
      lastError = error instanceof Error ? error : new Error('Unknown error');
      continue;
    }
  }

  console.error('All populate options failed');
  throw lastError || new Error('Failed to fetch videos from Strapi');
}

/**
 * Convertit une video Strapi v5 en format avec lien YouTube
 */
export function transformStrapiVideo(video: StrapiVideo): {
  id: string;
  image: string;
  artist?: string;
  projectName?: string;
  date?: string;
  description?: string;
  youtubeUrl?: string;
} | null {
  try {
    // Pour les vidéos, on peut utiliser une image par défaut si aucune image n'est fournie
    // On génère une thumbnail YouTube à partir de l'URL si disponible
    let imageUrl: string;
    
    if (video.image && video.image.url) {
      imageUrl = video.image.url;
    } else {
      // Si pas d'image, essayer de générer une thumbnail YouTube à partir du lien
      const youtubeLink = video.link || video.youtubeUrl;
      if (youtubeLink) {
        // Extraire l'ID de la vidéo YouTube depuis l'URL
        const youtubeIdMatch = youtubeLink.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        if (youtubeIdMatch && youtubeIdMatch[1]) {
          imageUrl = `https://img.youtube.com/vi/${youtubeIdMatch[1]}/maxresdefault.jpg`;
        } else {
          // Image par défaut si on ne peut pas extraire l'ID
          imageUrl = '/images/videos.jpg';
        }
      } else {
        // Pas de lien YouTube non plus, utiliser une image par défaut
        imageUrl = '/images/videos.jpg';
      }
    }

    const fullImageUrl = imageUrl.startsWith('http') || imageUrl.startsWith('/')
      ? imageUrl
      : `${STRAPI_API_URL}${imageUrl}`;

    // Utiliser "link" de Strapi et le mapper vers "youtubeUrl"
    const youtubeUrl = video.link || video.youtubeUrl;

    return {
      id: video.id.toString(),
      image: fullImageUrl,
      artist: video.artist || undefined,
      projectName: video.projectName || undefined,
      date: video.date || undefined,
      description: video.description || undefined,
      youtubeUrl: youtubeUrl || undefined,
    };
  } catch (error) {
    console.error(`Error transforming video ${video.id}:`, error);
    console.error('Video structure:', JSON.stringify(video, null, 2));
    return null;
  }
}

/**
 * Récupère les covers depuis Strapi
 */
export async function getCovers(): Promise<StrapiCover[]> {
  if (!STRAPI_API_URL) {
    throw new Error('STRAPI_API_URL is not configured');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (STRAPI_API_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const populateOptions = [
    'populate=*',
    'populate=image',
  ];

  let lastError: Error | null = null;

  for (const populate of populateOptions) {
    try {
      const url = `${STRAPI_API_URL}/api/covers?${populate}&sort=publishedAt:desc`;
      
      const response = await fetch(url, {
        headers,
        cache: process.env.NODE_ENV === 'production' ? 'force-cache' : 'no-store',
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Populate option "${populate}" failed:`, errorText);
        lastError = new Error(`Strapi API error: ${response.status} ${response.statusText}`);
        continue;
      }

      const data: StrapiResponse<StrapiCover[]> = await response.json();
      
      if (process.env.NODE_ENV === 'development' && data.data && data.data.length > 0) {
        console.log(`Success with populate option: "${populate}"`);
        console.log('Sample Strapi cover structure:', JSON.stringify(data.data[0], null, 2));
      }
      
      return data.data || [];
    } catch (error) {
      console.warn(`Error with populate option "${populate}":`, error);
      lastError = error instanceof Error ? error : new Error('Unknown error');
      continue;
    }
  }

  console.error('All populate options failed');
  throw lastError || new Error('Failed to fetch covers from Strapi');
}

/**
 * Convertit un cover Strapi v5 en format ImageCardData
 */
export function transformStrapiCover(cover: StrapiCover): {
  id: string;
  image: string;
  artist?: string;
  projectName?: string;
  date?: string;
  description?: string;
} | null {
  try {
    if (!cover.image || !cover.image.url) {
      console.warn(`Cover ${cover.id} has no image, skipping`);
      return null;
    }

    const imageUrl = cover.image.url;
    const fullImageUrl = imageUrl.startsWith('http')
      ? imageUrl
      : `${STRAPI_API_URL}${imageUrl}`;

    return {
      id: cover.id.toString(),
      image: fullImageUrl,
      artist: cover.artist || undefined,
      projectName: cover.projectName || undefined,
      date: cover.date || undefined,
      description: cover.description || undefined,
    };
  } catch (error) {
    console.error(`Error transforming cover ${cover.id}:`, error);
    console.error('Cover structure:', JSON.stringify(cover, null, 2));
    return null;
  }
}

