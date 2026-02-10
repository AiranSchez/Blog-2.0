import { defineMiddleware } from 'astro:middleware';
import { defaultLang, type Language } from './i18n/utils';

const locales = ['en', 'es', 'ja'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, redirect } = context;
  const pathname = url.pathname;

  // If already has a locale prefix, continue
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return next();
  }

  // Detect language from Accept-Language header
  const acceptLanguage = context.request.headers.get('accept-language');
  let detectedLang: Language = defaultLang;

  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(',')
      .map((lang) => {
        const [code] = lang.split(';');
        return code.trim().toLowerCase().substring(0, 2);
      });

    for (const lang of languages) {
      if (locales.includes(lang)) {
        detectedLang = lang as Language;
        break;
      }
    }
  }

  // Redirect root to detected language
  if (pathname === '/') {
    return redirect(`/${detectedLang}/`, 302);
  }

  // Redirect other paths to detected language
  return redirect(`/${detectedLang}${pathname}`, 302);
});
