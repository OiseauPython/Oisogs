import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [vue(), vueJsx()],
    base: env.NODE_ENV === 'production' ? '/Oisogs/' : '/',
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
