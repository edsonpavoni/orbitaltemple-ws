import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://orbitaltemple.art',
  integrations: [react(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },

  server: { host: true },
  vite: {
    server: {
      allowedHosts: ['.ngrok-free.dev'],   // any ngrok URL
      hmr: { clientPort: 443 }
    }
  }
});