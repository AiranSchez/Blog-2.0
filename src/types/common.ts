/**
 * Common Types
 * Shared type definitions across the application
 */

export type Locale = 'en' | 'es' | 'ja';

export interface LocalizedContent {
  locale: Locale;
  [key: string]: unknown;
}

export interface ComponentBaseProps {
  className?: string;
  id?: string;
}

export interface AnimationProps {
  delay?: number;
  duration?: number;
  variant?: string;
}
