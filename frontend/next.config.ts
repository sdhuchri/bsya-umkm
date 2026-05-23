import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a slim standalone server bundle for Docker / Railway.
  output: "standalone",
};

export default nextConfig;
