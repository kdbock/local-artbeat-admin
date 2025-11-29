import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://kristykelly.com/localartbeat/api/:path*',
      },
    ];
  },
};

export default nextConfig;
