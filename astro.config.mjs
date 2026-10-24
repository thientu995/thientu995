// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://cv.t4vn.com',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: {
    format: 'directory',
  },
});
