import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  server: {
    port: 3000
  }
})
