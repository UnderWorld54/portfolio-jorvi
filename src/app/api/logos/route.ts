import { NextResponse } from 'next/server';
import { getLogos, transformStrapiLogo } from '@/lib/strapi';

/**
 * API Route pour récupérer les logos depuis Strapi
 * Cette route s'exécute côté serveur pour sécuriser le token API
 */
export async function GET() {
  try {
    const strapiLogos = await getLogos();
    
    if (!strapiLogos || strapiLogos.length === 0) {
      return NextResponse.json([], {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }
    
    const transformedLogos = strapiLogos
      .map(transformStrapiLogo)
      .filter((logo): logo is NonNullable<typeof logo> => logo !== null);
    
    return NextResponse.json(transformedLogos, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error in /api/logos:', error);
    
    // Log plus détaillé en développement
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error:', error);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch logos',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

