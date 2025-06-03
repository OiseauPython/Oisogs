import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '')
  
  // Set base URL for GitHub Pages
  const isProduction = mode === 'production'
  // Prioritize VITE_BASE_URL from environment (e.g., .env file or CI variable)
  // Fallback to '/Oisogs/' for production mode if VITE_BASE_URL is not set
  // Fallback to '/' for development mode if VITE_BASE_URL is not set
  const base = env.VITE_BASE_URL || (isProduction ? '/Oisogs/' : '/')

  

  
  return {
    plugins: [
      vue(),
      vueJsx()
    ],
    base: base,
    publicDir: 'public',
    define: {
      'import.meta.env.BASE_URL': JSON.stringify(base)
    },
    server: {
      host: true,
      port: 3000,
      strictPort: true,
      open: false
    },
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
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: false,
      minify: isProduction ? 'terser' : false,
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      } : {},
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        input: fileURLToPath(new URL('./index.html', import.meta.url)),
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      }
    },
    server: {
      port: 3000,
      strictPort: true
    }
  }
})
