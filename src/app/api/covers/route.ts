import { NextResponse } from 'next/server';
import { getCovers, transformStrapiCover } from '@/lib/strapi';

/**
 * API Route pour récupérer les covers depuis Strapi
 * Cette route s'exécute côté serveur pour sécuriser le token API
 */
export async function GET() {
  try {
    const strapiCovers = await getCovers();
    
    if (!strapiCovers || strapiCovers.length === 0) {
      return NextResponse.json([], {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }
    
    const transformedCovers = strapiCovers
      .map(transformStrapiCover)
      .filter((cover): cover is NonNullable<typeof cover> => cover !== null);
    
    return NextResponse.json(transformedCovers, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error in /api/covers:', error);
    
    // Log plus détaillé en développement
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error:', error);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch covers',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

