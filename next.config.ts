import type { NextConfig } from "next";

const { execSync } = require('child_process');

module.exports = {
  env: {
    COMMIT_ID: execSync('git rev-parse --short HEAD').toString().trim(),
  },
};

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
