// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import legacyRoutes from './src/data/blog-legacy-routes.json';

// https://astro.build/config
export default defineConfig({
  redirects: Object.fromEntries(legacyRoutes.filter(route => route.oldPath !== route.newPath)
    .map(route => [route.oldPath, { status: 301, destination: route.newPath }])),
  site: 'https://airanschez.tech', // Update with your actual domain
  integrations: [
    tailwind({
      applyBaseStyles: false, // We're using our own global.css
    }),
    mdx(), 
    sitemap({
      filter: (url) => !legacyRoutes.some(route => route.oldPath !== route.newPath && decodeURI(new URL(url).pathname) === route.oldPath),
    }),
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
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true
    }
  }
});
