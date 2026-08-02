// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";
import { loadEnv } from "vite";
import path from "node:path";

// Server routes (email webhooks) need non-VITE_ env vars in process.env.
// These are NOT added to the client define block — no secrets leak to the browser.
const serverEnv = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");
Object.assign(process.env, serverEnv);

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    resolve: {
      alias: {
        "entities/lib/decode.js": path.resolve(
          process.cwd(),
          "node_modules/entities/lib/decode.js",
        ),
        "entities/lib/encode.js": path.resolve(
          process.cwd(),
          "node_modules/entities/lib/encode.js",
        ),
        entities: path.resolve(process.cwd(), "node_modules/entities"),
      },
    },
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: null,
        filename: "sw.js",
        devOptions: { enabled: false },
        workbox: {
          navigateFallback: "/",
          navigateFallbackDenylist: [/^\/~oauth/, /^\/api\//, /^\/admin/, /^\/lovable\//],
          globPatterns: ["**/*.{js,css,html,svg,png,ico,webp,woff2}"],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.mode === "navigate",
              handler: "NetworkFirst",
              options: {
                cacheName: "html-cache",
                networkTimeoutSeconds: 4,
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.origin === self.location.origin && /\.(?:js|css|woff2)$/.test(url.pathname),
              handler: "CacheFirst",
              options: {
                cacheName: "assets-cache",
                expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.origin === self.location.origin &&
                /\.(?:png|jpg|jpeg|svg|webp|ico)$/.test(url.pathname),
              handler: "CacheFirst",
              options: {
                cacheName: "image-cache",
                expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
          ],
        },
        manifest: false,
      }),
    ],
  },
});
