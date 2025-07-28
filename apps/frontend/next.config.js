
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // output: 'standalone', // Temporariamente desabilitado para debug
  images: {
    unoptimized: true,
  },
  // Configuração para servir arquivos estáticos corretamente
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  basePath: '',
  trailingSlash: false,

  // Configuração para resolver problemas de roteamento
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

