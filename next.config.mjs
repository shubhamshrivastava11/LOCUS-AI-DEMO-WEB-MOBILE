/** @type {import('next').NextConfig} */
// Static export for GitHub Pages, served under /<repo-name>/
const basePath = '/LOCUS-AI-DEMO-WEB-MOBILE';
const nextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath }
};
export default nextConfig;
