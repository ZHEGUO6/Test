import { fileURLToPath, URL } from 'node:url'
import { BASE_URL } from './src/config/env'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: BASE_URL,
        changeOrigin: true
      }
    }
  }
})
