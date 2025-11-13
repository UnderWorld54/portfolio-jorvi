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
      // Ajoutez d'autres domaines Strapi si nécessaire
      // Vous pouvez aussi utiliser une variable d'environnement pour le domaine
      ...(process.env.NEXT_PUBLIC_STRAPI_IMAGE_DOMAIN
        ? [
            {
              protocol: 'https' as const,
              hostname: process.env.NEXT_PUBLIC_STRAPI_IMAGE_DOMAIN,
            },
          ]
        : []),
    ],
    // Désactiver l'optimisation d'images en développement pour permettre localhost
    // Cela évite les erreurs de résolution d'IP privée
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
