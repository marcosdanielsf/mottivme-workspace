import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@mottivme/ui", "@mottivme/database", "@mottivme/utils"],
};

export default nextConfig;
