/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three / R3F ship untranspiled ESM; let Next transpile them.
  transpilePackages: ["three"],
};

export default nextConfig;
