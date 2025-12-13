require('dotenv').config()
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [],
  },
  // standaloneモードでpublicフォルダを正しくコピー
  experimental: {
    outputFileTracingRoot: undefined,
  },
}

module.exports = nextConfig
