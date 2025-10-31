import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: './',

  build: {
    outDir: './apiserver/dist',
    chunkSizeWarningLimit: 2000,
  },

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:1991/",
        changeOrigin: true,
        secure: false,
      },
    },
    allowedHosts: []
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
    },
  },

  plugins: [
    react(),
    tailwindcss()
  ],
})
