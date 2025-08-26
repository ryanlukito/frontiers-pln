import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Abaikan semua sourcemap dari chrome-aws-lambda
    config.module.rules.push({
      test: /\.map$/,
      type: "asset/source",
    });
    return config;
  },
};

export default nextConfig;
