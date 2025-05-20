/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'images.unsplash.com',
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    // Enable serverActions
    serverActions: true,
    // Enable optimizeCss
    optimizeCss: true,
    // Enable the standalone output mode
    outputStandalone: true,
  },
  // Add gzip compression for better performance
  compress: true,
}

module.exports = nextConfig