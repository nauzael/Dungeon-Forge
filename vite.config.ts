import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/database', 'firebase/storage', 'firebase/functions'],
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    // HMR configuration for better dev experience
    hmr: {
      protocol: 'http',
      host: 'localhost',
      port: 5173,
    },
    // Watch configuration - more robust file watcher
    watch: {
      usePolling: true,
      interval: 100,
      batchTimeout: 100,
    }
  }
})

