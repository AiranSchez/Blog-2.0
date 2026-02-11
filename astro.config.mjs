// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://airanschez.tech', // Update with your actual domain
  integrations: [
    tailwind({
      applyBaseStyles: false, // We're using our own global.css
    }),
    mdx(), 
    sitemap(),
    react()
  ],
  adapter: vercel({
    webAnalytics: {
      enabled: false
    }
  }),
  output: 'static',
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'ja'],
    routing: {
      prefixDefaultLocale: true
    }
  }
});
