// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    turbopack: false,  // Turbopack 비활성화, Webpack 사용
  },
  images: {
    domains: ['static2.finnhub.io'],
  },
};

export default nextConfig;
