import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // permite acesso externo
    port: parseInt(process.env.FRONTEND_PORT) || 5173,
    strictPort: true,
    watch: {
      usePolling: true, //necessario para ambiente Docker
    },
  },
});