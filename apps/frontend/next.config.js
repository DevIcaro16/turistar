
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações básicas para Next.js 13
  reactStrictMode: true,
  swcMinify: true,

  // Habilitar App Directory (necessário para Next.js 13 com app router)
  experimental: {
    appDir: true,
  },

  // Configurações para TypeScript e ESLint
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Configurações para imagens
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

