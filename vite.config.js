import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'three': 'three'
    }
  },
  define: {
    'process.env': {},
    'global': 'window'
  },
  optimizeDeps: {
    include: ['three', 'react-globe.gl']
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      external: [] // Ensure three is bundled
    }
  }
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'three': 'three'
    }
  },
  define: {
    'process.env': {},
    'global': 'window'
  },
  optimizeDeps: {
    include: ['three', 'react-globe.gl']
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      external: [] // Ensure three is bundled
    }
  }
})
