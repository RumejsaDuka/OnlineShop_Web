import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Responsive sizes include the native campaign photo width.
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1440, 1672],
    imageSizes: [32, 48, 64, 96, 128, 256],
  },
  // Concept presentation: keep every route out of search indexes.
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
