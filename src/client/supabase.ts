import { createClient } from '@supabase/supabase-js';

export function createBrowserSupabaseClient(url: string, anonKey: string) {
  return createClient(url, anonKey, {
    auth: { persistSession: false },
    realtime: { params: { eventsPerSecond: 2 } },
  });
}
