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
  // Using the updated format as suggested in the warnings
  experimental: {
    // Remove serverActions (now available by default)
    // Remove outputStandalone (moved to output)
    // Remove optimizeCss to avoid 'critters' dependency
  },
  // New location for standalone output
  output: 'standalone',
  // Add gzip compression for better performance
  compress: true,
}

module.exports = nextConfig