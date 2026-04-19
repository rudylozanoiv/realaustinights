import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
  },
  // Next 16 blocks cross-origin dev requests by default, which prevents
  // hydration when the site is accessed via LAN IP (e.g. real iPhone at
  // http://192.168.1.51:3000). Without hydration, buttons render but no
  // event handlers attach — taps do nothing. Patterns match per-segment;
  // wildcards, not CIDR.
  allowedDevOrigins: [
    '192.168.*.*',
    '10.*.*.*',
    '172.*.*.*',
    '*.local',
  ],
};

export default nextConfig;
