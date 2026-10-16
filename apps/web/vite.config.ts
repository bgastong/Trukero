import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Permite entrar por un túnel de Cloudflare para jugar con alguien de afuera.
    allowedHosts: ['.trycloudflare.com'],
    // Con --host otros dispositivos de la red entran por tu IP; el socket pasa por el mismo puerto.
    proxy: {
      '/socket.io': { target: 'http://localhost:3001', ws: true },
    },
  },
});
