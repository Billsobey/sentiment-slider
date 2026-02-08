import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'demo',
  publicDir: '../assets',
  build: {
    outDir: '../docs',
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      'sentiment-slider': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
});
