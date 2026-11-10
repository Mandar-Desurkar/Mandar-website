import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: keep Next's badge off the bottom-left, where Chai the desk cat naps
  devIndicators: { position: "bottom-right" },
};

export default nextConfig;
