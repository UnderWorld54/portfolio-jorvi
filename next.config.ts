import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**.strapi.cloud',
      },
      {
        protocol: 'https',
        hostname: '**.strapi.app',
      },
      {
        protocol: 'https',
        hostname: '**.media.strapiapp.com',
      },
      {
        protocol: 'https',
        hostname: '**.media.strapi.cloud',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },

      ...(process.env.NEXT_PUBLIC_STRAPI_IMAGE_DOMAIN
        ? [
            {
              protocol: 'https' as const,
              hostname: process.env.NEXT_PUBLIC_STRAPI_IMAGE_DOMAIN,
            },
          ]
        : []),
    ],

    unoptimized: process.env.NODE_ENV === 'development',
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  
  // Optimisations de compilation
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Compression
  compress: true,
  
  // Optimisation des bundles
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
};

export default nextConfig;
