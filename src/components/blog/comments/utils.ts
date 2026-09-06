/**
 * Comments Utilities
 * Canonical slug derivation, relative time formatting, localStorage reaction helpers
 */
import type { ReactionType } from '../../../types/comments';

/**
 * Formats a UTC ISO timestamp as a human-readable relative time string.
 * Uses Intl.RelativeTimeFormat for locale-aware output.
 */
export function formatRelativeTime(isoString: string, locale: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (Math.abs(diffSecs) < 60) return rtf.format(diffSecs, 'second');
  if (Math.abs(diffMins) < 60) return rtf.format(diffMins, 'minute');
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, 'hour');
  return rtf.format(diffDays, 'day');
}

const REACTIONS_PREFIX = 'reactions:';

/**
 * Reads the set of reactions the current user has given to a comment from localStorage.
 * Returns empty Set if localStorage is unavailable (SSR safety).
 */
export function getLocalReactions(commentId: string): Set<ReactionType> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(`${REACTIONS_PREFIX}${commentId}`);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as ReactionType[];
    return new Set(parsed);
  } catch {
    return new Set();
  }
}

/**
 * Toggles a reaction in localStorage for a comment.
 * Returns true if the reaction was ADDED, false if REMOVED.
 */
export function toggleLocalReaction(commentId: string, reaction: ReactionType): boolean {
  const current = getLocalReactions(commentId);
  let added: boolean;
  if (current.has(reaction)) {
    current.delete(reaction);
    added = false;
  } else {
    current.add(reaction);
    added = true;
  }
  try {
    localStorage.setItem(`${REACTIONS_PREFIX}${commentId}`, JSON.stringify([...current]));
  } catch {
    // localStorage full or unavailable — silently fail
  }
  return added;
}
