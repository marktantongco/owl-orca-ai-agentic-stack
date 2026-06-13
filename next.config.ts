import type { NextConfig } from "next";

const isStaticExport = process.env.NEXT_STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : "standalone",
  // GitHub Pages serves from /owl-orca-ai-agentic-stack/ — set basePath for static export
  basePath: isStaticExport ? "/owl-orca-ai-agentic-stack" : "",
  // Disable image optimization for static export (doesn't work with export mode)
  images: isStaticExport ? { unoptimized: true } : undefined,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Ensure GSAP subpath imports resolve correctly with Turbopack
  transpilePackages: ['gsap', '@gsap/react'],
};

export default nextConfig;
