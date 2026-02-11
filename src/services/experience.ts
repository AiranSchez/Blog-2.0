/**
 * Experience Service
 * Handles business logic for experience data (calculations, transformations, mappings)
 */

/**
 * Calculate duration between two dates
 * @param startDate - Start date in YYYY-MM format
 * @param endDate - End date in YYYY-MM format, or null for "Present"
 * @param lang - Language for formatting ('en', 'es', 'ja')
 * @returns Formatted duration string (e.g., "1 year 3 months")
 */
export function calculateDuration(
  startDate: string,
  endDate: string | null,
  lang: string = 'en'
): string {
  const [startYear, startMonth] = startDate.split('-').map(Number);
  
  const start = new Date(startYear, startMonth - 1);
  const end = endDate 
    ? new Date(...endDate.split('-').map(Number)) 
    : new Date();

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
  
  const years = Math.floor(diffMonths / 12);
  const months = diffMonths % 12;

  // Translations
  const translations: Record<string, { year: string; years: string; month: string; months: string }> = {
    en: { year: 'year', years: 'years', month: 'month', months: 'months' },
    es: { year: 'año', years: 'años', month: 'mes', months: 'meses' },
    ja: { year: '年', years: '年', month: 'ヶ月', months: 'ヶ月' },
  };

  const t = translations[lang] || translations.en;

  if (years === 0) {
    return `${months} ${months === 1 ? t.month : t.months}`;
  }

  if (months === 0) {
    return `${years} ${years === 1 ? t.year : t.years}`;
  }

  return `${years} ${years === 1 ? t.year : t.years} ${months} ${months === 1 ? t.month : t.months}`;
}

/**
 * Format date according to locale
 * @param dateStr - Date in YYYY-MM format
 * @param lang - Language code ('en', 'es', 'ja')
 * @returns Formatted date (e.g., "Jan 2023")
 */
export function formatDate(dateStr: string, lang: string = 'en'): string {
  const [year, month] = dateStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'short' }).format(date);
}

/**
 * Get "Present" text based on language
 * @param lang - Language code
 * @returns Localized "Present" text
 */
export function getPresentText(lang: string): string {
  const translations: Record<string, string> = {
    en: 'Present',
    es: 'Actualidad',
    ja: '現在',
  };
  return translations[lang] || translations.en;
}
