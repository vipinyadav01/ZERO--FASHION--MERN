import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true,
            },
            injectRegister: 'auto',
            manifest: {
                name: 'ZERO FASHION',
                short_name: 'Z-F',
                description: 'Zero Fashion is a platform for buying fashion products online with a wide range of products.',
                theme_color: '#000000',
                background_color: '#ffffff',
                display: 'standalone',
                start_url: '/',
                scope: '/',
                id: '/',
                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'maskable'
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable'
                    }
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
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'cloudinary-images-cache',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                            }
                        }
                    }
                ]
            },
            includeAssets: ['zero.ico', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
        }),
    ],
    server: { port: 5173 },
});
