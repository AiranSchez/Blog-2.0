import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Memoization cache for cn() function
 * Dramatically improves performance by caching class string results
 */
const cnCache = new Map<string, string>();
const MAX_CACHE_SIZE = 500;

/**
 * Utility function to merge Tailwind CSS classes with clsx
 * Handles conflicts intelligently using tailwind-merge
 * Now with LRU cache for performance
 * 
 * @example
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4'
 * cn('text-red-500', condition && 'text-blue-500') // => conditional merge
 */
export function cn(...inputs: ClassValue[]) {
  // Create cache key from inputs
  const key = JSON.stringify(inputs);
  
  // Check cache first
  if (cnCache.has(key)) {
    return cnCache.get(key)!;
  }
  
  // Compute result
  const result = twMerge(clsx(inputs));
  
  // Store in cache (with LRU eviction)
  if (cnCache.size >= MAX_CACHE_SIZE) {
    // Remove oldest entry
    const firstKey = cnCache.keys().next().value;
    cnCache.delete(firstKey);
  }
  cnCache.set(key, result);
  
  return result;
}
