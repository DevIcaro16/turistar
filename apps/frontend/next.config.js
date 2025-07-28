
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify removido - é padrão no Next.js 13+

  experimental: {
    appDir: true, // Necessário para Next.js 13.0.5
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // output: 'standalone', // Desabilitado para usar abordagem tradicional
  images: {
    unoptimized: true,
  },
  // Configuração para servir arquivos estáticos corretamente
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

