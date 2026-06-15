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
  build: {
    outDir: 'dist',
    commonjsOptions: {
      exclude: [/node_modules\/three/],
      include: [/node_modules/]
    }
  }
})
