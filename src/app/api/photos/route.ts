import { NextResponse } from 'next/server';
import { getPhotos, transformStrapiPhoto } from '@/lib/strapi';

/**
 * API Route pour récupérer les photos depuis Strapi
 * Cette route s'exécute côté serveur pour sécuriser le token API
 */
export async function GET() {
  try {
    const strapiPhotos = await getPhotos();
    
    if (!strapiPhotos || strapiPhotos.length === 0) {
      return NextResponse.json([], {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }
    
    const transformedPhotos = strapiPhotos
      .map(transformStrapiPhoto)
      .filter((photo): photo is NonNullable<typeof photo> => photo !== null);
    
    return NextResponse.json(transformedPhotos, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error in /api/photos:', error);
    
    // Log plus détaillé en développement
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error:', error);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch photos',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

