/**
 * Podcast Service
 * Handles loading and formatting podcast episode data
 */

import type { PodcastEpisode } from '../types/podcast';

/**
 * Load podcast episodes for a given locale
 * @param locale - Language/locale code ('en', 'es', 'ja')
 * @returns Promise with array of podcast episodes
 */
export async function loadPodcastEpisodes(locale: string): Promise<PodcastEpisode[]> {
  try {
    const episodes = await import(`../data/podcast/episodes-${locale}.json`);
    return episodes.default || episodes;
  } catch (error) {
    console.error(`Failed to load podcast episodes for locale: ${locale}`, error);
    // Fallback to Spanish if the locale doesn't exist
    const fallbackEpisodes = await import(`../data/podcast/episodes-es.json`);
    return fallbackEpisodes.default || fallbackEpisodes;
  }
}

/**
 * Format date for display
 * @param dateString - Date in YYYY-MM-DD format
 * @param locale - Language/locale code
 * @returns Formatted date string
 */
export function formatEpisodeDate(dateString: string, locale: string = 'es'): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return date.toLocaleDateString(locale, options);
}
