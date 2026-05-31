import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const repoName = 'bday_web'; 

const nextConfig: NextConfig = {
  // Only statically export the site when building on GitHub Actions for Pages
  output: isGithubActions ? 'export' : undefined,
  
  // Disable image optimization on GitHub Pages since it has no server
  images: {
    unoptimized: isGithubActions ? true : undefined,
  },
  
  // Set basePath only on GitHub Pages where the site is served under /repoName
  basePath: isGithubActions ? `/${repoName}` : '',
  
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubActions ? `/${repoName}` : '',
  },
  
  allowedDevOrigins: ['10.0.73.128'],
};

export default nextConfig;
