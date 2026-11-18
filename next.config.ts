import type { NextConfig } from "next";

// On Vercel (demo previews) there is no backend: the guestbook runs in demo mode unless the
// project sets NEXT_PUBLIC_GUESTBOOK_MODE itself, and the standalone Docker output is not needed.
const onVercel = Boolean(process.env.VERCEL);

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_GUESTBOOK_MODE: process.env.NEXT_PUBLIC_GUESTBOOK_MODE ?? (onVercel ? "demo" : "live"),
  },
  output: onVercel ? undefined : "standalone",
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
