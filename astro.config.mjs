// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'http://localhost:4321',
  output: 'server',
  adapter: cloudflare(),
  // Auth memakai cookie + tabel Session di D1, jadi driver session bawaan tidak dipakai.
  session: false,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx()],
});
