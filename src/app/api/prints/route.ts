import { NextResponse } from 'next/server';
import { getPrints, transformStrapiPrint } from '@/lib/strapi';

/**
 * API Route pour récupérer les prints depuis Strapi
 * Cette route s'exécute côté serveur pour sécuriser le token API
 */
export async function GET() {
  try {
    const strapiPrints = await getPrints();
    
    if (!strapiPrints || strapiPrints.length === 0) {
      return NextResponse.json([], {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }
    
    const transformedPrints = strapiPrints
      .map(transformStrapiPrint)
      .filter((print): print is NonNullable<typeof print> => print !== null);
    
    return NextResponse.json(transformedPrints, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error in /api/prints:', error);
    
    // Log plus détaillé en développement
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error:', error);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch prints',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

