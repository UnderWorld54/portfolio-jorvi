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

