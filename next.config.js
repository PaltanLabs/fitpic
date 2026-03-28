/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // Permanent redirect non-www → www for SEO (fixes 307 → 308)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'fitpic.in' }],
        destination: 'https://www.fitpic.in/:path*',
        permanent: true,
      },
    ];
  },

  // Reverse-proxy PostHog through our domain so ad blockers don't block it
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
      {
        source: '/ingest/decide',
        destination: 'https://us.i.posthog.com/decide',
      },
    ];
  },

  // Prevent /ingest from being treated as a Next.js path
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig
