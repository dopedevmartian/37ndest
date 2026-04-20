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
                description: "A focused Japanese conversation trainer for two users preparing for a mission trip.",
                start_url: "/37ndest/",
                display: "standalone",
                // V2 visual-system metadata alignment (Phase 2).
                // Manifest accepts a single value — light palette used.
                // Dual light/dark theme-color is handled via meta tags in index.html.
                background_color: "#f5efe4",
                theme_color: "#f5efe4",
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
