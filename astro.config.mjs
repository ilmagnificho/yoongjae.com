import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import rehypeExternalLinks from 'rehype-external-links';

export default defineConfig({
  site: 'https://yoongjae.com',
  integrations: [tailwind(), react()],
  output: 'static',
  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },
});
