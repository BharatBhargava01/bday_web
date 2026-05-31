import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
// Replace with your repository name if different
const repoName = 'bday_web'; 

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Set basePath only in production (when building for GitHub Pages project page)
  basePath: isProd ? `/${repoName}` : '',
  allowedDevOrigins: ['10.0.73.128'],
};

export default nextConfig;
