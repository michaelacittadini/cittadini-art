// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL is set by the deploy workflow (preview vs production).
const site = process.env.SITE_URL || 'https://cittadini.art';

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  image: {
    // Full-resolution originals may later live in Cloudflare R2; allow optimising them.
    remotePatterns: [{ protocol: 'https', hostname: '**.r2.dev' }, { protocol: 'https', hostname: 'img.cittadini.art' }],
  },
  build: { inlineStylesheets: 'auto' },
});
