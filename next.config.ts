import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      //max for serverless function in nextjs - enough for single image
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
