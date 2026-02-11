/**
 * I18n Module - Barrel Export
 * Centralized internationalization imports
 */

// Re-export everything from translations
export * from './translations';

// Re-export services (but they already import from translations)
// Components should import from services/i18n for functions
