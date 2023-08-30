/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["yt3.ggpht.com", "banner.yt"],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
