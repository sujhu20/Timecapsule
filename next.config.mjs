/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production mode optimizations
  reactStrictMode: true,
  swcMinify: true,
  productionBrowserSourceMaps: false,
  
  // Improve performance in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { 
      exclude: ['error', 'warn'] 
    } : false,
  },
  
  // Improve security in production
  headers: async () => {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Image optimization
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Output as standalone for better deployment
  output: 'standalone',
};

export default nextConfig; 