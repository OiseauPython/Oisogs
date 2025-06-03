import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  // Configuration pour GitHub Pages
  const base = mode === 'production' ? '/Oisogs/' : '/';
  
  return {
    plugins: [vue(), vueJsx()],
    base: base,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "sass:math";
            @use "@/assets/variables" as *;
            @use "@/assets/mixin" as *;
          `
        }
      }
    },
    define: {
      'process.env': {}
    },
    build: {
      target: 'esnext',
      sourcemap: false,
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia']
          }
        }
      }
    },
    server: {
      port: 3000,
      strictPort: true
    }
  }
})
