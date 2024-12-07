import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      //max for serverless function in nextjs - enough for single image
      bodySizeLimit: "4mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "evwydtymthr7hie2.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
