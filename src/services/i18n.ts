/**
 * I18n Service
 * Centralized internationalization logic
 */

import { languages, ui, type Language } from '../i18n/translations';

export type SupportedLocale = 'en' | 'es' | 'ja';

export const SUPPORTED_LOCALES: SupportedLocale[] = ['en', 'es', 'ja'];
export const DEFAULT_LOCALE: SupportedLocale = 'en';

// Re-export from translations
export { languages };
export type { Language };
export const defaultLang: Language = DEFAULT_LOCALE;

/**
 * Check if a locale is supported
 * @param locale - Locale to check
 * @returns True if supported
 */
export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

/**
 * Get locale from URL
 * @param url - URL object
 * @returns Language from URL or default
 */
export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Language;
  return defaultLang;
}

/**
 * Get locale from path
 * @param path - URL path
 * @returns Locale or default
 */
export function getLocaleFromPath(path: string): SupportedLocale {
  const match = path.match(/^\/([a-z]{2})\//);
  const locale = match?.[1];
  return locale && isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
}

/**
 * Build localized path
 * @param locale - Target locale
 * @param path - Path without locale prefix
 * @returns Localized path
 */
export function buildLocalizedPath(locale: SupportedLocale, path: string = ''): string {
  return `/${locale}${path}`;
}

/**
 * Get browser language preference
 * @returns Browser's preferred locale or default
 */
export function getBrowserLocale(): SupportedLocale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;
  
  const browserLang = navigator.language.substring(0, 2);
  return isSupportedLocale(browserLang) ? browserLang : DEFAULT_LOCALE;
}

/**
 * Get translations function for a language
 * @param lang - Target language
 * @returns Translation function
 */
export function useTranslations(lang: Language) {
  return function t(key: keyof typeof ui[Language]): string {
    const translations = ui[lang];
    return translations[key] || key;
  };
}
