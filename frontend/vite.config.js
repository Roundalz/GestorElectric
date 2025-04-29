import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@context': path.resolve(__dirname, './src/context')
    }
  },
  server: {
    proxy: {
      '/api/inventario': {
        target: 'http://localhost:5000',   // o el host real de tu servicio inventario
        changeOrigin: true,
        secure: false,
        // opcionalmente reescribe la ruta (aquí no cambia nada)
        rewrite: path => path.replace(/^\/api\/inventario/, '/api/inventario')
      }
    }
  },
})
