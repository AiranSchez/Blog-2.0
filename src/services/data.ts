/**
 * Data Service
 * Utilities for loading and transforming data files
 */

/**
 * Load JSON data files dynamically
 * @param path - Path to JSON file
 * @returns Parsed JSON data
 */
export async function loadJsonData<T>(path: string): Promise<T> {
  try {
    const module = await import(/* @vite-ignore */ path);
    return module.default as T;
  } catch (error) {
    console.error(`Failed to load JSON from ${path}:`, error);
    throw error;
  }
}

/**
 * Load localized data
 * @param basePath - Base path without locale suffix (e.g., 'data/about')
 * @param locale - Locale code ('en', 'es', 'ja')
 * @param extension - File extension (default: '.json')
 * @returns Localized data
 */
export async function loadLocalizedData<T>(
  basePath: string,
  locale: string,
  extension: string = '.json'
): Promise<T> {
  const path = `${basePath}-${locale}${extension}`;
  return loadJsonData<T>(path);
}

/**
 * Map array data with index
 * @param data - Array of data items
 * @param mapper - Mapping function
 * @returns Mapped array
 */
export function mapWithIndex<T, U>(
  data: T[],
  mapper: (item: T, index: number) => U
): U[] {
  return data.map(mapper);
}
