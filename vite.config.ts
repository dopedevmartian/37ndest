import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/37ndest/",
  plugins: [
    react(),
    VitePWA({
      // generateSW mode: Workbox generates the service worker automatically.
      // No custom runtime caching strategy — foundation only.
      strategies: "generateSW",
      registerType: "autoUpdate",
      // Manifest is defined here as the single source of truth.
      // No separate public/manifest.webmanifest.
      manifest: {
        name: "37NDEST",
        short_name: "37NDEST",
        description:
          "A focused Japanese conversation trainer for two users preparing for a mission trip.",
        start_url: "/37ndest/",
        display: "standalone",
        background_color: "#0b1020",
        theme_color: "#0b1020",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      // Minimal workbox config — precache static assets only.
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
      },
    }),
  ],
});
