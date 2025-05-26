import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      }, {
        protocol: "http",
        hostname: "localhost",
        port: "3000"
      }
    ],
  },
};

export default nextConfig;
