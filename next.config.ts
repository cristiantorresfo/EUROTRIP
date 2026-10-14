import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Preserve the project's hand-written AGENTS.md without Next.js managed edits.
  agentRules: false,
};

export default nextConfig;
