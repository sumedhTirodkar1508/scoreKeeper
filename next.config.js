/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/(.*)", // Apply to all API routes
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0", // No cache, always fetch fresh data
          },
          {
            key: "Pragma",
            value: "no-cache", // Legacy header
          },
          {
            key: "Expires",
            value: "0", // Immediately expired
          },
        ],
      },
      {
        // Optional: Disable caching for static assets (if needed)
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
