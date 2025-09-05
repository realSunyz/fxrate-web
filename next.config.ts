import type { NextConfig } from "next";

const { execSync } = require("child_process");

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.sunyz.net https://analytics.sunyz.net https://challenges.cloudflare.com;
    style-src 'self' 'unsafe-inline' https://cdn.sunyz.net https://fonts.googleapis.com https://challenges.cloudflare.com;
    img-src 'self' blob: data: https://cdn.sunyz.net;
    font-src 'self' https://cdn.sunyz.net https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-src 'self' https://challenges.cloudflare.com;
    connect-src 'self' https://fxrate-api.sunyz.net https://analytics.sunyz.net https://challenges.cloudflare.com;
`;

module.exports = {
  env: {
    COMMIT_ID: execSync("git rev-parse --short HEAD").toString().trim(),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Permissions-Policy",
            value:
              "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer-when-downgrade",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    webpackMemoryOptimizations: true,
    webpackBuildWorker: true,
    preloadEntriesOnStart: false,
  },
};

export default nextConfig;
