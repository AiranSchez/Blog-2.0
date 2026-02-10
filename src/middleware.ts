import { defineMiddleware } from 'astro:middleware';
import { defaultLang, type Language } from './i18n/utils';

const locales = ['en', 'es', 'ja'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { url } = context;
  const pathname = url.pathname;

  // If already has a locale prefix, continue
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return next();
  }

  // For static build, just pass through - client-side handles redirects
  // This prevents warnings about accessing headers in prerendered pages
  return next();
});
