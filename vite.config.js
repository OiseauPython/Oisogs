import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement
  const env = loadEnv(mode, process.cwd(), '')

  // Déterminer si on est en production
  const isProduction = mode === 'production'

  return {
    plugins: [vue()],

    // Base URL pour GitHub Pages
    base: '/Oisogs/',

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
    },

    // Configuration CSS/SCSS
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "sass:math";
            @use "@/assets/variables" as *;
            @use "@/assets/mixin" as *;
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
