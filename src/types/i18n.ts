/**
 * I18n Types
 * Type definitions for internationalization system
 */

export type SupportedLocale = 'en' | 'es' | 'ja';

export interface I18nConfig {
  defaultLocale: SupportedLocale;
  locales: SupportedLocale[];
  routing: {
    prefixDefaultLocale: boolean;
    redirectToDefaultLocale: boolean;
  };
}

export interface TranslationKeys {
  [key: string]: string | TranslationKeys;
}

export interface LocaleData<T> {
  locale: SupportedLocale;
  data: T;
}
