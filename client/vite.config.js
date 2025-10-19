import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    allowedHosts: [
      'frontend-production-e939.up.railway.app',
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
    ],
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
