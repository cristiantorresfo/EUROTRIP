import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Preserve the project's hand-written AGENTS.md without Next.js managed edits.
  agentRules: false,
  async headers() {
    return [
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
