import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true,
                type: 'module',
            },
            manifest: {
                name: 'ZERO FASHION',
                short_name: 'Z-F',
                description: 'A React PWA using Vite',
                theme_color: '#000000',
                background_color: '#ffffff',
                display: 'standalone',
                start_url: '/',
                scope: '/',
                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any maskable'
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 
                            },
                            cacheKeyWillBeUsed: async ({ request }) => {
                                return `${request.url}`;
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/checkout\.razorpay\.com\/.*/i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'razorpay-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 
                            }
                        }
                    }
                ]
            },
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        }),
    ],
    server: { port: 5173 },
});
