import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Enigma 5789 — World Observer',
        short_name: 'Enigma5789',
        description: 'Evidence-Centered Geopolitical Observation, Scenario Branching, and Cognitive Mentorship Engine',
        theme_color: '#07090e',
        background_color: '#07090e',
        display: 'standalone',
        orientation: 'portrait-primary'
      }
    })
  ],
  server: {
    port: 3000,
    host: true
  }
});
