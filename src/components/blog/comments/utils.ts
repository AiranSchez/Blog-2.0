/**
 * Comments Utilities
 * Canonical slug derivation, relative time formatting, localStorage reaction helpers
 */
import type { ReactionType } from '../../../types/comments';

/**
 * Derives a canonical article slug from Astro's entry.id.
 * Strips locale prefix and locale suffix so all language variants map to the same key.
 * e.g. "en/csrf-xss-cors.en" → "csrf-xss-cors"
 * e.g. "es/mi-articulo.es" → "mi-articulo"
 */
export function toCanonicalSlug(entryId: string): string {
  return entryId
    .replace(/^(en|es|ja)\//, '')
    .replace(/\.(en|es|ja)$/, '');
}

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

/**
 * Sanitizes user content: strips HTML tags to prevent XSS.
 * Used server-side before storing to Supabase.
 */
export function sanitizeContent(content: string): string {
  return content.replace(/<[^>]*>/g, '').trim();
}

/**
 * Hashes a string using SHA-256 (browser/Edge compatible via crypto.subtle).
 * Used for IP address hashing before storage — no raw IPs ever stored.
 */
export async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Builds a nested comment tree from a flat list.
 * Root comments (parent_id = null) get a `replies` array of their children.
 */
export function buildCommentTree(flatComments: import('../../../types/comments').Comment[]): import('../../../types/comments').CommentWithReplies[] {
  const roots: import('../../../types/comments').CommentWithReplies[] = [];
  const map = new Map<string, import('../../../types/comments').CommentWithReplies>();

  // First pass: create all nodes
  for (const c of flatComments) {
    map.set(c.id, { ...c, replies: [] });
  }

  // Second pass: attach children to parents
  for (const node of map.values()) {
    if (node.parent_id && map.has(node.parent_id)) {
      map.get(node.parent_id)!.replies.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
