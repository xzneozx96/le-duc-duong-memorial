import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // start.mjs runs the migrations before server.js; no route imports the migrator, so trace it by hand.
  outputFileTracingIncludes: {
    "/*": ["./drizzle/**/*", "./node_modules/drizzle-orm/**/*", "./node_modules/postgres/**/*"],
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
