import { NextResponse } from 'next/server';
import { getVideos, transformStrapiVideo } from '@/lib/strapi';

/**
 * API Route pour récupérer les videos depuis Strapi
 * Cette route s'exécute côté serveur pour sécuriser le token API
 */
export async function GET() {
  try {
    const strapiVideos = await getVideos();
    
    if (!strapiVideos || strapiVideos.length === 0) {
      return NextResponse.json([], {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }
    
    const transformedVideos = strapiVideos
      .map(transformStrapiVideo)
      .filter((video): video is NonNullable<typeof video> => video !== null);
    
    return NextResponse.json(transformedVideos, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error in /api/videos:', error);
    
    // Log plus détaillé en développement
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error:', error);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch videos',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

