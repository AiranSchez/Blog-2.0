/**
 * Supabase Clients
 * - supabaseAdmin: service role (server-side API routes only, NEVER in browser)
 * - createBrowserSupabaseClient: anon key client for browser Realtime (created in React component with props)
 */
import { createClient } from '@supabase/supabase-js';

// Server-side only — accessed via import.meta.env in API routes
export function getSupabaseAdmin() {
  const url = import.meta.env.SUPABASE_URL as string;
  const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string;
  if (!url || !key) throw new Error('Missing Supabase server env vars');
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * Browser-safe Supabase client for Realtime subscriptions.
 * Call this in React components with url/anonKey passed as props from the Astro page.
 */
export function createBrowserSupabaseClient(url: string, anonKey: string) {
  return createClient(url, anonKey, {
    auth: { persistSession: false },
    realtime: { params: { eventsPerSecond: 2 } },
  });
}
