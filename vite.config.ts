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
    minify: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor';
          if (id.includes('node_modules/firebase')) return 'firebase';
          if (id.includes('/Data/')) return 'game-data';
          if (id.includes('/utils/sheetUtils.ts')) return 'sheet-utils';
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

