import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement
  const env = loadEnv(mode, process.cwd(), '')

  // Déterminer si on est en production
  const isProduction = mode === 'production'

  return {
    plugins: [
      vue(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'logo.svg', 'apple-touch-icon-180x180.png'],
        manifest: {
          name: 'Oisogs',
          short_name: 'Oisogs',
          description: 'Visualisez et explorez votre collection Discogs',
          theme_color: '#1c2150',
          background_color: '#1c2150',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          icons: [
            { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
            { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
            { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,ttf,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/.*\.netlify\.app\/.netlify\/functions\//,
              handler: 'NetworkFirst',
              options: { cacheName: 'discogs-api', networkTimeoutSeconds: 10 },
            },
          ],
        },
      }),
    ],

    base: '/',

    // Configuration des alias pour les imports
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    // Configuration pour le serveur de développement
    server: {
      port: 3000,
      strictPort: true,
      open: false,
      hmr: true,
      host: true,
      proxy: {
        '/.netlify/functions': {
          target: 'https://tourmaline-valkyrie-c86344.netlify.app',
          changeOrigin: true,
        },
      },
    },

    // Configuration CSS/SCSS
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "sass:math";
            @use "@/assets/mixin" as *;
            @use "@/assets/tokens" as *;
          `,
        },
      },
    },

    // Configuration pour les assets statiques
    publicDir: 'public',
    assetsInclude: ['**/*.ttf', '**/*.woff', '**/*.woff2'],

    // Configuration de la construction
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: isProduction ? false : true,
      minify: isProduction ? 'terser' : false,
      chunkSizeWarningLimit: 1600,
    },
  }
})
