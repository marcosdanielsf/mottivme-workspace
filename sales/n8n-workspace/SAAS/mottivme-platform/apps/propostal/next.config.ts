import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@mottivme/ui", "@mottivme/database", "@mottivme/utils"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bfumywvwubvernvhjehk.supabase.co",
      },
    ],
  },
};

export default nextConfig;
