import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve HTML documents fresh so browsers never keep an outdated shell
  // (navbar/footer) in cache after a deploy. Hashed static assets stay cached.
  async headers() {
    return [
      {
        source: "/:path*",
        has: [{ type: "header", key: "accept", value: "text/html" }],
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Pragma", value: "no-cache" },
        ],
      },
    ];
  },
  experimental: {
    agentFeedback: true,
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
