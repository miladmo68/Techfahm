import type { NextConfig } from "next";

/**
 * Static export for cPanel shared hosting (no Node, no PHP).
 * - output: "export"  → `next build` writes plain HTML/CSS/JS to /out
 * - trailingSlash     → keeps the old WordPress URLs (/services/, /contact/ …)
 * - images            → next/image with a custom loader that points to the
 *                       pre-optimised WebP files made by `npm run images`
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // Only set for the GitHub Pages preview (e.g. "/Techfahm"). Empty for techfahm.com.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Must match WIDTHS in scripts/images.mjs
    deviceSizes: [480, 828, 1200, 1920],
    imageSizes: [240],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
