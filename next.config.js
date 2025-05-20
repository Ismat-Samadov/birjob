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
    // optimizeCss needs critters package
    optimizeCss: true,
  },
  // Use output: 'standalone' instead of experimental.outputStandalone
  output: 'standalone',
  // Add gzip compression for better performance
  compress: true,
}

module.exports = nextConfig