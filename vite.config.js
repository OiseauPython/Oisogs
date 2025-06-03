import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement
  const env = loadEnv(mode, process.cwd(), '')

  // Déterminer si on est en production
  const isProduction = mode === 'production'

  // Définir la base URL pour GitHub Pages
  const base = isProduction ? '/Oisogs/' : '/'

  return {
    plugins: [vue()],
    base: base,

    // Configuration du serveur de développement
    server: {
      port: 3000,
      strictPort: true,
      open: false,
    },

    // Configuration des alias pour les imports
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        vue: 'https://esm.sh/vue@3',
        pinia: 'https://esm.sh/pinia@2.1.7',
      },
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

    // Configuration de la construction
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: false,
      minify: isProduction ? 'terser' : false,
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        external: ['vue', 'pinia'],
        output: {
          entryFileNames: 'assets/js/[name]-[hash].js',
          chunkFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash][ext]',
          globals: {
            vue: 'Vue',
            pinia: 'Pinia'
          },
        },
      },
    },

    // Configuration pour le préfixe des assets
    experimental: {
      renderBuiltUrl(filename) {
        return { relative: true }
      },
    },
  }
})
