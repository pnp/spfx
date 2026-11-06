import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pnp.github.io',
  base: '/spfx',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
