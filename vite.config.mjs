import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'


export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    css: true,
  },
  server: {
    host: true, // permite acesso externo
    port: parseInt(process.env.FRONTEND_PORT) || 5173,
    strictPort: true,
    watch: {
      usePolling: true, //necessario para ambiente Docker
    },
  },
  resolve: {
    alias: {
      'red-shared': '/red-shared',
    },
  },
});
