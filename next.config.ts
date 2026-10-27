import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Preserve the project's hand-written AGENTS.md without Next.js managed edits.
  agentRules: false,
  async headers() {
    const developmentHeaders =
      process.env.NODE_ENV !== "production"
        ? [
            {
              source: "/:path*",
              has: [
                {
                  type: "header" as const,
                  key: "accept",
                  value: ".*text/html.*",
                },
              ],
              headers: [
                {
                  key: "Clear-Site-Data",
                  value: '"cache", "storage"',
                },
              ],
            },
          ]
        : [];

    return [
      ...developmentHeaders,
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;
