import { getMoverzBlogRedirectsForHost } from './scripts/blog-moverz-redirects.mjs';

const HOST = 'devis-demenageur-lyon.fr';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  trailingSlash: true,
  
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    serverComponentsExternalPackages: []
  },

  compress: true,
  
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  async redirects() {
    const existing = [
      // Homepage → Page ville moverz.fr
      { source: '/', destination: 'https://moverz.fr/demenagement/lyon/', permanent: true },
      // Blog hub → moverz.fr
      { source: '/blog', destination: 'https://moverz.fr/blog/', permanent: true },
      { source: '/blog/', destination: 'https://moverz.fr/blog/', permanent: true },
      // Blog articles spécifiques
      { source: '/blog/demenageur-lyon/meilleurs-demenageurs-lyon/', destination: 'https://moverz.fr/blog/', permanent: true },
      // Blog articles → moverz.fr (règle générique)
      { source: '/blog/demenagement-lyon/:slug*', destination: 'https://moverz.fr/blog/:slug*', permanent: true },
      { source: '/blog/demenageur-lyon/:slug*', destination: 'https://moverz.fr/blog/:slug*', permanent: true },
      // Quartiers lyon (6 pages)
      { source: '/lyon/', destination: 'https://moverz.fr/lyon/', permanent: true },
      { source: '/lyon/confluence/', destination: 'https://moverz.fr/lyon/confluence/', permanent: true },
      { source: '/lyon/croix-rousse/', destination: 'https://moverz.fr/lyon/croix-rousse/', permanent: true },
      { source: '/lyon/part-dieu/', destination: 'https://moverz.fr/lyon/part-dieu/', permanent: true },
      { source: '/lyon/presquile/', destination: 'https://moverz.fr/lyon/presquile/', permanent: true },
      { source: '/lyon/vieux-lyon/', destination: 'https://moverz.fr/lyon/vieux-lyon/', permanent: true },
      // Hub quartiers lyon
      { source: '/quartiers-lyon/', destination: 'https://moverz.fr/quartiers-lyon/', permanent: true },
      // Corridors depuis lyon (5 pages)
      { source: '/lyon-vers-espagne/', destination: 'https://moverz.fr/lyon-vers-espagne/', permanent: true },
      { source: '/lyon-vers-marseille/', destination: 'https://moverz.fr/lyon-vers-marseille/', permanent: true },
      { source: '/lyon-vers-nantes/', destination: 'https://moverz.fr/lyon-vers-nantes/', permanent: true },
      { source: '/lyon-vers-paris/', destination: 'https://moverz.fr/lyon-vers-paris/', permanent: true },
      { source: '/lyon-vers-toulouse/', destination: 'https://moverz.fr/lyon-vers-toulouse/', permanent: true },
      // Services
      { source: '/services/', destination: 'https://moverz.fr/', permanent: true },
      { source: '/services/demenagement-economique-lyon/', destination: 'https://moverz.fr/', permanent: true },
      { source: '/services/demenagement-premium-lyon/', destination: 'https://moverz.fr/', permanent: true },
      { source: '/services/demenagement-standard-lyon/', destination: 'https://moverz.fr/', permanent: true },
      // Pages communes
      { source: '/cgu/', destination: 'https://moverz.fr/cgu/', permanent: true },
      { source: '/cgv/', destination: 'https://moverz.fr/cgv/', permanent: true },
      { source: '/comment-ca-marche/', destination: 'https://moverz.fr/comment-ca-marche/', permanent: true },
      { source: '/contact/', destination: 'https://moverz.fr/contact/', permanent: true },
      { source: '/devis-gratuits/', destination: 'https://moverz.fr/devis-gratuits/', permanent: true },
      { source: '/estimation-rapide/', destination: 'https://moverz.fr/estimation-rapide/', permanent: true },
      { source: '/faq/', destination: 'https://moverz.fr/faq/', permanent: true },
      { source: '/mentions-legales/', destination: 'https://moverz.fr/mentions-legales/', permanent: true },
      { source: '/notre-offre/', destination: 'https://moverz.fr/notre-offre/', permanent: true },
      { source: '/partenaires/', destination: 'https://moverz.fr/partenaires/', permanent: true },
      { source: '/politique-confidentialite/', destination: 'https://moverz.fr/politique-confidentialite/', permanent: true },
    ];

    const blogToMoverz = getMoverzBlogRedirectsForHost(HOST);

    return [...existing, ...blogToMoverz];
  }
};

export default nextConfig;
