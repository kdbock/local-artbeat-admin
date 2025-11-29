import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://kristykelly.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
